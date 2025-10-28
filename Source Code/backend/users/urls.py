from django.urls import path, include
from . import views
from django.contrib.auth.views import LogoutView

urlpatterns = [
    path('me/', views.current_user, name='current_user'),
    path('login_user/', views.login_user, name="login"),
    path('organizer/', views.organizers, name="organizer.home"),
    path('club_manager/', views.club_managers, name="club_manager.home"),
    path('judge/', views.judges, name="judge.home"),
    path('google-login/', views.google_login, name='google_login'),
    path('logout/', views.custom_logout, name='logout'),
    path('auth/', include('social_django.urls', namespace='social')),
]
