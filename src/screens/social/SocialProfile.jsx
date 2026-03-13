import { T, FD, FB } from '../../tokens.js';
import { IC, Svg } from '../../icons.jsx';
import { Row, Col } from '../../helpers.jsx';
import ModeToggle from '../../components/ModeToggle.jsx';

/* ── SOCIAL PROFILE ── */
const SocialProfile = ({ mode, onToggle }) => {
    const t = T.s;
    return (
        <Col>
            {/* Cover */}
            <div style={{ height: 160, background: `linear-gradient(160deg, #FFF1EB 0%, #FFE4D6 50%, #F5F0E8 100%)`, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 60, left: "50%", transform: "translateX(-50%)", width: 200, height: 200, borderRadius: "50%", background: `${t.orange}10`, filter: "blur(40px)" }} />
                <div style={{ position: "absolute", top: 14, right: 18 }}>
                    <ModeToggle mode={mode} onToggle={onToggle} />
                </div>
                <div style={{ position: "absolute", bottom: -32, left: "50%", transform: "translateX(-50%)" }}>
                    <div style={{ width: 72, height: 72, borderRadius: "50%", background: t.s1, border: `3px solid ${t.bg}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: t.shadow }}>
                        <span style={{ fontFamily: FD, fontWeight: 900, fontSize: 28, color: t.orange }}>R</span>
                    </div>
                </div>
            </div>

            <div style={{ paddingTop: 44, textAlign: "center", padding: "44px 22px 0" }}>
                <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 22, color: t.t1, display: "block" }}>Rahul Sharma</span>
                <span style={{ fontFamily: FB, fontSize: 13, color: t.t2, display: "block", marginBottom: 16 }}>B.Tech CSE · RGPV · 2026 · Full Stack Dev</span>

                {/* Stats row */}
                <Row ai="center" jc="center" g={0} sx={{ borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}`, padding: "14px 0", marginBottom: 18 }}>
                    {[["47", "Connections"], ["12", "Posts"], ["7", "Skills"], ["2", "Wins"]].map(([n, l], i, arr) => (
                        <div key={l} style={{ flex: 1, textAlign: "center", borderRight: i < arr.length - 1 ? `1px solid ${t.border}` : "none" }}>
                            <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 20, color: t.t1, display: "block" }}>{n}</span>
                            <span style={{ fontFamily: FB, fontSize: 10, color: t.t2 }}>{l}</span>
                        </div>
                    ))}
                </Row>

                {/* Skill badges */}
                <Row g={6} jc="center" sx={{ flexWrap: "wrap", marginBottom: 18 }}>
                    {[["React ✓", "#2563EB", "#EFF6FF"], ["Node.js ✓", "#16A34A", "#E8F8EF"], ["Figma ✓", "#9333EA", "#FAF5FF"], ["Python ✓", "#D97706", "#FEF3C7"]].map(([s, col, bg]) => (
                        <span key={s} style={{ fontFamily: FB, fontSize: 12, fontWeight: 700, color: col, background: bg, padding: "5px 12px", borderRadius: 100 }}>{s}</span>
                    ))}
                </Row>

                {/* Action row */}
                <Row g={10} sx={{ marginBottom: 22 }}>
                    <button style={{ flex: 1, height: 44, borderRadius: 14, background: t.orange, border: "none", color: "#fff", fontFamily: FB, fontSize: 14, fontWeight: 800, cursor: "pointer", boxShadow: `0 4px 16px ${t.orangeMid}` }}>✦ AI Resume</button>
                    <button style={{ flex: 1, height: 44, borderRadius: 14, background: t.s1, border: `1.5px solid ${t.border}`, color: t.t1, fontFamily: FB, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: t.shadow }}>Edit Profile</button>
                </Row>

                {/* Tab icons */}
                <Row g={0} sx={{ borderBottom: `1px solid ${t.border}`, marginBottom: 2 }}>
                    {[[IC.grid, true], [IC.spark, false], [IC.bmark, false]].map(([ic, sel], idx) => (
                        <div key={idx} style={{ flex: 1, display: "flex", justifyContent: "center", padding: "10px 0", borderBottom: sel ? `2.5px solid ${t.orange}` : "none" }}>
                            <Svg d={ic} s={19} c={sel ? t.orange : t.t3} />
                        </div>
                    ))}
                </Row>

                {/* Project grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
                    {[["Todo App", "#FFF1EB", t.orange], ["Weather UI", "#EFF6FF", "#2563EB"], ["Chat Bot", "#FAF5FF", "#9333EA"], ["Portfolio", "#FEF3C7", "#D97706"], ["E-Commerce", "#E8F8EF", "#16A34A"], ["Resume AI", "#FFF1EB", t.orange]].map(([p, bg, col], i) => (
                        <div key={p} style={{ aspectRatio: "1", background: bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, border: "1px solid rgba(0,0,0,0.04)" }}>
                            <Svg d={IC.grid} s={22} c={`${col}55`} />
                            <span style={{ fontFamily: FB, fontSize: 9, color: `${col}99`, fontWeight: 700 }}>{p}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ height: 28 }} />
        </Col>
    );
};

export default SocialProfile;
