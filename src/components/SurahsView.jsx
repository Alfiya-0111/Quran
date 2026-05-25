import React, { useState, useCallback } from "react";
import { stopAudio, playSequenceTTS, SHORT_SURAHS, VoiceBtn, backBtn } from "./KidsCorner";

export default function SurahsView() {
  const [selected, setSelected] = useState(null);
  const [speaking, setSpeaking] = useState(null);
  const [playingAll, setPlayingAll] = useState(false);

  const playVerse = useCallback((verse, idx) => {
    if (speaking === idx) { stopAudio(); setSpeaking(null); return; }
    setSpeaking(idx);
    playSequenceTTS([
      { text: verse.ar, lang: "ar", pause: 700 },
      { text: verse.ur, lang: "ur", pause: 400 },
    ], () => setSpeaking(null));
  }, [speaking]);

  const playAllVerses = useCallback((surah) => {
    if (playingAll) { stopAudio(); setPlayingAll(false); return; }
    setPlayingAll(true);
    const seq = surah.verses.flatMap(v => ([
      { text: v.ar, lang: "ar", pause: 600 },
      { text: v.ur, lang: "ur", pause: 900 },
    ]));
    playSequenceTTS(seq, () => setPlayingAll(false));
  }, [playingAll]);

  if (selected) {
    return (
      <div style={{ animation: "fadeUp 0.3s ease" }}>
        <button 
          onClick={() => { setSelected(null); stopAudio(); setSpeaking(null); setPlayingAll(false); }} 
          style={backBtn}
          aria-label="Go back"
        >
          ← Wapas
        </button>
        <article style={{ background: "#111827", borderRadius: "22px", padding: "24px", border: `1px solid ${selected.color}` }}>
          <header style={{ textAlign: "center", marginBottom: "20px" }}>
            <div style={{ fontSize: "40px" }} aria-hidden="true">{selected.emoji}</div>
            <h2 style={{ color: selected.color, fontSize: "22px", fontWeight: "800", marginTop: "8px" }}>{selected.name}</h2>
            <div style={{ color: "#f0ece0", fontSize: "28px", direction: "rtl", fontFamily: "serif", marginTop: "6px", lineHeight: 1.8 }}>
              {selected.arabic}
            </div>
            <p style={{ color: "#8a9ab0", fontSize: "13px", marginTop: "4px" }}>Matlab: {selected.meaning} • {selected.ayahs} Aayaat</p>
            <button
              onClick={() => playAllVerses(selected)}
              aria-label={playingAll ? "Stop recitation" : "Play full surah"}
              style={{
                marginTop: "16px", padding: "10px 28px", borderRadius: "20px", border: "none",
                background: playingAll ? selected.color : `${selected.color}22`,
                color: playingAll ? "#0a0f1a" : selected.color,
                fontSize: "14px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: "8px", margin: "16px auto 0",
              }}
            >
              {playingAll ? "⏹ Rokein" : "🔊 Poori Surah Sunao"}
            </button>
          </header>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {selected.verses.map((v, i) => (
              <div key={i} style={{ background: "#0a0f1a", borderRadius: "14px", padding: "16px", borderLeft: `3px solid ${selected.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: selected.color, fontSize: "20px", direction: "rtl", fontFamily: "serif", textAlign: "right", marginBottom: "8px", lineHeight: 2 }}>
                      {v.ar}
                    </p>
                    <p style={{ color: "#8a9ab0", fontSize: "13px" }}>{v.ur}</p>
                  </div>
                  <VoiceBtn onClick={() => playVerse(v, i)} speaking={speaking === i} color={selected.color} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {SHORT_SURAHS.map((s, i) => (
        <article
          key={s.num}
          onClick={() => setSelected(s)}
          style={{
            background: "#111827", borderRadius: "18px", padding: "18px", cursor: "pointer",
            border: `1px solid #2a3a4a`, display: "flex", alignItems: "center", gap: "14px",
            animation: `slideIn 0.3s ease ${i * 0.05}s both`, transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.background = "#1a2535"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a3a4a"; e.currentTarget.style.background = "#111827"; }}
          aria-label={`${s.name} - ${s.meaning}`}
        >
          <div style={{ fontSize: "36px" }} aria-hidden="true">{s.emoji}</div>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: s.color, fontSize: "17px", fontWeight: "700" }}>{s.name}</h3>
            <div style={{ color: "#f0ece0", fontSize: "18px", fontFamily: "serif", direction: "rtl" }}>{s.arabic}</div>
            <p style={{ color: "#8a9ab0", fontSize: "12px", marginTop: "2px" }}>{s.meaning} • {s.ayahs} aayaat</p>
          </div>
          <div style={{ color: s.color, fontSize: "20px" }} aria-hidden="true">›</div>
        </article>
      ))}
    </div>
  );
}