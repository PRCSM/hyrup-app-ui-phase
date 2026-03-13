# HYRUP Social + Career Handoff

## 1. Project At A Glance

- Stack: React 18 + Vite 5.
- Entry: `src/main.jsx` -> `src/App.jsx`.
- UI style: Inline style objects (no CSS files), shared tokens in `src/tokens.js`.
- Interaction model: Single-page, local state only (no backend/API integration yet).
- Layout model: Mobile frame simulation using `src/components/Phone.jsx`.

## 2. High-Level Architecture

`src/App.jsx` is the orchestration layer.

- Global mode switch:
  - `mode = "career" | "social"`
  - Toggled by `ModeToggle`.
- Separate tabs per mode:
  - Career tab state: `cTab`
  - Social tab state: `sTab`
- Shared shell:
  - `Phone` wraps all screens.
  - `BottomNav` renders mode-specific tab items.

### Career state owned in `App.jsx`

- `activeJobs`: jobs still in decision pool.
- `acceptedJobs`: applied/accepted jobs.
- `rejectedJobs`: skipped/rejected jobs.
- `bookmarkedIds`: saved jobs list.
- `hackathons`: static hackathon cards.

Core mutation methods:
- `moveJob(jobId, destination)` keeps jobs mutually exclusive between active/accepted/rejected.
- `toggleBookmark(id)` independently manages saved jobs.

## 3. Shared Building Blocks

- `src/tokens.js`
  - Theme maps for Career (`T.c`) and Social (`T.s`).
  - Font imports and typography constants.
- `src/icons.jsx`
  - Central SVG path dictionary and `Svg` renderer.
- `src/helpers.jsx`
  - `Row` and `Col` flex helpers.
- `src/components/ModeToggle.jsx`
  - Mode switch used in many headers.
- `src/components/BottomNav.jsx`
  - Bottom tab navigation.
- `src/components/Phone.jsx`
  - Phone shell and status bar frame.

## 4. Social Module (What It Is)

Social mode is a community and peer-network layer for students:
- Discover and consume peer content.
- Find and connect with students.
- Chat via DMs/groups.
- Maintain social profile and project presence.

### Screens and Responsibilities

- `src/screens/social/SocialHome.jsx`
  - Dashboard: greeting, daily challenge card, weekly streak strip.
  - Quick action cards route users to feed/connect/chat.
  - Preview section for trending posts.

- `src/screens/social/SocialFeed.jsx`
  - Swipe-style full-image feed cards.
  - Gestures:
    - Swipe left: next post.
    - Swipe right: save/bookmark feedback.
  - Local-only feed state (`cardIdx`, `dragX`, `swipeAction`).

- `src/screens/social/SocialConnect.jsx`
  - Discover people via swipe cards and tabbed views.
  - Tabs:
    - Suggested: Tinder-like connect/skip interactions.
    - Requests: pending requests list.
    - Nearby: location-style list and radius chips.

- `src/screens/social/SocialChat.jsx`
  - Unified inbox for DMs and groups.
  - Filter chips (`All`, `DMs`, `Groups`).
  - Static conversation list with unread badges.

- `src/screens/social/SocialProfile.jsx`
  - Social identity page, stats, skills, project grid.
  - CTA buttons (`AI Resume`, `Edit Profile`) are currently UI-only.

## 5. Career Module (What It Is)

Career mode is a guided opportunity system:
- Discover jobs and hackathons.
- Swipe/apply/skip job opportunities.
- Track accepted/rejected/job-status buckets.
- Improve profile and visibility signals.

### Screens and Responsibilities

- `src/screens/career/CareerHome.jsx`
  - Career dashboard with engagement layers:
    - Greeting + metrics
    - Quick Apply CTA leading to swipe flow
    - Daily challenge and profile-strength nudges
    - Recruiter activity, top picks, project performance, activity feed

- `src/screens/career/CareerJobs.jsx`
  - Main opportunities manager.
  - Features:
    - Filter modal integration (`FilterPanel`).
    - Saved jobs view.
    - Jobs vs Hackathons view toggle with animated transition.
    - Swipe interactions on active jobs.
    - Accepted/Rejected compact cards with detail modal.

- `src/screens/career/SwipeScreen.jsx`
  - Full-screen swipe-to-apply surface.
  - Supports:
    - Built-in card set or injected `cards` prop.
    - Horizontal swipe detection and direction lock.
    - Apply/skip action handling and optional callback (`onAction`).

- `src/screens/career/FilterPanel.jsx`
  - Bottom-sheet style filter UI.
  - Controls `jobType`, `location`, `salaryMin`, and `status`.

- `src/screens/career/AcceptedRejectedJobModal.jsx`
  - Read-only detail modal for accepted/rejected job cards.

- `src/screens/career/CareerChat.jsx`
  - Career-focused chats (HR/mentor/recruiter/bot mock data).

- `src/screens/career/CareerNews.jsx`
  - Career/tech news feed cards (mock data).

- `src/screens/career/CareerProfile.jsx`
  - Rich profile page with scoring logic:
    - profile strength calculation
    - recruiter visibility score
    - skills states (verified/unverified/locked)
    - projects, badges, activity tabs

## 6. Data Sources and Contracts

- Jobs source: `src/data.js`
  - `ALL_JOBS` base catalog.
  - `applyFilters(jobs, filters)` helper.

- Hackathons source:
  - In `src/App.jsx` local constant `HACKATHONS`.

- Social content:
  - Currently embedded as local arrays inside each social screen.

- Image assets:
  - `public/images/profile_sneha.png`
  - `public/images/profile_kiran.png`
  - `public/images/profile_ananya.png`
  - `public/images/post_graphic.png`

## 7. If You Move This To Another Project

Recommended migration split:

1. Keep these as a shared design system package:
- `src/tokens.js`
- `src/icons.jsx`
- `src/helpers.jsx`
- `src/components/ModeToggle.jsx`
- `src/components/BottomNav.jsx`
- `src/components/Phone.jsx`

2. Move Social as one feature module:
- `src/screens/social/*`

3. Move Career as one feature module:
- `src/screens/career/*`
- `src/data.js` (or replace with API service layer)

4. Replace `src/App.jsx` with host app routing/state orchestration.

### Suggested target structure in a larger codebase

- `features/social/` for all social screens + local social service.
- `features/career/` for jobs flow + profile + filters + modal.
- `shared/ui/` for `Phone`, nav, toggle, icon primitives.
- `shared/theme/` for tokens.
- `shared/data/` or `services/` for API-backed jobs/social feeds.

## 8. Codebase Management Notes

- Current implementation is prototype-first:
  - Heavy inline styles.
  - Mock data in component files.
  - No async fetching, no persistence, no tests.

For long-term maintainability in another project:
- Move mock arrays into feature data files/services.
- Add TypeScript types (or PropTypes) for job/post/user models.
- Introduce route-level modules instead of one central `renderScreen` switch.
- Add unit tests for:
  - `moveJob` bucket behavior
  - `applyFilters`
  - profile score utility logic
- Add integration tests for swipe/gesture flows.

## 9. Practical Summary

- Social = community graph + content + chat + profile presence.
- Career = opportunity discovery + swipe apply + profile ranking signals.
- App shell currently ties both under one mode toggle and one navigation system.
- Best handoff approach: extract shared UI primitives, then keep Social and Career as separate feature packages with independent state and data services.
