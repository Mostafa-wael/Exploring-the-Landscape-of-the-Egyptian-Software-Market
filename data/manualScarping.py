import os
import subprocess

filename = input("Enter the file name: ")

# Save the HTML to a file
profile_dir = 'profiles'
if not os.path.exists(profile_dir):
    os.makedirs(profile_dir)
profile_file = f"{filename.strip('/').split('/')[-1]}.html"

# open the file in VS Code
subprocess.call(['code', os.path.join(profile_dir, profile_file)])

    
