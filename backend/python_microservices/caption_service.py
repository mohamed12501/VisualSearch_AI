import os
from flask import Flask, request, jsonify
from groq import Groq
from dotenv import load_dotenv
from pathlib import Path

# Load env from parent directory
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

app = Flask(__name__)
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

@app.route('/process', methods=['POST'])
def process():
    print("--- Python Caption Service Triggered ---")
    data = request.json
    image_url = data.get('imageUrl')
    
    if not image_url:
        return jsonify({"error": "imageUrl is required"}), 400

    try:
        completion = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {"url": image_url}
                        },
                        {
                            "type": "text",
                            "text": "This is a product image. Describe what you see in 1-2 short sentences. Focus on: product type, brand name if visible, color, and key features like SPF or ingredients. Be specific and concise — this description will be used as a search query."
                        }
                    ]
                }
            ],
            max_tokens=200,
        )
        result = completion.choices[0].message.content.strip()
        print(f"Result: {result}")
        return jsonify({"result": result})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001)
