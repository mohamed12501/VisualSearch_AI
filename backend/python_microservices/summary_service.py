import os
from flask import Flask, request, jsonify
from groq import Groq
from dotenv import load_dotenv
from pathlib import Path

# Load env
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

app = Flask(__name__)
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

@app.route('/process', methods=['POST'])
def process():
    print("\n" + "="*40)
    print("!!! SUMMARY SERVICE VERSION 5.0 - FINAL !!!")
    print("="*40 + "\n")
    
    try:
        data = request.get_json(force=True, silent=True) or {}
        caption = data.get('caption', 'Unknown product')
        results = data.get('results', [])
        
        print(f"DEBUG: Processing caption: {caption[:50]}")
        print(f"DEBUG: Results count: {len(results)}")

        if not results or len(results) == 0:
            msg = f"I found a {caption}, but no specific pricing or search results were available online."
            print("Returning fallback message.")
            return jsonify({"result": msg})

        # Build context for LLM
        results_text = "\n".join([f"- {r.get('title', 'No Title')}: {r.get('snippet', '')}" for r in results])
        context = f"Caption: {caption}\n\nSearch Results:\n{results_text}"
        
        completion = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": f"Summarize the following product information into a short informative paragraph:\n\n{context}"
                }
            ],
            max_tokens=250,
        )
        summary = completion.choices[0].message.content.strip()
        return jsonify({"result": summary})

    except Exception as e:
        print(f"ERROR: {str(e)}")
        return jsonify({"result": f"Summary unavailable ({str(e)})"})

if __name__ == '__main__':
    print("Starting Summary Service on Port 5004...")
    app.run(port=5004, host='0.0.0.0')
