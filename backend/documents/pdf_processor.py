import pdfplumber
from django.utils import timezone
from .ai_processor import AIStoryTransformer
from .models import Document, ContentChunk

class PDFProcessor:
    def __init__(self, document_id):
        self.document_id = document_id
        self.document = Document.objects.get(id=document_id)
        self.ai_transformer = AIStoryTransformer()
    
    def process_story_mode(self):
        """Enhanced story mode with AI transformation"""
        chunks = []
        chunk_index = 0
        
        with pdfplumber.open(self.document.file.path) as pdf:
            self.document.pages = len(pdf.pages)
            self.document.save()
            
            # Get user interests from profile
            user_interests = self.get_user_interests()
            reading_level = self.get_reading_level()
            
            for page_num, page in enumerate(pdf.pages, 1):
                text = page.extract_text() or ""
                
                if text.strip():
                    # Split into logical sections for AI processing
                    sections = self.split_into_sections(text)
                    
                    for section in sections:
                        if len(section.strip()) > 50:  # Only process substantial content
                            # Transform with AI
                            story_content = self.ai_transformer.transform_to_story(
                                section, user_interests, reading_level
                            )
                            
                            chunks.append({
                                'chunk_index': chunk_index,
                                'content_type': ContentChunk.TEXT,
                                'content': story_content,
                                'reading_time': self.estimate_reading_time(story_content),
                                'metadata': {
                                    'page_number': page_num,
                                    'word_count': len(story_content.split()),
                                    'char_count': len(story_content),
                                    'chunk_type': 'ai_enhanced_story',
                                    'reading_mode': 'story',
                                    'is_enhanced': True,
                                    'user_interests': user_interests,
                                    'reading_level': reading_level,
                                    'original_text_preview': section[:100] + '...' if len(section) > 100 else section
                                }
                            })
                            chunk_index += 1
        
        return chunks
    
    def get_user_interests(self):
        """Get user interests from profile"""
        try:
            user_profile = self.document.user.profile
            return user_profile.interests
        except:
            return ['technology']  # Default interest
    
    def get_reading_level(self):
        """Get user reading level from profile"""
        try:
            user_profile = self.document.user.profile
            return user_profile.reading_level
        except:
            return 'casual'  # Default level
    
    def split_into_sections(self, text):
        """Split text into logical sections for AI processing"""
        # Split by paragraphs first
        paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
        
        sections = []
        current_section = ""
        
        for para in paragraphs:
            # If paragraph is substantial, make it a section
            if len(para.split()) > 30:
                if current_section:
                    sections.append(current_section)
                sections.append(para)
                current_section = ""
            else:
                # Combine short paragraphs
                if current_section:
                    current_section += " " + para
                else:
                    current_section = para
        
        if current_section and len(current_section.split()) > 10:
            sections.append(current_section)
        
        return sections
    
    def process_document(self):
        """Main method to process document based on reading mode"""
        try:
            self.document.status = Document.PROCESSING
            self.document.save()
            
            if self.document.reading_mode == 'story':
                chunks = self.process_story_mode()
            else:
                chunks = self.process_direct_mode()
            
            # Save chunks to database
            for chunk_data in chunks:
                ContentChunk.objects.create(
                    document=self.document,
                    **chunk_data
                )
            
            self.document.status = Document.COMPLETED
            self.document.processed_at = timezone.now()
            self.document.save()
            
        except Exception as e:
            self.document.status = Document.FAILED
            self.document.save()
            raise e
    
    def process_direct_mode(self):
        """Process document in direct reading mode"""
        chunks = []
        chunk_index = 0
        
        with pdfplumber.open(self.document.file.path) as pdf:
            self.document.pages = len(pdf.pages)
            self.document.save()
            
            for page_num, page in enumerate(pdf.pages, 1):
                text = page.extract_text() or ""
                
                if text.strip():
                    chunks.append({
                        'chunk_index': chunk_index,
                        'content_type': ContentChunk.TEXT,
                        'content': text,
                        'reading_time': self.estimate_reading_time(text),
                        'metadata': {
                            'page_number': page_num,
                            'word_count': len(text.split()),
                            'char_count': len(text),
                            'chunk_type': 'direct_text',
                            'reading_mode': 'direct'
                        }
                    })
                    chunk_index += 1
        
        return chunks
    
    def estimate_reading_time(self, text):
        """Estimate reading time in seconds (average 200 words per minute)"""
        word_count = len(text.split())
        return max(1, int((word_count / 200) * 60))