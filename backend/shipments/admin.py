from django.contrib import admin
from .models import Shipment


@admin.register(Shipment)
class ShipmentAdmin(admin.ModelAdmin):
    list_display = ('tracking_number', 'booking', 'status', 'current_location', 'estimated_delivery', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('tracking_number', 'booking__user__username')
