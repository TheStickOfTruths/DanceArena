from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponseForbidden, HttpResponse, JsonResponse
from .models import Competition, Appearance, Grade, CompetitionJudge, StatusChoices, AgeCategory, StyleCategory, GroupSizeCategory
from .utils import generate_starting_list_pdf, generate_results, generate_grades
from users.models import User, Role
from users.decorators import role_required
import json
from django.views.decorators.csrf import csrf_exempt #FOR POSTMAN !!!!!!!!!!!!!!


@csrf_exempt #FOR POSTMAN !!!!!!!!!!!!!!!!!!
def competition_live(request):
    data = []
    if Competition.objects.filter(status=StatusChoices.ACTIVE):
        for competition in Competition.objects.filter(status=StatusChoices.ACTIVE):
            data.append({
            'name': competition.name,
            'organizer': competition.organizer.first_name or competition.organizer.username,
            'date': competition.date,
            'location': competition.location,
            'registration_fee': competition.registration_fee,
            'age_categories': [cat.get_name_display() for cat in competition.age_categories.all()],
            'style_categories': [cat.get_name_display() for cat in competition.style_categories.all()],
            'group_size_categories': [cat.get_name_display() for cat in competition.group_size_categories.all()],
        })
    
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse({'fail':'Nema aktivnih natjecanja!'})


#@csrf_exempt #FOR POSTMAN !!!!!!!!!!!!!!!!!!
@role_required(Role.ORGANIZER)
def competition_create(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        competition = Competition(
            name=data.get('name'),
            organizer=request.user,
            date=data.get('date'),
            location = data.get('location'),
            description=data.get('description'),
            registration_fee=data.get('registration_fee'),
            status=StatusChoices.DRAFT 
        )      
        competition.save()

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

        return JsonResponse({'message': 'Competition created successfully', 'id': competition.id}, status=201)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt #FOR POSTMAN !!!!!!!!!!!!!!!!!!
def competition_detail(request, id):
    competition = get_object_or_404(Competition, id=id)
    appearances = Appearance.objects.get(competition=competition)
    return HttpResponse(appearances)


@csrf_exempt #FOR POSTMAN !!!!!!!!!!!!!!!!!!
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


@csrf_exempt #FOR POSTMAN !!!!!!!!!!!!!!!!!!
@role_required(Role.ORGANIZER)
def competition_publish(request, id):
    competition = get_object_or_404(Competition, id=id)

    if competition.organizer != request.user:
        return HttpResponseForbidden("Pristup zabranjen.")

    if request.method == 'POST':
        competition.status = StatusChoices.PUBLISHED
        competition.save()
        return HttpResponse(competition)

    return HttpResponse("Objavi.html")


@csrf_exempt #FOR POSTMAN !!!!!!!!!!!!!!!!!!
@role_required(Role.ORGANIZER)
def competition_close_applications(request, id):
    competition = get_object_or_404(Competition, id=id)

    if competition.organizer != request.user:
        return HttpResponseForbidden("Pristup zabranjen.")
    
    if competition.status != StatusChoices.PUBLISHED:
        return HttpResponseForbidden("Natjecanje nije objavljeno.")

    if request.method == 'POST':
        competition.status = StatusChoices.CLOSED_APPLICATIONS
        competition.save()
        url = generate_starting_list_pdf(competition)
        return HttpResponse(url)

    return HttpResponse("Zatvori prijave.html")


@csrf_exempt #FOR POSTMAN !!!!!!!!!!!!!!!!!!
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

    return redirect(competition.starting_list_pdf.url)


@csrf_exempt #FOR POSTMAN !!!!!!!!!!!!!!!!!!
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


@csrf_exempt #FOR POSTMAN !!!!!!!!!!!!!!!!!!
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


@csrf_exempt #FOR POSTMAN !!!!!!!!!!!!!!!!!!
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


@csrf_exempt #FOR POSTMAN !!!!!!!!!!!!!!!!!!
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


@csrf_exempt #FOR POSTMAN !!!!!!!!!!!!!!!!!!
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


@csrf_exempt #FOR POSTMAN !!!!!!!!!!!!!!!!!!
def competition_results(request, id):
    competition = get_object_or_404(Competition, id=id)
    if competition.status != StatusChoices.COMPLETED:
        return HttpResponseForbidden("Natjecanje nije gotovo.")
    
    results = generate_results(competition)

    return JsonResponse(results)


@csrf_exempt #FOR POSTMAN !!!!!!!!!!!!!!!!!!
#@role_required(Role.CLUB_MANAGER)
def competition_appearance_results(request, competition_id, appearance_id):
    competition = get_object_or_404(Competition, id=competition_id)
    if competition.status != StatusChoices.COMPLETED:
        return HttpResponseForbidden("Natjecanje nije gotovo.")
    
    appearance = get_object_or_404(Appearance, id=appearance_id)
    
    #if appearance.club_manager != request.user:
    #    return HttpResponseForbidden("Pristup zabranjen")
    
    grades = generate_grades(appearance)

    return JsonResponse(grades)


@csrf_exempt #FOR POSTMAN !!!!!!!!!!!!!!!!!!
@role_required(Role.CLUB_MANAGER)
def competition_signup(request, id):
    competition = get_object_or_404(Competition, id=id)

    if request.method == 'POST':
        if competition.status != StatusChoices.PUBLISHED:
            return HttpResponseForbidden("Prijava nije moguća.")
        
        appearance = Appearance()
        for field in Appearance._meta.fields:
            attr = field.name  
            if attr in ['id', 'club_manager', 'competition']:
                continue
            if request.POST.get(attr):
                setattr(appearance, attr, request.POST.get(attr))
            else:
                return HttpResponseForbidden("Nepotpuna prijava.")

        if appearance.age_category not in competition.age_categories\
            or appearance.style_category not in competition.style_categories\
            or appearance.group_size_category not in competition.group_size_categories:
            return HttpResponseForbidden("Nepodrzana kategorija.")
        appearance.club_manager = request.user
        appearance.competition = competition
        appearance.save()

        return HttpResponse(appearance)
    
    return HttpResponse("Prijavi nastup.html")
