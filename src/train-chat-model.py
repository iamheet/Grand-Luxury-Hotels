import json
import random

# Generate 10,000 training questions
questions = []
categories = {
    "booking": ["How do I book a room?", "Can I cancel my booking?", "What's the refund policy?", "How to modify my reservation?"],
    "amenities": ["What amenities are available?", "Is there a pool?", "Do you have WiFi?", "Is breakfast included?"],
    "pricing": ["What are your rates?", "Any discounts available?", "What's included in the price?", "Are there hidden fees?"],
    "location": ["Where are you located?", "How far from airport?", "Nearby attractions?", "Transportation options?"],
    "services": ["Do you offer room service?", "Is there a spa?", "Can I get late checkout?", "Do you have parking?"]
}

for i in range(10000):
    category = random.choice(list(categories.keys()))
    base_question = random.choice(categories[category])
    questions.append({
        "id": i + 1,
        "question": base_question,
        "category": category
    })

# Save to JSON
with open("training_data.json", "w") as f:
    json.dump(questions, f, indent=2)

print(f"Generated {len(questions)} training questions")
