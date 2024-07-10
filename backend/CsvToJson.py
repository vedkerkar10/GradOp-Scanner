import csv
import json

def csv_to_json(csv_file_path, json_file_path):
    data = []

    with open(csv_file_path, mode='r', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file)

        for row in csv_reader:
            job_description = row['jobdescription']
            entities = []

            for field in csv_reader.fieldnames:
                if field != 'jobdescription' and row[field]:
                    start_idx = job_description.find(row[field])
                    if start_idx != -1:
                        entities.append((start_idx, start_idx + len(row[field]), field.upper()))

            data.append({"text": job_description, "entities": entities})

    with open(json_file_path, mode='w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=4)

# Usage
csv_file_path = 'naukri_com.csv'
json_file_path = 'train_data.json'
csv_to_json(csv_file_path, json_file_path)