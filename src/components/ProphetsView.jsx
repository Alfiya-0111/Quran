import React, { useState, useCallback } from "react";
import { stopAudio, playSequenceTTS, PROPHETS, backBtn } from "./KidsCorner";

export default function ProphetsView() {
  const [selected, setSelected] = useState(null);
  const [speaking, setSpeaking] = useState(false);

  const playStory = useCallback((p) => {
    if (speaking) { stopAudio(); setSpeaking(false); return; }
    setSpeaking(true);
    playSequenceTTS([
      { text: p.arabic, lang: "ar", pause: 900 },
      { text: p.story,  lang: "ur", pause: 600 },
      { text: p.fact,   lang: "ur", pause: 300 },
    ], () => setSpeaking(false));
  }, [speaking]);

  if (selected) {
    return (
      <div style={{ animation: "fadeUp 0.3s ease" }}>
        <button 
          onClick={() => { setSelected(null); stopAudio(); setSpeaking(false); }} 
          style={backBtn}
          aria-label="Go back"
        >
          ← Wapas
        </button>
        <article style={{ background: "#111827", borderRadius: "26px", padding: "28px", border: `2px solid ${selected.color}` }}>
          <header style={{ textAlign: "center", marginBottom: "20px" }}>
            <div style={{ fontSize: "64px", marginBottom: "8px", animation: "float 2s ease-in-out infinite" }} aria-hidden="true">
              {selected.emoji}
            </div>
            <h2 style={{ color: selected.color, fontSize: "26px", fontWeight: "800" }}>{selected.name}</h2>
            <div style={{ color: "#f0ece0", fontSize: "26px", fontFamily: "serif", direction: "rtl", marginTop: "4px" }}>
              {selected.arabic}
            </div>
            <button
              onClick={() => playStory(selected)}
              aria-label={speaking ? "Stop story" : "Play story"}
              style={{
                marginTop: "16px", padding: "10px 28px", borderRadius: "20px", border: "none",
                background: speaking ? selected.color : `${selected.color}22`,
                color: speaking ? "#0a0f1a" : selected.color,
                fontSize: "14px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: "8px", margin: "16px auto 0",
              }}
            >
              {speaking ? "⏹ Rokein" : "🔊 Kahani Sunao"}
            </button>
          </header>
          <div style={{ background: "#0a0f1a", borderRadius: "16px", padding: "20px", marginBottom: "16px" }}>
            <h3 style={{ color: "#fbbf24", fontSize: "11px", letterSpacing: "2px", marginBottom: "10px" }}>📖 KAHANI</h3>
            <p style={{ color: "#f0ece0", fontSize: "15px", lineHeight: "1.9" }}>{selected.story}</p>
          </div>
          <div style={{ background: `${selected.color}18`, border: `1px solid ${selected.color}55`, borderRadius: "12px", padding: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }} aria-hidden="true">⭐</span>
            <span style={{ color: selected.color, fontSize: "13px", fontWeight: "600" }}>{selected.fact}</span>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
      {PROPHETS.map((p, i) => (
        <article
          key={p.name}
          onClick={() => setSelected(p)}
          style={{
            background: "#111827", borderRadius: "18px", padding: "20px", cursor: "pointer",
            textAlign: "center", border: `1px solid #2a3a4a`,
            animation: `popIn 0.3s ease ${i * 0.05}s both`, transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = p.color; e.currentTarget.style.transform = "scale(1.02)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a3a4a"; e.currentTarget.style.transform = "scale(1)"; }}
          aria-label={`${p.name} - ${p.fact}`}
        >
          <div style={{ fontSize: "40px", marginBottom: "8px" }} aria-hidden="true">{p.emoji}</div>
          <h3 style={{ color: p.color, fontSize: "13px", fontWeight: "700" }}>{p.name}</h3>
          <div style={{ color: "#f0ece0", fontSize: "18px", fontFamily: "serif", direction: "rtl", marginTop: "4px" }}>
            {p.arabic}
          </div>
        </article>
      ))}
    </div>
  );
}