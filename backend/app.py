from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import ollama

app = Flask(__name__)
CORS(app)

@app.route('/extract', methods=['POST'])
def extract():
    data = request.json
    inp = data['text']
    stream = ollama.chat(model='gemma2', messages=[
        {
            'role': 'user',
            'content': f'extract all the attributes as a json obj, do not nest more than 1 layer deep, only give me the json, heres the text: {inp}',
        },
    ])

    y = json.loads(stream['message']['content'].replace("json", "").replace("", ""))
    return jsonify(y)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
