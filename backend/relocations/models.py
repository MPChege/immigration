from django.db import models
from accounts.models import User


class Relocation(models.Model):
    STATUS_CHOICES = [
        ('planning', 'Planning'),
        ('booked', 'Booked'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='relocations')
    origin = models.CharField(max_length=255)
    destination = models.CharField(max_length=255)
    moving_date = models.DateField()
    inventory = models.TextField(help_text="List of items to be moved")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planning')
    estimated_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'relocations'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Relocation {self.id}: {self.origin} to {self.destination}"
