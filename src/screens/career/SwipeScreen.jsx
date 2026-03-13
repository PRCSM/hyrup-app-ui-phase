import { useState, useRef } from "react";
import { T, FD, FB } from '../../tokens.js';
import { IC, Svg } from '../../icons.jsx';
import { Row, Col } from '../../helpers.jsx';

/* ═══════════════════════════════════════════════════════════════════════
   SWIPE TO APPLY — Full-screen scrollable card (Bumble-style)

   UX:
   • One job card visible at a time, full-height
   • Card is SCROLLABLE internally — scroll up to see more details
   • Left/right SWIPE on the card → skip / apply (no buttons)
   • Swipe detection only triggers on horizontal drag, vertical = scroll
   • Rich details: company info, role, description, skills,
     experience, job type, mode, salary, and more
═══════════════════════════════════════════════════════════════════════ */
const SwipeScreen = ({ onClose, cards: externalCards, initialIndex = 0, onAction, addXP }) => {
    const t = T.c;

    const CARDS_BUILTIN = [
        {
            role: "Frontend Dev Intern", co: "Zepto", loc: "Remote", pay: "₹15K/mo", match: 94, ch: "Z",
            tags: ["React", "TypeScript", "TailwindCSS"], type: "Internship",
            grad: "linear-gradient(145deg, #1C0D00, #2D1600)", accentGrad: "linear-gradient(90deg,#FF7A1A,#FF9A45)",
            desc: "Build and ship features used by 10M+ users. Fast-paced, high-ownership culture. Strong mentorship from senior engineers.",
            companyDesc: "India's fastest 10-minute delivery app, backed by Y Combinator. 10M+ active users across 100+ cities.",
            experience: "0–1 years", mode: "Remote", jobDuration: "6 months", openings: 3,
            perks: ["Flexible hours", "Mentorship", "PPO opportunity", "MacBook provided"],
            responsibilities: ["Build reusable UI components", "Collaborate with design team", "Write unit tests", "Ship features weekly"],
        },
        {
            role: "UI/UX Designer", co: "Groww", loc: "Bengaluru", pay: "₹20K/mo", match: 88, ch: "G",
            tags: ["Figma", "Prototyping", "Design Systems"], type: "Internship",
            grad: "linear-gradient(145deg, #001A0D, #002E1A)", accentGrad: "linear-gradient(90deg,#22C55E,#4ADE80)",
            desc: "Own end-to-end design for new investor features. Work directly with PMs. Portfolio-building opportunity.",
            companyDesc: "India's leading investment platform. 50M+ users investing in stocks, mutual funds, and digital gold.",
            experience: "0–1 years", mode: "Hybrid (3 days office)", jobDuration: "6 months", openings: 2,
            perks: ["Design team mentorship", "Portfolio building", "Pre-placement offer", "Health insurance"],
            responsibilities: ["Create wireframes & prototypes", "Design user flows", "Conduct usability testing", "Maintain design system"],
        },
        {
            role: "Backend Intern", co: "Razorpay", loc: "Hybrid", pay: "₹25K/mo", match: 91, ch: "R",
            tags: ["Node.js", "MongoDB", "AWS"], type: "Internship",
            grad: "linear-gradient(145deg, #00101A, #001C2E)", accentGrad: "linear-gradient(90deg,#3B82F6,#60A5FA)",
            desc: "Work on payment infrastructure serving 8M+ businesses. Real ownership, real impact. Pre-placement offer possible.",
            companyDesc: "India's biggest payment gateway powering 8M+ businesses. Unicorn valued at $7.5B.",
            experience: "1–2 years", mode: "Hybrid (2 days office)", jobDuration: "6 months", openings: 5,
            perks: ["₹25K stipend", "PPO available", "Free meals", "Gym access", "Health insurance"],
            responsibilities: ["Build payment APIs", "Optimize database queries", "Write integration tests", "On-call rotation"],
        },
        {
            role: "Data Analyst", co: "Meesho", loc: "Noida", pay: "₹12K/mo", match: 79, ch: "M",
            tags: ["Python", "SQL", "Power BI"], type: "Internship",
            grad: "linear-gradient(145deg, #120018, #1E0028)", accentGrad: "linear-gradient(90deg,#A855F7,#C084FC)",
            desc: "Analyze seller and buyer behavior data. Build dashboards used by leadership. Strong data team culture.",
            companyDesc: "Social commerce platform connecting 130M+ users with small businesses across India.",
            experience: "0–1 years", mode: "On-site (Noida office)", jobDuration: "3 months", openings: 2,
            perks: ["Data mentorship", "Leadership exposure", "Certificate", "Cab facility"],
            responsibilities: ["Build dashboards", "Analyze user behavior", "Generate weekly reports", "Identify growth opportunities"],
        },
        {
            role: "Product Intern", co: "CRED", loc: "Bengaluru", pay: "₹22K/mo", match: 86, ch: "C",
            tags: ["Product Thinking", "SQL", "Figma"], type: "Internship",
            grad: "linear-gradient(145deg, #1A1000, #2D1E00)", accentGrad: "linear-gradient(90deg,#F59E0B,#FBBF24)",
            desc: "Define product specs for CRED's rewards engine. Work with design + eng. Weekly reviews with CPO.",
            companyDesc: "Premium credit card rewards platform with $6.4B valuation. Known for design excellence.",
            experience: "0 years (freshers welcome)", mode: "On-site (Bengaluru)", jobDuration: "4 months", openings: 1,
            perks: ["CPO mentorship", "Startup culture", "Free lunches", "CRED coins"],
            responsibilities: ["Write product specs", "Analyze user funnels", "Conduct competitor research", "Present to leadership"],
        },
    ];

    const CARDS = externalCards || CARDS_BUILTIN;

    const [idx, setIdx] = useState(initialIndex);
    const [drag, setDrag] = useState(0);
    const [stamp, setStamp] = useState(null);
    const [applied, setApplied] = useState([]);
    const [skipped, setSkipped] = useState([]);
    const [lastAction, setLastAction] = useState(null);

    /* ── V2.1: Super-save + Skip reason ── */
    const [superSavesUsed, setSuperSavesUsed] = useState(0);
    const [dragY, setDragY] = useState(0);
    const [showSkipReason, setShowSkipReason] = useState(false);
    const [skipTarget, setSkipTarget] = useState(null);

    // Swipe detection refs
    const startX = useRef(0);
    const startY = useRef(0);
    const locked = useRef(null); // null | "horizontal" | "vertical"
    const dragging = useRef(false);

    const done = idx >= CARDS.length;
    const card = done ? null : CARDS[idx];

    const triggerAction = (action) => {
        setStamp(action);
        setTimeout(() => {
            setStamp(null);
            if (onAction) { onAction(action, idx); onClose(); return; }
            if (action === "apply") { setApplied(a => [...a, idx]); addXP?.(25, "Job Applied"); }
            else if (action === "skip") {
                setSkipped(s => [...s, idx]);
                // Show skip reason chips (V2.1)
                setShowSkipReason(true);
                setSkipTarget(idx);
                return; // Don't advance yet — wait for reason selection or dismiss
            } else if (action === "supersave") {
                setSuperSavesUsed(s => s + 1);
            }
            setLastAction({ action, idx });
            setIdx(i => i + 1);
            setDrag(0);
            setDragY(0);
        }, 350);
    };

    const handleUndo = () => {
        if (!lastAction || idx === 0) return;
        setIdx(i => i - 1);
        setApplied(a => a.filter(x => x !== lastAction.idx));
        setSkipped(s => s.filter(x => x !== lastAction.idx));
        setLastAction(null);
    };

    // Smart swipe: detect direction first, then lock to horizontal or vertical
    const onPointerDown = (e) => {
        startX.current = e.clientX;
        startY.current = e.clientY;
        locked.current = null;
        dragging.current = true;
    };
    const onPointerMove = (e) => {
        if (!dragging.current) return;
        const dx = e.clientX - startX.current;
        const dy = e.clientY - startY.current;
        // Lock direction after 8px movement
        if (locked.current === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
            locked.current = Math.abs(dx) > Math.abs(dy) ? "horizontal" : "vertical";
        }
        if (locked.current === "horizontal") {
            e.preventDefault();
            setDrag(dx);
        } else if (locked.current === "vertical" && dy < 0) {
            // Upward drag for super-save
            e.preventDefault();
            setDragY(dy);
        }
    };
    const onPointerUp = () => {
        dragging.current = false;
        if (locked.current === "horizontal") {
            if (drag > 100) triggerAction("apply");
            else if (drag < -100) triggerAction("skip");
            else setDrag(0);
        } else if (locked.current === "vertical" && dragY < -80 && superSavesUsed < 3) {
            // Super-save gesture!
            triggerAction("supersave");
        } else {
            setDragY(0);
        }
        locked.current = null;
    };

    /* ── Info row helper ── */
    const InfoRow = ({ icon, label, value }) => (
        <Row g={10} ai="flex-start" sx={{ padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Svg d={icon} s={14} c="rgba(255,255,255,0.45)" />
            </div>
            <Col g={1} sx={{ flex: 1 }}>
                <span style={{ fontFamily: FB, fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>{label}</span>
                <span style={{ fontFamily: FB, fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{value}</span>
            </Col>
        </Row>
    );

    /* ── Section header helper ── */
    const SectionTitle = ({ children }) => (
        <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 16, color: "#fff", display: "block", marginBottom: 10, marginTop: 20 }}>{children}</span>
    );

    // Result screen
    if (done) {
        return (
            <div style={{ position: "absolute", inset: 0, background: t.bg, zIndex: 100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
                <span style={{ fontFamily: FD, fontWeight: 900, fontSize: 28, color: t.t1, textAlign: "center", marginBottom: 8 }}>Session complete!</span>
                <span style={{ fontFamily: FB, fontSize: 14, color: t.t2, textAlign: "center", marginBottom: 32 }}>You reviewed all {CARDS.length} matched jobs</span>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, width: "100%", marginBottom: 32 }}>
                    {[[applied.length, "Applied", T.c.green], [skipped.length, "Skipped", t.t3]].map(([n, l, col]) => (
                        <div key={l} style={{ background: t.s2, borderRadius: 18, padding: "16px 8px", textAlign: "center" }}>
                            <span style={{ fontFamily: FD, fontWeight: 900, fontSize: 26, color: col, display: "block" }}>{n}</span>
                            <span style={{ fontFamily: FB, fontSize: 11, color: t.t2 }}>{l}</span>
                        </div>
                    ))}
                </div>
                <button onClick={onClose} style={{ width: "100%", height: 50, borderRadius: 16, background: t.orange, border: "none", color: "#fff", fontFamily: FB, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>Back to Home</button>
            </div>
        );
    }

    const swipeDir = drag > 40 ? "apply" : drag < -40 ? "skip" : null;
    const rotation = drag * 0.03;

    return (
        <div style={{ position: "absolute", inset: 0, background: t.bg, zIndex: 100, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Header */}
            <div style={{ padding: "52px 22px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                <button onClick={onClose} style={{ width: 38, height: 38, borderRadius: 12, background: t.s2, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <Svg d={IC.x} s={16} c={t.t2} />
                </button>
                <div style={{ textAlign: "center" }}>
                    <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 16, color: t.t1 }}>Quick Apply</span>
                    <div style={{ fontFamily: FB, fontSize: 11, color: t.t2, marginTop: 1 }}>{idx + 1} of {CARDS.length} matched jobs</div>
                </div>
                <button onClick={handleUndo} disabled={!lastAction} style={{ width: 38, height: 38, borderRadius: 12, background: lastAction ? t.s2 : "transparent", border: `1px solid ${lastAction ? t.border : "transparent"}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: lastAction ? "pointer" : "default", opacity: lastAction ? 1 : 0.3 }}>
                    <Svg d={IC.undo} s={16} c={t.t2} />
                </button>
            </div>

            {/* Progress dots */}
            <div style={{ display: "flex", gap: 5, justifyContent: "center", marginBottom: 10, flexShrink: 0 }}>
                {CARDS.map((_, i) => (
                    <div key={i} style={{ width: i === idx ? 20 : 6, height: 6, borderRadius: 3, background: i < idx ? t.orange : i === idx ? t.orange : t.s3, transition: "all 0.25s ease", opacity: i < idx ? 0.35 : 1 }} />
                ))}
            </div>

            {/* Swipe hint */}
            <div style={{ textAlign: "center", marginBottom: 8, flexShrink: 0 }}>
                <span style={{ fontFamily: FB, fontSize: 11, color: t.t3 }}>← swipe left to skip  ·  swipe right to apply  ·  swipe up to super-save ↑</span>
                {/* Super-save counter */}
                <div style={{ marginTop: 4 }}>
                    <span style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: T.c.gold }}>{3 - superSavesUsed}/3 super saves remaining</span>
                </div>
            </div>

            {/* Card area — takes remaining height */}
            <div style={{ flex: 1, position: "relative", padding: "0 18px 16px", overflow: "hidden" }}>
                {/* Background card for depth */}
                <div style={{ position: "absolute", left: 32, right: 32, top: 4, bottom: 20, borderRadius: 28, background: t.s1, border: `1px solid ${t.border}`, transform: `scale(${0.94 + Math.min(Math.abs(drag) / 1000, 0.04)})`, transition: dragging.current ? "none" : "transform 0.3s ease", zIndex: 0 }} />

                {/* Main card — SCROLLABLE + SWIPEABLE */}
                <div
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerLeave={() => { if (dragging.current) onPointerUp(); }}
                    style={{
                        position: "absolute", left: 18, right: 18, top: 0, bottom: 12,
                        borderRadius: 28, overflow: "hidden",
                        background: card.grad,
                        border: `1px solid ${t.border}`,
                        transform: `translateX(${drag}px) rotate(${rotation}deg)`,
                        transition: dragging.current && locked.current === "horizontal" ? "none" : "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                        cursor: "grab", userSelect: "none",
                        zIndex: 1,
                        boxShadow: swipeDir === "apply"
                            ? `0 0 60px rgba(34,197,94,${Math.min(drag / 200, 0.6)})`
                            : swipeDir === "skip"
                                ? `0 0 60px rgba(239,68,68,${Math.min(-drag / 200, 0.6)})`
                                : "0 20px 60px rgba(0,0,0,0.6)",
                    }}
                >
                    {/* Swipe color overlays */}
                    {drag > 20 && <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, rgba(34,197,94,${Math.min(drag / 300, 0.18)}), transparent)`, borderRadius: 28, pointerEvents: "none", zIndex: 10 }} />}
                    {drag < -20 && <div style={{ position: "absolute", inset: 0, background: `linear-gradient(225deg, rgba(239,68,68,${Math.min(-drag / 300, 0.18)}), transparent)`, borderRadius: 28, pointerEvents: "none", zIndex: 10 }} />}

                    {/* STAMP */}
                    {stamp && (
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20, pointerEvents: "none" }}>
                            <div style={{
                                padding: "12px 28px", borderRadius: 16,
                                border: `4px solid ${stamp === "apply" ? T.c.green : stamp === "supersave" ? T.c.gold : T.c.red}`,
                                transform: `rotate(${stamp === "skip" ? 10 : -10}deg)`,
                                boxShadow: stamp === "supersave" ? `0 0 40px ${T.c.gold}60` : "none",
                            }}>
                                <span style={{
                                    fontFamily: FD, fontWeight: 900, fontSize: stamp === "supersave" ? 22 : 28,
                                    color: stamp === "apply" ? T.c.green : stamp === "supersave" ? T.c.gold : T.c.red,
                                    letterSpacing: 2,
                                }}>
                                    {stamp === "apply" ? "APPLYING ✓" : stamp === "supersave" ? "SUPER SAVED ★" : "SKIPPING ✗"}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* SCROLLABLE CONTENT inside the card */}
                    <div style={{ height: "100%", overflowY: "auto", overflowX: "hidden", touchAction: "pan-y", WebkitOverflowScrolling: "touch" }}>

                        {/* Hero section */}
                        <div style={{ padding: "24px 22px 20px", position: "relative" }}>
                            {/* Glow blob */}
                            <div style={{ position: "absolute", top: -20, right: -20, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,122,26,0.15)", filter: "blur(50px)", pointerEvents: "none" }} />

                            {/* AI match badge */}
                            <div style={{ position: "absolute", top: 20, right: 20, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", borderRadius: 12, padding: "6px 12px", border: "1px solid rgba(255,255,255,0.1)" }}>
                                <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 18, color: "#fff" }}>{card.match}<span style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.5)" }}>%</span></span>
                                <div style={{ fontFamily: FB, fontSize: 9, color: "rgba(255,255,255,0.4)", textAlign: "center" }}>AI Match</div>
                            </div>

                            {/* Type + mode badges */}
                            <Row g={6} sx={{ marginBottom: 16 }}>
                                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, padding: "4px 12px" }}>
                                    <Svg d={IC.brief} s={11} c="rgba(255,255,255,0.5)" />
                                    <span style={{ fontFamily: FB, fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{card.type}</span>
                                </div>
                                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, padding: "4px 12px" }}>
                                    <Svg d={IC.loc} s={11} c="rgba(255,255,255,0.5)" />
                                    <span style={{ fontFamily: FB, fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{card.mode || card.loc}</span>
                                </div>
                            </Row>

                            {/* Company logo */}
                            <div style={{ width: 64, height: 64, borderRadius: 20, background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                                <span style={{ fontFamily: FD, fontWeight: 900, fontSize: 26, color: "#fff" }}>{card.ch}</span>
                            </div>

                            {/* Role & company */}
                            <div style={{ fontFamily: FD, fontWeight: 900, fontSize: 24, color: "#fff", lineHeight: 1.2, marginBottom: 4 }}>{card.role}</div>
                            <div style={{ fontFamily: FB, fontSize: 14, color: "rgba(255,255,255,0.55)", marginBottom: 12 }}>{card.co}  ·  {card.loc}</div>

                            {/* Description */}
                            <p style={{ fontFamily: FB, fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.65, margin: 0 }}>{card.desc}</p>
                        </div>

                        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 22px" }} />

                        {/* Stipend / Salary */}
                        <div style={{ padding: "16px 22px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "12px 14px" }}>
                                <Svg d={IC.zap} s={16} c={t.orange} />
                                <div>
                                    <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 20, color: "#fff" }}>{card.pay}</span>
                                    <span style={{ fontFamily: FB, fontSize: 11, color: "rgba(255,255,255,0.35)", marginLeft: 6 }}>stipend · {card.jobDuration || "up to 6 months"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Skills Required */}
                        <div style={{ padding: "0 22px 16px" }}>
                            <SectionTitle>Skills Required</SectionTitle>
                            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                                {card.tags.map(tg => (
                                    <span key={tg} style={{ fontFamily: FB, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", padding: "6px 14px", borderRadius: 100 }}>{tg}</span>
                                ))}
                            </div>
                        </div>

                        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 22px" }} />

                        {/* Job Details grid */}
                        <div style={{ padding: "0 22px" }}>
                            <SectionTitle>Job Details</SectionTitle>
                            <InfoRow icon={IC.brief} label="Job Type" value={card.type} />
                            <InfoRow icon={IC.loc} label="Work Mode" value={card.mode || card.loc} />
                            <InfoRow icon={IC.clock} label="Duration" value={card.jobDuration || "6 months"} />
                            <InfoRow icon={IC.users} label="Experience" value={card.experience || "Freshers welcome"} />
                            <InfoRow icon={IC.check} label="Openings" value={`${card.openings || 2} positions`} />
                        </div>

                        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "16px 22px 0" }} />

                        {/* About Company */}
                        <div style={{ padding: "0 22px" }}>
                            <SectionTitle>About {card.co}</SectionTitle>
                            <p style={{ fontFamily: FB, fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.65, margin: 0 }}>{card.companyDesc || card.desc}</p>
                        </div>

                        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "16px 22px 0" }} />

                        {/* Responsibilities */}
                        {card.responsibilities && (
                            <div style={{ padding: "0 22px" }}>
                                <SectionTitle>Responsibilities</SectionTitle>
                                {card.responsibilities.map((r, i) => (
                                    <Row key={i} g={8} ai="flex-start" sx={{ marginBottom: 8 }}>
                                        <span style={{ fontFamily: FB, fontSize: 12, color: t.orange, marginTop: 2 }}>▸</span>
                                        <span style={{ fontFamily: FB, fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{r}</span>
                                    </Row>
                                ))}
                            </div>
                        )}

                        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "16px 22px 0" }} />

                        {/* Perks */}
                        {card.perks && (
                            <div style={{ padding: "0 22px 24px" }}>
                                <SectionTitle>Perks & Benefits</SectionTitle>
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                    {card.perks.map(p => (
                                        <span key={p} style={{
                                            fontFamily: FB, fontSize: 12, fontWeight: 600,
                                            color: "rgba(255,255,255,0.6)",
                                            background: "rgba(34,197,94,0.08)",
                                            border: "1px solid rgba(34,197,94,0.15)",
                                            padding: "6px 14px", borderRadius: 100,
                                        }}>✓ {p}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Scroll spacer */}
                        <div style={{ height: 40 }} />
                    </div>
                </div>

                {/* Directional hint labels — outside card */}
                {drag > 40 && (
                    <div style={{ position: "absolute", left: 30, top: "40%", transform: "rotate(-15deg)", opacity: Math.min((drag - 40) / 60, 1), zIndex: 5 }}>
                        <div style={{ padding: "8px 20px", border: `3px solid ${T.c.green}`, borderRadius: 12, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
                            <span style={{ fontFamily: FD, fontWeight: 900, fontSize: 22, color: T.c.green, letterSpacing: 2 }}>APPLY ✓</span>
                        </div>
                    </div>
                )}
                {drag < -40 && (
                    <div style={{ position: "absolute", right: 30, top: "40%", transform: "rotate(15deg)", opacity: Math.min((-drag - 40) / 60, 1), zIndex: 5 }}>
                        <div style={{ padding: "8px 20px", border: `3px solid ${T.c.red}`, borderRadius: 12, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
                            <span style={{ fontFamily: FD, fontWeight: 900, fontSize: 22, color: T.c.red, letterSpacing: 2 }}>SKIP ✗</span>
                        </div>
                    </div>
                )}
            </div>

            {/* === SKIP REASON CHIPS (V2.1) === */}
            {showSkipReason && (
                <div style={{
                    position: "absolute", inset: 0, zIndex: 110,
                    background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    padding: 24,
                }}>
                    <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 18, color: "#fff", marginBottom: 6 }}>Why skip?</span>
                    <span style={{ fontFamily: FB, fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>Optional — helps improve your matches</span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 24 }}>
                        {["Not my domain", "Salary too low", "Bad location", "Already applied", "Other"].map(reason => (
                            <button key={reason} onClick={() => {
                                setShowSkipReason(false);
                                setLastAction({ action: "skip", idx: skipTarget });
                                setIdx(i => i + 1);
                                setDrag(0); setDragY(0);
                            }} style={{
                                padding: "10px 18px", borderRadius: 100,
                                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                                color: "#fff", fontFamily: FB, fontSize: 13, fontWeight: 600, cursor: "pointer",
                            }}>{reason}</button>
                        ))}
                    </div>
                    <button onClick={() => {
                        setShowSkipReason(false);
                        setLastAction({ action: "skip", idx: skipTarget });
                        setIdx(i => i + 1);
                        setDrag(0); setDragY(0);
                    }} style={{
                        background: "none", border: "none", color: "rgba(255,255,255,0.4)",
                        fontFamily: FB, fontSize: 13, cursor: "pointer",
                    }}>Skip without feedback</button>
                </div>
            )}
        </div>
    );
};

export default SwipeScreen;
