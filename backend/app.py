import spacy
import warnings

# Suppress specific warnings
warnings.filterwarnings("ignore", category=UserWarning, module='transformers')

# Load the trained model
nlp_model = spacy.load('/nlp_model')

# Example text for testing
text = "Join us for the annual hackathon titled 'Tech Innovations' by Tech Corp on July 20th. Register now at https://techcorp.com/hackathon. The event will be held in New York City. Eligibility: Open to all. Deadline: July 15th."

# Process the text with the trained model
doc = nlp_model(text)

# Print the extracted entities
if not doc.ents:
    print("No entities were found in the text.")
else:
    for ent in doc.ents:
        print(f'{ent.label_.upper():{30}}-{ent.text}')
