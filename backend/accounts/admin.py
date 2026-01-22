from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, ServiceProvider


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'user_type', 'is_verified', 'is_staff')
    list_filter = ('user_type', 'is_verified', 'is_staff', 'is_superuser')
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('user_type', 'contact', 'address', 'is_verified')}),
    )


@admin.register(ServiceProvider)
class ServiceProviderAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'contact_person', 'user', 'availability', 'rating', 'total_reviews')
    list_filter = ('availability',)
    search_fields = ('company_name', 'contact_person', 'user__username')
