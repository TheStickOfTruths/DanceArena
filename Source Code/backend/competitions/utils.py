from io import BytesIO
from django.core.files.base import ContentFile
from django.db.models import Avg
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.units import cm
import itertools
from collections import defaultdict
from .models import Appearance, Grade, MediaFile, Result, CompetitionJudge, Competition
from datetime import datetime, date, time, timedelta
import uuid
from django.conf import settings
import requests


def calculate_start_time(base_time: time, length: timedelta) -> time:
    dt = datetime.combine(date.today(), base_time)
    
    new_dt = dt + length + timedelta(minutes=2)
    
    if new_dt.second > 0 or new_dt.microsecond > 0:
        new_dt += timedelta(minutes=1)
        new_dt = new_dt.replace(second=0, microsecond=0)
    else:
        new_dt = new_dt.replace(second=0, microsecond=0)

    return new_dt.time()


def generate_starting_list_pdf(competition):

    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=2 * cm, leftMargin=2 * cm,
        topMargin=2 * cm, bottomMargin=2 * cm
    )

    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='SectionHeader', fontSize=14, spaceAfter=6, leading=16, textColor=colors.darkblue))
    styles.add(ParagraphStyle(name='Heading', fontSize=18, spaceAfter=12, leading=22, alignment=1))

    elements = []

    elements.append(Paragraph(f"<b>Startna lista</b>", styles['Heading']))
    elements.append(Paragraph(f"Datum: {competition.date.strftime('%d.%m.%Y')}", styles['Normal']))
    elements.append(Paragraph(f"Lokacija: {competition.location}", styles['Normal']))
    elements.append(Paragraph(f"Organizator: {competition.organizer.get_full_name()}", styles['Normal']))
    elements.append(Paragraph(f"Opis: {competition.description}", styles['Normal']))
    elements.append(Spacer(1, 12))

    triplets = list(itertools.product(
        competition.age_categories.all(),
        competition.style_categories.all(),
        competition.group_size_categories.all()
    ))

    start_time = time(8, 0)
    for age, style, size in triplets:
        
        appearances = Appearance.objects.filter(competition=competition
            ).filter(
            age_category=age,
            style_category=style,
            group_size_category=size
            ).order_by('choreograph', 'choreography')

        if not appearances.exists():
            continue

        elements.append(Paragraph(f"{age.get_name_display()} - {style.get_name_display()} - {size.get_name_display()}", styles['SectionHeader']))

        table_data = [["#", "Pocetak nastupa", "Koreograf", "Koreografija", "Voditelj kluba", "Duljina nastupa"]]
        for i, app in enumerate(appearances, start=1):

            next_start_time = calculate_start_time(start_time, app.length)

            duration = app.length
            if duration is not None:
                total_seconds = int(duration.total_seconds())
                minutes, seconds = divmod(total_seconds, 60)
                formatted_length = f"{minutes:02d}:{seconds:02d}"
            else:
                formatted_length = "-"

            table_data.append([
                str(i),
                start_time,
                app.choreography,
                app.choreograph,
                app.club_manager.get_full_name() if app.club_manager else "-",
                formatted_length
            ])

            start_time = next_start_time

        table = Table(table_data, repeatRows=1)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightblue),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('GRID', (0, 0), (-1, -1), 0.25, colors.grey),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
        ]))

        elements.append(table)
        elements.append(Spacer(1, 18))

    doc.build(elements)
    buffer.seek(0)

    new_media = MediaFile(
        title=f"List for {competition.id}",
        file_type='pdf'
    )

    new_media.file.save(f"list_{competition.id}.pdf", ContentFile(buffer.getvalue()))
    new_media.save()
    buffer.close()

    competition.starting_list = new_media
    competition.save()

    return new_media
    

def generate_results(competition):

    triplets = list(itertools.product(
        competition.age_categories.all(),
        competition.style_categories.all(),
        competition.group_size_categories.all()
    ))

    results = defaultdict(dict)
    results_to_db = []

    for age, style, size in triplets:

        appearances = Appearance.objects.filter(competition=competition
            ).filter(
            age_category=age,
            style_category=style,
            group_size_category=size
            )

        if not appearances.exists():
            continue

        app_map = {
            app: Grade.objects.filter(appearance=app).aggregate(avg=Avg('grade'))['avg'] or 0
            for app in appearances
        }

        sorted_app_map = dict(sorted(app_map.items(), key=lambda x: x[1], reverse=True))

        ranked_map = {
            position: app
            for position, app in enumerate(sorted_app_map, start=1)
        }

        for position, app in ranked_map.items():
            results_to_db.append(Result(
                competition=competition,
                appearance=app,
                rank=position
            ))

        category = f"{age}-{style}-{size}"
        results[category] = ranked_map 

    if results_to_db:
        Result.objects.filter(competition=competition).delete()
        Result.objects.bulk_create(results_to_db)

    return


def generate_grades(appearance):

    grades_json = {
        "grades": [
            {
                'judge': f"{judge_name} {judge_surname}",
                'grade': grade
            } for judge_name, judge_surname, grade in Grade.objects.filter(appearance=appearance)
            .values_list('judge__first_name', 'judge__last_name', 'grade')
        ],
        "average": Grade.objects.filter(appearance=appearance).aggregate(avg=Avg('grade'))['avg'] or 0
    }
    
    return grades_json


def send_judge_invite(email, invite_link):
    url = "https://mailserver.automationlounge.com/api/v1/messages/send"
    
    api_key = settings.API_MAIL_KEY
    
    payload = {
        "to": email,
        "subject": "Judge Registration Invitation - Dance Arena",
        "html": f"""
            <h1>Welcome!</h1>
            <p>You have been invited to register as a judge on Dance Arena.</p>
            <p>Please use the link below to register:</p>
            <a href="{invite_link}">Register as Judge</a>
            <br><br>
            <p>Best regards,<br>Dance Arena Team</p>
        """
    }

    print(api_key)
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        
        if response.status_code == 200:
            print(f"--- API Email uspješno poslan na: {email} ---")
            print(f"Response: {response.json()}")
        else:
            print(f"--- API Greška ({response.status_code}): {response.text} ---")
            
    except Exception as e:
        print(f"--- Greška pri API pozivu: {e} ---")


def judging_in_progress(competition):
    for comp_judge in CompetitionJudge.objects.filter(competition=competition):
        judge = comp_judge.judge
        if Appearance.objects.filter(competition=competition):
            for appearance in Appearance.objects.filter(competition=competition):
                if not Grade.objects.filter(judge=judge, appearance=appearance):
                    return True
        else:
            return False
        
    return False
            