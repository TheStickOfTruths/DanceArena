from django.urls import path
from . import views

urlpatterns = [
    path('filtered/', views.competition_filtered, name='competition_filtered'),
    path('my_competitions/', views.my_competitions, name='my_competitions'),

    path('new/', views.competition_create, name='competition_create'),
    path('<int:id>/', views.competition_id, name='competition_id'),
    path('<int:id>/edit/', views.competition_edit, name='competition_edit'),
    path('<int:id>/publish/', views.competition_publish, name='competition_publish'),
    path('<int:id>/close_applications/', views.competition_close_applications, 
         name='competition_close_applications'),
    path('<int:id>/activate/', views.competition_activate, name='competition_activate'),
    path('<int:id>/complete/', views.competition_complete, name='competition_complete'),
    
    path('<int:id>/starting_list/', views.competition_starting_list, name='competition_starting_list'),

    path('<int:id>/invite_judge/', views.invite_judge, name='invite_judge'),
    path('get_judges/', views.get_judges, name='get_judges'),
    path('<int:competition_id>/grade/<int:appearance_id>/', 
        views.competition_grade, name='competition_grade'),

    path('results/', views.competition_results, name='competition_results'),
    path('<int:competition_id>/results/<int:appearance_id>/',
        views.competition_appearance_results, name='competition_appearance_results'),

    path('<int:competition_id>/appearances/<int:appearance_id>/accept/',
        views.competition_accept_appearance, name='competition_accept_appearance'),

    path('invite-judge/', views.send_judge_invite, name='send_judge_invite'),
    path('<int:competition_id>/signup/', views.competition_signup, name='competition_signup'),
    path('<int:id>/create-order/', views.create_entry_order, name='create_entry_order'),
]