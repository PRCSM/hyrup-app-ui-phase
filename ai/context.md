# HYRUP — AI Context Document

> **Last updated:** March 8, 2026  
> **Phase:** MVP Phase 2 — Career & Social — Mobile UI System

---

## 1. Project Overview

**HYRUP** is a React-based mobile UI prototype for a student career + social platform targeting Indian college students. The app is rendered as a phone shell in the browser (393×852px, iPhone-sized) and simulates a production-grade mobile experience.

The app has two modes that share a single shell:
- **Career Mode** — dark theme, helps students discover jobs/internships, track applications, swipe to apply, and chat with recruiters.
- **Social Mode** — light theme, lets students share wins/projects, connect with peers, join groups, and message each other.

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 (with hooks) |
| Bundler | Vite 5 |
| Language | JSX (no TypeScript) |
| Styling | Inline styles only (no CSS files, no Tailwind) |
| State | `useState` / `useRef` / `useEffect` (no external state library) |
| Fonts | Google Fonts via `@import` — **Bricolage Grotesque** (display) + **DM Sans** (body) |
| Icons | Custom SVG path library (`IC` map in `icons.jsx`) |
| Images | Static assets under `public/images/` |

---

## 3. Repository Structure

```
hyrup-app-ui-phase/
├── package.json               # React 18 + Vite; no extra deps
├── vite.config.js             # Minimal Vite config (react plugin only)
├── index.html                 # SPA entry point
├── ai/
│   └── context.md             # ← this file
├── public/
│   └── images/                # Profile avatars, post graphics
└── src/
    ├── main.jsx               # ReactDOM.createRoot → <HYRUPApp />
    ├── App.jsx                # Root component — mode switching, job state, routing
    ├── tokens.js              # Design tokens (colors, radii) + font vars
    ├── data.js                # ALL_JOBS data + applyFilters utility
    ├── helpers.jsx            # Row / Col layout primitives
    ├── icons.jsx              # IC SVG path map + <Svg> renderer
    ├── components/
    │   ├── Phone.jsx          # Phone shell (status bar, border, scroll area)
    │   ├── BottomNav.jsx      # Tab bar with orange indicator dot
    │   └── ModeToggle.jsx     # Career ↔ Social pill toggle in headers
    └── screens/
        ├── career/
        │   ├── CareerHome.jsx              # Dashboard: profile strength, stats, matched jobs
        │   ├── CareerJobs.jsx              # Job list + hackathon toggle + filter + saved
        │   ├── CareerChat.jsx              # Recruiter/mentor message list
        │   ├── CareerNews.jsx              # Tech news feed ("Tech Pulse")
        │   ├── CareerProfile.jsx           # User profile: stats, skills, AI resume CTA
        │   ├── SwipeScreen.jsx             # Full-screen Bumble-style swipe-to-apply
        │   ├── FilterPanel.jsx             # Bottom sheet filter overlay
        │   └── AcceptedRejectedJobModal.jsx # Read-only job detail modal
        └── social/
            ├── SocialHome.jsx              # Dashboard: daily challenge, streak, quick cards
            ├── SocialFeed.jsx              # Swipeable full-image post cards
            ├── SocialConnect.jsx           # Full-photo peer swipe cards ("Find your Tribe")
            ├── SocialChat.jsx              # Unified inbox (DMs + groups)
            ├── SocialGroups.jsx            # Group discovery + "My Cults" view
            └── SocialProfile.jsx          # User profile: stats, skills, posts grid
```

---

## 4. Design System (`tokens.js`)

### Theme Overview

| Token | Career (dark) | Social (light) |
|---|---|---|
| `bg` | `#0F0F0F` | `#F8F7F5` |
| `s1` | `#161616` | `#FFFFFF` |
| `s2` | `#1E1E1E` | `#F2F0EC` |
| `orange` | `#FF7A1A` | `#FF5722` |
| `t1` (primary text) | `#FFFFFF` | `#111111` |
| `t2` (secondary text) | `#8A8A8A` | `#7A746C` |
| `border` | `#242424` | `#E8E4DC` |
| `green` | `#22C55E` | `#16A34A` |
| `red` | `#EF4444` | `#DC2626` |
| `r` (border radius base) | `20` | `22` |

### Exported Font Variables
- `FD` = `'Bricolage Grotesque', sans-serif` — headings/display
- `FB` = `'DM Sans', sans-serif` — body text, labels, buttons

### Token Usage Pattern
Every screen does `const t = T.c` (career) or `const t = T.s` (social), then references `t.bg`, `t.orange`, etc.

---

## 5. Core Architecture (`App.jsx`)

### State
```js
mode          // "career" | "social"
cTab          // Career nav: "home"|"jobs"|"chat"|"news"|"profile"
sTab          // Social nav: "home"|"feed"|"connect"|"chat"|"profile"
fading        // Boolean — drives 160ms opacity fade on mode switch
activeJobs    // Jobs not yet acted on (starts as all ALL_JOBS)
acceptedJobs  // Jobs swiped/accepted
rejectedJobs  // Jobs swiped/rejected
bookmarkedIds // Array of job IDs
hackathons    // Static hackathon objects (hardcoded in App)
```

### Key Functions
- `moveJob(jobId, destination)` — moves a job between active/accepted/rejected buckets; ensures no duplicates
- `toggleBookmark(id)` — adds/removes a job ID from bookmarkedIds
- `toggleMode()` — fades out, switches mode after 160ms, fades in

### Prop Pattern
Every screen receives `{ mode, onToggle }` as `p`. Career-specific screens also receive job state props.

---

## 6. Data Layer (`data.js`)

### ALL_JOBS (6 jobs)
Each job object:
```js
{
  id, role, co, loc, locType,  // "Remote" | "Hybrid" | "On-site"
  pay, payNum,                  // display string + numeric for filtering
  tags, m (match %), ch,        // avatar initial
  type,                         // "Internship" | "Job"
  grad, accentGrad,             // CSS gradient strings
  desc                           // short description
}
```

### applyFilters(jobs, filters)
Filters by `jobType`, `location`, `salaryMin`.

---

## 7. Career Screens

### CareerHome
- Greets user ("Good morning 👋 Rahul Sharma")
- Profile strength hero card (72%, progress bar)
- 3-stat row: Applied (dynamic), Shortlisted (3), Views (48)
- "Matched for you" section with job cards
- Quick Apply CTA → opens `SwipeScreen`

### CareerJobs
- Animated toggle between **Jobs** and **Hackathons** views (380ms exit/enter animation with `useRef` timers + `requestAnimationFrame`)
- Jobs view: active / accepted / rejected sections, bookmarking
- Hackathons: 4 sample events (HackIndia, Smart India, ETH India, Build with AI)
- Filter button → `FilterPanel` bottom sheet
- Tap accepted/rejected jobs → `AcceptedRejectedJobModal`
- `bmarkFlash` and `actionFlash` state for micro-interaction feedback

### SwipeScreen
- Full-screen scrollable job cards (Bumble-style)
- Built-in cards OR accepts `cards` prop + `onAction` callback
- Swipe left = skip/reject, swipe right = apply/accept
- Horizontal drag only; vertical drag = scroll
- Rich card details: company desc, responsibilities, perks, openings, duration, experience

### FilterPanel
- Bottom sheet modal with backdrop blur
- Filters: Status (all/active/accepted/rejected), Job Type, Location, Min Stipend
- Active filter count badge
- Apply button commits filters; local state until Apply

### AcceptedRejectedJobModal
- Bottom sheet, read-only job details
- Fade-in + upward pop animation on mount
- Status badge: green ✓ Applied / red ✗ Not Selected

### CareerChat
- Static recruiter + mentor conversation list
- Online indicator dot (green)
- Unread badge

### CareerNews ("Tech Pulse")
- Hero news card + list of 3 more stories
- Static mock data

### CareerProfile
- Cover gradient, avatar initial
- Stats: Connections, Skills, Wins, Applied
- Skill badges, AI Resume Builder CTA
- Tab bar (Grid/Spark/Bookmark icons)

---

## 8. Social Screens

### SocialHome
- Greeting with user name
- Daily Challenge hero card (orange gradient)
- Week streak row (7-day dots)
- Quick action cards (4): New Connections, Active Groups, Trending Win, Study Group — each navigates to another tab via `onNav`
- Preview posts (2)

### SocialFeed
- Swipeable stacked full-image post cards
- Swipe left = skip, swipe right = bookmark
- Filter chips (All / Wins / Projects / Thoughts)
- Create post button
- Post data includes avatar, college, content type badge, likes/comments

### SocialConnect ("Find your Tribe")
- Full-photo swipe cards for peer discovery
- Users have: name, college, avatar, skills, XP level, "why" reason, bio
- Connect/Skip buttons + swipe gesture
- Tab bar: Suggested / Connections

### SocialChat ("Messages")
- Unified inbox: DMs + group chats
- Filter tabs: All / DMs / Groups
- Unread badge, group type badge (⚡ Hack, 📚 Study, 🎮 Fun)
- New conversation button (orange +)
- Search bar

### SocialGroups ("Join a Cult")
- Group discovery with category types (⚡ Hack, 📚 Study, 🎮 Fun)
- Discover / My Cults tab toggle
- Join/Joined button per group

### SocialProfile
- Cover gradient (warm beige/orange)
- Avatar initial (circular)
- Stats: Connections, Posts, Skills, Wins
- Skill badges (React, Node.js, Figma, Python)
- AI Resume + Edit Profile buttons
- Tab bar (Grid/Spark/Bookmark for posts/achievements/saved)

---

## 9. Shared Components

### `<Phone mode>`
- 393×852px container, 52px border radius
- Status bar (9:41 clock, notch, battery indicator)
- Inner scrollable area for screen content
- Box shadow changes between career (dramatic, orange glow) and social (soft, light)

### `<BottomNav mode active onSelect items>`
- 72px height, 5 tabs
- Orange dot indicator above active icon
- Orange pill highlight on active icon
- Items: `[id, svgPath, label][]`

### `<ModeToggle mode onToggle>`
- 178×34px pill toggle
- Animated sliding orange background (spring cubic-bezier)
- Career icon (briefcase) + Social icon (users)

---

## 10. Layout Primitives (`helpers.jsx`)

```jsx
<Row g={gap} ai="center" jc="flex-start" sx={{}}>   // flex row
<Col g={gap} ai="..." sx={{}}>                        // flex column
```

Both accept a `sx` prop that spreads additional styles — used throughout as a lightweight style prop pattern.

---

## 11. Icon System (`icons.jsx`)

`IC` is a flat map of SVG path strings. `<Svg d={IC.home} s={size} c={color} w={strokeWidth} fill="none">` renders them.

Key icons: `home`, `brief`, `chat`, `news`, `user`, `users`, `bell`, `search`, `bmark`, `heart`, `share`, `plus`, `check`, `x`, `zap`, `spark`, `loc`, `edit`, `arrow`, `fire`, `swipe`, `undo`, `clock`, `award`, `star`, `hash`, `send`, `img`, `attach`, `grid`, `layers`, `dot3`, `menu`

---

## 12. Mock User

All screens reference the same mock user:
- **Name:** Rahul Sharma
- **College:** RGPV Bhopal
- **Course:** B.Tech CSE, 2026 batch
- **Avatar initial:** R
- **Profile strength:** 72%

---

## 13. Known Patterns & Conventions

- **All styling is inline** — no CSS modules, no utility classes. Style objects are built inline using token values.
- **No routing library** — tab switching is done via `useState` + conditional rendering in `App.jsx`.
- **No external UI library** — all components are custom-built.
- **Animations** use CSS `transition` on transform/opacity; complex sequencing uses `setTimeout` + `requestAnimationFrame`.
- **Gradients** are per-job/hackathon — each data item carries its own `grad` and `accentGrad` strings.
- **All data is static/mock** — no API calls, no backend.
- **Social screens** (`SocialGroups`) is imported in the workspace but not currently connected to a nav tab in `App.jsx` (the social nav is: home, feed, connect, chat, profile — groups is rendered inside SocialHome/SocialConnect as a navigable concept but the screen is standalone).

---

## 14. Development Commands

```bash
npm run dev      # Start Vite dev server (localhost:5173)
npm run build    # Production build → dist/
npm run preview  # Preview production build
```
