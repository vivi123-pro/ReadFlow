from django.db.models import Q, Avg
from django.utils import timezone
from datetime import timedelta
from collections import Counter
import math
from .models import UserProfile
from documents.models import Document, ReadingAnalytics
from analytics.models import ReadingPattern, DocumentSimilarity

class IntelligentRecommendationEngine:
    """AI-powered recommendation system using behavioral learning"""
    
    def __init__(self, user):
        self.user = user
        self.profile = user.profile
        self.pattern = ReadingPattern.objects.filter(user=user).first()
    
    def get_personalized_recommendations(self, limit=10):
        """Generate personalized document recommendations"""
        # Get user's reading history
        read_docs = Document.objects.filter(
            readingsession__user=self.user
        ).values_list('id', flat=True)
        
        # Available documents (excluding already read)
        available_docs = Document.objects.filter(
            status='completed'
        ).exclude(id__in=read_docs)
        
        # Score documents based on multiple factors
        scored_docs = []
        for doc in available_docs:
            score = self._calculate_recommendation_score(doc)
            if score > 0.3:  # Minimum relevance threshold
                scored_docs.append((doc, score))
        
        # Sort by score and return top recommendations
        scored_docs.sort(key=lambda x: x[1], reverse=True)
        return [doc for doc, score in scored_docs[:limit]]
    
    def _calculate_recommendation_score(self, document):
        """Calculate recommendation score for a document"""
        score = 0.0
        
        # Interest alignment (40% weight)
        interest_score = self._calculate_interest_alignment(document)
        score += interest_score * 0.4
        
        # Reading pattern match (25% weight)
        pattern_score = self._calculate_pattern_match(document)
        score += pattern_score * 0.25
        
        # Content similarity (20% weight)
        similarity_score = self._calculate_content_similarity(document)
        score += similarity_score * 0.2
        
        # Trending factor (10% weight)
        trending_score = self._calculate_trending_score(document)
        score += trending_score * 0.1
        
        # Reading level appropriateness (5% weight)
        level_score = self._calculate_level_match(document)
        score += level_score * 0.05
        
        return min(score, 1.0)
    
    def _calculate_interest_alignment(self, document):
        """Score based on user's evolved interests"""
        doc_themes = set(document.metadata.get('themes', []))
        doc_categories = set(document.metadata.get('categories', []))
        doc_content = doc_themes.union(doc_categories)
        
        user_interests = set(self.profile.interests)
        
        if not user_interests or not doc_content:
            return 0.0
        
        # Calculate Jaccard similarity
        intersection = len(user_interests.intersection(doc_content))
        union = len(user_interests.union(doc_content))
        
        return intersection / union if union > 0 else 0.0
    
    def _calculate_pattern_match(self, document):
        """Score based on reading patterns"""
        if not self.pattern:
            return 0.5
        
        score = 0.0
        
        # Content type preference
        doc_categories = document.metadata.get('categories', [])
        preferred_types = self.pattern.preferred_content_types
        
        if preferred_types:
            type_match = len(set(doc_categories).intersection(set(preferred_types)))
            score += (type_match / len(preferred_types)) * 0.6
        
        # Reading mode preference
        if document.reading_mode == self.profile.preferred_reading_mode:
            score += 0.4
        
        return min(score, 1.0)
    
    def _calculate_content_similarity(self, document):
        """Score based on similarity to highly-rated content"""
        # Get user's high-engagement documents
        high_engagement_docs = ReadingAnalytics.objects.filter(
            user=self.user,
            engagement_score__gte=0.7
        ).values_list('document_id', flat=True)
        
        if not high_engagement_docs:
            return 0.5
        
        # Find similarity scores
        similarities = DocumentSimilarity.objects.filter(
            Q(document1=document, document2__in=high_engagement_docs) |
            Q(document2=document, document1__in=high_engagement_docs)
        )
        
        if similarities.exists():
            avg_similarity = similarities.aggregate(
                avg=Avg('similarity_score')
            )['avg']
            return avg_similarity or 0.0
        
        return 0.0
    
    def _calculate_trending_score(self, document):
        """Score based on recent popularity"""
        recent_reads = ReadingAnalytics.objects.filter(
            document=document,
            created_at__gte=timezone.now() - timedelta(days=30)
        ).count()
        
        # Normalize based on document age
        days_old = (timezone.now() - document.created_at).days
        age_factor = max(0.1, 1 - (days_old / 365))  # Newer docs get higher scores
        
        # Simple trending calculation
        trending_score = min(recent_reads / 10.0, 1.0) * age_factor
        return trending_score
    
    def _calculate_level_match(self, document):
        """Score based on reading level appropriateness"""
        doc_complexity = document.metadata.get('complexity_level', 'medium')
        user_level = self.profile.reading_level
        
        # Mapping complexity to user levels
        level_mapping = {
            'casual': ['simple', 'medium'],
            'detailed': ['medium', 'complex'],
            'academic': ['complex', 'advanced']
        }
        
        appropriate_levels = level_mapping.get(user_level, ['medium'])
        return 1.0 if doc_complexity in appropriate_levels else 0.3
    
    def get_discovery_recommendations(self, limit=5):
        """Recommend content outside user's usual interests for discovery"""
        # Get less common themes from user's reading history
        all_themes = []
        user_docs = Document.objects.filter(readingsession__user=self.user)
        
        for doc in user_docs:
            all_themes.extend(doc.metadata.get('themes', []))
        
        theme_counts = Counter(all_themes)
        rare_themes = [theme for theme, count in theme_counts.items() if count <= 2]
        
        # Find documents with rare themes
        discovery_docs = Document.objects.filter(
            status='completed',
            metadata__themes__overlap=rare_themes
        ).exclude(
            readingsession__user=self.user
        )[:limit]
        
        return list(discovery_docs)
    
    def get_reading_time_recommendations(self, available_minutes):
        """Recommend documents based on available reading time"""
        # Estimate reading time based on user's average speed
        user_speed = 200  # Default WPM
        
        if self.pattern:
            recent_analytics = ReadingAnalytics.objects.filter(
                user=self.user
            ).order_by('-created_at')[:5]
            
            if recent_analytics:
                user_speed = recent_analytics.aggregate(
                    avg=Avg('avg_reading_speed')
                )['avg'] or 200
        
        # Calculate word count range for available time
        target_words = available_minutes * user_speed
        word_range = (target_words * 0.8, target_words * 1.2)
        
        # Find documents in appropriate length range
        suitable_docs = Document.objects.filter(
            status='completed',
            metadata__estimated_words__range=word_range
        ).exclude(
            readingsession__user=self.user
        )
        
        # Score and return top matches
        recommendations = self.get_personalized_recommendations()
        time_appropriate = [doc for doc in recommendations if doc in suitable_docs]
        
        return time_appropriate[:5]