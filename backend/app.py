import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import ollama
from dotenv import load_dotenv
import subprocess

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/extract', methods=['POST'])
def extract():
    data = request.json
    inp = data['text']
    stream = ollama.chat(model='phi3:mini', messages=[
        {
            'role': 'user',
            'content': f'Extract each and every attribute from the text as a flat JSON object with no nesting: Ensure the JSON object is flat and formatted like this example: {{"company":"Apple Inc.","title":"Product Designer","location":"Cupertino, USA","degree":"Bachelor’s Degree in Industrial Design, Product Design, or related fields","experience":"3-5 years of experience in product design for consumer electronics","salary":"$120,000 to $150,000 per year","application_deadline":"November 15, 2024","skills":"CAD software, user-centered design principles, prototyping, design thinking","workplace_type":"fully on-site"}}.keep the atrributes flexible according to the text provided dont simply list all attributes in the examples give only which are stated in the text. all the json data should be inside only one curly bracket. restrict to only one output dont give multiple answers Here is the text:{inp}',
        },
    ])

    try:
        content = stream['message']['content'].strip()  
        print("Response content:", content)
        
        start_idx = content.find('{')
        end_idx = content.rfind('}') + 1
        json_content = content[start_idx:end_idx]

        y = json.loads(json_content)
        return jsonify(y)
    except json.JSONDecodeError as e:
        print("JSON decode error:", e)
        return jsonify({"error": "Invalid JSON response"}), 500
    except KeyError as e:
        print("KeyError:", e)
        return jsonify({"error": "Missing expected key in response"}), 500
    except Exception as e:
        print("Unexpected error:", e)
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route('/api/jobs', methods=['POST'])
def search_jobs():
    query = request.json
    try:
        result = subprocess.run(
            ['node', 'linkedin.js', json.dumps(query)],
            capture_output=True,
            text=True,
            cwd=os.path.dirname(os.path.abspath(__file__))
        )
        print("Subprocess stdout:", result.stdout)
        
        # print("Subprocess stderr:", result.stderr)
        if result.stdout:
            try:
                jobs = json.loads(result.stdout)
                return jsonify(jobs)
            except json.JSONDecodeError as e:
                print(f"JSON decode error: {e}")
                return jsonify({"error": "Invalid JSON output from subprocess"}), 500
        else:
            return jsonify({"error": "No output from subprocess"}), 500
    except Exception as e:
        print(f"Error fetching jobs: {e}")
        return jsonify({"error": "Failed to fetch jobs"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)