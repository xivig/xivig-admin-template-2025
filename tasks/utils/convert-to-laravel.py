import os
import re

def convert_hbs_to_blade(content, template_type):
    # 1. Handle Handlebars block tags (if, unless, each)
    content = re.sub(r'\{\{#if\s+([^}]+)\}\}', r'@if($\1)', content)
    content = re.sub(r'\{\{\/if\}\}', r'@endif', content)
    content = re.sub(r'\{\{#unless\s+([^}]+)\}\}', r'@unless($\1)', content)
    content = re.sub(r'\{\{\/unless\}\}', r'@endunless', content)
    content = re.sub(r'\{\{#each\s+([^}]+)\}\}', r'@foreach($\1 as $item)', content)
    content = re.sub(r'\{\{\/each\}\}', r'@endforeach', content)

    # 2. Replace partials {{> name ...}} with @include('templates.<template_type>.partials.name')
    def partial_replacer(match):
        partial_name = match.group(1).strip()
        if partial_name == "@partial-block":
            return "@yield('content')"
        
        mapping = {
            "head": "head", "home-head": "head", "auth-head": "head",
            "scripts": "scripts", "home-scripts": "scripts", "auth-scripts": "scripts",
            "header": "header", "home-header": "header",
            "footer": "footer", "home-footer": "footer",
            "sidebar": "sidebar", "right-sidebar": "right-sidebar",
            "preloader": "preloader", "notification-badge": "notification-badge"
        }
        target = mapping.get(partial_name, partial_name)
        return f"@include('templates.{template_type}.partials.{target}')"

    content = re.sub(r'\{\{>\s*([^ }]+)[^}]*\}\}', partial_replacer, content)

    # 3. Replace variables {{variable}} with {{ $variable ?? '' }}
    # Avoid replacing already replaced @yield or @include
    content = re.sub(r'(?<!@)\{\{([^}]+)\}\}', r'{{ $\1 ?? "" }}', content)

    # 4. Handle assets
    asset_patterns = [
        (r'src="\/app\/src\/images\/([^"]+)"', f'src="{{{{ asset(\'assets/{template_type}/images/\\1\') }}}}"'),
        (r'href="\/app\/src\/images\/([^"]+)"', f'href="{{{{ asset(\'assets/{template_type}/images/\\1\') }}}}"'),
        (r'src="\/images\/([^"]+)"', f'src="{{{{ asset(\'assets/{template_type}/images/\\1\') }}}}"'),
        (r'href="\/images\/([^"]+)"', f'href="{{{{ asset(\'assets/{template_type}/images/\\1\') }}}}"'),
        (r'src="\/app\/src\/main\.js"', f'src="{{{{ asset(\'assets/{template_type}/js/main.js\') }}}}"'),
        (r'src="\/app\/src\/home\.js"', f'src="{{{{ asset(\'assets/{template_type}/js/home.js\') }}}}"'),
        (r'src="\/app\/src\/auth\.js"', f'src="{{{{ asset(\'assets/{template_type}/js/auth.js\') }}}}"'),
        (r'href="\/pages\/([^"]+)"', f'href="{{{{ url(\'\\1\') }}}}"'),
        (r'href="\/index\.html"', f'href="{{{{ url(\'/\') }}}}"'),
    ]

    for pattern, replacement in asset_patterns:
        content = re.sub(pattern, replacement, content)

    return content

def convert_page_to_blade(content, template_type):
    # Strip Handlebars layout wrap if exists
    content = re.sub(r'\{\{#>\s*[^ }]+[^}]*\}\}', '', content)
    content = re.sub(r'\{\{\/([^}]+)\}\}', '', content)
    
    # Convert internal content using the same logic
    content = convert_hbs_to_blade(content, template_type)
    
    # Wrap in layout
    layout_name = f"templates.{template_type}.layout"
    blade_content = f"@extends('{layout_name}')\n\n"
    blade_content += "@section('content')\n"
    blade_content += content
    blade_content += "\n@endsection"
    
    return blade_content

def main():
    base_path = "app/src/partials"
    pages_base = "app/pages"
    output_base = "laravel/resources/views"
    template_output = os.path.join(output_base, "templates")
    pages_output = os.path.join(output_base, "pages")
    
    layouts = {
        "admin": {
            "main": "admin-layout.html",
            "partials": ["head.html", "scripts.html", "header.html", "footer.html", "sidebar.html", "right-sidebar.html", "preloader.html", "notification-badge.html"]
        },
        "home": {
            "main": "home-layout.html",
            "partials": ["home-head.html", "home-scripts.html", "home-header.html", "home-footer.html", "preloader.html"]
        },
        "auth": {
            "main": "auth-layout.html",
            "partials": ["auth-head.html", "auth-scripts.html", "preloader.html"]
        }
    }

    # 1. Convert Layouts and Partials
    for name, config in layouts.items():
        layout_dir = os.path.join(template_output, name)
        partials_dir = os.path.join(layout_dir, "partials")
        os.makedirs(partials_dir, exist_ok=True)

        main_file = os.path.join(base_path, config["main"])
        if os.path.exists(main_file):
            with open(main_file, 'r', encoding='utf-8') as f:
                content = f.read()
            content = convert_hbs_to_blade(content, name)
            with open(os.path.join(layout_dir, "layout.blade.php"), 'w', encoding='utf-8') as f:
                f.write(content)

        for p in config["partials"]:
            p_file = os.path.join(base_path, p)
            if os.path.exists(p_file):
                with open(p_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                content = convert_hbs_to_blade(content, name)
                out_name = p.replace('home-', '').replace('auth-', '').replace('.html', '.blade.php')
                with open(os.path.join(partials_dir, out_name), 'w', encoding='utf-8') as f:
                    f.write(content)

    # 2. Convert All Pages
    for root, dirs, files in os.walk(pages_base):
        for file in files:
            if file.endswith(".html"):
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, pages_base)
                
                # Determine Layout
                template_type = "admin"
                if "auth" in rel_path.lower():
                    template_type = "auth"
                elif "xivig.html" in file.lower():
                    template_type = "home"
                
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                blade_content = convert_page_to_blade(content, template_type)
                
                # Save to resources/views/pages/...
                out_rel_path = rel_path.replace('.html', '.blade.php')
                out_path = os.path.join(pages_output, out_rel_path)
                os.makedirs(os.path.dirname(out_path), exist_ok=True)
                
                with open(out_path, 'w', encoding='utf-8') as f:
                    f.write(blade_content)

    print(f"✅ Conversion complete.")
    print(f"   Templates: {template_output}")
    print(f"   Pages:     {pages_output}")

if __name__ == "__main__":
    main()
