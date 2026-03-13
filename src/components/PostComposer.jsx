import { useState } from "react";
import { T, FD, FB } from '../tokens.js';
import { IC, Svg } from '../icons.jsx';
import { POST_TYPE_COLORS } from '../data.js';
import { Row } from '../helpers.jsx';

/* ═══════════════════════════════════════════════════════════════════════
   POST COMPOSER — Full-screen slide-up modal (V2.1)
═══════════════════════════════════════════════════════════════════════ */
const PostComposer = ({ isOpen, onClose, onPost, mode = "social" }) => {
    const t = mode === "career" ? T.c : T.s;
    const isC = mode === "career";
    const [text, setText] = useState("");
    const [postType, setPostType] = useState("PROJECT");

    const types = Object.keys(POST_TYPE_COLORS);

    const handlePost = () => {
        if (!text.trim()) return;
        onPost?.({ text, type: postType });
        setText("");
        setPostType("PROJECT");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: "absolute", inset: 0, zIndex: 90,
            background: t.bg, display: "flex", flexDirection: "column",
            animation: "composer-in 0.4s cubic-bezier(0.22,1,0.36,1)",
        }}>
            <style>{`
                @keyframes composer-in {
                    from { transform: translateY(100%); opacity: 0; }
                    to   { transform: translateY(0); opacity: 1; }
                }
            `}</style>

            {/* Header */}
            <Row jc="space-between" ai="center" sx={{ padding: "52px 18px 12px", flexShrink: 0 }}>
                <button onClick={onClose} style={{
                    width: 36, height: 36, borderRadius: 12, background: isC ? t.s2 : t.s2,
                    border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                }}>
                    <Svg d={IC.x} s={16} c={t.t2} />
                </button>
                <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 18, color: t.t1 }}>New Post</span>
                <button onClick={handlePost} disabled={!text.trim()} style={{
                    height: 36, borderRadius: 100, background: text.trim() ? t.orange : (isC ? t.s3 : t.s3),
                    border: "none", color: text.trim() ? "#fff" : t.t3, fontFamily: FB, fontSize: 14, fontWeight: 700,
                    cursor: text.trim() ? "pointer" : "default", padding: "0 20px",
                    opacity: text.trim() ? 1 : 0.5,
                }}>Post</button>
            </Row>

            {/* Type selector */}
            <div style={{ padding: "0 18px 12px", overflowX: "auto", flexShrink: 0 }}>
                <Row g={6}>
                    {types.map(tp => {
                        const c = POST_TYPE_COLORS[tp];
                        const sel = postType === tp;
                        return (
                            <button key={tp} onClick={() => setPostType(tp)} style={{
                                padding: "5px 12px", borderRadius: 100, whiteSpace: "nowrap", cursor: "pointer",
                                background: sel ? c.bg : "transparent", border: `1px solid ${sel ? c.bg : t.border}`,
                                color: sel ? c.text : t.t2, fontFamily: FB, fontSize: 11, fontWeight: 600,
                            }}>{tp.replace('_', ' ')}</button>
                        );
                    })}
                </Row>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: t.border }} />

            {/* Text input */}
            <div style={{ flex: 1, padding: 18 }}>
                <Row g={12} ai="flex-start">
                    <div style={{
                        width: 40, height: 40, borderRadius: 20, flexShrink: 0,
                        background: t.orange, display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 16, color: "#fff" }}>R</span>
                    </div>
                    <textarea
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="What are you building?"
                        style={{
                            flex: 1, minHeight: 120, background: "transparent", border: "none",
                            fontFamily: FB, fontSize: 15, color: t.t1, resize: "none", outline: "none",
                            lineHeight: 1.6,
                        }}
                    />
                </Row>
            </div>

            {/* Bottom toolbar */}
            <div style={{ padding: "12px 18px 28px", borderTop: `1px solid ${t.border}`, flexShrink: 0 }}>
                <Row g={16} ai="center">
                    {[IC.img, IC.video, IC.link, IC.loc].map((ic, i) => (
                        <button key={i} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                            <Svg d={ic} s={20} c={t.orange} w={1.6} />
                        </button>
                    ))}
                    <span style={{ marginLeft: "auto", fontFamily: FB, fontSize: 12, color: text.length > 260 ? T.red : t.t3 }}>
                        {text.length}/280
                    </span>
                </Row>
            </div>
        </div>
    );
};

export default PostComposer;
