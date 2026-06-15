import os
import re
import sys

slides_dir = r"d:\01_AIGC\03_Antigravity\zys_info\public\slides"
ts_path = r"d:\01_AIGC\03_Antigravity\zys_info\slidesData.ts"

# Set output encoding to UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Read ts file
with open(ts_path, 'r', encoding='utf-8') as f:
    ts_content = f.read()

# Find all image paths referenced in ts file
referenced_images = set(re.findall(r'"image":\s*"([^"]+)"', ts_content))

# Find images in lists
images_in_lists = re.findall(r'"images":\s*\[(.*?)\]', ts_content, re.DOTALL)
for lst in images_in_lists:
    imgs = re.findall(r'"([^"]+)"', lst)
    for img in imgs:
        referenced_images.add(img)

print(f"Referenced images in slidesData.ts count: {len(referenced_images)}")

# Find all actual files in slides directory
actual_files = set()
for r, d, fs in os.walk(slides_dir):
    for f in fs:
        rel_path = os.path.relpath(os.path.join(r, f), os.path.dirname(slides_dir))
        rel_path = rel_path.replace('\\', '/')
        # Skip service thumbnails and founder images
        if not rel_path.startswith('slides/services_thumbnails') and 'founder' not in rel_path:
            actual_files.add(rel_path)

print(f"Actual slide files on disk count: {len(actual_files)}")

missing_in_ts = actual_files - referenced_images
missing_on_disk = referenced_images - actual_files

print("\nFiles on disk but missing in slidesData.ts:")
if missing_in_ts:
    for f in sorted(missing_in_ts):
        print('  ', f)
else:
    print("  None")

print("\nFiles in slidesData.ts but missing on disk:")
if missing_on_disk:
    for f in sorted(missing_on_disk):
        print('  ', f)
else:
    print("  None")
