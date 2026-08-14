# Trumpet Nation MVP

A working, dependency-free progressive web app prototype for Trumpet Nation: a faith-aligned AI and community platform serving Christians first, then expanding as a values-aligned product.

## What is implemented

- Personalized onboarding by faith tradition, communication style, preferred language, goals, privacy, and location
- A central **Ask Trumpet** experience covering 22 topics — discernment, anxiety, grief, doubt, money, forgiveness, conflict, dating, parenting, work, shame, illness, addiction, waiting, Sabbath, prayer, study, service, and more
- **Crisis routing** ahead of every other branch: self-harm, abuse, child safety, and medical emergencies return real resources instead of devotional advice
- **Structured answers** that keep Scripture, interpretation, practical advice, and contested ground in separately labelled blocks
- **Bible translation preference** with public-domain verse text (WEB, KJV) rendered inline, set at onboarding, in Settings, or from the Ask toolbar
- Community feed with posting, encouragement, prayer, sharing, circles, and partner verification states
- Prayer wall with private/circle/community scopes, prayer counts, gratitude states, and a two-minute quiet-prayer timer
- Local and remote service discovery with saved commitments and partner entry points
- Verified giving campaigns with transparent progress and a no-payment demo gift flow
- Discovery across studies, events, groups, churches, music, creators, marketplace items, and a safety-first preview of intentional friendship/dating
- Profile, faith-lens, privacy, notification, data export, and prototype reset controls
- Trumpet Nation covenant and governance model embedded directly in the product
- Responsive desktop/mobile layouts, keyboard navigation, reduced-motion support, browser persistence, offline app-shell caching, and installable PWA metadata

## Run locally

From this folder:

```sh
./run-trumpet.sh
```

Then open `http://localhost:4173`.

A custom port may be passed as the first argument:

```sh
./run-trumpet.sh 8080
```

No package installation or build step is required.

## Deploying to trumpetnation.com

The app is wired for the domain: `CNAME`, a canonical URL, Open Graph and
Twitter cards (with absolute image URLs — relative ones are ignored by every
crawler), and a manifest scoped to `/` so the PWA installs from the root.

Because the manifest now uses root-absolute paths, the site must be served at a
domain root, not a subpath. That is what the `CNAME` file guarantees on GitHub
Pages; a project-subdirectory deploy (`user.github.io/trumpet/`) would break the
icons and start URL.

**Steps:**

1. Push this folder to a GitHub repo and enable Pages on the default branch.
2. In the repo's Pages settings, set the custom domain to `trumpetnation.com`
   (the `CNAME` file already declares it) and enable *Enforce HTTPS* once the
   certificate is issued.
3. At your DNS registrar, point the apex at GitHub Pages with four `A` records —
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` —
   and a `CNAME` on `www` pointing to `<username>.github.io`. Confirm these
   against GitHub's current Pages documentation before relying on them; the
   addresses do change occasionally.
4. DNS takes anywhere from minutes to a day to propagate, and the TLS
   certificate is issued only after it resolves.

### The site is deliberately not indexable

`robots.txt` and a `noindex` meta tag currently keep the site out of search.
This is intentional and should stay until the prototype stops presenting
fictional material as real: the ministries and campaigns are invented, the
"verified partner" badges verify nothing, the AI answers are canned, and the
giving flow moves no money. The crisis resources, by contrast, *are* real — so
a distressed person could plausibly find this page through search and mistake a
demo for a service.

**To launch:** delete `robots.txt` and remove the `<meta name="robots">` line
from `index.html`.

## Share a single-file build

```sh
node scripts/export-standalone.mjs
```

Writes `dist/trumpet-standalone.html` — the whole app inlined into one file for
hosts that serve a single document and block external requests. This is not a
build step; `index.html`, `app.js`, and `styles.css` remain the source of truth
and still run directly from disk with no tooling.

Two things are neutralized in that file, and only in that file:

- **Service worker registration**, since `sw.js` is not alongside it. The
  single-file build therefore has no offline mode and cannot be installed as a
  PWA. Host the folder itself for that.
- **`history.pushState` / `replaceState`**, which throw inside a sandboxed
  iframe. They are wrapped rather than removed, so routing still works.

Also note that **Profile → Data & account → Download my data** relies on a
browser download, which sandboxed hosts block. It works when the folder is
served normally.

## Verify the build

From this folder:

```sh
node --check app.js
node --check sw.js
node qa/test_logic.js
python3 qa/validate_assets.py
```

The checks validate the app shell, core interactions, local AI response paths, service and community state, modal flows, CSS parsing, responsive/focus safeguards, and PWA assets.

`qa/test_logic.js` additionally asserts the answer-block structure, translation
fallback behavior, that the faith lens changes answer content, that all four
crisis categories route correctly and are not followed by routine advice, that
the prayer and community composers intercept crisis text without discarding it,
and that **every prompt the interface suggests reaches a real topic** rather than
falling through to the generic answer. It also covers the journey thread
(question → filtered destination → commitment, without duplicate steps), the
goal-driven rail ordering, and focus restoration after a re-render.

`qa/validate_assets.py` requires `lxml` (`pip3 install lxml`); it exits with an
import error otherwise.

## Demo behavior

The prototype stores state in the browser using `localStorage`. The AI answers are local, deterministic demo responses; no external AI call is made. The giving flow records a demo gift but never asks for payment information and never moves money.

Use **Profile → Data & account → Reset all prototype data** to return to onboarding.

## The journey

Ask → Learn → Pray → Connect → Serve → Give is the product's central claim, and
it is built rather than asserted. A suggestion at the end of an answer carries
the question forward instead of dropping the person on a generic list:

1. Following a suggestion opens a **thread** (`state.journey`) holding the
   original question and the topic it matched.
2. The suggestion's `filter` becomes `state.serveFocus`, so Serve leads with
   "Closest to what you asked" and surfaces matching opportunities first.
3. The destination shows why the person is there — *"You asked: how can our
   family serve together?"* — with a link back to the answer.
4. Committing to an opportunity and recording a gift append to the same thread.
5. Today renders it as **Where this is going**: asked → explored → committed →
   gave, one connected arc rather than five unrelated features.

Opportunities carry a `focus` tag (`families`, `youth`, `food`, `care`) that
suggestions target. The thread holds one question at a time and persists to
`localStorage`; **Clear** ends it.

## Personalization

Onboarding priorities reorder the Today rail through `railCardForGoal` — a
`giving` priority lifts the giving card, `prayer` lifts the prayer watch, and
so on, in the order the goals are listed. The view previously printed "N goals
shaping your feed" while ignoring the goals entirely; it now names the ones
actually doing the work.

## Accessibility

Because every change re-renders the whole tree, focus would otherwise drop to
`<body>` on every interaction, throwing keyboard and screen-reader users back
to the top of the page. `render()` records a signature for the focused control
and restores it synchronously against the new tree. It is deliberately not
deferred to `requestAnimationFrame`, which does not run while a tab is hidden.

Modals keep their own focus trap and Escape handling.

## Answer design

Every Ask Trumpet answer is composed from labelled blocks rather than a single
block of prose, so a reader can always tell which layer they are reading:

| Block | Label shown | What it is |
| --- | --- | --- |
| `is-scripture` | Scripture | Verse text in the reader's translation |
| `is-reading` | How this is often read | Interpretation, explicitly not Scripture |
| `is-practice` | One step from here | Practical advice, explicitly not authoritative |
| `is-differ` | Where Christians differ | Contested ground, named rather than flattened |
| `is-human` | Worth bringing to a person | Referral to qualified human help |

This is the product's central claim — that it distinguishes biblical text from
interpretation from advice — so it is enforced structurally rather than left to
the wording of each response. `qa/test_logic.js` asserts the blocks are present.

The faith lens changes answer content, not just a label: topics carry
tradition-specific notes (sacramental confession for a Catholic reader asking
about shame, the Daily Office for an Anglican asking about prayer) and the test
suite asserts two traditions produce different answers.

### Crisis routing

`detectCrisis()` runs before topic matching. When it matches self-harm, abuse,
child safety, or a medical emergency, the answer is **only** the escalation —
no Scripture block, no practical advice, nothing that delays the referral. Real
resources are named (988, Crisis Text Line, the National DV Hotline, Childhelp,
911) and the card states plainly that an AI prototype should not be the only
thing that knows. Scripture appears afterward, offered rather than imposed.

Resource numbers are United States only, and the card says so. Localized crisis
directories are a production requirement, not a prototype detail.

The same detection guards the **prayer composer and the community composer**,
which is where people actually disclose distress. A request that trips it is
held before posting and shown the matching resources; a public scope also gets
a caution about naming medical, legal, abuse, or child-safety detail that would
stay attached to their name. The person can still post — interception informs,
it does not block — and going back to edit preserves what they already wrote.
`crisisResourceList()` is shared between the Ask answer and the composer dialog
so the two can never drift on which numbers they name.

### Bible translations

Only public-domain translations carry text: **WEB** (World English Bible) and
**KJV**. NIV, ESV, and NRSV-CE appear in the picker marked `· licence` and fall
back to WEB with a visible notice. This is deliberate — translation licensing is
a real cost and a real negotiation, and it is better visible in the prototype
than discovered during launch.

## Production integration points

The UI is intentionally structured for a staged backend build:

1. Authentication, account recovery, age gating, parental controls, and organization accounts
2. AI orchestration with source retrieval, denomination-aware policy, evaluation, human escalation, and safety logging
3. Community graph, moderation, reporting, appeals, private groups, messaging, and child-safety safeguards
4. Prayer privacy model, sensitive-data controls, crisis pathways, and pastoral/qualified-support referrals
5. Ministry and nonprofit verification, partner portal, volunteer scheduling, background checks, and local discovery
6. Payments, receipting, recurring gifts, fraud controls, marketplace fulfillment, refunds, and financial reporting
7. Analytics designed around beneficial outcomes rather than addictive engagement

## Suggested launch sequence

- **Phase 1:** Ask Trumpet + onboarding + daily rhythm + private prayer
- **Phase 2:** Trusted circles + verified ministry partners + service discovery
- **Phase 3:** Giving + events + creator/organization discovery
- **Phase 4:** Broader community graph and marketplace after governance, safety, and moderation systems are proven

## File map

- `index.html` — semantic app shell and icon sprite
- `styles.css` — complete design system and responsive interface
- `app.js` — data, state, views, interactions, persistence, and demo AI behavior
- `manifest.webmanifest` — installable app metadata
- `sw.js` — offline app-shell cache (network-first for app code, cache-first for static assets)
- `assets/favicon.svg` — Trumpet Nation mark
- `assets/icon-192.png` and `assets/icon-512.png` — installable PWA icons
- `qa/test_logic.js` — deterministic interaction journey
- `qa/validate_assets.py` — HTML, CSS, manifest, and asset checks
