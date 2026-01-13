from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from .paypal import create_paypal_plan

phone_regex = RegexValidator(
    regex=r'^\+?\s*(?:\d\s*){9,15}$',
    message="Enter a valid phone number: optional '+' followed by 9 to 15 digits. Spaces are allowed."
)


class Role(models.TextChoices):
    ADMIN = "ADMIN", "Admin"
    ORGANIZER = "ORGANIZER", "Organizer"
    CLUB_MANAGER = "CLUB_MANAGER", "Club Manager"
    JUDGE = "JUDGE", "Judge"
    ANONYMOUS = "ANONYMOUS", "Anonymous"
        

class User(AbstractUser):
    role = models.CharField(max_length=50, choices=Role.choices, default=Role.ANONYMOUS)
    club_name = models.CharField(max_length=50, blank=True, null=True)
    club_location = models.CharField(max_length=50, blank=True, null=True)
    contact = models.CharField(validators=[phone_regex], max_length=20, blank=True, null=True)

    def save(self, *args, **kwargs):
        # Only default if no role set
        if not self.pk and not self.role:
            self.role = self.Role.ADMIN
        super().save(*args, **kwargs)


class OrganizerSubscription(models.Model):
    organizer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        limit_choices_to={'role': 'ORGANIZER'},
        on_delete=models.CASCADE,
        related_name='subscription'
    )
    paid_subscription = models.BooleanField(default=False)
    end_date = models.DateField(null=True, blank=True, default=None)

    price_paid = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True
    )

    paypal_subscription_id = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    paypal_status = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

#Organizator postavlja cijenu
class OrganizerSubscriptionPrice(models.Model):
    price = models.DecimalField(max_digits=8, decimal_places=2)
    paypal_plan_id = models.CharField(max_length=255, null=True, blank=True)

    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Delete old price objects
        OrganizerSubscriptionPrice.objects.exclude(pk=self.pk).delete()
        
        # Optional automation: create PayPal plan for new price
        new_plan_id = create_paypal_plan(self.price)
        self.paypal_plan_id = new_plan_id

        super().save(*args, **kwargs)