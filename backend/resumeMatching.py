# Import necessary libraries
import docx2txt
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load the resume from a local file
resume_path = "C:/Users/maith/Downloads/Multiple-Job-Scrapers-main/Multiple-Job-Scrapers-main/naukri joblient/Maithili Naik.docx"  # Update this path
resume = docx2txt.process(resume_path)

# Print the Resume
print("Resume Content:")
print(resume)

# Load the job description from a local file
job_description_path = "C:/Users/maith/Downloads/Multiple-Job-Scrapers-main/Multiple-Job-Scrapers-main/naukri joblient/job_description.docx"  # Update this path
job_description = docx2txt.process(job_description_path)

# Print the Job Description
print("Job Description Content:")
print(job_description)

# Combine the texts into a list
text = [resume, job_description]

# Create a CountVectorizer object and transform the texts
cv = CountVectorizer()
count_matrix = cv.fit_transform(text)

# Compute the cosine similarity
similarity_score = cosine_similarity(count_matrix)

print("\nSimilarity Scores:")
print(similarity_score)

# Calculate and print the match percentage
match_percentage = similarity_score[0][1] * 100
match_percentage = round(match_percentage, 2)
print(f"Your resume matches about {match_percentage}% of the job description.")