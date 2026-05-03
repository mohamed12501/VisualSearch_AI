import os
from flask import Flask, request, jsonify
from serpapi import GoogleSearch
from dotenv import load_dotenv
from pathlib import Path
from urllib.parse import urlparse

env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

app = Flask(__name__)

@app.route('/process', methods=['POST'])
def process():
    print("--- Python Search Service Triggered ---")
    data = request.json
    query = data.get('query')
    
    if not query:
        return jsonify({"error": "query is required"}), 400

    try:
        search = GoogleSearch({
            "q": query,
            "api_key": os.environ.get("SERPAPI_KEY")
        })
        results = search.get_dict()
        
        # DEBUG: Print keys found in the response
        print(f"Search API Keys found: {list(results.keys())}")
        
        if "error" in results:
            print(f"SERPAPI ERROR: {results['error']}")
            return jsonify({"error": results['error']}), 500

        organic_results = results.get("organic_results", [])
        
        formatted_results = []
        for res in organic_results[:5]:
            link = res.get("link")
            domain = urlparse(link).netloc if link else "unknown"
            formatted_results.append({
                "title": res.get("title", "No Title"),
                "snippet": res.get("snippet", "No Snippet"),
                "link": link,
                "displayed_link": res.get("displayed_link"),
                "favicon": f"https://www.google.com/s2/favicons?domain={domain}&sz=32"
            })
            
        print(f"Found {len(formatted_results)} organic results")
        return jsonify({"result": formatted_results})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5003)
