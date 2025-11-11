from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from .models import User, OrganizerSubscription

@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    model = User
    list_display = ('id', 'first_name', 'last_name', 'username', 'email', 'role', 'club_name', 'club_location', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'club_name', 'club_location', 'contact')}),
        ('Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'role', 'club_name', 'club_location', 'contact', 'is_staff', 'is_active')}
        ),
    )
    search_fields = ('username', 'email', 'club_name', 'club_location')
    ordering = ('id', 'username')


@admin.register(OrganizerSubscription)
class OrganizerSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'organizer_info', 'paid_subscription', 'end_date')
    list_filter = ('paid_subscription',)
    search_fields = ('id', 'end_date')
    ordering = ('id',)

    def organizer_info(self, obj):
        return f"{obj.organizer.id} - {obj.organizer.username}"
    organizer_info.short_description = "Organizer"
