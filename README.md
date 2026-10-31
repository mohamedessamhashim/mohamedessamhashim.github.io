# mohamedessamhashim.com

A static one-page site with no build step. It deploys as-is to GitHub Pages.

## Preview locally

```sh
python3 -m http.server 8123 --bind 127.0.0.1
```

Then open http://127.0.0.1:8123. Opening `index.html` directly won't work, because the page uses JavaScript modules.

## Editing content

All the text lives in [`content.js`](content.js). You shouldn't need to touch any other file.

| To change | Edit in `content.js` |
|---|---|
| Bio or pillar cards | `about` |
| Timeline | `timeline.entries`, oldest first |
| Projects | `research.projects`. Add `link: { label: 'Paper', url: 'https://…' }` to show a button |
| Publications | `research.publications` |
| Featured Substack posts | `writing.posts` |
| Photo captions | `photos.items` |
| Links, email, footer | `links`, `email`, `footer` |

The hero text and page title are in `index.html`.

### Add a publication

Add an entry to `research.publications`, newest first:

```js
{
  authors: 'Hashim ME, Smith J.',
  title: 'Title of the paper.',
  venue: 'Journal name',
  year: 2027,
  doi: '10.1000/example',
},
```

### Feature Substack posts

Add up to three entries to `writing.posts`. With an empty list, the section shows only the main card.

```js
{ title: 'Post title', date: 'Jan 2027', url: 'https://…' },
```

### Add or replace a photo

This step needs Node, because the originals are converted to AVIF, WebP and JPEG with their metadata removed.

1. Put the original in `assets/photos/`. That folder stays on your computer and is never published.
2. In `tools/optimise-photos.mjs`, add it to `PHOTOS`.
3. Run `npm install` inside `tools/` once, then `node tools/optimise-photos.mjs your-photo-slug`.
4. Add it to `photos.items` in `content.js`, using the width and height the script printed.

The grid has a fixed arrangement, so an eighth photo also needs a new `area` in the `.photos` rules in `styles.css`. Replacing a photo needs nothing extra: keep its `area`.

### Update the CV

`assets/cv.pdf` is the public version. Replace that file, or edit `tools/cv.html` and run `node tools/build-cv.mjs` with `puppeteer-core` installed. Keep submitted manuscripts and abstracts under review out of the public version.

## Publishing

Commit and push to `main`. GitHub Pages rebuilds within a minute or two.

These are deliberately kept out of the repository by `.gitignore`: `assets/photos/` (originals with metadata, plus logos), the original CV, `tools/` and `PROMPT.md`.

## Credits

Brain model: [NIH 3D, 3DPX-001193](https://3d.nih.gov/entries/1193), public domain.
