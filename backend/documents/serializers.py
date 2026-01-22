from rest_framework import serializers
from .models import Document
from accounts.serializers import UserSerializer
from relocations.serializers import RelocationSerializer


class DocumentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    relocation = RelocationSerializer(read_only=True)
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = ('id', 'user', 'relocation', 'document_name', 'document_type', 
                  'file_path', 'file_url', 'description', 'uploaded_at', 'updated_at')
        read_only_fields = ('id', 'uploaded_at', 'updated_at')
    
    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file_path and hasattr(obj.file_path, 'url'):
            return request.build_absolute_uri(obj.file_path.url) if request else None
        return None


class DocumentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ('relocation', 'document_name', 'document_type', 'file_path', 'description')
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
