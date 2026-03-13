/* ═══════════════════════════════════════════════════════════════════════
   HYRUP V3 — DESIGN TOKENS
   CAREER  →  Warm charcoal #1C1B1A  · Rich Orange #FF6B35  (dark mode)
   SOCIAL  →  Warm cream #FAF9F7  · Vivid Orange #FF5722  (light mode)
═══════════════════════════════════════════════════════════════════════ */

export const FONT_IMPORT = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400;1,9..40,500&display=swap');
`;

export const FD = "'Bricolage Grotesque', sans-serif";  // display
export const FB = "'DM Sans', sans-serif";               // body

/* ── TOKEN MAP ── */
export const T = {
  c: { /* CAREER – pure white minimal */
    bg: "#F8F8F8", s1: "#FFFFFF", s2: "#F0F0F0", s3: "#E8E8E8", s4: "#DCDCDC",
    orange: "#E86A33", orangeLo: "rgba(232,106,51,0.08)", orangeMid: "rgba(232,106,51,0.15)",
    orangeDim: "rgba(232,106,51,0.10)",
    t1: "#111111", t2: "#777777", t3: "#A3A3A3", muted: "#B0B0B0",
    border: "#EEEEEE", green: "#10B981", red: "#EF4444", blue: "#3B82F6",
    gold: "#F59E0B", shadow: "0 8px 24px rgba(0,0,0,0.05)",
    r: 24,
  },
  s: { /* SOCIAL – pure white minimal */
    bg: "#F5F4F2", s1: "#FFFFFF", s2: "#EBEAE8", s3: "#E0DFDC", s4: "#D1D0CD",
    orange: "#FA664A", orangeLo: "rgba(250,102,74,0.08)", orangeMid: "rgba(250,102,74,0.15)",
    orangeDim: "rgba(250,102,74,0.10)",
    t1: "#111111", t2: "#777777", t3: "#A3A3A3", muted: "#B0B0B0",
    border: "#EAE9E6", green: "#10B981", red: "#EF4444", blue: "#3B82F6",
    gold: "#F59E0B", shadow: "0 8px 24px rgba(0,0,0,0.05)",
    r: 24,
  },
  /* ── Semantic colors ── */
  green: "#10B981", red: "#EF4444", gold: "#F59E0B", blue: "#3B82F6",
  /* ── Spacing & radius ── */
  rCard: 24, rPill: 100, rBtn: 16,
  screenPad: 24, cardPad: 20,
};
