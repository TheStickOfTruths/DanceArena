#Dodao sam ovaj zaseban file jer tehnički mi funkcija ne pripada ni modelima ni adminu.

from .models import OrganizerSubscriptionPrice

def get_organizer_subscription_price():
    price_obj = OrganizerSubscriptionPrice.objects.first()
    if not price_obj:
        raise ValueError("Organizer subscription price is not set")
    return price_obj.price