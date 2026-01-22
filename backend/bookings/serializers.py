from rest_framework import serializers
from .models import Booking
from accounts.serializers import UserSerializer, ServiceProviderSerializer
from relocations.serializers import RelocationSerializer


class BookingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    service_provider = ServiceProviderSerializer(read_only=True)
    relocation = RelocationSerializer(read_only=True)
    
    class Meta:
        model = Booking
        fields = ('id', 'user', 'service_provider', 'relocation', 'service_type', 
                  'booking_date', 'status', 'total_amount', 'notes', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ('service_provider', 'relocation', 'service_type', 'booking_date', 'total_amount', 'notes')
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
