from .ai_processor import AIStoryTransformer
from .models import Document, ContentChunk
from django.conf import settings

class StoryTransformationEngine:
    """Core engine for transforming documents into personalized stories"""
    
    def __init__(self):
        self.ai_processor = AIStoryTransformer()
    
    def transform_document(self, document, user_profile):
        """Transform entire document based on user interests and reading level"""
        chunks = document.chunks.all().order_by('chunk_index')
        transformed_chunks = []
        
        for chunk in chunks:
            if chunk.content_type == 'text':
                transformed_content = self.ai_processor.transform_to_story(
                    chunk.content,
                    user_profile.interests,
                    user_profile.reading_level
                )
                transformed_chunks.append({
                    'chunk_index': chunk.chunk_index,
                    'original_content': chunk.content,
                    'transformed_content': transformed_content,
                    'reading_time': self._calculate_reading_time(transformed_content)
                })
        
        return transformed_chunks
    
    def enhance_chunk_with_context(self, chunk, user_interests, reading_level):
        """Add contextual enhancements to a single chunk"""
        return self.ai_processor.add_contextual_enhancements(
            chunk.content, user_interests, reading_level
        )
    
    def generate_connections(self, chunk, user_interests):
        """Generate connections between content and user interests"""
        return self.ai_processor.highlight_connections(chunk.content, user_interests)
    
    def _calculate_reading_time(self, text, wpm=200):
        """Calculate estimated reading time in minutes"""
        word_count = len(text.split())
        return max(1, round(word_count / wpm))