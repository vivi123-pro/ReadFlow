from django.db import models
from users.models import User
from documents.models import Document

class ReadingSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    current_chunk = models.IntegerField(default=0)
    progress = models.FloatField(default=0.0)  # 0.0 to 1.0
    bookmarks = models.JSONField(default=list)  # List of chunk indices
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user', 'document']

class UserPreferences(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    theme = models.CharField(max_length=20, default='light')  # light, dark, sepia
    font_size = models.IntegerField(default=16)  # px
    font_family = models.CharField(max_length=50, default='system-ui')
    line_height = models.FloatField(default=1.6)
    chunks_per_page = models.IntegerField(default=1)
    
    def __str__(self):
        return f"{self.user.username}'s preferences"