from rest_framework import serializers
from .models import Relocation
from accounts.serializers import UserSerializer


class RelocationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Relocation
        fields = ('id', 'user', 'user_id', 'origin', 'destination', 'moving_date', 
                  'inventory', 'status', 'estimated_cost', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
    
    def create(self, validated_data):
        # Set user from request if not provided
        if 'user_id' not in validated_data:
            validated_data['user'] = self.context['request'].user
        else:
            user_id = validated_data.pop('user_id')
            from accounts.models import User
            validated_data['user'] = User.objects.get(id=user_id)
        return super().create(validated_data)
