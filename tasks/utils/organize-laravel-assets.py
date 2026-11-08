import os
import shutil

def organize_assets():
    source_images = "app/src/images"
    public_assets = "laravel/public/assets"
    dist_assets = "dist/assets"
    
    # Categories defined in convert-to-laravel.py
    categories = ["admin", "home", "auth"]
    
    # 1. Create directory structure
    for cat in categories:
        img_dir = os.path.join(public_assets, cat, "images")
        js_dir = os.path.join(public_assets, cat, "js")
        css_dir = os.path.join(public_assets, cat, "css")
        os.makedirs(img_dir, exist_ok=True)
        os.makedirs(js_dir, exist_ok=True)
        os.makedirs(css_dir, exist_ok=True)
    
    # 2. Copy images to all categories (for simplicity/standalone use)
    if os.path.exists(source_images):
        for item in os.listdir(source_images):
            s = os.path.join(source_images, item)
            if os.path.isfile(s):
                for cat in categories:
                    d = os.path.join(public_assets, cat, "images", item)
                    shutil.copy2(s, d)
        print(f"✅ Images copied from {source_images} to {public_assets}/{{cat}}/images")
    
    # 3. Copy compiled JS/CSS from dist if they exist
    if os.path.exists(dist_assets):
        for item in os.listdir(dist_assets):
            s = os.path.join(dist_assets, item)
            if not os.path.isfile(s):
                continue
                
            ext = os.path.splitext(item)[1].lower()
            sub_folder = ""
            if ext == ".js":
                sub_folder = "js"
            elif ext == ".css":
                sub_folder = "css"
            else:
                continue # Skip images (handled above) or other files

            # Map specific files to categories
            if "main.js" in item or "vendor" in item or "preloader" in item:
                shutil.copy2(s, os.path.join(public_assets, "admin", sub_folder, item))
            
            if "home" in item or "preloader" in item:
                shutil.copy2(s, os.path.join(public_assets, "home", sub_folder, item))
                
            if "auth" in item or "preloader" in item:
                shutil.copy2(s, os.path.join(public_assets, "auth", sub_folder, item))
        print(f"✅ Compiled assets sorted and copied from {dist_assets} to {public_assets}")
    else:
        print(f"⚠️ dist/assets not found. Run 'npm run build' first to populate minified files.")

if __name__ == "__main__":
    organize_assets()
