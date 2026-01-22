from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User, ServiceProvider
from .serializers import (
    UserRegistrationSerializer, UserSerializer, 
    ServiceProviderSerializer, ServiceProviderRegistrationSerializer
)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    """Register a new user"""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_service_provider(request):
    """Register a new service provider"""
    serializer = ServiceProviderRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        service_provider = serializer.save()
        refresh = RefreshToken.for_user(service_provider.user)
        return Response({
            'service_provider': ServiceProviderSerializer(service_provider).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login(request):
    """User login"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Username and password are required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(username=username, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        user_data = UserSerializer(user).data
        
        # Include service provider info if applicable
        response_data = {
            'user': user_data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
        
        if user.user_type == 'service_provider':
            try:
                service_provider = ServiceProvider.objects.get(user=user)
                response_data['service_provider'] = ServiceProviderSerializer(service_provider).data
            except ServiceProvider.DoesNotExist:
                pass
        
        return Response(response_data, status=status.HTTP_200_OK)
    
    return Response(
        {'error': 'Invalid credentials'}, 
        status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_current_user(request):
    """Get current authenticated user"""
    serializer = UserSerializer(request.user)
    response_data = {'user': serializer.data}
    
    if request.user.user_type == 'service_provider':
        try:
            service_provider = ServiceProvider.objects.get(user=request.user)
            response_data['service_provider'] = ServiceProviderSerializer(service_provider).data
        except ServiceProvider.DoesNotExist:
            pass
    
    return Response(response_data)


class UserListView(generics.ListAPIView):
    """List all users (Admin only)"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.user_type != 'admin':
            return User.objects.none()
        return super().get_queryset()


class ServiceProviderListView(generics.ListAPIView):
    """List all service providers"""
    queryset = ServiceProvider.objects.filter(availability=True)
    serializer_class = ServiceProviderSerializer
    permission_classes = [permissions.AllowAny]


class ServiceProviderDetailView(generics.RetrieveAPIView):
    """Get service provider details"""
    queryset = ServiceProvider.objects.all()
    serializer_class = ServiceProviderSerializer
    permission_classes = [permissions.AllowAny]
