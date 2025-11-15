from django.db.models import Avg, Count, Sum, Q
from django.utils import timezone
from datetime import timedelta, datetime
from collections import defaultdict
import json
from users.models import User
from documents.models import ReadingSession, ReadingAnalytics, Document
from .models import ReadingPattern

class BehavioralAnalyticsService:
    """Advanced behavioral analytics for reading patterns"""
    
    @staticmethod
    def track_reading_behavior(user, session):
        """Track and update reading behavior in real-time"""
        # Update reading analytics
        analytics, created = ReadingAnalytics.objects.get_or_create(
            user=user,
            document=session.document,
            defaults={
                'total_time_spent': session.time_spent,
                'completion_rate': session.progress_percentage,
                'avg_reading_speed': session.reading_speed_wpm,
                'engagement_score': BehavioralAnalyticsService._calculate_engagement_score(session)
            }
        )
        
        if not created:
            # Update existing analytics
            analytics.total_time_spent += session.time_spent
            analytics.completion_rate = max(analytics.completion_rate, session.progress_percentage)
            analytics.avg_reading_speed = (analytics.avg_reading_speed + session.reading_speed_wpm) / 2
            analytics.engagement_score = BehavioralAnalyticsService._calculate_engagement_score(session)
            analytics.save()
        
        # Update reading times preference
        reading_hour = session.last_read_at.hour
        current_times = analytics.preferred_reading_times or []
        current_times.append(reading_hour)
        analytics.preferred_reading_times = current_times[-20:]  # Keep last 20 sessions
        analytics.save()
    
    @staticmethod
    def _calculate_engagement_score(session):
        """Calculate engagement score based on multiple factors"""
        score = 0.0
        
        # Progress factor (0-0.4)
        progress_factor = min(session.progress_percentage / 100.0, 1.0) * 0.4
        score += progress_factor
        
        # Time spent factor (0-0.3)
        # Assume 5 minutes is baseline engagement
        time_factor = min(session.time_spent / 300.0, 1.0) * 0.3
        score += time_factor
        
        # Reading speed consistency (0-0.2)
        # Penalize extremely fast or slow reading
        if 150 <= session.reading_speed_wpm <= 300:
            speed_factor = 0.2
        else:
            speed_factor = 0.1
        score += speed_factor
        
        # Session completion (0-0.1)
        if session.progress_percentage > 90:
            score += 0.1
        
        return min(score, 1.0)
    
    @staticmethod
    def analyze_user_patterns(user):
        """Comprehensive analysis of user reading patterns"""
        sessions = ReadingSession.objects.filter(
            user=user,
            last_read_at__gte=timezone.now() - timedelta(days=90)
        ).select_related('document')
        
        if not sessions.exists():
            return {}
        
        analysis = {
            'reading_frequency': BehavioralAnalyticsService._analyze_frequency(sessions),
            'content_preferences': BehavioralAnalyticsService._analyze_content_preferences(sessions),
            'reading_times': BehavioralAnalyticsService._analyze_reading_times(sessions),
            'engagement_patterns': BehavioralAnalyticsService._analyze_engagement_patterns(user),
            'completion_trends': BehavioralAnalyticsService._analyze_completion_trends(sessions),
            'reading_speed_profile': BehavioralAnalyticsService._analyze_reading_speed(sessions)
        }
        
        return analysis
    
    @staticmethod
    def _analyze_frequency(sessions):
        """Analyze reading frequency patterns"""
        # Group sessions by date
        daily_sessions = defaultdict(int)
        for session in sessions:
            date_key = session.last_read_at.date()
            daily_sessions[date_key] += 1
        
        # Calculate statistics
        session_counts = list(daily_sessions.values())
        if not session_counts:
            return {'frequency': 'no_data'}
        
        avg_daily = sum(session_counts) / len(session_counts)
        max_daily = max(session_counts)
        
        # Determine frequency category
        if avg_daily >= 3:
            frequency = 'heavy'
        elif avg_daily >= 1:
            frequency = 'regular'
        elif avg_daily >= 0.3:
            frequency = 'moderate'
        else:
            frequency = 'light'
        
        return {
            'frequency': frequency,
            'avg_daily_sessions': round(avg_daily, 2),
            'max_daily_sessions': max_daily,
            'active_days': len(daily_sessions)
        }
    
    @staticmethod
    def _analyze_content_preferences(sessions):
        """Analyze content type and theme preferences"""
        themes = []
        categories = []
        reading_modes = []
        
        for session in sessions:
            doc_meta = session.document.metadata
            themes.extend(doc_meta.get('themes', []))
            categories.extend(doc_meta.get('categories', []))
            reading_modes.append(session.document.reading_mode)
        
        # Count preferences
        from collections import Counter
        theme_counts = Counter(themes)
        category_counts = Counter(categories)
        mode_counts = Counter(reading_modes)
        
        return {
            'top_themes': theme_counts.most_common(5),
            'top_categories': category_counts.most_common(3),
            'preferred_mode': mode_counts.most_common(1)[0] if mode_counts else None,
            'content_diversity': len(set(themes)) / max(len(themes), 1)
        }
    
    @staticmethod
    def _analyze_reading_times(sessions):
        """Analyze preferred reading times and patterns"""
        hours = [session.last_read_at.hour for session in sessions]
        days = [session.last_read_at.weekday() for session in sessions]
        
        from collections import Counter
        hour_counts = Counter(hours)
        day_counts = Counter(days)
        
        # Determine time preferences
        peak_hours = hour_counts.most_common(3)
        peak_days = day_counts.most_common(3)
        
        # Categorize reading times
        morning_reads = sum(1 for h in hours if 6 <= h < 12)
        afternoon_reads = sum(1 for h in hours if 12 <= h < 18)
        evening_reads = sum(1 for h in hours if 18 <= h < 24)
        night_reads = sum(1 for h in hours if 0 <= h < 6)
        
        total_reads = len(hours)
        time_distribution = {
            'morning': morning_reads / total_reads if total_reads > 0 else 0,
            'afternoon': afternoon_reads / total_reads if total_reads > 0 else 0,
            'evening': evening_reads / total_reads if total_reads > 0 else 0,
            'night': night_reads / total_reads if total_reads > 0 else 0
        }
        
        return {
            'peak_hours': peak_hours,
            'peak_days': peak_days,
            'time_distribution': time_distribution,
            'consistency_score': BehavioralAnalyticsService._calculate_time_consistency(hours)
        }
    
    @staticmethod
    def _analyze_engagement_patterns(user):
        """Analyze engagement patterns across different content"""
        analytics = ReadingAnalytics.objects.filter(user=user)
        
        if not analytics.exists():
            return {}
        
        # Group by content characteristics
        theme_engagement = defaultdict(list)
        category_engagement = defaultdict(list)
        
        for analytic in analytics:
            doc_meta = analytic.document.metadata
            themes = doc_meta.get('themes', [])
            categories = doc_meta.get('categories', [])
            
            for theme in themes:
                theme_engagement[theme].append(analytic.engagement_score)
            
            for category in categories:
                category_engagement[category].append(analytic.engagement_score)
        
        # Calculate average engagement by theme/category
        avg_theme_engagement = {
            theme: sum(scores) / len(scores)
            for theme, scores in theme_engagement.items()
            if len(scores) >= 2  # Minimum 2 data points
        }
        
        avg_category_engagement = {
            category: sum(scores) / len(scores)
            for category, scores in category_engagement.items()
            if len(scores) >= 2
        }
        
        return {
            'high_engagement_themes': sorted(avg_theme_engagement.items(), 
                                           key=lambda x: x[1], reverse=True)[:5],
            'high_engagement_categories': sorted(avg_category_engagement.items(), 
                                               key=lambda x: x[1], reverse=True)[:3],
            'overall_engagement': analytics.aggregate(avg=Avg('engagement_score'))['avg'] or 0
        }
    
    @staticmethod
    def _analyze_completion_trends(sessions):
        """Analyze document completion trends over time"""
        # Sort sessions by date
        sorted_sessions = sorted(sessions, key=lambda s: s.last_read_at)
        
        if len(sorted_sessions) < 5:
            return {'trend': 'insufficient_data'}
        
        # Split into periods and compare
        mid_point = len(sorted_sessions) // 2
        early_sessions = sorted_sessions[:mid_point]
        recent_sessions = sorted_sessions[mid_point:]
        
        early_avg = sum(s.progress_percentage for s in early_sessions) / len(early_sessions)
        recent_avg = sum(s.progress_percentage for s in recent_sessions) / len(recent_sessions)
        
        # Determine trend
        if recent_avg > early_avg + 10:
            trend = 'improving'
        elif recent_avg < early_avg - 10:
            trend = 'declining'
        else:
            trend = 'stable'
        
        return {
            'trend': trend,
            'early_avg_completion': round(early_avg, 1),
            'recent_avg_completion': round(recent_avg, 1),
            'completion_rate_change': round(recent_avg - early_avg, 1)
        }
    
    @staticmethod
    def _analyze_reading_speed(sessions):
        """Analyze reading speed patterns and consistency"""
        speeds = [s.reading_speed_wpm for s in sessions if s.reading_speed_wpm > 0]
        
        if not speeds:
            return {'profile': 'no_data'}
        
        avg_speed = sum(speeds) / len(speeds)
        min_speed = min(speeds)
        max_speed = max(speeds)
        
        # Calculate speed consistency (coefficient of variation)
        if avg_speed > 0:
            speed_variance = sum((s - avg_speed) ** 2 for s in speeds) / len(speeds)
            speed_std = speed_variance ** 0.5
            consistency = 1 - (speed_std / avg_speed)  # Higher = more consistent
        else:
            consistency = 0
        
        # Categorize reading speed
        if avg_speed >= 300:
            speed_category = 'fast'
        elif avg_speed >= 200:
            speed_category = 'average'
        else:
            speed_category = 'slow'
        
        return {
            'profile': speed_category,
            'avg_wpm': round(avg_speed, 0),
            'speed_range': (min_speed, max_speed),
            'consistency_score': round(consistency, 2),
            'speed_trend': BehavioralAnalyticsService._calculate_speed_trend(speeds)
        }
    
    @staticmethod
    def _calculate_time_consistency(hours):
        """Calculate how consistent reading times are"""
        if len(hours) < 3:
            return 0.0
        
        from collections import Counter
        hour_counts = Counter(hours)
        
        # Calculate entropy (lower = more consistent)
        total = len(hours)
        entropy = -sum((count/total) * math.log2(count/total) 
                      for count in hour_counts.values())
        
        # Normalize to 0-1 scale (1 = very consistent)
        max_entropy = math.log2(24)  # Maximum possible entropy for 24 hours
        consistency = 1 - (entropy / max_entropy)
        
        return round(consistency, 2)
    
    @staticmethod
    def _calculate_speed_trend(speeds):
        """Calculate if reading speed is improving over time"""
        if len(speeds) < 4:
            return 'insufficient_data'
        
        # Simple linear trend calculation
        n = len(speeds)
        x_sum = sum(range(n))
        y_sum = sum(speeds)
        xy_sum = sum(i * speed for i, speed in enumerate(speeds))
        x2_sum = sum(i * i for i in range(n))
        
        # Calculate slope
        slope = (n * xy_sum - x_sum * y_sum) / (n * x2_sum - x_sum * x_sum)
        
        if slope > 5:
            return 'improving'
        elif slope < -5:
            return 'declining'
        else:
            return 'stable'