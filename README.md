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

**Out of the box (no setup):** your edits **save automatically in your browser,
on the device you're using** (via `localStorage`). They are private to that
browser. Use **Export JSON** to download a backup you can keep or hand to
someone else.

**Optional — one live copy the whole family edits together:** the code for this
is already built in and switched off. Turn it on by connecting a free Firebase
Realtime Database (see below). Once connected, everyone who opens the page reads
and writes the *same* register, and each person's changes appear for everyone
automatically.

## Turning on shared editing (Firebase — free)

You only need to do this once. It takes about five minutes.

1. Go to <https://console.firebase.google.com>, sign in, and **Add project**
   (any name). You can skip Google Analytics.
2. In the left menu open **Build → Realtime Database**, click **Create
   Database**, pick a location, and start in **locked mode** (we set rules in
   step 5).
3. Open **Build → Authentication → Get started**, and under *Sign-in method*
   enable **Anonymous**. (This lets the page connect without everyone needing a
   password.)
4. Click the **gear ⚙ → Project settings**. Scroll to *Your apps*, click the
   web icon **`</>`**, register an app (any nickname), and copy the
   `firebaseConfig` object it shows you.
5. Back in **Realtime Database → Rules**, paste this and **Publish** — it lets
   any signed-in visitor read and write the register:
   ```json
   { "rules": { "registerJSON": { ".read": "auth != null", ".write": "auth != null" } } }
   ```
6. Open **`index.html`**, find the `FIREBASE_CONFIG` block near the top of the
   `<script>`, and replace `const FIREBASE_CONFIG = null;` with your copied
   config object. Commit and push.

That's it — reload the site and the banner will say *"Shared register."* The
first person to load it seeds the shared copy from the transcription; after
that, everyone shares one live register.

> **Paste me your `firebaseConfig` and I'll wire it in for you** — the values in
> it (apiKey, etc.) are *designed to be public* in a web page, so this is safe.

### What the shared mode does and doesn't do

- ✅ One live copy; edits sync to everyone within a second or two.
- ✅ Still falls back to a private local copy if Firebase is ever unreachable.
- ⚠️ **Access = anyone who has the page link can edit.** With the rules above,
  that's fine for a register you share privately with the family. If you want to
  restrict editing to named people (e.g. email sign-in with an allowlist), or a
  view-only public page plus an editors-only link, ask and it can be added.
- ⚠️ Saving writes the whole register at once, so simultaneous editors are
  "last save wins." For a family tree that's rarely an issue, but avoid two
  people editing the very same person at the very same moment.

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
