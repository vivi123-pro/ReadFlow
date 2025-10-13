# Quick test script - test_ai.py
from documents.ai_processor import AIStoryTransformer

ai = AIStoryTransformer()
test_text = "The company achieved 30% growth through strategic market expansion and innovative product development."

result = ai.transform_to_story(
    test_text, 
    ['business', 'technology'], 
    'casual'
)

print("Original:", test_text)
print("AI Enhanced:", result)