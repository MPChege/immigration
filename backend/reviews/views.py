from rest_framework import viewsets, permissions
from .models import Review
from .serializers import ReviewSerializer, ReviewCreateSerializer


class ReviewViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ReviewCreateSerializer
        return ReviewSerializer
    
    def get_queryset(self):
        service_provider_id = self.request.query_params.get('service_provider')
        if service_provider_id:
            return Review.objects.filter(service_provider_id=service_provider_id)
        user = self.request.user
        if user.user_type == 'admin':
            return Review.objects.all()
        return Review.objects.filter(user=user)
