from rest_framework import serializers
from .models import Shipment
from bookings.serializers import BookingSerializer


class ShipmentSerializer(serializers.ModelSerializer):
    booking = BookingSerializer(read_only=True)
    
    class Meta:
        model = Shipment
        fields = ('id', 'booking', 'tracking_number', 'status', 'current_location', 
                  'estimated_delivery', 'actual_delivery', 'notes', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class ShipmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipment
        fields = ('booking', 'tracking_number', 'estimated_delivery', 'notes')
    
    def create(self, validated_data):
        import uuid
        if not validated_data.get('tracking_number'):
            validated_data['tracking_number'] = f"TRK-{uuid.uuid4().hex[:12].upper()}"
        return super().create(validated_data)
