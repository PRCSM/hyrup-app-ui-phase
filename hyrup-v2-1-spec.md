# HYRUP V2.1 — Complete Platform Specification
### Master Design + Development Document
**Version:** MVP Phase 2.1  
**Stack:** React + Vite · Vanilla CSS-in-JS · Mobile-first · iOS Design Language  
**Fonts:** Bricolage Grotesque (display, 700–900) + DM Sans (body, 400–600)  
**Default Mode:** Social (not Career)  
**Updated:** March 2026

---

## Critical Design Directives

Before reading anything else, internalize these non-negotiables:

1. **Social is the default landing mode.** `mode` state in App.jsx must default to `"social"`. First-time and returning users land on Social Home.
2. **No emoji in app UI** except inside Chat screens. Use custom SVG icons or small animated Lottie characters throughout all non-chat screens.
3. **Community Feed is Twitter/Threads-style** — scrollable list, avatar left + content right, NOT swipeable full-screen cards. Reference Image 4 and Image 7.
4. **iOS design language** — generous whitespace, SF-style spacing, native feel, spring animations, no garish gradients except brand moments.
5. **Two distinct visual modes** — Social is warm light (#F8F7F5), Career is deep dark (#0F0F0F). The toggle between them must feel like entering a different world.

---

## Table of Contents

1. [Design System](#1-design-system)
2. [Architecture Overview](#2-architecture-overview)
3. [Dual-Mode System](#3-dual-mode-system)
4. [Social Mode — All Screens](#4-social-mode--all-screens)
5. [Career Mode — All Screens](#5-career-mode--all-screens)
6. [Bridge Features](#6-bridge-features)
7. [Navigation & Routing](#7-navigation--routing)
8. [Interaction Patterns & Gestures](#8-interaction-patterns--gestures)
9. [Animation Spec](#9-animation-spec)
10. [State Management](#10-state-management)
11. [Icon & Character System](#11-icon--character-system)
12. [Complete Flow Diagrams](#12-complete-flow-diagrams)
13. [Feature Matrix](#13-feature-matrix)
14. [Build Roadmap](#14-build-roadmap)

---

## 1. Design System

### 1.1 Typography

| Role | Font | Weight | Size |
|------|------|--------|------|
| Display / Hero headings | Bricolage Grotesque | 800–900 | 28–40px |
| Section titles | Bricolage Grotesque | 700 | 20–24px |
| Card titles | Bricolage Grotesque | 700 | 15–17px |
| Body text | DM Sans | 400–500 | 13–15px |
| Labels / metadata | DM Sans | 400 | 11–12px |
| Stats / numbers | Bricolage Grotesque | 800 | 22–36px |
| Code / badges | DM Mono | 500 | 10–11px |

### 1.2 Color Palette

#### Social Mode (Light — Default)

| Token | Value | Usage |
|-------|-------|-------|
| `bg` | `#F8F7F5` | Page background (warm white) |
| `s1` | `#FFFFFF` | Cards, elevated surfaces |
| `s2` | `#F2F0EC` | Subtle secondary backgrounds |
| `s3` | `#E8E4DC` | Borders, dividers |
| `orange` | `#FF5722` | Primary accent (vivid orange) |
| `orange-light` | `rgba(255,87,34,0.10)` | Tinted surfaces |
| `green` | `#16A34A` | Success, verified states |
| `red` | `#DC2626` | Error, reject |
| `text-primary` | `#111111` | Main text |
| `text-secondary` | `#7A746C` | Subtext, metadata |
| `text-muted` | `#B0AAA2` | Disabled, placeholder |

#### Career Mode (Dark)

| Token | Value | Usage |
|-------|-------|-------|
| `bg` | `#0F0F0F` | Page background |
| `s1` | `#161616` | Nav bar, elevated surfaces |
| `s2` | `#1E1E1E` | Cards, inputs |
| `s3` | `#272727` | Nested surfaces |
| `orange` | `#FF7A1A` | Primary accent (warm orange) |
| `orange-dim` | `rgba(255,122,26,0.15)` | Tinted surfaces |
| `green` | `#22C55E` | Success, accept |
| `red` | `#EF4444` | Error, reject |
| `blue` | `#3B82F6` | Info, links |
| `gold` | `#F59E0B` | XP, streak, reward |
| `text-primary` | `#F0F0F0` | Main text |
| `text-secondary` | `#8A8A8A` | Subtext |
| `text-muted` | `#555566` | Disabled |

### 1.3 Spacing & Radius

| Token | Value | Usage |
|-------|-------|-------|
| `screen-pad` | `22px` | Horizontal screen padding |
| `card-pad` | `18px` | Internal card padding |
| `radius-card` | `22px` (Social) / `20px` (Career) | Main cards |
| `radius-pill` | `100px` | Buttons, chips, tags |
| `radius-button` | `14px` | Rectangular buttons |
| `radius-avatar-sm` | `50%` | Round avatars (Social) |
| `radius-avatar-lg` | `16px` | Square-ish avatars (Career) |
| `gap-section` | `24px` | Between sections |
| `gap-card` | `12px` | Between cards in a list |

### 1.4 Design Inspiration Synthesis (from reference images)

From the 7 reference images, these specific patterns are adopted:

**From Image 1 (Fitness social app):**
- Friend story rings in header — horizontally scrollable avatar row with names below
- Compact inline post composer with type tag selector (e.g. "Placement", "Project", "Win")
- Dual-panel bento card rows for challenge + group info

**From Image 2 (Challenge leaderboard):**
- Podium visualization for top 3 in weekly challenges — user avatars on bars
- Side-by-side stats comparison table for group challenges (Me / Peer A / Peer B)
- Reward CTA sticky bar at bottom of challenge screen: "Winner gets XP + Champion Badge"
- Warm orange gradient as the celebration color for challenge cards

**From Image 3 (Dark social bento layout):**
- Bento grid layout on Social Home — large stat numbers, activity cards
- Activity section showing "X + 74 others liked your post" aggregated notification style
- "Memories" style card — pull up a past achievement or post from this day last year

**From Image 4 (Twitter/Threads-style feed) — PRIMARY FEED REFERENCE:**
- Avatar on left, content block on right — standard social post anatomy
- "For You" / "Following" / "My College" tab switcher at top
- Inline media (images/videos) within post card, not full-screen
- Pill-shaped engagement row: Comments · Reposts · Reactions · More (...)
- Floating circular FAB (+) for creating post — bottom right
- No swipe gestures on feed — pure vertical scroll
- Post type tag shown as subtle label in post header

**From Image 5 (Map / AgroAI):**
- Map-first view for Proximity Connect with floating filter chips above map
- Floating right-side controls column: layers, zoom in, zoom out, locate me
- Bottom sheet slides up when a pin is tapped — shows user card
- Clean minimal map style (consider light map tiles for Social, dark for Career)
- Map/List toggle pill at top-left corner

**From Image 6 (Proximity/discovery map):**
- Profile photo as map pin — small circular photo cropped into pin
- "Curations for you" row below map — AI-suggested connections based on proximity
- "Curators for you" avatar row — people worth following nearby
- Search bar overlaid on top of map
- "Search here" button appears when map is panned

**From Image 7 (Chatterspace — dark social):**
- Onboarding: full-bleed photo background, bold display headline, single CTA button
- Feed: "For you / Following" toggle in header, user avatar top right
- Explore / Trending section with numbered rank + category tag + post count
- Minimal nav bar — just icons, active tab pill lifts the icon

---

## 2. Architecture Overview

```
HYRUPApp (Root)
├── ModeToggle (Social ↔ Career pill — defaults to Social)
├── Phone (device frame wrapper)
│   ├── Screen Container (scrollable)
│   │   ├── [Social Screens] (DEFAULT)
│   │   └── [Career Screens]
│   └── BottomNav (5-tab, mode-aware)
└── Overlays (z-index stack)
    ├── SwipeScreen (Career full-screen, z:100)
    ├── FilterPanel (bottom-sheet, z:50)
    ├── PostComposer (full-screen modal, z:90)
    ├── TeamFormation (modal, z:80)
    └── XPCelebration (overlay, z:110)
```

### File Structure

```
src/
├── App.jsx                    # Root — mode defaults to "social"
├── tokens.js                  # Design tokens (both themes)
├── icons.jsx                  # Custom SVG icon library (no emoji)
├── characters.jsx             # Animated Lottie character components
├── data.js                    # Jobs, hackathons, users, posts, groups
├── helpers.jsx                # Row, Col, Divider layout utilities
│
├── components/
│   ├── Phone.jsx              # Device frame
│   ├── BottomNav.jsx          # 5-tab, mode-aware styling
│   ├── ModeToggle.jsx         # Pill toggle — Social left / Career right
│   ├── PostCard.jsx           # Twitter-style post card (NEW)
│   ├── MapView.jsx            # Proximity map component (NEW)
│   ├── XPBar.jsx              # XP level progress bar (NEW)
│   ├── ChallengeCard.jsx      # Weekly challenge card (NEW)
│   └── AchievementToast.jsx   # XP / badge earned toast (NEW)
│
├── screens/
│   ├── social/                # PRIMARY SECTION — default landing
│   │   ├── SocialHome.jsx     # DEFAULT LANDING SCREEN
│   │   ├── SocialFeed.jsx     # Twitter-style — REDESIGNED
│   │   ├── SocialConnect.jsx  # + Same Path tab + Map view expanded
│   │   ├── SocialChat.jsx     # + Groups wired in + inner chat
│   │   ├── SocialProfile.jsx  # + XP badge + Career skill sync
│   │   └── SocialGroups.jsx   # WIRE INTO NAV (currently orphaned)
│   │
│   ├── career/
│   │   ├── CareerHome.jsx     # + Roadmap widget + relative rank
│   │   ├── CareerJobs.jsx     # + Hackathon team formation bridge
│   │   ├── CareerChat.jsx     # + Inner chat view wired
│   │   ├── CareerNews.jsx     # + Share to Social Feed
│   │   ├── CareerProfile.jsx  # + Open To + goal field + XP badge
│   │   ├── SwipeScreen.jsx    # + Super-save + skip reason
│   │   ├── FilterPanel.jsx    # Unchanged
│   │   └── AcceptedRejectedJobModal.jsx
│   │
│   └── shared/                # NEW — bridge screens
│       ├── AIRoadmap.jsx      # Placement readiness + weekly plan
│       ├── WeeklyChallenge.jsx # Challenge detail + leaderboard
│       ├── XPSystem.jsx       # Level + streak + breakdown
│       └── TeamFormation.jsx  # Hackathon team request modal
```

---

## 3. Dual-Mode System

### How It Works

- Global `mode` state: `"social"` (default) or `"career"` — managed in App.jsx
- ModeToggle appears in every screen header — can switch at any time
- On toggle: 160ms crossfade animation, full color system transitions
- Independent tab states: `sTab` (social) and `cTab` (career) — both preserved on switch
- Return visit: app opens to last active screen within last active mode

### Theme Transition

When mode changes:
1. Opacity fades to 0 (80ms)
2. Background color, surface colors, accent color all swap
3. Bottom nav updates (dark vs light style)
4. Opacity fades back to 1 (80ms)
5. Total: 160ms crossfade

### ModeToggle Design

- Pill-shaped: 178px × 36px
- Social position: left pill active (warm, light orange shadow)
- Career position: right pill active (dark, strong orange glow)
- Sliding animated indicator: spring cubic-bezier(0.34,1.56,0.64,1), 300ms
- Icons: custom SVG (community icon for Social, briefcase for Career — no emoji)

---

## 4. Social Mode — All Screens

### 4.0 First-Time User Onboarding (Social-First)

**Screen: Onboarding splash**

Inspired by Chatterspace (Image 7) — full-bleed approach:

```
Layout:
- Full-bleed background: collage of student moments / achievement cards (not stock photos)
- Dark overlay gradient from bottom
- Bottom 40% of screen: white card sliding up
- Card content:
  - HYRUP wordmark (custom logotype)
  - Headline: "Your campus. Your career. Your crew."
  - Subline: "Join 50,000 students already building in public."
  - Primary CTA button: "Get Started" (full-width, orange pill)
  - Secondary: "Already on HYRUP? Sign in"
```

**Onboarding tour (3 screens, swipe-through):**

Screen 1 — Social intro:
- Animated character (Hyru mascot, small illustrated figure) pointing at feed
- Headline: "Build in public. Get noticed."
- Body: "Post wins, find your crew, collaborate with students across India."

Screen 2 — Career intro:
- Animated character holding a briefcase / job card
- Headline: "Swipe your way to your dream role."
- Body: "AI matches you to jobs based on skills, not CGPA."

Screen 3 — Bridge intro:
- Two-panel split: Social card left, Career card right, arrow between
- Headline: "Social and Career, unified."
- Body: "Your community powers your career. One toggle away."

---

### 4.1 Social Home

**File:** `SocialHome.jsx`  
**Purpose:** Default landing screen. Activity dashboard, daily challenge, quick entry points.  
**Status:** Live — improved in V2.1

```
Screen Layout (top to bottom):

1. HEADER ROW
   - Left: HYRUP logotype (custom, small)
   - Center: "Good morning, Rahul" (time-aware greeting, DM Sans 500 14px)
   - Right: Custom notification bell icon (with unread dot, orange)
   - Below header: ModeToggle pill

2. STORY RINGS ROW (inspired by Image 1)
   - Horizontal scroll, no scrollbar
   - First item: "+" add story / post — circular outlined button with custom + icon
   - Each friend: circular avatar (44px), name below in 10px DM Sans
   - Active story ring: orange border with slight glow
   - Shows: 6 friends + "Add" button

3. DAILY CHALLENGE HERO CARD
   - Background: warm orange gradient (#FF5722 → #FF8A65)
   - NO emoji — use custom flame/streak SVG icon
   - Top-left label: "DAILY CHALLENGE" (10px DM Mono uppercase, white 60%)
   - Streak counter: custom streak SVG icon + "5 day streak" (Bricolage 700 18px, white)
   - Prompt: "Share what you built today" (Bricolage 800 20px, white)
   - Sub-text: "Post a project update and keep your streak alive" (DM Sans 400 13px, white 80%)
   - CTA button: "Create Post" (white pill button, orange text)

4. WEEK ACTIVITY TRACKER
   - 7 circular day indicators (Sun–Sat)
   - Filled: solid orange circle with custom checkmark SVG
   - Today: orange ring with glow effect
   - Future: empty circle, muted border
   - "Week 12 — 5 of 7 days active" label above

5. QUICK CARDS GRID (2×3 bento layout — inspired by Image 3)
   Card 1: New Connections (count badge, custom people SVG)
   Card 2: Active Groups (count badge, custom groups SVG)
   Card 3: Trending Win (name + college — "Priya got placed at Amazon")
   Card 4: Study Group (members online count)
   Card 5: Weekly Challenge (progress % bar)
   Card 6: Placement Readiness (% from Career roadmap — bridge card)
   
   Style:
   - 2-column grid, mixed heights (Cards 1+2 short, Card 3 tall, etc.)
   - Each card: white bg, 22px radius, subtle shadow
   - Tap any → navigates to relevant screen/tab
   - Placement Readiness card: orange tint bg, shows Career % — tapping switches to Career mode

6. TRENDING NOW PREVIEW
   - Section header: "Trending in your college" (Bricolage 700 16px) + "See all" link
   - 2 post preview cards (Twitter-style mini cards — avatar, name, 1-line preview)
   - Tap "See all" → switches to Feed tab
```

**Interactions:**
- Tap story ring → (future: story view)
- Tap + → opens Post Composer modal
- Tap Daily Challenge card → opens Post Composer pre-tagged as "Daily"
- Tap Quick Card → navigates to respective tab
- Tap Placement Readiness card → switches to Career mode → Career Home
- Tap "See all" → sTab = "feed"

---

### 4.2 Social Feed (REDESIGNED — Twitter/Threads Style)

**File:** `SocialFeed.jsx`  
**Purpose:** Scrollable chronological + ranked post feed. Primary social content surface.  
**Status:** REDESIGNED from swipe-card format to Twitter-style list  
**Primary Reference:** Image 4 (Twitter-style dark feed) + Image 7 (Chatterspace)

```
MAJOR CHANGE FROM V2:
Previous design: Full-screen swipeable image cards (TikTok style)
New design: Scrollable list of Twitter/Threads-style post cards

Why: Swipe-card format limits content density and makes text posts
awkward. Twitter-style allows mixed content (text, images, links)
and feels natural for career-context content.
```

```
Screen Layout:

1. HEADER
   - Left: "Feed" (Bricolage 700 22px)
   - Center: Tab switcher — "For You" | "Following" | "My College" | "Trending"
     Style: pill tabs, active = filled orange pill, inactive = plain text
   - Right: User avatar (circular, 32px) — taps to profile
   - ModeToggle below header

2. FILTER CHIPS ROW (below tabs, horizontal scroll)
   - All | Placement | Project | Hackathon | DSA | News | AMA
   - Style: pill chips, selected = orange bg, unselected = outlined
   - Chips use custom SVG icons, no emoji

3. FEED LIST (vertical scroll, no pagination — infinite scroll)
   Each PostCard component:
   
   POST CARD ANATOMY (inspired by Image 4):
   ┌─────────────────────────────────────┐
   │ [Avatar 40px] Name · @handle · 2h  [···] │
   │               College · Post type tag    │
   │                                          │
   │ Post text content (DM Sans 400 14px)     │
   │ Up to 3 lines collapsed, tap to expand  │
   │                                          │
   │ [Media: image/video if attached]         │
   │ Rounded 16px, full-width within card    │
   │                                          │
   │ [Verified badge if placement]            │
   │ "Placed at Amazon · Verified by HYRUP"  │
   │                                          │
   │ ─────────────────────────────────────── │
   │ [Chat icon] 4  [Repost] 7  [Star] 68  [...] │
   └─────────────────────────────────────────┘
   
   Engagement row icons: all custom SVG, pill-shaped containers
   Star/reaction shows count with orange highlight when active
   
   POST TYPE TAGS (shown in post header, small pill):
   - PLACEMENT (green)
   - PROJECT (blue)
   - HACKATHON (purple)  
   - DSA TIP (amber)
   - WIN (orange)
   - AMA (teal) — for mentor Ask Me Anything posts
   - TEAM REQUEST (red-orange) — for hackathon team finding
   - ROADMAP (indigo) — for roadmap share posts
   All text-only tags, custom color per type, no emoji

4. TEAM REQUEST POST TYPE (special card variant)
   - Orange-tinted background card
   - Title: "Looking for Hackathon Team"
   - Role slots shown as chips: "Need: Frontend Dev · Designer · ML Engineer"
   - "Join Team" button (primary orange pill) replaces standard engagement row
   - Hackathon name + date shown
   - "View full request" expands to TeamFormation modal

5. ROADMAP SHARE POST TYPE (special card variant)
   - Progress visualization: horizontal bar showing X% placement ready
   - Goal displayed: "Targeting: Frontend Dev · Startup · July 2026"
   - "Same goal? Connect" CTA — navigates to Connect > Same Path tab
   - Share count shown

6. FLOATING FAB (Create Post)
   - Position: bottom-right, above nav bar (16px clearance)
   - Style: circular 52px, orange (#FF5722), custom + icon (SVG), white
   - Shadow: 0 4px 20px rgba(255,87,34,0.4)
   - Tap → opens Post Composer (full-screen modal)
```

**Post Composer Modal:**

```
Full-screen slide-up modal:

Header: "×" close · "New Post" title · "Post" button (orange pill, disabled until text)

Content:
- User avatar + name row
- Post type selector: horizontal scroll of type pills
  (Placement / Project / Hackathon / DSA / Win / AMA / Team Request / Roadmap Share)
- Text input area (multiline, placeholder: "What are you building?")
- Media attach area (when image added: preview with × remove button)
- Tag input: "#reactjs #frontend #hyrup"
- AI Rewrite button: small pill "Rewrite with AI" → sends to AI, replaces text
  (uses Anthropic API / backend AI — rewrites for clarity + adds relevant hashtags)

Bottom toolbar:
- Image attach icon (custom SVG)
- Video attach icon
- Link icon
- Location tag icon
- Character count (280 chars before overflow warning)

On Post:
- +30 XP awarded
- Post appears at top of Feed
- XP toast notification slides in from bottom
```

**Interactions:**
- Vertical scroll → browse feed
- Tap post text → expand to full post view
- Tap avatar → navigate to that user's Social Profile
- Tap media → full-screen media viewer (pinch to zoom)
- Tap post type tag → filter feed to that type
- Tap "Join Team" on Team Request post → TeamFormation modal
- Tap "Same goal?" on Roadmap post → sTab = connect, connectTab = "samepath"
- Long press post → context menu: Save / Copy / Report / Share
- Tap ··· menu → same as long press
- Pull to refresh → fetch new posts

---

### 4.3 Social Connect — Find Your Tribe

**File:** `SocialConnect.jsx`  
**Purpose:** Peer discovery with 4 tabs: Suggested, Requests, Nearby (Map), Same Path  
**Status:** Live — expanded significantly in V2.1

```
Screen Layout:

1. HEADER
   - "Find Your Tribe" (Bricolage 700 22px)
   - ModeToggle

2. TAB BAR (4 tabs)
   Suggested | Requests (2) | Nearby | Same Path
   
   Active tab: bottom border indicator (orange), bold label
   Unread badge on Requests tab when pending

─── TAB: SUGGESTED ───

Full-photo swipe cards (unchanged from V2):
- Full-screen profile photo with dark gradient overlay
- Top badges: WHY reason chip + Level badge
  WHY chips: "Same domain" / "Same city" / "3 mutual" / "Complementary skills"
  All custom SVG icons in chips, no emoji
- Bottom glassmorphism panel: College · Name · Skill chips
- Swipe right → Connect (green indicator, card flies right)
- Swipe left → Skip (muted, card flies left)
- Action buttons below card: Skip (outlined ring) · Connect (filled ring)

─── TAB: REQUESTS ───

- Pending list: avatar + name + college + domain + "Why connected" reason
- Accept button (green, custom checkmark SVG) · Decline button (outlined)
- "X new requests" count at top

─── TAB: NEARBY (Expanded — inspired by Image 5 + Image 6) ───

Two sub-views toggled by pill at top: [Map] [List]

MAP VIEW:
- Full-screen map (Mapbox or Google Maps, custom light style for Social)
- Overlaid search bar at top: "Search by skill or name..."
- "Search here" button appears on map pan (like Image 6)
- Filter chips row (horizontal scroll, floating above map):
  [Same College] [10km] [50km] [React] [Same Roadmap] [Open to Study]
  
- Map pins: circular profile photos (36px) as pins (like Image 6)
  - Regular pin: circular photo with subtle orange ring
  - Study Session mode pin: photo with pulsing green ring
  - Hotspot cluster: stacked photos when 3+ in same area
  
- Right-side floating controls column (inspired by Image 5):
  - Layers icon (custom SVG) — toggle filters view
  - Zoom in (+ icon)
  - Zoom out (- icon)
  - Locate me (crosshair icon)
  
- Bottom sheet (slides up when pin tapped):
  - User avatar + name + college + domain
  - Skill chips row
  - "Message" button + "Connect" button
  - "Coffee Chat" CTA — opens DM with pre-filled "Hey, want to study together?"

- "Open for Study" toggle (my own status):
  - Top of map screen, below filter chips
  - Toggle: off = "Set yourself as available to meet" / on = pulsing green indicator
  - When on: my pin shows on others' maps for 4 hours (auto-expires)
  - Privacy note: "Shown as your college area only until precise mode enabled"

LIST VIEW:
- Standard list of nearby users
- Sort by: Nearest / Same College / Same Domain
- Each row: avatar + name + distance + college + domain + Connect button
- "AI-suggested for you" section at top (curations — inspired by Image 6)

─── TAB: SAME PATH (NEW) ───

- Header: "People on the same roadmap as you"
- Sub-header: "Your goal: Frontend Dev · Product Startup · July 2026"
- User cards (list style, not swipe):
  - Avatar + name + college
  - Roadmap match score: "94% path similarity"
  - Shared goal tag
  - "Same Path" badge
  - Connect button + "Study Together" button
- "Form Accountability Pair" option — creates shared weekly goal tracker + DM
- Empty state: animated Hyru character pointing at Career section, text: "Set your career goal in Career mode to unlock this tab"
```

**Interactions:**
- Swipe cards on Suggested tab (same as V2)
- Tap Map/List toggle → switches sub-view
- Tap map pin → bottom sheet slides up
- Tap "Coffee Chat" → opens DM
- Toggle "Open for Study" → updates own map visibility
- Tap filter chip on map → re-filters pins
- Tap "Form Accountability Pair" → creates DM thread + shared goal card

---

### 4.4 Social Chat — Unified Inbox

**File:** `SocialChat.jsx`  
**Purpose:** All messaging — DMs, groups (Cults), accountability, hackathon teams  
**Status:** Live — inner chat view being added in V2.1

```
Screen Layout:

1. HEADER
   - "Messages" (Bricolage 700 22px)
   - Right: Compose new (custom pen SVG icon)
   - ModeToggle

2. SEARCH BAR
   - "Search messages..." placeholder
   - Custom search SVG icon

3. FILTER TABS
   All | DMs | Groups | Cults
   (Cults = all group types: Hack, Study, Fun, Accountability, Roadmap, Hackathon)

4. CONVERSATION LIST
   Each conversation row:
   ┌──────────────────────────────────────────┐
   │ [Avatar 44px] Name              Time    │
   │ [Type badge]  Last message preview  [N] │
   └──────────────────────────────────────────┘
   
   DM avatars: circular
   Group avatars: rounded square, colored by group type
   
   Group type badges (text labels, custom SVG icon):
   - Hack (lightning icon)
   - Study (book icon)
   - Fun (game controller icon)
   - Accountability (target icon)
   - Roadmap (map icon)
   - Hackathon (trophy icon)
   
   Unread badge: orange circle with count, right-aligned

5. INNER CHAT VIEW (NEW — tap to open)
   Full-screen push navigation (not modal):
   
   Header:
   - Back arrow
   - Group/DM name + members count (for groups) / online status (for DMs)
   - Right: Info icon → opens group details
   
   Messages:
   - Outgoing: right-aligned, orange bubble
   - Incoming: left-aligned, surface-colored bubble
   - System messages: centered, muted text (e.g. "Rahul joined the group")
   - Media messages: inline preview with tap-to-expand
   - Reactions: long-press message → reaction picker (heart, fire, +1, wow — custom SVGs, no emoji)
   
   For Groups: members shown in header with avatar row (up to 5, then +N)
   
   Input bar (bottom, above safe area):
   - Text input field (expandable)
   - Attach (paperclip custom SVG)
   - Camera icon
   - Send button (arrow custom SVG, orange when text entered)
   
   Group-specific features:
   - Pinned message bar at top (collapsible)
   - Hackathon groups: deadline countdown widget in group header
     "HackIndia — 4 days 12 hours remaining"
   - Poll widget: creates a vote card in chat
   - Task list: creates a checklist card in chat
   - Shared files tab accessible from group info

ACCOUNTABILITY GROUP SPECIFICS:
- Every Monday at 9am: system message appears: "New week! Set your 3 goals"
- Each member can reply with their goals (become pinned)
- Check-in prompt every day: "Did you work toward your goal today?"
- Progress ring per member visible in group header row

NEW GROUP TYPES WIRED:

Hackathon Team Group:
- Auto-created when team formation is confirmed
- Group header: hackathon name + prize + deadline countdown
- Team members shown with their role (Frontend Dev / Designer / etc.)
- "View Hackathon" link back to Career > Jobs > Hackathons

Roadmap Group:
- Auto-suggested to users with same career goal path
- Group title: "Frontend Dev · Startup Track · 2026"
- Shared placement readiness bar visible in group info

5. CREATE GROUP FLOW
   - Tap compose icon → options: "New DM" / "New Group" / "New Accountability Group"
   - New Group: name + type + add members from connections
   - New Accountability Group: name + shared goal text + invite
```

---

### 4.5 Social Profile

**File:** `SocialProfile.jsx`  
**Purpose:** Community identity page  
**Status:** Live — improved in V2.1

```
Screen Layout:

1. COVER + HEADER
   - Cover: warm gradient (#F8F7F5 → #FFE8D6), custom illustrated pattern overlay
   - User avatar: circular, 72px, border (white 3px + orange ring)
   - ModeToggle (top-right corner)
   - Edit / Follow button (top-right, below toggle)

2. IDENTITY BLOCK
   - Name (Bricolage 800 22px)
   - Handle: @rahulsharma (DM Sans 400 13px, muted)
   - Info line: B.Tech CSE · RGPV Bhopal · 2026 · Full Stack Dev
   - XP Level badge: "Builder · Lv 3" — small pill (orange bg, white text)
     Custom level icon (seed/spark/builder etc. — custom SVG per level)
   - Roadmap goal (opt-in): "Targeting: Frontend Dev at startup"
     Small muted text below info line

3. STATS ROW
   Connections | Posts | Skills | Wins
   Numbers: Bricolage 800 22px
   Labels: DM Sans 400 11px, muted
   Dividers between each stat

4. SKILL BADGES ROW
   - React (Verified — green custom checkmark SVG) 
   - Node.js (Verified)
   - Figma (Verified)
   - Python (Verified)
   - Horizontal scroll if overflow
   - "View Career Profile" link → switches to Career mode

5. ACTION BUTTONS ROW
   - Primary: "AI Resume" (orange pill, custom spark SVG icon)
   - Secondary: "Edit Profile" (outlined pill)
   - (If viewing another user: "Connect" + "Message")

6. TAB BAR
   Posts | Projects | Activity | Saved
   (Posts = user's feed posts, Projects = portfolio grid, Activity = recent actions, Saved = bookmarks)

7. CONTENT AREA (per tab)

   POSTS tab:
   - Standard PostCard list (same component as Feed)
   - User's own posts in chronological order
   
   PROJECTS tab:
   - 3-column grid of project cards
   - Each: colored bg + project icon (custom SVG or initial) + name
   - Tap → project detail (title, tech stack, links, description, view count)
   
   ACTIVITY tab:
   - List of recent actions in aggregated style (inspired by Image 3)
   - "You verified React · 2 days ago"
   - "Joined React Builders group · 5 days ago"
   - "Priya + 12 others reacted to your post · 1 day ago"
   
   SAVED tab:
   - Grid of saved posts from Feed
   - "Clear all" option
```

---

### 4.6 Social Groups — Join a Cult

**File:** `SocialGroups.jsx`  
**Purpose:** Group discovery and management  
**Status:** EXISTS in codebase but NOT wired to nav — WIRE IN V2.1

**Dev Note:** Wire SocialGroups.jsx as a sub-section within SocialChat (add "Cults" tab to chat filter row, tap → shows full groups view). OR add as dedicated tab replacing current Chat with Chat being accessible from within.

Recommended: Keep Chat as tab 4, make Groups discoverable from within Chat via "Discover Groups" CTA at top of conversation list.

```
Screen Layout:

1. HEADER
   - "Join a Cult" (Bricolage 800 22px)
   - Sub-header: "Find your study · build · run crew" (DM Sans 400 13px, muted)
   - ModeToggle

2. SEARCH BAR

3. TAB TOGGLE
   Discover | My Cults

4. CATEGORY FILTER CHIPS (horizontal scroll)
   All | Hack | Study | Fun | Accountability | Roadmap | Hackathon
   Custom SVG icons per type, no emoji

5. GROUP CARDS (2-column grid)
   Each card:
   - Color-coded left border by type (orange=Hack, blue=Study, etc.)
   - Group avatar (letter or custom icon)
   - Group name (Bricolage 700 14px)
   - Member count + "X online now"
   - Type badge
   - Description (1 line, truncated)
   - Join / Request button

6. NEW GROUP TYPES IN V2.1
   - Accountability: "3 career goals · 6 members · 4 active this week"
   - Roadmap: "Frontend Dev 2026 · 23 members · same career path"
   - Hackathon Team: "HackIndia 2025 · 4/5 slots filled · Needs: ML Engineer"

7. CREATE GROUP CTA
   - Prominent card at bottom of Discover list
   - "Start your own Cult"
   - Button: "Create Group" (orange pill)
   - Tap → create group modal (name + type + skills + invite)

8. AI GROUP SUGGESTIONS
   - "Suggested for you" section at top of Discover tab
   - "These groups match your skills and career goal"
   - 3 cards shown, swipeable
```

---

### 4.7 XP System & Gamification

**File:** `XPSystem.jsx` (shared)  
**Purpose:** Rewards, levels, streaks, weekly challenges — platform-wide  
**Status:** New in V2.1

#### XP Actions Table

| Action | XP | Where |
|--------|-----|-------|
| Create a post | +30 | Social |
| Post gets 50+ reactions | +20 bonus | Social |
| Comment on a post | +5 | Social |
| New connection made | +20 | Social |
| Join a Cult group | +15 | Social |
| Daily streak maintained | +10 | Social |
| 7-day streak milestone | +50 bonus | Social |
| Apply to a job | +25 | Career |
| Verify a skill | +40 | Career |
| Complete profile (100%) | +100 | Career |
| Share roadmap card | +15 | Bridge |
| Hackathon team formed | +35 | Bridge |
| Cross-section challenge | +80 | Bridge |
| Placement confirmed | +200 | Career |

#### XP Levels

| Level | Name | XP Range | Custom Icon |
|-------|------|----------|-------------|
| 1 | Seed | 0–499 | Small sprout SVG |
| 2 | Spark | 500–1,499 | Flame SVG |
| 3 | Builder | 1,500–3,499 | Hammer SVG |
| 4 | Creator | 3,500–7,999 | Star SVG |
| 5 | Pioneer | 8,000–15,999 | Rocket SVG |
| 6 | Legend | 16,000+ | Crown SVG |

All level icons are custom SVG, clean and geometric — no emoji.

#### Streak System

| Streak | Name | Badge |
|--------|------|-------|
| 3 days | Starter | Small fire SVG |
| 7 days | Week Warrior | Medium fire SVG |
| 14 days | On Fire | Large fire SVG |
| 30 days | Cult Legend | Crown fire SVG |

Streak resets at midnight if no qualifying action.  
**Streak Recovery:** 1 free save per month. Custom "Recovery Token" icon. Used automatically when streak would break — user is notified: "We used your Recovery Token to save your streak."

#### Weekly Challenge System

Four challenge types (new challenge every Monday):

**Solo Mini:**
- Example: "Verify any 1 skill this week"
- Reward: +50 XP + Mini badge
- Progress: shown as fill bar on challenge card

**Solo Major:**
- Example: "Build and post a full project in 7 days"
- Reward: +150 XP + Major badge
- Longer card with milestone steps

**Team Challenge:**
- Group collectively meets a target
- Example: "React Builders: apply to 10 jobs as a group"
- Reward: XP split equally among members + Group badge
- Progress: "Team: 6 / 10 applications"

**Cross-Section Challenge (Bridge — highest reward):**
- Example: "Post a project on Social + verify the skill it uses in Career this week"
- Reward: +200 XP + Cross-Section badge (special visual)
- Forces engagement in both modes
- Users who complete 2+ cross-section challenges become power users

#### Challenge Detail Screen (inspired by Image 2):

```
Screen: WeeklyChallenge.jsx

Header: Challenge name + share icon (custom SVG)
Sub-header: Group name + "Ends in 2d 14h" (countdown)

Hero visual (inspired by Image 2):
- Orange gradient card
- Top 3 participants shown as podium visualization
- User avatar photos on bars (1st place center + tallest)
- Sparkle/star decorations (custom SVG, NOT emoji)

Stats comparison table:
- Columns: Me | Peer1 | Peer2
- Rows: relevant metric (jobs applied / skills verified / posts made)
- Current user column highlighted

Leaderboard:
- Ranked list with XP bars
- Name + score + progress bar (orange gradient fill)
- My position highlighted

Reward CTA bar (sticky bottom — inspired by Image 2):
- "Winner gets 80 XP + Champion Badge"
- Custom trophy SVG icon
- "View all rewards" link
```

---

### 4.8 Post-Placement Layer

```
Triggered when: user marks "Placed" in Career Profile

Flow:
1. Celebration overlay: animated Hyru mascot character doing a happy dance
   Background: confetti using custom SVG shapes (no emoji)
   Headline: "You did it, Rahul." (Bricolage 900 32px)
   Sub: "You're placed at Amazon. HYRUP is proud of you."

2. Auto-composed placement post shown for review:
   Pre-filled text: "Just got placed at [Company]! After [X weeks] on HYRUP,
   I verified [skills] and applied to [N] jobs. Here's what worked..."
   User can edit freely
   Post type: PLACEMENT (auto-tagged, verified badge will appear)

3. Journey recap card (shareable):
   Beautiful card showing:
   - Name + placed company
   - XP earned total
   - Skills verified
   - Jobs applied
   - Days on platform
   - Share button → exports as image → share to WhatsApp, LinkedIn, etc.
   - Also shareable to Social Feed

4. Mentor onboarding prompt:
   "Help students who are where you were 6 months ago."
   "Become a mentor" CTA
```

---

## 5. Career Mode — All Screens

### 5.1 Career Home

**File:** `CareerHome.jsx`  
**Purpose:** Professional dashboard — dark mode, focused, outcome-driven  
**Status:** Live — V2.1 improvements

```
Screen Layout:

1. HEADER ROW
   - Left: greeting "Good morning, Rahul" (DM Sans 500 14px, muted white)
   - Right: notification bell (custom SVG, white) with unread dot
   - Below: ModeToggle

2. PLACEMENT READINESS HERO CARD (replaces generic Profile Strength)
   - Dark gradient card (#1E1E1E → #272727) with orange glow
   - "PLACEMENT READY" label (DM Mono 10px uppercase, orange)
   - Percentage: "47%" (Bricolage 900 52px, white)
   - Progress bar: orange gradient fill
   - Sub-text: "3 actions to move forward this week"
   - "View Roadmap" button → opens AIRoadmap.jsx

3. NEXT ACTIONS ROW (from AI Roadmap — top 3 only)
   3 small action cards, horizontal scroll:
   Card: icon + short action label + XP reward
   Example: "Verify React +40 XP" | "Upload a project +30 XP" | "Apply to 3 jobs +75 XP"
   Tap each → deep-links to relevant screen

4. STATS ROW (4 cards)
   - Applied (orange)
   - Shortlisted (green)
   - Profile Views (blue)
   - Recruiter Activity (purple) — "3 recruiters viewed today"

5. MATCHED JOBS SECTION
   - "Matched for you" header + "See all" link
   - Horizontal scrollable job cards
   - Each card: company initial + role + company + salary + AI match %
   - "Apply" button (orange pill)
   - Skill tags (orange pills)

6. QUICK APPLY CTA CARD
   - "5 jobs waiting" + "Swipe right to apply" hint
   - Card stack visual (animated)
   - "Start Swiping" button → opens SwipeScreen

7. TECH PULSE STRIP
   - 2 news items, timestamp, source badge
   - "More" link → navigates to News tab
```

**V2.1 Changes from V2:**
- Profile Strength card → Placement Readiness card (% + roadmap link)
- New "Next Actions Row" widget
- Stats row adds "Recruiter Activity" metric
- Relative rank shown: "You moved up 34 spots this week" (not absolute #847)
- Recruiter signal specificity: "A Bengaluru startup viewed your profile today"

---

### 5.2 Career Jobs & Opportunities

**File:** `CareerJobs.jsx`  
**Purpose:** Browse, filter, swipe, bookmark jobs + hackathon discovery + team formation  
**Status:** Live — V2.1 adds hackathon team formation bridge

(Unchanged from V2 except additions below)

**V2.1 Additions:**
- Match score on every active job card: "87% match" pill
- Application success rate shown: "Students like you: 34% response rate"
- Company watch list: save company, notified on new posting
- Salary benchmark chip on job card

**Hackathon Tab — V2.1 Additions:**

Each hackathon card now has a "Find Team" button alongside "Register":

```
Find Team flow (TeamFormation.jsx modal):

1. Modal slides up
   Header: "Build Your Team for [Hackathon Name]"
   
2. Role Slots section:
   "Roles needed (tap to add):"
   Chips: Frontend Dev · Backend Dev · UI/UX Designer · ML Engineer · DevOps · Product
   User taps which roles they need (multi-select)
   
3. AI Teammate Suggestions (loaded automatically):
   "3 people from your network match:"
   Mini cards: avatar + name + skills + match reason
   "Invite" button per card
   
4. Share Request section:
   "Share your team request:"
   Buttons: Post to Feed | Send DM | Share to Group | Copy Link
   Each button has custom SVG icon
   
5. Preview of team request post
   (auto-generated text, user can edit before posting)

6. Confirm button: "Create Team + Group Chat"
   → Creates Social Chat Hackathon group
   → Posts to feed if selected
   → Shows confirmation with group link
```

---

### 5.3 SwipeScreen — Quick Apply

**File:** `SwipeScreen.jsx`  
**Purpose:** Full-screen Bumble-style job review  
**Status:** Live — V2.1 adds super-save + skip reason

(Structure unchanged from V2)

**V2.1 Additions:**
- Swipe up gesture (>80px) → Super-save ("SUPER SAVED" gold stamp)
  - Limited to 3/day — creates scarcity
  - Gold glow effect on stamp
  - Counter: "2/3 super saves remaining today"
- Skip reason chips (appear after left swipe before next card):
  - "Not my domain" | "Salary too low" | "Bad location" | "Already applied" | "Other"
  - Optional (can dismiss) — tapping sends feedback to AI matching model
- After applying: "Interview Prep" option unlocks — "3 likely questions for this role" from AI

---

### 5.4 AI Career Roadmap

**File:** `AIRoadmap.jsx` (new)  
**Purpose:** Personalized placement path — the platform's retention north star  
**Status:** New in V2.1

```
Screen Layout:

1. HEADER
   - "My Roadmap" (Bricolage 700 22px)
   - "Frontend Dev · Product Startup · July 2026" (goal subtitle)
   - Edit goal (pencil icon, custom SVG)
   - ModeToggle

2. READINESS METER
   - Large circular progress: "47%" center (Bricolage 900 48px)
   - Arc fill: orange gradient
   - "Placement Ready" label below
   - Compared to: "Placed students at similar startups: avg 78%"

3. THIS WEEK — NEXT 3 ACTIONS (prominent)
   Card-style, ordered by impact:
   1. "Verify React skill → +6% readiness" — Verify button
   2. "Apply to 3 Frontend roles → +4% readiness" — Browse Jobs button
   3. "Add 1 project to portfolio → +3% readiness" — Add Project button
   
   Each: action icon (custom SVG) + text + impact % + XP reward + CTA button

4. ROADMAP TIMELINE (scrollable)
   Month-by-month breakdown:
   Each month: label + skills to learn + projects to build + jobs to apply
   Completed items: custom checkmark SVG + strikethrough
   Current month: highlighted with orange border

5. COMPARISON VIEW
   Toggle: "My path" vs "Placed Student's path"
   Side-by-side or overlay comparison
   "Students who got placed at similar companies verified these 3 skills first"

6. SHARE ROADMAP CTA
   - "Share your progress"
   - Share formats:
     a. Progress card: "47% ready for Frontend Dev" — graphic
     b. Weekly milestone card: "This week: verified React + applied to 5 jobs"
     c. Goal declaration: "I'm targeting Frontend Dev by July 2026 on HYRUP"
   - Share destinations: Social Feed / DM / External (generic share sheet)

7. DOMAIN SWITCH
   - "Change career goal" link at bottom
   - Shows domain picker: Frontend / Backend / UI-UX / Data / DevOps / Product / ML
   - Roadmap recalculates on change
```

---

### 5.5 Career Chat

**File:** `CareerChat.jsx`  
**Purpose:** Professional messaging — HR, mentors, AI bot  
**Status:** Live — inner chat view being wired in V2.1

Same conversation list structure as V2. Inner chat view added (same component as SocialChat inner view, styled in dark mode).

HYRUP AI Bot expanded in V2.1:
- Interview Q&A mode: "Give me 5 questions for a Frontend role at Razorpay"
- Salary negotiation tips
- Roadmap Q&A: "What should I do next?"
- Resume review: paste text, get feedback

---

### 5.6 Career Profile

**File:** `CareerProfile.jsx`  
**Purpose:** Professional identity — recruiters see this  
**Status:** Live — V2.1 improvements

**V2.1 Changes:**
- "Open To" status row added below bio: pill toggles for Internship / Full-time / Hackathon Teams / Mentorship
- Career goal field: "Targeting: Frontend Dev at startup · July 2026"
- Profile visit analytics: small "3 people viewed your profile this week" card (tappable for detail)
- Recruiter visibility score: "Visibility: 78 · Top 20% viewed by recruiters"
- XP level badge from Social mode: "Builder · Lv 3" shown in stats row
- Skill level tiers: React (Advanced ✓) / Node.js (Intermediate ✓) / etc.
- CGPA: moved to bottom of profile, non-prominent, labeled "Academic Background"
- "View Social Profile" link → switches to Social mode

---

### 5.7 Career News — Tech Pulse

**File:** `CareerNews.jsx`  
**Status:** Live — minor V2.1 additions

V2.1 Additions:
- Share article to Social Feed: small "Share" custom SVG button per article
- Domain filter: "Show only AI/ML articles" based on career goal
- Bookmark: saves to Career Profile bookmark tab

---

## 6. Bridge Features

These are the cross-section features that make Social and Career feel like one unified platform.

### 6.1 Hackathon Team Formation

Described fully in section 5.2 (Career Jobs). The bridge: a Career action (registering for hackathon) creates social artifacts (Feed post, Chat group, DM threads).

**Bridge touchpoints:**
- Career: Hackathon card → "Find Team" → TeamFormation modal
- Social: Feed post type "Team Request" with Join Team CTA
- Social: Chat group auto-created as Hackathon type
- Career: Portfolio auto-import after hackathon

### 6.2 Roadmap Sharing

Described in section 5.4. Bridge: Career's AI Roadmap data surfaces as social content.

**Bridge touchpoints:**
- Career: AI Roadmap → Share Progress → Social Feed or External
- Social: Connect > Same Path tab — powered by Career roadmap data
- Social: Chat Roadmap groups — auto-suggested based on same goal
- External: Share generates HYRUP public profile page (acquisition driver)

### 6.3 Achievement → Feed Moments

**Trigger events → Social share prompt:**

| Career Event | Share Card Type |
|--------------|-----------------|
| Skill verified | "Just verified [Skill] on HYRUP" badge card |
| Level up (XP) | "Reached [Level] on HYRUP" level card |
| Project 100+ views | "My project is trending" card |
| Rank milestone | "Top 10% in [City]" ranking card |
| Application shortlisted | "Just got shortlisted at [Company]" card |
| Placement confirmed | Full placement post (detailed in 4.8) |

All prompts are optional — always 1-tap to share, 1-tap to dismiss.
Cards are designed as beautiful shareable graphics.
External shares link to user's public HYRUP profile page.

### 6.4 Weekly Cross-Section Challenges

Four challenge types:
- Solo Mini (Career or Social)
- Solo Major (Career or Social)
- Team (Social groups)
- Cross-Section (both Career + Social, highest XP)

Cross-section example: "Post your project on Social + verify the skill it uses in Career this week."

### 6.5 Unified Profile

One underlying user data model, two styled views:

| Field | Career Profile | Social Profile |
|-------|---------------|----------------|
| Name, college, year | Yes | Yes |
| Verified skill badges | Yes (primary) | Yes (pulled from Career) |
| XP level | Shows (from Social) | Primary |
| Projects/portfolio | Grid tab | Grid tab |
| Jobs applied count | Primary stat | Hidden |
| Posts count | Hidden | Primary stat |
| Roadmap goal | Optional | Optional |
| "View other profile" | "View Social Profile" link | "View Career Profile" link |

---

## 7. Navigation & Routing

### Nav Map V2.1

```
                    ┌────────────────────────────────┐
                    │         ModeToggle              │
                    │  SOCIAL (default) ←──→ CAREER  │
                    │  160ms crossfade · state persists│
                    └──────────┬─────────────┬────────┘
                               │             │
          ┌────────────────────▼─┐      ┌───▼────────────────────┐
          │    SOCIAL MODE       │      │    CAREER MODE          │
          │    (Default Landing) │      │    (Toggle access)      │
          │                      │      │                          │
          │  BottomNav 5 tabs:   │      │  BottomNav 5 tabs:      │
          │  Home|Feed|Connect   │      │  Home|Jobs|Chat|News|Me │
          │  |Chat|Me            │      │                          │
          │                      │      │  ┌─home──────────────┐  │
          │  ┌─home────────────┐ │      │  │ CareerHome        │  │
          │  │ SocialHome      │ │      │  │  └→ SwipeScreen   │  │
          │  │ DEFAULT SCREEN  │ │      │  │  └→ AIRoadmap     │  │
          │  └─────────────────┘ │      │  └───────────────────┘  │
          │                      │      │                          │
          │  ┌─feed────────────┐ │      │  ┌─jobs──────────────┐  │
          │  │ SocialFeed      │ │      │  │ CareerJobs        │  │
          │  │ Twitter-style   │ │      │  │  └→ SwipeScreen   │  │
          │  │  └→ PostComposer│ │      │  │  └→ FilterPanel   │  │
          │  └─────────────────┘ │      │  │  └→ TeamFormation │  │
          │                      │      │  └───────────────────┘  │
          │  ┌─connect─────────┐ │      │                          │
          │  │ SocialConnect   │ │      │  ┌─chat──────────────┐  │
          │  │  ├ Suggested    │ │      │  │ CareerChat        │  │
          │  │  ├ Requests     │ │      │  │  └→ Inner chat    │  │
          │  │  ├ Nearby+Map   │ │      │  └───────────────────┘  │
          │  │  └ Same Path    │ │      │                          │
          │  └─────────────────┘ │      │  ┌─news──────────────┐  │
          │                      │      │  │ CareerNews        │  │
          │  ┌─chat────────────┐ │      │  └───────────────────┘  │
          │  │ SocialChat      │ │      │                          │
          │  │  ├ All/DM/Groups│ │      │  ┌─profile───────────┐  │
          │  │  ├ Inner chat   │ │      │  │ CareerProfile     │  │
          │  │  └ Groups disc. │ │      │  └───────────────────┘  │
          │  └─────────────────┘ │      │                          │
          │                      │      └──────────────────────────┘
          │  ┌─profile─────────┐ │
          │  │ SocialProfile   │ │
          │  └─────────────────┘ │
          └──────────────────────┘

Full-Screen Overlays (z-index stack, render above both modes):
  SwipeScreen     z:100   Full-screen job review
  PostComposer    z:90    Create post modal
  TeamFormation   z:80    Hackathon team modal
  FilterPanel     z:50    Bottom-sheet job filters
  AcceptedJobModal z:50   Job detail modal
  XPCelebration   z:110   Celebration overlay (level-up, placement)
```

### Bottom Nav Design

```
Career BottomNav (dark):
- Background: #161616
- Active tab: orange dot above icon + orange tint pill behind icon
- Inactive: icon only, muted (#555566)
- Icons: all custom SVG, 22px, 2px stroke
- Tabs: Home · Jobs · Chat · News · Me

Social BottomNav (light):
- Background: #FFFFFF with top border (#E8E4DC)
- Active tab: orange dot + orange tint pill
- Inactive: icon only, dark muted (#B0AAA2)
- Icons: same custom SVG set, slightly warmer treatment
- Tabs: Home · Feed · Connect · Chat · Me

Transition: nav bar background and icon colors crossfade with mode (160ms)
```

---

## 8. Interaction Patterns & Gestures

### 8.1 Swipe Gestures

| Screen | Direction | Threshold | Action | Visual Feedback |
|--------|-----------|-----------|--------|-----------------|
| Social Connect (Suggested) | Right | >90px | Send connect request | "Connect" indicator · card flies right with rotation |
| Social Connect (Suggested) | Left | >90px | Skip | "Skip" indicator · card flies left |
| Career Jobs (list) | Right | >80px | Accept job | Green overlay + "ACCEPT" label |
| Career Jobs (list) | Left | >80px | Reject job | Red overlay + "REJECT" label |
| Career Jobs (list) | Double tap | — | Toggle bookmark | Flash animation |
| Career Jobs (list) | Single tap | — | Open detail | Opens SwipeScreen |
| SwipeScreen | Right | >100px | Apply | Green glow + "APPLYING" stamp |
| SwipeScreen | Left | >100px | Skip | Red glow + "SKIPPING" stamp |
| SwipeScreen | Up | >80px | Super-save (3/day) | Gold glow + "SUPER SAVED" stamp |
| SwipeScreen | Vertical scroll | 8px lock | Scroll card content | Card content scrolls |

**Note:** Social Feed is NO LONGER swipeable. It is a standard vertical scroll list (Twitter-style). Previous swipe-to-save gesture on feed is replaced by tap-to-bookmark (bookmark icon on post engagement row).

### 8.2 Tap Gestures

| Context | Gesture | Action |
|---------|---------|--------|
| Post card | Single tap | Expand to full post |
| Post card | Tap avatar | Navigate to user profile |
| Post card | Long press | Context menu (Save / Copy / Report / Share) |
| Post card | Tap media | Full-screen media viewer |
| Map pin | Single tap | Bottom sheet slides up |
| Quick card (Social Home) | Single tap | Navigate to relevant tab |
| Achievement card | Single tap | Navigate to detail |
| Job card (accepted/rejected) | Single tap | Open modal |
| ModeToggle | Single tap | Switch mode |
| Bottom nav tab | Single tap | Switch tab |
| FAB (+) on Feed | Single tap | Open Post Composer |

### 8.3 Direction Lock (SwipeScreen)

Smart swipe detection on job cards:
- First 8px of movement determines direction lock
- Horizontal movement ≥ vertical → horizontal swipe mode (accept/reject)
- Vertical movement ≥ horizontal → scroll mode (read job details)
- Once locked, direction cannot change until touch ends

---

## 9. Animation Spec

| Animation | Duration | Easing | Trigger |
|-----------|----------|--------|---------|
| Mode crossfade (full theme) | 160ms | ease | ModeToggle tap |
| ModeToggle pill slide | 300ms | cubic-bezier(0.34,1.56,0.64,1) — spring | Mode switch |
| Career/Hackathon 3D flip | 380ms | cubic-bezier(0.22,1,0.36,1) | Tab tap |
| Swipe card exit | 250ms | ease | Threshold reached |
| Swipe card snap-back | 300ms | cubic-bezier(0.34,1.56,0.64,1) | Released early |
| Swipe stamp overlay | 350ms | — | Threshold reached |
| Bookmark flash | 700ms | — | Double tap |
| Accept/reject action flash | 700ms | — | Swipe accepted |
| Bottom nav indicator | 180ms | ease | Tab switch |
| Connect card exit + rotation | 250ms | ease | Connect/Skip |
| Post Composer slide up | 400ms | cubic-bezier(0.22,1,0.36,1) | FAB tap |
| Bottom sheet slide up | 350ms | cubic-bezier(0.22,1,0.36,1) | Map pin tap |
| XP celebration overlay | 1200ms | spring | Level-up |
| Streak save animation | 800ms | spring | Daily action |
| Achievement toast slide | 300ms | cubic-bezier(0.34,1.56,0.64,1) | XP earned |
| Story ring pulse | 2000ms | ease-in-out, loop | Active story |

---

## 10. State Management

All state lifted to App.jsx root. No external state library.

### Root State

| State | Type | Default | Purpose |
|-------|------|---------|---------|
| `mode` | `"social" \| "career"` | `"social"` | Active mode — **CHANGED from "career"** |
| `cTab` | string | `"home"` | Active career tab |
| `sTab` | string | `"home"` | Active social tab |
| `fading` | boolean | false | Mode crossfade animation active |
| `activeJobs` | Job[] | see data.js | Jobs not yet reviewed |
| `acceptedJobs` | Job[] | [] | Jobs swiped right |
| `rejectedJobs` | Job[] | [] | Jobs swiped left |
| `bookmarkedIds` | string[] | [] | Bookmarked job IDs |
| `xpTotal` | number | 0 | **NEW** — total XP |
| `streakDays` | number | 0 | **NEW** — current streak |
| `streakRecovery` | number | 1 | **NEW** — recovery tokens remaining |
| `roadmapPct` | number | 0 | **NEW** — placement readiness % |
| `roadmapGoal` | string | null | **NEW** — career goal string |
| `activeChallenge` | Challenge \| null | null | **NEW** — current weekly challenge |
| `superSavesUsed` | number | 0 | **NEW** — super-saves used today |

### Local Screen State

| Screen | Key Local State |
|--------|----------------|
| SocialFeed | `feedFilter`, `posts`, `composerOpen` |
| SocialConnect | `connectTab`, `cardIdx`, `dragX`, `dragging`, `mapView`, `studyMode` |
| SocialChat | `chatFilter`, `activeChatId`, `messages` |
| CareerHome | `showSwipe`, `showRoadmap` |
| CareerJobs | `filters`, `showFilters`, `isHackathonView`, `teamModalOpen`, `selectedHackathon` |
| SwipeScreen | `idx`, `drag`, `stamp`, `applied`, `skipped`, `superSaved`, `lastAction` |
| AIRoadmap | `shareCardType`, `goalEditMode` |
| WeeklyChallenge | `selectedChallenge`, `statsView` |

### State Flows

```
moveJob(jobId, "accepted")
  → Remove from activeJobs
  → Add to acceptedJobs
  → Remove from rejectedJobs (if exists)
  → xpTotal += 25
  → Check: if xpTotal crosses level threshold → trigger XP celebration

addXP(amount, source)
  → xpTotal += amount
  → Check level threshold
  → If level up: show XP celebration overlay
  → Emit achievement toast

streakUpdate()
  → Called on qualifying daily action
  → streakDays += 1
  → If midnight passes without action: check streakRecovery
    → If recoveryTokens > 0: auto-use, notify user, streakRecovery -= 1
    → Else: streakDays = 0
```

---

## 11. Icon & Character System

### Custom SVG Icon Library (icons.jsx)

All icons are custom SVG. Zero emoji in app UI (except inside Chat message bubbles).

**Core navigation icons:**
- `HomeIcon` — house outline, 2px stroke, rounded
- `FeedIcon` — three horizontal lines with dot (text feed symbol)
- `ConnectIcon` — two overlapping circles
- `ChatIcon` — rounded speech bubble, no tail
- `ProfileIcon` — person outline, circle head
- `JobsIcon` — briefcase outline
- `NewsIcon` — newspaper fold outline

**Action icons:**
- `PlusIcon` — clean cross, rounded ends
- `SearchIcon` — circle + diagonal line
- `NotificationIcon` — bell with small dot capability
- `BookmarkIcon` — ribbon/flag shape
- `ShareIcon` — three dots connected by lines
- `MoreIcon` — three horizontal dots
- `BackIcon` — left chevron
- `CloseIcon` — X (cross)
- `EditIcon` — pencil
- `SendIcon` — arrow (paper plane, angled up-right)
- `AttachIcon` — paperclip
- `CameraIcon` — camera body outline

**Status/type icons:**
- `VerifiedIcon` — circle with checkmark (green)
- `FireIcon` — flame shape (streak)
- `TargetIcon` — bullseye (challenge/accountability)
- `TrophyIcon` — cup shape
- `RocketIcon` — rocket silhouette (Pioneer level)
- `CrownIcon` — simple crown (Legend level)
- `MapIcon` — folded map
- `LocationPinIcon` — teardrop pin
- `LevelIcons` — unique SVG per level: Sprout / Flame / Hammer / Star / Rocket / Crown

**Social/interaction icons:**
- `CommentIcon` — speech bubble outline
- `RepostIcon` — two curved arrows forming a cycle
- `ReactionIcon` — heart outline (becomes filled when active)
- `PeopleIcon` — two overlapping person outlines
- `GroupsIcon` — three circles in a cluster

### Hyru Mascot Character System (characters.jsx)

Hyru is HYRUP's animated mascot — a small, friendly illustrated figure used for:
- Empty states
- Onboarding screens
- Celebration moments
- Error states

**Character variants (Lottie animations):**

| Variant | Usage | Animation |
|---------|-------|-----------|
| `HyruIdle` | Default empty states | Gentle bobbing, blinking |
| `HyruPointing` | Onboarding, tips | Points at content with one arm |
| `HyruCelebrating` | XP level-up, placement | Jumps, arms up, confetti bursts |
| `HyruThinking` | AI loading, processing | Chin scratch, question mark above head |
| `HyruSad` | Error states, empty search | Slumped, single teardrop |
| `HyruRunning` | Streak active, progress | Running in place, arms pumping |

**Character design guidelines:**
- Simple geometric forms (circles, rounded rectangles)
- Orange as primary color (#FF5722 for Social, #FF7A1A for Career)
- White accents
- No text on character
- Always small (max 120px height in app, larger on splash)
- SVG-based Lottie for smooth scaling

**Empty state usage examples:**

```
Social Feed (empty): HyruPointing → "Nothing here yet. Be the first to post."
Social Connect (no suggestions): HyruThinking → "We're finding your tribe..."
Same Path tab (no goal set): HyruPointing → "Set your career goal in Career mode"
Career Jobs (all reviewed): HyruCelebrating → "You're on top of it. Check back tomorrow."
Search (no results): HyruSad → "No results found. Try a different search."
Level up: HyruCelebrating (full-screen overlay with confetti)
```

---

## 12. Complete Flow Diagrams

### Flow 1: First-Time User (Social Default)

```
App opens
  → SocialHome (default mode = "social")
  → Onboarding tour shown (first launch only)
    → Screen 1: Social intro (HyruPointing)
    → Screen 2: Career intro (HyruPointing with briefcase)
    → Screen 3: Bridge intro (split screen)
    → "Get Started" → SocialHome
  → User sees Daily Challenge card
  → Taps "Create Post" → PostComposer opens
  → Types post → taps "Post"
  → +30 XP → Achievement toast slides in: "Builder XP +30"
  → Post appears at top of Feed tab
  → User browses Feed, sees peer placement post
  → Taps ModeToggle → Career mode
  → CareerHome: sees placement readiness (0% for new user)
  → Taps "View Roadmap" → AIRoadmap.jsx
  → Sets career goal → Roadmap generates
  → Returns to Career Home: "47% ready — 3 actions"
```

### Flow 2: Daily Retention Loop

```
User opens app (day 6 of streak)
  → SocialHome
  → Streak counter: "6 day streak" visible on Daily Challenge card
  → Taps Daily Challenge → Post Composer opens (pre-tagged "Daily")
  → Posts update → +30 XP + streak continues to 7
  → Streak milestone unlocked: "Week Warrior" badge
  → HyruCelebrating overlay (brief, dismissable)
  → Badge shows on Social Profile
  → User checks Feed → sees classmate's placement post
  → Taps ModeToggle → Career
  → Swipes 5 jobs → +125 XP
  → Returns to Social Home → XP bar updated
```

### Flow 3: Hackathon Team Formation Bridge

```
Career Mode: CareerJobs → Hackathons tab
  → User sees "HackIndia 2025"
  → Taps "Find Team" → TeamFormation.jsx modal slides up
  → Selects needed roles: Frontend Dev + UI/UX Designer
  → AI loads 3 suggestions from Social connections
  → User previews team request post
  → Taps "Post to Feed" → post goes to Social Feed (Team Request type)
  → Taps "Create Team + Group Chat"
  → Social Chat: new Hackathon group created
  → Group header shows: "HackIndia 2025 · Ends in 14d 3h"
  → Other users see Team Request post on feed
  → Tap "Join Team" → DM sent to team creator
  → Team creator accepts via DM
  → Post-hackathon: "Add your project?" prompt → project auto-imports to Career portfolio
```

### Flow 4: Roadmap Social Loop

```
Career: AIRoadmap → 67% readiness achieved
  → "Share your progress" prompt appears
  → User taps → Share options modal
  → Selects "Post to Social Feed"
  → Progress card auto-composed: "I'm 67% ready for Frontend Dev"
  → User edits caption → Posts
  → Post type: ROADMAP appears on Feed
  → Post visible to 500+ connections + college feed
  → "Same goal?" CTA on post → other users tap
  → Navigate to Connect > Same Path tab
  → Accountability partner matched
  → Chat DM opened with shared goal card
  → Long-term: both users appear on each other's Same Path tab
  → Study group suggested: "Frontend Dev 2026 · 8 members"
```

### Flow 5: Proximity → Real World

```
Social Mode: Connect → Nearby tab → Map view
  → Custom map tiles load (light style)
  → Profile photo pins visible on campus
  → Filter chips: tap "Same Roadmap" + "Open to Study"
  → 3 pins remain, showing students available to meet
  → Tap a pin → bottom sheet slides up
  → Sees: name + college + skills + "Same roadmap: Frontend Dev"
  → Taps "Coffee Chat" button
  → DM opens, pre-filled: "Hey, saw you're nearby and open to study together!"
  → User edits + sends
  → IRL study session arranged
  → Both post about it on Social Feed → +30 XP each
  → Connection deepened → become accountability partners
```

### Flow 6: Placement + Post-Placement

```
Career: CareerProfile → user updates "Open To: Placed"
  OR recruiter marks application as hired
  → HyruCelebrating overlay (full-screen)
  → "You did it, Rahul." headline
  → Confetti (custom SVG shapes, not emoji)
  → Auto-composed post preview shown
  → User edits → Posts to Social Feed
  → Post type: PLACEMENT with verified badge
  → Post reaches entire college network → high engagement
  → "Share journey card" → shareable graphic exported
  → External share → WhatsApp / LinkedIn → acquisition loop
  → Mentor onboarding prompt
  → User becomes mentor → available in Career > Mentors for others
```

---

## 13. Feature Matrix

| Feature | Social Mode | Career Mode | Bridge |
|---------|:-----------:|:-----------:|:------:|
| Dashboard home | Yes | Yes | — |
| Twitter-style feed | Yes | — | — |
| Full-image swipe feed | No (removed) | — | — |
| Post composer | Yes | — | — |
| AI post rewriter | Yes | — | — |
| Post type tags | Yes | — | — |
| Story rings | Yes | — | — |
| Peer connection swipe | Yes | — | — |
| Proximity map + photo pins | Yes | — | — |
| Study Session mode | Yes | — | — |
| Same Path (roadmap match) | Yes | — | Yes |
| Group discovery | Yes | — | — |
| Accountability groups | Yes | — | — |
| Roadmap groups | Yes | — | Yes |
| Hackathon team groups | Yes | — | Yes |
| DM + group chat (inner) | Yes | — | — |
| XP system + levels | Yes | — | — |
| Daily streak | Yes | — | — |
| Weekly challenges | Yes | — | Yes |
| Cross-section challenges | — | — | Yes |
| Hyru mascot character | Yes | Yes | — |
| Job/opportunity browsing | — | Yes | — |
| Swipe-to-apply | — | Yes | — |
| Super-save (up swipe) | — | Yes | — |
| Job filtering | — | Yes | — |
| Job bookmarking | — | Yes | — |
| Accept/reject management | — | Yes | — |
| Hackathon discovery | — | Yes | — |
| Hackathon team formation | — | Yes | Yes |
| AI Career Roadmap | — | Yes | Yes |
| Placement readiness % | — | Yes | Yes (shown in Social quick card) |
| AI Resume Builder | Yes | Yes | — |
| Tech news feed | — | Yes | — |
| Professional messaging | — | Yes | — |
| AI Bot chat | — | Yes | — |
| Achievement → Feed share | — | — | Yes |
| Roadmap share card | — | — | Yes |
| Placed badge (verified) | Yes | Yes | — |
| Post-placement layer | Yes | Yes | — |
| Unified profile | Yes | Yes | — |
| Recruiter dashboard | — | Yes | — |
| College placement dashboard | — | Yes | — |
| Mode toggle | Yes | Yes | — |
| Notification system | Yes | Yes | — |

---

## 14. Build Roadmap

### Phase 1 — Ship Now (Highest Impact)

| Task | Type | Complexity | Notes |
|------|------|------------|-------|
| Change `mode` default to `"social"` in App.jsx | Dev Fix | Trivial (1 line) | Most important change |
| Wire SocialGroups.jsx to navigation | Dev Fix | Low (already built) | Orphaned component |
| Redesign SocialFeed to Twitter-style list | Design + Dev | Medium | PostCard component |
| Add PostCard component | Dev | Medium | Core feed building block |
| AI Career Roadmap screen | Dev | High | Core retention feature |
| Placement readiness card on Career Home | Dev | Low | Uses roadmap data |
| Post-placement flow + celebration overlay | Dev | Medium | Hyru mascot needed |
| Social Home: story rings + bento cards | Design + Dev | Medium | Improved from V2 |
| Career Profile: Open To + goal field | Dev | Low | Form fields |
| Relative rank (not absolute) | Dev | Low | Change display logic |
| Achievement → Feed share moments | Dev | Medium | Share card generator |
| Custom SVG icon library | Design | Medium | Replace all emoji in UI |
| Hyru mascot (idle + pointing variants) | Design | Medium | Lottie animation |

### Phase 2 — Core Bridges

| Task | Type | Complexity |
|------|------|------------|
| Hackathon team formation modal | Dev | Medium |
| Social Connect: Same Path tab | Dev | Medium |
| Proximity map view (photo pins) | Dev | High |
| Study Session mode (proximity) | Dev | Medium |
| Roadmap sharing (progress cards) | Dev | Medium |
| XP system + streaks + recovery token | Dev | Medium |
| Weekly Challenge System (all 4 types) | Dev | Medium |
| Challenge detail screen with podium | Design + Dev | Medium |
| Inner chat view (both modes) | Dev | Medium |
| Accountability groups | Dev | Low |
| SwipeScreen: super-save up gesture | Dev | Low |
| Social Profile: XP badge + Career skill sync | Dev | Low |
| Hyru mascot (celebrating + sad + thinking) | Design | Medium |

### Phase 3 — AI & Polish

| Task | Type | Complexity |
|------|------|------------|
| AI feed ranking (relevance-based) | AI + Backend | High |
| AI post rewriter | AI | Low (API call) |
| Interview prep AI per company | AI | Medium |
| Teammate suggestion AI (hackathon) | AI | Medium |
| Project description AI generator | AI | Low |
| Placement prediction model | AI + Backend | High |
| Mentor session booking | Dev | Medium |
| College XP leaderboard | Dev | Medium |
| Skill re-verification (6-month expiry) | Backend | Low |
| Event pins on proximity map | Dev | Low |
| External share (journey card as image) | Dev | Medium |
| Notification smart rules (anti-fatigue) | Backend | Medium |

---

## Summary: What Changed from V2 to V2.1

### Breaking Changes

1. **Default mode is now `"social"` not `"career"`** — 1 line in App.jsx, massive UX impact
2. **Social Feed completely redesigned** — Twitter/Threads list style replaces full-screen swipe cards
3. **New post types** — Team Request, Roadmap Share, Placement (verified), Skill Earned, AMA
4. **Social Connect: 4th tab added** — "Same Path" for roadmap-based peer matching
5. **SocialGroups.jsx must be wired** — currently orphaned, wire into Chat or separate discovery

### Additive Changes (Non-Breaking)

1. AI Career Roadmap screen (new)
2. Placement readiness % replaces profile strength % on Career Home
3. Weekly Challenge System (new cross-section feature)
4. Super-save gesture on SwipeScreen (up swipe)
5. Proximity Connect: map view, photo pins, Study Session mode
6. Hackathon Team Formation modal (bridge feature)
7. Achievement → Feed share moments
8. Post-Placement celebration layer (Hyru mascot)
9. XP system, levels, streaks, recovery token
10. Custom SVG icons throughout (replacing emoji in non-chat screens)
11. Hyru mascot character (Lottie) for empty states and celebrations
12. Inner chat view (both CareerChat and SocialChat)
13. Story rings on Social Home
14. Bento grid quick cards on Social Home (6 cards instead of 4)

---

*End of HYRUP V2.1 Master Specification*  
*Document maintained by product team · Update before each sprint*
