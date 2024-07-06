import spacy
from spacy.training import Example
import random
import json
import warnings
import os

# Suppress specific warnings
warnings.filterwarnings("ignore", category=UserWarning, module='transformers')

# Initialize a blank English model
nlp = spacy.blank('en')


def remove_overlapping_entities(entities):
    # Sort entities by start position
    entities = sorted(entities, key=lambda x: x[0])
    non_overlapping_entities = []

    for entity in entities:
        if not non_overlapping_entities or entity[0] >= non_overlapping_entities[-1][1]:
            non_overlapping_entities.append(entity)

    return non_overlapping_entities


def train_model(train_data):
    # Add the 'ner' component to the pipeline if it's not already present
    if 'ner' not in nlp.pipe_names:
        ner = nlp.add_pipe('ner', last=True)

    # Add labels to the 'ner' component
    for _, annotation in train_data:
        for ent in annotation['entities']:
            ner.add_label(ent[2])

    # Disable other pipes to only train NER
    other_pipes = [pipe for pipe in nlp.pipe_names if pipe != 'ner']
    with nlp.disable_pipes(*other_pipes):
        optimizer = nlp.begin_training()
        for itn in range(10):
            print("Starting iteration " + str(itn))
            random.shuffle(train_data)
            losses = {}
            for text, annotations in train_data:
                annotations['entities'] = remove_overlapping_entities(
                    annotations['entities'])
                doc = nlp.make_doc(text)
                example = Example.from_dict(doc, annotations)
                try:
                    nlp.update(
                        [example],
                        drop=0.2,
                        sgd=optimizer,
                        losses=losses)
                except Exception as e:
                    print(f"Error updating model for text: {text}")
                    print(f"Exception: {e}")
            print(f"Iteration {itn} Losses: {losses}")


# Path to the JSON data file
file_path = os.path.abspath('backend/job_desc.json')
with open(file_path, 'r') as file:
    data = json.load(file)

# Train the model with the loaded data
train_model(data)

# Save the trained model to disk
nlp.to_disk('jobDesc_model')
print("Model training completed and saved to 'jobDesc_model'")
