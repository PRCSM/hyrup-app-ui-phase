import { useState } from "react";
import { T, FD, FB } from '../tokens.js';
import { IC, Svg } from '../icons.jsx';
import { POST_TYPE_COLORS } from '../data.js';
import { Row, Col } from '../helpers.jsx';

/* ═══════════════════════════════════════════════════════════════════════
   POST CARD — Twitter/Threads-style post component (V2.1)
═══════════════════════════════════════════════════════════════════════ */
const PostCard = ({ post, mode = "social", onJoinTeam, onConnectGoal }) => {
    const t = mode === "career" ? T.c : T.s;
    const isC = mode === "career";
    const [expanded, setExpanded] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes || 0);
    const typeColor = POST_TYPE_COLORS[post.type] || { bg: t.orange, text: '#fff' };

    const handleLike = () => {
        setLiked(!liked);
        setLikeCount(c => liked ? c - 1 : c + 1);
    };

    /* ── TEAM REQUEST variant ── */
    if (post.type === 'TEAM_REQUEST') {
        return (
            <div style={{
                padding: "16px", background: isC ? "rgba(234,88,12,0.06)" : t.s1,
                borderRadius: 24, margin: "0 22px 16px", border: "none", boxShadow: t.shadow,
            }}>
                <Row g={12} ai="flex-start">
                    {/* Avatar */}
                    <div style={{ width: 40, height: 40, borderRadius: 20, background: t.orange, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 16, color: "#fff" }}>{post.user.ch}</span>
                    </div>
                    {/* Content */}
                    <Col g={6} sx={{ flex: 1, minWidth: 0 }}>
                        {/* Header */}
                        <Row g={6} ai="center">
                            <span style={{ fontFamily: FB, fontWeight: 700, fontSize: 14, color: t.t1 }}>{post.user.name}</span>
                            <span style={{ fontFamily: FB, fontSize: 12, color: t.t2 }}>@{post.user.handle} · {post.time}</span>
                        </Row>
                        <Row g={6} ai="center">
                            <span style={{ fontFamily: FB, fontSize: 12, color: t.t2 }}>{post.user.college}</span>
                            <span style={{
                                fontFamily: FB, fontSize: 10, fontWeight: 700, color: typeColor.text,
                                background: typeColor.bg, padding: "2px 8px", borderRadius: 100,
                            }}>TEAM REQUEST</span>
                        </Row>
                        {/* Text */}
                        <p style={{ fontFamily: FB, fontSize: 14, color: t.t1, lineHeight: 1.5, margin: "4px 0 0" }}>{post.text}</p>
                        {/* Role chips */}
                        <Row g={6} sx={{ flexWrap: "wrap", marginTop: 8 }}>
                            {post.roles?.map(r => (
                                <span key={r} style={{
                                    fontFamily: FB, fontSize: 11, fontWeight: 600, color: t.orange,
                                    background: isC ? T.c.orangeLo : T.s.orangeLo, border: `1px solid ${t.orange}30`,
                                    padding: "4px 10px", borderRadius: 100,
                                }}>{r}</span>
                            ))}
                            {post.hackathon && (
                                <span style={{ fontFamily: FB, fontSize: 11, color: t.t2, padding: "4px 0" }}>for {post.hackathon}</span>
                            )}
                        </Row>
                        {/* Join Team button */}
                        <button onClick={() => onJoinTeam?.(post)} style={{
                            marginTop: 10, height: 36, borderRadius: 100, background: t.orange, border: "none",
                            color: "#fff", fontFamily: FB, fontSize: 13, fontWeight: 700, cursor: "pointer",
                            padding: "0 20px", width: "100%",
                        }}>Join Team</button>
                    </Col>
                </Row>
            </div>
        );
    }

    /* ── ROADMAP variant ── */
    if (post.type === 'ROADMAP') {
        return (
            <div style={{ padding: "16px", background: t.s1, borderRadius: 24, margin: "0 22px 16px", border: "none", boxShadow: t.shadow }}>
                <Row g={12} ai="flex-start">
                    <div style={{ width: 40, height: 40, borderRadius: 20, background: "#4F46E5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 16, color: "#fff" }}>{post.user.ch}</span>
                    </div>
                    <Col g={6} sx={{ flex: 1, minWidth: 0 }}>
                        <Row g={6} ai="center">
                            <span style={{ fontFamily: FB, fontWeight: 700, fontSize: 14, color: t.t1 }}>{post.user.name}</span>
                            <span style={{ fontFamily: FB, fontSize: 12, color: t.t2 }}>@{post.user.handle} · {post.time}</span>
                        </Row>
                        <Row g={6} ai="center">
                            <span style={{ fontFamily: FB, fontSize: 12, color: t.t2 }}>{post.user.college}</span>
                            <span style={{
                                fontFamily: FB, fontSize: 10, fontWeight: 700, color: typeColor.text,
                                background: typeColor.bg, padding: "2px 8px", borderRadius: 100,
                            }}>ROADMAP</span>
                        </Row>
                        <p style={{ fontFamily: FB, fontSize: 14, color: t.t1, lineHeight: 1.5, margin: "4px 0 0" }}>{post.text}</p>
                        {/* Progress bar */}
                        <div style={{ marginTop: 10, background: isC ? t.s3 : t.s2, borderRadius: 6, height: 8, overflow: "hidden" }}>
                            <div style={{ width: `${post.readiness}%`, height: "100%", background: "linear-gradient(90deg, #4F46E5, #7C3AED)", borderRadius: 6 }} />
                        </div>
                        <Row jc="space-between" ai="center" sx={{ marginTop: 6 }}>
                            <span style={{ fontFamily: FB, fontSize: 12, color: t.t2 }}>{post.readiness}% placement ready</span>
                            <span style={{ fontFamily: FB, fontSize: 11, color: t.t2 }}>{post.goal}</span>
                        </Row>
                        {/* CTA */}
                        <button onClick={() => onConnectGoal?.(post)} style={{
                            marginTop: 10, height: 34, borderRadius: 100, background: "transparent",
                            border: `1.5px solid #4F46E5`, color: "#4F46E5", fontFamily: FB, fontSize: 12,
                            fontWeight: 700, cursor: "pointer", padding: "0 16px",
                        }}>Same goal? Connect</button>
                        {/* Engagement */}
                        <EngagementRow t={t} isC={isC} post={post} liked={liked} likeCount={likeCount} onLike={handleLike} />
                    </Col>
                </Row>
            </div>
        );
    }

    /* ── STANDARD post ── */
    return (
        <div style={{ padding: "16px", background: t.s1, borderRadius: 24, margin: "0 22px 16px", border: "none", boxShadow: t.shadow }}>
            <Row g={12} ai="flex-start">
                {/* Avatar */}
                <div style={{
                    width: 40, height: 40, borderRadius: 20, flexShrink: 0,
                    background: isC ? t.s3 : t.s2, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 16, color: t.t1 }}>{post.user.ch}</span>
                </div>
                {/* Content */}
                <Col g={4} sx={{ flex: 1, minWidth: 0 }}>
                    {/* Top row */}
                    <Row g={6} ai="center">
                        <span style={{ fontFamily: FB, fontWeight: 700, fontSize: 14, color: t.t1 }}>{post.user.name}</span>
                        <span style={{ fontFamily: FB, fontSize: 12, color: t.t2 }}>@{post.user.handle} · {post.time}</span>
                        <div style={{ marginLeft: "auto", cursor: "pointer", padding: 4 }}>
                            <Svg d={IC.dot3} s={16} c={t.t2} />
                        </div>
                    </Row>
                    {/* College + type tag */}
                    <Row g={6} ai="center">
                        <span style={{ fontFamily: FB, fontSize: 12, color: t.t2 }}>{post.user.college}</span>
                        <span style={{
                            fontFamily: FB, fontSize: 10, fontWeight: 700, color: typeColor.text,
                            background: typeColor.bg, padding: "2px 8px", borderRadius: 100,
                        }}>{post.type}</span>
                    </Row>
                    {/* Post text */}
                    <p onClick={() => setExpanded(!expanded)} style={{
                        fontFamily: FB, fontSize: 14, color: t.t1, lineHeight: 1.55, margin: "6px 0 0",
                        cursor: "pointer",
                        ...(!expanded ? { display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" } : {}),
                    }}>{post.text}</p>
                    {/* Media placeholder */}
                    {post.hasMedia && (
                        <div style={{
                            marginTop: 10, height: 180, borderRadius: 16, overflow: "hidden",
                            background: isC ? `linear-gradient(135deg, ${t.s2}, ${t.s3})` : `linear-gradient(135deg, ${t.s2}, ${t.s3})`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <Svg d={IC.img} s={32} c={t.t3} />
                        </div>
                    )}
                    {/* Verified badge for placements */}
                    {post.verified && (
                        <Row g={6} ai="center" sx={{
                            marginTop: 8, padding: "6px 12px", borderRadius: 10,
                            background: isC ? "rgba(34,197,94,0.08)" : "rgba(22,163,74,0.06)",
                        }}>
                            <Svg d={IC.check} s={14} c={T.green} w={2.5} />
                            <span style={{ fontFamily: FB, fontSize: 12, fontWeight: 600, color: T.green }}>
                                Placed at {post.company} · Verified by HYRUP
                            </span>
                        </Row>
                    )}
                    {/* Engagement row */}
                    <EngagementRow t={t} isC={isC} post={post} liked={liked} likeCount={likeCount} onLike={handleLike} />
                </Col>
            </Row>
        </div>
    );
};

/* ── Engagement Row sub-component ── */
const EngagementRow = ({ t, isC, post, liked, likeCount, onLike }) => (
    <Row g={0} jc="space-between" ai="center" sx={{ marginTop: 10, paddingTop: 8 }}>
        {/* Comment */}
        <button style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: 100 }}>
            <Svg d={IC.comment} s={15} c={t.t2} w={1.6} />
            <span style={{ fontFamily: FB, fontSize: 12, color: t.t2 }}>{post.comments || 0}</span>
        </button>
        {/* Repost */}
        <button style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: 100 }}>
            <Svg d={IC.repost} s={15} c={t.t2} w={1.6} />
            <span style={{ fontFamily: FB, fontSize: 12, color: t.t2 }}>{post.reposts || 0}</span>
        </button>
        {/* Star / Like */}
        <button onClick={onLike} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: 100 }}>
            <Svg d={IC.star} s={15} c={liked ? t.orange : t.t2} fill={liked ? t.orange : "none"} w={1.6} />
            <span style={{ fontFamily: FB, fontSize: 12, color: liked ? t.orange : t.t2, fontWeight: liked ? 700 : 400 }}>{likeCount}</span>
        </button>
        {/* More */}
        <button style={{ display: "flex", alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: 100 }}>
            <Svg d={IC.share} s={15} c={t.t2} w={1.6} />
        </button>
    </Row>
);

export default PostCard;
