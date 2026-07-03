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

**Optional — one live copy the family shares:** the code for this is already
built in and switched off. Turn it on by connecting a free Firebase Realtime
Database (see below). Once connected, **anyone with the link can view** the
register, and **only the people you name can edit** it (they sign in with their
email). Every editor's change appears for everyone automatically.

## Turning on shared editing (Firebase — free)

You only need to do this once. It takes about five minutes.

1. Go to <https://console.firebase.google.com>, sign in, and **Add project**
   (any name). You can skip Google Analytics.
2. In the left menu open **Build → Realtime Database**, click **Create
   Database**, pick a location, and start in **locked mode** (we set rules in
   step 5).
3. Open **Build → Authentication → Get started → Sign-in method**, and enable
   **Email/Password**. Inside that provider also switch on **Email link
   (passwordless sign-in)**, then Save. (Editors sign in by clicking a one-time
   link emailed to them — no passwords to manage.)
4. Click the **gear ⚙ → Project settings**. Scroll to *Your apps*, click the
   web icon **`</>`**, register an app (any nickname), and copy the
   `firebaseConfig` object it shows you.
5. Back in **Realtime Database → Rules**, paste the rules below and **Publish**.
   They let *anyone* read, but only your listed editor emails write. Replace the
   emails with your own (add one line per editor):
   ```json
   {
     "rules": {
       "registerJSON": {
         ".read": true,
         ".write": "auth != null && (auth.token.email == 'you@example.com' || auth.token.email == 'aunt@example.com')"
       }
     }
   }
   ```
6. Open **`index.html`**, near the top of the `<script>` find the config block
   and fill in **both** lines:
   ```js
   const FIREBASE_CONFIG = { …paste your config object here… };
   const EDITOR_EMAILS = ["you@example.com", "aunt@example.com"];
   ```
   Use the **same emails** here as in the rules. Commit and push.

That's it. Reload the site: the banner reads *"Shared register,"* and a **Sign
in to edit** button appears. Approved editors click it, type their email, and
open the link that arrives — then editing controls unlock for them. Everyone
else sees a clean, read-only tree. The first approved editor to sign in
publishes the starting register from the transcription.

> **Paste me your `firebaseConfig` and the list of editor emails, and I'll wire
> in both the code and the matching rules for you.** The config values (apiKey,
> etc.) are *designed to be public* in a web page, so sharing them is safe.

### What this mode does and doesn't do

- ✅ Public view, editing limited to your named emails — enforced by Firebase
  rules on the server, not just hidden in the page, so it can't be bypassed.
- ✅ Editors' changes sync to everyone within a second or two.
- ✅ If Firebase is ever unreachable, the site still shows the full tree and
  falls back to a private local copy.
- ⚠️ Adding or removing an editor means updating **both** `EDITOR_EMAILS` in
  `index.html` **and** the emails in the database rules.
- ⚠️ Saving writes the whole register at once, so simultaneous editors are
  "last save wins." Rarely an issue for a family tree, but avoid two people
  editing the very same person at the very same moment.
- ⚠️ The register is **publicly readable** by anyone with the link. If you'd
  rather require sign-in even to *view*, change the rule `".read": true` to
  `".read": "auth != null"` — ask if you want that variant.

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
