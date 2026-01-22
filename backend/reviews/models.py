from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from accounts.models import User, ServiceProvider
from bookings.models import Booking


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    service_provider = models.ForeignKey(ServiceProvider, on_delete=models.CASCADE, related_name='reviews')
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='reviews', null=True, blank=True)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'reviews'
        unique_together = ('user', 'service_provider', 'booking')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Review {self.id}: {self.rating} stars for {self.service_provider.company_name}"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update service provider rating
        self.update_service_provider_rating()
    
    def update_service_provider_rating(self):
        from django.db.models import Avg
        reviews = Review.objects.filter(service_provider=self.service_provider)
        if reviews.exists():
            avg_rating = reviews.aggregate(Avg('rating'))['rating__avg']
            self.service_provider.rating = round(avg_rating, 2)
            self.service_provider.total_reviews = reviews.count()
            self.service_provider.save()
