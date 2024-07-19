import json

import ollama
inp='Apple Inc. is hiring a Product Designer in Cupertino, USA. Candidates should have a Bachelor’s Degree in Industrial Design, Product Design, or related fields. Applicants with 3-5 years of experience in product design for consumer electronics are preferred. The company offers a salary range of $120,000 to $150,000 per year. Applications are open until November 15, 2024. Key skills include proficiency in CAD software, user-centered design principles, prototyping, and design thinking. The workplace type is fully on-site.'
stream  = ollama.chat(model='tinyllama', messages=[
  {
    'role': 'user',
    'content': f'Extract each and every attribute from the text as a flat JSON object with no nesting: Ensure the JSON object is flat and formatted like this example: {{"company":"Apple Inc.","title":"Product Designer","location":"Cupertino, USA","degree":"Bachelor’s Degree in Industrial Design, Product Design, or related fields","experience":"3-5 years of experience in product design for consumer electronics","salary":"$120,000 to $150,000 per year","application_deadline":"November 15, 2024","skills":"CAD software, user-centered design principles, prototyping, design thinking","workplace_type":"fully on-site"}}.keep the atrributes flexible according to the text provided dont simply list all attributes in the examples give only which are stated in the text. all the json data should be inside only one curly bracket. restrict to only one output dont give multiple answers. dont give me anything else(theory,explaination and all stuff) just the json directly! Here is the text:{inp}',
  },
])

print(stream['message']['content'])
try:
        content = stream['message']['content'].strip()  
        print("Response content:", content)
        
        # Attempt to find the JSON object within the content
        start_idx = content.find('{')
        end_idx = content.rfind('}') + 1
        json_content = content[start_idx:end_idx]

        y = json.loads(json_content)
        print(y)

except Exception as e:
        print(e)