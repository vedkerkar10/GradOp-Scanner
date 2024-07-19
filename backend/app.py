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
            'content': f'Extract each and every attribute from the text as a flat JSON object with no nesting: Ensure the JSON object is flat and formatted. example. all json data must be in only one loop that is one opening and one closing curly braces, there must be no other curly braces. if there are more than one value for a field use comma. restrict to only one output dont give multiple answers. GIVE ONLY JSON and nothing else which starts with opening curly braces and ends the response with closing curly braces.please dont use curly braces anywhere else to nest keep things seperate.the json must be in this format strictly heres the example {{"company": "company name", "location": "location", "jobTitle": "job title", "jobUrl": "job url", "date": "date posted", "salary": "salary", "agoTime": "time ago posted"}}dont give me the same fields as listed in the example, give me the keyfields in the text provided only. Give each and every field in the text. Here is the text: {inp}',
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