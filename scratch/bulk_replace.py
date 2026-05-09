import os
import re

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    replacements = {
        'primary-pink': 'primary-gold',
        'secondary-pink': 'secondary-gold',
        'accent-pink': 'accent-gold',
        'border-pink': 'border-gold',
        '#DB2777': '#CA8A04',
        '#ff1493': '#CA8A04',
        '#F472B6': '#EAB308',
        '#db2777': '#CA8A04',
        '#FF1493': '#CA8A04',
        '#f472b6': '#EAB308',
    }
    
    new_content = content
    for old, new in replacements.items():
        new_content = new_content.replace(old, new)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {filepath}")

def main():
    src_dir = 'src'
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts') or file.endswith('.css'):
                replace_in_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
