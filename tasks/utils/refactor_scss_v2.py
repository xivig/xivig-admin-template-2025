import os
import re

# Define the mapping for colors (this part was mostly correct and safe)
color_map = {
    r'#ffffff\b': 'var(--white)',
    r'#fff\b': 'var(--white)',
    r'#000000\b': 'var(--black)',
    r'#000\b': 'var(--black)',
    r'#f8fafc\b': 'var(--bg-subtle)',
    r'#f1f5f9\b': 'var(--bg-subtle)',
    r'#f8f9fa\b': 'var(--bg-subtle)',
    r'#6366f1\b': 'var(--elite-primary)',
    r'#94a3b8\b': 'var(--elite-secondary)',
    r'#1e293b\b': 'var(--elite-dark)',
    r'#64748b\b': 'var(--text-muted)',
    r'#10b981\b': 'var(--elite-success)',
    r'#22c55e\b': 'var(--elite-success)',
    r'#ef4444\b': 'var(--elite-danger)',
    r'#f56767\b': 'var(--elite-danger)',
    r'#f59e0b\b': 'var(--elite-warning)',
    r'#ffb020\b': 'var(--elite-warning)',
    r'#0ea5e9\b': 'var(--elite-info)',
    r'#3b82f6\b': 'var(--elite-info)',
    r'#a855f7\b': 'var(--elite-purple)',
}

# Reverse radius mapping to undo damage
reverse_radius_map = {
    'var(--elite-radius-xl)': '24px',
    'var(--elite-radius-lg)': '20px',
    'var(--elite-radius-md)': '16px',
    'var(--elite-radius-sm)': '12px',
    'var(--elite-radius-xs)': '8px',
}

# Correct radius mapping
radius_map = {
    '24px': 'var(--elite-radius-xl)',
    '20px': 'var(--elite-radius-lg)',
    '16px': 'var(--elite-radius-md)',
    '12px': 'var(--elite-radius-sm)',
    '8px': 'var(--elite-radius-xs)',
}

special_replacements = {
    r'var\(--white,\s*#fff\)': 'var(--white)',
}

dir_path = r'app/src/scss/components/'

def refactor_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Undo all radius variables to start fresh (for radius only)
    for var, px in reverse_radius_map.items():
        content = content.replace(var, px)

    # 2. Apply color replacements (mostly already done, but safe to run)
    for pattern, replacement in color_map.items():
        content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)
    
    for pattern, replacement in special_replacements.items():
        content = re.sub(pattern, replacement, content)

    # 3. Apply radius replacements ONLY to border-radius properties
    # This regex looks for border-radius related properties and captures the entire value
    def radius_replacer(match):
        prop = match.group(1)
        value = match.group(2)
        for px, var in radius_map.items():
            # Replace only whole word px values
            value = re.sub(r'\b' + px + r'\b', var, value)
        return f'{prop}:{value}'

    content = re.sub(r'(border(?:-\w+)*-radius)\s*:\s*([^;]+)', radius_replacer, content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    for filename in os.listdir(dir_path):
        if filename.endswith('.scss') and not filename.endswith('-copy.scss'):
            refactor_file(os.path.join(dir_path, filename))
    print("Refactor completed correctly.")
