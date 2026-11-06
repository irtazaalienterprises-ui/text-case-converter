# apply-fixes.py
# Applies technical SEO fixes to text-to-binary-article.html, character-counter-article.html,
# character-counter.html, text-to-binary.html, index.html, and text-to-binary-converter.html

import re

# 1. Update text-to-binary-article.html
with open('text-to-binary-article.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace head
old_head_pattern = r'<head>[\s\S]*?</head>'
new_head = '''<head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-SXGC2PG51C"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());

        gtag('config', 'G-SXGC2PG51C');
    </script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description"
        content="Learn what a Text to Binary Converter is, how ASCII and binary encoding work, how text translates to 0s and 1s, and how to use the online conversion tool.">
    <meta name="robots" content="index, follow">

    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="Text to Binary Guide: How to Convert Text and ASCII to Binary">
    <meta property="og:description"
        content="Learn what a Text to Binary Converter is, how ASCII and binary encoding work, how text translates to 0s and 1s, and how to use the online conversion tool.">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="The Converter Tool">
    <meta property="og:url" content="https://theconvertertool.com/text-to-binary-article.html">

    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Text to Binary Guide: How to Convert Text and ASCII to Binary">
    <meta name="twitter:description"
        content="Learn what a Text to Binary Converter is, how ASCII and binary encoding work, how text translates to 0s and 1s, and how to use the online conversion tool.">

    <link rel="canonical" href="https://theconvertertool.com/text-to-binary-article.html">
    <title>Text to Binary Guide: How to Convert Text and ASCII to Binary</title>
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="stylesheet" href="css/style.css">

    <!-- Article JSON-LD Schema -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Text to Binary Guide: How to Convert Text and ASCII to Binary",
        "description": "Learn what a Text to Binary Converter is, how ASCII and binary encoding work, how text translates to 0s and 1s, and how to use the online conversion tool.",
        "url": "https://theconvertertool.com/text-to-binary-article.html",
        "publisher": {
            "@type": "Organization",
            "name": "The Converter Tool",
            "url": "https://theconvertertool.com/",
            "logo": "https://theconvertertool.com/favicon.ico"
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://theconvertertool.com/text-to-binary-article.html"
        }
    }
    </script>
</head>'''

content = re.sub(old_head_pattern, new_head, content, count=1)

# Update H1 and badge in hero
content = content.replace('<div class="badge">FREE ONLINE TEXT TOOL</div>\n                <h1>Text to <span>Binary Converter</span></h1>',
                          '<div class="badge">GUIDE & TUTORIAL</div>\n                <h1>Text to Binary <span>Converter Guide</span></h1>')
content = content.replace('<div class="badge">FREE ONLINE TEXT TOOL</div>\r\n                <h1>Text to <span>Binary Converter</span></h1>',
                          '<div class="badge">GUIDE & TUTORIAL</div>\r\n                <h1>Text to Binary <span>Converter Guide</span></h1>')

# Fix footer copyright
content = re.sub(r'<p>[^<]*?theconvertertool\.com\. All rights reserved\.</p>',
                 '<p>&copy; 2026 theconvertertool.com. All rights reserved.</p>', content)

with open('text-to-binary-article.html', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(content)
print("Updated text-to-binary-article.html")

# 2. Update character-counter-article.html
with open('character-counter-article.html', 'r', encoding='utf-8') as f:
    cc_content = f.read()

# Remove title tag from after style if present
cc_content = re.sub(r'\s*<title>Character Counter Guide: Count Characters With or Without Spaces</title>', '', cc_content)

# Insert title tag near top of head and add Article JSON-LD
cc_schema = '''
    <title>Character Counter Guide: Count Characters With or Without Spaces</title>
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="stylesheet" href="css/style.css">

    <!-- Article JSON-LD Schema -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Character Counter Guide: Count Characters With or Without Spaces",
        "description": "Learn what a Character Counter is, how it works, why character counting matters, and how to count characters with or without spaces.",
        "url": "https://theconvertertool.com/character-counter-article.html",
        "publisher": {
            "@type": "Organization",
            "name": "The Converter Tool",
            "url": "https://theconvertertool.com/",
            "logo": "https://theconvertertool.com/favicon.ico"
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://theconvertertool.com/character-counter-article.html"
        }
    }
    </script>'''

# Replace link rel stylesheet section with title and schema
cc_content = re.sub(r'<link rel="icon" type="image/x-icon" href="/favicon\.ico">\s*<link rel="stylesheet" href="css/style\.css">',
                    cc_schema.strip(), cc_content, count=1)

# Fix footer copyright in character-counter-article.html
cc_content = re.sub(r'<p>[^<]*?theconvertertool\.com\. All rights reserved\.</p>',
                    '<p>&copy; 2026 theconvertertool.com. All rights reserved.</p>', cc_content)

with open('character-counter-article.html', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(cc_content)
print("Updated character-counter-article.html")

# 3. Update character-counter.html relative link
with open('character-counter.html', 'r', encoding='utf-8') as f:
    cct_content = f.read()
cct_content = cct_content.replace('href="/character-counter-article.html"', 'href="character-counter-article.html"')
cct_content = re.sub(r'<p>[^<]*?theconvertertool\.com\. All rights reserved\.</p>',
                     '<p>&copy; 2026 theconvertertool.com. All rights reserved.</p>', cct_content)
with open('character-counter.html', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(cct_content)
print("Updated character-counter.html")

# 4. Update text-to-binary.html relative link
with open('text-to-binary.html', 'r', encoding='utf-8') as f:
    ttb_content = f.read()
ttb_content = ttb_content.replace('href="/text-to-binary-article.html"', 'href="text-to-binary-article.html"')
ttb_content = re.sub(r'<p>[^<]*?theconvertertool\.com\. All rights reserved\.</p>',
                     '<p>&copy; 2026 theconvertertool.com. All rights reserved.</p>', ttb_content)
with open('text-to-binary.html', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(ttb_content)
print("Updated text-to-binary.html")

# 5. Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    idx_content = f.read()

# Add text-to-binary-article.html card in index.html if not already present
if 'text-to-binary-article.html' not in idx_content:
    target_card = '''                        <a href="text-to-binary.html" class="tool-card-item">
                            <div>
                                <div class="tool-card-icon">01</div>
                                <h3>Text to Binary Converter</h3>
                                <p>Convert plain text strings into 8-bit binary code (0s and 1s) with UTF-8 byte encoding.</p>
                            </div><span class="tool-card-link">Use Tool &rarr;</span>
                        </a>'''
    replacement_card = target_card + '''\n                        <a href="text-to-binary-article.html" class="tool-card-item">
                            <div>
                                <div class="tool-card-icon">Guide</div>
                                <h3>Text to Binary Guide</h3>
                                <p>Learn how text-to-binary translation works with ASCII, UTF-8, and 8-bit code examples.</p>
                            </div><span class="tool-card-link">Read Article &rarr;</span>
                        </a>'''
    idx_content = idx_content.replace(target_card, replacement_card)

# Fix footer copyright in index.html
idx_content = re.sub(r'<p>[^<]*?theconvertertool\.com\. All rights reserved\.</p>',
                     '<p>&copy; 2026 theconvertertool.com. All rights reserved.</p>', idx_content)

with open('index.html', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(idx_content)
print("Updated index.html")

# 6. Update text-to-binary-converter.html
ttbc_content = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Redirecting to the official Text to Binary Converter on The Converter Tool.">
    <meta name="robots" content="noindex, follow">
    <link rel="canonical" href="https://theconvertertool.com/text-to-binary.html">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <title>Redirecting to Text to Binary Converter</title>
    <meta http-equiv="refresh" content="0; url=https://theconvertertool.com/text-to-binary.html">
    <script>
        window.location.replace("https://theconvertertool.com/text-to-binary.html");
    </script>
</head>
<body>
    <p>Redirecting to <a href="https://theconvertertool.com/text-to-binary.html">Text to Binary Converter</a>...</p>
</body>
</html>
'''
with open('text-to-binary-converter.html', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(ttbc_content)
print("Updated text-to-binary-converter.html")
