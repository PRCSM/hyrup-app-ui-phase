import { T, FB } from '../tokens.js';
import { IC, Svg } from '../icons.jsx';

/* ── XP TOAST — slides up above nav bar ── */
const XPToast = ({ amount, label }) => (
    <div style={{
        position: "absolute", bottom: 90, left: "50%", transform: "translateX(-50%)",
        background: "#FF5722", color: "#fff", fontFamily: FB, fontSize: 14, fontWeight: 600,
        borderRadius: 12, padding: "10px 20px", display: "flex", alignItems: "center", gap: 8,
        boxShadow: "0 4px 20px rgba(255,87,34,0.4)", zIndex: 200, whiteSpace: "nowrap",
        animation: "xp-toast-in 0.3s cubic-bezier(0.34,1.56,0.64,1)",
    }}>
        <Svg d={IC.zap} s={16} c="#fff" w={2} />
        <span>+{amount} XP · {label}</span>
        <style>{`
            @keyframes xp-toast-in {
                from { opacity: 0; transform: translateX(-50%) translateY(20px); }
                to   { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
        `}</style>
    </div>
);

export default XPToast;
