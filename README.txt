━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  IWASREADY.COM — BRIDGING EARTH & KANARIA
  Complete Static Site Package
  By Rick Broider
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CONTENTS
──────────────────────────────────────────────────────────
  index.html             Homepage + Hero + FAQ + Testimonial + Trailer section
  quiz.html              The Starseed Leadership Signal Activation (10 questions)
  result.html            Dynamic result page (4 archetypes, JS-rendered)
  assets/styles.css      Full design system (dark indigo / gold / cosmic aesthetic)
  assets/script.js       Quiz logic, result rendering, share functionality
  assets/cosmic-field.png     Background texture (1920x1080, deep space nebula)
  assets/mobile-hero.png      Portrait hero image (480x700, sacred geometry overlay)
  assets/desktop-hero.jpeg    Wide hero image (1920x800, atmospheric cosmic)
  README.txt             This file

DEPLOYMENT
──────────────────────────────────────────────────────────
This package is ready to deploy to any static hosting:

  - Upload all files maintaining the exact folder structure
  - No build step required
  - No server-side processing required
  - Compatible with: GitHub Pages, Netlify, Vercel, Cloudflare Pages,
    Amazon S3, any standard web host

  File structure must be preserved exactly:
    /
    ├── index.html
    ├── quiz.html
    ├── result.html
    ├── README.txt
    └── assets/
        ├── styles.css
        ├── script.js
        ├── cosmic-field.png
        ├── mobile-hero.png
        └── desktop-hero.jpeg

REQUIRED: ITEMS TO COMPLETE BEFORE GOING LIVE
──────────────────────────────────────────────────────────

1. TRAILER YOUTUBE VIDEO ID  [index.html, line ~145]

   Find this in index.html:
     data-youtube-id="YOUR_YOUTUBE_VIDEO_ID"

   Replace YOUR_YOUTUBE_VIDEO_ID with your actual YouTube video ID.
   Example: if your trailer URL is https://www.youtube.com/watch?v=abc123xyz
   then set: data-youtube-id="abc123xyz"

   When set correctly, the JavaScript will automatically embed the video.

2. AUDIOBOOK URL  [assets/script.js, line ~172]

   In result.html (rendered by script.js), there is a next-step card:
     href="YOUR_AUDIOBOOK_URL"

   Find this in assets/script.js, inside the renderResult() function:
     href="YOUR_AUDIOBOOK_URL"

   Replace with your actual audiobook purchase/listen URL
   (e.g., your Audible listing, your own sales page, etc.)

VERIFIED LINKS (no changes needed)
──────────────────────────────────────────────────────────
  ✓ Nav logo "Bridging Earth & Kanaria"  →  https://iwasready.com
  ✓ "Listen to the Trailer" CTA         →  index.html#trailer  (section exists)
  ✓ "Builder's Path" link               →  https://stopthecollapse.com
  ✓ All internal links use relative paths
  ✓ result.html reads ?type= URL param correctly
  ✓ Quiz redirects to result.html?type=[slug] on completion
  ✓ No broken anchors

RESULT ARCHETYPES
──────────────────────────────────────────────────────────
The quiz calculates a score for each of 4 signal types and redirects to:
  result.html?type=flamekeeper
  result.html?type=architect
  result.html?type=bridge-walker
  result.html?type=signal-holder

All content is rendered client-side by assets/script.js.
No server or database required.

QUIZ RENAMED
──────────────────────────────────────────────────────────
The quiz experience is named throughout as:
  "The Starseed Leadership Signal Activation"
(previously "The Leadership Signal Activation")

SEO & SCHEMA
──────────────────────────────────────────────────────────
All three pages include:
  - Unique, descriptive <title> tags
  - Meta descriptions
  - Canonical URLs
  - Open Graph + Twitter Card tags
  - Structured data (Schema.org JSON-LD):
    - WebSite
    - Person (Rick Broider)
    - Book (Bridging Earth and Kanaria)
    - WebPage (per page)
    - FAQPage (index.html)
    - BreadcrumbList (quiz.html, result.html)

DESIGN NOTES
──────────────────────────────────────────────────────────
  - Color palette: deep indigo / navy / black + luminous gold
  - Typography: Cinzel (display), Cormorant Garamond (serif), Inter (body)
    loaded from Google Fonts CDN — requires internet connection to render
  - Mobile-first: intentionally designed for mobile, not just shrunk desktop
  - Sacred geometry ring animations on hero (CSS only, lightweight)
  - All font sizes use clamp() for fluid scaling
  - Minimum readable font size: 13px (labels only); body text 16-17px+

CUSTOMIZATION
──────────────────────────────────────────────────────────
  Colors: Edit :root variables in assets/styles.css
  Quiz questions: Edit QUIZ_QUESTIONS array in assets/script.js
  Archetype content: Edit ARCHETYPES object in assets/script.js
  Images: Replace files in assets/ — maintain same filenames

SUPPORT
──────────────────────────────────────────────────────────
  Site: https://iwasready.com
  Builder's Path: https://stopthecollapse.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  © Rick Broider — All rights reserved
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
