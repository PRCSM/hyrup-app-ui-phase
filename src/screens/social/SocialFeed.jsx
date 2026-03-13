import { useState } from "react";
import { T, FD, FB } from '../../tokens.js';
import { IC, Svg } from '../../icons.jsx';
import { FEED_POSTS } from '../../data.js';
import { Row } from '../../helpers.jsx';
import ModeToggle from '../../components/ModeToggle.jsx';
import PostCard from '../../components/PostCard.jsx';
import PostComposer from '../../components/PostComposer.jsx';

/* ═══════════════════════════════════════════════════════════════════════
   SOCIAL FEED — Twitter/Threads-style vertical scroll (V2.1 REDESIGN)

   Replaces the previous full-screen swipeable card layout.
   Pure vertical scroll. No swipe gestures on feed.
═══════════════════════════════════════════════════════════════════════ */
const SocialFeed = ({ mode, onToggle, addXP }) => {
    const t = T.s;
    const [activeTab, setActiveTab] = useState("For You");
    const [activeFilter, setActiveFilter] = useState("All");
    const [showComposer, setShowComposer] = useState(false);

    const tabs = ["For You", "Following", "My College", "Trending"];
    const filters = ["All", "Placement", "Project", "Hackathon", "DSA", "Win", "AMA"];

    /* ── Filter posts by chip selection ── */
    const filteredPosts = activeFilter === "All"
        ? FEED_POSTS
        : FEED_POSTS.filter(p => p.type.toUpperCase().includes(activeFilter.toUpperCase()));

    const handlePost = (post) => {
        addXP?.(30, "Post Created");
    };

    return (
        <div style={{ background: t.bg, minHeight: "100%" }}>
            {/* ── Header ── */}
            <div style={{ padding: "52px 22px 0", position: "sticky", top: 0, zIndex: 10, background: t.bg }}>
                <Row jc="space-between" ai="center" sx={{ marginBottom: 12 }}>
                    <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 24, color: t.t1 }}>Feed</span>
                    <ModeToggle mode={mode} onToggle={onToggle} />
                </Row>

                {/* ── Pill Tab Switcher ── */}
                <Row g={0} sx={{
                    background: t.s2, borderRadius: 100, padding: 3, marginBottom: 12,
                }}>
                    {tabs.map(tab => {
                        const sel = activeTab === tab;
                        return (
                            <button key={tab} onClick={() => setActiveTab(tab)} style={{
                                flex: 1, height: 32, borderRadius: 100, border: "none", cursor: "pointer",
                                background: sel ? t.orange : "transparent",
                                color: sel ? "#fff" : t.t2,
                                fontFamily: FB, fontSize: 12, fontWeight: sel ? 700 : 500,
                                transition: "all 0.2s ease",
                            }}>{tab}</button>
                        );
                    })}
                </Row>

                {/* ── Filter Chips Row ── */}
                <div style={{ overflowX: "auto", marginBottom: 8, paddingBottom: 8 }}>
                    <Row g={6}>
                        {filters.map(f => {
                            const sel = activeFilter === f;
                            return (
                                <button key={f} onClick={() => setActiveFilter(f)} style={{
                                    padding: "6px 14px", borderRadius: 100, whiteSpace: "nowrap", cursor: "pointer",
                                    background: sel ? t.orange : "transparent",
                                    border: `1px solid ${sel ? t.orange : t.border}`,
                                    color: sel ? "#fff" : t.t2,
                                    fontFamily: FB, fontSize: 12, fontWeight: sel ? 700 : 500,
                                }}>{f}</button>
                            );
                        })}
                    </Row>
                </div>

                {/* Bottom border */}
                <div style={{ height: 1, background: t.border, margin: "0 -22px" }} />
            </div>

            {/* ── Feed List ── */}
            <div>
                {filteredPosts.map(post => (
                    <PostCard key={post.id} post={post} mode={mode} />
                ))}

                {/* Empty state */}
                {filteredPosts.length === 0 && (
                    <div style={{ padding: "60px 40px", textAlign: "center" }}>
                        <Svg d={IC.search} s={40} c={t.t3} />
                        <p style={{ fontFamily: FB, fontSize: 14, color: t.t2, marginTop: 12 }}>
                            No posts found for this filter.
                        </p>
                    </div>
                )}
            </div>

            {/* ── Floating FAB ── */}
            <button onClick={() => setShowComposer(true)} style={{
                position: "sticky", bottom: 16, left: "calc(100% - 68px)",
                width: 52, height: 52, borderRadius: 26, background: t.orange, border: "none",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                boxShadow: "0 4px 20px rgba(255,87,34,0.4)", zIndex: 5,
            }}>
                <Svg d={IC.plus} s={24} c="#fff" w={2.5} />
            </button>

            {/* ── Post Composer Modal ── */}
            <PostComposer
                isOpen={showComposer}
                onClose={() => setShowComposer(false)}
                onPost={handlePost}
                mode={mode}
            />
        </div>
    );
};

export default SocialFeed;
