from django.urls import path, include
from . import views
from .views import GoogleLogin, create_subscription, paypal_success
from django.contrib.auth.views import LogoutView
from users.views import MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('organizer/', views.organizers, name="organizer.home"),
    path('club_manager/', views.club_managers, name="club_manager.home"),
    path('judge/', views.judges, name="judge.home"),
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path('auth/google/', GoogleLogin.as_view(), name='google_login'),
    path('auth/me/', views.current_user, name='current_user'),
    path('auth/logout/', views.custom_logout, name='logout'),
    path("create-subscription/", create_subscription, name='paypal_success'),
    path("paypal/success/", paypal_success, name='create_subcription'),
]
