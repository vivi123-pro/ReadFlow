from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Document, ContentChunk
from .serializers import DocumentSerializer, ContentChunkSerializer, DocumentUploadSerializer
from .pdf_processor import PDFProcessor

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

class ContentChunkViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ContentChunkSerializer
    
    def get_queryset(self):
        return ContentChunk.objects.filter(document__user=self.request.user)