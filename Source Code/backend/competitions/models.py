from django.db import models
from users.models import User
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal
from django.core.exceptions import ValidationError


class AgeChoices(models.TextChoices):
    DJECA = "DJECA", "Djeca"
    JUNIORI = "JUNIORI", "Juniori"
    SENIORI = "SENIORI", "Seniori"


class AgeCategory(models.Model):
    name = models.CharField(
        max_length=50,
        choices=AgeChoices.choices,
        unique=True
    )

    def __str__(self):
        return f"{self.name}"


class StyleChoices(models.TextChoices):
    BALET = "BALET", "Balet"
    HIPHOP = "HIPHOP", "Hip Hop"
    JAZZ = "JAZZ", "Jazz"
    STEP = "STEP", "Step"
    BREAK = "BREAK", "Break"


class StyleCategory(models.Model):
    name = models.CharField(
        max_length=50,
        choices=StyleChoices.choices,
        unique=True
    )

    def __str__(self):
        return f"{self.name}"


class GroupSizeChoices(models.TextChoices):
    SOLO = "SOLO", "Solo"
    DUO = "DUO", "Duo"
    MALA_GRUPA = "MALA_GRUPA", "Mala grupa"
    FORMACIJA = "FORMACIJA", "Formacija"


class GroupSizeCategory(models.Model):
    name = models.CharField(
        max_length=50,
        choices=GroupSizeChoices.choices,
        unique=True
    )

    def __str__(self):
        return f"{self.name}"


class StatusChoices(models.TextChoices):
    DRAFT = "DRAFT", "Draft"
    PUBLISHED = "PUBLISHED", "Published"
    CLOSED_APPLICATIONS = "CLOSED_APPLICATIONS", "Closed applications"
    ACTIVE = "ACTIVE", "Active"
    COMPLETED = "COMPLETED", "Completed"


class MediaFile(models.Model):
    FILE_TYPES = (
        ('mp3', 'Music'),
        ('pdf', 'Document'),
    )
    
    title = models.CharField(max_length=255)
    file_type = models.CharField(max_length=10, choices=FILE_TYPES)
    file = models.FileField(upload_to='uploads/') 
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Competition(models.Model):
    name = models.CharField(max_length=255)
    date = models.DateField()
    location = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    organizer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        limit_choices_to={'role': 'ORGANIZER'},
        on_delete=models.CASCADE,
        related_name='organized_competitions'
    )
    age_categories = models.ManyToManyField(AgeCategory, related_name='competitions')
    style_categories = models.ManyToManyField(StyleCategory, related_name='competitions')
    group_size_categories = models.ManyToManyField(GroupSizeCategory, related_name='competitions')
    status = models.CharField(choices=StatusChoices, max_length=20, default=StatusChoices.DRAFT)
    judges = models.ManyToManyField(User, through='CompetitionJudge', related_name='judged_competitions')
    starting_list = models.OneToOneField(
        MediaFile, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='competition_starting_list'
    )
    registration_fee = models.DecimalField(
        decimal_places=2, 
        max_digits=6, 
        default=0,
        validators=[MinValueValidator(Decimal('0.00')), MaxValueValidator(Decimal('9999.99'))]
    )

    def __str__(self):
        return f"ID:{self.id} ORGANIZER:{self.organizer}"


class CompetitionJudge(models.Model):
    competition = models.ForeignKey(
        Competition,
        on_delete=models.CASCADE,
        related_name='competition_judges'
    )
    judge = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        limit_choices_to={'role': 'JUDGE'},
        on_delete=models.CASCADE,
        related_name='assigned_competitions'
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['judge','competition'], name='unique_judge_competition')
        ]

    def __str__(self):
        return f"{self.judge}->{self.competition}"


class Appearance(models.Model):
    competition = models.ForeignKey(
        Competition,
        on_delete=models.CASCADE,
        related_name='appearances'
    )
    club_manager = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        limit_choices_to={'role': 'CLUB_MANAGER'},
        on_delete=models.CASCADE,
        related_name='appearances'
    )
    choreography = models.CharField(max_length=50)
    length = models.DurationField()
    choreograph = models.CharField(max_length=50)
    music = models.OneToOneField(
        MediaFile, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='appearance_music'
    )
    age_category = models.ForeignKey(
        AgeCategory, 
        on_delete=models.PROTECT
    )
    style_category = models.ForeignKey(
        StyleCategory, 
        on_delete=models.PROTECT
    )
    group_size_category = models.ForeignKey(
        GroupSizeCategory, 
        on_delete=models.PROTECT
    )
    accepted = models.BooleanField(default=False)
    paid_registration = models.BooleanField(default=False)

    def __str__(self):
        return f"ID:{self.id} COMPETITION_ID:{self.competition.id} CLUB_MANAGER:{self.club_manager}"
    
    def clean(self):
        super().clean()
        if not self.competition.group_size_categories.filter(id=self.group_size_category.id).exists():
            raise ValidationError({
                'group_size_category': f"Nedozvoljena kategorija za velicinu grupe."
            })
        if not self.competition.style_categories.filter(id=self.style_category.id).exists():
            raise ValidationError({
                'group_size_category': f"Nedozvoljena kategorija za stil."
            })
        if not self.competition.age_categories.filter(id=self.age_category.id).exists():
            raise ValidationError({
                'group_size_category': f"Nedozvoljena kategorija za dob."
            })
    
    def get_length_display(self):
        if self.length:
            total_seconds = int(self.length.total_seconds())
            minutes = total_seconds // 60
            seconds = total_seconds % 60
            return f"{minutes:02d}:{seconds:02d}"
        return "00:00"


class Grade(models.Model):
    judge = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        limit_choices_to={'role': 'JUDGE'},
        on_delete=models.CASCADE,
        related_name='grades'
    )
    appearance = models.ForeignKey(
        Appearance,
        on_delete=models.CASCADE,
        related_name='grades'
    )
    grade = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(30)]
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['judge','appearance'], name='unique_judge_appearance')
        ]

    def __str__(self):
        return f"{self.judge.username}->{self.appearance.id}:{self.grade}"
    

class Result(models.Model):
    competition = models.ForeignKey(
        Competition,
        on_delete=models.CASCADE,
        related_name='results'
    )
    appearance = models.ForeignKey(
        Appearance,
        on_delete=models.CASCADE,
        related_name='results'
    )
    rank = models.IntegerField(validators=[MinValueValidator(1)])

    class Meta:
        ordering = ['rank'] 
        unique_together = ('competition', 'appearance')
