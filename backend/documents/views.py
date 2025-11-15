from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Document, ContentChunk, ReadingSession, Bookmark, ReadingAnalytics
from .serializers import (DocumentSerializer, ContentChunkSerializer, DocumentUploadSerializer,
                         ReadingSessionSerializer, BookmarkSerializer, ReadingAnalyticsSerializer,
                         ProgressUpdateSerializer)
from .pdf_processor import PDFProcessor
from users.learning_engine import UserLearningEngine

class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    
    def get_queryset(self):
        return Document.objects.filter(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        upload_serializer = DocumentUploadSerializer(data=request.data)
        
        if upload_serializer.is_valid():
            file = upload_serializer.validated_data['file']
            title = upload_serializer.validated_data.get('title') or file.name
            reading_mode = upload_serializer.validated_data.get('reading_mode', 'direct')
            
            # Create the document with reading mode
            document = Document.objects.create(
                user=request.user,
                title=title,
                original_filename=file.name,
                file=file,
                file_size=file.size,
                reading_mode=reading_mode
            )
            
            # Process the PDF based on selected mode
            try:
                processor = PDFProcessor(document.id)
                processor.process_document()
            except Exception as e:
                document.status = Document.FAILED
                document.save()
                return Response(
                    {'error': f'Failed to process PDF: {str(e)}'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            serializer = self.get_serializer(document)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(upload_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def chunks(self, request, pk=None):
        document = self.get_object()
        chunks = document.chunks.all()
        serializer = ContentChunkSerializer(chunks, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def reprocess(self, request, pk=None):
        """Reprocess document with different reading mode"""
        document = self.get_object()
        new_mode = request.data.get('reading_mode', 'direct')
        
        if new_mode not in [choice[0] for choice in Document.READING_MODE_CHOICES]:
            return Response(
                {'error': 'Invalid reading mode'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Delete existing chunks
        document.chunks.all().delete()
        
        # Update reading mode and reprocess
        document.reading_mode = new_mode
        document.status = Document.PROCESSING
        document.save()
        
        try:
            processor = PDFProcessor(document.id)
            processor.process_document()
            serializer = self.get_serializer(document)
            return Response(serializer.data)
        except Exception as e:
            document.status = Document.FAILED
            document.save()
            return Response(
                {'error': f'Failed to reprocess PDF: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['get', 'post'])
    def progress(self, request, pk=None):
        """Get or update reading progress"""
        document = self.get_object()
        session, created = ReadingSession.objects.get_or_create(
            user=request.user, document=document
        )
        
        if request.method == 'POST':
            serializer = ProgressUpdateSerializer(data=request.data)
            if serializer.is_valid():
                session.current_chunk = serializer.validated_data['current_chunk']
                session.time_spent += serializer.validated_data['time_spent']
                session.progress_percentage = (session.current_chunk / document.chunks.count()) * 100
                
                if 'reading_speed_wpm' in serializer.validated_data:
                    session.reading_speed_wpm = serializer.validated_data['reading_speed_wpm']
                if 'device_info' in serializer.validated_data:
                    session.device_info = serializer.validated_data['device_info']
                
                session.save()
                self._update_analytics(request.user, document, session)
                
                # Learn from user behavior
                learner = UserLearningEngine(request.user)
                learner.learn_from_session(session)
                
                return Response(ReadingSessionSerializer(session).data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(ReadingSessionSerializer(session).data)
    
    @action(detail=True, methods=['get', 'post', 'delete'])
    def bookmarks(self, request, pk=None):
        """Manage bookmarks for document"""
        document = self.get_object()
        
        if request.method == 'GET':
            bookmarks = Bookmark.objects.filter(user=request.user, document=document)
            return Response(BookmarkSerializer(bookmarks, many=True).data)
        
        elif request.method == 'POST':
            serializer = BookmarkSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=request.user, document=document)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        elif request.method == 'DELETE':
            chunk_id = request.data.get('chunk_id')
            if chunk_id:
                Bookmark.objects.filter(
                    user=request.user, document=document, chunk_id=chunk_id
                ).delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response({'error': 'chunk_id required'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def analytics(self, request, pk=None):
        """Get reading analytics for document"""
        document = self.get_object()
        analytics, created = ReadingAnalytics.objects.get_or_create(
            user=request.user, document=document
        )
        return Response(ReadingAnalyticsSerializer(analytics).data)
    
    @action(detail=False, methods=['get'])
    def recommendations(self, request):
        """Get personalized content recommendations"""
        try:
            user_interests = request.user.profile.interests
            reading_history = Document.objects.filter(user=request.user).values_list('title', flat=True)[:5]
            
            ai_transformer = AIStoryTransformer()
            recommendations = ai_transformer.generate_recommendations(user_interests, list(reading_history))
            
            return Response({'recommendations': recommendations})
        except Exception as e:
            return Response({'recommendations': 'Explore documents in your areas of interest for personalized suggestions.'})
    
    def _update_analytics(self, user, document, session):
        """Update reading analytics"""
        analytics, created = ReadingAnalytics.objects.get_or_create(
            user=user, document=document
        )
        
        analytics.total_time_spent = session.time_spent
        analytics.completion_rate = session.progress_percentage
        analytics.avg_reading_speed = session.reading_speed_wpm
        analytics.engagement_score = min(100, (session.time_spent / 60) * (session.progress_percentage / 100) * 10)
        
        current_hour = timezone.now().hour
        if current_hour not in analytics.preferred_reading_times:
            analytics.preferred_reading_times.append(current_hour)
        
        analytics.save()

class ContentChunkViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ContentChunkSerializer
    
    def get_queryset(self):
        return ContentChunk.objects.filter(document__user=self.request.user)
    
    @action(detail=True, methods=['get'])
    def enhance(self, request, pk=None):
        """Get enhanced version of chunk with contextual explanations"""
        chunk = self.get_object()
        try:
            user_interests = request.user.profile.interests
            reading_level = request.user.profile.reading_level
            
            ai_transformer = AIStoryTransformer()
            enhanced_content = ai_transformer.add_contextual_enhancements(
                chunk.content, user_interests, reading_level
            )
            connections = ai_transformer.highlight_connections(chunk.content, user_interests)
            
            return Response({
                'original_content': chunk.content,
                'enhanced_content': enhanced_content,
                'connections': connections
            })
        except Exception as e:
            return Response({
                'original_content': chunk.content,
                'enhanced_content': chunk.content,
                'connections': 'Unable to generate connections at this time.'
            })