import { useState, useRef } from "react";
import { T, FD, FB } from '../../tokens.js';
import { IC, Svg } from '../../icons.jsx';
import { Row, Col } from '../../helpers.jsx';
import ModeToggle from '../../components/ModeToggle.jsx';

/* ═══════════════════════════════════════════════════════════════════════
   SOCIAL CHAT — V2.1 (Conversation list + Inner chat view)
═══════════════════════════════════════════════════════════════════════ */
const SocialChat = ({ mode, onToggle }) => {
    const t = T.s;
    const [filter, setFilter] = useState("All");
    const [activeChat, setActiveChat] = useState(null);
    const [msgText, setMsgText] = useState("");
    const msgsEnd = useRef(null);

    const convos = [
        { id: 1, n: "React Builders", msg: "Kiran: shipped the landing page!", time: "9:12", u: 5, group: true, ch: "R", col: "#2563EB", bg: "#EFF6FF", type: "Hack", members: 12, countdown: "HackIndia · 14d 3h" },
        { id: 2, n: "Sneha R.", msg: "Congrats on the hackathon!", time: "10:20", u: 1, group: false, ch: "S", col: "#9333EA", bg: "#FAF5FF", online: true },
        { id: 3, n: "GATE 2026 Prep", msg: "Today: DP on trees — solve by 10pm", time: "Yesterday", u: 0, group: true, ch: "G", col: "#16A34A", bg: "#E8F8EF", type: "Study", members: 28 },
        { id: 4, n: "Dev M.", msg: "Can we collab on the OSS project?", time: "Mon", u: 0, group: false, ch: "D", col: t.orange, bg: t.orangeLo, online: false },
        { id: 5, n: "Founders Circle", msg: "Pitch deck review tonight at 9pm", time: "Tue", u: 3, group: true, ch: "F", col: t.orange, bg: t.orangeLo, type: "Fun", members: 8 },
        { id: 6, n: "ML Paper Club", msg: "New paper: Attention Is All You Need revisited", time: "Wed", u: 0, group: true, ch: "M", col: "#9333EA", bg: "#FAF5FF", type: "Study", members: 15 },
    ];

    const filtered = filter === "All" ? convos : filter === "DMs" ? convos.filter(c => !c.group) : convos.filter(c => c.group);

    /* ── Mock messages for inner view ── */
    const [messages, setMessages] = useState([
        { id: 1, from: "them", text: "Hey! Just saw your project on the feed", time: "9:10" },
        { id: 2, from: "them", text: "The collaborative editor looks amazing. What tech stack did you use?", time: "9:10" },
        { id: 3, from: "me", text: "Thanks! It's React + Node.js with WebSockets for the real-time sync", time: "9:12" },
        { id: 4, from: "me", text: "Used CRDT for conflict resolution", time: "9:12" },
        { id: 5, from: "them", text: "That's solid. Want to collaborate? I have an idea for adding voice chat to it", time: "9:15" },
    ]);

    const handleSend = () => {
        if (!msgText.trim()) return;
        setMessages(prev => [...prev, { id: Date.now(), from: "me", text: msgText, time: "now" }]);
        setMsgText("");
    };

    /* ═══ INNER CHAT VIEW ═══ */
    if (activeChat) {
        const c = activeChat;
        return (
            <Col sx={{ height: "100%", background: t.bg }}>
                {/* Header */}
                <div style={{
                    padding: "52px 18px 12px", background: t.s1,
                    borderBottom: `1px solid ${t.border}`, flexShrink: 0,
                }}>
                    <Row g={12} ai="center">
                        <button onClick={() => setActiveChat(null)} style={{
                            width: 36, height: 36, borderRadius: 12, background: t.s2,
                            border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                        }}>
                            <Svg d={IC.arrowLeft} s={16} c={t.t2} />
                        </button>
                        <div style={{
                            width: 40, height: 40, borderRadius: c.group ? 14 : 20,
                            background: c.bg, border: `2px solid ${c.col}28`,
                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        }}>
                            <span style={{ fontFamily: FD, fontWeight: 900, fontSize: 16, color: c.col }}>{c.ch}</span>
                        </div>
                        <Col g={1} sx={{ flex: 1 }}>
                            <span style={{ fontFamily: FB, fontWeight: 700, fontSize: 15, color: t.t1 }}>{c.n}</span>
                            <span style={{ fontFamily: FB, fontSize: 11, color: t.t2 }}>
                                {c.group ? `${c.members} members` : (c.online ? "Online" : "Last seen 2h ago")}
                            </span>
                        </Col>
                        {/* Group countdown chip */}
                        {c.countdown && (
                            <span style={{
                                fontFamily: FB, fontSize: 10, fontWeight: 700, color: t.orange,
                                background: t.orangeLo, padding: "4px 10px", borderRadius: 100,
                                border: `1px solid ${t.orange}20`,
                            }}>{c.countdown}</span>
                        )}
                    </Row>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}>
                    {messages.map(m => (
                        <div key={m.id} style={{
                            display: "flex", justifyContent: m.from === "me" ? "flex-end" : "flex-start",
                            marginBottom: 8,
                        }}>
                            <div style={{
                                maxWidth: "75%", padding: "10px 14px", borderRadius: 16,
                                background: m.from === "me" ? t.orange : t.s1,
                                border: m.from === "me" ? "none" : `1px solid ${t.border}`,
                                borderBottomRightRadius: m.from === "me" ? 4 : 16,
                                borderBottomLeftRadius: m.from === "me" ? 16 : 4,
                            }}>
                                <p style={{ fontFamily: FB, fontSize: 14, color: m.from === "me" ? "#fff" : t.t1, lineHeight: 1.5, margin: 0 }}>{m.text}</p>
                                <span style={{ fontFamily: FB, fontSize: 10, color: m.from === "me" ? "rgba(255,255,255,0.6)" : t.t3, display: "block", marginTop: 4, textAlign: "right" }}>{m.time}</span>
                            </div>
                        </div>
                    ))}
                    <div ref={msgsEnd} />
                </div>

                {/* Input bar */}
                <div style={{ padding: "10px 18px 28px", borderTop: `1px solid ${t.border}`, background: t.s1, flexShrink: 0 }}>
                    <Row g={8} ai="center">
                        <button style={{ width: 36, height: 36, borderRadius: 12, background: t.s2, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                            <Svg d={IC.attach} s={16} c={t.t2} w={1.6} />
                        </button>
                        <input
                            value={msgText} onChange={e => setMsgText(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
                            placeholder="Type a message..."
                            style={{
                                flex: 1, height: 40, borderRadius: 14, padding: "0 14px",
                                background: t.s2, border: `1px solid ${t.border}`,
                                fontFamily: FB, fontSize: 14, color: t.t1, outline: "none",
                            }}
                        />
                        <button onClick={handleSend} style={{
                            width: 40, height: 40, borderRadius: 14, flexShrink: 0,
                            background: msgText.trim() ? t.orange : t.s2, border: "none",
                            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                            transition: "background 0.2s",
                        }}>
                            <Svg d={IC.send} s={16} c={msgText.trim() ? "#fff" : t.t3} w={1.8} />
                        </button>
                    </Row>
                </div>
            </Col>
        );
    }

    /* ═══ CONVERSATION LIST ═══ */
    return (
        <Col>
            <div style={{ padding: "10px 22px 14px" }}>
                <Row ai="center" jc="space-between" sx={{ marginBottom: 14 }}>
                    <Row g={6} ai="center">
                        <Svg d={IC.chat} s={20} c={t.t1} w={1.8} />
                        <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 24, color: t.t1 }}>Messages</span>
                    </Row>
                    <Row g={8} ai="center">
                        <ModeToggle mode={mode} onToggle={onToggle} />
                        <button style={{ width: 38, height: 38, borderRadius: 14, background: t.orange, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: `0 4px 14px ${t.orangeMid}` }}>
                            <Svg d={IC.plus} s={18} c="#fff" w={2.5} />
                        </button>
                    </Row>
                </Row>
                {/* Search */}
                <div style={{ display: "flex", gap: 8, alignItems: "center", background: t.s1, border: "none", borderRadius: 18, padding: "14px 16px", marginBottom: 12, boxShadow: t.shadow }}>
                    <Svg d={IC.search} s={16} c={t.t2} />
                    <span style={{ fontFamily: FB, fontSize: 13, color: t.t3 }}>Search messages...</span>
                </div>
                {/* Filter tabs */}
                <Row g={8}>
                    {["All", "DMs", "Groups"].map(f => (
                        <button key={f} onClick={() => setFilter(f)} style={{
                            flex: 1, height: 36, borderRadius: 100,
                            background: filter === f ? t.t1 : t.s1, border: "none",
                            color: filter === f ? t.bg : t.t2, fontFamily: FB, fontSize: 12, fontWeight: 700, cursor: "pointer",
                            boxShadow: filter === f ? t.shadow : "none",
                        }}>{f}</button>
                    ))}
                </Row>
            </div>

            {/* Conversation list */}
            {filtered.map((c) => (
                <Row key={c.id} g={12} ai="center"
                    onClick={() => setActiveChat(c)}
                    sx={{ padding: "14px 16px", borderRadius: 24, background: t.s1, margin: "0 22px 10px", border: "none", boxShadow: t.shadow, cursor: "pointer" }}>
                    <div style={{ position: "relative", flexShrink: 0 }}>
                        <div style={{ width: 52, height: 52, borderRadius: c.group ? 18 : 26, background: c.bg, border: `2px solid ${c.col}28`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontFamily: FD, fontWeight: 900, fontSize: 20, color: c.col }}>{c.ch}</span>
                        </div>
                        {c.group && c.type && (
                            <div style={{ position: "absolute", bottom: -3, right: -3, padding: "1px 6px", borderRadius: 6, background: t.s1, border: `1px solid ${t.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                                <span style={{ fontFamily: FB, fontSize: 9, fontWeight: 700, color: t.t2 }}>{c.type}</span>
                            </div>
                        )}
                        {/* Online indicator for DMs */}
                        {!c.group && c.online && (
                            <div style={{ position: "absolute", bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6, background: T.s.green, border: `2px solid ${t.bg}` }} />
                        )}
                    </div>
                    <Col g={3} sx={{ flex: 1, minWidth: 0 }}>
                        <Row ai="center" jc="space-between">
                            <span style={{ fontFamily: FB, fontWeight: 700, fontSize: 14, color: t.t1 }}>{c.n}</span>
                            <span style={{ fontFamily: FB, fontSize: 11, color: t.t3, flexShrink: 0 }}>{c.time}</span>
                        </Row>
                        <span style={{ fontFamily: FB, fontSize: 12, color: t.t2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>{c.msg}</span>
                    </Col>
                    {c.u > 0 && <div style={{ minWidth: 22, height: 22, borderRadius: 11, background: c.col, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 6px" }}>
                        <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 800, color: "#fff" }}>{c.u}</span>
                    </div>}
                </Row>
            ))}
        </Col>
    );
};

export default SocialChat;
