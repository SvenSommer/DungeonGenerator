import os

with open("draw.js", "r") as js_file:
    draw_js_content = js_file.read()

with open("index.html", "r") as html_file:
    index_html_content = html_file.read()

# Creating a directory for the refactored files
refactored_dir = "refactored"
os.makedirs(refactored_dir, exist_ok=True)

# Splitting the classes and functions into separate files
class_files = {}
current_class_content = []
current_class_name = None

for line in draw_js_content.splitlines():
    if line.startswith("class "):
        if current_class_name:  # Save the previous class content if any
            class_files[current_class_name] = "\n".join(current_class_content)
        current_class_name = line.split(" ")[1].split("{")[0].strip()
        current_class_content = [line]
    else:
        current_class_content.append(line)

# Saving the last class content
if current_class_name:
    class_files[current_class_name] = "\n".join(current_class_content)

# Writing the separated classes to individual files
for class_name, content in class_files.items():
    with open(os.path.join(refactored_dir, f"{class_name}.js"), "w") as f:
        f.write(content)

# Updating the index.html to include the new JS files
new_html_content = index_html_content.replace('<script src="draw.js"></script>', 
                                             "\n".join([f'<script src="refactored/{class_name}.js"></script>' for class_name in class_files.keys()]))

with open(os.path.join(refactored_dir, "index.html"), "w") as f:
    f.write(new_html_content)

refactored_dir