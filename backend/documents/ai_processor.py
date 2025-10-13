from transformers import pipeline, set_seed
import torch
import nltk
from nltk.tokenize import sent_tokenize
import re

class AIStoryTransformer:
    def __init__(self):
        # Initialize free Hugging Face models
        self.summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
        self.story_generator = pipeline("text-generation", model="microsoft/DialoGPT-medium")
        self.sentiment_analyzer = pipeline("sentiment-analysis", model="cardiffnlp/twitter-roberta-base-sentiment")
        
        # Download NLTK data for sentence splitting
        try:
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            nltk.download('punkt')
    
    def transform_to_story(self, text, user_interests, reading_level='casual'):
        """Transform plain text into engaging story based on user interests"""
        
        # Step 1: Summarize the content
        summary = self.summarize_content(text, reading_level)
        
        # Step 2: Apply narrative template based on interests
        narrative_prompt = self.create_narrative_prompt(summary, user_interests, reading_level)
        
        # Step 3: Generate enhanced story content
        story_content = self.generate_story_content(narrative_prompt)
        
        return story_content
    
    def summarize_content(self, text, reading_level):
        """Summarize content based on reading level"""
        if reading_level == 'casual':
            max_length = 100
            min_length = 30
        elif reading_level == 'detailed':
            max_length = 150
            min_length = 50
        else:  # academic
            max_length = 200
            min_length = 80
            
        try:
            summary = self.summarizer(
                text, 
                max_length=max_length, 
                min_length=min_length, 
                do_sample=False
            )[0]['summary_text']
            return summary
        except:
            # Fallback: return first 200 characters
            return text[:200] + "..." if len(text) > 200 else text
    
    def create_narrative_prompt(self, text, interests, reading_level):
        """Create a prompt for story generation based on interests"""
        
        interest_templates = {
            'technology': f"Transform this technical content into an engaging tech innovation story: '{text}'",
            'business': f"Rewrite this business content as an inspiring entrepreneurial journey: '{text}'", 
            'fiction': f"Convert this into a captivating fictional narrative: '{text}'",
            'science': f"Transform this scientific content into a discovery adventure: '{text}'",
            'history': f"Rewrite this as an exciting historical account: '{text}'",
            'biography': f"Convert this into a compelling personal story: '{text}'"
        }
        
        # Use the first interest or default to technology
        primary_interest = interests[0] if interests else 'technology'
        base_prompt = interest_templates.get(primary_interest, interest_templates['technology'])
        
        # Add reading level context
        if reading_level == 'casual':
            base_prompt += " Use simple, engaging language."
        elif reading_level == 'detailed':
            base_prompt += " Include relevant details and context."
        else:  # academic
            base_prompt += " Maintain factual accuracy while making it engaging."
            
        return base_prompt
    
    def generate_story_content(self, prompt):
        """Generate story content using free AI model"""
        try:
            # Set seed for reproducible results
            set_seed(42)
            
            generated = self.story_generator(
                prompt,
                max_length=200,
                min_length=50,
                temperature=0.7,
                do_sample=True,
                pad_token_id=50256
            )[0]['generated_text']
            
            # Extract only the new content (remove the prompt)
            story_content = generated.replace(prompt, '').strip()
            return story_content if story_content else "This content is being transformed into an engaging story..."
            
        except Exception as e:
            print(f"AI generation failed: {e}")
            # Fallback: return enhanced version of original prompt
            return prompt.replace("Transform this", "This").replace("Rewrite this", "This")
    
    def analyze_sentiment(self, text):
        """Analyze sentiment to adjust story tone"""
        try:
            sentiment = self.sentiment_analyzer(text[:512])[0]  # Limit text length
            return sentiment
        except:
            return {'label': 'NEUTRAL', 'score': 0.5}