# HYRUP V2.1 — Update Prompt (existing codebase)

The project already has a working V1 UI with this structure:
```
src/
├── App.jsx
├── data.js
├── helpers.jsx
├── icons.jsx
├── tokens.js
├── components/
└── screens/
```

**Do not rebuild from scratch.** Read `hyrup-v2-1-spec.md` fully, then make these targeted updates to the existing files.

---

## CHANGE 1 — Default mode (App.jsx)
```js
// Change this one line
const [mode, setMode] = useState("social") // was "career"
```

---

## CHANGE 2 — Social Feed (screens/social/SocialFeed.jsx)
**Complete redesign.** Replace the existing full-screen swipeable card layout with a Twitter/Threads-style vertical scroll feed.

New layout:
- Header: "Feed" title + pill tab switcher: `For You | Following | My College | Trending`
- Filter chips row (horizontal scroll, no emoji): `All · Placement · Project · Hackathon · DSA · Win · AMA`
- Vertical scroll list of `PostCard` components
- Floating orange FAB (+) bottom-right → opens `PostComposer` modal

**PostCard component** (create `src/components/PostCard.jsx`):
```
[Avatar 40px circle] [Name · @handle · 2h]        [···]
                     [College · PostTypeTag pill]
                     [Post text — 3 lines, tap expands]
                     [Media image if present, 16px radius]
                     [Verified badge if PLACEMENT type]
─────────────────────────────────────────────────────
[CommentIcon] 4   [RepostIcon] 7   [StarIcon] 68   [···]
```

PostTypeTag colors (text pill, no emoji):
- `PLACEMENT` → `#16A34A` bg
- `PROJECT` → `#3B82F6` bg  
- `HACKATHON` → `#7C3AED` bg
- `WIN` → `#FF5722` bg
- `TEAM REQUEST` → `#EA580C` bg — also shows role chips + "Join Team" button replacing engagement row
- `ROADMAP` → `#4F46E5` bg — shows inline progress bar + goal text + "Same goal? Connect" CTA
- `AMA` → `#0D9488` bg

**PostComposer** (create `src/components/PostComposer.jsx`):
- Full-screen slide-up modal (400ms cubic-bezier(0.22,1,0.36,1))
- Type selector chips row, text input, "Post" orange pill button (disabled until text)
- Close (×) button top-left

**Remove** all swipe gesture logic from SocialFeed (dragX, dragging, swipeAction states).  
**Remove** stacked card UI. Feed is pure scroll now.

---

## CHANGE 3 — Social Home (screens/social/SocialHome.jsx)
Keep existing structure but add/update:

1. **Story rings row** — add above Daily Challenge card:
   - Horizontal scroll `<div>` with `overflow-x: auto; scrollbar: none`
   - First item: 44px circle, dashed orange border, "+" SVG icon, "Add" label below
   - Friend avatars: 44px circles with orange border ring, name below (10px DM Sans)
   - Data: pull 6 users from `data.js`

2. **Daily Challenge card** — update:
   - Replace any emoji with SVG icons (flame SVG for streak, not 🔥)
   - Button label: "Create Post" → on tap, open `PostComposer`

3. **Quick cards grid** — expand from 4 to 6 cards (2×3 bento):
   - Keep existing 4 cards
   - Add: `Weekly Challenge` (progress bar inside card)
   - Add: `Placement Readiness` (% number, orange tint bg — tapping this card switches `mode` to `"career"`)

4. **Remove all emoji** from card labels, replace with SVG icons from `icons.jsx`

---

## CHANGE 4 — Social Connect (screens/social/SocialConnect.jsx)
Keep existing Suggested + Requests + Nearby tabs. Add:

**4th tab: Same Path**
- List of users with roadmap match %
- Each card: avatar + name + college + `"94% path similarity"` label + shared goal tag pill + `Connect` button + `Study Together` button
- Empty state: Hyru mascot SVG pointing, text: `"Set your career goal in Career mode to unlock this tab"`

**Nearby tab — Map view upgrade:**
- Add `[Map] [List]` pill toggle at top-left of Nearby tab
- Map view: simulate with a styled `<div>` (muted bg, grid lines for streets) + 4–5 circular photo pins positioned absolutely
- Right-side floating controls: vertical column of 4 icon buttons (layers, +, −, locate)
- Bottom sheet (350ms slide-up) when pin tapped: avatar + name + college + skills + "Message" + "Coffee Chat" buttons
- "Open for Study" toggle with pulsing green dot CSS keyframe

---

## CHANGE 5 — Social Chat (screens/social/SocialChat.jsx)
Keep conversation list. Add inner chat view:

- Tap conversation → push inner view (full screen, back arrow returns to list)
- Message bubbles: outgoing right (orange bg), incoming left (surface color)
- Input bar: text field + attach SVG + send SVG (orange arrow when text entered)
- Hackathon group headers: show countdown chip `"HackIndia · 14d 3h"`
- Add group type badges in conversation list: text label + SVG icon (no emoji)

---

## CHANGE 6 — Career Home (screens/career/CareerHome.jsx)
Replace "Profile Strength" hero card with "Placement Readiness" hero card:

```
bg: linear-gradient(135deg, #1E1E1E, #272727), orange glow box-shadow
Label: "PLACEMENT READY" (DM Mono 10px uppercase, #FF7A1A)
Number: "47%" (Bricolage 900 52px, white)
Bar: orange gradient progress bar
Sub: "3 actions to move forward this week"
CTA: "View Roadmap →" button
```

Add **Next 3 Actions row** below hero card:
- Horizontal scroll, 3 small cards
- Each: SVG icon + action text + "+XX XP" badge + small CTA button
- Data: `["Verify React skill +40 XP", "Apply to 3 jobs +75 XP", "Add 1 project +30 XP"]`

Update stats row: add 4th stat "Recruiter Views" (purple)
Change rank display: "You moved up 34 spots" not absolute number

---

## CHANGE 7 — Career Jobs (screens/career/CareerJobs.jsx)
Add to each hackathon card: `"Find Team"` button alongside existing `"Register"` button.

`"Find Team"` tap → `TeamFormation` modal (create `src/components/TeamFormation.jsx`):
```
Slide-up full modal
Header: "Build Your Team · HackIndia 2025"
Section 1 — Role Slots: multi-select chips (Frontend · Backend · UI/UX · ML · DevOps)
Section 2 — AI Suggestions: 3 mini user cards (avatar + name + skills + "Invite" button)
Section 3 — Share: 4 buttons with SVG icons (Post to Feed · Send DM · Share to Group · Copy Link)
Footer: "Create Team + Group Chat" orange pill button (full width)
Close: × top-right
```

---

## CHANGE 8 — SwipeScreen (screens/career/SwipeScreen.jsx)
Add swipe-up gesture (super-save):
- Up swipe >80px → gold stamp "SUPER SAVED" + gold glow
- Counter shown in header: "2/3 super saves"
- State: `superSavesUsed` (max 3, resets daily)

After left swipe (before next card): show skip reason chips row:
- `"Not my domain"  "Salary low"  "Bad location"  "Already applied"`
- Tap to select → logs reason, moves to next card. "Skip" text link dismisses without selecting.

---

## CHANGE 9 — Career Profile (screens/career/CareerProfile.jsx)
Add below bio/info line:

**"Open To" row:**
```
[Internship] [Full-time] [Hackathon] [Mentorship]
Pill toggles — tap to activate/deactivate (orange filled = active, outlined = inactive)
```

**Career goal field:**
```
Small muted text + edit pencil SVG icon
"Targeting: Frontend Dev at startup · July 2026"
Tap → inline text edit
```

Change CGPA: move to bottom of screen, make it small/muted, label "Academic Background"
Add XP level badge: "Builder · Lv 3" orange pill below name

---

## CHANGE 10 — tokens.js + icons.jsx
**tokens.js** — verify these values exist, add if missing:
```js
export const T = {
  // Social
  sBg: '#F8F7F5', sS1: '#FFFFFF', sS2: '#F2F0EC', sBorder: '#E8E4DC',
  sAccent: '#FF5722', sAccentDim: 'rgba(255,87,34,0.10)',
  sText: '#111111', sText2: '#7A746C', sMuted: '#B0AAA2',
  // Career  
  cBg: '#0F0F0F', cS1: '#161616', cS2: '#1E1E1E', cS3: '#272727',
  cBorder: 'rgba(255,255,255,0.07)',
  cAccent: '#FF7A1A', cAccentDim: 'rgba(255,122,26,0.15)',
  cText: '#F0F0F0', cText2: '#8A8A8A', cMuted: '#555566',
  // Semantic
  green: '#22C55E', red: '#EF4444', gold: '#F59E0B', blue: '#3B82F6',
  // Radius
  rCard: 22, rPill: 100, rBtn: 14,
  // Spacing
  screenPad: 22, cardPad: 18
}
```

**icons.jsx** — add any missing icons (no emoji replacements):
```jsx
// Add these if not present:
export const CommentIcon = () => <svg .../>   // speech bubble outline
export const RepostIcon = () => <svg .../>    // two circular arrows
export const StarIcon = () => <svg .../>      // star outline → filled when active
export const FlameIcon = () => <svg .../>     // flame shape for streak
export const TargetIcon = () => <svg .../>    // bullseye for challenge
export const MapPinIcon = () => <svg .../>    // teardrop pin
export const LayersIcon = () => <svg .../>    // stacked layers
export const LocateIcon = () => <svg .../>    // crosshair
export const TrophyIcon = () => <svg .../>    // cup
export const LevelIcon = ({level}) => <svg .../> // varies by level 1–6
```

---

## CHANGE 11 — data.js
Add/update:
```js
// Feed posts — add 2 new entries:
{ id:'p5', type:'TEAM_REQUEST', user: users[2], text:'Looking for HackIndia team. Need: Frontend + ML', roles:['Frontend Dev','ML Engineer'], hackathon:'HackIndia 2025', likes:34 }
{ id:'p6', type:'ROADMAP', user: users[4], text:'I am 67% ready for Frontend Dev roles. 3 months in.', goal:'Frontend Dev · Startup · July 2026', readiness:67, likes:28 }

// Add weekly challenge:
export const weeklyChallenge = {
  id:'wc1', type:'CROSS_SECTION', title:'Build + Verify',
  desc:'Post a project on Social + verify the skill it uses in Career',
  xp:200, endsIn:'4d 14h', progress:0.4, participants:234
}

// Add roadmap users (for Same Path tab):
export const roadmapUsers = [
  { id:'ru1', name:'Sneha R.', college:'Amity Noida', match:94, goal:'Frontend Dev · Startup', skills:['React','Figma'] },
  { id:'ru2', name:'Kiran B.', college:'LPU Punjab', match:87, goal:'Frontend Dev · Product', skills:['React','Node.js'] },
  { id:'ru3', name:'Ananya T.', college:'SRM Chennai', match:81, goal:'Frontend Dev · Startup', skills:['Vue','CSS'] }
]
```

---

## CHANGE 12 — XP System (App.jsx + new component)
Add to App.jsx root state:
```js
const [xp, setXp] = useState(1240)
const [streak, setStreak] = useState(5)
const [xpToast, setXpToast] = useState(null) // { amount, label }

const addXP = (amount, label) => {
  setXp(p => p + amount)
  setXpToast({ amount, label })
  setTimeout(() => setXpToast(null), 2500)
}
```

XP toast component (create `src/components/XPToast.jsx`):
```
Position: fixed bottom 90px (above nav), left 50%, translateX(-50%)
Style: orange bg (#FF5722), white text, 14px DM Sans 600, 12px radius, px 20 py 10
Animation: slide up from bottom (transform translateY), 300ms spring in, spring out
Text: "+40 XP · Skill Verified" or "+30 XP · Post Created" etc.
```

Fire `addXP` on: job apply (+25), skill verify (+40), post create (+30), streak maintain (+10)

---

## Hyru Mascot SVG (add to icons.jsx)
Simple inline SVG — no external files:
```jsx
export const HyruMascot = ({ variant = 'idle' }) => (
  <svg width="80" height="100" viewBox="0 0 80 100">
    {/* Body — rounded rect */}
    <rect x="20" y="45" width="40" height="45" rx="14" fill="#FF5722"/>
    {/* Head — circle */}
    <circle cx="40" cy="32" r="22" fill="#FF7A1A"/>
    {/* Eyes */}
    <circle cx="33" cy="30" r="3.5" fill="white"/>
    <circle cx="47" cy="30" r="3.5" fill="white"/>
    <circle cx="34" cy="31" r="1.5" fill="#111"/>
    <circle cx="48" cy="31" r="1.5" fill="#111"/>
    {/* Smile */}
    <path d="M33 38 Q40 44 47 38" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    {/* Arms */}
    {variant === 'pointing' && <line x1="60" y1="58" x2="80" y2="48" stroke="#FF7A1A" strokeWidth="5" strokeLinecap="round"/>}
    {variant === 'celebrating' && <>
      <line x1="20" y1="55" x2="5" y2="38" stroke="#FF7A1A" strokeWidth="5" strokeLinecap="round"/>
      <line x1="60" y1="55" x2="75" y2="38" stroke="#FF7A1A" strokeWidth="5" strokeLinecap="round"/>
    </>}
    {variant === 'idle' && <>
      <line x1="20" y1="58" x2="8" y2="68" stroke="#FF7A1A" strokeWidth="5" strokeLinecap="round"/>
      <line x1="60" y1="58" x2="72" y2="68" stroke="#FF7A1A" strokeWidth="5" strokeLinecap="round"/>
    </>}
  </svg>
)
```

CSS for mascot animation:
```css
@keyframes hyru-bob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
.hyru-idle { animation: hyru-bob 2s ease-in-out infinite }
@keyframes hyru-celebrate { 0%,100% { transform: rotate(-8deg) } 50% { transform: rotate(8deg) } }
.hyru-celebrate { animation: hyru-celebrate 0.4s ease-in-out infinite }
```

Use `<HyruMascot variant="pointing"/>` in empty states (Same Path empty, Feed empty, Career empty jobs).

---

## Summary of files to touch

| File | Change |
|------|--------|
| `src/App.jsx` | mode default → "social", add xp/streak/toast state, addXP fn |
| `src/data.js` | add Team Request + Roadmap posts, weeklyChallenge, roadmapUsers |
| `src/tokens.js` | verify/add all tokens |
| `src/icons.jsx` | add missing icons + HyruMascot SVG |
| `src/screens/social/SocialFeed.jsx` | full redesign → Twitter-style |
| `src/screens/social/SocialHome.jsx` | story rings, 6 quick cards, remove emoji |
| `src/screens/social/SocialConnect.jsx` | Same Path tab, Map view in Nearby |
| `src/screens/social/SocialChat.jsx` | inner chat view |
| `src/screens/career/CareerHome.jsx` | Placement Readiness card, Next 3 Actions |
| `src/screens/career/CareerJobs.jsx` | Find Team button on hackathons |
| `src/screens/career/SwipeScreen.jsx` | super-save up swipe, skip reason chips |
| `src/screens/career/CareerProfile.jsx` | Open To pills, goal field, XP badge |
| `src/components/PostCard.jsx` | NEW |
| `src/components/PostComposer.jsx` | NEW |
| `src/components/TeamFormation.jsx` | NEW |
| `src/components/XPToast.jsx` | NEW |
