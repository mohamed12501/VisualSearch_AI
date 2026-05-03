import os
from flask import Flask, request, jsonify
from groq import Groq
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

app = Flask(__name__)
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

@app.route('/process', methods=['POST'])
def process():
    print("--- Python Query Service Triggered ---")
    data = request.json
    caption = data.get('caption')
    
    if not caption:
        return jsonify({"error": "caption is required"}), 400

    try:
        completion = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": f"Extract a short Google search query (3-6 words max) from this product description. Return ONLY the query, nothing else.\n\nDescription: {caption}"
                }
            ],
            max_tokens=30,
        )
        result = completion.choices[0].message.content.strip()
        print(f"Result: {result}")
        return jsonify({"result": result})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5002)
