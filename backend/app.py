import re
from flask import Flask, request, jsonify
import spacy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Load the custom trained model
nlp = spacy.load("backend/custom_ner_model")


@app.route('/extract', methods=['POST'])
def extract():
    data = request.json
    text = data.get("text", "")

    doc = nlp(text)
    key_fields = {
        "Title": "",
        "Organisation": "",
        "Website URL": "",
        "Eligibility": "",
        "Description": text,
        "Apply Now/ Register Now Link": "",
        "Application/ Registration Deadline": "",
        "Event Dates": "",
        "Location(s)": ""
    }

    # Extract entities
    for ent in doc.ents:
        if ent.label_ == "ORG":
            key_fields["Organisation"] = ent.text
        elif ent.label_ == "TITLE":
            key_fields["Title"] = ent.text
        elif ent.label_ == "URL":
            key_fields["Website URL"] = ent.text
        elif ent.label_ == "DATE":
            key_fields["Event Dates"] = ent.text
        elif ent.label_ == "LOCATION":
            key_fields["Location(s)"] = ent.text
        elif ent.label_ == "ELIGIBILITY":
            key_fields["Eligibility"] = ent.text
        elif ent.label_ == "REGISTER":
            key_fields["Apply Now/ Register Now Link"] = ent.text
        elif ent.label_ == "DEADLINE":
            key_fields["Application/ Registration Deadline"] = ent.text

    return jsonify(key_fields)


if __name__ == '__main__':
    app.run(debug=True)
