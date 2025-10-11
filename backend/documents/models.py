from django.db import models
from users.models import User

class Document(models.Model):
    UPLOADED = 'uploaded'
    PROCESSING = 'processing'
    COMPLETED = 'completed'
    FAILED = 'failed'
    
    STATUS_CHOICES = [
        (UPLOADED, 'Uploaded'),
        (PROCESSING, 'Processing'),
        (COMPLETED, 'Completed'),
        (FAILED, 'Failed'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=500)
    original_filename = models.CharField(max_length=500)
    file = models.FileField(upload_to='documents/')
    file_size = models.BigIntegerField()
    pages = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=UPLOADED)
    metadata = models.JSONField(default=dict, blank=True)  # author, chapters, etc.
    created_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']

class ContentChunk(models.Model):
    TEXT = 'text'
    IMAGE = 'image'
    MIXED = 'mixed'
    
    CONTENT_TYPES = [
        (TEXT, 'Text'),
        (IMAGE, 'Image'),
        (MIXED, 'Mixed'),
    ]
    
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='chunks')
    chunk_index = models.IntegerField()  # Order in document
    content_type = models.CharField(max_length=10, choices=CONTENT_TYPES)
    content = models.TextField()  # Text content or image description
    image = models.ImageField(upload_to='chunk_images/', null=True, blank=True)
    reading_time = models.IntegerField(default=0)  # Estimated seconds to read
    metadata = models.JSONField(default=dict, blank=True)  # page_num, position, etc.
    
    class Meta:
        ordering = ['document', 'chunk_index']
        unique_together = ['document', 'chunk_index']