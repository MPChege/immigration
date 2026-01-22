from rest_framework import serializers
from .models import Review
from accounts.serializers import UserSerializer, ServiceProviderSerializer
from bookings.serializers import BookingSerializer


class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    service_provider = ServiceProviderSerializer(read_only=True)
    booking = BookingSerializer(read_only=True)
    
    class Meta:
        model = Review
        fields = ('id', 'user', 'service_provider', 'booking', 'rating', 
                  'comment', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ('service_provider', 'booking', 'rating', 'comment')
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
