from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Shipment
from .serializers import ShipmentSerializer, ShipmentCreateSerializer


class ShipmentViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ShipmentCreateSerializer
        return ShipmentSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'admin':
            return Shipment.objects.all()
        elif user.user_type == 'service_provider':
            from accounts.models import ServiceProvider
            try:
                service_provider = ServiceProvider.objects.get(user=user)
                return Shipment.objects.filter(booking__service_provider=service_provider)
            except ServiceProvider.DoesNotExist:
                return Shipment.objects.none()
        else:
            return Shipment.objects.filter(booking__user=user)
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update shipment status (for service providers)"""
        shipment = self.get_object()
        new_status = request.data.get('status')
        current_location = request.data.get('current_location')
        
        if new_status in dict(Shipment.STATUS_CHOICES).keys():
            shipment.status = new_status
            if current_location:
                shipment.current_location = current_location
            shipment.save()
            return Response({'message': 'Status updated successfully'})
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def track(self, request):
        """Track shipment by tracking number"""
        tracking_number = request.query_params.get('tracking_number')
        if tracking_number:
            try:
                shipment = Shipment.objects.get(tracking_number=tracking_number)
                serializer = self.get_serializer(shipment)
                return Response(serializer.data)
            except Shipment.DoesNotExist:
                return Response({'error': 'Shipment not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': 'Tracking number required'}, status=status.HTTP_400_BAD_REQUEST)
