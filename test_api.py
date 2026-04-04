import requests
msgs = [
    'I am so happy today', 
    'I want to end my life', 
    'I am very anxious about tomorrow', 
    'I feel so depressed and cannot get out of bed'
]
try:
    for m in msgs:
        r = requests.post('http://localhost:8001/chat', json={'message': m}).json()
        print(f"{m} => {r['predicted_status']} ({r['confidence']})")
except Exception as e:
    print("Error:", e)
