import React, { memo } from "react";

// ─── Palette ──────────────────────────────────────────────────────────
const C = {
  bg: "#0a0f1a",
  card: "#111827",
  text: "#f0ece0",
  dim: "#8a9ab0",
  green: "#4ade80",
  orange: "#fb923c",
  gold: "#C9A84C",
};

// ─── Leaderboard Component ────────────────────────────────────────────
const Leaderboard = memo(function Leaderboard({ scores, onBack }) {
  const sorted = [...scores].sort((a, b) => b.score - a.score).slice(0, 10);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "system-ui, sans-serif" }}>
      <header style={{
        background: "linear-gradient(180deg, #111820, #0a0f1a)",
        borderBottom: "1px solid rgba(201,168,76,0.1)", padding: "24px 20px",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{ maxWidth: "500px", margin: "0 auto", display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={onBack}
            style={{ background: "transparent", border: "1px solid #2a3a4a", color: C.dim, borderRadius: "10px", padding: "8px 14px", cursor: "pointer", fontSize: "13px" }}
            aria-label="Go back"
          >
            ← Back
          </button>
          <h1 style={{ fontSize: "18px", fontWeight: "800" }}>🏆 Leaderboard</h1>
        </div>
      </header>

      <main style={{ maxWidth: "500px", margin: "0 auto", padding: "24px 20px" }}>
        {sorted.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: C.dim }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }} aria-hidden="true">📊</div>
            <p>Abhi tak koi quiz nahi kheli gayi!</p>
          </div>
        ) : (
          sorted.map((s, i) => (
            <div
              key={i}
              style={{
                background: C.card, borderRadius: "14px", padding: "14px 18px",
                marginBottom: "8px", display: "flex", alignItems: "center", gap: "12px",
                border: i === 0 ? `1px solid ${C.gold}55` : "1px solid #2a3a4a",
                animation: `fadeUp 0.3s ease ${i * 0.05}s both`,
              }}
            >
              <div style={{
                width: "32px", height: "32px", borderRadius: "50%",
                background: i === 0 ? `${C.gold}22` : i === 1 ? `${C.dim}22` : i === 2 ? `${C.orange}22` : "rgba(255,255,255,0.05)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px", fontWeight: "800",
                color: i === 0 ? C.gold : i === 1 ? C.dim : i === 2 ? C.orange : C.dim,
              }} aria-label={`Rank ${i + 1}`}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14px", fontWeight: "600" }}>{s.category}</div>
                <div style={{ color: C.dim, fontSize: "11px" }}>{s.date}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: C.gold, fontSize: "16px", fontWeight: "800" }}>{s.score} pts</div>
                <div style={{ color: C.dim, fontSize: "11px" }}>{s.percentage}%</div>
              </div>
            </div>
          ))
        )}
      </main>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
});

export default Leaderboard;