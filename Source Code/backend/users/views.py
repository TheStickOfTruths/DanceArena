from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .decorators import role_required
from .models import Role
from django.views.decorators.csrf import csrf_exempt #FOR POSTMAN !!!!!!!!!!!
from django.contrib.auth.decorators import login_required
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from django.conf import settings


class GoogleLogin(SocialLoginView): 
    adapter_class = GoogleOAuth2Adapter
    callback_url = settings.LOGIN_REDIRECT_URL
    client_class = OAuth2Client


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

def google_login(request):
    print('entering google login')
    user_email = None
    user_name = None
    if request.user.is_authenticated:
        print('user is authenticated')
        user_email = request.user.email
        user_name = request.user.get_full_name() or request.user.username
    return render(request, 'users/google_login.html', {
        'user_email': user_email,
        'user_name': user_name,
    })

@api_view(['POST'])
def custom_logout(request):
    print('logout')
    if not request.user.is_authenticated:
        return JsonResponse({'success': 'User already logged out.'}, status = 200) #Ako nije nitko prijavljen, vrati OK
    
    logout(request) #Logout za Django

    return JsonResponse({'success': "User loged out successfully."}, status = 200) #Vrati JSONRepsonse za logout nakon Django logouta

@api_view(['GET'])
def current_user(request):
    print('current user')
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Not authenticated'}, status=401)
    
    user = request.user
    data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'role': user.role
    }
    return Response(data)
