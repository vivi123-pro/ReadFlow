from google import genai
from django.conf import settings
import re
from datetime import datetime, timedelta

class AIStoryTransformer:
    def __init__(self):
        print("🚀 Initializing Google Gemini AI...")
        # The configuration method remains the same
        genai.configure(api_key=settings.GEMINI_API_KEY)
        # The model initialization remains the same
        self.model = genai.GenerativeModel('gemini-2.5-flash') # Recommended update to a current model
        print("✅ Gemini AI ready!")
    
    def transform_to_story(self, text, user_interests, reading_level='casual'):
        """Transform plain text into engaging story using Gemini"""
        cleaned_text = self.clean_text(text)
        prompt = self.create_story_prompt(cleaned_text, user_interests, reading_level)
        story_content = self.generate_with_gemini(prompt)
        return story_content
    
    def add_contextual_enhancements(self, text, user_interests, reading_level='casual'):
        """Add contextual explanations and real-world examples"""
        prompt = self.create_enhancement_prompt(text, user_interests, reading_level)
        enhanced_content = self.generate_with_gemini(prompt)
        return enhanced_content
    
    def highlight_connections(self, text, user_interests):
        """Highlight connections to user's interests"""
        prompt = self.create_connection_prompt(text, user_interests)
        connections = self.generate_with_gemini(prompt)
        return connections
    
    def clean_text(self, text):
        """Clean and prepare text for AI processing"""
        text = re.sub(r'\s+', ' ', text.strip())
        if len(text) > 1000:
            text = text[:1000] + "..."
        return text
    
    def create_story_prompt(self, text, interests, reading_level):
        """Create engaging prompts for Gemini"""
        primary_interest = interests[0] if interests else 'general'
        
        prompt = f"""Transform the following text into an engaging, narrative story format suitable for {reading_level} reading level with focus on {primary_interest}. 
        
Make it:
- Conversational and engaging
- Easy to understand
- Maintain the core information
- Add context and storytelling elements
- Keep it concise (200-300 words)
        
Original text: {text}
        
Transformed story:"""
        
        return prompt
    
    def create_enhancement_prompt(self, text, interests, reading_level):
        """Create prompt for contextual enhancements"""
        interests_str = ', '.join(interests[:3]) if interests else 'general'
        
        prompt = f"""Add contextual explanations and real-world examples to this text based on interests in {interests_str}. 
        
For {reading_level} level:
- Add relevant examples from {interests_str}
- Explain complex concepts simply
- Connect to practical applications
- Highlight why this matters to someone interested in {interests_str}
        
Text: {text}
        
Enhanced version:"""
        
        return prompt
    
    def create_connection_prompt(self, text, interests):
        """Create prompt for highlighting connections"""
        interests_str = ', '.join(interests) if interests else 'general topics'
        
        prompt = f"""Identify and highlight connections between this text and {interests_str}. 
        
Provide:
- 2-3 key connections to {interests_str}
- Why someone interested in {interests_str} should care
- Related concepts they might want to explore
        
Text: {text}
        
Connections:"""
        
        return prompt
    
    def generate_with_gemini(self, prompt):
        """Generate content using Gemini API"""
        try:
            # The generate_content call remains the same
            response = self.model.generate_content(prompt)
            story_content = response.text.strip()
            return story_content if story_content else self.create_fallback()
        except Exception as e:
            print(f"🤖 Gemini generation failed: {e}")
            return self.create_fallback()
    
    def create_fallback(self):
        """Simple fallback when AI fails"""
        return "This content is being processed for an enhanced reading experience. The original information has been preserved and will be presented in an engaging format."
    
    def generate_recommendations(self, user_interests, reading_history):
        """Generate content recommendations based on interests and history"""
        prompt = f"""Based on interests in {', '.join(user_interests)} and reading history, suggest 3 types of content this user might enjoy:
        
- Specific topics to explore
- Document types that would interest them
- Learning paths to follow
        
Recommendations:"""
        
        return self.generate_with_gemini(prompt)
    
    def generate_summary(self, text, max_length=150):
        """Generate concise summary of the text"""
        prompt = f"""Create a concise summary of this text in {max_length} words or less:
        
{text}
        
Summary:"""
        
        return self.generate_with_gemini(prompt)
    
    def extract_key_points(self, text, num_points=5):
        """Extract key points from the text"""
        prompt = f"""Extract the {num_points} most important key points from this text:
        
{text}
        
Key Points:"""
        
        return self.generate_with_gemini(prompt)
    
    def adjust_reading_level(self, text, target_level='casual'):
        """Adjust text complexity to match reading level"""
        level_descriptions = {
            'beginner': 'very simple language, short sentences, basic vocabulary',
            'casual': 'conversational tone, moderate complexity, accessible language',
            'advanced': 'sophisticated vocabulary, complex concepts, detailed explanations'
        }
        
        description = level_descriptions.get(target_level, level_descriptions['casual'])
        
        prompt = f"""Rewrite this text using {description}:
        
{text}
        
Rewritten text:"""
        
        return self.generate_with_gemini(prompt)
    
    def generate_questions(self, text, num_questions=3):
        """Generate thought-provoking questions about the content"""
        prompt = f"""Generate {num_questions} thought-provoking questions that would help someone better understand and engage with this content:
        
{text}
        
Questions:"""
        
        return self.generate_with_gemini(prompt)