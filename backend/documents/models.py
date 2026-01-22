from django.db import models
from accounts.models import User
from relocations.models import Relocation


class Document(models.Model):
    DOCUMENT_TYPE_CHOICES = [
        ('contract', 'Contract'),
        ('invoice', 'Invoice'),
        ('insurance', 'Insurance'),
        ('passport', 'Passport'),
        ('visa', 'Visa'),
        ('other', 'Other'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='documents')
    relocation = models.ForeignKey(Relocation, on_delete=models.CASCADE, related_name='documents', null=True, blank=True)
    document_name = models.CharField(max_length=255)
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPE_CHOICES, default='other')
    file_path = models.FileField(upload_to='documents/')
    description = models.TextField(null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'documents'
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.document_name} - {self.user.username}"
