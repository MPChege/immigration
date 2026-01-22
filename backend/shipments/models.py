from django.db import models
from bookings.models import Booking


class Shipment(models.Model):
    STATUS_CHOICES = [
        ('preparing', 'Preparing'),
        ('in_transit', 'In Transit'),
        ('out_for_delivery', 'Out for Delivery'),
        ('delivered', 'Delivered'),
        ('delayed', 'Delayed'),
    ]
    
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='shipment')
    tracking_number = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='preparing')
    current_location = models.CharField(max_length=255, null=True, blank=True)
    estimated_delivery = models.DateTimeField(null=True, blank=True)
    actual_delivery = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'shipments'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Shipment {self.tracking_number}: {self.status}"
