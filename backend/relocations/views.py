from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Relocation
from .serializers import RelocationSerializer


class RelocationViewSet(viewsets.ModelViewSet):
    serializer_class = RelocationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'admin':
            return Relocation.objects.all()
        return Relocation.objects.filter(user=user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def calculate_quotation(self, request, pk=None):
        """Calculate estimated cost for relocation"""
        relocation = self.get_object()
        # Simple calculation based on distance (mock implementation)
        # In production, this would use actual distance calculation APIs
        base_cost = 500.00
        estimated_cost = base_cost + (len(relocation.inventory.split(',')) * 50)
        relocation.estimated_cost = estimated_cost
        relocation.save()
        return Response({
            'estimated_cost': estimated_cost,
            'message': 'Quotation calculated successfully'
        })
