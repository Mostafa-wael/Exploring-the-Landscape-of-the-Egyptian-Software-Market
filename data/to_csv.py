import json
import csv
import os

files = os.listdir('preprocessed-data')
for file in files:
    # Load the JSON data
    if file == 'csv':
        continue

    with open(f"preprocessed-data/{file}") as f:
        data = json.load(f)

    # Extract the keys from the first record
    headers = list(data[0].keys())

    # Create a new CSV file and write the headers
    with open(f'preprocessed-data/csv/{file.split(".")[0]}.csv', 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(headers)

        # Write each record to the CSV file
        for record in data:
            writer.writerow(record.values())