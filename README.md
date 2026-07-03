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
built in and switched off. Turn it on by connecting a free **Nhost** project
(a European backend — Postgres + GraphQL + Auth). Once connected, **anyone with
the link can view** the register, and **only the people you name can edit** it
(they sign in with their email). Every editor's change appears for everyone
automatically.

## Turning on shared editing (Nhost — free, European)

Because Nhost is a real database, this is a bit more than "paste a config": you
create a small table and set who may read/write. Roughly ten minutes, once.

**1. Create the project.** Sign up at <https://nhost.io>, create a new project,
and choose a **European region** (e.g. `eu-central-1`). From the project
dashboard note two things from the URL/overview: your **subdomain** and
**region**.

**2. Create the table.** Open the **SQL Editor** (Database → SQL) and run:
```sql
create table public.register (
  id int primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
```

**3. Enable magic-link sign-in.** Go to **Settings → Authentication → Sign-in
methods** and turn on **Email (passwordless / magic link)**. Under **Allowed
redirect URLs**, add the address the site will be served from (your GitHub Pages
URL, and `http://localhost:8000` if you preview locally).

**4. Add an "editor" role.** In **Settings → Roles and Permissions** add a role
called `editor` to the list of allowed roles.

**5. Set table permissions** (Database → `register` → Permissions):
- Role **`public`** (not-signed-in visitors): allow **select** on columns
  `id, data` with no row filter — this makes the tree publicly viewable.
- Role **`editor`**: allow **select**, **insert**, and **update** on
  `id, data` — this lets approved editors save.
- Leave the default **`user`** role with no write access (so ordinary
  signed-in visitors still can't edit).

**6. Grant the editor role to your people.** For each editor, after they've
signed in once (so their account exists), run in the SQL Editor — using their
email:
```sql
update auth.users
set default_role = 'editor',
    roles = array['user','me','editor']
where email = 'you@example.com';
```
(Or add `editor` via the dashboard's user view.) Only people with this role can
save; everyone else is view-only.

**7. Fill in the site.** Open **`index.html`**, near the top of the `<script>`
find the config block and set **both** lines, then commit and push:
```js
const NHOST_CONFIG = { subdomain: "your-subdomain", region: "eu-central-1" };
const EDITOR_EMAILS = ["you@example.com", "aunt@example.com"];
```
`EDITOR_EMAILS` controls which signed-in people see the editing controls; the
`editor` role from step 6 is what actually authorises saving on the server.

That's it. Reload the site: the banner reads *"Shared register,"* and a **Sign
in to edit** button appears. Approved editors click it, type their email, and
open the link that arrives — then editing controls unlock for them. Everyone
else sees a clean, read-only tree. The first approved editor to sign in
publishes the starting register from the transcription.

> **Tell me your Nhost subdomain + region and the list of editor emails, and
> I'll fill in the site and double-check the setup with you.** (The subdomain and
> region are not secret — they're just the public address of your backend.)

### What this mode does and doesn't do

- ✅ Public view; editing limited to people you granted the `editor` role —
  enforced by Nhost/Postgres permissions on the server, not just hidden in the
  page, so it can't be bypassed.
- ✅ Editors' changes appear for everyone within a few seconds (the page checks
  for updates on a short timer).
- ✅ If Nhost is ever unreachable, the site still shows the full tree and falls
  back to a private local copy.
- ⚠️ Adding/removing an editor means updating **both** `EDITOR_EMAILS` in
  `index.html` **and** the `editor` role in Nhost (step 6).
- ⚠️ Saving writes the whole register at once, so simultaneous editors are
  "last save wins." Rarely an issue for a family tree, but avoid two people
  editing the very same person at the very same moment.
- ⚠️ The register is **publicly readable** by anyone with the link. To require
  sign-in even to *view*, drop the `public` select permission in step 5 (grant
  select to `user` instead) — ask if you want that variant.

> **Note:** the shared code is wired up but can only be fully tested against a
> live Nhost project. Once yours exists, we'll confirm the sign-in and save flow
> end-to-end together.

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
