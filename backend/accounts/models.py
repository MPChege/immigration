from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom User model supporting multiple roles"""
    USER_TYPE_CHOICES = [
        ('user', 'User'),
        ('service_provider', 'Service Provider'),
        ('admin', 'Administrator'),
    ]
    
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='user')
    contact = models.CharField(max_length=20, unique=True, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'users'
    
    def __str__(self):
        return f"{self.username} ({self.user_type})"


class ServiceProvider(models.Model):
    """Service Provider profile information"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='service_provider_profile')
    company_name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255)
    services_offered = models.TextField(help_text="Comma-separated list of services")
    pricing_info = models.TextField(null=True, blank=True)
    availability = models.BooleanField(default=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    total_reviews = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'service_providers'
    
    def __str__(self):
        return self.company_name
