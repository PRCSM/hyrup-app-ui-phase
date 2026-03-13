import { T, FD, FB } from '../../tokens.js';
import { IC, Svg } from '../../icons.jsx';
import { Row, Col } from '../../helpers.jsx';
import ModeToggle from '../../components/ModeToggle.jsx';

/* ── CAREER NEWS ── */
const CareerNews = ({ mode, onToggle }) => {
    const t = T.c;
    const stories = [
        { h: "Anthropic raises $2B — AI talent demand surges across India", src: "TechCrunch", time: "2h ago", big: true },
        { h: "Top skills hiring managers want in 2025 interns", src: "Forbes India", time: "5h ago" },
        { h: "Meta lays off 5% — what it means for fresh grads", src: "ET", time: "1d ago" },
        { h: "Is AI replacing or creating jobs? A nuanced take", src: "Wired", time: "2d ago" },
    ];

    return (
        <Col>
            <div style={{ padding: "10px 22px 16px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 26, color: t.t1 }}>Tech Pulse</span>
                <ModeToggle mode={mode} onToggle={onToggle} />
            </div>
            {/* Big hero news card */}
            <div style={{ margin: "0 22px 16px", borderRadius: 24, overflow: "hidden", border: "none", background: t.s1, boxShadow: t.shadow }}>
                <div style={{ height: 148, background: `linear-gradient(135deg, ${t.orangeLo}, ${t.s2})`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 60% 50%, #fff, transparent 65%)`, opacity: 0.5 }} />
                    <Svg d={IC.zap} s={56} c={t.orange} fill={`${t.orange}20`} w={1.5} />
                </div>
                <div style={{ padding: 16 }}>
                    <span style={{ fontFamily: FB, fontWeight: 700, fontSize: 15, color: t.t1, display: "block", lineHeight: 1.45, marginBottom: 10 }}>{stories[0].h}</span>
                    <Row ai="center" jc="space-between">
                        <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, color: t.orange, background: t.orangeLo, padding: "3px 9px", borderRadius: 100 }}>{stories[0].src}</span>
                        <span style={{ fontFamily: FB, fontSize: 11, color: t.t3 }}>{stories[0].time}</span>
                    </Row>
                </div>
            </div>
            {/* List */}
            <Col sx={{ padding: "0 0 24px" }}>
                {stories.slice(1).map((s, i) => (
                    <Row key={i} g={12} ai="flex-start" sx={{ background: t.s1, borderRadius: 20, padding: 14, margin: "0 22px 10px", border: "none", boxShadow: t.shadow }}>
                        <div style={{ width: 54, height: 54, borderRadius: 16, background: t.s2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Svg d={IC.news} s={20} c={t.t3} />
                        </div>
                        <Col g={6} sx={{ flex: 1 }}>
                            <span style={{ fontFamily: FB, fontWeight: 600, fontSize: 13, color: t.t1, lineHeight: 1.4 }}>{s.h}</span>
                            <Row g={8}>
                                <span style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: t.orange, background: t.orangeLo, padding: "2px 7px", borderRadius: 100 }}>{s.src}</span>
                                <span style={{ fontFamily: FB, fontSize: 10, color: t.t3 }}>{s.time}</span>
                            </Row>
                        </Col>
                    </Row>
                ))}
            </Col>
        </Col>
    );
};

export default CareerNews;
