import requests
import time

def test_api():
    url = "http://127.0.0.1:8000/chat"
    
    # Wait for server to start
    for _ in range(5):
        try:
            res = requests.get("http://127.0.0.1:8000/")
            if res.status_code == 200:
                print("Server is up!", res.json())
                break
        except requests.exceptions.ConnectionError:
            time.sleep(1)
            
    payload = {"query": "I have a headache and feel dizzy. What should I do?"}
    try:
        response = requests.post(url, json=payload)
        print("Status Code:", response.status_code)
        print("Response JSON:", response.json())
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    test_api()
