# Before You Sit

A mobile-first static lead-capture site built for GitHub Pages.

## Primary assets
- `index.html` → scroll-stopping landing page
- `scorecard.html` → 12-question operator diagnostic
- `results-*.html` → four result pages with shareable URLs
- `before-you-sit.html` → participant red-flag guide
- `contact.html` → private readout request

## Forms
All forms post to the same Formspree endpoint:
`https://formspree.io/f/xqegaqqq`

Different flows are segmented with hidden fields like `form_type`, `result_bucket`, and `score_total`.

## Shareable URLs
Results are shared through the query param `a=`, which encodes all 12 answers. The result pages recompute the score from those answers. This makes URLs shareable and internally consistent, though not secure against deliberate tampering on a static site.
