# Smart Escape — Setup & 90-minute Contest Playbook

## A. Before the mock/real contest

Bring:

- GitHub account + password + phone for login codes.
- AI account(s) you plan to use.
- Optional personal laptop.
- Backup mobile data/hotspot if using your own laptop.

Do **not** prepare or bring old project code/templates for reuse in the contest. The official rulebook requires project code to be created during the contest.

## B. Setup window (before T+0)

1. Open GitHub and create a **new public repository** named:

```text
devfest-<registration-number>
```

2. Confirm you can push to it.
3. Log in to the AI tools you intend to use.
4. Have a clean working folder ready, but do not commit project code before T+0.
5. At T+0, copy the official problem statement and supplied `building.json` into your contest workspace.

## C. Create this React project at T+0

If using this practice project as a learning reference, start with a fresh project in the real contest rather than copying this project code.

```bash
npm create vite@latest smart-escape -- --template react
cd smart-escape
npm install
npm install lucide-react
npm run dev
```

Then implement the features from the problem statement.

For this practice ZIP, the equivalent commands are simply:

```bash
npm install
npm run dev
```

## D. Recommended contest implementation order

### 0–10 min — Understand

- Extract must-have tasks.
- Identify input schema.
- Identify exact routing rules and tie-breakers.
- Ignore optional features until mandatory tasks work.

### 10–15 min — Architecture

Keep it small:

```text
React
├── JSON validation
├── Graph state
├── Dijkstra / weighted shortest path
├── Hazard state
├── SVG map
├── Bilingual UI
└── localStorage (optional)
```

### 15–45 min — Core build

- JSON import
- validation
- map rendering
- start selection
- shortest route
- route cost
- exit selection
- hazard toggles

### 45–60 min — Required UX

- Bangla/English
- failure states
- reset
- readable labels
- responsive layout
- subtle animations

### 60–70 min — Test

Run the supplied checks:

1. R1 → E1, cost 7.
2. Block C2 → R1 → E2, cost 11.
3. Close E1 and E2 → No route available.
4. R2 → E2, cost 7.
5. Select R1 then block R1 → Starting location blocked.

Then create your own tests for unseen graph behavior and equal-cost ties.

### 70–80 min — Deploy

Build:

```bash
npm run build
```

Deploy the production output to a public HTTPS static host such as Cloudflare Pages, Vercel, Netlify or GitHub Pages.

### 80–85 min — Final Git commit

Example format only; use the real prompt you used:

```bash
git add .
git commit -m "Add routing engine | Prompt: Implement weighted shortest path with required tie-breakers"
git push origin main
```

You need at least one commit every 30 minutes and at least three total commits.

### 85–88 min — Verify deployment

Open the public HTTPS URL in Chrome and verify:

- no login required
- map renders
- JSON import works
- route works
- C2 reroutes correctly
- Bangla/English works
- no API keys/secrets are exposed
- deployed site matches the final eligible commit

### 88–90 min — Stop

Record:

- repository URL
- final commit ID
- live HTTPS URL

Then stop coding, committing, pushing and changing deployment at T+90.

## E. Real contest Git rule

Every commit message must include:

1. a short change summary, and
2. the AI prompt used for that change.

For a manual change, use:

```text
Manual edit
```

Never rewrite pushed Git history.

## F. Important restrictions

Do not use:

- Firebase
- Supabase
- Appwrite
- participant-controlled backend
- serverless backend functions
- persistent remote database/storage
- secrets in code/repository
- pre-contest project code

Allowed:

- React/Vite
- npm packages/open-source libraries
- localStorage/sessionStorage/IndexedDB
- browser APIs
- permitted HTTPS/CORS external APIs, provided core routing does not depend on them
