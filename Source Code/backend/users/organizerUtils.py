from datetime import date
from .models import Role, OrganizerSubscription

def is_paid_organizer(user):
    if not user.is_authenticated or user.role != Role.ORGANIZER:
        return False

    sub = OrganizerSubscription.objects.filter(organizer=user).first()
    if sub is None:
        return False

    
    if not sub.paid_subscription:
        return False
    if not sub.end_date or sub.end_date < date.today():
        return False
    if sub.paypal_status != "ACTIVE":
        return False

    return True


def is_unpaid_organizer(user):
    
    return not is_paid_organizer(user)