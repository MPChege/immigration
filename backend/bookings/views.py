from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Booking
from .serializers import BookingSerializer, BookingCreateSerializer


class BookingViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return BookingCreateSerializer
        return BookingSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'admin':
            return Booking.objects.all()
        elif user.user_type == 'service_provider':
            from accounts.models import ServiceProvider
            try:
                service_provider = ServiceProvider.objects.get(user=user)
                return Booking.objects.filter(service_provider=service_provider)
            except ServiceProvider.DoesNotExist:
                return Booking.objects.none()
        else:
            return Booking.objects.filter(user=user)
    
    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm a booking"""
        booking = self.get_object()
        if booking.status == 'pending':
            booking.status = 'confirmed'
            booking.save()
            # Update relocation status
            booking.relocation.status = 'booked'
            booking.relocation.save()
            return Response({'message': 'Booking confirmed successfully'})
        return Response({'error': 'Booking cannot be confirmed'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a booking"""
        booking = self.get_object()
        if booking.status in ['pending', 'confirmed']:
            booking.status = 'cancelled'
            booking.save()
            return Response({'message': 'Booking cancelled successfully'})
        return Response({'error': 'Booking cannot be cancelled'}, status=status.HTTP_400_BAD_REQUEST)
