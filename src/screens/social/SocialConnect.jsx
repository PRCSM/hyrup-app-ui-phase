import { useState, useRef } from "react";
import { T, FD, FB } from '../../tokens.js';
import { IC, Svg, HyruMascot } from '../../icons.jsx';
import { Row, Col } from '../../helpers.jsx';
import { roadmapUsers, USERS } from '../../data.js';
import ModeToggle from '../../components/ModeToggle.jsx';

/* ═══════════════════════════════════════════════════════════════════════
   SOCIAL CONNECT — V2.1 (4 tabs: Suggested, Requests, Nearby, Same Path)
═══════════════════════════════════════════════════════════════════════ */
const SocialConnect = ({ mode, onToggle }) => {
    const t = T.s;
    const [tab, setTab] = useState("Suggested");
    const [cardIdx, setCardIdx] = useState(0);
    const [dragX, setDragX] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [swipeAction, setSwipeAction] = useState(null);
    const [exitAnim, setExitAnim] = useState(null);
    const startX = useRef(0);

    /* ── Nearby state ── */
    const [nearbyView, setNearbyView] = useState("Map");
    const [selectedPin, setSelectedPin] = useState(null);
    const [openForStudy, setOpenForStudy] = useState(false);
    const [nearbyRange, setNearbyRange] = useState("10km");

    const users = [
        { n: "Sneha R.", college: "Amity Noida", ch: "S", skills: ["UI/UX", "Figma", "Prototyping"], xp: "Lv 8", why: "Same domain", sCol: "#9333EA", sBg: "#FAF5FF" },
        { n: "Kiran B.", college: "LPU Punjab", ch: "K", skills: ["Full Stack", "React", "Node.js"], xp: "Lv 12", why: "Same city", sCol: "#2563EB", sBg: "#EFF6FF" },
        { n: "Ananya T.", college: "SRM Chennai", ch: "A", skills: ["ML", "Python", "TensorFlow"], xp: "Lv 6", why: "3 mutual friends", sCol: "#16A34A", sBg: "#E8F8EF" },
        { n: "Rohan P.", college: "BITS Pilani", ch: "R", skills: ["DevOps", "AWS", "Docker"], xp: "Lv 10", why: "Complementary skills", sCol: t.orange, sBg: t.orangeLo },
    ];

    const current = users[cardIdx % users.length];

    /* ── Swipe handlers (unchanged) ── */
    const onPointerDown = (e) => { startX.current = e.clientX; setDragging(true); setSwipeAction(null); };
    const onPointerMove = (e) => {
        if (!dragging) return;
        const dx = e.clientX - startX.current;
        setDragX(dx);
        if (dx > 50) setSwipeAction("connect");
        else if (dx < -50) setSwipeAction("skip");
        else setSwipeAction(null);
    };
    const onPointerUp = () => {
        setDragging(false);
        if (Math.abs(dragX) > 90) {
            const dir = dragX > 0 ? "right" : "left";
            setExitAnim(dir);
            setTimeout(() => { setCardIdx(i => i + 1); setExitAnim(null); setSwipeAction(null); }, 250);
        }
        setDragX(0);
    };
    const handleButton = (dir) => {
        setExitAnim(dir);
        setTimeout(() => { setCardIdx(i => i + 1); setExitAnim(null); }, 250);
    };
    const getCardTransform = () => {
        if (exitAnim === "right") return "translateX(120%) rotate(15deg)";
        if (exitAnim === "left") return "translateX(-120%) rotate(-15deg)";
        return `translateX(${dragX}px) rotate(${dragX * 0.04}deg)`;
    };

    /* ── Map pin positions ── */
    const mapPins = [
        { user: USERS[0], x: "25%", y: "35%" },
        { user: USERS[1], x: "60%", y: "25%" },
        { user: USERS[2], x: "45%", y: "60%" },
        { user: USERS[3], x: "70%", y: "50%" },
        { user: USERS[4], x: "30%", y: "70%" },
    ];

    const tabs = ["Suggested", "Requests", "Nearby", "Same Path"];

    return (
        <Col sx={{ height: "100%" }}>
            <div style={{ padding: "10px 22px 14px" }}>
                <Row ai="flex-start" jc="space-between" sx={{ marginBottom: 14 }}>
                    <Col g={2}>
                        <span style={{ fontFamily: FD, fontWeight: 900, fontSize: 24, color: t.t1, lineHeight: 1.1 }}>Find your<br /><span style={{ color: t.orange }}>Tribe</span></span>
                    </Col>
                    <ModeToggle mode={mode} onToggle={onToggle} />
                </Row>
                {/* ── 4-tab bar ── */}
                <Row g={6}>
                    {tabs.map(tb => (
                        <button key={tb} onClick={() => setTab(tb)} style={{
                            flex: 1, height: 36, borderRadius: 100, padding: "0 4px",
                            background: tab === tb ? t.t1 : t.s1, border: `1.5px solid ${tab === tb ? t.t1 : t.border}`,
                            color: tab === tb ? t.bg : t.t2, fontFamily: FB, fontSize: 11, fontWeight: 700, cursor: "pointer",
                            boxShadow: tab === tb ? "0 4px 14px rgba(0,0,0,0.12)" : "none", whiteSpace: "nowrap",
                        }}>{tb}{tb === "Requests" ? " (2)" : ""}</button>
                    ))}
                </Row>
            </div>

            {/* ═══ TAB: SUGGESTED (unchanged) ═══ */}
            {tab === "Suggested" && (
                <div style={{ flex: 1, position: "relative", margin: "8px 22px 0", overflow: "hidden" }}>
                    <div style={{ position: "absolute", inset: 0, borderRadius: 24, background: "#222", transform: "scale(0.94) translateY(8px)", opacity: 0.3 }} />
                    <div
                        onPointerDown={onPointerDown} onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp} onPointerLeave={() => { if (dragging) onPointerUp(); }}
                        style={{
                            position: "absolute", inset: 0, borderRadius: 24, overflow: "hidden",
                            boxShadow: "0 12px 48px rgba(0,0,0,0.2)", transform: getCardTransform(),
                            transition: dragging ? "none" : "transform 0.25s ease",
                            cursor: "grab", userSelect: "none", touchAction: "none",
                            background: `linear-gradient(145deg, ${current.sBg}, ${t.s3})`,
                        }}
                    >
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60%", background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)" }} />
                        {/* Avatar in card center */}
                        <div style={{ position: "absolute", top: "28%", left: "50%", transform: "translateX(-50%)", width: 80, height: 80, borderRadius: 40, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontFamily: FD, fontWeight: 900, fontSize: 36, color: "#fff" }}>{current.ch}</span>
                        </div>
                        {swipeAction === "connect" && (
                            <div style={{ position: "absolute", top: 30, left: 20, zIndex: 5, padding: "8px 20px", borderRadius: 14, background: "rgba(22,163,74,0.8)", backdropFilter: "blur(8px)" }}>
                                <span style={{ fontFamily: FB, fontWeight: 800, fontSize: 16, color: "#fff" }}>Connect</span>
                            </div>
                        )}
                        {swipeAction === "skip" && (
                            <div style={{ position: "absolute", top: 30, right: 20, zIndex: 5, padding: "8px 20px", borderRadius: 14, background: "rgba(220,38,38,0.8)", backdropFilter: "blur(8px)" }}>
                                <span style={{ fontFamily: FB, fontWeight: 800, fontSize: 16, color: "#fff" }}>Skip</span>
                            </div>
                        )}
                        <div style={{ position: "absolute", top: 16, left: 16, zIndex: 3 }}>
                            <span style={{ fontFamily: FB, fontSize: 12, fontWeight: 700, color: "#fff", background: "rgba(255,255,255,0.18)", backdropFilter: "blur(10px)", padding: "6px 14px", borderRadius: 100 }}>
                                <Svg d={IC.spark} s={10} c="#fff" w={1.5} /> {current.why}
                            </span>
                        </div>
                        <div style={{ position: "absolute", top: 16, right: 16, zIndex: 3 }}>
                            <span style={{ fontFamily: FB, fontSize: 12, fontWeight: 800, color: "#fff", background: "rgba(22,163,74,0.7)", backdropFilter: "blur(10px)", padding: "6px 14px", borderRadius: 100 }}>{current.xp}</span>
                        </div>
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 18px 18px", zIndex: 3 }}>
                            <Row g={5} ai="center" sx={{ marginBottom: 6 }}>
                                <Svg d={IC.loc} s={12} c="rgba(255,255,255,0.7)" w={1.5} />
                                <span style={{ fontFamily: FB, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{current.college}</span>
                            </Row>
                            <span style={{ fontFamily: FD, fontWeight: 900, fontSize: 26, color: "#fff", display: "block", marginBottom: 10, letterSpacing: -0.5, lineHeight: 1.1 }}>{current.n}</span>
                            <Row g={6} sx={{ flexWrap: "wrap" }}>
                                {current.skills.map(s => (
                                    <span key={s} style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, color: "#fff", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", padding: "5px 12px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.12)" }}>{s}</span>
                                ))}
                            </Row>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ TAB: REQUESTS (unchanged) ═══ */}
            {tab === "Requests" && (
                <Col sx={{ padding: "12px 22px 24px" }} g={10}>
                    <span style={{ fontFamily: FB, fontSize: 13, color: t.t2, marginBottom: 4 }}>2 pending requests</span>
                    {[{ n: "Amit S.", info: "KIIT · Backend Dev · Lv 9" }, { n: "Nisha P.", info: "BIT · Data Science · Lv 6" }].map((u, i) => (
                        <Row key={i} g={12} ai="center" sx={{ background: t.s1, borderRadius: 24, padding: 14, border: "none", boxShadow: t.shadow }}>
                            <div style={{ width: 50, height: 50, borderRadius: 17, background: t.s2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <span style={{ fontFamily: FD, fontWeight: 900, fontSize: 20, color: t.t1 }}>{u.n[0]}</span>
                            </div>
                            <Col g={2} sx={{ flex: 1 }}>
                                <span style={{ fontFamily: FB, fontWeight: 700, fontSize: 14, color: t.t1 }}>{u.n}</span>
                                <span style={{ fontFamily: FB, fontSize: 12, color: t.t2 }}>{u.info}</span>
                            </Col>
                            <Row g={8}>
                                <button style={{ width: 40, height: 40, borderRadius: 12, background: "#E8F8EF", border: "1px solid #BBF7D0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                                    <Svg d={IC.check} s={16} c={T.c.green} w={2.5} />
                                </button>
                                <button style={{ width: 40, height: 40, borderRadius: 12, background: "#FFF1F0", border: "1px solid #FECACA", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                                    <Svg d={IC.x} s={16} c={T.c.red} w={2.5} />
                                </button>
                            </Row>
                        </Row>
                    ))}
                </Col>
            )}

            {/* ═══ TAB: NEARBY — Map + List toggle (V2.1) ═══ */}
            {tab === "Nearby" && (
                <Col sx={{ padding: "12px 22px 24px", flex: 1 }} g={12}>
                    {/* Map / List toggle */}
                    <Row g={0} sx={{ background: t.s2, borderRadius: 100, padding: 3, width: 140, alignSelf: "flex-start" }}>
                        {["Map", "List"].map(v => (
                            <button key={v} onClick={() => setNearbyView(v)} style={{
                                flex: 1, height: 30, borderRadius: 100, border: "none", cursor: "pointer",
                                background: nearbyView === v ? t.t1 : "transparent",
                                color: nearbyView === v ? t.bg : t.t2,
                                fontFamily: FB, fontSize: 12, fontWeight: 700,
                            }}>{v}</button>
                        ))}
                    </Row>

                    {/* Open for Study toggle */}
                    <Row g={10} ai="center" sx={{ background: openForStudy ? "#E8F8EF" : t.s2, borderRadius: 14, padding: "10px 14px", border: `1px solid ${openForStudy ? "#BBF7D0" : t.border}` }}>
                        <div onClick={() => setOpenForStudy(!openForStudy)} style={{
                            width: 40, height: 22, borderRadius: 11, cursor: "pointer",
                            background: openForStudy ? T.s.green : t.s3, position: "relative", transition: "background 0.2s",
                        }}>
                            <div style={{
                                width: 18, height: 18, borderRadius: 9, background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                                position: "absolute", top: 2, left: openForStudy ? 20 : 2, transition: "left 0.2s",
                            }} />
                        </div>
                        <Col g={1} sx={{ flex: 1 }}>
                            <span style={{ fontFamily: FB, fontWeight: 600, fontSize: 13, color: t.t1 }}>Open for Study</span>
                            <span style={{ fontFamily: FB, fontSize: 11, color: t.t2 }}>{openForStudy ? "Visible on map for 4 hours" : "Set yourself as available to meet"}</span>
                        </Col>
                        {openForStudy && (
                            <div style={{ width: 8, height: 8, borderRadius: 4, background: T.s.green, boxShadow: `0 0 8px ${T.s.green}` }}>
                                <style>{`@keyframes pulseDot { 0%,100% { opacity:1 } 50% { opacity:0.4 } } `}</style>
                            </div>
                        )}
                    </Row>

                    {/* Range filter */}
                    <Row g={8}>
                        {["10km", "50km", "100km"].map(r => (
                            <button key={r} onClick={() => setNearbyRange(r)} style={{
                                flex: 1, height: 36, borderRadius: 100, cursor: "pointer",
                                background: nearbyRange === r ? t.t1 : t.s1, border: `1.5px solid ${nearbyRange === r ? t.t1 : t.border}`,
                                color: nearbyRange === r ? t.bg : t.t2, fontFamily: FB, fontSize: 12, fontWeight: 800,
                            }}>{r}</button>
                        ))}
                    </Row>

                    {nearbyView === "Map" ? (
                        /* ── MAP VIEW ── */
                        <div style={{ flex: 1, position: "relative", borderRadius: 20, overflow: "hidden", background: "#EDE9E3", minHeight: 280, border: `1px solid ${t.border}` }}>
                            {/* Grid lines */}
                            {[20, 40, 60, 80].map(p => (
                                <div key={`h${p}`} style={{ position: "absolute", left: 0, right: 0, top: `${p}%`, height: 1, background: "rgba(0,0,0,0.06)" }} />
                            ))}
                            {[25, 50, 75].map(p => (
                                <div key={`v${p}`} style={{ position: "absolute", top: 0, bottom: 0, left: `${p}%`, width: 1, background: "rgba(0,0,0,0.06)" }} />
                            ))}
                            {/* Some "road" lines */}
                            <div style={{ position: "absolute", left: "10%", right: "10%", top: "45%", height: 3, background: "rgba(0,0,0,0.08)", borderRadius: 2 }} />
                            <div style={{ position: "absolute", top: "15%", bottom: "15%", left: "50%", width: 3, background: "rgba(0,0,0,0.08)", borderRadius: 2 }} />

                            {/* Photo pins */}
                            {mapPins.map((pin, i) => (
                                <div key={i} onClick={() => setSelectedPin(pin.user)}
                                    style={{
                                        position: "absolute", left: pin.x, top: pin.y, transform: "translate(-50%, -50%)",
                                        width: 42, height: 42, borderRadius: 21, cursor: "pointer",
                                        border: `3px solid ${pin.user.online ? t.orange : t.border}`,
                                        background: t.s2, display: "flex", alignItems: "center", justifyContent: "center",
                                        boxShadow: pin.user.online ? `0 0 12px ${t.orange}40` : "0 2px 8px rgba(0,0,0,0.15)",
                                        zIndex: selectedPin?.id === pin.user.id ? 10 : 1,
                                    }}>
                                    <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 16, color: t.t1 }}>{pin.user.ch}</span>
                                </div>
                            ))}

                            {/* Right-side controls */}
                            <Col g={6} sx={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", zIndex: 5 }}>
                                {[IC.layers, IC.plus, IC.minus, IC.locate].map((ic, i) => (
                                    <button key={i} style={{
                                        width: 36, height: 36, borderRadius: 10, background: "#fff", border: `1px solid ${t.border}`,
                                        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                    }}>
                                        <Svg d={ic} s={16} c={t.t2} w={1.6} />
                                    </button>
                                ))}
                            </Col>

                            {/* My location dot */}
                            <div style={{ position: "absolute", left: "50%", top: "45%", transform: "translate(-50%, -50%)", zIndex: 3 }}>
                                <div style={{ width: 14, height: 14, borderRadius: 7, background: t.orange, border: "3px solid #fff", boxShadow: `0 0 12px ${t.orange}60` }} />
                            </div>
                        </div>
                    ) : (
                        /* ── LIST VIEW ── */
                        <Col g={8}>
                            {[
                                { n: "Ravi K.", dist: "2.3 km", college: "GGSIPU", domain: "DevOps", ch: "R" },
                                { n: "Meena S.", dist: "4.8 km", college: "Jamia", domain: "Android Dev", ch: "M" },
                            ].map((u, i) => (
                                <Row key={i} g={12} ai="center" sx={{ background: t.s1, borderRadius: 24, padding: 14, margin: "0 22px", border: "none", boxShadow: t.shadow }}>
                                    <div style={{ width: 50, height: 50, borderRadius: 17, background: t.orangeLo, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <span style={{ fontFamily: FD, fontWeight: 900, fontSize: 20, color: t.orange }}>{u.ch}</span>
                                    </div>
                                    <Col g={2} sx={{ flex: 1 }}>
                                        <span style={{ fontFamily: FB, fontWeight: 700, fontSize: 14, color: t.t1 }}>{u.n}</span>
                                        <span style={{ fontFamily: FB, fontSize: 12, color: t.t2 }}>{u.college} · {u.domain}</span>
                                    </Col>
                                    <Col g={5} ai="flex-end">
                                        <Row g={4} ai="center"><Svg d={IC.mapPin} s={12} c={t.orange} w={1.5} /><span style={{ fontFamily: FB, fontSize: 11, color: t.orange, fontWeight: 700 }}>{u.dist}</span></Row>
                                        <button style={{ padding: "6px 14px", borderRadius: 100, background: t.t1, border: "none", color: t.bg, fontFamily: FB, fontSize: 11, fontWeight: 800, cursor: "pointer" }}>Connect</button>
                                    </Col>
                                </Row>
                            ))}
                        </Col>
                    )}

                    {/* ── Bottom sheet when pin selected ── */}
                    {selectedPin && nearbyView === "Map" && (
                        <div style={{
                            position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 20,
                            background: t.s1, borderRadius: "20px 20px 0 0", padding: "16px 22px 24px",
                            boxShadow: "0 -8px 32px rgba(0,0,0,0.12)",
                            animation: "bottomSheetUp 0.35s cubic-bezier(0.22,1,0.36,1)",
                        }}>
                            <style>{`@keyframes bottomSheetUp { from { transform: translateY(100%) } to { transform: translateY(0) } }`}</style>
                            <div onClick={() => setSelectedPin(null)} style={{ width: 36, height: 4, borderRadius: 2, background: t.s3, margin: "0 auto 14px", cursor: "pointer" }} />
                            <Row g={12} ai="center">
                                <div style={{ width: 52, height: 52, borderRadius: 17, background: t.s2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <span style={{ fontFamily: FD, fontWeight: 900, fontSize: 22, color: t.t1 }}>{selectedPin.ch}</span>
                                </div>
                                <Col g={2} sx={{ flex: 1 }}>
                                    <span style={{ fontFamily: FB, fontWeight: 700, fontSize: 15, color: t.t1 }}>{selectedPin.name}</span>
                                    <span style={{ fontFamily: FB, fontSize: 12, color: t.t2 }}>{selectedPin.college}</span>
                                </Col>
                            </Row>
                            <Row g={6} sx={{ marginTop: 10, flexWrap: "wrap" }}>
                                {selectedPin.skills.map(s => (
                                    <span key={s} style={{ fontFamily: FB, fontSize: 11, fontWeight: 600, color: t.t2, background: t.s2, padding: "4px 10px", borderRadius: 100, border: `1px solid ${t.border}` }}>{s}</span>
                                ))}
                            </Row>
                            <Row g={8} sx={{ marginTop: 14 }}>
                                <button style={{ flex: 1, height: 40, borderRadius: 14, background: t.orange, border: "none", color: "#fff", fontFamily: FB, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Message</button>
                                <button style={{ flex: 1, height: 40, borderRadius: 14, background: t.s2, border: `1px solid ${t.border}`, color: t.t1, fontFamily: FB, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                                    <Svg d={IC.coffee} s={14} c={t.t1} w={1.6} /> Coffee Chat
                                </button>
                            </Row>
                        </div>
                    )}
                </Col>
            )}

            {/* ═══ TAB: SAME PATH (NEW V2.1) ═══ */}
            {tab === "Same Path" && (
                <Col sx={{ padding: "12px 22px 24px" }} g={12}>
                    <Col g={4} sx={{ marginBottom: 4 }}>
                        <span style={{ fontFamily: FB, fontWeight: 700, fontSize: 14, color: t.t1 }}>People on the same roadmap as you</span>
                        <span style={{ fontFamily: FB, fontSize: 12, color: t.t2 }}>Your goal: Frontend Dev · Product Startup · July 2026</span>
                    </Col>

                    {roadmapUsers.length > 0 ? (
                        roadmapUsers.map(u => (
                            <div key={u.id} style={{ background: t.s1, borderRadius: 24, padding: 16, border: "none", boxShadow: t.shadow }}>
                                <Row g={12} ai="center" sx={{ marginBottom: 10 }}>
                                    <div style={{ width: 48, height: 48, borderRadius: 16, background: "#4F46E510", border: "2px solid #4F46E530", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <span style={{ fontFamily: FD, fontWeight: 900, fontSize: 20, color: "#4F46E5" }}>{u.ch}</span>
                                    </div>
                                    <Col g={2} sx={{ flex: 1 }}>
                                        <span style={{ fontFamily: FB, fontWeight: 700, fontSize: 14, color: t.t1 }}>{u.name}</span>
                                        <span style={{ fontFamily: FB, fontSize: 12, color: t.t2 }}>{u.college}</span>
                                    </Col>
                                    <div style={{ background: "#4F46E510", border: "1px solid #4F46E525", borderRadius: 100, padding: "4px 10px" }}>
                                        <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 14, color: "#4F46E5" }}>{u.match}%</span>
                                    </div>
                                </Row>
                                <Row g={6} sx={{ marginBottom: 10 }}>
                                    <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 600, color: t.t2, background: t.s2, padding: "4px 10px", borderRadius: 100 }}>{u.goal}</span>
                                    {u.skills.map(s => (
                                        <span key={s} style={{ fontFamily: FB, fontSize: 11, color: t.t2, background: t.s2, padding: "4px 10px", borderRadius: 100, border: `1px solid ${t.border}` }}>{s}</span>
                                    ))}
                                </Row>
                                <Row g={8}>
                                    <button style={{ flex: 1, height: 38, borderRadius: 100, background: t.t1, border: "none", color: t.bg, fontFamily: FB, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Connect</button>
                                    <button style={{ flex: 1, height: 38, borderRadius: 100, background: "transparent", border: `1.5px solid #4F46E5`, color: "#4F46E5", fontFamily: FB, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Study Together</button>
                                </Row>
                            </div>
                        ))
                    ) : (
                        /* ── Empty state ── */
                        <div style={{ textAlign: "center", padding: "40px 20px" }}>
                            <HyruMascot variant="pointing" size={80} />
                            <p style={{ fontFamily: FB, fontSize: 14, color: t.t2, marginTop: 16, lineHeight: 1.6 }}>
                                Set your career goal in Career mode to unlock this tab
                            </p>
                        </div>
                    )}
                </Col>
            )}

            {/* ── Bottom action buttons (Suggested tab only) ── */}
            {tab === "Suggested" && (
                <Row g={16} jc="center" sx={{ padding: "10px 22px 8px" }}>
                    <button onClick={() => handleButton("left")} style={{
                        width: 56, height: 56, borderRadius: 28, background: "rgba(220,38,38,0.1)", border: "2px solid rgba(220,38,38,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                    }}>
                        <Svg d={IC.x} s={22} c="#DC2626" w={2.5} />
                    </button>
                    <button onClick={() => handleButton("right")} style={{
                        width: 56, height: 56, borderRadius: 28, background: "rgba(22,163,74,0.1)", border: "2px solid rgba(22,163,74,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                    }}>
                        <Svg d={IC.check} s={22} c="#16A34A" w={2.5} />
                    </button>
                </Row>
            )}
        </Col>
    );
};

export default SocialConnect;
