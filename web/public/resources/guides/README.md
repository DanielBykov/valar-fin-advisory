# /public/resources — public downloads

Finished, approved files served by the site at `https://www.valar.co.nz/resources/...`.

**Only finished, Ian-approved deliverables go here.** Anything in this folder is downloadable by anyone with the link. Drafts and source material live in `ws-valar/marketing/lead-magnets/`, never here.

## Structure
```
resources/
  guides/        lead-magnet guides (PDF)
  checklists/    one-pagers, worksheets   (create when first file is ready)
  templates/     planners, spreadsheets   (create when first file is ready)
```

## Naming convention (guides)
The guide-request email builds the download link from the guide's `key`:

```
https://www.valar.co.nz/resources/guides/<guideKey>.pdf
```

The PDF filename **must match the guide key exactly.**

| Guide | key | File to drop here |
|---|---|---|
| First Home Buyer Guide | `first-home-buyer-guide` | `first-home-buyer-guide.pdf` |

## To publish or update a guide
1. Export the final PDF with the exact filename above.
2. Place it in `resources/guides/` and commit.
3. Deploy. The link in the confirmation email (`src/app/api/guide-request/route.ts`) resolves automatically.

To update later, replace the file in place — keep the same filename so the email link never changes.
