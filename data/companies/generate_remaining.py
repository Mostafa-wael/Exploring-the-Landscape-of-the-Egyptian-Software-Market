import csv
import os
import pandas as pd
# Read in the data from the CSV file

files = os.listdir()

files = [f for f in files if f.endswith('.csv')]

all_companies_file = open('companiesLinks.txt', 'r')
all_companies = all_companies_file.read().split('\n')
all_companies.pop() # remove last empty line
all_companies_file.close()

# result_04 contains all above in first trial



resulted_companies = []
for f in files:

    csv_file = pd.read_csv(f,usecols=["query"])
    resulted_companies.extend(csv_file['query'].tolist())
        
remaining_companies = list(set(all_companies) - set(resulted_companies))

with open('remaining_companies.txt', 'w') as f:
    for item in remaining_companies:
        f.write("%s\n" % item)

print("Total companies: ", len(all_companies))
print("Resulted companies: ", len(resulted_companies))
print("Remaining companies: ", len(remaining_companies))
