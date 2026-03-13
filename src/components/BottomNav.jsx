import { T, FB } from '../tokens.js';
import { Svg } from '../icons.jsx';

/* ── BOTTOM NAV — indicator dot above icon ── */
const BottomNav = ({ mode, active, onSelect, items }) => {
    const t = mode === "career" ? T.c : T.s;
    const isC = mode === "career";

    return (
        <div style={{
            height: 72, background: t.s1,
            borderTop: `1px solid ${t.border}`,
            display: "flex", alignItems: "center", padding: "0 4px 8px", flexShrink: 0,
            boxShadow: "0 -4px 20px rgba(0,0,0,0.03)",
        }}>
            {items.map(([id, ic, label]) => {
                const sel = active === id;
                return (
                    <button key={id} onClick={() => onSelect(id)} style={{
                        flex: 1, background: "none", border: "none", cursor: "pointer",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "6px 0",
                    }}>
                        <div style={{ width: 44, height: 28, borderRadius: 14, background: sel ? t.orangeLo : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .2s" }}>
                            <Svg d={ic} s={20} c={sel ? "#111111" : t.muted} w={sel ? 2 : 1.8} />
                        </div>
                        <span style={{ fontFamily: FB, fontSize: 10, fontWeight: sel ? 700 : 500, color: sel ? "#111111" : t.muted, transition: "color .2s" }}>{label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default BottomNav;
