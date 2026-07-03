# Descendants of James Esdon — a living family register

An interactive family tree covering **573 people across 185 marriages and
partnerships, in 9 generations from 1755 to today**, transcribed from the
printed "Descendants of James Esdon" chart (annotated to ~2005, photographed in
18 sections).

The whole site is a **single self-contained file — `index.html`**. There's no
build step, no server, and no dependencies. Open it in a browser and it works.

## What you can do

- **Browse by generation** — colour-coded columns, Gen 1 (Founders) through
  Gen 9, with married-in spouses shown beside their partner.
- **Search** any name, year, or surname (e.g. `Gill`, `Petrie`, `1952`).
- **"How are two people related?"** — pick any two people and it works out the
  exact relationship (cousins, removals, aunts/uncles, etc.) through their
  common ancestor.
- **Edit the register** — tap any card to correct names/dates, add a note, add a
  spouse or child, set parents, or remove a person.
- **Expand / collapse** the number of generations shown, and **Export JSON** for
  a backup.
- Entries marked with a red **?** couldn't be read with certainty from the
  photos — verify these against the paper chart. Names whose exact connection
  was unreadable sit under **"People awaiting placement."**

## How saving works

Your edits **save automatically in your browser, on the device you're using**
(via `localStorage`). They are private to that browser.

To share changes with the rest of the family, or move them to another device,
use **Export JSON** to download a backup file you can send on or keep safe.

> Want *one shared copy the whole family can edit together, live*? That needs a
> small hosted backend rather than per-device storage — it can be added later.

## Viewing it locally

Just open `index.html` in any browser. (If your browser is strict about local
files, serve the folder instead: `python3 -m http.server 8000`, then visit
<http://localhost:8000>.)

## Publishing it for the family (free, via GitHub Pages)

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under *Build and deployment*, set **Source: Deploy from a branch**, choose
   your branch and the **/ (root)** folder, and **Save**.
4. After a minute it's live at
   `https://<your-username>.github.io/<repo-name>/`.

## A note on accuracy

The companion PDF of the original photographed pages is the authority wherever
this register and the paper chart disagree. Please verify the `?`-flagged
entries and the "awaiting placement" names against it.
