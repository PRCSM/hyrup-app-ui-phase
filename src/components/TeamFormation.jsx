import { useState } from "react";
import { T, FD, FB } from '../tokens.js';
import { IC, Svg } from '../icons.jsx';
import { USERS } from '../data.js';
import { Row, Col } from '../helpers.jsx';

/* ═══════════════════════════════════════════════════════════════════════
   TEAM FORMATION — Hackathon team building modal (V2.1)
═══════════════════════════════════════════════════════════════════════ */
const ROLES = ["Frontend Dev", "Backend Dev", "UI/UX Designer", "ML Engineer", "DevOps", "Product"];

const TeamFormation = ({ isOpen, onClose, hackathon, mode = "career" }) => {
    const t = mode === "career" ? T.c : T.s;
    const isC = mode === "career";
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [invited, setInvited] = useState([]);

    const toggleRole = (role) => {
        setSelectedRoles(prev =>
            prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
        );
    };

    const suggestions = USERS.slice(0, 3);

    if (!isOpen) return null;

    return (
        <div style={{ position: "absolute", inset: 0, zIndex: 80, display: "flex", flexDirection: "column" }}>
            {/* Backdrop */}
            <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} />

            {/* Panel */}
            <div style={{
                position: "relative", marginTop: "auto", background: isC ? t.s1 : t.s1,
                borderRadius: "24px 24px 0 0", padding: "20px 22px 28px", zIndex: 1,
                maxHeight: "85%", overflowY: "auto",
                animation: "team-slide-up 0.35s cubic-bezier(0.22,1,0.36,1)",
            }}>
                <style>{`
                    @keyframes team-slide-up {
                        from { transform: translateY(100%); }
                        to   { transform: translateY(0); }
                    }
                `}</style>

                {/* Header */}
                <Row jc="space-between" ai="center" sx={{ marginBottom: 20 }}>
                    <Col g={2}>
                        <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 18, color: t.t1 }}>Build Your Team</span>
                        <span style={{ fontFamily: FB, fontSize: 12, color: t.t2 }}>{hackathon?.title || "Hackathon"}</span>
                    </Col>
                    <button onClick={onClose} style={{
                        width: 34, height: 34, borderRadius: 12, background: isC ? t.s2 : t.s2,
                        border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                    }}>
                        <Svg d={IC.x} s={14} c={t.t2} />
                    </button>
                </Row>

                {/* Section 1: Role Slots */}
                <span style={{ fontFamily: FB, fontWeight: 700, fontSize: 12, color: t.t2, letterSpacing: 1, display: "block", marginBottom: 8 }}>ROLES NEEDED</span>
                <Row g={8} sx={{ flexWrap: "wrap", marginBottom: 20 }}>
                    {ROLES.map(role => {
                        const sel = selectedRoles.includes(role);
                        return (
                            <button key={role} onClick={() => toggleRole(role)} style={{
                                padding: "7px 14px", borderRadius: 100, cursor: "pointer",
                                background: sel ? t.orange : "transparent", border: `1px solid ${sel ? t.orange : t.border}`,
                                color: sel ? "#fff" : t.t2, fontFamily: FB, fontSize: 12, fontWeight: 700,
                            }}>{role}</button>
                        );
                    })}
                </Row>

                {/* Section 2: AI Suggestions */}
                <span style={{ fontFamily: FB, fontWeight: 700, fontSize: 12, color: t.t2, letterSpacing: 1, display: "block", marginBottom: 8 }}>AI SUGGESTIONS</span>
                <Col g={8} sx={{ marginBottom: 20 }}>
                    {suggestions.map(user => {
                        const inv = invited.includes(user.id);
                        return (
                            <Row key={user.id} g={10} ai="center" sx={{
                                padding: 12, borderRadius: 14, background: isC ? t.s2 : t.s2, border: `1px solid ${t.border}`,
                            }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 12, flexShrink: 0,
                                    background: isC ? t.s3 : t.s3, display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 14, color: t.t1 }}>{user.ch}</span>
                                </div>
                                <Col g={2} sx={{ flex: 1 }}>
                                    <span style={{ fontFamily: FB, fontWeight: 600, fontSize: 13, color: t.t1 }}>{user.name}</span>
                                    <span style={{ fontFamily: FB, fontSize: 11, color: t.t2 }}>{user.skills.join(" · ")}</span>
                                </Col>
                                <button onClick={() => setInvited(p => inv ? p.filter(x => x !== user.id) : [...p, user.id])} style={{
                                    height: 30, borderRadius: 100, padding: "0 14px", cursor: "pointer",
                                    background: inv ? t.green : "transparent", border: `1px solid ${inv ? t.green : t.orange}`,
                                    color: inv ? "#fff" : t.orange, fontFamily: FB, fontSize: 11, fontWeight: 700,
                                }}>{inv ? "Invited ✓" : "Invite"}</button>
                            </Row>
                        );
                    })}
                </Col>

                {/* Section 3: Share */}
                <span style={{ fontFamily: FB, fontWeight: 700, fontSize: 12, color: t.t2, letterSpacing: 1, display: "block", marginBottom: 8 }}>SHARE REQUEST</span>
                <Row g={8} sx={{ marginBottom: 20, flexWrap: "wrap" }}>
                    {[
                        [IC.news, "Post to Feed"],
                        [IC.send, "Send DM"],
                        [IC.users, "Share to Group"],
                        [IC.copy, "Copy Link"],
                    ].map(([ic, label]) => (
                        <button key={label} style={{
                            display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 12,
                            background: isC ? t.s2 : t.s2, border: `1px solid ${t.border}`, cursor: "pointer",
                        }}>
                            <Svg d={ic} s={14} c={t.t2} w={1.6} />
                            <span style={{ fontFamily: FB, fontSize: 12, color: t.t1, fontWeight: 500 }}>{label}</span>
                        </button>
                    ))}
                </Row>

                {/* Footer: Create Team */}
                <button style={{
                    width: "100%", height: 48, borderRadius: 14, background: t.orange, border: "none",
                    color: "#fff", fontFamily: FB, fontSize: 15, fontWeight: 800, cursor: "pointer",
                    boxShadow: `0 4px 16px ${t.orange}50`,
                }}>Create Team + Group Chat</button>
            </div>
        </div>
    );
};

export default TeamFormation;
