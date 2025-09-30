# El Shekari — Portfolio (black minimalist)

## Quick start
1. Create a new GitHub repository.
2. Copy all files from this scaffold into the repo root.
3. Add your images/videos into `/assets` and update `example-content.json` with correct filenames and metadata.
4. Commit and push.

## Deploy on Netlify (recommended)
1. Create a Netlify account and "New site from Git" → link your GitHub repo.
2. Build settings: none required (static HTML). Publish directory: `/` (root).
3. (Optional) Enable Netlify Forms: the contact form uses `netlify` form attributes. Netlify collects submissions automatically.

## Deploy on Vercel
1. Create a Vercel account and "Import Project" from GitHub.
2. Select the repo and deploy. No build step required.

## How to edit content
- Update `example-content.json` to add new works (thumb, full, video, pdf).
- Replace hero images in `index.html` (inside `.slideshow`) or connect a CMS (Netlify CMS or Sanity).
- Signature: replace `assets/signature.svg`.

## Netlify Forms
The contact form includes `data-netlify="true"`. If you want email notifications:
- In Netlify dashboard → Forms → choose the form and set up notifications.

## Accessibility & Performance
- Images: use responsive `srcset` when uploading final images.
- Videos: provide WebM + MP4. All hero videos are muted + playsinline.
- Lazy load: browsers will lazy-load non-critical images (consider adding `loading="lazy"`).

## Notes
- This scaffold is framework-free and easy to edit.
- For a CMS: consider adding NetlifyCMS or Sanity — I can help wire that next.
