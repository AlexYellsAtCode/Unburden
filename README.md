# PlanAware

PlanAware is a Vite + React productivity prototype that combines tasks and calendar events in a mobile-style interface.

The current implementation focuses on planning and workload awareness with:

- Daily task and schedule views
- Weekly grouping and collapsible buckets
- Monthly calendar heatmap by estimated capacity
- A timeline that overlays events and task due-time markers
- Recurring tasks/events (daily, weekly, monthly, every n days, and selected weekdays)
- Color- and shape-coded categories (Work, Personal, Health, Learning)
- Task sorting (due date, priority, title, estimated time, and more)
- Optional phone-frame simulation for desktop viewing (demo build)
- Local fake API behavior (simulated latency, in-memory CRUD)

## Current App Behavior

### Navigation

- Home: daily timeline, tasks, and schedule for selected day
- Weekly View: grouped "Today / Tomorrow / This Week" lists
- Monthly View: month grid with color-coded capacity levels

### Planning Model

- Tasks support title, notes, due date/time, priority, repetition options, estimated minutes, difficulty, and category.
- Events support title, notes, date, start/end time, location, repetition options, and category.
- Capacity is calculated from:
  - Weighted task load (`estimatedMinutes` adjusted by difficulty)
  - Event duration (start/end time)
  - A fixed daily capacity baseline

### Interaction Highlights

- Create and edit tasks/events from the floating add menu.
- Mark tasks complete directly from the daily list.
- Delete tasks/events from edit mode with a confirmation modal.
- Search filters both tasks and events by key fields.
- Sort menu orders tasks by due date, priority, title, estimated time, and more.
- Swipe gestures:
  - Home: previous/next day
  - Weekly: previous/next week
  - Monthly: previous/next month

## Tech Stack

- React 18
- Vite 8
- Plain CSS (single stylesheet)
- No external state manager
- No real backend (simulated in `src/App.jsx`)

## Getting Started

### Requirements

- Node.js 18+
- npm

### Install and Run

1. Install dependencies:

	```bash
	npm install
	```

2. Start the development server:

	```bash
	npm run dev
	```

	Or, to run the demo (phone-frame wrapper plus sample seed data):

	```bash
	npm run dev:demo
	```

3. Open the local URL shown in the terminal.

### Demo Mode

PlanAware ships two entry points:

- **Default** (`npm run dev`): Serves `index.html` / `src/main.jsx`. Starts with an empty task and event list and no phone frame.
- **Demo** (`npm run dev:demo`): Serves `index-demo.html` / `src/main-demo.jsx` at the root URL. Wraps the app in a phone frame with a status bar and loads sample seed data (`VITE_USE_SEED_DATA=true`).

The phone frame is hidden automatically on mobile devices, installed PWAs, and viewports narrower than 768px. Override with `VITE_MOBILE_MODE=true|false` (see `.env.test`).

See [docs/demo/DEMO_MODE.md](./docs/demo/DEMO_MODE.md) for more details about using the demo mode.

## Available Scripts

- `npm run dev` - Start Vite dev server (empty data)
- `npm run dev:demo` - Start dev server with phone frame and sample seed data
- `npm run build` - Build production assets (main and demo entry pages, empty data)
- `npm run build:demo` - Build production assets with sample seed data baked in
- `npm run preview` - Preview production build locally
- `npm run deploy` - Build and publish `dist` to the `gh-pages` branch

## Deploying to GitHub Pages

This project is configured for GitHub Pages hosting.

### One-time GitHub setup

1. Push your latest changes to `main`.
2. In GitHub, open your repository settings:
	- **Settings** -> **Pages**
3. Under **Build and deployment**:
	- **Source**: `Deploy from a branch`
	- **Branch**: `gh-pages`
	- **Folder**: `/ (root)`

### Publish updates

From the project root, run:

```bash
npm run deploy
```

This will:

1. Run the production build (`predeploy` -> `npm run build`)
2. Publish the `dist` output to the `gh-pages` branch

Live site URL:

- https://alexyellsatcode.github.io/PlanAware/

## Project Structure

```text
.
|- index.html            # Main entry (no phone frame)
|- index-demo.html       # Demo entry (phone frame)
|- package.json
|- README.md
|- vite.config.js
|- docs/                 # Design, feature, guide, and demo documentation
`- src/
	|- App.jsx
	|- main.jsx
	|- main-demo.jsx
	|- seedData.js
	|- styles.css
	|- components/
	|  |- PhoneFrameWrapper.jsx
	|  `- StatusBar.jsx
	|- testing/
	|  `- deviceDetectionTest.js
	`- utils/
		`- deviceDetection.js
```

More documentation is in [docs/](./docs/README.md).

## Notes and Limitations

- Data is stored in memory only and resets on refresh/restart.
- Backend calls are simulated with delayed promises to mimic network behavior.
- The package name currently remains `functional-prototype`; this does not affect runtime behavior.
