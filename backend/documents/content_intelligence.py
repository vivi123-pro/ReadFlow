from .models import Document, ContentChunk
from .ai_processor import AIStoryTransformer
import re
from collections import Counter

class ContentIntelligenceEngine:
    """Smart content analysis and processing engine"""
    
    def __init__(self):
        self.ai_processor = AIStoryTransformer()
    
    def analyze_document_structure(self, document):
        """Analyze document structure and extract metadata"""
        chunks = document.chunks.all()
        
        # Calculate document metrics
        total_words = sum(len(chunk.content.split()) for chunk in chunks)
        estimated_reading_time = max(1, total_words // 200)  # 200 WPM average
        
        # Extract themes and topics
        all_text = ' '.join(chunk.content for chunk in chunks)
        themes = self._extract_themes(all_text)
        
        # Update document metadata
        document.metadata.update({
            'total_words': total_words,
            'estimated_reading_time': estimated_reading_time,
            'themes': themes,
            'content_complexity': self._assess_complexity(all_text),
            'structure_type': self._detect_structure_type(chunks)
        })
        document.save()
        
        return document.metadata
    
    def chunk_content_intelligently(self, text, max_chunk_size=1000):
        """Split content into optimal reading chunks"""
        # Split by paragraphs first
        paragraphs = text.split('\n\n')
        chunks = []
        current_chunk = ""
        
        for paragraph in paragraphs:
            if len(current_chunk) + len(paragraph) <= max_chunk_size:
                current_chunk += paragraph + '\n\n'
            else:
                if current_chunk:
                    chunks.append(current_chunk.strip())
                current_chunk = paragraph + '\n\n'
        
        if current_chunk:
            chunks.append(current_chunk.strip())
        
        return chunks
    
    def _extract_themes(self, text):
        """Extract key themes from text"""
        # Simple keyword extraction - could be enhanced with NLP
        words = re.findall(r'\b[a-zA-Z]{4,}\b', text.lower())
        common_words = Counter(words).most_common(10)
        return [word for word, count in common_words if count > 2]
    
    def _assess_complexity(self, text):
        """Assess content complexity level"""
        sentences = text.split('.')
        avg_sentence_length = sum(len(s.split()) for s in sentences) / len(sentences)
        
        if avg_sentence_length < 15:
            return 'simple'
        elif avg_sentence_length < 25:
            return 'moderate'
        else:
            return 'complex'
    
    def _detect_structure_type(self, chunks):
        """Detect document structure type"""
        if len(chunks) < 5:
            return 'short_form'
        elif any('chapter' in chunk.content.lower() for chunk in chunks[:3]):
            return 'book_like'
        elif any('abstract' in chunk.content.lower() for chunk in chunks[:2]):
            return 'academic_paper'
        else:
            return 'standard_document'