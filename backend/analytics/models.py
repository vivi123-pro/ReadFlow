from django.db import models
from users.models import User
from documents.models import Document

class ReadingPattern(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    preferred_times = models.JSONField(default=list)  # hours of day
    avg_session_duration = models.IntegerField(default=0)  # minutes
    preferred_content_types = models.JSONField(default=list)
    reading_streak = models.IntegerField(default=0)
    last_read_date = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.user.username} Reading Pattern"

class ContentRecommendation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recommended_topics = models.JSONField(default=list)
    similarity_score = models.FloatField(default=0.0)
    based_on_documents = models.ManyToManyField(Document, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Recommendations for {self.user.username}"

class DocumentSimilarity(models.Model):
    document1 = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='similarity_from')
    document2 = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='similarity_to')
    similarity_score = models.FloatField(default=0.0)
    common_themes = models.JSONField(default=list)
    
    class Meta:
        unique_together = ['document1', 'document2']
    
    def __str__(self):
        return f"{self.document1.title} <-> {self.document2.title} ({self.similarity_score:.2f})"