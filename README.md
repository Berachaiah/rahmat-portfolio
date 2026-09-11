# Law Portfolio (with built-in CMS)

A one-page portfolio site (brown / white / black theme) that your friend can
edit herself from a simple admin screen at `yoursite.netlify.app/admin` —
no code, no Word docs to send back and forth.

## How it works

- `index.html` — the page itself (design from your Stitch export, Tailwind CSS).
- `content.json` — every piece of text/images on the site lives here.
- `render.js` — small script that reads `content.json` and fills in the page.
- `admin/` — the CMS (Decap CMS). This is the screen your friend will use
  to edit `content.json` through a form, without ever touching code.

When she edits something in `/admin` and clicks **Publish**, it saves the
change directly to the website's GitHub repo, and Netlify automatically
re-publishes the live site within a few seconds.

## One-time setup (~15 minutes, you do this)

**1. Put this project on GitHub**
- Create a new repository (e.g. `elena-law-portfolio`) at github.com.
- Upload all these files to it (drag-and-drop works fine on GitHub's
  "Add file → Upload files" page), keeping the `admin/` folder intact.

**2. Deploy it on Netlify**
- Go to [netlify.com](https://netlify.com) → **Add new site → Import an
  existing project** → connect GitHub → pick the repo.
- Build settings: leave the build command empty and set the publish
  directory to `.` (this is already set in `netlify.toml`). Click **Deploy**.
- You'll get a live URL like `elena-law-portfolio.netlify.app` (you can
  rename it or add a custom domain later in Site settings → Domain management).

**3. Turn on the CMS login (Netlify Identity + Git Gateway)**
- In your Netlify site dashboard: **Site configuration → Identity → Enable Identity**.
- Still under Identity, scroll to **Registration** and set it to **Invite only**
  (so random people can't sign up).
- Under **Services → Git Gateway**, click **Enable Git Gateway**. This is what
  lets the CMS save changes to GitHub on her behalf, without her needing a
  GitHub account.

**4. Invite your friend**
- Identity tab → **Invite users** → enter her email.
- She'll get an email, set a password, and can then go to
  `https://yoursite.netlify.app/admin` to log in and edit everything:
  her name, photo, bio, experience, education, publications, and contact info.

That's it — from here on, she's self-sufficient. You only need to touch
code again if she wants a structural change (a new section, a different
layout).

## Before you invite her, personalize the starter content

The site currently ships with placeholder sample content (a fictional
"Elena Vance") so you can see the design filled in. Either:
- Edit `content.json` directly before the first deploy, **or**
- Just deploy as-is and let her replace everything herself through `/admin`
  (recommended — it's the easiest way for her to see how each field maps
  to the page).

Either way, she should replace `hero.photo_url` with her own headshot —
she can upload it directly in the CMS (Hero Section → Photo).

## Testing locally before you deploy (optional)

Since this is just static files, you can preview it without any install:
```
cd this-folder
python3 -m http.server 8080
```
Then open `http://localhost:8080`. (The `/admin` CMS itself only works
once deployed on Netlify with Identity + Git Gateway turned on — it won't
log in from `localhost`.)

## Notes

- The contact form uses **Netlify Forms** (already wired up via
  `data-netlify="true"` in the form tag) — submissions will show up in
  your Netlify dashboard under **Forms**, and you can turn on email
  notifications there.
- Colors (brown/white/black) live in the `tailwind.config` block at the
  top of `index.html` if you ever want to adjust the palette.
- If a field looks off after editing, check `content.json` in your GitHub
  repo's commit history — the CMS commits every save, so you can always
  see (and revert) what changed.
