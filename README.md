# 🌱 FocusGrove — Free Focus Timer

**Plant a tree, stay focused, grow your grove. Completely free, forever.**

FocusGrove is a free, open-source alternative to paid focus apps like Forest.
Same core idea people love — your tree grows while you focus and withers if you
give up — rebuilt from scratch with original code and artwork, and with
**none of the paywalls**:

- ❌ No subscription
- ❌ No ads
- ❌ No locked trees — every species is unlocked from the start
- ❌ No account, no tracking — all data stays on your device
- ✅ Free forever, MIT licensed

> FocusGrove is an independent project. It is not affiliated with, endorsed by,
> or a copy of Forest (Seekrtech). The plant-while-you-focus concept is shared;
> all code, artwork, and branding here are original.

## Features — everything, free

Every feature category the paid apps have, rebuilt with original logic:

- ⏱️ **Timer mode** (10–120 min presets or custom) **and Stopwatch mode**
- 🌳 **12 original species** (Oak, Pine, Bamboo, Sunflower, Cherry, Palm, Cactus,
  Maple, Willow, Lavender, Bonsai, Sequoia) growing through 5 original SVG stages
- 🥀 Give up and the tree withers — gentle accountability
- 🔥 **Deep focus** (extra give-up warning) + **Strict mode** (tree withers if
  you leave the app for over 10 seconds) + your own allowed-apps list
- 🎧 **Ambient sounds, generated in-app** (no audio files): Rain, Ocean,
  Forest birds, Café, White noise
- 🏷️ Tags, planting phrases/notes, and a **post-session diary/reflection**
- ☕ **Break timer** after each completed session
- 🎯 **Daily goal** with progress bar
- 🌲 **Grove views**: today / week / month / year / all-time, plus 4 grove
  scenes (Meadow free; Sunset, Snow, Desert unlockable with earned points)
- 🛒 **Grove shop** — species & scenes unlock with sunlight points
  (☀️ 1 per focused minute). Earnable only, **never real money**
- 📊 **Full statistics**: totals, success rate, average, best day, streak,
  7-day and 30-day charts, breakdowns by tag and by species
- 🗂️ **Timeline** with search and grown/withered filters
- 🏆 **14 achievements**: streaks, milestones, Early Bird, Night Owl, Marathon…
- 👥 **Plant Together**: friends list, room codes, shared sessions, and a
  local leaderboard (no server, no account needed)
- 🔔 Completion **notifications** (with your permission)
- 🌗 Dark mode
- 💾 **Export (JSON & CSV) and import** your data any time — it's yours
- 📱 Installable on Android & iOS, works fully offline

Two honest limits: a web app can't forcibly block other apps (that's an
OS permission — strict mode above is the web equivalent), and real-tree
planting needs a paid planting partner, which a zero-revenue free app can't
fund; FocusGrove instead tracks a personal pledge in the app.

## Use it now (no install needed)

Open the GitHub Pages site for this repo in any browser — it works as a web app.

## Install

### Android — APK
1. Go to **Releases** on this repo and download `app-debug.apk`
   (APKs are built automatically by GitHub Actions on every version tag).
2. Open it on your phone and allow "install from this source" if asked.
3. Or: open the web app in Chrome → ⋮ menu → **Install app**.

### iPhone / iPad
1. Open the web app in **Safari**.
2. Tap **Share → Add to Home Screen**.
3. FocusGrove now runs full-screen like a native app, offline too.

An unsigned native iOS build is available via the "Build iOS" GitHub Action.
Publishing to the App Store requires an Apple Developer account (Apple charges
$99/year) and signing with your own certificates — the home-screen install
above is free and needs none of that.

## Build / develop

It's plain HTML, CSS, and JavaScript — no build step for the web version.

```bash
# web
python3 -m http.server 8000   # then open http://localhost:8000

# native wrappers (Capacitor)
npm install
mkdir -p www && cp index.html styles.css app.js manifest.webmanifest service-worker.js icon.svg www/
npx cap add android   # or: npx cap add ios
npx cap sync
```

GitHub Actions in `.github/workflows/` build the Android APK, build the
unsigned iOS app, and deploy the web app to GitHub Pages.

## "Control all repositories" note for the owner

To let Muse manage *all* your repositories (not just this one), open
GitHub → Settings → Applications → Muse → Configure, and select
**All repositories**. That setting can only be changed by you in GitHub.

## License

MIT — free for everyone, forever. See [LICENSE](LICENSE).
