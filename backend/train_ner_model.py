import json
import spacy
from spacy.training.example import Example
from spacy.util import minibatch, compounding

# Load the JSON data
with open('train_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Prepare the training data
TRAIN_DATA = []
for item in data:
    text = item['text']
    entities = [(start, end, label) for start, end, label in item['entities']]
    TRAIN_DATA.append((text, {"entities": entities}))

# Function to remove overlapping entities
def remove_overlapping_entities(entities):
    entities = sorted(entities, key=lambda x: (x[0], -x[1]))
    non_overlapping_entities = []
    last_end = -1
    for start, end, label in entities:
        if start >= last_end:
            non_overlapping_entities.append((start, end, label))
            last_end = end
    return non_overlapping_entities

# Load a blank spaCy model
nlp = spacy.blank("en")

# Create the NER component and add it to the pipeline
if "ner" not in nlp.pipe_names:
    ner = nlp.add_pipe("ner", last=True)
else:
    ner = nlp.get_pipe("ner")

# Add labels to the NER component
for _, annotations in TRAIN_DATA:
    for ent in annotations.get("entities"):
        ner.add_label(ent[2])

# Disable other pipeline components to only train NER
other_pipes = [pipe for pipe in nlp.pipe_names if pipe != "ner"]
with nlp.disable_pipes(*other_pipes):
    optimizer = nlp.begin_training()
    for itn in range(100):  # Number of iterations
        losses = {}
        batches = minibatch(TRAIN_DATA, size=compounding(4.0, 32.0, 1.001))
        for batch in batches:
            for text, annotations in batch:
                doc = nlp.make_doc(text)
                entities = remove_overlapping_entities(annotations["entities"])
                example = Example.from_dict(doc, {"entities": entities})
                nlp.update([example], drop=0.5, losses=losses)
        print(f"Iteration {itn}, Losses: {losses}")

# Save the trained model
nlp.to_disk("ner_model")

# Test the trained model
test_text = "Job Description Send me Jobs like this We are hiring freshers candidates for upcoming Domestic process all over Delhi/NCR regions Good Salary + Incentives Both Day Night Shifts B. Tech, Graduates and under Graduates Candidates also apply Call Sonia 9958895566 Salary:INR 2,00,000 - 2,50,000 P.A Industry: BPO / Call Centre / ITES Functional Area: ITES , BPO , KPO , LPO , Customer Service , Operations Role Category:Voice Role:Telecalling/Telemarketing Executive Keyskills Domestic BPO Call Centre ITES Non Voice Process Calling Customer Care Tele Calling UK Shift International Calling US Shift USA Shift ccr cco international shift Australian shift Europe shift Desired Candidate Profile Education- UG: Any Graduate - Any Specialization, Graduation Not Required PG:Any Postgraduate - Any Specialization, Post Graduation Not Required Doctorate:Any Doctorate - Any Specialization, Doctorate Not Required Please refer to the Job description above Company Profile: Step In Career Visit for Bright and Secure Future Step in Career Interview Timings 9am to 6 pm Download PPT Photo 1 View Contact Details"
doc = nlp(test_text)
for ent in doc.ents:
    print(ent.text, ent.label_)