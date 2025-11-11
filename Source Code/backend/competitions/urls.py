from django.urls import path
from . import views

urlpatterns = [
    path('', views.competition_live, name='competition_live'),
    path('new/', views.competition_create, name='competition_create'),
    path('<int:id>/', views.competition_detail, name='competition_detail'),
    path('<int:id>/edit/', views.competition_edit, name='competition_edit'),
    path('<int:id>/publish/', views.competition_publish, name='competition_publish'),
    path('<int:id>/close_applications/', views.competition_close_applications, 
         name='competition_close_applications'),
    path('<int:id>/starting_list/', views.competition_starting_list, name='competition_starting_list'),
    path('<int:id>/invite_judge/', views.competition_invite_judge, name='competition_invite_judge'),
    path('<int:id>/activate/', views.competition_activate, name='competition_activate'),
    path('<int:id>/deactivate/', views.competition_deactivate, name='competition_deactivate'),
    path('<int:competition_id>/grade/<int:appearance_id>/', 
        views.competition_grade, name='competition_grade'),
    path('<int:id>/complete/', views.competition_complete, name='competition_complete'),
    path('<int:id>/results/', views.competition_results, name='competition_results'),
    path('<int:competition_id>/results/<int:appearance_id>/',
        views.competition_appearance_results, name='competition_appearance_results'),
    path('<int:id>/signup/', views.competition_signup, name='competition_signup'),
]