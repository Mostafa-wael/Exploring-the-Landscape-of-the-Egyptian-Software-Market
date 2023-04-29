# read the data from the csv file called link and newLinks`
import csv
import re

with open('links.csv', 'r') as f:
    reader = csv.reader(f)
    links = []
    for row in reader:
        links.append(row[0])
    print("Links file loaded with size: ", len(links))

with open('newLinks.csv', 'r') as f:
    reader = csv.reader(f)
    newLinks = []
    for row in reader:
        newLinks.append(row[0])
    print("New Links file loaded with size: ", len(newLinks))

# get the difference between the two lists
diff = newLinks[836:]

# create a new file called newLinks.csv and write the difference to it
with open('newLinks+.csv', 'w') as f:
    writer = csv.writer(f)
    for link in diff:
        writer.writerow([link])
print("New links file created with size: ", len(diff))
