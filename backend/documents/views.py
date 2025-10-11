from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Document, ContentChunk
from .serializers import DocumentSerializer, ContentChunkSerializer
from services.pdf_processor import PDFProcessor

class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    
    def get_queryset(self):
        return Document.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        document = serializer.save(user=self.request.user)
        # Start async processing (you can use Celery later)
        processor = PDFProcessor(document.id)
        processor.process_document()
    
    @action(detail=True, methods=['get'])
    def chunks(self, request, pk=None):
        document = self.get_object()
        chunks = document.chunks.all()
        serializer = ContentChunkSerializer(chunks, many=True)
        return Response(serializer.data)

class ContentChunkViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ContentChunkSerializer
    
    def get_queryset(self):
        return ContentChunk.objects.filter(
            document__user=self.request.user
        )