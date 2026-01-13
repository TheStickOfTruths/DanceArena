from .models import Role, OrganizerSubscription

def is_paid_organizer(user):
    sub = OrganizerSubscription.objects.filter(organizer=user).first()
    return (
        user.is_authenticated and
        user.role == Role.ORGANIZER and
        sub is not None and
        sub.paid_subscription
    )

def is_unpaid_organizer(user):
    sub = OrganizerSubscription.objects.filter(organizer=user).first()
    return (
        user.is_authenticated and
        user.role == Role.ORGANIZER and
        (sub is None or not sub.paid_subscription)
    )
