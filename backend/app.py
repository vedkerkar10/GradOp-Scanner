import pytesseract as tess
import PyPDF2
from PIL import Image
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
    stream = ollama.chat(model='qwen2:0.5b', messages=[
        {
            'role': 'user',
            'content': f"""
                Extract all relevant attributes from the following text related to job descriptions or internships or webinars or any events.
                Give it in a structured format
                Example format:
                - Company: 
                - Salary: 
                - Location: 
                - Experience:
                - Job Title: 
                - Skills Required:
                - Workplace Type:
                - Deadline Date:
                etc.
                Give all fields from the text provided.
                Identify and extract fields only which are present in the text.
                For any text provided you must be able to extract key fields from there.
                Text: {inp}
                """,
        },
    ])

    try:
        content = stream['message']['content'].strip()  
        print("Response content:", content)
        
        # Removed JSON parsing and directly return the content
        return content, 200  # Return plain text instead of JSON
    except Exception as e:
        print("Unexpected error:", e)
        return "An unexpected error occurred", 500


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

tess.pytesseract.tesseract_cmd = r'C:/Program Files/Tesseract-OCR/tesseract.exe'

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

    stream = ollama.chat(model='tinyllama', messages=[
        {
            'role': 'user',
             'content': f"""
                The following text is extracted from my CV. 
                Answer the question based on the information as a knowledgeable mentor.
                Dont explain the points from the CV.
                Give realtime information. Be on the point.

                Question: {question}
                
                Text: {extracted_text}
                """,
        },
    ])

    try:
        content = stream['message']['content'].strip()
        print("Response content:", content)
        return jsonify({"answer": content}), 200
    except Exception as e:
        print("Error during Ollama chat:", e)
        return jsonify({"error": "An error occurred while processing the question"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)