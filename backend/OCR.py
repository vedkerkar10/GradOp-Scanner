import pytesseract as tess
import PyPDF2
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import ollama  # Import the Ollama library

app = Flask(__name__)
CORS(app)

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

    stream = ollama.chat(model='qwen2:0.5b', messages=[
        {
            'role': 'user',
            'content': f'Given below is the context from a CV of the user, help the user by answering the question asked by the user. Question by user: {question}\n\nContext: {extracted_text}',
        },
    ])

    try:
        content = stream['message']['content'].strip()
        print("Response content:", content)
        return jsonify({"answer": content}), 200
    except Exception as e:
        print("Error during Ollama chat:", e)
        return jsonify({"error": "An error occurred while processing the question"}), 500

if __name__ == "__main__":
    os.makedirs('uploads', exist_ok=True)  # Create uploads directory if it doesn't exist
    app.run(host='0.0.0.0', port=5000)