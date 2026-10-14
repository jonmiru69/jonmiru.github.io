# Ramelito C. Sanchez, Jr., LPT — Professional Portfolio

Live site: **https://jonmiru69.github.io/**

A single-file, database-free professional portfolio hosted on GitHub Pages. Portfolio content is stored in a GitHub Gist and document/logo files are stored in `portfolio-assets/`, so edits made in Owner Mode appear on every device.

## What's inside

| File / folder | Purpose |
|---|---|
| `index.html` | The complete website (design, content fallback, and Owner Mode editor) |
| `portfolio-assets/` | Profile photo, school/institution logos, certificates, and documents |
| `deploy-notes.txt` | Original deployment notes (kept for reference) |

## Highlights of the enhanced version

- **Faster loading** — images now load from the same GitHub Pages site instead of a slower external raw-file host, with lazy loading for below-the-fold logos and a built-in copy of the portfolio so the page renders instantly even before the live data arrives.
- **Search & filtering** — full-text search across every entry and document, category filters, sorting, and a "with documents only" toggle, with live result counts and keyword highlighting.
- **Better document viewing** — image previews with zoom, PDF preview with full-screen/download fallbacks, Office-document viewer support, and download buttons.
- **Professional presentation** — animated portfolio statistics, clickable phone/email/map contact cards, sticky category navigation with scroll-spy, dark mode, reading-progress bar, and back-to-top button.
- **Print-ready** — use *Print / Save as PDF* to generate a clean CV-style document.
- **Accessibility** — skip link, keyboard-friendly dialogs, focus states, ARIA labels, reduced-motion support, and mobile-first responsive layout.
- **SEO & sharing** — descriptive metadata, Open Graph/Twitter cards, canonical URL, and structured data (schema.org `Person`).
- **Safer, easier editing** — Owner Mode now includes profile editing, item reordering, drag-and-drop file upload, JSON backup/restore, token testing, and clearer save status. All original content, photos, logos, and certificates are preserved.
- **Restored document** — the full 20-page thesis manuscript PDF (already stored in `portfolio-assets/`) is linked again under *Thesis and Research Conducted*, and the Civil Service logo is now a proper file instead of a large inline blob.

## Editing the portfolio (Owner Mode)

1. Open the live site and click **Owner Login** (owner key required).
2. Click **⚙ Backend** once on each editing device and paste a GitHub *classic* Personal Access Token with **gist** + **repo** scopes (create one at <https://github.com/settings/tokens>). Use **🔍 Test Token** to verify it. The token is stored only in that browser — never on the page.
3. Add/edit entries, upload logos, photos, and attachments (drag-and-drop works), reorder items, or edit the profile.
4. Click **Save Live** (bottom bar) to publish. Changes sync to all devices automatically.
5. Occasionally click **⇩ Backup** in Owner Mode to download a JSON safety copy; **⇧ Restore** reloads one.

> ⚠️ **Security note:** GitHub tokens expire and are revoked instantly if pasted publicly. Never commit a token to this repository or share it. If saving reports “Bad credentials,” generate a fresh token in Backend Setup.

## Deploying updates

Commit and push (or upload) `index.html` — and any new files in `portfolio-assets/` — to the `main` branch. GitHub Pages republishes automatically within a minute or two. No build step is required.
