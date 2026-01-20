from django.shortcuts import redirect, get_object_or_404
from django.conf import settings
from django.http import JsonResponse
from django.db import transaction
from .models import Competition, Appearance, Grade, CompetitionJudge, Result,\
                    StatusChoices, AgeCategory, StyleCategory, GroupSizeCategory, MediaFile
from .utils import generate_starting_list_pdf, generate_results, generate_grades
from users.models import User, Role
from users.decorators import role_required
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
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
import itertools


def competition_filtered(request):
    if request.method != 'GET':
        return JsonResponse({"error": "Nije get metoda."}, status=405)
    
    data = []
    publishedStatuses = request.GET.getlist('filter')

    if not publishedStatuses:
        return JsonResponse({"error": "Nisu poslani statusi za filtriranje."}, status=400)
    
    if Competition.objects.filter(status__in=publishedStatuses).exists():
        for competition in Competition.objects.filter(status__in=publishedStatuses):
            data.append({
            'name': competition.name,
            'organizer': competition.organizer.first_name or competition.organizer.username,
            'description': competition.description,
            'date': competition.date,
            'location': competition.location,
            'registration_fee': competition.registration_fee,
            'age_categories': [cat.name for cat in competition.age_categories.all()],
            'style_categories': [cat.name for cat in competition.style_categories.all()],
            'group_size_categories': [cat.name for cat in competition.group_size_categories.all()],
            'status': competition.status,
            'id': competition.id
        })
    
        return JsonResponse(data, safe=False, status=200)
    else:
        return JsonResponse({"success":"Nema natjecanja."}, status=200)


@api_view(['GET']) 
@permission_classes([IsAuthenticated]) 
def my_competitions(request):
    data = []
    if Competition.objects.filter(organizer=request.user).exists():
        for competition in Competition.objects.filter(organizer=request.user):
            data.append({
            'name': competition.name,
            'organizer': competition.organizer.first_name or competition.organizer.username,
            'date': competition.date,
            'location': competition.location,
            'registration_fee': competition.registration_fee,
            'age_categories': [cat.get_name_display() for cat in competition.age_categories.all()],
            'style_categories': [cat.get_name_display() for cat in competition.style_categories.all()],
            'group_size_categories': [cat.get_name_display() for cat in competition.group_size_categories.all()],
            'status': competition.status,
            'id': competition.id
        })
    
        return JsonResponse(data, safe=False, status=200)
    else:
        return JsonResponse({"success":"Nema natjecanja."}, status=200)
    

@api_view(['POST']) 
@permission_classes([IsAuthenticated]) 
@role_required(Role.ORGANIZER)
def competition_create(request):
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Loš JSON'}, status=400)

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

            return JsonResponse({'message': 'Natjecanje kreirano!', 'id': competition.id}, status=201)
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@api_view(['GET']) 
@permission_classes([IsAuthenticated]) 
def competition_id(request, id):
    competition = get_object_or_404(Competition, id=id)

    data = {
            'name': competition.name,
            'organizer': competition.organizer.first_name or competition.organizer.username,
            'description': competition.description,
            'date': competition.date,
            'location': competition.location,
            'registration_fee': competition.registration_fee,
            'age_categories': [cat.name for cat in competition.age_categories.all()],
            'style_categories': [cat.name for cat in competition.style_categories.all()],
            'group_size_categories': [cat.name for cat in competition.group_size_categories.all()],
            'status': competition.status,
            'id': competition.id
        }
    
    return JsonResponse(data, status=200)


@api_view(['PUT']) 
@permission_classes([IsAuthenticated]) 
def competition_edit(request, id):
    competition = get_object_or_404(Competition, id=id)

    if competition.organizer != request.user:
        return JsonResponse({"error":"Nisi vlasnik natjecanja."}, status=403)
    
    if competition.status != StatusChoices.DRAFT:
        return JsonResponse({"error":"Natjecanje nije draft."}, status=403)

    for field in Competition._meta.fields:
        attr = field.name  
        if attr in ['id', 'status']:
            continue
        if attr in request.data:
            setattr(competition, attr, request.data.get(attr))
     
    competition.save() 


    m2m_fields = ['age_categories', 'style_categories', 'group_size_categories']

    for attr in m2m_fields:
        if attr in request.data:
            categories_names = request.data.get(attr) 
            
            if attr == 'age_categories':
                ids = AgeCategory.objects.filter(name__in=categories_names).values_list('id', flat=True)
                competition.age_categories.set(ids)
            elif attr == 'style_categories':
                ids = StyleCategory.objects.filter(name__in=categories_names).values_list('id', flat=True)
                competition.style_categories.set(ids)
            elif attr == 'group_size_categories':
                ids = GroupSizeCategory.objects.filter(name__in=categories_names).values_list('id', flat=True)
                competition.group_size_categories.set(ids)

    return JsonResponse({"success":"Spremljene promjene"}, status=201)


@api_view(['PUT']) 
@permission_classes([IsAuthenticated]) 
def competition_publish(request, id):
    competition = get_object_or_404(Competition, id=id)

    if competition.organizer != request.user:
        return JsonResponse({"error": "Nije tvoje natjecanja."}, status=403)

    if competition.status != StatusChoices.DRAFT:
        return JsonResponse({"error": "Natjecanje nije draft."}, status=403)

    competition.status = StatusChoices.PUBLISHED
    competition.save()

    return JsonResponse({"success":"Natjecanje objavljeno."}, status=200)


@api_view(['POST']) 
@permission_classes([IsAuthenticated]) 
def competition_close_applications(request, id):
    competition = get_object_or_404(Competition, id=id)

    if competition.organizer != request.user:
        return JsonResponse({"error": "Nije tvoje natjecanja."}, status=403)
    
    if competition.status != StatusChoices.PUBLISHED:
        return JsonResponse({"error": "Natjecanje nije objavljeno."}, status=403)
    
    if not CompetitionJudge.objects.filter(competition=competition).exists():
        return JsonResponse({"error":"Nema sudaca."}, status=403)
    if CompetitionJudge.objects.filter(competition=competition).count() == 1:
        return JsonResponse({"error":"Samo jedan sudac."}, status=403)
    if CompetitionJudge.objects.filter(competition=competition).count() / 2 == 1:
        return JsonResponse({"error":"Paran broj sudaca."}, status=403)

    competition.status = StatusChoices.CLOSED_APPLICATIONS
    competition.save()
    media = generate_starting_list_pdf(competition)
    link = media.file.url

    return JsonResponse({"success":"Zatvorene prijave.", "starting_list":link}, status=200)


@api_view(['PUT']) 
@permission_classes([IsAuthenticated])
def competition_activate(request, id):
    competition = get_object_or_404(Competition, id=id)
    
    if competition.status != StatusChoices.CLOSED_APPLICATIONS:
        return JsonResponse({"error": "Nisu završile prijave."}, status=403)

    competition.status = StatusChoices.ACTIVE
    competition.save()
    
    return JsonResponse({"success":"Uspjesna aktivacija."}, status=201)


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
        return JsonResponse({"error":"Pristup zabranjen."}, status=403)

    return JsonResponse({"link":competition.starting_list.file.url}, status=200)


@api_view(['POST']) 
@permission_classes([IsAuthenticated])
def invite_judge(request, id):
    competition = get_object_or_404(Competition, id=id)

    if competition.organizer != request.user:
        return JsonResponse({"error": "Nije tvoje natjecanja."}, status=403)
    
    if competition.status != StatusChoices.PUBLISHED:
        return JsonResponse({"error": "Natjecanje nije objavljeno."}, status=403)

    email = request.data.get('email')
    if not User.objects.filter(email=email).exists():
        print(f"Korisnik {email} ne postoji. Šaljem pozivnicu.")
        send_judge_invite(request) 
        return JsonResponse({"success": "Korisnik ne postoji. Pozivnica za registraciju poslana na email."}, status=202)

    user = User.objects.get(email=email)
    if user.role != Role.JUDGE:
        return JsonResponse({"error": "Korisnik nije sudac."}, status=403)
    compJudge = CompetitionJudge(
        competition=competition,
        judge=user
    )
    compJudge.save()

    return JsonResponse({"success": "Dodan sudac."}, status=201)


def get_judges(request, id):
    if request.method != 'GET':
        return JsonResponse({"error": "Nije get metoda."}, status=405)
    
    competition = get_object_or_404(Competition, id=id)
    user = request.user
    data = []
    
    if User.objects.filter(role=Role.JUDGE).exists():
        for user in User.objects.filter(role=Role.JUDGE):
            if CompetitionJudge.objects.filter(competition=competition,judge=user):
                continue
            data.append({
            'name': user.first_name,
            'surname': user.last_name,
            'email': user.email,
            'id': user.id
        })
    
        return JsonResponse(data, safe=False, status=200)
    else:
        return JsonResponse({"success":"Nema sudaca."}, status=200)


@api_view(['POST']) 
@permission_classes([IsAuthenticated])
def competition_grade(request, competition_id, appearance_id):
    competition = get_object_or_404(Competition, id=competition_id)
    appearance = get_object_or_404(Appearance, id=appearance_id)

    if not CompetitionJudge.objects.filter(competition=competition, judge=request.user).exists():
        return JsonResponse({"error": "Nije tvoje natjecanja."}, status=403)
        
    if competition.status != StatusChoices.ACTIVE:
        return JsonResponse({"error": "Natjecanje nije aktivno."}, status=403)
        
    appearance_grade = request.POST.get('grade')
    grade = Grade(
        judge=request.user,
        appearance=appearance,
        grade=appearance_grade
    )
    grade.save()

    return JsonResponse({"success": "Nastup ocijenjen."}, status=201)


@api_view(['POST']) 
@permission_classes([IsAuthenticated])
def competition_complete(request, id):
    competition = get_object_or_404(Competition, id=id)

    if competition.organizer != request.user:
        return JsonResponse({"error": "Nije tvoje natjecanja."}, status=403)

    if competition.status != StatusChoices.ACTIVE:
        return JsonResponse({"error": "Natjecanje nije aktivno."}, status=403)
    
    competition.status = StatusChoices.COMPLETED
    competition.save()

    generate_results(competition)

    return JsonResponse({"success": "Natjecanje završeno i rezultati generirani."}, status=201)


def competition_results(request):
    if request.method != 'GET':
        return JsonResponse({"error": "Nije get metoda."}, status=405)
    
    data = []
    completed_competitions = Competition.objects.filter(status=StatusChoices.COMPLETED).prefetch_related(
        'age_categories', 'style_categories', 'group_size_categories'
    )

    if not completed_competitions.exists():
        return JsonResponse({"message": "Nema završenih natjecanja."}, status=200)

    for competition in completed_competitions:
        comp_info = {
            'competition_id': competition.id,
            'competition_name': competition.name,
            'competition_description': competition.description,
            'competition_location': competition.location,
            'competition_date': competition.date,
            'categories': []
        }

        triplets = list(itertools.product(
            competition.age_categories.all(),
            competition.style_categories.all(),
            competition.group_size_categories.all()
        ))

        for age, style, size in triplets:
            category_results = Result.objects.filter(
                competition=competition,
                appearance__age_category=age,
                appearance__style_category=style,
                appearance__group_size_category=size
            ).select_related('appearance').order_by('rank')

            if not category_results.exists():
                continue

            category_data = {
                'category': f"{age.get_name_display()} - {style.get_name_display()} - {size.get_name_display()}",
                'results': []
            }

            for res in category_results:
                category_data['results'].append({
                    'appearance_id': res.appearance.id,
                    'club_manager': str(res.appearance.club_manager),
                    'choreography': res.appearance.choreography,
                    'choreograph': res.appearance.choreograph,
                    'rank': res.rank
                })
            
            comp_info["categories"].append(category_data)
            data.append(comp_info)

    return JsonResponse(data, safe=False, status=200)


@api_view(['GET']) 
@permission_classes([IsAuthenticated])
def competition_appearance_results(request, competition_id, appearance_id):
    competition = get_object_or_404(Competition, id=competition_id)

    if competition.status != StatusChoices.COMPLETED:
        return JsonResponse({"error": "Natjecanje nije gotovo"}, status=403)
    
    appearance = get_object_or_404(Appearance, id=appearance_id)
    
    if appearance.club_manager != request.user:
        return JsonResponse({"error": "Nije tvoj nastup"}, status=403)
    
    grades = generate_grades(appearance)

    return JsonResponse(grades)


@api_view(['PUT']) 
@permission_classes([IsAuthenticated])
def competition_accept_appearance(request, competition_id, appearance_id):
    competition = get_object_or_404(Competition, id=competition_id)
    appearance = get_object_or_404(Appearance, id=appearance_id)

    if competition.organizer != request.user:
        return JsonResponse({"error": "Nije tvoje natjecanja."}, status=403)

    if competition.status != StatusChoices.PUBLISHED:
        return JsonResponse({"error":"Natjecanje nije objavljeno."}, status=403)
    
    if appearance.competition != competition:
        return JsonResponse({"error":"Nastup ne pripada tom natjecanju"}, status=403)
    
    appearance.accepted = True
    appearance.save()
     
    return JsonResponse({"success":"Nastup prihvaćen."}, status=201)


@api_view(['POST'])
@permission_classes([AllowAny])
def send_judge_invite(request):
    email = request.data.get('email')

    if not email:
        return JsonResponse(
            {"detail": "Email is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    token = uuid.uuid4()
    base_url = settings.FRONTEND_URL.rstrip('/')
    invite_link = f"{base_url}/?invitedJudge=True"

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

    return JsonResponse(
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
        print(f"error u generiranju URl-a: {e}")
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
@permission_classes([IsAuthenticated])
@role_required(Role.CLUB_MANAGER)
def create_entry_order(request, id):
    competition = get_object_or_404(Competition, id=id)
    print(settings.FRONTEND_URL)
    amount = competition.registration_fee
    order = create_paypal_order(
        amount=float(amount),
        currency="EUR",
        description=f"Entry fee for competition {competition.name}"
    )
    return JsonResponse(order)


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
@permission_classes([IsAuthenticated])
@role_required(Role.CLUB_MANAGER)
def competition_signup(request, competition_id):
    user = request.user
    competition = get_object_or_404(Competition, pk=competition_id)

    order_id = request.data.get("orderID")
    choreography = request.data.get("choreography")
    length_str = request.data.get("length")  
    choreograph = request.data.get("choreograph")
    age_category_name = request.data.get("age_category")
    style_category_name = request.data.get("style_category")
    group_size_category_name = request.data.get("group_size_category")

    required_fields = [order_id, choreography, length_str, choreograph, 
                       age_category_name, style_category_name, group_size_category_name]
    if not all(required_fields):
        return JsonResponse({"detail": "Nepotpuna prijava."}, status=400)

    uploaded_file = request.FILES.get('muzika')
    if not uploaded_file:
        return JsonResponse({"error": "Nije poslana muzička datoteka."}, status=400)
    if not uploaded_file.name.lower().endswith('.mp3'):
        return JsonResponse({"error": "Dopušteni su samo MP3 formati."}, status=400)

    length = parse_duration(length_str)
    if length is None:
        try:
            h, m, s = map(int, length_str.split(":"))
            length = timedelta(hours=h, minutes=m, seconds=s)
        except Exception:
            return JsonResponse({"detail": "Format mora biti HH:MM:SS."}, status=400)

    age_category = get_object_or_404(AgeCategory, name=age_category_name)
    style_category = get_object_or_404(StyleCategory, name=style_category_name)
    group_size_category = get_object_or_404(GroupSizeCategory, name=group_size_category_name)

    try:
        capture_result = capture_paypal_order(order_id)
        status_str = capture_result.get("status")
        if status_str not in ["COMPLETED", "APPROVED"]:
             return JsonResponse({"detail": "Plaćanje nije potvrđeno."}, status=400)
    except Exception as e:
        return JsonResponse({"detail": "PayPal greška.", "error": str(e)}, status=400)

    try:
        with transaction.atomic():
            music_file = MediaFile(
                title=f"Music for Comp {competition.id} - {choreography}",
                file_type='mp3'
            )
            music_file.file.save(f"comp_{competition.id}_{order_id}.mp3", uploaded_file, save=True)

            appearance = Appearance.objects.create(
                competition=competition,
                club_manager=user,  
                choreography=choreography,
                length=length,
                choreograph=choreograph,
                age_category=age_category,
                style_category=style_category,
                group_size_category=group_size_category,
                music=music_file,
                paid_registration=True,       
            )

        return JsonResponse({
            "success": True,
            "appearance_id": appearance.id
        }, status=201)

    except Exception as e:
        return JsonResponse({"detail": "Greška pri spremanju prijave.", "error": str(e)}, status=500)