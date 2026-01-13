import requests
from django.conf import settings

def get_paypal_access_token():
    response = requests.post(
        f"{settings.PAYPAL_API_BASE}/v1/oauth2/token",
        auth=(settings.PAYPAL_CLIENT_ID, settings.PAYPAL_CLIENT_SECRET),
        data={"grant_type": "client_credentials"}
    )
    response.raise_for_status()
    return response.json()["access_token"]

# Optional automation: create a plan in PayPal
def create_paypal_plan(price: float, product_name="Organizer Subscription"):
    token = get_paypal_access_token()

    product_payload = {
        "name": product_name,
        "type": "SERVICE",
        "category": "SOFTWARE"
    }
    product_resp = requests.post(
        f"{settings.PAYPAL_API_BASE}/v1/catalogs/products",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        json=product_payload
    )
    product_resp.raise_for_status()
    product_id = product_resp.json()["id"]

    plan_payload = {
        "product_id": product_id,
        "name": f"{product_name} Plan €{price}",
        "billing_cycles": [
            {
                "frequency": {"interval_unit": "YEAR", "interval_count": 1},  # YEAR
                "tenure_type": "REGULAR",
                "sequence": 1,
                "total_cycles": 0,
                "pricing_scheme": {
                    "fixed_price": {"value": f"{price:.2f}", "currency_code": "EUR"}  # EUR
                },
            }
        ],
        "payment_preferences": {
            "auto_bill_outstanding": True,
            "setup_fee": {"value": "0", "currency_code": "EUR"},
            "setup_fee_failure_action": "CONTINUE",
            "payment_failure_threshold": 3,
        },
        "status": "ACTIVE",
    }
    plan_resp = requests.post(
        f"{settings.PAYPAL_API_BASE}/v1/billing/plans",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        json=plan_payload
    )
    plan_resp.raise_for_status()
    return plan_resp.json()["id"]

