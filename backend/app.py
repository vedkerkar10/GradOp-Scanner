from groq import Groq
import pytesseract as tess
import PyPDF2
from PIL import Image
import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from dotenv import load_dotenv
import subprocess

load_dotenv()  # Load environment variables from .env file

# Initialize Groq client with API key from environment variable
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

tess.pytesseract.tesseract_cmd = r'C:/Program Files/Tesseract-OCR/tesseract.exe'

@app.route('/extract', methods=['POST'])
def extract():
    data = request.json
    inp = data['text']

    completion = client.chat.completions.create(
        model="llama-3.1-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": f"""
                    Extract each and every attribute from the following text related to job descriptions or internships or webinars or any events and state it in a key-value pair format.
                    Example of output: 
                    Company - Companyname
                    
                    .
                    Here is the text: {inp}"""
            }
        ],
        temperature=1,
        max_tokens=1024,
        top_p=1,
        stream=True,
        stop=None,
    )

    response_content = ""
    for chunk in completion:
        response_content += chunk.choices[0].delta.content or ""

    print("Response content:", response_content)
    
    try:
        # Parse the content into a dictionary
        extracted_keywords = {}
        for line in response_content.split('\n'):
            if ' - ' in line:
                key, value = line.split(' - ', 1)
                extracted_keywords[key.strip()] = value.strip()
        
        return jsonify(extracted_keywords), 200
    except Exception as e:
        print("Unexpected error:", e)
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route('/api/jobs', methods=['POST'])
def search_jobs():
    query = request.json
    try:
        while True:  # Loop until we get a valid output
            result = subprocess.run(
                ['node', 'linkedin.js', json.dumps(query)],
                capture_output=True,
                text=True,
                encoding='utf-8',  # Specify the encoding here
                cwd=os.path.dirname(os.path.abspath(__file__))
            )
            print("Subprocess stdout:", result.stdout)
            
            if result.stdout:
                try:
                    jobs = json.loads(result.stdout)
                    return jsonify(jobs)
                except json.JSONDecodeError as e:
                    print(f"JSON decode error: {e}")
                    return jsonify({"error": "Invalid JSON output from subprocess"}), 500
            else:
                print("No output from subprocess, retrying...")
    except Exception as e:
        print(f"Error fetching jobs: {e}")
        return jsonify({"error": "Failed to fetch jobs"}), 500

def extract_text_from_pdf(pdf_file: str) -> str:
    with open(pdf_file, 'rb') as pdf:
        reader = PyPDF2.PdfReader(pdf, strict=False)
        pdf_text = []

        for page in reader.pages:
            text = page.extract_text()
            pdf_text.append(text)
        return "\n".join(pdf_text)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and (file.filename.endswith('.pdf') or file.filename.endswith(('.png', '.jpg', '.jpeg'))):
        file_path = os.path.join('uploads', file.filename)
        file.save(file_path)

        if file_path.endswith('.pdf'):
            extracted_text = extract_text_from_pdf(file_path)
        else:
            img = Image.open(file_path)
            extracted_text = tess.image_to_string(img)

        # Clean up the uploaded file
        os.remove(file_path)

        return jsonify({"extracted_text": extracted_text}), 200
    else:
        return jsonify({"error": "Invalid file type"}), 400

@app.route('/ask', methods=['POST'])
def ask_question():
    data = request.json
    extracted_text = data['extracted_text']
    question = data['question']

    completion = client.chat.completions.create(
        model="llama-3.1-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": f"This is extracted text from my CV: {extracted_text}. Act as a knowledgeable mentor and answer my question. Question: {question}. Give one line answer in point form"
            }
        ],
        temperature=1,
        max_tokens=1024,
        top_p=1,
        stream=True,
        stop=None,
    )

    response_content = ""
    for chunk in completion:
        response_content += chunk.choices[0].delta.content or ""

    print("Response content:", response_content)
    return jsonify({"answer": response_content}), 200

@app.route('/api/courses', methods=['GET'])
def get_courses():
    title_filter = request.args.get('title', '')
    try:
        result = subprocess.run(
            ['node', 'course.js', title_filter],
            capture_output=True,
            text=True,
            encoding='utf-8',  # Specify the encoding here
            cwd=os.path.dirname(os.path.abspath(__file__))
        )
        print("Subprocess stdout:", result.stdout)
        print("Subprocess stderr:", result.stderr)
        if result.stdout:
            return result.stdout, 200, {'Content-Type': 'application/json'}
        else:
            return jsonify({"error": "No output from subprocess"}), 500
    except Exception as e:
        print(f"Error fetching courses: {e}")
        return jsonify({"error": "Failed to fetch courses"}), 500

@app.route('/api/projects', methods=['GET'])
def get_projects():
    title_filter = request.args.get('title', '')
    try:
        result = subprocess.run(
            ['node', 'projects.js', title_filter],
            capture_output=True,
            text=True,
            encoding='utf-8',  # Specify the encoding here
            cwd=os.path.dirname(os.path.abspath(__file__))
        )
        print("Subprocess stdout:", result.stdout)
        print("Subprocess stderr:", result.stderr)
        if result.stdout:
            all_projects = json.loads(result.stdout)['projects']
            return jsonify({"projects": all_projects}), 200
        else:
            return jsonify({"error": "No output from subprocess"}), 500
    except Exception as e:
        print(f"Error fetching projects: {e}")
        return jsonify({"error": "Failed to fetch projects"}), 500

@app.route('/api/internships', methods=['GET'])
def get_internships():
    try:
        result = subprocess.run(
            ['node', 'internships.js'],
            capture_output=True,
            text=True,
            encoding='utf-8',  # Specify the encoding here
            cwd=os.path.dirname(os.path.abspath(__file__))
        )
        print("Subprocess stdout:", result.stdout)
        print("Subprocess stderr:", result.stderr)
        if result.stdout:
            return result.stdout, 200, {'Content-Type': 'application/json'}
        else:
            return jsonify({"error": "No output from subprocess"}), 500
    except Exception as e:
        print(f"Error fetching internships: {e}")
        return jsonify({"error": "Failed to fetch internships"}), 500

@app.route('/api/hackathons', methods=['GET'])
def get_hackathons():
    try:
        result = subprocess.run(
            ['node', 'UnstopHack.js'],
            capture_output=True,
            text=True,
            encoding='utf-8',  # Specify the encoding here
            cwd=os.path.dirname(os.path.abspath(__file__))
        )
        print("Subprocess stdout:", result.stdout)
        print("Subprocess stderr:", result.stderr)
        if result.stdout:
            return result.stdout, 200, {'Content-Type': 'application/json'}
        else:
            return jsonify({"error": "No output from subprocess"}), 500
    except Exception as e:
        print(f"Error fetching hackathons: {e}")
        return jsonify({"error": "Failed to fetch hackathons"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)