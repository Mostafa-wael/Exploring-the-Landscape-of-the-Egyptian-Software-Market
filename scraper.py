import os
import csv
from selenium import webdriver
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import re

def login(browser):
    # Launch the browser and go to the LinkedIn login page
    browser.get('https://www.linkedin.com/login')
    # Wait for the login form to load and enter your login credentials
    
    browser.find_element('id', 'username').send_keys(username)
    time.sleep(2)  # Add delay of 2 seconds
    browser.find_element('id','password').send_keys(password)
    time.sleep(2)  # Add delay of 2 seconds
    browser.find_element(By.CSS_SELECTOR, '.btn__primary--large').click()

def navigate_to_link(browser, profile_url):
    # Wait for the homepage to load and go to the target profile page
    browser.get(profile_url)
    try:
        # elem = WebDriverWait(browser, 30).until(EC.presence_of_element_located((By.ID, "education")))
        # elem = WebDriverWait(browser, 30).until(EC.presence_of_element_located((By.ID, "education")))
        elem = WebDriverWait(browser, 30).until(EC.presence_of_element_located((By.CSS_SELECTOR, 'input[aria-label="Search"]')))
        # time.sleep(30)
    except Exception as e:
        print(e)
        print("Page not loaded")
    finally:
        pass

def save_html(browser, target_url, profile_dir='profiles'):
    # Save the HTML to a file
    if not os.path.exists(profile_dir):
        os.makedirs(profile_dir)
    profile_file = f"{target_url.strip('/').split('/')[-1]}.html"
    with open(os.path.join(profile_dir, profile_file), 'w', encoding='utf-8') as f:
        f.write(browser.page_source)

def getVisitedLinks():
    visited_profiles = []
    # read the links csv file and add the links to the visited_profiles list
    with open('newLinks.csv', 'r') as f:
        reader = csv.reader(f)
        for row in reader:
            visited_profiles.append(row[0])
    print("Visited links file loaded with size: ", len(visited_profiles))
    return visited_profiles

def createNewLinks(visited_profiles):
    # create a new file called newLinks.csv and write the visited profiles to it
    with open('newLinks.csv', 'w') as f:
        writer = csv.writer(f)
        for link in visited_profiles:
            writer.writerow([link])
    print("New links file created with size: ", len(visited_profiles))

if __name__ == "__main__":
    browser = webdriver.Chrome()
    login(browser)
    visited_profiles = getVisitedLinks()
    target_url = 'https://www.linkedin.com/search/results/people/?currentCompany=%5B%2210046%22%2C%2211254926%22%2C%2228195%22%2C%225242550%22%2C%2231293%22%2C%221112%22%2C%228331%22%5D&geoUrn=%5B%22102007122%22%2C%22106155005%22%5D&origin=FACETED_SEARCH&sid=3s2'
    navigate_to_link(browser, target_url)
    print("Start Scraping")
    newProfileNum = 0
    for i in range(1, 98):
        # Scroll down to load more search results
        browser.execute_script('window.scrollTo(0, document.body.scrollHeight);')
        time.sleep(2) # Wait for the page to load more search results
        # Extract the search results from the page
        soup = BeautifulSoup(browser.page_source, 'html.parser')
        search_results = soup.find_all('a')
        for s in search_results:
            profile = s.get('href')
            # check if the profile is a valid profile
            reg = re.findall(r'.*/in/.*', profile)
            if reg:
                # check if the profile is already visited
                if profile not in visited_profiles:
                    visited_profiles.append(reg[0])
                    newProfileNum += 1
                else:
                    pass
        print("New Profiles: ", newProfileNum)
        # Check if there are more search results to load
        next_button = browser.find_element(By.CSS_SELECTOR, 'button[aria-label="Next"]')
        if not next_button:
            break
        next_button.click()
        time.sleep(5) # Wait for the page to load more search results
        print(f"\niteration {i} finished")
        createNewLinks(visited_profiles)
        print("Visited Profiles: ", len(visited_profiles))

        
    
    createNewLinks(visited_profiles)
    # Close the browser
    browser.quit()