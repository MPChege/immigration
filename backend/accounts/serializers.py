from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, ServiceProvider


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'first_name', 'last_name', 
                  'contact', 'address', 'user_type')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 
                  'contact', 'address', 'user_type', 'is_verified', 'date_joined')
        read_only_fields = ('id', 'date_joined', 'is_verified')


class ServiceProviderSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = ServiceProvider
        fields = ('id', 'user', 'company_name', 'contact_person', 'services_offered', 
                  'pricing_info', 'availability', 'rating', 'total_reviews', 
                  'created_at', 'updated_at')
        read_only_fields = ('id', 'rating', 'total_reviews', 'created_at', 'updated_at')


class ServiceProviderRegistrationSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    contact = serializers.CharField()
    address = serializers.CharField()
    company_name = serializers.CharField()
    contact_person = serializers.CharField()
    services_offered = serializers.CharField()
    pricing_info = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        user_data = {
            'username': validated_data['username'],
            'email': validated_data['email'],
            'password': validated_data['password'],
            'first_name': validated_data['first_name'],
            'last_name': validated_data['last_name'],
            'contact': validated_data['contact'],
            'address': validated_data['address'],
            'user_type': 'service_provider',
        }
        user = User.objects.create_user(**user_data)
        
        service_provider = ServiceProvider.objects.create(
            user=user,
            company_name=validated_data['company_name'],
            contact_person=validated_data['contact_person'],
            services_offered=validated_data['services_offered'],
            pricing_info=validated_data.get('pricing_info', ''),
        )
        return service_provider
