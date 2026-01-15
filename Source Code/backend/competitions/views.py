from django.shortcuts import redirect, get_object_or_404
from django.conf import settings
from django.http import HttpResponseForbidden, HttpResponse, JsonResponse
from django.db import transaction
from .models import Competition, Appearance, Grade, CompetitionJudge, \
                    StatusChoices, AgeCategory, StyleCategory, GroupSizeCategory, MediaFile
from .utils import generate_starting_list_pdf, generate_results, generate_grades
from users.models import User, Role
from users.decorators import role_required
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import status
import uuid
from rest_framework.permissions import AllowAny
import json
import boto3
from users.paypal_orders import create_paypal_order
import requests
from users.paypal import get_paypal_access_token
from django.utils.dateparse import parse_duration
from datetime import timedelta




def competition_live(request):
    data = []
    if Competition.objects.exists():
        for competition in Competition.objects.all():
            data.append({
            'name': competition.name,
            'organizer': competition.organizer.first_name or competition.organizer.username,
            'date': competition.date,
            'location': competition.location,
            'registration_fee': competition.registration_fee,
            'age_categories': [cat.get_name_display() for cat in competition.age_categories.all()],
            'style_categories': [cat.get_name_display() for cat in competition.style_categories.all()],
            'group_size_categories': [cat.get_name_display() for cat in competition.group_size_categories.all()],
            'id': competition.id
        })
    
        return JsonResponse(data, safe=False, status=200)
    else:
        return JsonResponse({'message':'Nema natjecanja!'}, status=200)


@api_view(['POST']) 
@permission_classes([IsAuthenticated]) 
def competition_create(request):
    if request.user.role != 'ORGANIZER':
        return Response({"error": "Samo organizatori mogu kreirati natjecanja"}, status=403)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    try:
        with transaction.atomic():
            competition = Competition.objects.create(
                name=data.get('name'),
                organizer=request.user,
                date=data.get('date'),
                location=data.get('location'),
                description=data.get('description'),
                registration_fee=data.get('registration_fee'),
                status=StatusChoices.DRAFT
            )

            age_categories = data.get('age_categories', []) 
            age_category_ids = [] 
            for cat in age_categories: 
                id = AgeCategory.objects.get(name=cat).id 
                age_category_ids.append(id) 
            competition.age_categories.set(age_category_ids) 
            
            style_categories = data.get('style_categories', []) 
            style_category_ids = [] 
            for cat in style_categories: 
                id = StyleCategory.objects.get(name=cat).id 
                style_category_ids.append(id) 
            competition.style_categories.set(style_category_ids) 
                
            group_size_categories = data.get('group_size_categories', []) 
            group_size_category_ids = [] 
            for cat in group_size_categories: 
                id = GroupSizeCategory.objects.get(name=cat).id 
                group_size_category_ids.append(id) 
            competition.group_size_categories.set(group_size_category_ids)

            return Response({'message': 'Natjecanje kreirano!', 'id': competition.id}, status=201)
        
    except Exception as e:
        return Response({'error': str(e)}, status=500)


def competition_detail(request, id):
    competition = get_object_or_404(Competition, id=id)
    appearances = Appearance.objects.get(competition=competition)
    return HttpResponse(appearances)


@role_required(Role.ORGANIZER)
def competition_edit(request, id):
    competition = get_object_or_404(Competition, id=id)

    if competition.organizer != request.user:
        return HttpResponseForbidden("Pristup zabranjen.")

    if request.method == 'POST':
        for field in Competition._meta.fields:
            attr = field.name  
            if attr in ['id', 'status']:
                continue
            if request.POST.get(attr):
                setattr(competition, attr, request.POST.get(attr))

        competition.status = StatusChoices.DRAFT       
        competition.save()
        return HttpResponse(competition)

    return HttpResponse("Prepravi.html")


@api_view(['POST']) 
@permission_classes([IsAuthenticated]) 
def competition_publish(request, id):
    competition = get_object_or_404(Competition, id=id)
    print(request.user)
    if competition.organizer != request.user:
        return HttpResponseForbidden("Pristup zabranjen.")

    if request.method == 'POST':
        competition.status = StatusChoices.PUBLISHED
        competition.save()
        return HttpResponse(competition)

    return HttpResponse("Objavi.html")


@api_view(['POST']) 
@permission_classes([IsAuthenticated]) 
def competition_close_applications(request, id):
    competition = get_object_or_404(Competition, id=id)

    if competition.organizer != request.user:
        return HttpResponseForbidden("Pristup zabranjen.")
    
    if competition.status != StatusChoices.PUBLISHED:
        return HttpResponseForbidden("Natjecanje nije objavljeno.")

    if request.method == 'POST':
        competition.status = StatusChoices.CLOSED_APPLICATIONS
        competition.save()
        name = generate_starting_list_pdf(competition)
        return HttpResponse(name)

    return HttpResponse("Zatvori prijave.html")


@api_view(['GET']) 
@permission_classes([IsAuthenticated])
def competition_starting_list(request, id):
    competition = get_object_or_404(Competition, id=id)

    allowed_users = set()
    allowed_users.add(competition.organizer.id)
    admins = (
        User.objects.filter(role=Role.ADMIN)
        .values_list('id', flat=True)
    )
    allowed_users.update(admins)
    club_managers = (
        Appearance.objects.filter(competition=competition)
        .values_list('club_manager', flat=True)
    )
    allowed_users.update(club_managers)
    judges = (
        CompetitionJudge.objects.filter(competition=competition)
        .values_list('judge', flat=True)
    )
    allowed_users.update(judges)

    if request.user.id not in allowed_users:
        return HttpResponseForbidden("Pristup zabranjen.")

    return redirect(competition.starting_list.file.url)


@role_required(Role.ORGANIZER)
def competition_invite_judge(request, id):
    competition = get_object_or_404(Competition, id=id)

    if competition.organizer != request.user:
        return HttpResponseForbidden("Pristup zabranjen.")
    
    if competition.status != StatusChoices.PUBLISHED:
        return HttpResponseForbidden("Natjecanje nije objavljeno.")

    if request.method == 'POST':
        email = request.POST.get('email')
        if not User.objects.filter(email=email).exists():
            return HttpResponse("Mail.html")
        user = User.objects.get(email=email)
        if user.role != 'JUDGE':
            return HttpResponseForbidden("Korisnik nije sudac.")
        CompetitionJudge = CompetitionJudge(
            competition=competition,
            judge=user
        )
        CompetitionJudge.save()
        return HttpResponse(CompetitionJudge)

    return HttpResponse("Pozovi suca.html")


@role_required(Role.ORGANIZER)
def competition_activate(request, id):
    competition = get_object_or_404(Competition, id=id)

    if competition.organizer != request.user:
        return HttpResponseForbidden("Pristup zabranjen.")

    if request.method == 'POST':
        if not CompetitionJudge.objects.filter(competition=competition).exists():
            return HttpResponseForbidden("Nema sudaca.")
        if CompetitionJudge.objects.filter(competition=competition).count() / 2 == 1:
            return HttpResponseForbidden("Broj sudaca je paran.")
        competition.status = StatusChoices.ACTIVE
        competition.save()
        return HttpResponse(competition)

    return HttpResponse("Aktiviraj.html")


@role_required(Role.ORGANIZER)
def competition_deactivate(request, id):
    competition = get_object_or_404(Competition, id=id)

    if competition.organizer != request.user:
        return HttpResponseForbidden("Pristup zabranjen.")

    if request.method == 'POST':
        competition.status = StatusChoices.PUBLISHED
        competition.save()
        return HttpResponse(competition)

    return HttpResponse("Ugasi.html")


@role_required(Role.JUDGE)
def competition_grade(request, competition_id, appearance_id):
    competition = get_object_or_404(Competition, id=competition_id)
    appearance = get_object_or_404(Appearance, id=appearance_id)

    if request.method == 'POST':
        if competition.status != StatusChoices.ACTIVE:
            return HttpResponseForbidden("Natjecanje nije aktivno.")
        
        if not CompetitionJudge.objects.filter(competition=competition, judge=request.user).exists():
            return HttpResponseForbidden("Pristup zabranjen.")
        
        appearance_grade = request.POST.get('grade')
        grade = Grade(
            judge=request.user,
            appearance=appearance,
            grade=appearance_grade
        )
        grade.save()

        return HttpResponse(grade)
    
    return HttpResponse("Ocijeni.html")


@role_required(Role.ORGANIZER)
def competition_complete(request, id):
    competition = get_object_or_404(Competition, id=id)

    if competition.organizer != request.user:
        return HttpResponseForbidden("Pristup zabranjen.")

    if request.method == 'POST':
        competition.status = StatusChoices.COMPLETED
        competition.save()
        return HttpResponse(competition)

    return HttpResponse("Završi.html")


def competition_results(request, id):
    competition = get_object_or_404(Competition, id=id)
    if competition.status != StatusChoices.COMPLETED:
        return HttpResponseForbidden("Natjecanje nije gotovo.")
    
    results = generate_results(competition)

    return JsonResponse(results)


@role_required(Role.CLUB_MANAGER)
def competition_appearance_results(request, competition_id, appearance_id):
    competition = get_object_or_404(Competition, id=competition_id)
    if competition.status != StatusChoices.COMPLETED:
        return HttpResponseForbidden("Natjecanje nije gotovo.")
    
    appearance = get_object_or_404(Appearance, id=appearance_id)
    
    #if appearance.club_manager != request.user:
    #    return HttpResponseForbidden("Pristup zabranjen")
    
    grades = generate_grades(appearance)

    return JsonResponse(grades)


@role_required(Role.CLUB_MANAGER)
@role_required(Role.CLUB_MANAGER)
def competition_signup(request, id):
    competition = get_object_or_404(Competition, id=id)

    if request.method == 'POST':
        if competition.status != StatusChoices.PUBLISHED:
            return HttpResponseForbidden("Prijava nije moguća.")

        
        try:
            appearance = _create_appearance_from_request(request, competition)
        except ValueError as e:
            return HttpResponseForbidden(str(e))

        
        appearance.save()
        return HttpResponse(appearance)

    return HttpResponse("Prijavi nastup.html")



@api_view(['POST'])
@permission_classes([AllowAny])
def send_judge_invite(request):
    email = request.data.get('email')

    if not email:
        return Response(
            {"detail": "Email is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    token = uuid.uuid4()
    invite_link = "https://dancearena.netlify.app/login"

    send_mail(
        subject="Judge Registration Invitation",
        message=(
            "Hello,\n\n"
            "You have been invited to register as a judge on Dance Arena.\n"
            "Please use the link below to register:\n\n"
            f"{invite_link}\n\n"
            "Best regards,\n"
            "Dance Arena Team"
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
    )

    return Response(
        {"detail": "Invitation email sent"},
        status=status.HTTP_200_OK
    )
def generate_s3_url(file_path, link_type='view'):
    s3_client = boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME,
    )

    if link_type == 'download':
        disposition = 'attachment'
    else:
        disposition = 'inline' 

    try:
        url = s3_client.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': settings.AWS_STORAGE_BUCKET_NAME,
                'Key': file_path,
                'ResponseContentDisposition': disposition,
            },
            ExpiresIn=3600 
        )
        return url
    except Exception as e:
        print(f"Error generating URL: {e}")
        return None


def download_media(request, file_id):
    media_item = get_object_or_404(MediaFile, id=file_id)
    
    action_type = 'view' 
    if media_item.file_type == 'mp3':
        action_type = 'download'
    elif request.GET.get('force_download'):
        action_type = 'download'

    s3_url = generate_s3_url(media_item.file.name, link_type=action_type)

    return redirect(s3_url)




@api_view(['POST'])
@permission_classes([AllowAny])
def create_entry_order(request, id):
    competition = get_object_or_404(Competition, id=id)

    if request.user.role != Role.CLUB_MANAGER:
        return Response({"error": "Only club managers can register."}, status=403)

    amount = competition.registration_fee
    order = create_paypal_order(
        amount=float(amount),
        currency="EUR",
        description=f"Entry fee for competition {competition.name}"
    )
    return Response(order)

def capture_paypal_order(order_id):
    access_token = get_paypal_access_token()
    url = f"https://api-m.sandbox.paypal.com/v2/checkout/orders/{order_id}/capture"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
    }
    resp = requests.post(url, headers=headers)
    resp.raise_for_status()
    return resp.json()

@api_view(['POST'])
@permission_classes([AllowAny])   
def confirm_entry(request, competition_id):
    user = request.user

    
    order_id = request.data.get("orderID")
    choreography = request.data.get("choreography")
    length_str = request.data.get("length")  
    choreograph = request.data.get("choreograph")
    age_category_id = request.data.get("age_category")
    style_category_id = request.data.get("style_category")
    group_size_category_id = request.data.get("group_size_category")

    
    if not all(
        [
            order_id,
            choreography,
            length_str,
            choreograph,
            age_category_id,
            style_category_id,
            group_size_category_id,
        ]
    ):
        return Response(
            {"detail": "Nepotpuna prijava."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    
    length = parse_duration(length_str)
    if length is None:
        
        try:
            h, m, s = map(int, length_str.split(":"))
            length = timedelta(hours=h, minutes=m, seconds=s)
        except Exception:
            return Response(
                {"detail": "Neispravan format trajanja. Koristi HH:MM:SS."},
                status=status.HTTP_400_BAD_REQUEST,
            )

    
    competition = get_object_or_404(Competition, pk=competition_id)
    age_category = get_object_or_404(AgeCategory, pk=age_category_id)
    style_category = get_object_or_404(StyleCategory, pk=style_category_id)
    group_size_category = get_object_or_404(GroupSizeCategory, pk=group_size_category_id)

    
    try:
        capture_result = capture_paypal_order(order_id)
    except requests.HTTPError as e:
        
        try:
            error_json = e.response.json()
        except Exception:
            error_json = {"message": str(e)}
        return Response(
            {"detail": "Greška kod PayPal naplate.", "paypal_error": error_json},
            status=status.HTTP_400_BAD_REQUEST,
        )

    
    status_str = capture_result.get("status")
    if status_str not in ["COMPLETED", "APPROVED"]:
        return Response(
            {
                "detail": "Plaćanje nije potvrđeno.",
                "paypal_status": status_str,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    
    appearance = Appearance(
        competition=competition,
        club_manager=user,  
        choreography=choreography,
        length=length,
        choreograph=choreograph,
        age_category=age_category,
        style_category=style_category,
        group_size_category=group_size_category,
        paid_registration=True,
        
    )
    appearance.save()

    return Response(
        {
            "success": True,
            "appearance_id": appearance.id,
            "paypal_status": status_str,
        },
        status=status.HTTP_201_CREATED,
    )



def _create_appearance_from_request(request, competition):
    data = request.data

    appearance = Appearance()

    
    appearance.choreography = data.get("choreography")
    appearance.length = data.get("length")
    appearance.choreograph = data.get("choreograph")

    if not all([appearance.choreography, appearance.length, appearance.choreograph]):
        raise ValueError("Nepotpuna prijava.")

    
    try:
        age_id = data.get("age_category")
        style_id = data.get("style_category")
        group_id = data.get("group_size_category")

        appearance.age_category = AgeCategory.objects.get(id=age_id)
        appearance.style_category = StyleCategory.objects.get(id=style_id)
        appearance.group_size_category = GroupSizeCategory.objects.get(id=group_id)
    except (AgeCategory.DoesNotExist, StyleCategory.DoesNotExist, GroupSizeCategory.DoesNotExist):
        raise ValueError("Nepotpuna prijava.")

    
    music_id = data.get("music")
    if music_id:
        appearance.music_id = music_id  

    
    if (appearance.age_category not in competition.age_categories.all() or
        appearance.style_category not in competition.style_categories.all() or
        appearance.group_size_category not in competition.group_size_categories.all()):
        raise ValueError("Nepodrzana kategorija.")

    appearance.club_manager = request.user if request.user.is_authenticated else None
    appearance.competition = competition
    return appearance




