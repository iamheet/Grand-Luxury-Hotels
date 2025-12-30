import requests
import json

API_KEY = "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"

def test_openai():
    url = "https://api.openai.com/v1/chat/completions"
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }
    
    data = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful hotel concierge assistant."
            },
            {
                "role": "user",
                "content": "What amenities does The Grand Stay hotel offer?"
            }
        ],
        "max_tokens": 100
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        result = response.json()
        
        if response.status_code == 200:
            print("[SUCCESS] OpenAI API is working!")
            print("\nResponse:")
            print(result['choices'][0]['message']['content'])
        else:
            print("[ERROR]:", result)
            
    except Exception as e:
        print("[FAILED]:", str(e))

if __name__ == "__main__":
    test_openai()
