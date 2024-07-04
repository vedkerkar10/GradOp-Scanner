import spacy
from spacy.training.example import Example
import random
from train_data import TRAIN_DATA


def train_custom_ner_model(train_data, output_dir):
    # Create a blank model with the 'en' pipeline
    nlp = spacy.blank("en")
    # Create a new NER component and add it to the pipeline
    ner = nlp.add_pipe("ner", last=True)

    # Add the labels to the NER component
    for _, annotations in train_data:
        for ent in annotations.get("entities"):
            ner.add_label(ent[2])

    # Initialize the pipeline with training data
    optimizer = nlp.begin_training()

    # Train the NER component
    for itn in range(20):  # Number of iterations
        random.shuffle(train_data)
        losses = {}
        for text, annotations in train_data:
            doc = nlp.make_doc(text)
            example = Example.from_dict(doc, annotations)
            nlp.update([example], drop=0.5, sgd=optimizer, losses=losses)
        print(f"Iteration {itn}, Loss: {losses['ner']}")

    # Save the trained model
    if output_dir is not None:
        nlp.to_disk(output_dir)
        print(f"Saved model to {output_dir}")


# Train the model and save it to a directory
train_custom_ner_model(TRAIN_DATA, "backend/custom_ner_model")
