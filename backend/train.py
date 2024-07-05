import spacy
from spacy.training import Example
import random
import warnings

# Suppress specific warnings
warnings.filterwarnings("ignore", category=UserWarning, module='transformers')

TRAIN_DATA = [
    ("Join us for the annual hackathon titled 'Tech Innovations' by Tech Corp on July 20th. Register now at https://techcorp.com/hackathon. The event will be held in New York City. Eligibility: Open to all. Deadline: July 15th.",
     {"entities": [
         (24, 41, "Title"),
         (45, 54, "Organisation"),
         (58, 67, "Event Dates"),
         (81, 114, "Website URL"),
         (130, 143, "Location(s)"),
         (157, 169, "Eligibility"),
         (179, 191, "Application/ Registration Deadline"),
     ]}),
]

nlp = spacy.blank('en')


def train_model(train_data):
    if 'ner' not in nlp.pipe_names:
        ner = nlp.create_pipe('ner')
        nlp.add_pipe('ner', last=True)  # Use the string name 'ner'

    for _, annotation in train_data:
        for ent in annotation['entities']:
            ner.add_label(ent[2])

    other_pipes = [pipe for pipe in nlp.pipe_names if pipe != 'ner']
    with nlp.disable_pipes(*other_pipes):  # only train NER
        optimizer = nlp.begin_training()
        for itn in range(10):
            print("Starting iteration " + str(itn))
            random.shuffle(train_data)
            losses = {}
            for text, annotations in train_data:
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


train_model(TRAIN_DATA)
nlp.to_disk('nlp_model')  # Save the trained model to disk
print("Model training completed and saved to 'nlp_model'")
