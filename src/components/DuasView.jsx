import React, { useState, useCallback } from "react";
import { stopAudio, playSequenceTTS, DUAS_KIDS, VoiceBtn } from "./KidsCorner";

export default function DuasView() {
  const [flipped, setFlipped] = useState(null);
  const [speaking, setSpeaking] = useState(null);

  const playDua = useCallback((d, i) => {
    if (speaking === i) { stopAudio(); setSpeaking(null); return; }
    setSpeaking(i);
    playSequenceTTS([
      { text: d.arabic, lang: "ar", pause: 900 },
      { text: d.urdu,   lang: "ur", pause: 300 },
    ], () => setSpeaking(null));
  }, [speaking]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {DUAS_KIDS.map((d, i) => (
        <article
          key={d.title}
          style={{
            background: "#111827", borderRadius: "18px", padding: "18px", cursor: "pointer",
            border: `1px solid ${flipped === i ? d.color : "#2a3a4a"}`,
            transition: "border 0.2s", animation: `slideIn 0.3s ease ${i * 0.05}s both`,
          }}
          onClick={() => setFlipped(flipped === i ? null : i)}
          aria-expanded={flipped === i}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ fontSize: "28px" }} aria-hidden="true">{d.emoji}</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ color: d.color, fontSize: "15px", fontWeight: "700" }}>{d.title}</h3>
              {flipped === i && (
                <div style={{ animation: "fadeUp 0.2s ease" }}>
                  <p style={{ color: "#f0ece0", fontSize: "22px", fontFamily: "serif", direction: "rtl", textAlign: "right", marginTop: "12px", lineHeight: 2 }}>
                    {d.arabic}
                  </p>
                  <p style={{ color: "#8a9ab0", fontSize: "13px", marginTop: "6px" }}>{d.urdu}</p>
                </div>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <VoiceBtn onClick={() => playDua(d, i)} speaking={speaking === i} color={d.color} size="sm" />
              <div style={{ color: d.color, fontSize: "18px" }} aria-hidden="true">{flipped === i ? "▲" : "▼"}</div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}