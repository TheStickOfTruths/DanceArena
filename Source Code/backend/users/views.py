from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.contrib.auth import logout
from django.views.decorators.csrf import csrf_exempt #FOR POSTMAN !!!!!!!!!!!
from django.contrib.auth.decorators import login_required
from django.conf import settings
from .decorators import role_required
from .models import Role
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


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


@role_required(Role.ORGANIZER)
def organizers(req):
    return HttpResponse('Organizer.html')

@role_required(Role.CLUB_MANAGER)
def club_managers(req):
    return HttpResponse('Club manager.html')

@role_required(Role.JUDGE)
def judges(req):
    return HttpResponse('Judge.html')

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
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }
    return JsonResponse(data)

@api_view(['POST'])
def custom_logout(request):
    logout(request)
    return JsonResponse({'success': "Logged out successfully."}, status=200)
