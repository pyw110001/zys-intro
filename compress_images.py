import os
import glob
from PIL import Image

src_dir = r"d:\01_AIGC\03_Antigravity\BP\PNG"
dst_dir = r"d:\01_AIGC\03_Antigravity\BP\remix_-lumina-festival\public\slides"

os.makedirs(dst_dir, exist_ok=True)

files = glob.glob(os.path.join(src_dir, "*.png"))
files.sort()

print(f"Found {len(files)} files to process.")

max_width = 1920

for file_path in files:
    filename = os.path.basename(file_path)
    name, ext = os.path.splitext(filename)
    out_filename = f"{name}.webp"
    out_path = os.path.join(dst_dir, out_filename)
    
    try:
        with Image.open(file_path) as img:
            # Resize if wider than max_width
            w, h = img.size
            if w > max_width:
                ratio = max_width / w
                new_w = int(w * ratio)
                new_h = int(h * ratio)
                img_resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
                print(f"Resized {filename} from {w}x{h} to {new_w}x{new_h}")
            else:
                img_resized = img
                print(f"No resize needed for {filename} ({w}x{h})")
            
            # Save as WebP
            img_resized.save(out_path, "WEBP", quality=80)
            
            orig_size = os.path.getsize(file_path) / (1024 * 1024)
            new_size = os.path.getsize(out_path) / (1024 * 1024)
            print(f"Compressed {filename}: {orig_size:.2f} MB -> {new_size:.2f} MB ({new_size/orig_size*100:.1f}%)")
    except Exception as e:
        print(f"Error processing {filename}: {e}")

print("All done!")
