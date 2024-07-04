from flask import Flask, request, jsonify
import spacy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests
nlp = spacy.load("job_description_ner_model")  # Load the trained model


@app.route('/extract', methods=['POST'])
def extract():
    data = request.json
    text = data.get("text", "")

    doc = nlp(text)
    key_fields = {
        "Company you are hiring for": "",
        "Job Title/Role": "",
        "Job Nature": "",
        "workplace type": "",
        "worklocation": "",
        "Job Category": "",
        "Skills required": [],
        "Eligibility": "",
        "Salary Details": "",
        "Job Description": text
    }

    # Extract entities
    for ent in doc.ents:
        if ent.label_ == "Company":
            key_fields["Company you are hiring for"] = ent.text
        elif ent.label_ == "JobTitle":
            key_fields["Job Title/Role"] = ent.text
        elif ent.label_ == "JobNature":
            key_fields["Job Nature"] = ent.text
        elif ent.label_ == "WorkplaceType":
            key_fields["workplace type"] = ent.text
        elif ent.label_ == "WorkLocation":
            key_fields["worklocation"] = ent.text
        elif ent.label_ == "JobCategory":
            key_fields["Job Category"] = ent.text
        elif ent.label_ == "Skills":
            key_fields["Skills required"].append(ent.text)
        elif ent.label_ == "Eligibility":
            key_fields["Eligibility"] = ent.text
        elif ent.label_ == "Salary":
            key_fields["Salary Details"] = ent.text

    key_fields["Job Description"] = text

    return jsonify(key_fields)


if __name__ == '__main__':
    app.run(debug=True)
