import spacy
from flask import Flask, request, jsonify
from flask_cors import CORS
import warnings
import os

# Suppress specific warnings
warnings.filterwarnings("ignore", category=UserWarning, module='transformers')

# Load the trained model
model_path = os.path.abspath('jobDesc_model')
nlp_model = spacy.load(model_path)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


@app.route('/extract', methods=['POST'])
def extract_entities():
    data = request.get_json()
    text = data.get('text', '')
    doc = nlp_model(text)

    # Extract entities and format them
    entities = {ent.label_: ent.text for ent in doc.ents}

    print(entities)
    return jsonify(entities)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
