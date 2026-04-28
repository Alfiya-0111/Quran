import { useState, useEffect, useRef } from "react";

// ============================================================
// DATA
// ============================================================

const CATEGORIES = [
  { id: "morning", label: "صبح کی دعائیں", english: "Morning Azkar", emoji: "🌅", color: "#E8A838" },
  { id: "evening", label: "شام کی دعائیں", english: "Evening Azkar", emoji: "🌙", color: "#7B6FD4" },
  { id: "daily", label: "روزانہ کی دعائیں", english: "Daily Duas", emoji: "🤲", color: "#2C7873" },
  { id: "tasbeeh", label: "تسبیح", english: "Tasbeeh Counter", emoji: "📿", color: "#C9A84C" },
];

const DUAS = {
  morning: [
    {
      arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
      urdu: "Hum ne subah ki aur Allah hi ki baadshahat mein subah hui, aur taarif Allah hi ke liye hai, koi ibadat ke laayiq nahi magar Allah, woh akela hai, uska koi shareek nahi.",
      source: "Muslim", count: 1, title: "Subah ki Dua",
    },
    {
      arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
      urdu: "Ay Allah! Tere hi saath hum ne subah ki, aur tere hi saath hum shaam karenge, aur tere hi saath hum zinda hain, aur tere hi saath marenge, aur tere hi taraf uthna hai.",
      source: "Tirmidhi", count: 1, title: "Subah ki Dua",
    },
    {
      arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ",
      urdu: "Ay Allah! Tu mera Rabb hai, koi ibadat ke laayiq nahi magar tu, tune mujhe paida kiya aur main tera banda hoon.",
      source: "Bukhari", count: 1, title: "Sayyidul Istighfar",
    },
    {
      arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
      urdu: "Allah paak hai aur uski taarif ke saath.",
      source: "Muslim", count: 100, title: "Subah ka Zikr",
    },
    {
      arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
      urdu: "Koi ibadat ke laayiq nahi magar Allah, woh akela hai, uska koi shareek nahi, uski hi baadshahat hai, uski hi taarif hai, aur woh har cheez par qadir hai.",
      source: "Bukhari", count: 10, title: "Subah ka Zikr",
    },
    {
      arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي",
      urdu: "Ay Allah! Mere jism ko aafiyat de, ay Allah! Mere sunaai dene mein aafiyat de, ay Allah! Meri nigaah mein aafiyat de.",
      source: "Abu Dawud", count: 3, title: "Aafiyat ki Dua",
    },
  ],
  evening: [
    {
      arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
      urdu: "Hum ne shaam ki aur Allah hi ki baadshahat mein shaam hui, aur taarif Allah hi ke liye hai.",
      source: "Muslim", count: 1, title: "Shaam ki Dua",
    },
    {
      arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ",
      urdu: "Ay Allah! Tere hi saath hum ne shaam ki, tere hi saath subah karenge, tere hi saath zinda hain, tere hi saath marenge, aur tere hi taraf lawtna hai.",
      source: "Tirmidhi", count: 1, title: "Shaam ki Dua",
    },
    {
      arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
      urdu: "Main Allah ke mukammal kalimaat ki panah maanta hoon, uski makhlooq ki burai se.",
      source: "Muslim", count: 3, title: "Raat ki Hifaazat",
    },
    {
      arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ",
      urdu: "Allah ke naam se, jiske naam ke saath zameen aur aasmaan mein koi cheez nuqsaan nahi pahuncha sakti.",
      source: "Abu Dawud", count: 3, title: "Hifaazat ki Dua",
    },
    {
      arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
      urdu: "Ay Allah! Main tujh se duniya aur aakhirat mein maafi aur aafiyat maangta hoon.",
      source: "Ibn Majah", count: 1, title: "Maafi ki Dua",
    },
  ],
  daily: [
    {
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      urdu: "Allah ke naam se shuru karta hoon jo bahut meharban aur rahm wala hai.",
      source: "Quran", count: 1, title: "Khaane se Pehle",
    },
    {
      arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ",
      urdu: "Ay Allah! Jo tu ne hume rizq diya hai us mein barkat de aur hume dozakh ke azaab se bacha.",
      source: "Ibn Al-Sunni", count: 1, title: "Khaane ki Dua",
    },
    {
      arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
      urdu: "Shukar hai Allah ka jisne hume khilaya, pilaya aur Musalman banaya.",
      source: "Abu Dawud", count: 1, title: "Khaane ke Baad",
    },
    {
      arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
      urdu: "Ay Allah! Main tere paas naapaak mard aur aurat jinon se panah maangta hoon.",
      source: "Bukhari", count: 1, title: "Ghuslkhane mein Jaane se Pehle",
    },
    {
      arabic: "غُفْرَانَكَ",
      urdu: "Ay Allah! Main teri maafi maangta hoon.",
      source: "Tirmidhi", count: 1, title: "Ghuslkhane se Nikalne ke Baad",
    },
    {
      arabic: "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
      urdu: "Allah ke naam se, main Allah par bharosa karta hoon, koi taaqat aur quwwat nahi siwaay Allah ke.",
      source: "Abu Dawud", count: 1, title: "Ghar se Nikalte Waqt",
    },
    {
      arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلَجِ وَخَيْرَ الْمَخْرَجِ",
      urdu: "Ay Allah! Main tujh se daakhil hone aur nikalte waqt bhalai maangta hoon.",
      source: "Abu Dawud", count: 1, title: "Ghar Mein Daakhil Hote Waqt",
    },
    {
      arabic: "اللَّهُمَّ اغْفِرْ لِي ذَنْبِي، وَوَسِّعْ لِي فِي دَارِي، وَبَارِكْ لِي فِي رِزْقِي",
      urdu: "Ay Allah! Mere gunaah maaf kar, mere ghar mein wusat de, aur meri rizq mein barkat de.",
      source: "Al-Nasa'i", count: 1, title: "Ghar Mein Daakhil Hote Waqt",
    },
    {
      arabic: "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا",
      urdu: "Allah ke naam se hum daakhil hue, Allah ke naam se hum nikalte hain, aur apne Rabb Allah par hum ne bharosa kiya.",
      source: "Abu Dawud", count: 1, title: "Ghar ki Dua",
    },
    {
      arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا",
      urdu: "Ay Allah! Main tujh se faida dene wala ilm, paak rizq, aur maqbool amal maangta hoon.",
      source: "Ibn Majah", count: 1, title: "Subah ki Dua",
    },
    {
      arabic: "اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي",
      urdu: "Ay Allah! Mere deen ko theek kar jo meri hifaazat ka zariya hai.",
      source: "Muslim", count: 1, title: "Deen ki Dua",
    },
    {
      arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
      urdu: "Ay mere Rabb! Mera seena khol de aur mera kaam aasaan kar de.",
      source: "Quran 20:25-26", count: 1, title: "Mushkil Mein Dua",
    },
    {
      arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
      urdu: "Hamare liye Allah kaafi hai aur woh kya achha kaarsa'az hai.",
      source: "Quran 3:173", count: 1, title: "Mushkil Mein Dua",
    },
    {
      arabic: "لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
      urdu: "Koi ibadat ke laayiq nahi magar tu, tu paak hai, beshak main zaalinon mein se tha.",
      source: "Quran 21:87", count: 1, title: "Pareshani Mein Dua (Yunus AS)",
    },
    {
      arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَأَعُوذُ بِكَ مِنَ النَّارِ",
      urdu: "Ay Allah! Main tujh se Jannat maangta hoon aur dozakh se panah maangta hoon.",
      source: "Abu Dawud", count: 3, title: "Jannat ki Dua",
    },
    {
      arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      urdu: "Ay hamare Rabb! Hume duniya mein bhalai de aur aakhirat mein bhalai de aur hume dozakh ke azaab se bacha.",
      source: "Quran 2:201", count: 1, title: "Masnoon Dua",
    },
  ],
};

const TASBEEHAT = [
  { arabic: "سُبْحَانَ اللَّهِ", urdu: "Allah paak hai", target: 33, color: "#2C7873" },
  { arabic: "الْحَمْدُ لِلَّهِ", urdu: "Shukar Allah ka", target: 33, color: "#C9A84C" },
  { arabic: "اللَّهُ أَكْبَرُ", urdu: "Allah sab se bada", target: 34, color: "#7B6FD4" },
  { arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ", urdu: "Koi ilaah nahi siwa Allah ke", target: 100, color: "#E8A838" },
  { arabic: "أَسْتَغْفِرُ اللَّهَ", urdu: "Main Allah se maafi maangta hoon", target: 100, color: "#C0392B" },
  { arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", urdu: "Allah paak hai apni taarif ke saath", target: 100, color: "#27AE60" },
  { arabic: "صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ", urdu: "Durood Shareef", target: 100, color: "#3498DB" },
];

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function DuasAzkar() {
  const [activeCategory, setActiveCategory] = useState("morning");
  const [expandedDua, setExpandedDua] = useState(null);
  const [completedDuas, setCompletedDuas] = useState({});

  // Tasbeeh state
  const [activeTasbeeh, setActiveTasbeeh] = useState(0);
  const [counts, setCounts] = useState(TASBEEHAT.map(() => 0));
  const [vibrate, setVibrate] = useState(false);
  const pressTimer = useRef(null);

  const currentDuas = DUAS[activeCategory] || [];
  const currentTasbeeh = TASBEEHAT[activeTasbeeh];

  const toggleDua = (idx) => {
    const key = `${activeCategory}-${idx}`;
    setCompletedDuas(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isDuaCompleted = (idx) => completedDuas[`${activeCategory}-${idx}`];

  const tap = () => {
    const newCounts = [...counts];
    newCounts[activeTasbeeh] += 1;
    setCounts(newCounts);
    setVibrate(true);
    setTimeout(() => setVibrate(false), 150);
    if (navigator.vibrate) navigator.vibrate(30);
  };

  const resetCount = () => {
    const newCounts = [...counts];
    newCounts[activeTasbeeh] = 0;
    setCounts(newCounts);
  };

  const count = counts[activeTasbeeh];
  const target = currentTasbeeh.target;
  const progress = Math.min((count / target) * 100, 100);
  const isComplete = count >= target;

  return (
    <div style={{ minHeight: "100vh", background: "#07090d", color: "#e2d9c8", fontFamily: "'Georgia', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:ital@0;1&display=swap');
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #1e2830; border-radius: 4px; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pop { 0%{transform:scale(1)} 40%{transform:scale(0.94)} 100%{transform:scale(1)} }
        @keyframes ring { 0%{transform:scale(1)} 25%{transform:scale(1.12)} 50%{transform:scale(0.96)} 75%{transform:scale(1.06)} 100%{transform:scale(1)} }
        @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(201,168,76,0.2)} 50%{box-shadow:0 0 40px rgba(201,168,76,0.5)} }
        .fade-up { animation: fadeUp 0.35s ease forwards; }
        .vibrate { animation: pop 0.15s ease; }
        .complete-ring { animation: ring 0.4s ease, glow 2s ease infinite; }
        .cat-btn:hover { opacity: 0.85; }
        .dua-card:hover { background: rgba(255,255,255,0.04) !important; }
      `}</style>

      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "rgba(7,9,13,0.97)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(201,168,76,0.1)",
        padding: "14px 16px",
      }}>
        <div style={{ maxWidth: "520px", margin: "0 auto" }}>
          <div style={{ fontSize: "18px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>🤲</span> Duas & Azkar
          </div>

          {/* Category Tabs */}
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "2px" }}>
            {CATEGORIES.map(cat => (
              <button key={cat.id} className="cat-btn"
                onClick={() => { setActiveCategory(cat.id); setExpandedDua(null); }}
                style={{
                  background: activeCategory === cat.id ? `rgba(${hexRgb(cat.color)},0.2)` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${activeCategory === cat.id ? cat.color : "rgba(255,255,255,0.08)"}`,
                  color: activeCategory === cat.id ? cat.color : "#6a5f52",
                  borderRadius: "20px", padding: "6px 14px", cursor: "pointer",
                  fontSize: "12px", whiteSpace: "nowrap", flexShrink: 0,
                  transition: "all 0.2s",
                }}>
                {cat.emoji} {cat.english}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "16px 16px 100px" }}>

        {/* ── TASBEEH VIEW ── */}
        {activeCategory === "tasbeeh" && (
          <div className="fade-up">
            {/* Tasbeeh selector */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
              {TASBEEHAT.map((t, i) => (
                <button key={i}
                  onClick={() => setActiveTasbeeh(i)}
                  style={{
                    background: activeTasbeeh === i ? `rgba(${hexRgb(t.color)},0.2)` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${activeTasbeeh === i ? t.color : "rgba(255,255,255,0.07)"}`,
                    color: activeTasbeeh === i ? t.color : "#6a5f52",
                    borderRadius: "12px", padding: "8px 14px", cursor: "pointer",
                    fontSize: "12px", transition: "all 0.2s",
                  }}>
                  {t.urdu}
                </button>
              ))}
            </div>

            {/* Main Counter */}
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              {/* Arabic text */}
              <div style={{
                fontFamily: "'Amiri', serif", fontSize: "32px",
                color: currentTasbeeh.color, lineHeight: "2",
                marginBottom: "4px", direction: "rtl",
              }}>
                {currentTasbeeh.arabic}
              </div>
              <div style={{ fontSize: "13px", color: "#6a5f52", marginBottom: "24px" }}>
                {currentTasbeeh.urdu}
              </div>

              {/* Count display */}
              <div style={{
                fontSize: "72px", fontWeight: "300", lineHeight: 1,
                color: isComplete ? currentTasbeeh.color : "#e2d9c8",
                marginBottom: "8px",
                transition: "color 0.3s",
                fontFamily: "Georgia, serif",
              }}>
                {count}
              </div>
              <div style={{ fontSize: "13px", color: "#4a4030", marginBottom: "24px" }}>
                Target: {target}
              </div>

              {/* Progress bar */}
              <div style={{
                height: "4px", background: "rgba(255,255,255,0.06)",
                borderRadius: "2px", marginBottom: "32px", overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", width: `${progress}%`,
                  background: currentTasbeeh.color,
                  borderRadius: "2px", transition: "width 0.2s ease",
                }} />
              </div>

              {/* TAP BUTTON */}
              <button
                className={vibrate ? "vibrate" : isComplete ? "complete-ring" : ""}
                onClick={tap}
                style={{
                  width: "180px", height: "180px", borderRadius: "50%",
                  background: isComplete
                    ? `rgba(${hexRgb(currentTasbeeh.color)},0.15)`
                    : "rgba(255,255,255,0.04)",
                  border: `3px solid ${isComplete ? currentTasbeeh.color : "rgba(255,255,255,0.1)"}`,
                  cursor: "pointer", display: "inline-flex",
                  flexDirection: "column", alignItems: "center", justifyContent: "center",
                  gap: "6px", transition: "all 0.2s",
                  boxShadow: isComplete ? `0 0 30px rgba(${hexRgb(currentTasbeeh.color)},0.3)` : "none",
                }}>
                <span style={{ fontSize: "40px" }}>{isComplete ? "✅" : "📿"}</span>
                <span style={{ fontSize: "13px", color: isComplete ? currentTasbeeh.color : "#6a5f52" }}>
                  {isComplete ? "Mukammal!" : "Tap karein"}
                </span>
              </button>

              {/* Reset */}
              <div style={{ marginTop: "20px" }}>
                <button onClick={resetCount} style={{
                  background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
                  color: "#4a4030", borderRadius: "20px", padding: "8px 20px",
                  cursor: "pointer", fontSize: "12px", transition: "all 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.color = "#C0392B"}
                  onMouseLeave={e => e.currentTarget.style.color = "#4a4030"}
                >
                  Reset ↺
                </button>
              </div>
            </div>

            {/* All counts summary */}
            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "16px", padding: "16px",
            }}>
              <div style={{ fontSize: "11px", color: "#3a3028", letterSpacing: "1px", marginBottom: "12px" }}>
                AAPKI TASBEEHAT
              </div>
              {TASBEEHAT.map((t, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "8px 0",
                  borderBottom: i < TASBEEHAT.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}>
                  <div style={{ fontFamily: "'Amiri', serif", fontSize: "16px", color: t.color, direction: "rtl" }}>
                    {t.arabic}
                  </div>
                  <div style={{
                    fontSize: "14px",
                    color: counts[i] >= t.target ? t.color : "#6a5f52",
                    fontWeight: counts[i] >= t.target ? "bold" : "normal",
                  }}>
                    {counts[i]}/{t.target} {counts[i] >= t.target ? "✓" : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── DUA LIST VIEW ── */}
        {activeCategory !== "tasbeeh" && (
          <div>
            {/* Progress indicator */}
            <div style={{
              display: "flex", justifyContent: "space-between",
              fontSize: "11px", color: "#4a4030", marginBottom: "16px",
              letterSpacing: "0.5px",
            }}>
              <span>
                {Object.keys(completedDuas).filter(k => k.startsWith(activeCategory)).length} / {currentDuas.length} mukammal
              </span>
              <button
                onClick={() => {
                  const newCompleted = { ...completedDuas };
                  currentDuas.forEach((_, i) => {
                    newCompleted[`${activeCategory}-${i}`] = false;
                  });
                  setCompletedDuas(newCompleted);
                }}
                style={{ background: "none", border: "none", color: "#3a3028", cursor: "pointer", fontSize: "11px" }}
              >
                Reset ↺
              </button>
            </div>

            {currentDuas.map((dua, idx) => {
              const completed = isDuaCompleted(idx);
              const isExpanded = expandedDua === idx;
              const cat = CATEGORIES.find(c => c.id === activeCategory);

              return (
                <div key={idx} className="dua-card fade-up"
                  style={{
                    background: completed ? `rgba(${hexRgb(cat.color)},0.06)` : "rgba(255,255,255,0.025)",
                    border: `1px solid ${completed ? `rgba(${hexRgb(cat.color)},0.3)` : "rgba(255,255,255,0.07)"}`,
                    borderRadius: "18px", padding: "20px",
                    marginBottom: "10px", cursor: "pointer",
                    transition: "all 0.25s", animationDelay: `${idx * 0.04}s`, opacity: 0,
                  }}
                  onClick={() => setExpandedDua(isExpanded ? null : idx)}
                >
                  {/* Top row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{
                        fontSize: "10px", color: cat.color,
                        background: `rgba(${hexRgb(cat.color)},0.12)`,
                        padding: "3px 10px", borderRadius: "12px", letterSpacing: "0.3px",
                      }}>
                        {dua.title}
                      </div>
                      {dua.count > 1 && (
                        <div style={{ fontSize: "10px", color: "#5a5040" }}>×{dua.count}</div>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ fontSize: "10px", color: "#3a3028" }}>{dua.source}</div>
                      <button
                        onClick={e => { e.stopPropagation(); toggleDua(idx); }}
                        style={{
                          width: "26px", height: "26px", borderRadius: "50%",
                          background: completed ? cat.color : "rgba(255,255,255,0.06)",
                          border: `1px solid ${completed ? cat.color : "rgba(255,255,255,0.1)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer", fontSize: "12px", flexShrink: 0,
                          transition: "all 0.2s",
                        }}>
                        {completed ? "✓" : ""}
                      </button>
                    </div>
                  </div>

                  {/* Arabic */}
                  <div style={{
                    fontFamily: "'Amiri', serif", fontSize: "22px",
                    direction: "rtl", textAlign: "right", color: "#f0e8d5",
                    lineHeight: "2.2", marginBottom: isExpanded ? "12px" : "0",
                  }}>
                    {dua.arabic}
                  </div>

                  {/* Urdu — shown on expand */}
                  {isExpanded && (
                    <div style={{
                      paddingTop: "12px",
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      fontSize: "13px", color: "#9a8870",
                      lineHeight: "1.9", fontStyle: "italic",
                    }}>
                      {dua.urdu}
                    </div>
                  )}

                  {/* Expand hint */}
                  {!isExpanded && (
                    <div style={{ textAlign: "center", marginTop: "8px", fontSize: "10px", color: "#2a2520" }}>
                      ▼ Urdu dekhein
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function hexRgb(hex) {
  if (!hex) return "201,168,76";
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : "201,168,76";
}