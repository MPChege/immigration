from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'booking', 'amount', 'payment_method', 'status', 'payment_date')
    list_filter = ('status', 'payment_method', 'payment_date')
    search_fields = ('transaction_id', 'booking__user__username')
