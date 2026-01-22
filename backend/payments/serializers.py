from rest_framework import serializers
from .models import Payment
from bookings.serializers import BookingSerializer


class PaymentSerializer(serializers.ModelSerializer):
    booking = BookingSerializer(read_only=True)
    
    class Meta:
        model = Payment
        fields = ('id', 'booking', 'amount', 'payment_date', 'payment_method', 
                  'status', 'transaction_id', 'notes', 'created_at', 'updated_at')
        read_only_fields = ('id', 'payment_date', 'created_at', 'updated_at')


class PaymentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ('booking', 'amount', 'payment_method', 'transaction_id', 'notes')
    
    def create(self, validated_data):
        # In production, integrate with actual payment gateway
        validated_data['status'] = 'completed'  # Mock: assume payment succeeds
        return super().create(validated_data)
