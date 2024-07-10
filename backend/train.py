import json
import spacy
from spacy.training.example import Example
from spacy.util import minibatch, compounding

# Load the JSON data
with open('backend/annotations.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Prepare the training data
TRAIN_DATA = []
for item in data['annotations']:
    try:
        if item is not None and len(item) == 2:
            text, annotations = item
            entities = [(start, end, label)
                        for start, end, label in annotations['entities']]
            TRAIN_DATA.append((text, {"entities": entities}))
        else:
            print(f"Invalid item found: {item}")
    except ValueError as e:
        print(f"Error processing item: {item}, Error: {e}")

# Load a pre-existing spaCy model
nlp = spacy.load("en_core_web_sm")
ner = nlp.get_pipe("ner")

# Add new entity labels to the NER pipeline
for _, annotations in TRAIN_DATA:
    for ent in annotations.get("entities"):
        ner.add_label(ent[2])

# Disable other pipelines to only train NER
pipe_exceptions = ["ner"]
unaffected_pipes = [
    pipe for pipe in nlp.pipe_names if pipe not in pipe_exceptions]

# Start training
with nlp.disable_pipes(*unaffected_pipes):
    optimizer = nlp.begin_training()
    for itn in range(100):  # Number of iterations
        losses = {}
        batches = minibatch(TRAIN_DATA, size=compounding(4.0, 32.0, 1.001))
        for batch in batches:
            for text, annotations in batch:
                doc = nlp.make_doc(text)
                example = Example.from_dict(doc, annotations)
                nlp.update([example], drop=0.5, losses=losses)
        print(f"Losses at iteration {itn}: {losses}")

# Save the trained model
nlp.to_disk("ner_model")
