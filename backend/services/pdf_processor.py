import os
import pdfplumber
from PIL import Image
import io
from django.core.files.base import ContentFile
from documents.models import Document, ContentChunk

class PDFProcessor:
    def __init__(self, document_id):
        self.document_id = document_id
        self.document = Document.objects.get(id=document_id)
    
    def process_document(self):
        """Main processing pipeline"""
        try:
            self.document.status = Document.PROCESSING
            self.document.save()
            
            # Extract text and structure
            chunks = self.extract_content()
            
            # Create chunk records
            self.create_chunks(chunks)
            
            # Update document status
            self.document.status = Document.COMPLETED
            self.document.save()
            
            return True
            
        except Exception as e:
            self.document.status = Document.FAILED
            self.document.save()
            raise e
    
    def extract_content(self):
        """Extract and chunk content from PDF"""
        chunks = []
        chunk_index = 0
        
        with pdfplumber.open(self.document.file.path) as pdf:
            self.document.pages = len(pdf.pages)
            self.document.save()
            
            for page_num, page in enumerate(pdf.pages, 1):
                # Extract text
                text = page.extract_text() or ""
                
                if text.strip():
                    # Simple paragraph-based chunking (can be enhanced later)
                    paragraphs = [p for p in text.split('\n\n') if p.strip()]
                    
                    for para in paragraphs:
                        if para.strip():
                            chunks.append({
                                'chunk_index': chunk_index,
                                'content_type': ContentChunk.TEXT,
                                'content': para.strip(),
                                'metadata': {
                                    'page_number': page_num,
                                    'word_count': len(para.split()),
                                    'char_count': len(para)
                                }
                            })
                            chunk_index += 1
                
                # Extract images (basic implementation)
                images = page.images
                for img_index, img in enumerate(images):
                    # This is a simplified version - would need actual image extraction
                    chunks.append({
                        'chunk_index': chunk_index,
                        'content_type': ContentChunk.IMAGE,
                        'content': f"Image from page {page_num}",
                        'metadata': {
                            'page_number': page_num,
                            'image_index': img_index,
                            'position': img
                        }
                    })
                    chunk_index += 1
        
        return chunks
    
    def create_chunks(self, chunks):
        """Create ContentChunk objects in database"""
        for chunk_data in chunks:
            ContentChunk.objects.create(
                document=self.document,
                **chunk_data
            )   