import spacy
from spacy.training import Example
import random

# Load a blank spacy model
nlp = spacy.blank("en")

# Create the NER component and add it to the pipeline
if "ner" not in nlp.pipe_names:
    ner = nlp.add_pipe("ner")
else:
    ner = nlp.get_pipe("ner")

# Add the labels to the NER component
labels = ["Company", "JobTitle", "JobNature", "WorkplaceType",
          "WorkLocation", "JobCategory", "Skills", "Eligibility", "Salary"]
for label in labels:
    ner.add_label(label)

# Prepare training data
TRAIN_DATA = [
    (
        "We are seeking an experienced Marketing Manager to join our team at Amazon India Pvt. Ltd. This is a full-time internship opportunity with an on-field workplace type, requiring frequent travel to our offices and client locations in Bangalore, India. The ideal candidate will have a Master's degree in Marketing or a related field and at least 3 years of experience in marketing. Experienced professionals are preferred for this role. The job category for this role is Sales and Marketing, and the skills required include expertise in digital marketing, market research, and team management. The salary details for this role are competitive, with a range of ₹80,000 - ₹1,20,000 per month. As a Marketing Manager, you will be responsible for developing and executing marketing strategies to drive business growth. You will work closely with our team of marketers to identify and prioritize project requirements, and develop solutions to meet those requirements. If you are a motivated and experienced marketing professional looking for a new challenge, we encourage you to apply for this exciting opportunity.",
        {"entities": [(34, 52, "JobTitle"), (78, 99, "Company"), (104, 117, "JobNature"), (156, 163, "WorkplaceType"), (230, 246, "WorkLocation"), (270, 298, "Eligibility"),
                      (338, 359, "Eligibility"), (447, 464, "JobCategory"), (485, 503, "Skills"), (505, 518, "Skills"), (523, 538, "Skills"), (638, 659, "Salary")]}
    ),
    # Add more annotated job descriptions here
]

# Convert training data to spaCy format
examples = []
for text, annotations in TRAIN_DATA:
    examples.append(Example.from_dict(nlp.make_doc(text), annotations))

# Train the model
optimizer = nlp.begin_training()
for i in range(20):  # Number of training iterations
    random.shuffle(examples)
    losses = {}
    for batch in spacy.util.minibatch(examples, size=8):
        nlp.update(batch, drop=0.5, losses=losses)
    print(losses)

# Save the trained model
nlp.to_disk("job_description_ner_model")
