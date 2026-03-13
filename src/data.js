/* ═══════════════════════════════════════════════════════════════════════
   HYRUP — JOBS DATA & UTILITIES
═══════════════════════════════════════════════════════════════════════ */

export const ALL_JOBS = [
  {
    id: "j1", role: "Frontend Dev Intern", co: "Zepto", loc: "Remote", locType: "Remote", pay: "₹15K/mo", payNum: 15, tags: ["React", "TypeScript"], m: 94, ch: "Z",
    type: "Internship", grad: "linear-gradient(145deg, #1C0D00, #2D1600)", accentGrad: "linear-gradient(90deg,#FF7A1A,#FF9A45)",
    desc: "Build and ship features used by 10M+ users. Fast-paced, high-ownership culture. Strong mentorship from senior engineers."
  },
  {
    id: "j2", role: "Backend Developer", co: "Razorpay", loc: "Bengaluru · Hybrid", locType: "Hybrid", pay: "₹18K/mo", payNum: 18, tags: ["Node.js", "MongoDB"], m: 88, ch: "R",
    type: "Internship", grad: "linear-gradient(145deg, #00101A, #001C2E)", accentGrad: "linear-gradient(90deg,#3B82F6,#60A5FA)",
    desc: "Work on payment infrastructure serving 8M+ businesses. Real ownership, real impact. Pre-placement offer possible."
  },
  {
    id: "j3", role: "UI/UX Designer", co: "Groww", loc: "Remote", locType: "Remote", pay: "₹20K/mo", payNum: 20, tags: ["Figma", "Prototyping"], m: 85, ch: "G",
    type: "Internship", grad: "linear-gradient(145deg, #001A0D, #002E1A)", accentGrad: "linear-gradient(90deg,#22C55E,#4ADE80)",
    desc: "Own end-to-end design for new investor features. Work directly with PMs. Portfolio-building opportunity."
  },
  {
    id: "j4", role: "Data Analyst", co: "Meesho", loc: "Noida · On-site", locType: "On-site", pay: "₹12K/mo", payNum: 12, tags: ["Python", "SQL"], m: 79, ch: "M",
    type: "Internship", grad: "linear-gradient(145deg, #120018, #1E0028)", accentGrad: "linear-gradient(90deg,#A855F7,#C084FC)",
    desc: "Analyze seller and buyer behavior data. Build dashboards used by leadership. Strong data team culture."
  },
  {
    id: "j5", role: "React Native Dev", co: "CRED", loc: "Bengaluru · Hybrid", locType: "Hybrid", pay: "₹30K/mo", payNum: 30, tags: ["React Native", "TypeScript"], m: 91, ch: "C",
    type: "Job", grad: "linear-gradient(145deg, #1A1000, #2D1E00)", accentGrad: "linear-gradient(90deg,#F59E0B,#FBBF24)",
    desc: "Build consumer mobile experiences for millions of premium users. High design bar and engineering excellence culture."
  },
  {
    id: "j6", role: "DevOps Engineer", co: "Swiggy", loc: "Remote", locType: "Remote", pay: "₹35K/mo", payNum: 35, tags: ["AWS", "Docker", "CI/CD"], m: 82, ch: "S",
    type: "Job", grad: "linear-gradient(145deg, #0D1A00, #1E2D00)", accentGrad: "linear-gradient(90deg,#84CC16,#A3E635)",
    desc: "Manage infrastructure at scale for India's largest food delivery platform. On-call rotation with generous comp."
  },
];

/* ── Utility functions ── */
export const applyFilters = (jobs, filters) => {
  return jobs.filter(j => {
    if (filters.jobType && j.type !== filters.jobType) return false;
    if (filters.location && j.locType !== filters.location) return false;
    if (filters.salaryMin != null && j.payNum < filters.salaryMin) return false;
    return true;
  });
};

/* ═══════════════════════════════════════════════════════════════════════
   V2.1 — USERS, FEED POSTS, CHALLENGES, ROADMAP
═══════════════════════════════════════════════════════════════════════ */

export const USERS = [
  { id: 'u1', name: 'Sneha R.', handle: 'snehar', college: 'Amity Noida', ch: 'S', skills: ['UI/UX', 'Figma'], level: 8, online: true },
  { id: 'u2', name: 'Kiran B.', handle: 'kiranb', college: 'LPU Punjab', ch: 'K', skills: ['Full Stack', 'React'], level: 12, online: true },
  { id: 'u3', name: 'Ananya T.', handle: 'ananyat', college: 'SRM Chennai', ch: 'A', skills: ['ML', 'Python'], level: 6, online: false },
  { id: 'u4', name: 'Dev M.', handle: 'devm', college: 'VIT Vellore', ch: 'D', skills: ['Backend', 'Node.js'], level: 9, online: false },
  { id: 'u5', name: 'Priya K.', handle: 'priyak', college: 'NIT Trichy', ch: 'P', skills: ['React', 'TypeScript'], level: 11, online: true },
  { id: 'u6', name: 'Rohan P.', handle: 'rohanp', college: 'BITS Pilani', ch: 'R', skills: ['DevOps', 'AWS'], level: 10, online: false },
];

export const POST_TYPE_COLORS = {
  PLACEMENT:    { bg: '#16A34A', text: '#fff' },
  PROJECT:      { bg: '#3B82F6', text: '#fff' },
  HACKATHON:    { bg: '#7C3AED', text: '#fff' },
  WIN:          { bg: '#FF5722', text: '#fff' },
  TEAM_REQUEST: { bg: '#EA580C', text: '#fff' },
  ROADMAP:      { bg: '#4F46E5', text: '#fff' },
  AMA:          { bg: '#0D9488', text: '#fff' },
  DSA:          { bg: '#D97706', text: '#fff' },
};

export const FEED_POSTS = [
  { id: 'p1', type: 'WIN', user: USERS[4], text: 'Won 1st place at HackIndia 2025! Built an AI resume analyzer in 24hrs.', time: '2h', likes: 142, comments: 28, reposts: 7, hasMedia: false, verified: false },
  { id: 'p2', type: 'PROJECT', user: USERS[3], text: 'Shipped my first full-stack project — real-time collaborative editor with WebSockets. Check it out!', time: '5h', likes: 89, comments: 15, reposts: 12, hasMedia: true, verified: false },
  { id: 'p3', type: 'PLACEMENT', user: USERS[0], text: 'Just got placed at Razorpay as a UI/UX Design Intern! 3 months of prep on HYRUP, totally worth it.', time: '8h', likes: 203, comments: 42, reposts: 34, hasMedia: false, verified: true, company: 'Razorpay' },
  { id: 'p4', type: 'HACKATHON', user: USERS[1], text: 'Our startup just got accepted into Y Combinator startup school! Looking forward to Demo Day.', time: '1d', likes: 318, comments: 67, reposts: 45, hasMedia: false, verified: false },
  { id: 'p5', type: 'TEAM_REQUEST', user: USERS[2], text: 'Looking for HackIndia team. Need: Frontend + ML. Building an AI accessibility tool.', time: '3h', likes: 34, comments: 8, reposts: 5, roles: ['Frontend Dev', 'ML Engineer'], hackathon: 'HackIndia 2025' },
  { id: 'p6', type: 'ROADMAP', user: USERS[5], text: 'I am 67% ready for Frontend Dev roles. 3 months in. Sharing my roadmap progress!', time: '6h', likes: 28, comments: 12, reposts: 9, goal: 'Frontend Dev · Startup · July 2026', readiness: 67 },
];

export const weeklyChallenge = {
  id: 'wc1', type: 'CROSS_SECTION', title: 'Build + Verify',
  desc: 'Post a project on Social + verify the skill it uses in Career',
  xp: 200, endsIn: '4d 14h', progress: 0.4, participants: 234,
};

export const roadmapUsers = [
  { id: 'ru1', name: 'Sneha R.', college: 'Amity Noida', ch: 'S', match: 94, goal: 'Frontend Dev · Startup', skills: ['React', 'Figma'] },
  { id: 'ru2', name: 'Kiran B.', college: 'LPU Punjab', ch: 'K', match: 87, goal: 'Frontend Dev · Product', skills: ['React', 'Node.js'] },
  { id: 'ru3', name: 'Ananya T.', college: 'SRM Chennai', ch: 'A', match: 81, goal: 'Frontend Dev · Startup', skills: ['Vue', 'CSS'] },
];

/* ═══════════════════════════════════════════════════════════════════════
   V3 — ONBOARDING SUGGESTED CONNECTIONS (minimum 10 must be connected)
═══════════════════════════════════════════════════════════════════════ */
export const SUGGESTED_CONNECTIONS = [
  { id: 'sc1', name: 'Arjun S.', college: 'IIT Delhi', ch: 'A', skills: ['React', 'Node.js'], avatar: '#FF6B35', reason: 'Same domain' },
  { id: 'sc2', name: 'Meera J.', college: 'BITS Pilani', ch: 'M', skills: ['Figma', 'UI/UX'], avatar: '#3B82F6', reason: 'Trending creator' },
  { id: 'sc3', name: 'Ravi K.', college: 'NIT Warangal', ch: 'R', skills: ['Python', 'ML'], avatar: '#22C55E', reason: '3 mutual friends' },
  { id: 'sc4', name: 'Pooja N.', college: 'VIT Vellore', ch: 'P', skills: ['Flutter', 'Dart'], avatar: '#A855F7', reason: 'Same college area' },
  { id: 'sc5', name: 'Vikram T.', college: 'IIIT Hyderabad', ch: 'V', skills: ['DevOps', 'AWS'], avatar: '#F59E0B', reason: 'Same domain' },
  { id: 'sc6', name: 'Nisha R.', college: 'DTU Delhi', ch: 'N', skills: ['React Native', 'TS'], avatar: '#EC4899', reason: 'Same roadmap' },
  { id: 'sc7', name: 'Aman D.', college: 'NSUT Delhi', ch: 'A', skills: ['Backend', 'Go'], avatar: '#14B8A6', reason: 'Top contributor' },
  { id: 'sc8', name: 'Shruti P.', college: 'SRM Chennai', ch: 'S', skills: ['Data Science', 'SQL'], avatar: '#8B5CF6', reason: '5 mutual friends' },
  { id: 'sc9', name: 'Harsh G.', college: 'LNMIIT Jaipur', ch: 'H', skills: ['Blockchain', 'Solidity'], avatar: '#F97316', reason: 'Same college' },
  { id: 'sc10', name: 'Kavya B.', college: 'PES Bengaluru', ch: 'K', skills: ['iOS', 'Swift'], avatar: '#06B6D4', reason: 'Complementary skills' },
  { id: 'sc11', name: 'Rahul M.', college: 'COEP Pune', ch: 'R', skills: ['Java', 'Spring Boot'], avatar: '#EF4444', reason: 'Same domain' },
  { id: 'sc12', name: 'Diya S.', college: 'MIT Manipal', ch: 'D', skills: ['Product', 'Analytics'], avatar: '#84CC16', reason: 'Trending creator' },
];

/* ─── Onboarding constants ─── */
export const SKILL_OPTIONS = ['React', 'Node.js', 'Python', 'Figma', 'Flutter', 'TypeScript', 'Java', 'AWS', 'MongoDB', 'SQL', 'Docker', 'Swift', 'Go', 'ML/AI', 'UI/UX', 'DevOps'];
export const ROLE_OPTIONS = [
  { id: 'frontend', label: 'Frontend Dev', icon: '◇', color: '#FF6B35' },
  { id: 'backend', label: 'Backend Dev', icon: '⬡', color: '#3B82F6' },
  { id: 'design', label: 'UI/UX Design', icon: '◎', color: '#A855F7' },
  { id: 'data', label: 'Data / ML', icon: '◈', color: '#22C55E' },
  { id: 'devops', label: 'DevOps / Cloud', icon: '⬢', color: '#F59E0B' },
  { id: 'product', label: 'Product Mgmt', icon: '▣', color: '#EC4899' },
];
