from django.http import JsonResponse
from django.contrib.auth import logout
from django.conf import settings
from django.db import transaction
from .decorators import role_required
from .models import Role
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .paypal import get_paypal_access_token
from .models import OrganizerSubscriptionPrice, OrganizerSubscription
import requests
from datetime import date
from dateutil.relativedelta import relativedelta
import json
from organizerUtils import is_paid_organizer


class GoogleLogin(SocialLoginView): 
    adapter_class = GoogleOAuth2Adapter
    callback_url = settings.LOGIN_REDIRECT_URL
    client_class = OAuth2Client
    permission_classes = [AllowAny]


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        
        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
@permission_classes([AllowAny]) 
def current_user(request):
    if not request.user.is_authenticated:
        return JsonResponse({'authenticated': False}, status=200)
    
    user = request.user

    refresh = RefreshToken.for_user(user)
    
    data = {
        'authenticated': True,
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'role': user.role,
        'contact': user.contact,
        'club_name': user.club_name,
        'club_location': user.club_location,
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }
    return JsonResponse(data)


@api_view(['PUT'])
@permission_classes([AllowAny]) 
def user_info(request):
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Nevazeci JSON'}, status=400)

    user = request.user
    role = data.get('role')
    try:
        with transaction.atomic():
            user.role = role
            user.first_name = data.get('name', user.first_name)
            user.last_name = data.get('surname', user.last_name)

            if role == Role.JUDGE:
                pass 
            
            elif role == Role.ORGANIZER:
                user.contact = data.get('contact', user.contact)
                
            elif role == Role.CLUB_MANAGER:
                user.club_name = data.get('club_name', user.club_name)
                user.club_location = data.get('club_location', user.club_location)
            else:
                return JsonResponse({'error': "Nevazeca uloga"}, status=400)
            user.save()
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'success': "Uspjeh"}, status=200)


@api_view(['POST'])
def custom_logout(request):
    logout(request)
    return JsonResponse({'success': "Logged out successfully."}, status=200)


@api_view(['POST'])
@role_required(Role.ORGANIZER)
def create_subscription(request):
    price_obj = OrganizerSubscriptionPrice.objects.first()
    if not price_obj:
        return JsonResponse({"error": "Subscription price not set"}, status=400)

    access_token = get_paypal_access_token()

    payload = {
        "plan_id": price_obj.paypal_plan_id,
        "application_context": {
            "return_url": settings.PAYPAL_RETURN_URL,
            "cancel_url": settings.PAYPAL_CANCEL_URL,
        },
    }

    response = requests.post(
        f"{settings.PAYPAL_API_BASE}/v1/billing/subscriptions",
        headers={
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        },
        json=payload,
    )

    try:
        response.raise_for_status()
    except requests.HTTPError:
        return JsonResponse(
            {"paypal_error": response.json()},
            status=response.status_code,
        )

    return JsonResponse(response.json())


@api_view(['POST'])
def paypal_success(request):
    subscription_id = request.data.get("subscription_id")
    if not subscription_id:
        return JsonResponse({"error": "Missing subscription ID"}, status=400)

    access_token = get_paypal_access_token()
    resp = requests.get(
        f"{settings.PAYPAL_API_BASE}/v1/billing/subscriptions/{subscription_id}",
        headers={
            "Authorization": f"Bearer {access_token}"},
    )

    resp.raise_for_status()
    data = resp.json()

    if data.get("status") != "ACTIVE":
        return JsonResponse({"error": "Subscription not active", "paypal_status": data.get("status")}, status=400)

    subscription, _ = OrganizerSubscription.objects.get_or_create(
        organizer=request.user
    )

    current_price_obj = OrganizerSubscriptionPrice.objects.first()
    current_price = current_price_obj.price if current_price_obj else None

    subscription.paid_subscription = True
    subscription.paypal_subscription_id = subscription_id
    subscription.paypal_status = data.get("status")
    subscription.price_paid = current_price
    subscription.end_date = date.today() + relativedelta(years=1)
    subscription.save()

    return JsonResponse({"success": True, "paypal_status": data.get("status")})
    

@api_view(['GET'])
@role_required(Role.ORGANIZER)
def subscribed(request):
    return JsonResponse({'is_subbed':is_paid_organizer(request.user)}, code=200)
