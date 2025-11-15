from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from .models import ReadingPattern, ContentRecommendation, DocumentSimilarity
from documents.models import Document, ReadingSession, ReadingAnalytics
from documents.ai_processor import AIStoryTransformer

class AnalyticsViewSet(viewsets.ViewSet):
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get comprehensive reading dashboard"""
        user = request.user
        
        # Reading stats
        total_documents = Document.objects.filter(user=user).count()
        completed_documents = ReadingAnalytics.objects.filter(
            user=user, completion_rate__gte=90
        ).count()
        
        # Recent activity
        recent_sessions = ReadingSession.objects.filter(
            user=user, last_read_at__gte=timezone.now() - timedelta(days=7)
        ).count()
        
        # Reading streak
        pattern, _ = ReadingPattern.objects.get_or_create(user=user)
        
        # Time spent this week
        week_analytics = ReadingAnalytics.objects.filter(
            user=user, updated_at__gte=timezone.now() - timedelta(days=7)
        )
        total_time_week = sum(a.total_time_spent for a in week_analytics) // 60  # minutes
        
        return Response({
            'total_documents': total_documents,
            'completed_documents': completed_documents,
            'completion_rate': (completed_documents / total_documents * 100) if total_documents > 0 else 0,
            'recent_sessions': recent_sessions,
            'reading_streak': pattern.reading_streak,
            'time_spent_week': total_time_week,
            'preferred_reading_times': pattern.preferred_times[:3]
        })
    
    @action(detail=False, methods=['get'])
    def discover(self, request):
        """Content discovery based on reading patterns"""
        user = request.user
        
        # Get user's completed documents
        completed_docs = Document.objects.filter(
            user=user,
            id__in=ReadingAnalytics.objects.filter(
                user=user, completion_rate__gte=70
            ).values_list('document_id', flat=True)
        )
        
        # Find similar documents from other users (simplified)
        similar_docs = Document.objects.exclude(user=user).filter(
            reading_mode__in=completed_docs.values_list('reading_mode', flat=True)
        )[:5]
        
        # Generate AI recommendations
        try:
            user_interests = user.profile.interests
            ai_transformer = AIStoryTransformer()
            ai_recommendations = ai_transformer.generate_recommendations(
                user_interests, 
                list(completed_docs.values_list('title', flat=True)[:3])
            )
        except:
            ai_recommendations = "Explore more documents to get personalized recommendations."
        
        return Response({
            'similar_documents': [
                {'title': doc.title, 'reading_mode': doc.reading_mode} 
                for doc in similar_docs
            ],
            'ai_recommendations': ai_recommendations,
            'trending_topics': self._get_trending_topics()
        })
    
    def _get_trending_topics(self):
        """Get trending topics based on recent uploads"""
        recent_docs = Document.objects.filter(
            created_at__gte=timezone.now() - timedelta(days=30)
        ).values_list('title', flat=True)[:10]
        
        # Simple keyword extraction (in production, use NLP)
        topics = []
        for title in recent_docs:
            words = title.lower().split()
            topics.extend([w for w in words if len(w) > 4])
        
        # Count frequency
        from collections import Counter
        trending = Counter(topics).most_common(5)
        return [topic for topic, count in trending]