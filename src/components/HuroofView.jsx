import React, { useState, useCallback } from "react";
import { stopAudio, playSequenceTTS, ARABIC_LETTERS, backBtn } from "./KidsCorner";

export default function HuroofView() {
  const [selected, setSelected] = useState(null);
  const [speaking, setSpeaking] = useState(null);
  const [learned, setLearned] = useState(() => {
    try { return JSON.parse(localStorage.getItem("kids_huroof") || "[]"); } catch { return []; }
  });

  const playLetter = useCallback((l, id) => {
    if (speaking === id) { stopAudio(); setSpeaking(null); return; }
    setSpeaking(id);
    playSequenceTTS([
      { text: l.letter,  lang: "ar", pause: 800 },
      { text: l.word,    lang: "ar", pause: 700 },
      { text: l.meaning, lang: "ur", pause: 300 },
    ], () => setSpeaking(null));
  }, [speaking]);

  const toggleLearned = useCallback((name) => {
    const updated = learned.includes(name)
      ? learned.filter(n => n !== name)
      : [...learned, name];
    setLearned(updated);
    localStorage.setItem("kids_huroof", JSON.stringify(updated));
  }, [learned]);

  if (selected) {
    return (
      <div style={{ animation: "fadeUp 0.3s ease" }}>
        <button 
          onClick={() => { setSelected(null); stopAudio(); setSpeaking(null); }} 
          style={backBtn}
          aria-label="Go back"
        >
          ← Wapas
        </button>
        <article style={{
          background: "#111827", borderRadius: "28px", padding: "36px 24px",
          border: `2px solid ${selected.color}`, textAlign: "center",
        }}>
          <div style={{ fontSize: "70px", marginBottom: "8px", animation: "bounce 1.5s ease infinite" }} aria-hidden="true">
            {selected.emoji}
          </div>

          <div style={{ fontSize: "24px", color: selected.color, fontFamily: "serif", direction: "rtl", marginBottom: "2px" }}>
            {selected.word}
          </div>
          <p style={{ fontSize: "13px", color: "#8a9ab0", marginBottom: "16px", letterSpacing: "1px" }}>
            {selected.meaning}
          </p>

          <div style={{
            fontSize: "110px", color: selected.color, fontFamily: "serif",
            lineHeight: 1, filter: `drop-shadow(0 0 28px ${selected.color}66)`, marginBottom: "20px",
          }} aria-label={`Arabic letter ${selected.name}`}>
            {selected.letter}
          </div>

          <button
            onClick={() => playLetter(selected, "detail")}
            aria-label={speaking === "detail" ? "Stop audio" : "Play letter, word and meaning"}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              margin: "0 auto 24px", padding: "12px 32px", borderRadius: "20px", border: "none",
              background: speaking === "detail" ? selected.color : `${selected.color}22`,
              color: speaking === "detail" ? "#0a0f1a" : selected.color,
              fontSize: "15px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s",
              boxShadow: speaking === "detail" ? `0 0 16px ${selected.color}66` : "none",
            }}
          >
            {speaking === "detail" ? "⏹ Ruk Jao" : "🔊 Harf · Lafz · Matlab"}
          </button>

          <h2 style={{ fontSize: "26px", color: "#f0ece0", fontWeight: "800", marginBottom: "4px" }}>{selected.name}</h2>
          <p style={{ fontSize: "15px", color: "#8a9ab0", marginBottom: "28px" }}>
            Awaaz: <span style={{ color: selected.color, fontWeight: "700" }}>"{selected.sound}"</span>
          </p>

          <button
            onClick={() => toggleLearned(selected.name)}
            aria-label={learned.includes(selected.name) ? "Mark as not learned" : "Mark as learned"}
            style={{
              padding: "14px 36px", borderRadius: "20px", border: "none",
              background: learned.includes(selected.name)
                ? `linear-gradient(135deg, #4ade80, #16a34a)`
                : `linear-gradient(135deg, ${selected.color}, ${selected.color}bb)`,
              color: "#0a0f1a", fontSize: "16px", fontWeight: "800", cursor: "pointer",
              boxShadow: `0 4px 16px ${selected.color}44`,
            }}
          >
            {learned.includes(selected.name) ? "✓ Seekh Liya! 🌟" : "Seekh Liya! ⭐"}
          </button>
        </article>
      </div>
    );
  }

  return (
    <div>
      {/* Progress */}
      <div style={{ background: "#111827", borderRadius: "16px", padding: "16px", marginBottom: "16px", border: "1px solid #2a3a4a" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ color: "#f0ece0", fontSize: "13px", fontWeight: "600" }}>Seekhe hue Huroof</span>
          <span style={{ color: "#fbbf24", fontSize: "14px", fontWeight: "800" }}>{learned.length}/28</span>
        </div>
        <div style={{ background: "#0a0f1a", borderRadius: "8px", height: "10px", overflow: "hidden" }} role="progressbar" aria-valuenow={learned.length} aria-valuemin={0} aria-valuemax={28}>
          <div style={{
            background: `linear-gradient(90deg, #fbbf24, #fb923c)`,
            height: "100%", width: `${(learned.length / 28) * 100}%`,
            borderRadius: "8px", transition: "width 0.6s ease",
          }} />
        </div>
        {learned.length === 28 && (
          <p style={{ textAlign: "center", marginTop: "10px", color: "#C9A84C", fontWeight: "700", fontSize: "13px" }}>
            🎉 MashaAllah! Saare huroof seekh liye!
          </p>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
        {ARABIC_LETTERS.map((l, i) => (
          <article
            key={l.name + i}
            style={{
              background: "#111827", borderRadius: "16px", padding: "10px 6px 8px",
              textAlign: "center", cursor: "pointer", position: "relative",
              border: `2px solid ${learned.includes(l.name) ? l.color : "#2a3a4a"}`,
              animation: `popIn 0.3s ease ${i * 0.02}s both`,
              transition: "transform 0.15s, border-color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            onClick={() => setSelected(l)}
            aria-label={`${l.name} - ${l.meaning}`}
          >
            {learned.includes(l.name) && (
              <span style={{ position: "absolute", top: "4px", right: "6px", fontSize: "10px", color: "#4ade80" }} aria-hidden="true">✓</span>
            )}
            <div style={{ fontSize: "16px", marginBottom: "2px" }} aria-hidden="true">{l.emoji}</div>
            <div style={{ fontSize: "32px", color: l.color, fontFamily: "serif", lineHeight: 1.1 }}>
              {l.letter}
            </div>
            <div style={{ fontSize: "9px", color: "#8a9ab0", marginTop: "2px" }}>{l.name}</div>
            <div style={{ fontSize: "10px", color: l.color, fontFamily: "serif", direction: "rtl", marginTop: "2px" }}>
              {l.word}
            </div>
            <div style={{ fontSize: "9px", color: "#8a9ab0", marginTop: "1px" }}>{l.meaning}</div>
            <button
              onClick={e => { e.stopPropagation(); playLetter(l, l.name + i); }}
              aria-label={speaking === l.name + i ? "Stop" : "Listen"}
              style={{
                marginTop: "5px", border: "none", background: "transparent",
                cursor: "pointer", fontSize: "14px", padding: "2px",
                opacity: speaking === l.name + i ? 1 : 0.4, transition: "opacity 0.2s",
              }}
            >
              {speaking === l.name + i ? "⏹" : "🔊"}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}