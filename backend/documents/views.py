from rest_framework import viewsets, permissions
from .models import Document
from .serializers import DocumentSerializer, DocumentCreateSerializer


class DocumentViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return DocumentCreateSerializer
        return DocumentSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'admin':
            return Document.objects.all()
        return Document.objects.filter(user=user)
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
