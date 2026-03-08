import { useState } from "react";
import { T, FD, FB } from '../../tokens.js';
import { IC, Svg } from '../../icons.jsx';
import { Row, Col } from '../../helpers.jsx';
import ModeToggle from '../../components/ModeToggle.jsx';

/* â”€â”€ Extra SVG paths not in IC â”€â”€ */
const LOCK_PATH = "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4";

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   PROFILE STRENGTH ALGORITHM
   Layer 1 â€” Completeness (weight Ã—0.40, raw max 40):
     photo=10, bio=5, education=10, github=5, resume=5, skillsâ‰¥3=5
   Layer 2 â€” Skill Proof (weight Ã—0.40, raw max 40):
     each verifiedSkill=8 (cap 32), each project=6 (cap 24),
     projectViews>50=3 each (cap 9), hackathonWin=10
   Layer 3 â€” Activity (weight Ã—0.20, raw max 20):
     challenge/day=3 (cap 9), job applied=2 (cap 6),
     connection=2 (cap 4), post=1 (cap 1)
   Formula: clamp(L1Ã—0.4 + L2Ã—0.4 + L3Ã—0.2, 0, 100)

   RECRUITER VISIBILITY SCORE
     VisScore = 0.5Ã—ProfileStrength + 0.3Ã—(SkillScore/10) + 0.2Ã—ActivityNorm
     0â€“40 Low | 40â€“60 Medium | 60â€“80 High | 80â€“100 Recruiter Ready
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function calcProfileStrength(user) {
    let l1 = 0;
    if (user.hasPhoto)  l1 += 10;
    if (user.hasBio)    l1 += 5;
    if (user.hasEdu)    l1 += 10;
    if (user.hasGithub) l1 += 5;
    if (user.hasResume) l1 += 5;
    if ((user.skillsAdded || 0) >= 3) l1 += 5;

    let l2 = 0;
    l2 += Math.min((user.verifiedSkills || 0) * 8, 32);
    l2 += Math.min((user.projects || 0) * 6, 24);
    l2 += Math.min((user.projectViewsOver50 || 0) * 3, 9);
    l2 += Math.min((user.hackathonWins || 0) * 10, 10);
    l2 = Math.min(l2, 40);

    let l3 = 0;
    l3 += Math.min((user.challengesThisWeek || 0) * 3, 9);
    l3 += Math.min((user.jobsApplied || 0) * 2, 6);
    l3 += Math.min((user.connections || 0) * 2, 4);
    l3 += Math.min((user.posts || 0), 1);
    l3 = Math.min(l3, 20);

    return Math.round(Math.min(l1 * 0.4 + l2 * 0.4 + l3 * 0.2 * 5, 100));
}

function calcVisibility(profileStrength, skillScore, activityScore) {
    const skillNorm = Math.min(skillScore / 10, 100);
    const actNorm   = Math.min(activityScore * 5, 100);
    return Math.round(Math.min(0.5 * profileStrength + 0.3 * skillNorm + 0.2 * actNorm, 100));
}

function visLabel(score) {
    if (score >= 80) return { label: "Recruiter Ready", col: "#22C55E" };
    if (score >= 60) return { label: "High Visibility",  col: "#3B82F6" };
    if (score >= 40) return { label: "Medium",           col: "#F59E0B" };
    return              { label: "Low Visibility",       col: "#EF4444" };
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   CAREER PROFILE  v3  â€” Complete engagement system
   Â§1 Header  Â§2 Metrics  Â§3 Profile Strength  Â§4 Recruiter Visibility
   Â§5 Skills  Â§6 AI Resume  Â§7 Tabs: Projects / Achievements / Activity
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const CareerProfile = ({ mode, onToggle }) => {
    const t = T.c;
    const [activeTab, setActiveTab]           = useState("projects");
    const [verifyingSkill, setVerifyingSkill] = useState(null);
    const [strengthExpanded, setStrengthExpanded] = useState(false);

    const handleVerify = (skill) => {
        setVerifyingSkill(skill);
        setTimeout(() => setVerifyingSkill(null), 1600);
    };

    /* â”€â”€ Mock user (drives algorithm) â”€â”€ */
    const USER = {
        hasPhoto: true, hasBio: true, hasEdu: true,
        hasGithub: false, hasResume: true, skillsAdded: 7,
        verifiedSkills: 4, projects: 3, projectViewsOver50: 2,
        hackathonWins: 1, challengesThisWeek: 3, jobsApplied: 6,
        connections: 1, posts: 1,
    };
    const profileStrength = calcProfileStrength(USER);
    const skillScore      = 847;
    const activityScore   = USER.challengesThisWeek + USER.jobsApplied;
    const visScore        = calcVisibility(profileStrength, skillScore, activityScore);
    const vis             = visLabel(visScore);

    const rank = { scope: "RGPV Bhopal", pos: 3, total: 248, cityPos: 12, cityTotal: 340 };

    const strengthLevel =
        profileStrength >= 80 ? { label: "Strong",        col: t.green }
      : profileStrength >= 60 ? { label: "Good",          col: t.orange }
      :                         { label: "Getting Started",col: "#F59E0B" };

    /* â”€â”€ Skills data â”€â”€ */
    const verifiedSkills = [
        { name: "React",   col: t.orange,  score: 94 },
        { name: "Node.js", col: t.green,   score: 88 },
        { name: "Figma",   col: "#A78BFA", score: 82 },
        { name: "MongoDB", col: t.blue,    score: 79 },
    ];
    const unverifiedSkills = [
        { name: "Python",     pts: 8 },
        { name: "AWS",        pts: 8 },
        { name: "TypeScript", pts: 8 },
    ];

    const lockedSkills = ["GraphQL", "Docker"];

    const projects = [
        { name: "AI Resume Builder",  desc: "Generates ATS-optimised resumes from a GitHub profile URL.", stack: ["React", "Python", "OpenAI"],    views: 847, likes: 64, verified: true,  top: true,  grad: "linear-gradient(135deg,#1C0D00,#2D1600)", col: t.orange },
        { name: "Real-time Chat App", desc: "WebSocket rooms with file sharing and read receipts.",        stack: ["Node.js", "Socket.io", "MongoDB"],views: 312, likes: 28, verified: true,  top: false, grad: "linear-gradient(135deg,#00101A,#001C2E)", col: t.blue   },
        { name: "Weather Dashboard",  desc: "Animated 7-day forecast cards with geolocation.",             stack: ["React", "OpenWeather API"],       views: 156, likes: 14, verified: false, top: false, grad: "linear-gradient(135deg,#001A0D,#002E1A)", col: t.green  },
    ];

    const achievements = [
        { icon: "ðŸ†", earned: true,  title: "HackIndia Finalist",    sub: "MLH Ã— Google Â· Mar 2025",       col: t.orange,  bg: t.orangeLo        },
        { icon: "â­", earned: true,  title: "Top 5% React Score",     sub: "HYRUP Skill Board Â· Feb 2025",  col: "#F59E0B", bg: "#F59E0B18"        },
        { icon: "ðŸŽ¯", earned: true,  title: "100 Applications Sent",  sub: "Career Milestone Â· Jan 2025",   col: t.blue,    bg: `${t.blue}18`     },
        { icon: "ðŸ”¥", earned: true,  title: "30-Day Streak",          sub: "Consistency Award Â· Dec 2024",  col: t.red,     bg: `${t.red}18`      },
        { icon: "ðŸ¥ˆ", earned: false, title: "Silver Skill Badge",      sub: "Verify 6 skills to unlock",    col: t.t3,      bg: t.s3               },
        { icon: "ðŸš€", earned: false, title: "5 Projects Published",    sub: "2 more to unlock",             col: t.t3,      bg: t.s3               },
    ];

    const activity = [
        { icon: IC.check, col: t.green,  bg: `${t.green}18`,  text: "Verified React skill",         sub: "Score improved Â· +4 pts",           time: "2h ago"   },
        { icon: IC.plus,  col: t.orange, bg: t.orangeLo,       text: "Uploaded AI Resume Builder",   sub: "Project got 12 views in 24h ðŸ”¥",    time: "1d ago"   },
        { icon: IC.zap,   col: "#F59E0B",bg: "#F59E0B18",      text: "Skill Score reached 847",      sub: "Ranked up to #3 at RGPV",           time: "2d ago"   },
        { icon: IC.brief, col: t.blue,   bg: `${t.blue}18`,   text: "Applied to Zepto internship",  sub: "Match score 94% â€” great fit",       time: "3d ago"   },
        { icon: IC.users, col: "#A78BFA",bg: "#A78BFA18",      text: "Connected with Sneha R.",      sub: "UI/UX Designer at Razorpay",        time: "4d ago"   },
    ];

    const strengthActions = [
        { done: false, label: "Add GitHub link",       pts: "+5 pts" },
        { done: false, label: "Verify Python skill",   pts: "+8 pts" },
        { done: false, label: "Upload 1 more project", pts: "+6 pts" },
        { done: true,  label: "Upload resume",         pts: "+5 pts" },
        { done: true,  label: "Add education",         pts: "+10 pts"},
    ];

    return (
        <Col sx={{ paddingBottom: 32 }}>

            {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                Â§1  HEADER â€” cover + gradient ring avatar + identity
            â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            <div style={{ background: "linear-gradient(160deg,#1A0C00 0%,#2D1600 55%,#0F0F0F 100%)", position: "relative", overflow: "hidden", flexShrink: 0, paddingBottom: 58 }}>
                <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 72% 60%,${t.orangeMid},transparent 64%)`, pointerEvents: "none" }} />
                <div style={{ position: "absolute", top: -50, left: -30, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,122,26,0.05)", filter: "blur(60px)", pointerEvents: "none" }} />

                {/* toolbar */}
                <Row ai="center" jc="space-between" sx={{ padding: "14px 16px 20px", position: "relative", zIndex: 3 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <Svg d={IC.edit} s={15} c={t.t2} />
                    </div>
                    <ModeToggle mode={mode} onToggle={onToggle} />
                </Row>

                {/* avatar â€” centred */}
                <div style={{ display: "flex", justifyContent: "center", position: "relative", zIndex: 3 }}>
                    <div style={{ position: "relative" }}>
                        <div style={{ width: 100, height: 100, borderRadius: 32, padding: 3, background: `linear-gradient(135deg,${t.orange},#FFB36B)`, boxShadow: `0 0 32px ${t.orange}55` }}>
                            <div style={{ width: "100%", height: "100%", borderRadius: 29, background: t.s2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span style={{ fontFamily: FD, fontWeight: 900, fontSize: 38, color: t.orange }}>R</span>
                            </div>
                        </div>
                        <div style={{ position: "absolute", bottom: 4, right: 4, width: 20, height: 20, borderRadius: 10, background: t.green, border: `3px solid ${t.bg}`, boxShadow: `0 0 12px ${t.green}88` }} />
                    </div>
                </div>

                {/* identity */}
                <div style={{ textAlign: "center", padding: "14px 22px 0", position: "relative", zIndex: 3 }}>
                    <Row jc="center" ai="center" g={8} sx={{ marginBottom: 5 }}>
                        <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 22, color: t.t1, letterSpacing: -0.5 }}>Rahul Sharma</span>
                        <div style={{ width: 20, height: 20, borderRadius: 10, background: t.orange, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 2px 8px ${t.orange}66` }}>
                            <Svg d={IC.check} s={11} c="#fff" w={3} />
                        </div>
                    </Row>
                    <span style={{ fontFamily: FB, fontSize: 13, color: t.t2, display: "block", marginBottom: 10 }}>
                        Full Stack Dev Â· B.Tech CSE Â· RGPV Bhopal Â· 2026
                    </span>
                    <Row jc="center" g={8} sx={{ marginBottom: 16, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, color: t.green, background: `${t.green}1A`, padding: "4px 12px", borderRadius: 100 }}>â— Open to Work</span>
                        <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, color: "#A78BFA", background: "#A78BFA1A", padding: "4px 12px", borderRadius: 100 }}>âš¡ Hackathon Finalist</span>
                    </Row>
                    <button style={{ height: 38, padding: "0 20px", borderRadius: 12, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: t.t1, fontFamily: FB, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7 }}>
                        <Svg d={IC.share} s={14} c={t.t1} />
                        Share Profile
                    </button>
                </div>
            </div>

            {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                Â§2  STATUS METRICS ROW
            â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            <div style={{ padding: "20px 22px 14px" }}>
                <Row g={10}>
                    {[
                        { val: String(skillScore),          label: "Skill Score",    col: t.orange,  bg: t.orangeLo,      icon: IC.zap   },
                        { val: `#${rank.pos}`,              label: "College Rank",   col: "#F59E0B", bg: "#F59E0B18",     icon: IC.award },
                        { val: String(verifiedSkills.length),label: "Verified",      col: t.green,   bg: `${t.green}18`, icon: IC.check },
                        { val: String(projects.length),     label: "Projects",       col: t.blue,    bg: `${t.blue}18`,  icon: IC.grid  },
                    ].map(({ val, label, col, bg, icon }) => (
                        <div key={label} style={{ flex: 1, background: t.s2, borderRadius: 18, padding: "14px 6px", border: `1px solid ${t.border}`, textAlign: "center" }}>
                            <div style={{ width: 32, height: 32, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                                <Svg d={icon} s={15} c={col} />
                            </div>
                            <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 18, color: col, display: "block", lineHeight: 1 }}>{val}</span>
                            <span style={{ fontFamily: FB, fontSize: 9, color: t.t2, marginTop: 3, display: "block" }}>{label}</span>
                        </div>
                    ))}
                </Row>
                {/* rank sub-line */}
                <div style={{ marginTop: 10, background: t.s2, borderRadius: 14, padding: "10px 14px", border: `1px solid ${t.border}` }}>
                    <Row ai="center" jc="space-between">
                        <Row ai="center" g={6}>
                            <Svg d={IC.loc} s={13} c={t.t3} />
                            <span style={{ fontFamily: FB, fontSize: 12, color: t.t2 }}>
                                <span style={{ color: t.t1, fontWeight: 700 }}>#{rank.pos}</span> of {rank.total} students Â· {rank.scope}
                            </span>
                        </Row>
                        <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, color: "#F59E0B", background: "#F59E0B18", padding: "2px 10px", borderRadius: 100 }}>
                            Top {Math.round((rank.pos / rank.total) * 100)}%
                        </span>
                    </Row>
                </div>
            </div>

            {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                Â§3  PROFILE STRENGTH CARD
            â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            <div style={{ padding: "0 22px 14px" }}>
                <div style={{ background: t.s2, borderRadius: 20, padding: "16px 18px", border: `1px solid ${t.border}` }}>
                    {/* header */}
                    <Row ai="center" jc="space-between" sx={{ marginBottom: 12 }}>
                        <Col g={4}>
                            <Row ai="center" g={8}>
                                <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 28, color: t.t1, letterSpacing: -0.5 }}>
                                    {profileStrength}<span style={{ fontSize: 15, color: t.t2, fontWeight: 500 }}>%</span>
                                </span>
                                <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, color: strengthLevel.col, background: `${strengthLevel.col}22`, padding: "3px 10px", borderRadius: 100 }}>
                                    {strengthLevel.label}
                                </span>
                            </Row>
                            <span style={{ fontFamily: FB, fontSize: 10, color: t.t2 }}>Profile Strength</span>
                        </Col>
                        {/* resume score ring */}
                        <Col ai="center" g={3}>
                            <span style={{ fontFamily: FB, fontSize: 9, color: t.t3, letterSpacing: 0.8 }}>RESUME SCORE</span>
                            <svg width="54" height="54" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="15" fill="none" stroke={t.s4} strokeWidth="3.2" />
                                <circle cx="18" cy="18" r="15" fill="none" stroke={t.orange} strokeWidth="3.2"
                                    strokeDasharray="79.17 94.25" strokeLinecap="round"
                                    style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", filter: `drop-shadow(0 0 5px ${t.orange}99)` }} />
                                <text x="18" y="23" textAnchor="middle" fontFamily="DM Sans" fontWeight="800" fontSize="8.5" fill="white">84</text>
                            </svg>
                        </Col>
                    </Row>

                    {/* layer breakdown */}
                    <Row g={8} sx={{ marginBottom: 12 }}>
                        {[
                            { label: "Completeness", wt: "40%", col: t.orange  },
                            { label: "Skill Proof",  wt: "40%", col: "#A78BFA" },
                            { label: "Activity",     wt: "20%", col: t.blue    },
                        ].map(({ label, wt, col }) => (
                            <div key={label} style={{ flex: 1, background: t.s3, borderRadius: 10, padding: "8px 6px", textAlign: "center" }}>
                                <span style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: col, display: "block" }}>{wt}</span>
                                <span style={{ fontFamily: FB, fontSize: 9, color: t.t3 }}>{label}</span>
                            </div>
                        ))}
                    </Row>

                    {/* progress bar */}
                    <div style={{ height: 7, background: t.s4, borderRadius: 4, overflow: "hidden", marginBottom: 10 }}>
                        <div style={{ width: `${profileStrength}%`, height: "100%", background: `linear-gradient(90deg,${t.orange},#FFB36B)`, borderRadius: 4, boxShadow: `0 0 12px ${t.orange}66` }} />
                    </div>

                    {/* nudge â€” never 100% */}
                    <div style={{ background: t.s3, borderRadius: 12, padding: "10px 13px", marginBottom: 12 }}>
                        <span style={{ fontFamily: FB, fontSize: 12, color: t.t2, lineHeight: 1.5 }}>
                            âœ¦ Add <span style={{ color: t.orange, fontWeight: 700 }}>GitHub</span> to unlock Recruiter-Ready status
                            <span style={{ fontFamily: FB, fontSize: 11, color: t.green, marginLeft: 6, fontWeight: 700 }}>+5 pts</span>
                        </span>
                    </div>

                    {/* action list */}
                    {(strengthExpanded ? strengthActions : strengthActions.slice(0, 3)).map((a, i) => (
                        <Row key={i} ai="center" g={10} sx={{ marginBottom: 8 }}>
                            <div style={{ width: 22, height: 22, borderRadius: 8, background: a.done ? `${t.green}22` : t.s3, border: `1.5px solid ${a.done ? t.green : t.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <Svg d={a.done ? IC.check : IC.plus} s={11} c={a.done ? t.green : t.t3} w={2.5} />
                            </div>
                            <span style={{ fontFamily: FB, fontSize: 12, color: a.done ? t.t3 : t.t1, textDecoration: a.done ? "line-through" : "none", flex: 1 }}>{a.label}</span>
                            <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, color: a.done ? t.t3 : t.green }}>{a.pts}</span>
                        </Row>
                    ))}
                    <button onClick={() => setStrengthExpanded(e => !e)}
                        style={{ background: "none", border: "none", cursor: "pointer", fontFamily: FB, fontSize: 12, color: t.orange, fontWeight: 700, padding: "2px 0 0" }}>
                        {strengthExpanded ? "Show less â†‘" : `Show all ${strengthActions.length} actions â†“`}
                    </button>
                </div>
            </div>

            {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                Â§4  RECRUITER VISIBILITY SCORE
            â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            <div style={{ padding: "0 22px 14px" }}>
                <div style={{ background: "linear-gradient(130deg,#0D1A08,#0A1C14)", borderRadius: 20, padding: "16px 18px", border: `1px solid ${t.green}28`, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: -30, right: -30, width: 130, height: 130, borderRadius: "50%", background: `${t.green}12`, filter: "blur(40px)", pointerEvents: "none" }} />

                    <Row ai="flex-start" jc="space-between" sx={{ position: "relative", zIndex: 1, marginBottom: 14 }}>
                        <Col g={6}>
                            <span style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: t.t3, letterSpacing: 1.1 }}>RECRUITER VISIBILITY</span>
                            <Row ai="center" g={10}>
                                <span style={{ fontFamily: FD, fontWeight: 900, fontSize: 40, color: t.green, letterSpacing: -1, lineHeight: 1 }}>{visScore}</span>
                                <span style={{ fontFamily: FB, fontSize: 12, fontWeight: 700, color: vis.col, background: `${vis.col}22`, padding: "4px 12px", borderRadius: 100 }}>{vis.label}</span>
                            </Row>
                            <span style={{ fontFamily: FB, fontSize: 12, color: t.t2 }}>
                                Top <span style={{ color: t.green, fontWeight: 700 }}>22%</span> of profiles viewed by recruiters
                            </span>
                        </Col>
                        {/* arc gauge */}
                        <svg width="64" height="64" viewBox="0 0 36 36" style={{ flexShrink: 0 }}>
                            <circle cx="18" cy="18" r="14" fill="none" stroke={t.s4} strokeWidth="3" />
                            <circle cx="18" cy="18" r="14" fill="none" stroke={t.green} strokeWidth="3"
                                strokeDasharray={`${(visScore / 100) * 87.96} 87.96`} strokeLinecap="round"
                                style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", filter: `drop-shadow(0 0 5px ${t.green}88)` }} />
                            <text x="18" y="23" textAnchor="middle" fontFamily="DM Sans" fontWeight="800" fontSize="7.5" fill={t.green}>{visScore}</text>
                        </svg>
                    </Row>

                    {/* 3-factor breakdown */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, position: "relative", zIndex: 1, marginBottom: 14 }}>
                        {[
                            { label: "Profile",  val: profileStrength,                          weight: "50%", col: t.orange  },
                            { label: "Skills",   val: Math.min(Math.round(skillScore/10), 100), weight: "30%", col: "#A78BFA" },
                            { label: "Activity", val: Math.min(activityScore * 11, 100),        weight: "20%", col: t.blue    },
                        ].map(({ label, val, weight, col }) => (
                            <div key={label} style={{ background: t.s2, borderRadius: 12, padding: "10px 8px", textAlign: "center" }}>
                                <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 16, color: col, display: "block" }}>{val}</span>
                                <span style={{ fontFamily: FB, fontSize: 10, color: t.t2 }}>{label}</span>
                                <span style={{ fontFamily: FB, fontSize: 9, color: t.t3, display: "block" }}>wt {weight}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div style={{ background: `${t.green}0E`, borderRadius: 12, padding: "10px 13px", border: `1px solid ${t.green}22`, position: "relative", zIndex: 1 }}>
                        <span style={{ fontFamily: FB, fontSize: 12, color: t.t2 }}>
                            âœ¦ Verify <span style={{ color: t.green, fontWeight: 700 }}>Python</span> to enter top 15% of recruiter searches
                            <span style={{ color: t.green, fontWeight: 700, marginLeft: 5 }}>+8 pts</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                Â§5  SKILLS â€” 3 states: verified / unverified / locked
            â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            <div style={{ padding: "0 22px 14px" }}>
                <Row ai="center" jc="space-between" sx={{ marginBottom: 14 }}>
                    <Row ai="center" g={8}>
                        <span style={{ fontFamily: FD, fontWeight: 700, fontSize: 17, color: t.t1 }}>Skills</span>
                        <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, color: t.orange, background: t.orangeLo, padding: "2px 8px", borderRadius: 100 }}>
                            {verifiedSkills.length + unverifiedSkills.length + lockedSkills.length} total
                        </span>
                    </Row>
                    <Row ai="center" g={5} sx={{ cursor: "pointer" }}>
                        <Svg d={IC.plus} s={14} c={t.orange} w={2.5} />
                        <span style={{ fontFamily: FB, fontSize: 12, fontWeight: 700, color: t.orange }}>Add Skill</span>
                    </Row>
                </Row>

                <span style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: t.t3, letterSpacing: 1.1, display: "block", marginBottom: 10 }}>VERIFIED</span>
                <Row g={8} sx={{ flexWrap: "wrap", marginBottom: 18 }}>
                    {verifiedSkills.map(({ name, col, score }) => (
                        <div key={name} style={{ display: "flex", alignItems: "center", gap: 6, background: `${col}14`, border: `1px solid ${col}38`, borderRadius: 100, padding: "7px 13px 7px 8px", cursor: "pointer" }}>
                            <div style={{ width: 20, height: 20, borderRadius: 10, background: col, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <Svg d={IC.check} s={10} c="#fff" w={3} />
                            </div>
                            <span style={{ fontFamily: FB, fontSize: 12, fontWeight: 700, color: col }}>{name}</span>
                            <span style={{ fontFamily: FD, fontSize: 11, fontWeight: 800, color: col, opacity: 0.7 }}>{score}</span>
                        </div>
                    ))}
                </Row>

                <span style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: t.t3, letterSpacing: 1.1, display: "block", marginBottom: 10 }}>
                    UNVERIFIED â€” Take a quiz to earn verified badge
                </span>
                <Row g={8} sx={{ flexWrap: "wrap", marginBottom: 18 }}>
                    {unverifiedSkills.map(({ name, pts }) => {
                        const active = verifyingSkill === name;
                        return (
                            <div key={name} onClick={() => handleVerify(name)}
                                style={{ display: "flex", alignItems: "center", gap: 6, background: active ? t.orangeLo : t.s2, border: `1px solid ${active ? t.orange : t.border}`, borderRadius: 100, padding: "7px 10px 7px 8px", cursor: "pointer", transition: "background 0.2s,border-color 0.2s" }}>
                                <div style={{ width: 20, height: 20, borderRadius: 10, background: t.s3, border: `1.5px dashed ${t.t3}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <span style={{ fontSize: 11, color: t.t3, lineHeight: 1 }}>?</span>
                                </div>
                                <span style={{ fontFamily: FB, fontSize: 12, fontWeight: 600, color: active ? t.orange : t.t2 }}>{name}</span>
                                <span style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: active ? t.orange : t.green, background: active ? t.orangeLo : `${t.green}18`, padding: "2px 8px", borderRadius: 100 }}>
                                    {active ? "Startingâ€¦" : `+${pts} pts`}
                                </span>
                            </div>
                        );
                    })}
                </Row>

                <span style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: t.t3, letterSpacing: 1.1, display: "block", marginBottom: 10 }}>
                    LOCKED â€” verify 2 more skills to unlock
                </span>
                <Row g={8} sx={{ flexWrap: "wrap" }}>
                    {lockedSkills.map(name => (
                        <div key={name} style={{ display: "flex", alignItems: "center", gap: 6, background: t.s2, border: `1px solid ${t.border}`, borderRadius: 100, padding: "7px 13px 7px 8px", opacity: 0.5 }}>
                            <div style={{ width: 20, height: 20, borderRadius: 10, background: t.s3, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <Svg d={LOCK_PATH} s={11} c={t.t3} />
                            </div>
                            <span style={{ fontFamily: FB, fontSize: 12, fontWeight: 600, color: t.t3 }}>{name}</span>
                        </div>
                    ))}
                </Row>
            </div>

            {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                Â§6  AI RESUME CTA
            â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            <div style={{ padding: "0 22px 16px" }}>
                <div style={{ background: `linear-gradient(105deg,${t.orange},#FF9A45)`, borderRadius: 20, padding: "16px 18px", position: "relative", overflow: "hidden", boxShadow: `0 8px 28px rgba(255,122,26,0.4)`, cursor: "pointer" }}>
                    <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.1)", pointerEvents: "none" }} />
                    <Row ai="center" jc="space-between">
                        <Col g={6}>
                            <Row ai="center" g={8}>
                                <Svg d={IC.spark} s={18} c="#fff" fill="rgba(255,255,255,0.3)" />
                                <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 17, color: "#fff" }}>AI Resume Builder</span>
                            </Row>
                            <span style={{ fontFamily: FB, fontSize: 12, color: "rgba(255,255,255,0.82)", lineHeight: 1.45 }}>
                                Resume scores <strong style={{ color: "#fff" }}>84/100</strong>. Verify Python to reach 90 and enter top 10%.
                            </span>
                        </Col>
                        <div style={{ width: 42, height: 42, borderRadius: 14, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Svg d={IC.arrow} s={20} c="#fff" />
                        </div>
                    </Row>
                    <div style={{ marginTop: 14, height: 5, background: "rgba(255,255,255,0.25)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: "84%", height: "100%", background: "#fff", borderRadius: 3 }} />
                    </div>
                    <span style={{ fontFamily: FB, fontSize: 10, color: "rgba(255,255,255,0.65)", marginTop: 5, display: "block" }}>Score: 84/100 Â· Top 15% resumes</span>
                </div>
            </div>

            {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                Â§7  SEGMENTED TABS
            â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            <Row g={0} sx={{ margin: "0 22px 16px", background: t.s2, borderRadius: 16, padding: 4, border: `1px solid ${t.border}` }}>
                {[["projects","Projects"],["achievements","Badges"],["activity","Activity"]].map(([id, label]) => (
                    <button key={id} onClick={() => setActiveTab(id)} style={{
                        flex: 1, height: 34, borderRadius: 12,
                        background: activeTab === id ? t.s4 : "transparent",
                        border: "none", color: activeTab === id ? t.t1 : t.t2,
                        fontFamily: FB, fontSize: 12, fontWeight: 700, cursor: "pointer",
                        boxShadow: activeTab === id ? "0 2px 8px rgba(0,0,0,0.35)" : "none",
                        transition: "background 0.18s,color 0.18s",
                    }}>{label}</button>
                ))}
            </Row>

            {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                TAB â€” PROJECTS
            â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            {activeTab === "projects" && (
                <Col g={12} sx={{ padding: "0 22px" }}>
                    {projects.map((proj) => (
                        <div key={proj.name} style={{ background: t.s2, borderRadius: 20, overflow: "hidden", border: `1px solid ${t.border}`, cursor: "pointer" }}>
                            <div style={{ height: 80, background: proj.grad, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 70% 50%,${proj.col}28,transparent 70%)` }} />
                                <Svg d={IC.grid} s={36} c={`${proj.col}28`} />
                                <Row g={6} sx={{ position: "absolute", top: 10, left: 10 }}>
                                    {proj.top && (
                                        <div style={{ display: "flex", alignItems: "center", gap: 4, background: t.orangeLo, border: `1px solid ${t.orange}44`, borderRadius: 100, padding: "3px 9px" }}>
                                            <Svg d={IC.fire} s={10} c={t.orange} />
                                            <span style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: t.orange }}>Top 10%</span>
                                        </div>
                                    )}
                                    {proj.verified && (
                                        <div style={{ display: "flex", alignItems: "center", gap: 4, background: `${t.green}1A`, border: `1px solid ${t.green}44`, borderRadius: 100, padding: "3px 9px" }}>
                                            <Svg d={IC.check} s={10} c={t.green} w={3} />
                                            <span style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: t.green }}>Verified</span>
                                        </div>
                                    )}
                                </Row>
                            </div>
                            <div style={{ padding: "12px 14px 14px" }}>
                                <span style={{ fontFamily: FD, fontWeight: 700, fontSize: 15, color: t.t1, display: "block", marginBottom: 4 }}>{proj.name}</span>
                                <span style={{ fontFamily: FB, fontSize: 12, color: t.t2, display: "block", marginBottom: 10, lineHeight: 1.45 }}>{proj.desc}</span>
                                <Row g={6} sx={{ marginBottom: 10, flexWrap: "wrap" }}>
                                    {proj.stack.map(tech => (
                                        <span key={tech} style={{ fontFamily: FB, fontSize: 11, fontWeight: 600, color: t.t2, background: t.s3, padding: "3px 10px", borderRadius: 100, border: `1px solid ${t.border}` }}>{tech}</span>
                                    ))}
                                </Row>
                                <Row ai="center" g={16}>
                                    <Row ai="center" g={4}>
                                        <Svg d={IC.users} s={13} c={t.t3} />
                                        <span style={{ fontFamily: FB, fontSize: 11, color: t.t3 }}>{proj.views} views</span>
                                    </Row>
                                    <Row ai="center" g={4}>
                                        <Svg d={IC.heart} s={13} c={t.t3} />
                                        <span style={{ fontFamily: FB, fontSize: 11, color: t.t3 }}>{proj.likes} likes</span>
                                    </Row>
                                    <div style={{ flex: 1 }} />
                                    <Svg d={IC.arrow} s={16} c={t.t3} />
                                </Row>
                            </div>
                        </div>
                    ))}
                    <div style={{ background: t.s2, borderRadius: 20, border: `2px dashed ${t.border}`, padding: "24px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer" }}>
                        <div style={{ width: 40, height: 40, borderRadius: 14, background: t.s3, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Svg d={IC.plus} s={20} c={t.t3} w={2.5} />
                        </div>
                        <span style={{ fontFamily: FB, fontSize: 13, fontWeight: 700, color: t.t2 }}>Add a Project</span>
                        <span style={{ fontFamily: FB, fontSize: 11, color: t.t3, textAlign: "center" }}>
                            Verified projects get <span style={{ color: t.orange, fontWeight: 700 }}>3Ã— more</span> recruiter views
                        </span>
                    </div>
                </Col>
            )}

            {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                TAB â€” ACHIEVEMENTS (badge grid: earned + locked)
            â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            {activeTab === "achievements" && (
                <div style={{ padding: "0 22px" }}>
                    <span style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: t.t3, letterSpacing: 1.1, marginBottom: 12, display: "block" }}>EARNED</span>
                    <Col g={10} sx={{ marginBottom: 22 }}>
                        {achievements.filter(a => a.earned).map(a => (
                            <Row key={a.title} ai="center" g={14} sx={{ background: t.s2, borderRadius: 20, padding: "14px", border: `1px solid ${t.border}`, cursor: "pointer" }}>
                                <div style={{ width: 52, height: 52, borderRadius: 18, background: a.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 26 }}>{a.icon}</div>
                                <Col g={4} sx={{ flex: 1 }}>
                                    <span style={{ fontFamily: FB, fontWeight: 700, fontSize: 14, color: t.t1 }}>{a.title}</span>
                                    <span style={{ fontFamily: FB, fontSize: 11, color: t.t2 }}>{a.sub}</span>
                                </Col>
                                <div style={{ width: 30, height: 30, borderRadius: 10, background: a.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Svg d={IC.award} s={14} c={a.col} />
                                </div>
                            </Row>
                        ))}
                    </Col>
                    <span style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: t.t3, letterSpacing: 1.1, marginBottom: 12, display: "block" }}>LOCKED</span>
                    <Col g={10}>
                        {achievements.filter(a => !a.earned).map(a => (
                            <Row key={a.title} ai="center" g={14} sx={{ background: t.s2, borderRadius: 20, padding: "14px", border: `1px solid ${t.border}`, opacity: 0.5 }}>
                                <div style={{ width: 52, height: 52, borderRadius: 18, background: t.s3, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 26, filter: "grayscale(1)" }}>{a.icon}</div>
                                <Col g={4} sx={{ flex: 1 }}>
                                    <span style={{ fontFamily: FB, fontWeight: 700, fontSize: 14, color: t.t2 }}>{a.title}</span>
                                    <span style={{ fontFamily: FB, fontSize: 11, color: t.t3 }}>{a.sub}</span>
                                </Col>
                                <Svg d={LOCK_PATH} s={16} c={t.t3} />
                            </Row>
                        ))}
                    </Col>
                </div>
            )}

            {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                TAB â€” ACTIVITY FEED (timeline)
            â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            {activeTab === "activity" && (
                <div style={{ padding: "0 22px" }}>
                    <span style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: t.t3, letterSpacing: 1.1, marginBottom: 14, display: "block" }}>RECENT ACTIVITY</span>
                    {activity.map((item, i) => (
                        <div key={i} style={{ position: "relative", paddingBottom: 20 }}>
                            {i < activity.length - 1 && (
                                <div style={{ position: "absolute", left: 25, top: 50, bottom: 0, width: 1.5, background: t.border }} />
                            )}
                            <Row ai="flex-start" g={14}>
                                <div style={{ width: 50, height: 50, borderRadius: 16, background: item.bg, border: `1px solid ${item.col}28`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <Svg d={item.icon} s={20} c={item.col} />
                                </div>
                                <Col g={4} sx={{ flex: 1, paddingTop: 4 }}>
                                    <Row ai="center" jc="space-between">
                                        <span style={{ fontFamily: FB, fontWeight: 700, fontSize: 13, color: t.t1 }}>{item.text}</span>
                                        <span style={{ fontFamily: FB, fontSize: 10, color: t.t3, flexShrink: 0, marginLeft: 8 }}>{item.time}</span>
                                    </Row>
                                    <span style={{ fontFamily: FB, fontSize: 12, color: t.t2, lineHeight: 1.4 }}>{item.sub}</span>
                                </Col>
                            </Row>
                        </div>
                    ))}
                </div>
            )}

        </Col>
    );
};

export default CareerProfile;

