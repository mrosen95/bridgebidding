# Bridge Bidding Guide

A small, mobile-friendly reference site for learning Standard American bridge
bidding (SAYC) — built for walking friends through bidding at game night. Pick a
topic from the dropdown and follow along on your phone.

No build tools, no dependencies, no installs — it's just HTML, CSS, and
JavaScript that runs in any browser.

## What's in it

- **Where Do I Start?** — a beginner-friendly decision guide: "what's happened
  in the auction so far?" points you to the right page.
- **Counting Your Points** — High Card Points, distribution points, and what
  your total means.
- **Opening Bids** — the full SAYC opening structure (1-level suits, 1NT, the
  strong 2♣, weak twos, 2NT, preempts).
- **Responses: 1 of a Suit** — how to respond after partner opens a major or
  a minor at the one level.
- **Responses: 1NT** — Stayman, Jacoby transfers, and the rest.
- **Responses: 2♣ & Weak Twos** — responding to the extra-strong and
  extra-weak openings.
- **Overcalls & Doubles** — what to do when an opponent opens first,
  including takeout doubles and how to respond to partner's double.

Content is based on the official ACBL Standard American Yellow Card (SAYC)
system booklet and convention card. Less common conventions (jump shifts,
Gerber, Michaels, super-accepts, etc.) are tucked behind "+ Advanced" toggles
so the main pages stay easy to scan.

## Running it

You don't need to install anything. Pick whichever option fits how you want
to use it:

### Option A — Just open the file (simplest, for yourself)

Download or clone the repo, then double-click `index.html` (or open it from
your browser with `File → Open`). That's it — everything runs locally in the
page.

### Option B — Run a local server and share it over WiFi (recommended for game night)

This lets everyone at the table open the guide on their **own phone**, over
your home WiFi, instead of huddling around one screen.

1. Make sure you have Python 3 installed (it comes preinstalled on macOS and
   most Linux systems; on Windows, install it from [python.org](https://www.python.org/downloads/)).
2. Open a terminal in the project folder and run:

   ```bash
   python3 -m http.server 8000
   ```

   (No Python? If you have Node.js installed instead, run `npx serve -l 8000`.)

3. Find your computer's local network IP address:
   - **macOS**: System Settings → Wi-Fi → Details (or run `ipconfig getifaddr en0` in Terminal)
   - **Windows**: run `ipconfig` in Command Prompt and look for "IPv4 Address"
   - **Linux**: run `hostname -I` or `ip addr`

   It'll look something like `192.168.1.42`.

4. Make sure your friends' phones are connected to the **same WiFi network**,
   then have them open a browser and go to:

   ```
   http://<your-ip-address>:8000
   ```

   For example: `http://192.168.1.42:8000`

5. When you're done, go back to the terminal and press `Ctrl+C` to stop the
   server.

If a phone can't connect, it's almost always one of: different WiFi network,
a firewall blocking the port, or a typo in the IP address — double-check all
three.

### Option C — Publish it online (optional, for a permanent link)

Since this is a fully static site, you can host it for free on
[GitHub Pages](https://pages.github.com/), Netlify, or Vercel by pointing
them at this repo — no build step required. This gives you a permanent URL
you can reuse for every game night instead of re-running a local server.

## Project structure

```
index.html        Page shell: header, dropdown nav, content container
css/styles.css     All styling (mobile-first, light theme)
js/data.js         All bidding content, organized by page
js/app.js          Wires the dropdown to the content (hash-based routing)
```

## Adding more content later

Everything lives in `js/data.js` as a list of pages. To add a new topic (e.g.
"Rebids" or "Slam Bidding"), add a new entry to the `PAGES` array with a
unique `id`, a `label` for the dropdown, and a `render()` function that
returns HTML. Use the `bidList([...])` helper for the standard bid/points/
description card layout, and `advanced(title, html)` to tuck extra detail
behind a collapsible toggle. Suit symbols can be inserted anywhere with
tokens like `{S}`, `{H}`, `{D}`, `{C}`.
