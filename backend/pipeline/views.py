from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

@csrf_exempt
def analyze_image(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        data = json.loads(request.body)
        image_url = data.get('imageUrl')

        if not image_url:
            return JsonResponse({'error': 'imageUrl is required'}, status=400)

        print(f">>> Django Orchestrator: Processing {image_url}")

        # Get service URLs from environment variables (defaults to Python service ports)
        caption_url = os.getenv('CAPTION_SERVICE_URL', 'http://localhost:5001/process')
        query_url = os.getenv('QUERY_SERVICE_URL', 'http://localhost:5002/process')
        search_url = os.getenv('SEARCH_SERVICE_URL', 'http://localhost:5003/process')
        summary_url = os.getenv('SUMMARY_SERVICE_URL', 'http://localhost:5004/process')

        # 1. Call Python Caption Service
        caption_resp = requests.post(caption_url, json={'imageUrl': image_url})
        caption_resp.raise_for_status()
        caption = caption_resp.json().get('result')
        print("1. Caption Service OK")

        # 2. Call Python Query Service
        query_resp = requests.post(query_url, json={'caption': caption})
        query_resp.raise_for_status()
        search_query = query_resp.json().get('result')
        print("2. Query Service OK")

        # 3. Call Python Search Service
        search_resp = requests.post(search_url, json={'query': search_query})
        search_resp.raise_for_status()
        results = search_resp.json().get('result')
        print("3. Search Service OK")

        # 4. Call Python Summary Service
        print(f"DEBUG: Sending to Summary -> caption length: {len(caption) if caption else 0}, results count: {len(results) if results else 0}")
        summary_resp = requests.post(summary_url, json={'caption': caption, 'results': results})
        summary_resp.raise_for_status()
        summary = summary_resp.json().get('result')
        print("4. Summary Service OK")

        return JsonResponse({
            'architecture': 'Polyglot Microservices (Django + Python)',
            'caption': caption,
            'searchQuery': search_query,
            'results': results,
            'summary': summary
        })

    except requests.exceptions.RequestException as e:
        service_name = "Unknown Service"
        if "5001" in str(e): service_name = "Caption Service (5001)"
        elif "5002" in str(e): service_name = "Query Service (5002)"
        elif "5003" in str(e): service_name = "Search Service (5003)"
        elif "5004" in str(e): service_name = "Summary Service (5004)"
        
        print(f"FAILED: {service_name} - {e}")
        return JsonResponse({
            'error': f'Microservice Offline: {service_name}',
            'details': str(e)
        }, status=500)
    except Exception as e:
        print(f"Orchestrator error: {e}")
        return JsonResponse({
            'error': 'Internal server error',
            'details': str(e)
        }, status=500)
