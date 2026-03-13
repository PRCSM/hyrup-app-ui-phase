import { useState, useRef, useEffect, useCallback } from "react";
import { T, FD, FB } from '../../tokens.js';
import { IC, Svg } from '../../icons.jsx';
import { Row, Col } from '../../helpers.jsx';
import { ALL_JOBS, applyFilters } from '../../data.js';
import ModeToggle from '../../components/ModeToggle.jsx';
import SwipeScreen from './SwipeScreen.jsx';
import FilterPanel from './FilterPanel.jsx';
import AcceptedRejectedJobModal from './AcceptedRejectedJobModal.jsx';
import TeamFormation from '../../components/TeamFormation.jsx';

/* ═══════════════════════════════════════════════════════════════════
   ANIMATION CONSTANTS — card stack layer switching
═══════════════════════════════════════════════════════════════════ */
const ANIM_MS = 380;
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_IN = "cubic-bezier(0.55, 0, 1, 0.45)";

/* ── CAREER JOBS ── */
const CareerJobs = ({
    mode, onToggle,
    activeJobs, acceptedJobs, rejectedJobs, bookmarkedIds, hackathons,
    moveJob, toggleBookmark,
}) => {
    const t = T.c;
    const [filters, setFilters] = useState({ jobType: null, location: null, salaryMin: null, status: "all" });
    const [showFilters, setShowFilters] = useState(false);
    const [showSaved, setShowSaved] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [bmarkFlash, setBmarkFlash] = useState(null);
    const [actionFlash, setActionFlash] = useState(null);
    const [modalJob, setModalJob] = useState(null);
    const [modalStatus, setModalStatus] = useState(null);
    const [teamFormationHack, setTeamFormationHack] = useState(null);

    /* ═══════════════════════════════════════════════════════════════════
       HACKATHON TOGGLE — boolean + animation phase

       isHackathonView : which view is logically "current"
       animPhase       : "idle" | "exit" | "enter"

       Flow on toggle click:
       1. idle → set phase "exit"  (outgoing pops up, slides out, fades)
       2. After ANIM_MS → flip isHackathonView, set phase "enter"
       3. After rAF → "enter" CSS kicks in (incoming scales up, pops in)
       4. After ANIM_MS → phase "idle" (transforms reset, clean state)
    ═══════════════════════════════════════════════════════════════════ */
    const [isHackathonView, setIsHackathonView] = useState(false);
    const [animPhase, setAnimPhase] = useState("idle"); // "idle" | "exit" | "enter"
    const animTimer = useRef(null);

    const handleToggleView = useCallback(() => {
        if (animPhase !== "idle") return; // prevent double-click during animation
        setShowSaved(false);

        // Phase 1: EXIT — outgoing container animates out
        setAnimPhase("exit");

        animTimer.current = setTimeout(() => {
            // Phase 2: Flip view + ENTER — incoming container animates in
            setIsHackathonView(prev => !prev);
            setAnimPhase("enter");

            // Need rAF so the browser paints the "enter-start" state
            // before transitioning to "enter-end"
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    animTimer.current = setTimeout(() => {
                        setAnimPhase("idle");
                    }, ANIM_MS);
                });
            });
        }, ANIM_MS);
    }, [animPhase]);

    // Cleanup on unmount
    useEffect(() => () => clearTimeout(animTimer.current), []);

    /* ── Animation style builders ── */
    const getContainerStyle = (isVisible) => {
        const base = {
            transition: `transform ${ANIM_MS}ms ${EASE_OUT}, opacity ${ANIM_MS}ms ${EASE_OUT}`,
            transformOrigin: "center top",
            willChange: "transform, opacity",
        };

        if (animPhase === "idle") {
            return isVisible
                ? { ...base, opacity: 1, transform: "scale(1) translateX(0) perspective(600px) rotateY(0deg)" }
                : { display: "none" };
        }

        if (animPhase === "exit") {
            if (isVisible) {
                // Outgoing: pop up → slide sideways + subtle 3D flip → fade out
                return {
                    ...base,
                    transition: `transform ${ANIM_MS}ms ${EASE_IN}, opacity ${ANIM_MS}ms ${EASE_IN}`,
                    opacity: 0,
                    transform: `scale(1.04) translateX(${isHackathonView ? "60px" : "-60px"}) perspective(600px) rotateY(${isHackathonView ? "8deg" : "-8deg"})`,
                    zIndex: 2,
                    pointerEvents: "none",
                };
            }
            // Hidden panel stays hidden during exit
            return { display: "none" };
        }

        if (animPhase === "enter") {
            if (isVisible) {
                // Incoming: start scaled down → pop forward to 1, slight shadow elevation
                return {
                    ...base,
                    opacity: 1,
                    transform: "scale(1) translateX(0) perspective(600px) rotateY(0deg)",
                    zIndex: 1,
                    boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
                };
            }
            return { display: "none" };
        }

        return isVisible ? base : { display: "none" };
    };

    /* ── Derive which panel is currently "visible" based on anim phase ──
       During "exit", the OLD view is visible (animating out).
       During "enter" and "idle", the CURRENT view is visible. */
    const jobsVisible = animPhase === "exit" ? !isHackathonView : !isHackathonView;
    const hackVisible = animPhase === "exit" ? isHackathonView : isHackathonView;
    // But for "exit" we need BOTH briefly — the outgoing one is animating away.
    // Actually, during "exit" the OLD view is still showing. During "enter" the NEW one.
    // The key insight: during "exit", isHackathonView hasn't flipped yet.

    const dragRef = useRef({ idx: null, startX: 0, startY: 0, locked: false, dragging: false });
    const [dragVis, setDragVis] = useState({ idx: null, dx: 0 });
    const lastTapTime = useRef({});
    const tapTimerRef = useRef({});

    /* ── Derived from explicit props ── */
    const bookmarkedSet = new Set(bookmarkedIds);
    const filteredActive = applyFilters(activeJobs, filters);
    const savedJobs = ALL_JOBS.filter(j => bookmarkedSet.has(j.id));
    const activeFilterCount = [filters.jobType, filters.location, filters.salaryMin, filters.status !== "all" ? filters.status : null].filter(Boolean).length;

    const buildSections = () => {
        const activeSec = { key: "active", label: "Active", jobs: filteredActive, accent: t.orange, dot: t.orange };
        const acceptSec = { key: "accepted", label: "Accepted", jobs: acceptedJobs, accent: T.c.green, dot: T.c.green };
        const rejectSec = { key: "rejected", label: "Rejected", jobs: rejectedJobs, accent: T.c.red, dot: T.c.red };

        switch (filters.status) {
            case "accepted": return [acceptSec, activeSec, rejectSec];
            case "rejected": return [rejectSec, activeSec, acceptSec];
            case "active": return [activeSec, acceptSec, rejectSec];
            default: return [activeSec, acceptSec, rejectSec];
        }
    };

    /* ── Bookmark flash wrapper ── */
    const handleToggleBookmark = (id) => {
        toggleBookmark(id);
        setBmarkFlash(id);
        setTimeout(() => setBmarkFlash(null), 700);
    };

    /* ═══════════════════════════════════════════════════════════════════
       SWIPE HANDLERS — unchanged, pointer capture for reliable drag
    ═══════════════════════════════════════════════════════════════════ */
    const onPtrDown = (e, idx) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        dragRef.current = { idx, startX: e.clientX, startY: e.clientY, locked: false, dragging: true };
        setDragVis({ idx, dx: 0 });
    };

    const onPtrMove = (e, idx) => {
        const d = dragRef.current;
        if (!d.dragging || d.idx !== idx) return;
        const dx = e.clientX - d.startX;
        const dy = e.clientY - d.startY;
        if (!d.locked && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
            if (Math.abs(dy) > Math.abs(dx)) {
                dragRef.current = { ...d, dragging: false };
                setDragVis({ idx: null, dx: 0 });
                try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (_) { }
                return;
            }
            dragRef.current.locked = true;
        }
        if (d.locked) {
            e.preventDefault();
            setDragVis({ idx, dx });
        }
    };

    const onPtrUp = (e, idx, jobId) => {
        const d = dragRef.current;
        if (d.idx !== idx) return;
        try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (_) { }
        const wasDrag = d.locked;
        const dx = dragVis.idx === idx ? dragVis.dx : 0;
        dragRef.current = { idx: null, startX: 0, startY: 0, locked: false, dragging: false };
        setDragVis({ idx: null, dx: 0 });
        if (wasDrag && Math.abs(dx) > 80) {
            moveJob(jobId, dx > 0 ? "accepted" : "rejected");
            setActionFlash({ id: jobId, action: dx > 0 ? "apply" : "skip" });
            setTimeout(() => setActionFlash(null), 700);
        } else if (!wasDrag) {
            handleTap(jobId);
        }
    };

    const onPtrCancel = (e, idx) => {
        if (dragRef.current.idx === idx) {
            dragRef.current = { idx: null, startX: 0, startY: 0, locked: false, dragging: false };
            setDragVis({ idx: null, dx: 0 });
        }
    };

    /* ── tap / double-tap ── */
    const handleTap = (id) => {
        const now = Date.now(); const last = lastTapTime.current[id] || 0;
        if (now - last < 300) { clearTimeout(tapTimerRef.current[id]); lastTapTime.current[id] = 0; handleToggleBookmark(id); }
        else { lastTapTime.current[id] = now; tapTimerRef.current[id] = setTimeout(() => setSelectedJobId(id), 300); }
    };

    /* ── detail view action ── */
    const handleDetailAction = (action) => {
        if (action === "apply") moveJob(selectedJobId, "accepted");
        else if (action === "skip") moveJob(selectedJobId, "rejected");
        setSelectedJobId(null);
    };

    /* ── detail view (reuses SwipeScreen) ── */
    if (selectedJobId) {
        const j = ALL_JOBS.find(x => x.id === selectedJobId);
        if (j) return <SwipeScreen cards={[{ ...j, match: j.m }]} onClose={() => setSelectedJobId(null)} onAction={handleDetailAction} />;
    }

    /* ── Compact card for accepted/rejected sections ── */
    const MiniCard = ({ j, accent, sectionKey }) => (
        <div onClick={() => { setModalJob(j); setModalStatus(sectionKey); }} style={{ cursor: "pointer" }}>
            <Row g={10} ai="center" sx={{ padding: "12px 16px", background: t.s1, borderRadius: 16, border: "none", boxShadow: t.shadow, marginBottom: 8 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: t.s2, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 15, color: accent }}>{j.ch}</span>
                </div>
                <Col g={1} sx={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontFamily: FB, fontWeight: 700, fontSize: 13, color: t.t1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{j.role}</span>
                    <span style={{ fontFamily: FB, fontSize: 11, color: t.t2 }}>{j.co} · {j.loc}</span>
                </Col>
                <span style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: accent, background: `${accent}18`, padding: "3px 8px", borderRadius: 8, flexShrink: 0 }}>{j.type}</span>
            </Row>
        </div>
    );

    /* ── Swipeable Job Card ── */
    const JobCard = ({ j, i, swipable }) => {
        const isActive = dragVis.idx === i && swipable;
        const dx = isActive ? dragVis.dx : 0;
        const isSaved = bookmarkedSet.has(j.id);
        const flash = actionFlash && actionFlash.id === j.id ? actionFlash.action : null;
        const bFlash = bmarkFlash === j.id;
        return (
            <div key={j.id}
                {...(swipable ? {
                    onPointerDown: e => onPtrDown(e, i),
                    onPointerMove: e => onPtrMove(e, i),
                    onPointerUp: e => onPtrUp(e, i, j.id),
                    onPointerCancel: e => onPtrCancel(e, i),
                    onLostPointerCapture: e => onPtrCancel(e, i),
                } : { onClick: () => setSelectedJobId(j.id) })}
                style={{
                    background: t.s1, borderRadius: 24, padding: 16, position: "relative", overflow: "hidden",
                    border: flash === "apply" ? `1.5px solid ${T.c.green}66` : flash === "skip" ? `1.5px solid ${T.c.red}66` : "none",
                    boxShadow: t.shadow,
                    marginBottom: 12,
                    transform: `translateX(${dx}px) scale(${bFlash ? 0.96 : 1})`,
                    transition: isActive ? "none" : "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s",
                    cursor: isActive ? "grabbing" : "pointer", userSelect: "none", touchAction: "pan-y",
                }}
            >
                {dx > 20 && <div style={{ position: "absolute", inset: 0, background: `rgba(34,197,94,${Math.min(dx / 250, 0.2)})`, borderRadius: t.r, pointerEvents: "none", zIndex: 5 }} />}
                {dx < -20 && <div style={{ position: "absolute", inset: 0, background: `rgba(239,68,68,${Math.min(-dx / 250, 0.2)})`, borderRadius: t.r, pointerEvents: "none", zIndex: 5 }} />}
                {dx > 50 && <div style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", zIndex: 6, opacity: Math.min((dx - 50) / 40, 1) }}><span style={{ fontFamily: FD, fontWeight: 900, fontSize: 13, color: T.c.green, letterSpacing: 1 }}>ACCEPT ✓</span></div>}
                {dx < -50 && <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", zIndex: 6, opacity: Math.min((-dx - 50) / 40, 1) }}><span style={{ fontFamily: FD, fontWeight: 900, fontSize: 13, color: T.c.red, letterSpacing: 1 }}>REJECT ✗</span></div>}
                {flash && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, pointerEvents: "none" }}>
                    <div style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", borderRadius: 14, padding: "8px 18px", border: `2px solid ${flash === "apply" ? T.c.green : T.c.red}55` }}>
                        <span style={{ fontFamily: FD, fontWeight: 900, fontSize: 16, color: flash === "apply" ? T.c.green : T.c.red, letterSpacing: 1 }}>{flash === "apply" ? "ACCEPTED ✓" : "REJECTED ✗"}</span>
                    </div>
                </div>}
                {bFlash && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, pointerEvents: "none" }}>
                    <div style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", borderRadius: 14, padding: "8px 16px", display: "flex", alignItems: "center", gap: 6 }}>
                        <Svg d={IC.bmark} s={16} c={isSaved ? t.orange : t.t2} w={2.2} fill={isSaved ? t.orange : "none"} />
                        <span style={{ fontFamily: FB, fontSize: 12, fontWeight: 800, color: "#fff" }}>{isSaved ? "Saved ★" : "Unsaved"}</span>
                    </div>
                </div>}
                <Row g={14} ai="flex-start" sx={{ marginBottom: 12, position: "relative", zIndex: 1 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 17, background: t.s3, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontFamily: FD, fontWeight: 900, fontSize: 22, color: t.orange }}>{j.ch}</span>
                    </div>
                    <Col g={3} sx={{ flex: 1 }}>
                        <Row ai="flex-start" jc="space-between">
                            <Col g={2}>
                                <span style={{ fontFamily: FB, fontWeight: 700, fontSize: 15, color: t.t1 }}>{j.role}</span>
                                <span style={{ fontFamily: FB, fontSize: 12, color: t.t2 }}>{j.co} · {j.loc}</span>
                            </Col>
                            <Row g={6}>
                                {isSaved && <Svg d={IC.bmark} s={14} c={t.orange} w={2} fill={t.orange} />}
                                <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, color: t.orange, background: t.orangeLo, padding: "4px 9px", borderRadius: 8, flexShrink: 0 }}>{j.m}%</span>
                            </Row>
                        </Row>
                    </Col>
                </Row>
                <Row g={6} sx={{ flexWrap: "wrap", position: "relative", zIndex: 1 }}>
                    {j.tags.map(tg => <span key={tg} style={{ fontFamily: FB, fontSize: 11, fontWeight: 600, color: t.orange, background: t.orangeLo, padding: "3px 9px", borderRadius: 100 }}>{tg}</span>)}
                    <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 600, color: T.c.green, background: `${T.c.green}15`, padding: "3px 9px", borderRadius: 100 }}>{j.pay}</span>
                    <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 600, color: t.t3, background: t.s3, padding: "3px 9px", borderRadius: 100 }}>{j.type}</span>
                </Row>
            </div>
        );
    };

    /* ── Hackathon Card — display-only ── */
    const HackCard = ({ h }) => (
        <div style={{
            background: t.s1, borderRadius: 24, padding: 18, marginBottom: 14,
            border: "none", boxShadow: t.shadow, position: "relative", overflow: "hidden",
        }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: `${h.col}12`, filter: "blur(40px)", pointerEvents: "none" }} />
            <Row g={12} ai="flex-start" sx={{ marginBottom: 12, position: "relative", zIndex: 1 }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: `${h.col}18`, border: `1.5px solid ${h.col}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: FD, fontWeight: 900, fontSize: 22, color: h.col }}>{h.ch}</span>
                </div>
                <Col g={3} sx={{ flex: 1 }}>
                    <span style={{ fontFamily: FB, fontWeight: 800, fontSize: 16, color: t.t1 }}>{h.title}</span>
                    <span style={{ fontFamily: FB, fontSize: 12, color: t.t2 }}>{h.org}</span>
                </Col>
            </Row>
            <Row g={8} sx={{ marginBottom: 12, position: "relative", zIndex: 1 }}>
                <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 600, color: h.col, background: `${h.col}18`, padding: "4px 10px", borderRadius: 100 }}>📅 {h.date}</span>
                <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.06)", padding: "4px 10px", borderRadius: 100 }}>📍 {h.loc}</span>
                <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, color: "#F59E0B", background: "rgba(245,158,11,0.12)", padding: "4px 10px", borderRadius: 100 }}>🏆 {h.prize}</span>
            </Row>
            <Row g={6} sx={{ flexWrap: "wrap", marginBottom: 14, position: "relative", zIndex: 1 }}>
                {h.tags.map(tg => <span key={tg} style={{ fontFamily: FB, fontSize: 11, fontWeight: 600, color: h.col, background: `${h.col}12`, border: `1px solid ${h.col}22`, padding: "3px 10px", borderRadius: 100 }}>{tg}</span>)}
            </Row>
            <Row g={8} sx={{ position: "relative", zIndex: 1 }}>
                <button onClick={() => setTeamFormationHack(h)} style={{
                    flex: 1, height: 40, borderRadius: 13,
                    background: "transparent", border: `1.5px solid ${h.col}`,
                    color: h.col, fontFamily: FB, fontSize: 13, fontWeight: 800, cursor: "pointer",
                }}>Find Team</button>
                <button style={{
                    flex: 1, height: 40, borderRadius: 13,
                    background: h.col, border: "none", color: "#fff",
                    fontFamily: FB, fontSize: 13, fontWeight: 800, cursor: "pointer",
                    boxShadow: `0 4px 16px ${h.col}40`,
                }}>Register →</button>
            </Row>
        </div>
    );

    /* ═══════════════════════════════════════════════════════════════════
       RENDER
    ═══════════════════════════════════════════════════════════════════ */
    const sections = buildSections();
    const isAnimating = animPhase !== "idle";

    return (
        <>
            <Col>
                <div style={{ padding: "10px 22px 16px" }}>
                    <Row ai="flex-start" jc="space-between" sx={{ marginBottom: 16 }}>
                        <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 26, color: t.t1, letterSpacing: -0.5 }}>Opportunities</span>
                        <ModeToggle mode={mode} onToggle={onToggle} />
                    </Row>
                    {/* Search */}
                    <div style={{ display: "flex", gap: 10, alignItems: "center", background: t.s1, borderRadius: 18, padding: "14px 16px", marginBottom: 14, border: "none", boxShadow: t.shadow }}>
                        <Svg d={IC.search} s={16} c={t.t2} />
                        <span style={{ fontFamily: FB, fontSize: 13, color: t.t3 }}>Search roles, companies, skills...</span>
                    </div>
                    {/* Action bar: Filters + Saved + Toggle */}
                    <Row g={8}>
                        <button onClick={() => setShowFilters(true)} style={{
                            height: 38, padding: "0 16px", borderRadius: 100, display: "flex", alignItems: "center", gap: 6, cursor: "pointer",
                            background: activeFilterCount > 0 ? t.orangeLo : t.s1, border: "none", boxShadow: t.shadow,
                        }}>
                            <Svg d={IC.menu} s={14} c={activeFilterCount > 0 ? t.orange : t.t2} />
                            <span style={{ fontFamily: FB, fontSize: 12, fontWeight: 700, color: activeFilterCount > 0 ? t.orange : t.t2 }}>Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}</span>
                        </button>
                        {!isHackathonView && (
                            <button onClick={() => { setShowSaved(s => !s); }} style={{
                                height: 38, padding: "0 16px", borderRadius: 100, display: "flex", alignItems: "center", gap: 5, cursor: "pointer",
                                background: showSaved ? t.orangeLo : t.s1, border: "none", boxShadow: t.shadow,
                            }}>
                                <Svg d={IC.bmark} s={14} c={showSaved ? t.orange : t.t2} w={2} fill={showSaved ? t.orange : "none"} />
                                <span style={{ fontFamily: FB, fontSize: 12, fontWeight: 700, color: showSaved ? t.orange : t.t2 }}>Saved ({savedJobs.length})</span>
                            </button>
                        )}
                        {/* ── TOGGLE: Hackathon ↔ Jobs ── */}
                        <button onClick={handleToggleView} disabled={isAnimating} style={{
                            height: 38, padding: "0 16px", borderRadius: 100, display: "flex", alignItems: "center", gap: 5, cursor: isAnimating ? "default" : "pointer",
                            background: isHackathonView ? "rgba(34,197,94,0.12)" : t.s1,
                            border: "none", boxShadow: t.shadow,
                            opacity: isAnimating ? 0.6 : 1, transition: "opacity 0.2s",
                        }}>
                            <Svg d={IC.award} s={13} c={isHackathonView ? T.c.green : t.t2} />
                            <span style={{ fontFamily: FB, fontSize: 12, fontWeight: 700, color: isHackathonView ? T.c.green : t.t2 }}>
                                {isHackathonView ? "Jobs" : "Hackathons"}
                            </span>
                        </button>
                    </Row>
                </div>

                {/* ═══════════════════════════════════════════════════════
                   ANIMATED CONTAINER — both panels in a relative wrapper
                   Only the visible panel occupies layout flow.
                   During animation, both may be visible briefly.
                ═══════════════════════════════════════════════════════ */}
                <div style={{ position: "relative", overflow: "hidden" }}>

                    {/* ── JOBS CONTAINER ── */}
                    <div style={getContainerStyle(!isHackathonView)}>
                        {showSaved ? (
                            <Col g={2} sx={{ padding: "0 22px 16px" }}>
                                {savedJobs.length === 0 ? (
                                    <div style={{ textAlign: "center", padding: "32px 0" }}>
                                        <Svg d={IC.bmark} s={32} c={t.t3} />
                                        <span style={{ fontFamily: FB, fontSize: 13, color: t.t3, display: "block", marginTop: 8 }}>No saved jobs yet. Double-tap to bookmark.</span>
                                    </div>
                                ) : savedJobs.map((j, i) => <JobCard key={j.id} j={j} i={i} swipable={false} />)}
                            </Col>
                        ) : (
                            <>
                                {sections.map(sec => {
                                    if (sec.jobs.length === 0) return null;
                                    const isMainActive = sec.key === "active";
                                    return (
                                        <Col key={sec.key} sx={{ padding: "0 22px 16px" }}>
                                            {!(isMainActive && filters.status === "all") && (
                                                <Row g={6} ai="center" sx={{ marginBottom: 8 }}>
                                                    <div style={{ width: 8, height: 8, borderRadius: 4, background: sec.dot }} />
                                                    <span style={{ fontFamily: FD, fontWeight: 700, fontSize: 15, color: t.t1 }}>{sec.label}</span>
                                                    <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, color: sec.accent, background: `${sec.accent}18`, padding: "2px 8px", borderRadius: 100 }}>{sec.jobs.length}</span>
                                                </Row>
                                            )}
                                            {isMainActive
                                                ? sec.jobs.map((j, i) => <JobCard key={j.id} j={j} i={i} swipable={true} />)
                                                : sec.jobs.map(j => <MiniCard key={j.id} j={j} accent={sec.accent} sectionKey={sec.key} />)
                                            }
                                        </Col>
                                    );
                                })}
                                {filteredActive.length === 0 && acceptedJobs.length === 0 && rejectedJobs.length === 0 && (
                                    <div style={{ textAlign: "center", padding: "32px 22px" }}>
                                        <Svg d={IC.search} s={32} c={t.t3} />
                                        <span style={{ fontFamily: FB, fontSize: 13, color: t.t3, display: "block", marginTop: 8 }}>No jobs match filters. Try resetting.</span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* ── HACKATHON CONTAINER ── */}
                    <div style={getContainerStyle(isHackathonView)}>
                        <Col sx={{ padding: "0 22px 24px" }}>
                            <Row g={6} ai="center" sx={{ marginBottom: 12 }}>
                                <Svg d={IC.award} s={16} c={T.c.green} />
                                <span style={{ fontFamily: FD, fontWeight: 700, fontSize: 17, color: t.t1 }}>Upcoming Hackathons</span>
                                <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, color: T.c.green, background: `${T.c.green}18`, padding: "2px 8px", borderRadius: 100 }}>{hackathons.length}</span>
                            </Row>
                            {hackathons.map(h => <HackCard key={h.id} h={h} />)}
                        </Col>
                    </div>
                </div>

                <div style={{ height: 24 }} />
            </Col>

            {showFilters && <FilterPanel filters={filters} setFilters={setFilters} onClose={() => setShowFilters(false)} />}
            {modalJob && <AcceptedRejectedJobModal job={modalJob} status={modalStatus} onClose={() => { setModalJob(null); setModalStatus(null); }} />}
            {teamFormationHack && <TeamFormation isOpen={true} onClose={() => setTeamFormationHack(null)} hackathon={teamFormationHack} mode={mode} />}
        </>
    );
};

export default CareerJobs;
