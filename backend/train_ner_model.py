import json
import spacy
from spacy.training.example import Example
from spacy.util import minibatch, compounding

with open('backend/train_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Prepare the training data
TRAIN_DATA = []
for item in data:
    text = item['text']
    entities = [(start, end, label) for start, end, label in item['entities']]
    TRAIN_DATA.append((text, {"entities": entities}))


def remove_overlapping_entities(entities):
    entities = sorted(entities, key=lambda x: (x[0], -x[1]))
    non_overlapping_entities = []
    last_end = -1
    for start, end, label in entities:
        if start >= last_end:
            non_overlapping_entities.append((start, end, label))
            last_end = end
    return non_overlapping_entities


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
    for itn in range(10):  # Number of iterations
        losses = {}
        batches = minibatch(TRAIN_DATA, size=compounding(4.0, 32.0, 1.001))
        for batch in batches:
            for text, annotations in batch:
                doc = nlp.make_doc(text)
                entities = remove_overlapping_entities(annotations["entities"])
                example = Example.from_dict(doc, {"entities": entities})
                nlp.update([example], drop=0.5, losses=losses)
        print(f"Iteration {itn}, Losses: {losses}")

nlp.to_disk("kaggle_model")
