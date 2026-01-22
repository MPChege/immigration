from rest_framework import viewsets, permissions
from .models import Payment
from .serializers import PaymentSerializer, PaymentCreateSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return PaymentCreateSerializer
        return PaymentSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'admin':
            return Payment.objects.all()
        # Users can see payments for their bookings
        return Payment.objects.filter(booking__user=user)
