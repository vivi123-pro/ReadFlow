from django.db import models
from users.models import User
from django.utils import timezone

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
    
    READING_MODE_CHOICES = [
        ('direct', 'Direct Read'),
        ('story', 'Story Read'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=500)
    original_filename = models.CharField(max_length=500)
    file = models.FileField(upload_to='documents/')
    file_size = models.BigIntegerField()
    pages = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=UPLOADED)
    reading_mode = models.CharField(max_length=20, choices=READING_MODE_CHOICES, default='direct')
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} ({self.reading_mode})"

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
    chunk_index = models.IntegerField()
    content_type = models.CharField(max_length=10, choices=CONTENT_TYPES)
    content = models.TextField()
    image = models.ImageField(upload_to='chunk_images/', null=True, blank=True)
    reading_time = models.IntegerField(default=0)
    metadata = models.JSONField(default=dict, blank=True)
    
    class Meta:
        ordering = ['document', 'chunk_index']
        unique_together = ['document', 'chunk_index']
    
    def __str__(self):
        return f"Chunk {self.chunk_index} - {self.document.title}"

class ReadingSession(models.Model):
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    current_chunk = models.IntegerField(default=0)
    progress_percentage = models.FloatField(default=0.0)
    reading_speed_wpm = models.IntegerField(default=200)
    time_spent = models.IntegerField(default=0)  # seconds
    last_read_at = models.DateTimeField(auto_now=True)
    device_info = models.JSONField(default=dict, blank=True)
    
    class Meta:
        unique_together = ['user', 'document']
    
    def __str__(self):
        return f"{self.user.username} - {self.document.title} ({self.progress_percentage:.1f}%)"

class Bookmark(models.Model):
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    chunk = models.ForeignKey(ContentChunk, on_delete=models.CASCADE)
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'document', 'chunk']
    
    def __str__(self):
        return f"{self.user.username} - {self.document.title} - Chunk {self.chunk.chunk_index}"

class ReadingAnalytics(models.Model):
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    total_time_spent = models.IntegerField(default=0)
    completion_rate = models.FloatField(default=0.0)
    avg_reading_speed = models.IntegerField(default=200)
    preferred_reading_times = models.JSONField(default=list)  # hours of day
    engagement_score = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user', 'document']
    
    def __str__(self):
        return f"{self.user.username} - {self.document.title} Analytics"