import requests
import json
import os

# Use environment variable for API key
API_KEY = os.getenv('GEMINI_API_KEY', 'your-gemini-api-key-here')

def test_gemini():
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={API_KEY}"
    
    data = {
        "contents": [{
            "parts": [{
                "text": "What amenities does a luxury hotel typically offer?"
            }]
        }]
    }
    
    try:
        response = requests.post(url, json=data)
        result = response.json()
        
        if response.status_code == 200:
            print("[SUCCESS] Google Gemini API is working!")
            print("\nResponse:")
            print(result['candidates'][0]['content']['parts'][0]['text'])
        else:
            print("[ERROR]:", result)
            
    except Exception as e:
        print("[FAILED]:", str(e))

if __name__ == "__main__":
    test_gemini()
