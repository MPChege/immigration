from django.contrib import admin
from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'service_provider', 'relocation', 'service_type', 'status', 'total_amount', 'booking_date')
    list_filter = ('status', 'booking_date', 'service_type')
    search_fields = ('user__username', 'service_provider__company_name')
