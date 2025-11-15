from django.db.models import Avg, Sum, Count, Q
from django.utils import timezone
from datetime import timedelta, datetime
from collections import Counter
import json
from .models import UserProfile
from documents.models import ReadingSession, ReadingAnalytics, Document
from analytics.models import ReadingPattern

class UserLearningEngine:
    """Advanced behavioral learning system to evolve user profiles"""
    
    def __init__(self, user):
        self.user = user
        self.profile = user.profile
        self.pattern, _ = ReadingPattern.objects.get_or_create(user=user)
    
    def analyze_reading_patterns(self):
        """Comprehensive reading pattern analysis"""
        sessions = ReadingSession.objects.filter(
            user=self.user,
            last_read_at__gte=timezone.now() - timedelta(days=90)
        ).select_related('document')
        
        if not sessions.exists():
            return
        
        # Analyze reading times
        reading_hours = [s.last_read_at.hour for s in sessions]
        self.pattern.preferred_times = list(Counter(reading_hours).most_common(3))
        
        # Calculate average session duration
        avg_duration = sessions.aggregate(avg=Avg('time_spent'))['avg'] or 0
        self.pattern.avg_session_duration = int(avg_duration / 60)  # Convert to minutes
        
        # Analyze content preferences
        content_types = []
        for session in sessions:
            doc_meta = session.document.metadata
            content_types.extend(doc_meta.get('categories', []))
            content_types.extend(doc_meta.get('themes', []))
        
        self.pattern.preferred_content_types = [item[0] for item in Counter(content_types).most_common(5)]
        self.pattern.save()
    
    def evolve_interests_from_behavior(self):
        """Advanced interest evolution based on multiple behavioral signals"""
        # Weight different engagement signals
        high_engagement = ReadingAnalytics.objects.filter(
            user=self.user,
            engagement_score__gte=0.7,
            completion_rate__gte=60
        ).select_related('document')
        
        bookmarked_docs = Document.objects.filter(
            bookmark__user=self.user
        ).distinct()
        
        # Extract weighted interests
        interest_weights = {}
        
        # High engagement content (weight: 3)
        for analytics in high_engagement:
            themes = analytics.document.metadata.get('themes', [])
            for theme in themes[:3]:
                interest_weights[theme] = interest_weights.get(theme, 0) + 3
        
        # Bookmarked content (weight: 2)
        for doc in bookmarked_docs:
            themes = doc.metadata.get('themes', [])
            for theme in themes[:2]:
                interest_weights[theme] = interest_weights.get(theme, 0) + 2
        
        # Recent reading sessions (weight: 1)
        recent_sessions = ReadingSession.objects.filter(
            user=self.user,
            last_read_at__gte=timezone.now() - timedelta(days=14)
        ).select_related('document')
        
        for session in recent_sessions:
            themes = session.document.metadata.get('themes', [])
            for theme in themes[:1]:
                interest_weights[theme] = interest_weights.get(theme, 0) + 1
        
        # Update interests based on weighted scores
        sorted_interests = sorted(interest_weights.items(), key=lambda x: x[1], reverse=True)
        new_interests = [interest for interest, weight in sorted_interests[:8] if weight >= 3]
        
        # Merge with existing interests, keeping high-weight ones
        current_interests = set(self.profile.interests)
        evolved_interests = list(current_interests.union(set(new_interests)))[:8]
        
        self.profile.interests = evolved_interests
        self.profile.save()
    
    def adaptive_reading_level(self):
        """Dynamically adjust reading level based on performance metrics"""
        analytics = ReadingAnalytics.objects.filter(
            user=self.user,
            created_at__gte=timezone.now() - timedelta(days=30)
        )
        
        if not analytics.exists():
            return
        
        avg_completion = analytics.aggregate(avg=Avg('completion_rate'))['avg']
        avg_engagement = analytics.aggregate(avg=Avg('engagement_score'))['avg']
        avg_speed = analytics.aggregate(avg=Avg('avg_reading_speed'))['avg']
        
        # Multi-factor level adjustment
        level_score = 0
        
        if avg_completion > 85: level_score += 1
        if avg_engagement > 0.8: level_score += 1
        if avg_speed > 250: level_score += 1
        
        if level_score >= 2 and self.profile.reading_level == 'casual':
            self.profile.reading_level = 'detailed'
        elif level_score >= 3 and self.profile.reading_level == 'detailed':
            self.profile.reading_level = 'academic'
        elif level_score <= 1 and self.profile.reading_level in ['detailed', 'academic']:
            self.profile.reading_level = 'casual'
        
        self.profile.save()
    
    def learn_from_session(self, session):
        """Real-time learning from individual sessions"""
        # Update reading streak
        today = timezone.now().date()
        if self.pattern.last_read_date != today:
            if self.pattern.last_read_date == today - timedelta(days=1):
                self.pattern.reading_streak += 1
            else:
                self.pattern.reading_streak = 1
            self.pattern.last_read_date = today
            self.pattern.save()
        
        # Immediate interest learning for high-engagement sessions
        if session.progress_percentage > 75 and session.time_spent > 300:
            doc_themes = session.document.metadata.get('themes', [])
            for theme in doc_themes[:1]:
                if theme not in self.profile.interests and len(self.profile.interests) < 8:
                    self.profile.interests.append(theme)
                    self.profile.save()
                    break
    
    def get_behavioral_insights(self):
        """Generate insights about user reading behavior"""
        insights = {
            'reading_streak': self.pattern.reading_streak,
            'preferred_times': dict(self.pattern.preferred_times) if self.pattern.preferred_times else {},
            'avg_session_minutes': self.pattern.avg_session_duration,
            'top_content_types': self.pattern.preferred_content_types[:3],
            'reading_consistency': self._calculate_consistency(),
            'engagement_trend': self._calculate_engagement_trend()
        }
        return insights
    
    def _calculate_consistency(self):
        """Calculate reading consistency score (0-1)"""
        sessions = ReadingSession.objects.filter(
            user=self.user,
            last_read_at__gte=timezone.now() - timedelta(days=30)
        )
        
        if sessions.count() < 5:
            return 0.0
        
        # Check how many days in the last 30 had reading activity
        reading_days = set(s.last_read_at.date() for s in sessions)
        consistency = len(reading_days) / 30.0
        return min(consistency, 1.0)
    
    def _calculate_engagement_trend(self):
        """Calculate if engagement is improving, stable, or declining"""
        recent_analytics = ReadingAnalytics.objects.filter(
            user=self.user,
            created_at__gte=timezone.now() - timedelta(days=60)
        ).order_by('created_at')
        
        if recent_analytics.count() < 4:
            return 'insufficient_data'
        
        # Split into two periods and compare
        mid_point = recent_analytics.count() // 2
        early_period = recent_analytics[:mid_point]
        recent_period = recent_analytics[mid_point:]
        
        early_avg = early_period.aggregate(avg=Avg('engagement_score'))['avg'] or 0
        recent_avg = recent_period.aggregate(avg=Avg('engagement_score'))['avg'] or 0
        
        if recent_avg > early_avg + 0.1:
            return 'improving'
        elif recent_avg < early_avg - 0.1:
            return 'declining'
        else:
            return 'stable'
    
    def full_profile_evolution(self):
        """Run complete behavioral learning cycle"""
        self.analyze_reading_patterns()
        self.evolve_interests_from_behavior()
        self.adaptive_reading_level()
        return self.get_behavioral_insights()