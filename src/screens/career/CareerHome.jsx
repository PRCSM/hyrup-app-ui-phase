import { useState } from "react";
import { T, FD, FB } from '../../tokens.js';
import { IC, Svg } from '../../icons.jsx';
import { Row, Col } from '../../helpers.jsx';
import ModeToggle from '../../components/ModeToggle.jsx';
import SwipeScreen from './SwipeScreen.jsx';

/* ══════════════════════════════════════════════════════════════════
   CAREER HOME  v2  — Engagement-first layout
   Layer 1 (Immediate Action):  Header → Metrics → Quick Apply
   Layer 2 (Personal Progress): Daily Challenge → Profile Strength
   Layer 3 (Opportunity/Social): Recruiter Signal → Jobs → Project
                                  → Community Feed → News
══════════════════════════════════════════════════════════════════ */
const CareerHome = ({ mode, onToggle, appliedCount = 0 }) => {
    const t = T.c;
    const [showSwipe, setShowSwipe] = useState(false);
    const [challengeDone, setChallengeDone] = useState(false);

    const jobs = [
        { role: "Frontend Dev Intern", co: "Zepto",    loc: "Remote",    pay: "₹15K", match: 94, ch: "Z", col: t.orange, grad: "linear-gradient(135deg,#1C0D00,#2D1600)", tags: ["React", "TypeScript"] },
        { role: "UI/UX Designer",      co: "Groww",    loc: "Bengaluru", pay: "₹20K", match: 88, ch: "G", col: t.green,  grad: "linear-gradient(135deg,#001A0D,#002E1A)", tags: ["Figma"]              },
        { role: "Backend Intern",      co: "Razorpay", loc: "Hybrid",    pay: "₹25K", match: 91, ch: "R", col: t.blue,   grad: "linear-gradient(135deg,#00101A,#001C2E)", tags: ["Node.js"]            },
    ];

    if (showSwipe) return <SwipeScreen onClose={() => setShowSwipe(false)} />;

    return (
        <Col g={0} sx={{ paddingBottom: 32 }}>

            {/* ══════════════════════════════════════════════════
                §1  GREETING HEADER
                First impression — name + notification badge.
                Kept above the fold so user is welcomed
                immediately and trust is established fast.
            ══════════════════════════════════════════════════ */}
            <div style={{ padding: "14px 22px 18px" }}>
                <Row ai="flex-start" jc="space-between">
                    <Col g={3}>
                        <span style={{ fontFamily: FB, fontSize: 13, color: t.t2, fontWeight: 500 }}>Good morning 👋</span>
                        <span style={{ fontFamily: FD, fontSize: 26, fontWeight: 800, color: t.t1, letterSpacing: -0.8, lineHeight: 1.1 }}>Rahul Sharma</span>
                        <Row ai="center" g={6} sx={{ marginTop: 4 }}>
                            <div style={{ width: 8, height: 8, borderRadius: 4, background: t.green, boxShadow: `0 0 8px ${t.green}88` }} />
                            <span style={{ fontFamily: FB, fontSize: 11, color: t.t2 }}>Skill Score <span style={{ color: t.orange, fontWeight: 700 }}>847</span> · Rank <span style={{ color: "#F59E0B", fontWeight: 700 }}>#3 RGPV</span></span>
                        </Row>
                    </Col>
                    <Row g={10} ai="center" sx={{ marginTop: 2 }}>
                        <ModeToggle mode={mode} onToggle={onToggle} />
                        <div style={{ position: "relative" }}>
                            <div style={{ width: 38, height: 38, borderRadius: 14, background: t.s2, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Svg d={IC.bell} s={17} c={t.t2} />
                            </div>
                            <div style={{ position: "absolute", top: 8, right: 9, width: 7, height: 7, borderRadius: 4, background: t.orange, border: `1.5px solid ${t.bg}` }} />
                        </div>
                    </Row>
                </Row>
            </div>

            {/* ══════════════════════════════════════════════════
                §2  SKILL SCORE + RANK STATS STRIP
                4-column quick stats immediately below the name.
                Triggers social comparison ("am I behind?")
                and sets context for all cards below.
            ══════════════════════════════════════════════════ */}
            <Row g={0} sx={{ margin: "0 22px 20px", background: t.s2, borderRadius: 20, border: `1px solid ${t.border}`, overflow: "hidden" }}>
                {[
                    [String(appliedCount || 6), "Applied",     t.orange ],
                    ["3",                        "Shortlisted", t.green  ],
                    ["847",                      "Skill Score", "#F59E0B"],
                    ["#3",                       "Rank RGPV",  t.blue   ],
                ].map(([n, l, col], i, arr) => (
                    <div key={l} style={{ flex: 1, textAlign: "center", padding: "14px 4px", borderRight: i < arr.length - 1 ? `1px solid ${t.border}` : "none" }}>
                        <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 20, color: col, display: "block", lineHeight: 1 }}>{n}</span>
                        <span style={{ fontFamily: FB, fontSize: 10, color: t.t2, marginTop: 3, display: "block" }}>{l}</span>
                    </div>
                ))}
            </Row>

            {/* ══════════════════════════════════════════════════
                §3  MATCHED FOR YOU → QUICK APPLY  (PRIMARY CTA)
                The single most important card on the screen.
                Placed at top of content so the first scroll
                action reveals a compelling decision to make.
                Keep the full swipe mechanic intact.
            ══════════════════════════════════════════════════ */}
            <Row ai="center" jc="space-between" sx={{ padding: "0 22px 12px" }}>
                <span style={{ fontFamily: FD, fontWeight: 700, fontSize: 17, color: t.t1 }}>Matched for you</span>
                <span style={{ fontFamily: FB, fontSize: 12, color: t.orange, fontWeight: 600 }}>See all →</span>
            </Row>

            <div onClick={() => setShowSwipe(true)} style={{
                margin: "0 22px 20px", borderRadius: 22,
                background: "linear-gradient(125deg,#1C0D00 0%,#2D1600 50%,#1A0A00 100%)",
                border: `1px solid ${t.orange}30`,
                padding: "18px 20px", cursor: "pointer", position: "relative", overflow: "hidden",
                boxShadow: `0 8px 32px rgba(255,122,26,0.18)`,
            }}>
                <div style={{ position: "absolute", top: -30, right: -30, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,122,26,0.18)", filter: "blur(50px)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: -20, left: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,122,26,0.08)", filter: "blur(40px)", pointerEvents: "none" }} />

                {/* skill reward badge */}
                <div style={{ position: "absolute", top: 14, right: 14, background: `${t.green}22`, border: `1px solid ${t.green}44`, borderRadius: 100, padding: "3px 10px", display: "flex", alignItems: "center", gap: 5 }}>
                    <Svg d={IC.zap} s={10} c={t.green} />
                    <span style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: t.green }}>+2 pts / apply</span>
                </div>

                <Row ai="center" jc="space-between" sx={{ position: "relative", zIndex: 1 }}>
                    <Col g={6}>
                        <Row g={8} ai="center" sx={{ marginBottom: 4 }}>
                            <div style={{ display: "flex", gap: 3 }}>
                                {[0, 1, 2].map(i => (
                                    <div key={i} style={{ width: i === 1 ? 24 : 16, height: 5, borderRadius: 3, background: i === 0 ? "rgba(239,68,68,0.7)" : i === 1 ? t.orange : "rgba(34,197,94,0.7)" }} />
                                ))}
                            </div>
                            <span style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: t.orange, letterSpacing: 1.2 }}>QUICK APPLY</span>
                        </Row>
                        <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 20, color: "#fff", lineHeight: 1.2 }}>
                            5 jobs waiting<br />for your decision
                        </span>
                        <span style={{ fontFamily: FB, fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2, display: "block" }}>
                            Swipe right to apply · left to skip
                        </span>
                        <Row g={6} ai="center" sx={{ marginTop: 8 }}>
                            <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, color: t.orange, background: t.orangeLo, padding: "3px 10px", borderRadius: 100 }}>94% match</span>
                            <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, color: t.green, background: `${t.green}18`, padding: "3px 10px", borderRadius: 100 }}>React · Node.js</span>
                        </Row>
                    </Col>
                    <div style={{ position: "relative", width: 64, height: 80, flexShrink: 0 }}>
                        {[2, 1, 0].map(i => (
                            <div key={i} style={{
                                position: "absolute", width: 52, height: 70,
                                background: i === 0 ? "rgba(255,122,26,0.2)" : i === 1 ? "rgba(255,122,26,0.1)" : "rgba(255,122,26,0.05)",
                                border: `1px solid rgba(255,122,26,${0.15 - i * 0.04})`,
                                borderRadius: 14,
                                top: i * 5, left: i * 4,
                                transform: `rotate(${i === 1 ? 6 : i === 2 ? 12 : 0}deg)`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                {i === 0 && <Svg d={IC.swipe} s={20} c={t.orange} />}
                            </div>
                        ))}
                    </div>
                </Row>
                <button onClick={e => { e.stopPropagation(); setShowSwipe(true); }} style={{
                    marginTop: 16, width: "100%", height: 42, borderRadius: 13,
                    background: t.orange, border: "none", color: "#fff",
                    fontFamily: FB, fontSize: 14, fontWeight: 800, cursor: "pointer",
                    position: "relative", zIndex: 1,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    boxShadow: `0 4px 16px rgba(255,122,26,0.35)`,
                }}>
                    <Svg d={IC.swipe} s={16} c="#fff" />
                    Start Swiping
                </button>
            </div>

            {/* ══════════════════════════════════════════════════
                §4  DAILY SKILL CHALLENGE
                Positioned directly after the primary CTA so
                users who don't want to swipe have an
                immediate second action. The streak counter
                creates Duolingo-style habit loop pressure.
            ══════════════════════════════════════════════════ */}
            <div style={{ padding: "0 22px 20px" }}>
                <div style={{
                    background: "linear-gradient(130deg,#1C0D00,#2A1400)",
                    borderRadius: 20, padding: "16px 18px",
                    border: `1px solid ${t.orange}28`,
                    boxShadow: `0 8px 28px rgba(255,122,26,0.14)`,
                    position: "relative", overflow: "hidden",
                    cursor: "pointer",
                }}>
                    <div style={{ position: "absolute", top: -24, right: -24, width: 110, height: 110, borderRadius: "50%", background: t.orangeMid, filter: "blur(44px)", pointerEvents: "none" }} />

                    <Row ai="center" jc="space-between">
                        <Row ai="center" g={14}>
                            <div style={{ width: 48, height: 48, borderRadius: 16, background: t.orangeLo, border: `1px solid ${t.orange}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <Svg d={IC.zap} s={24} c={t.orange} fill={`${t.orange}25`} />
                            </div>
                            <Col g={4}>
                                <Row ai="center" g={8}>
                                    <span style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: t.orange, letterSpacing: 1.1 }}>DAILY CHALLENGE</span>
                                    <span style={{ fontFamily: FB, fontSize: 10, fontWeight: 800, color: t.green, background: `${t.green}22`, padding: "1px 7px", borderRadius: 100 }}>+20 pts</span>
                                </Row>
                                <span style={{ fontFamily: FD, fontWeight: 700, fontSize: 16, color: t.t1 }}>React Hooks Quiz</span>
                                <Row ai="center" g={6} sx={{ marginTop: 2 }}>
                                    <span style={{ fontSize: 13 }}>🔥</span>
                                    <span style={{ fontFamily: FB, fontSize: 12, color: t.t2 }}>
                                        <span style={{ color: "#F59E0B", fontWeight: 700 }}>6 Day Streak</span> — keep it going!
                                    </span>
                                </Row>
                            </Col>
                        </Row>
                        <Col ai="flex-end" g={4} sx={{ flexShrink: 0 }}>
                            <Svg d={IC.arrow} s={18} c={t.orange} />
                            <span style={{ fontFamily: FB, fontSize: 10, color: t.t3 }}>18:42 left</span>
                        </Col>
                    </Row>

                    {challengeDone ? (
                        <div style={{ marginTop: 14, height: 40, borderRadius: 12, background: `${t.green}22`, border: `1px solid ${t.green}44`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, position: "relative", zIndex: 1 }}>
                            <Svg d={IC.check} s={15} c={t.green} w={3} />
                            <span style={{ fontFamily: FB, fontSize: 13, fontWeight: 700, color: t.green }}>Challenge Completed! +20 pts added</span>
                        </div>
                    ) : (
                        <button onClick={() => setChallengeDone(true)} style={{
                            marginTop: 14, width: "100%", height: 40, borderRadius: 12,
                            background: t.orangeLo, border: `1px solid ${t.orange}44`,
                            color: t.orange, fontFamily: FB, fontSize: 13, fontWeight: 800,
                            cursor: "pointer", position: "relative", zIndex: 1,
                        }}>
                            Start Challenge →
                        </button>
                    )}
                </div>
            </div>

            {/* ══════════════════════════════════════════════════
                §5  PROFILE STRENGTH
                Progress card with specific, measurable actions.
                Point values shown next to each nudge so users
                can calculate the ROI of each action — this is
                far more motivating than generic "complete
                your profile" copy.
            ══════════════════════════════════════════════════ */}
            <div style={{ padding: "0 22px 20px" }}>
                <div style={{ background: t.s2, borderRadius: 20, padding: "16px 18px", border: `1px solid ${t.border}` }}>
                    <Row ai="center" jc="space-between" sx={{ marginBottom: 10 }}>
                        <Col g={3}>
                            <span style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: t.t3, letterSpacing: 1.2 }}>PROFILE STRENGTH</span>
                            <Row ai="center" g={8}>
                                <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 26, color: t.t1, letterSpacing: -0.5 }}>
                                    72<span style={{ fontSize: 14, color: t.t2, fontWeight: 500 }}>%</span>
                                </span>
                                <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, color: t.orange, background: t.orangeLo, padding: "2px 9px", borderRadius: 100 }}>Good</span>
                            </Row>
                        </Col>
                        <div style={{ width: 38, height: 38, borderRadius: 14, background: t.orangeLo, border: `1px solid ${t.orange}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Svg d={IC.user} s={18} c={t.orange} />
                        </div>
                    </Row>
                    <div style={{ height: 6, background: t.s4, borderRadius: 3, overflow: "hidden", marginBottom: 14 }}>
                        <div style={{ width: "72%", height: "100%", background: `linear-gradient(90deg,${t.orange},#FFB36B)`, borderRadius: 3, boxShadow: `0 0 10px ${t.orange}66` }} />
                    </div>
                    {[
                        { icon: IC.check, left: "Verify Python skill",   pts: "+8 pts",  col: t.orange },
                        { icon: IC.plus,  left: "Upload 1 more project", pts: "+6 pts",  col: t.blue   },
                        { icon: IC.edit,  left: "Add GitHub link",       pts: "+5 pts",  col: "#A78BFA"},
                    ].map((a, i) => (
                        <Row key={i} ai="center" g={10} sx={{ marginBottom: i < 2 ? 10 : 0 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 10, background: `${a.col}18`, border: `1px solid ${a.col}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <Svg d={a.icon} s={13} c={a.col} w={2.5} />
                            </div>
                            <span style={{ fontFamily: FB, fontSize: 12, color: t.t1, flex: 1 }}>{a.left}</span>
                            <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, color: t.green, background: `${t.green}18`, padding: "2px 9px", borderRadius: 100 }}>{a.pts}</span>
                        </Row>
                    ))}
                </div>
            </div>

            {/* ══════════════════════════════════════════════════
                §6  RECRUITER ACTIVITY SIGNAL
                FOMO/curiosity drop. "Recruiters are looking"
                creates urgency to improve the profile.
                Placed after progress cards so the user has
                just seen how to act on this signal.
            ══════════════════════════════════════════════════ */}
            <div style={{ padding: "0 22px 20px" }}>
                <div style={{
                    background: "linear-gradient(130deg,#0D1A08,#0A1C14)",
                    borderRadius: 20, padding: "16px 18px",
                    border: `1px solid ${t.green}28`,
                    position: "relative", overflow: "hidden",
                }}>
                    <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: `${t.green}12`, filter: "blur(40px)", pointerEvents: "none" }} />
                    <Row ai="center" g={12} sx={{ marginBottom: 12, position: "relative", zIndex: 1 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 14, background: `${t.green}1A`, border: `1px solid ${t.green}33`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Svg d={IC.users} s={18} c={t.green} />
                        </div>
                        <Col g={3}>
                            <span style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: t.green, letterSpacing: 1.1 }}>RECRUITER ACTIVITY</span>
                            <span style={{ fontFamily: FD, fontWeight: 700, fontSize: 15, color: t.t1 }}>Recruiters are watching 👀</span>
                        </Col>
                    </Row>
                    <Col g={10} sx={{ position: "relative", zIndex: 1 }}>
                        {[
                            { icon: IC.users, col: t.green,   bg: `${t.green}18`,  label: "3 recruiters viewed profiles like yours", sub: "In the past 48 hours"         },
                            { icon: IC.brief, col: t.blue,    bg: `${t.blue}18`,   label: "2 new internships match your skills",     sub: "React + Node.js · React + TS" },
                            { icon: IC.zap,   col: "#F59E0B", bg: "#F59E0B18",     label: "Verify Python to enter top 15%",          sub: "Recruiter search filters"     },
                        ].map((s, i) => (
                            <Row key={i} ai="center" g={12}>
                                <div style={{ width: 36, height: 36, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <Svg d={s.icon} s={16} c={s.col} />
                                </div>
                                <Col g={2} sx={{ flex: 1 }}>
                                    <span style={{ fontFamily: FB, fontSize: 12, fontWeight: 600, color: t.t1 }}>{s.label}</span>
                                    <span style={{ fontFamily: FB, fontSize: 11, color: t.t2 }}>{s.sub}</span>
                                </Col>
                            </Row>
                        ))}
                    </Col>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════
                §7  HORIZONTAL JOB CARDS
                Scrollable browse strip for users who want to
                explore without committing to the swipe flow.
                Retains the match % badge to reinforce
                personalization and trust.
            ══════════════════════════════════════════════════ */}
            <Row ai="center" jc="space-between" sx={{ padding: "0 22px 12px" }}>
                <span style={{ fontFamily: FD, fontWeight: 700, fontSize: 17, color: t.t1 }}>Top Picks</span>
                <span style={{ fontFamily: FB, fontSize: 12, color: t.orange, fontWeight: 600 }}>See all →</span>
            </Row>
            <div style={{ display: "flex", gap: 12, padding: "0 22px 20px", overflowX: "auto", scrollbarWidth: "none" }}>
                {jobs.map((j, i) => (
                    <div key={i} style={{ background: t.s2, borderRadius: 20, padding: 16, minWidth: 192, border: `1px solid ${t.border}`, flexShrink: 0, cursor: "pointer" }}>
                        <Row g={10} ai="center" sx={{ marginBottom: 12 }}>
                            <div style={{ width: 44, height: 44, borderRadius: 14, background: j.grad, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${j.col}28` }}>
                                <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 18, color: j.col }}>{j.ch}</span>
                            </div>
                            <Col g={2} sx={{ flex: 1 }}>
                                <span style={{ fontFamily: FB, fontWeight: 700, fontSize: 13, color: t.t1, lineHeight: 1.3 }}>{j.role}</span>
                                <span style={{ fontFamily: FB, fontSize: 11, color: t.t2 }}>{j.co} · {j.loc}</span>
                            </Col>
                        </Row>
                        <Row g={5} sx={{ flexWrap: "wrap", marginBottom: 12 }}>
                            {j.tags.map(tg => <span key={tg} style={{ fontFamily: FB, fontSize: 11, fontWeight: 600, color: j.col, background: `${j.col}18`, padding: "3px 9px", borderRadius: 100 }}>{tg}</span>)}
                            <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 600, color: t.green, background: `${t.green}18`, padding: "3px 9px", borderRadius: 100 }}>{j.pay}</span>
                        </Row>
                        <Row ai="center" jc="space-between">
                            <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, color: j.col, background: `${j.col}18`, padding: "4px 10px", borderRadius: 8 }}>{j.match}% match</span>
                            <button style={{ height: 30, padding: "0 14px", borderRadius: 100, background: j.col, border: "none", color: "#fff", fontFamily: FB, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Apply</button>
                        </Row>
                    </div>
                ))}
            </div>

            {/* ══════════════════════════════════════════════════
                §8  PROJECT PERFORMANCE
                Rewards users who have uploaded projects by
                showing their traction. Acts as a reinforcement
                loop — views → motivation → more uploads.
            ══════════════════════════════════════════════════ */}
            <div style={{ padding: "0 22px 20px" }}>
                <div style={{ background: t.s2, borderRadius: 20, padding: "16px 18px", border: `1px solid ${t.border}`, cursor: "pointer" }}>
                    <Row ai="center" jc="space-between" sx={{ marginBottom: 12 }}>
                        <Row ai="center" g={10}>
                            <div style={{ width: 40, height: 40, borderRadius: 14, background: t.orangeLo, border: `1px solid ${t.orange}33`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <Svg d={IC.grid} s={18} c={t.orange} />
                            </div>
                            <Col g={2}>
                                <span style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: t.t3, letterSpacing: 1 }}>YOUR PROJECT</span>
                                <span style={{ fontFamily: FD, fontWeight: 700, fontSize: 15, color: t.t1 }}>AI Resume Builder</span>
                            </Col>
                        </Row>
                        <div style={{ background: `${t.green}18`, border: `1px solid ${t.green}33`, borderRadius: 100, padding: "4px 12px" }}>
                            <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, color: t.green }}>🔥 Trending</span>
                        </div>
                    </Row>
                    <Row g={0} sx={{ background: t.s3, borderRadius: 14, overflow: "hidden" }}>
                        {[
                            { val: "14", label: "New views",  col: t.orange },
                            { val: "64", label: "Total views",col: t.blue   },
                            { val: "8",  label: "Saves",      col: "#A78BFA"},
                        ].map(({ val, label, col }, i, arr) => (
                            <div key={label} style={{ flex: 1, textAlign: "center", padding: "12px 6px", borderRight: i < arr.length - 1 ? `1px solid ${t.border}` : "none" }}>
                                <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 20, color: col, display: "block" }}>{val}</span>
                                <span style={{ fontFamily: FB, fontSize: 10, color: t.t2 }}>{label}</span>
                            </div>
                        ))}
                    </Row>
                    <div style={{ marginTop: 12, background: t.orangeLo, borderRadius: 12, padding: "10px 13px" }}>
                        <span style={{ fontFamily: FB, fontSize: 12, color: t.t2 }}>
                            🚀 <span style={{ color: t.orange, fontWeight: 700 }}>14 new views this week</span> — share it to reach 50
                        </span>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════
                §9  COMMUNITY ACTIVITY FEED
                Social comparison and peer inspiration.
                Placed near the bottom so engaged users who
                scroll this far are rewarded with social proof.
                Each entry models a desired behaviour
                (verify → upload → rank up).
            ══════════════════════════════════════════════════ */}
            <Row ai="center" jc="space-between" sx={{ padding: "0 22px 12px" }}>
                <Row ai="center" g={8}>
                    <span style={{ fontFamily: FD, fontWeight: 700, fontSize: 17, color: t.t1 }}>Career Activity</span>
                    <span style={{ fontSize: 15 }}>🔥</span>
                </Row>
                <span style={{ fontFamily: FB, fontSize: 12, color: t.orange, fontWeight: 600 }}>See all →</span>
            </Row>
            <Col g={10} sx={{ padding: "0 22px 20px" }}>
                {[
                    { avatar: "S", col: t.orange,  grad: "linear-gradient(135deg,#1C0D00,#2D1600)", name: "Sneha R.",   action: "verified React skill",          sub: "Skill Score: 891",     time: "2h" },
                    { avatar: "A", col: t.blue,    grad: "linear-gradient(135deg,#00101A,#001C2E)", name: "Arjun K.",   action: "uploaded an AI project",        sub: "+6 pts · 24 views",    time: "4h" },
                    { avatar: "R", col: t.green,   grad: "linear-gradient(135deg,#001A0D,#002E1A)", name: "Riya M.",    action: "reached Rank #2 at RGPV 🎉",    sub: "Passed 180 students",  time: "6h" },
                    { avatar: "K", col: "#A78BFA", grad: "linear-gradient(135deg,#0E0014,#1A0028)", name: "Karan S.",   action: "applied to 5 jobs in one day",  sub: "+10 Activity pts",     time: "8h" },
                ].map((f, i) => (
                    <Row key={i} ai="flex-start" g={12} sx={{ background: t.s2, borderRadius: 18, padding: "12px 14px", border: `1px solid ${t.border}`, cursor: "pointer" }}>
                        <div style={{ width: 40, height: 40, borderRadius: 14, background: f.grad, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${f.col}28` }}>
                            <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 17, color: f.col }}>{f.avatar}</span>
                        </div>
                        <Col g={3} sx={{ flex: 1 }}>
                            <Row ai="center" jc="space-between">
                                <span style={{ fontFamily: FB, fontWeight: 700, fontSize: 13, color: t.t1 }}>{f.name}</span>
                                <span style={{ fontFamily: FB, fontSize: 10, color: t.t3 }}>{f.time} ago</span>
                            </Row>
                            <span style={{ fontFamily: FB, fontSize: 12, color: t.t2 }}>{f.action}</span>
                            <span style={{ fontFamily: FB, fontSize: 11, color: f.col, fontWeight: 600 }}>{f.sub}</span>
                        </Col>
                    </Row>
                ))}
            </Col>

            {/* ══════════════════════════════════════════════════
                §10  TECH PULSE NEWS STRIP
                Retained from v1 — keeps higher-intent users
                engaged with industry awareness content.
                Low-effort scroll reward at the very bottom.
            ══════════════════════════════════════════════════ */}
            <Row ai="center" jc="space-between" sx={{ padding: "0 22px 12px" }}>
                <Row ai="center" g={6}>
                    <span style={{ fontFamily: FD, fontWeight: 700, fontSize: 17, color: t.t1 }}>Tech Pulse</span>
                    <span style={{ fontSize: 14 }}>⚡</span>
                </Row>
                <span style={{ fontFamily: FB, fontSize: 12, color: t.orange, fontWeight: 600 }}>More →</span>
            </Row>
            <Col g={10} sx={{ padding: "0 22px" }}>
                {[
                    { h: "Anthropic raises $2B — AI talent demand surges across India", src: "TechCrunch", time: "2h" },
                    { h: "Top 10 skills hiring managers want in 2025 interns",          src: "Forbes",     time: "5h" },
                ].map((n, i) => (
                    <Row key={i} g={12} ai="center" sx={{ padding: "12px 14px", background: t.s2, borderRadius: 16, border: `1px solid ${t.border}`, cursor: "pointer" }}>
                        <div style={{ width: 46, height: 46, borderRadius: 13, background: t.s3, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Svg d={IC.zap} s={20} c={t.orange} />
                        </div>
                        <Col g={4} sx={{ flex: 1 }}>
                            <span style={{ fontFamily: FB, fontWeight: 600, fontSize: 13, color: t.t1, lineHeight: 1.4 }}>{n.h}</span>
                            <Row g={8}>
                                <span style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: t.orange, background: t.orangeLo, padding: "2px 7px", borderRadius: 100 }}>{n.src}</span>
                                <span style={{ fontFamily: FB, fontSize: 10, color: t.t3 }}>{n.time} ago</span>
                            </Row>
                        </Col>
                    </Row>
                ))}
            </Col>

        </Col>
    );
};

export default CareerHome;
