import os
import re

files_to_process = [
    'index.html',
    'app/src/partials/head.html',
    'app/src/partials/scripts.html'
]

# Add all .html files from app/pages/
for root, dirs, files in os.walk('app/pages'):
    for file in files:
        if file.endswith('.html'):
            files_to_process.append(os.path.join(root, file))

# Regex patterns:
# 1. Match "/src/images/" but not when preceded by "app"
#    This handles cases like href="/src/images/..." or src="/src/images/..."
pattern1 = re.compile(r'(?<!app)/src/images/')

# 2. Match "src/images/" when it's at the start of a quote or after url(
#    and DOES NOT have a leading slash.
#    e.g. url('src/images/...') -> url('/app/src/images/...')
#    e.g. src="src/images/..." -> src="/app/src/images/..."
pattern2 = re.compile(r'([\'"(])src/images/')

replacements_made = 0

for file_path in files_to_process:
    if not os.path.exists(file_path):
        continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Apply first pattern: /src/images/ -> /app/src/images/ (if not already app/src/images/)
    new_content = pattern1.sub('/app/src/images/', content)
    
    # Apply second pattern: src/images/ -> /app/src/images/ (when in quotes/parens)
    new_content = pattern2.sub(r'\1/app/src/images/', new_content)
    
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8', newline='') as f:
            f.write(new_content)
        print(f"Updated: {file_path}")
        replacements_made += 1

print(f"Total files updated: {replacements_made}")
