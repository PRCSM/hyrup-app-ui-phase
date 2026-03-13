import { useState } from "react";
import { T, FD, FB } from '../../tokens.js';
import { IC, Svg } from '../../icons.jsx';
import { Row, Col } from '../../helpers.jsx';
import { USERS, weeklyChallenge, FEED_POSTS } from '../../data.js';
import ModeToggle from '../../components/ModeToggle.jsx';
import PostComposer from '../../components/PostComposer.jsx';

/* ═══════════════════════════════════════════════════════════════════════
   SOCIAL HOME — DASHBOARD (V2.1)
   + Story rings row
   + 6 quick cards (2×3 bento)
   + No emoji — SVG icons only
═══════════════════════════════════════════════════════════════════════ */
const SocialHome = ({ mode, onToggle, onNav, addXP, streak = 5 }) => {
    const t = T.s;
    const today = new Date();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const todayIdx = today.getDay();
    const weekActive = [true, true, false, true, true, true, false];
    const [showComposer, setShowComposer] = useState(false);

    const quickCards = [
        { icon: IC.users,  title: "New Connections", desc: "3 suggestions", col: "#2563EB", bg: "#EFF6FF", nav: "connect" },
        { icon: IC.chat,   title: "Active Groups",   desc: "2 groups active", col: "#16A34A", bg: "#E8F8EF", nav: "chat" },
        { icon: IC.trophy, title: "Trending Win",     desc: "Priya placed at Amazon", col: "#9333EA", bg: "#FAF5FF", nav: "feed" },
        { icon: IC.layers, title: "Study Group",      desc: "DSA Prep · 4 online", col: t.orange, bg: t.orangeLo, nav: "chat" },
        { icon: IC.target, title: "Weekly Challenge",  desc: `${Math.round(weeklyChallenge.progress * 100)}% done · ${weeklyChallenge.xp} XP`, col: "#0D9488", bg: "#F0FDFA", nav: null, special: "challenge" },
        { icon: IC.zap,   title: "Placement Readiness", desc: "47% ready", col: t.orange, bg: "rgba(255,87,34,0.08)", nav: null, special: "career" },
    ];

    const previewPosts = FEED_POSTS.slice(0, 2);

    const handleCardTap = (c) => {
        if (c.special === "career") {
            onToggle?.(); // switches to career mode
        } else if (c.nav) {
            onNav?.(c.nav);
        }
    };

    return (
        <Col>
            {/* ── Greeting ── */}
            <div style={{ padding: "10px 22px 16px" }}>
                <Row ai="flex-start" jc="space-between">
                    <Col g={2}>
                        <span style={{ fontFamily: FD, fontWeight: 900, fontSize: 28, color: t.t1, lineHeight: 1.1, letterSpacing: -0.8 }}>
                            Hi <span style={{ color: t.orange }}>Rahul!</span><br />
                            <span style={{ fontFamily: FB, fontWeight: 500, fontSize: 14, color: t.t2, letterSpacing: 0 }}>What are you building today?</span>
                        </span>
                    </Col>
                    <Row g={8} ai="center" sx={{ marginTop: 6 }}>
                        <ModeToggle mode={mode} onToggle={onToggle} />
                        <div style={{ width: 38, height: 38, borderRadius: 14, background: t.s1, border: "none", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: t.shadow, position: "relative" }}>
                            <Svg d={IC.bell} s={17} c={t.t2} />
                            <div style={{ position: "absolute", top: 9, right: 9, width: 7, height: 7, borderRadius: 4, background: t.orange, border: `1.5px solid ${t.s1}` }} />
                        </div>
                    </Row>
                </Row>
            </div>

            {/* ── Story Rings Row ── */}
            <div style={{ paddingLeft: 22, marginBottom: 18, overflowX: "auto" }}>
                <Row g={14}>
                    {/* Add story button */}
                    <Col g={4} ai="center" sx={{ cursor: "pointer" }} onClick={() => setShowComposer(true)}>
                        <div style={{
                            width: 44, height: 44, borderRadius: 22,
                            border: `2px dashed ${t.orange}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <Svg d={IC.plus} s={18} c={t.orange} w={2} />
                        </div>
                        <span style={{ fontFamily: FB, fontSize: 10, color: t.t2, fontWeight: 500 }}>Add</span>
                    </Col>
                    {/* Friend stories */}
                    {USERS.map(u => (
                        <Col key={u.id} g={4} ai="center" sx={{ cursor: "pointer", flexShrink: 0 }}>
                            <div style={{
                                width: 48, height: 48, borderRadius: 24, padding: 2,
                                background: u.online ? `linear-gradient(135deg, ${t.orange}, #FF8A50)` : t.border,
                            }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: 22, background: t.s2,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    border: `2px solid ${t.bg}`,
                                }}>
                                    <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 16, color: t.t1 }}>{u.ch}</span>
                                </div>
                            </div>
                            <span style={{ fontFamily: FB, fontSize: 10, color: t.t2, fontWeight: 500, maxWidth: 48, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "center" }}>
                                {u.name.split(' ')[0]}
                            </span>
                        </Col>
                    ))}
                </Row>
            </div>

            {/* ── Daily Challenge Hero Card ── */}
            <div style={{ margin: "0 22px 18px", borderRadius: 24, padding: "22px 20px", background: t.s1, position: "relative", overflow: "hidden", boxShadow: t.shadow }}>
                <div style={{ position: "absolute", top: -30, right: -20, width: 120, height: 120, borderRadius: "50%", background: t.orangeLo }} />
                <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: t.orangeLo }} />
                <img src="/assets/images/social_hero.png" alt="Daily Challenge" style={{ position: 'absolute', right: -20, bottom: -10, width: 130, objectFit: 'contain', mixBlendMode: 'multiply', opacity: 0.8 }} />
                <Row ai="center" jc="space-between" sx={{ marginBottom: 10, position: 'relative', zIndex: 1 }}>
                    <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, color: t.orange, letterSpacing: 1.5, textTransform: "uppercase" }}>Daily Challenge</span>
                    <Row g={4} ai="center">
                        <Svg d={IC.flame} s={16} c={t.orange} fill={t.orange} w={1.5} />
                        <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 15, color: t.orange }}>{streak} day streak</span>
                    </Row>
                </Row>
                <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 22, color: t.t1, display: "block", marginBottom: 6, lineHeight: 1.2, position: 'relative', zIndex: 1 }}>Share what you built today</span>
                <span style={{ fontFamily: FB, fontSize: 13, color: t.t2, display: "block", marginBottom: 16, position: 'relative', zIndex: 1 }}>Post a project update and keep your streak alive!</span>
                <button onClick={() => setShowComposer(true)} style={{ padding: "10px 24px", borderRadius: 100, background: t.orange, border: "none", fontFamily: FB, fontSize: 13, fontWeight: 800, color: "#fff", cursor: "pointer", boxShadow: "0 4px 14px rgba(250,102,74,0.3)", position: 'relative', zIndex: 1 }}>
                    Create Post
                </button>
            </div>

            {/* ── Week Activity Row ── */}
            <div style={{ margin: "0 22px 18px" }}>
                <span style={{ fontFamily: FB, fontSize: 12, fontWeight: 700, color: t.t2, marginBottom: 10, display: "block" }}>This Week</span>
                <Row g={0} jc="space-between">
                    {dayNames.map((d, i) => {
                        const isToday = i === todayIdx;
                        const active = weekActive[i];
                        return (
                            <Col key={d} g={6} ai="center">
                                <span style={{ fontFamily: FB, fontSize: 10, color: isToday ? t.orange : t.t3, fontWeight: isToday ? 800 : 500 }}>{d}</span>
                                <div style={{
                                    width: 32, height: 32, borderRadius: 10,
                                    background: active ? (isToday ? t.orange : `${t.orange}20`) : t.s2,
                                    border: isToday ? `2px solid ${t.orange}` : `1.5px solid ${active ? `${t.orange}30` : t.border}`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    boxShadow: isToday ? `0 2px 10px ${t.orangeMid}` : "none",
                                }}>
                                    {active && <Svg d={IC.check} s={14} c={isToday ? "#fff" : t.orange} w={2.5} />}
                                </div>
                            </Col>
                        );
                    })}
                </Row>
            </div>

            {/* ── Quick Cards 2×3 ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "0 22px 20px" }}>
                {quickCards.map((c) => (
                    <button key={c.title} onClick={() => handleCardTap(c)} style={{
                        background: t.s1, borderRadius: 24, padding: "16px 14px", border: "none",
                        boxShadow: t.shadow, cursor: "pointer", textAlign: "left",
                    }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                            <Svg d={c.icon} s={20} c={c.col} w={1.8} />
                        </div>
                        <span style={{ fontFamily: FB, fontWeight: 700, fontSize: 13, color: t.t1, display: "block", marginBottom: 2 }}>{c.title}</span>
                        <span style={{ fontFamily: FB, fontSize: 11, color: t.t2 }}>{c.desc}</span>
                        {/* Progress bar for challenge card */}
                        {c.special === "challenge" && (
                            <div style={{ marginTop: 8, height: 4, borderRadius: 2, background: t.s2, overflow: "hidden" }}>
                                <div style={{ width: `${weeklyChallenge.progress * 100}%`, height: "100%", background: c.col, borderRadius: 2 }} />
                            </div>
                        )}
                        {/* Percentage for placement readiness */}
                        {c.special === "career" && (
                            <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 24, color: t.orange, display: "block", marginTop: 4 }}>47%</span>
                        )}
                    </button>
                ))}
            </div>

            {/* ── Feed Preview ── */}
            <div style={{ padding: "0 22px 24px" }}>
                <Row ai="center" jc="space-between" sx={{ marginBottom: 12 }}>
                    <Row g={6} ai="center">
                        <Svg d={IC.flame} s={16} c={t.orange} fill={t.orange} w={0} />
                        <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 18, color: t.t1 }}>Trending Now</span>
                    </Row>
                    <button onClick={() => onNav?.("feed")} style={{ background: "none", border: "none", fontFamily: FB, fontSize: 12, fontWeight: 700, color: t.orange, cursor: "pointer" }}>See All →</button>
                </Row>
                {previewPosts.map((p) => (
                    <div key={p.id} style={{ background: t.s1, borderRadius: 24, padding: 14, marginBottom: 10, border: "none", boxShadow: t.shadow }}>
                        <Row g={10} ai="center">
                            <div style={{ width: 38, height: 38, borderRadius: 19, background: t.orangeLo, border: `2px solid ${t.s1}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 15, color: t.orange }}>{p.user.ch}</span>
                            </div>
                            <Col g={1} sx={{ flex: 1, minWidth: 0 }}>
                                <Row ai="center" jc="space-between">
                                    <span style={{ fontFamily: FB, fontWeight: 700, fontSize: 13, color: t.t1 }}>{p.user.name}</span>
                                    <span style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: t.orange, background: t.orangeLo, padding: "3px 8px", borderRadius: 100 }}>{p.type}</span>
                                </Row>
                                <span style={{ fontFamily: FB, fontSize: 12, color: t.t2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.text}</span>
                            </Col>
                        </Row>
                    </div>
                ))}
            </div>
            <div style={{ height: 16 }} />

            {/* ── Post Composer ── */}
            <PostComposer isOpen={showComposer} onClose={() => setShowComposer(false)} onPost={() => addXP?.(30, "Post Created")} mode={mode} />
        </Col>
    );
};

export default SocialHome;
