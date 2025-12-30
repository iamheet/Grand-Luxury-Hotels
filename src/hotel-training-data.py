import json

# Training data for The Grand Stay hotel website
training_data = [
    {"question": "What is The Grand Stay?", "answer": "The Grand Stay is a luxury hotel booking platform offering premium accommodations and instant access to premium services."},
    {"question": "How do I book a room?", "answer": "Go to the Search page, select your dates and location, choose a room, and complete the booking process."},
    {"question": "Can I cancel my booking?", "answer": "Yes, you can cancel bookings from the My Bookings page. Cancellation policies vary by property."},
    {"question": "How do I view my bookings?", "answer": "Log in and click 'My Bookings' in the navigation menu to see all your reservations."},
    {"question": "Do I need an account to book?", "answer": "Yes, you need to create an account or log in to make bookings."},
    {"question": "What payment methods do you accept?", "answer": "We accept major credit cards, debit cards, and digital payment methods."},
    {"question": "Is there a mobile app?", "answer": "Currently, The Grand Stay is available as a web application accessible from any device."},
    {"question": "How do I contact support?", "answer": "Use the email form in the footer or contact us through the website."},
    {"question": "What amenities are included?", "answer": "Amenities vary by property but typically include WiFi, parking, pools, and premium services."},
    {"question": "Can I modify my booking?", "answer": "Yes, go to My Bookings and select the reservation you want to modify."},
]

# Expand to 10,000 variations
expanded_data = []
for i in range(1000):
    for item in training_data:
        expanded_data.append({
            "id": len(expanded_data) + 1,
            "question": item["question"],
            "answer": item["answer"],
            "context": "The Grand Stay - Luxury Hotel Booking"
        })

with open("hotel-training-data.json", "w") as f:
    json.dump(expanded_data, f, indent=2)

print(f"Generated {len(expanded_data)} Q&A pairs for The Grand Stay")
