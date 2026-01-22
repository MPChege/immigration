from django.contrib import admin
from .models import Document


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('document_name', 'user', 'document_type', 'relocation', 'uploaded_at')
    list_filter = ('document_type', 'uploaded_at')
    search_fields = ('document_name', 'user__username')
