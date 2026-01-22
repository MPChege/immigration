from django.contrib import admin
from .models import Relocation


@admin.register(Relocation)
class RelocationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'origin', 'destination', 'moving_date', 'status', 'estimated_cost')
    list_filter = ('status', 'moving_date')
    search_fields = ('origin', 'destination', 'user__username')
