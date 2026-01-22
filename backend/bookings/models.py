from django.db import models
from accounts.models import User, ServiceProvider
from relocations.models import Relocation


class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    service_provider = models.ForeignKey(ServiceProvider, on_delete=models.CASCADE, related_name='bookings')
    relocation = models.ForeignKey(Relocation, on_delete=models.CASCADE, related_name='bookings')
    service_type = models.CharField(max_length=255, help_text="e.g., Packing, Transportation, Unpacking")
    booking_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'bookings'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Booking {self.id}: {self.user.username} - {self.service_provider.company_name}"
