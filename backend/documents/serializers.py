from rest_framework import serializers
from .models import Document, ContentChunk, ReadingSession, Bookmark, ReadingAnalytics

class ContentChunkSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentChunk
        fields = '__all__'

class DocumentSerializer(serializers.ModelSerializer):
    chunks = ContentChunkSerializer(many=True, read_only=True)
    
    class Meta:
        model = Document
        fields = '__all__'
        read_only_fields = ('user', 'status', 'processed_at', 'metadata', 'pages')

class DocumentUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
    title = serializers.CharField(max_length=500, required=False)
    reading_mode = serializers.ChoiceField(
        choices=Document.READING_MODE_CHOICES,
        default='direct'
    )
    
    def validate_file(self, value):
        if not value.name.lower().endswith('.pdf'):
            raise serializers.ValidationError("Only PDF files are allowed.")
        if value.size > 50 * 1024 * 1024:
            raise serializers.ValidationError("File size must be under 50MB.")
        return value
    
    def validate_reading_mode(self, value):
        # You can add validation logic here if needed
        return value

class ReadingSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReadingSession
        fields = '__all__'
        read_only_fields = ('user',)

class BookmarkSerializer(serializers.ModelSerializer):
    chunk_content = serializers.CharField(source='chunk.content', read_only=True)
    
    class Meta:
        model = Bookmark
        fields = '__all__'
        read_only_fields = ('user',)

class ReadingAnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReadingAnalytics
        fields = '__all__'
        read_only_fields = ('user',)

class ProgressUpdateSerializer(serializers.Serializer):
    current_chunk = serializers.IntegerField(min_value=0)
    time_spent = serializers.IntegerField(min_value=0)
    reading_speed_wpm = serializers.IntegerField(min_value=50, max_value=1000, required=False)
    device_info = serializers.JSONField(required=False)