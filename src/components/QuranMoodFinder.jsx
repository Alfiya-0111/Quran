import { useState } from "react";

const moods = [
  { id: "anxious", label: "پریشان ہوں", emoji: "😟", english: "Anxious / Worried", color: "#6B7FD7" },
  { id: "sad", label: "اداس ہوں", emoji: "😢", english: "Sad / Heartbroken", color: "#7E6FAB" },
  { id: "hopeless", label: "امید نہیں", emoji: "🌑", english: "Hopeless / Lost", color: "#4A5568" },
  { id: "grateful", label: "شکرگزار ہوں", emoji: "🌟", english: "Grateful / Blessed", color: "#C9A84C" },
  { id: "angry", label: "غصہ ہے", emoji: "😤", english: "Angry / Frustrated", color: "#C0392B" },
  { id: "lonely", label: "اکیلا محسوس", emoji: "🌙", english: "Lonely / Isolated", color: "#2C7873" },
  { id: "seeking", label: "رہنمائی چاہیے", emoji: "🧭", english: "Seeking Guidance", color: "#27AE60" },
  { id: "fearful", label: "ڈر لگ رہا", emoji: "😰", english: "Fearful / Scared", color: "#8E44AD" },
];

const moodPrompts = {
  anxious: "I am feeling very anxious and worried. Please find me 3 Quran ayahs (with surah name, ayah number, Arabic text, and Urdu/Hindi translation) that bring peace and calm to an anxious heart. Format as JSON array with fields: arabic, translation, surah, ayahNumber, reflection.",
  sad: "I am feeling very sad and heartbroken. Please find me 3 Quran ayahs that console and comfort a sad heart. Format as JSON array with fields: arabic, translation, surah, ayahNumber, reflection.",
  hopeless: "I am feeling hopeless and lost in life. Please find me 3 Quran ayahs about hope, Allah's mercy, and never giving up. Format as JSON array with fields: arabic, translation, surah, ayahNumber, reflection.",
  grateful: "I am feeling grateful and blessed. Please find me 3 Quran ayahs about gratitude, shukr, and recognizing Allah's blessings. Format as JSON array with fields: arabic, translation, surah, ayahNumber, reflection.",
  angry: "I am feeling very angry and frustrated. Please find me 3 Quran ayahs about controlling anger, patience, and forgiveness. Format as JSON array with fields: arabic, translation, surah, ayahNumber, reflection.",
  lonely: "I am feeling very lonely and isolated. Please find me 3 Quran ayahs reminding that Allah is always near and we are never alone. Format as JSON array with fields: arabic, translation, surah, ayahNumber, reflection.",
  seeking: "I am seeking guidance in life and feel confused about my path. Please find me 3 Quran ayahs about guidance, the right path, and trusting Allah's plan. Format as JSON array with fields: arabic, translation, surah, ayahNumber, reflection.",
  fearful: "I am feeling very fearful and scared. Please find me 3 Quran ayahs that remove fear and replace it with trust in Allah. Format as JSON array with fields: arabic, translation, surah, ayahNumber, reflection.",
};

const SYSTEM_PROMPT = `You are a knowledgeable Islamic scholar assistant specializing in Quran. 
When asked for ayahs based on mood, provide ACCURATE ayahs with correct Arabic text, surah names, and ayah numbers.
Always respond ONLY with a valid JSON array. No markdown, no backticks, no extra text. Just pure JSON.
The translation should be in simple Urdu/Hindi that anyone can understand.
The reflection should be 1-2 sentences in Hinglish (Hindi-English mix) connecting the ayah to the emotion.`;

export default function QuranMoodFinder() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeCard, setActiveCard] = useState(null);

const findAyahs = async (mood) => {
  setSelectedMood(mood);
  setLoading(true);
  setError("");
  setAyahs([]);
  setActiveCard(null);

  // Pehle check karo localStorage mein hai ya nahi
  const cacheKey = `quran_mood_${mood.id}`;
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    setAyahs(JSON.parse(cached));
    setLoading(false);
    return;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": import.meta.env.VITE_GEMINI_API_KEY,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: moodPrompts[mood.id] }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    
    // LocalStorage mein save karo
    localStorage.setItem(cacheKey, JSON.stringify(parsed));
    
    setAyahs(parsed);
  } catch (err) {
    console.error("API Error:", err);
    setError("Aapka free quota khatam ho gaya hai. Thodi der baad try karein ya nayi API key use karein.");
  } finally {
    setLoading(false);
  }
};
  const activeMoodObj = moods.find((m) => m.id === selectedMood?.id);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0f 0%, #0f1923 50%, #0a0f0a 100%)",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#e8dcc8",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none",
        backgroundImage: `radial-gradient(circle at 20% 20%, rgba(201,168,76,0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(107,127,215,0.05) 0%, transparent 50%)`,
        zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "720px", margin: "0 auto", padding: "40px 20px 80px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ fontSize: "42px", marginBottom: "8px", letterSpacing: "8px", color: "#C9A84C", opacity: 0.9 }}>
            ﷽
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: "400", letterSpacing: "2px", color: "#e8dcc8", margin: "0 0 8px", textShadow: "0 0 40px rgba(201,168,76,0.3)" }}>
            Quran — Dil Ka Dawa
          </h1>
          <p style={{ color: "#8a7a6a", fontSize: "14px", letterSpacing: "1px", margin: 0 }}>
            قرآن دل کا دوا • Apni Kaifiyat Batao
          </p>
          <div style={{ width: "60px", height: "1px", background: "linear-gradient(90deg, transparent, #C9A84C, transparent)", margin: "20px auto 0" }} />
        </div>

        {/* Mood Selection */}
        {!selectedMood && (
          <div>
            <p style={{ textAlign: "center", color: "#a09080", marginBottom: "32px", fontSize: "15px" }}>
              Abhi aap kaisa mehsoos kar rahe hain?
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px" }}>
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => findAyahs(mood)}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "16px", padding: "20px 16px",
                    cursor: "pointer", transition: "all 0.3s ease",
                    textAlign: "center", color: "#e8dcc8",
                    backdropFilter: "blur(10px)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `rgba(${hexToRgb(mood.color)}, 0.12)`;
                    e.currentTarget.style.borderColor = mood.color;
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = `0 8px 30px rgba(${hexToRgb(mood.color)}, 0.15)`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ fontSize: "30px", marginBottom: "8px" }}>{mood.emoji}</div>
                  <div style={{ fontSize: "17px", fontFamily: "'Noto Nastaliq Urdu', serif", lineHeight: 1.8 }}>
                    {mood.label}
                  </div>
                  <div style={{ fontSize: "11px", color: "#6a5f52", marginTop: "4px", letterSpacing: "0.5px" }}>
                    {mood.english}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: "36px", marginBottom: "20px", animation: "pulse 1.5s infinite" }}>📿</div>
            <p style={{ color: "#C9A84C", fontSize: "16px", letterSpacing: "1px" }}>
              Quran se aapke liye dhundh raha hoon...
            </p>
            <p style={{ color: "#5a4f42", fontSize: "13px", marginTop: "8px" }}>
              {activeMoodObj?.label} — {activeMoodObj?.english}
            </p>
            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ textAlign: "center", padding: "40px", color: "#C0392B" }}>
            <div style={{ fontSize: "30px", marginBottom: "12px" }}>⚠️</div>
            <p>{error}</p>
            <button onClick={() => setSelectedMood(null)} style={{
              marginTop: "16px", background: "transparent",
              border: "1px solid #C9A84C", color: "#C9A84C",
              padding: "10px 24px", borderRadius: "8px", cursor: "pointer",
            }}>
              Wapas Jao
            </button>
          </div>
        )}

        {/* Ayahs */}
        {ayahs.length > 0 && !loading && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>{activeMoodObj?.emoji}</div>
              <h2 style={{ fontSize: "18px", fontWeight: "400", color: activeMoodObj?.color, margin: "0 0 4px" }}>
                {activeMoodObj?.label}
              </h2>
              <p style={{ color: "#5a4f42", fontSize: "13px", margin: 0 }}>Allah ka kalam — aapke liye</p>
            </div>

            {ayahs.map((ayah, i) => (
              <div
                key={i}
                onClick={() => setActiveCard(activeCard === i ? null : i)}
                style={{
                  background: activeCard === i ? `rgba(${hexToRgb(activeMoodObj?.color || "#C9A84C")}, 0.08)` : "rgba(255,255,255,0.025)",
                  border: `1px solid ${activeCard === i ? activeMoodObj?.color || "#C9A84C" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: "20px", padding: "28px 24px",
                  marginBottom: "16px", cursor: "pointer",
                  transition: "all 0.4s ease", backdropFilter: "blur(10px)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div style={{
                    background: `rgba(${hexToRgb(activeMoodObj?.color || "#C9A84C")}, 0.2)`,
                    color: activeMoodObj?.color || "#C9A84C",
                    fontSize: "11px", padding: "4px 12px", borderRadius: "20px",
                  }}>
                    {ayah.surah} • Ayah {ayah.ayahNumber}
                  </div>
                  <div style={{ color: "#3a3028", fontSize: "18px" }}>{activeCard === i ? "▲" : "▼"}</div>
                </div>

                <div style={{
                  fontSize: "24px", lineHeight: "2.2", textAlign: "right", direction: "rtl",
                  color: "#e8dcc8", fontFamily: "'Amiri', 'Traditional Arabic', serif",
                  marginBottom: "16px", padding: "12px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}>
                  {ayah.arabic}
                </div>

                <p style={{ color: "#b0a090", fontSize: "14px", lineHeight: "1.8", margin: 0, fontStyle: "italic" }}>
                  {ayah.translation}
                </p>

                {activeCard === i && (
                  <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <span style={{ fontSize: "16px", flexShrink: 0 }}>💭</span>
                      <p style={{ color: activeMoodObj?.color || "#C9A84C", fontSize: "13px", lineHeight: "1.8", margin: 0, opacity: 0.9 }}>
                        {ayah.reflection}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div style={{ textAlign: "center", marginTop: "32px" }}>
              <button
                onClick={() => { setSelectedMood(null); setAyahs([]); }}
                style={{
                  background: "transparent", border: "1px solid rgba(201,168,76,0.4)",
                  color: "#C9A84C", padding: "12px 32px", borderRadius: "30px",
                  cursor: "pointer", fontSize: "14px", letterSpacing: "1px", transition: "all 0.3s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
              >
                ← Dusra Mood Choose Karein
              </button>
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "60px", color: "#3a3028", fontSize: "12px" }}>
          <p style={{ margin: "0 0 4px" }}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          <p style={{ margin: 0 }}>Sadqa-e-Jariya • Free Forever</p>
        </div>
      </div>
    </div>
  );
}

function hexToRgb(hex) {
  if (!hex) return "201,168,76";
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : "201,168,76";
}