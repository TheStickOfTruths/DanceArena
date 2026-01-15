import requests
from django.conf import settings
from .paypal import get_paypal_access_token

def create_paypal_order(amount, currency="EUR", description="Competition entry fee"):
    access_token = get_paypal_access_token()
    payload = {
        "intent": "CAPTURE",
        "purchase_units": [{
            "amount": {
                "currency_code": currency,
                "value": f"{amount:.2f}",
            },
            "description": description,
        }],
        "application_context": {
            "return_url": settings.PAYPAL_RETURN_URL,
            "cancel_url": settings.PAYPAL_CANCEL_URL,
        }
    }
    resp = requests.post(
        f"{settings.PAYPAL_API_BASE}/v2/checkout/orders",
        headers={
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        },
        json=payload,
    )
    resp.raise_for_status()
    return resp.json()
