import os
import sys
import time

slides_dir = r"d:\01_AIGC\03_Antigravity\zys_info\public\slides"

# Set output encoding to UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

files_with_time = []
for r, d, fs in os.walk(slides_dir):
    for f in fs:
        path = os.path.join(r, f)
        mtime = os.path.getmtime(path)
        files_with_time.append((path, mtime))

files_with_time.sort(key=lambda x: x[1], reverse=True)
print("Top 20 most recently modified files under public/slides:")
for path, mtime in files_with_time[:20]:
    t_str = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(mtime))
    print(f"  {t_str} - {path}")
