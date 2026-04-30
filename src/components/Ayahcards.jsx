import { useState, useRef } from "react";
import { BsDownload, BsShare, BsPalette, BsTypeH1, BsCheck2 } from "react-icons/bs";
import { FaHandsPraying } from "react-icons/fa6";

import { TbBuildingMosque } from "react-icons/tb";

// ── Curated Ayahs ──
const AYAHS = [
  { arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", urdu: "Beshak mushkil ke saath aasaani hai.", surah: "Al-Inshirah", ayah: "94:5" },
  { arabic: "وَلَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ", urdu: "Allah ki rahmat se mayoos mat ho.", surah: "Az-Zumar", ayah: "39:53" },
  { arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", urdu: "Beshak Allah sabr karne walon ke saath hai.", surah: "Al-Baqarah", ayah: "2:153" },
  { arabic: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ", urdu: "Woh tumhare saath hai jahan bhi tum ho.", surah: "Al-Hadid", ayah: "57:4" },
  { arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", urdu: "Hamare liye Allah kaafi hai, woh kya achha kaarsa'az hai!", surah: "Aali Imran", ayah: "3:173" },
  { arabic: "رَبِّ زِدْنِي عِلْمًا", urdu: "Ay mere Rabb! Mujhe ilm mein izafa farmao.", surah: "Ta-Ha", ayah: "20:114" },
  { arabic: "لَا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ", urdu: "Koi ilaah nahi magar tu, tu paak hai, main zaalinon mein se tha.", surah: "Al-Anbiya", ayah: "21:87" },
  { arabic: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ", urdu: "Allah aasmano aur zameen ka noor hai.", surah: "An-Nur", ayah: "24:35" },
  { arabic: "وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ", urdu: "Ho sakta hai tum kisi cheez ko na pasand karo aur woh tumhare liye behtar ho.", surah: "Al-Baqarah", ayah: "2:216" },
  { arabic: "إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ", urdu: "Beshak Allah neki karne walon ka ajar zaaya nahi karta.", surah: "At-Tawbah", ayah: "9:120" },
  { arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", urdu: "Jo Allah par bharosa kare woh uske liye kaafi hai.", surah: "At-Talaq", ayah: "65:3" },
  { arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", urdu: "Sun lo! Allah ki yaad se hi dilon ko sukoon milta hai.", surah: "Ar-Ra'd", ayah: "13:28" },
  { arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً", urdu: "Ay Rabb! Duniya mein bhalai de aur aakhirat mein bhalai de.", surah: "Al-Baqarah", ayah: "2:201" },
  { arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", urdu: "Beshak mushkil ke saath aasaani hai.", surah: "Al-Inshirah", ayah: "94:6" },
  { arabic: "وَقُل رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا", urdu: "Aur kaho: Ay mere Rabb! Un dono par rahm kar jaise unhon ne mujhe bachpan mein pala.", surah: "Al-Isra", ayah: "17:24" },
];

// ── Themes ──
const THEMES = [
  {
    id: "dark_gold",
    name: "Dark Gold",
    bg: "linear-gradient(135deg, #0a0a0f 0%, #0f1923 100%)",
    border: "rgba(201,168,76,0.4)",
    arabicColor: "#C9A84C",
    urduColor: "#a09080",
    surahColor: "rgba(201,168,76,0.6)",
    pattern: "radial-gradient(circle at 20% 20%, rgba(201,168,76,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(107,127,215,0.06) 0%, transparent 50%)",
  },
  {
    id: "green",
    name: "Islamic Green",
    bg: "linear-gradient(135deg, #0a1f0a 0%, #0f2d1a 100%)",
    border: "rgba(39,174,96,0.4)",
    arabicColor: "#2ecc71",
    urduColor: "#8fbc8f",
    surahColor: "rgba(39,174,96,0.6)",
    pattern: "radial-gradient(circle at 30% 30%, rgba(39,174,96,0.1) 0%, transparent 50%)",
  },
  {
    id: "purple",
    name: "Night Sky",
    bg: "linear-gradient(135deg, #0d0a1f 0%, #1a0f2d 100%)",
    border: "rgba(123,111,212,0.4)",
    arabicColor: "#9b8fe8",
    urduColor: "#8a7aa8",
    surahColor: "rgba(123,111,212,0.6)",
    pattern: "radial-gradient(circle at 70% 20%, rgba(123,111,212,0.1) 0%, transparent 50%)",
  },
  {
    id: "warm",
    name: "Warm Sunset",
    bg: "linear-gradient(135deg, #1f0a0a 0%, #2d1505 100%)",
    border: "rgba(232,168,56,0.4)",
    arabicColor: "#E8A838",
    urduColor: "#b09060",
    surahColor: "rgba(232,168,56,0.6)",
    pattern: "radial-gradient(circle at 50% 0%, rgba(232,168,56,0.1) 0%, transparent 60%)",
  },
  {
    id: "light",
    name: "Clean White",
    bg: "linear-gradient(135deg, #f8f4ee 0%, #ede8e0 100%)",
    border: "rgba(139,110,60,0.3)",
    arabicColor: "#5a3a10",
    urduColor: "#7a6a50",
    surahColor: "rgba(139,110,60,0.5)",
    pattern: "radial-gradient(circle at 20% 20%, rgba(201,168,76,0.08) 0%, transparent 50%)",
  },
  {
    id: "blue",
    name: "Ocean",
    bg: "linear-gradient(135deg, #0a0f1f 0%, #0a1a2d 100%)",
    border: "rgba(52,152,219,0.4)",
    arabicColor: "#5dade2",
    urduColor: "#7a9ab0",
    surahColor: "rgba(52,152,219,0.5)",
    pattern: "radial-gradient(circle at 80% 20%, rgba(52,152,219,0.1) 0%, transparent 50%)",
  },
];

const FONT_SIZES = [
  { id: "sm", label: "چھوٹا", arabic: 24, urdu: 13 },
  { id: "md", label: "درمیانہ", arabic: 30, urdu: 14 },
  { id: "lg", label: "بڑا", arabic: 36, urdu: 15 },
];

export default function AyahCards() {
  const [selectedAyah, setSelectedAyah] = useState(AYAHS[0]);
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [fontSize, setFontSize] = useState(FONT_SIZES[1]);
  const [showUrdu, setShowUrdu] = useState(true);
  const [showSurah, setShowSurah] = useState(true);
  const [showBismillah, setShowBismillah] = useState(true);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  const theme = selectedTheme;

  const handleShare = async () => {
    const text = `${selectedAyah.arabic}\n\n${selectedAyah.urdu}\n\n— ${selectedAyah.surah} (${selectedAyah.ayah})\n\n🌟 Noor Al-Quran App`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Quran Ayah", text });
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = async () => {
    const card = cardRef.current;
    if (!card) return;
    try {
      const { default: html2canvas } = await import("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.esm.min.js");
      const canvas = await html2canvas(card, { scale: 3, useCORS: true, backgroundColor: null });
      const link = document.createElement("a");
      link.download = `quran-ayah-${selectedAyah.ayah.replace(":", "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      alert("Download ke liye html2canvas install karein:\nnpm install html2canvas");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#07090d", color: "#e2d9c8", fontFamily: "'Georgia', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:ital@0;1&display=swap');
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #1e2830; border-radius: 4px; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.3s ease forwards; }
        .ayah-pill:hover { border-color: rgba(201,168,76,0.4) !important; color: #C9A84C !important; }
        .theme-dot:hover { transform: scale(1.15); }
      `}</style>

      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "rgba(7,9,13,0.97)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(201,168,76,0.1)", padding: "14px 16px",
      }}>
        <div style={{ maxWidth: "520px", margin: "0 auto", display: "flex", alignItems: "center", gap: "8px" }}>
        <FaHandsPraying size={18} color="#C9A84C" />
          <span style={{ fontSize: "17px" }}>Ayah Cards</span>
          <span style={{ fontSize: "11px", color: "#4a4030", marginLeft: "4px" }}>Share karein</span>
        </div>
      </div>

      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "16px 16px 100px" }}>

        {/* ── CARD PREVIEW ── */}
        <div className="fade-up" style={{ marginBottom: "24px" }}>
          <div
            ref={cardRef}
            style={{
              background: theme.bg,
              backgroundImage: theme.pattern + ", " + theme.bg,
              border: `1px solid ${theme.border}`,
              borderRadius: "20px",
              padding: "32px 28px",
              position: "relative",
              overflow: "hidden",
              minHeight: "220px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}>

            {/* Decorative corner */}
            <div style={{
              position: "absolute", top: 0, right: 0,
              width: "80px", height: "80px",
              background: `radial-gradient(circle at top right, ${theme.border}, transparent 70%)`,
              borderRadius: "0 20px 0 0",
            }} />
            <div style={{
              position: "absolute", bottom: 0, left: 0,
              width: "60px", height: "60px",
              background: `radial-gradient(circle at bottom left, ${theme.border}, transparent 70%)`,
              borderRadius: "0 0 0 20px",
            }} />

            {/* Bismillah */}
            {showBismillah && (
              <div style={{
                fontFamily: "'Amiri', serif",
                fontSize: "18px",
                color: theme.arabicColor,
                opacity: 0.5,
                textAlign: "center",
                marginBottom: "16px",
                letterSpacing: "2px",
              }}>
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>
            )}

            {/* Arabic */}
            <div style={{
              fontFamily: "'Amiri', serif",
              fontSize: `${fontSize.arabic}px`,
              direction: "rtl",
              textAlign: "center",
              color: theme.arabicColor,
              lineHeight: "2.2",
              marginBottom: "16px",
              flex: 1,
            }}>
              {selectedAyah.arabic}
            </div>

            {/* Divider */}
            <div style={{
              width: "60px", height: "1px",
              background: theme.border,
              margin: "0 auto 14px",
            }} />

            {/* Urdu */}
            {showUrdu && (
              <div style={{
                fontSize: `${fontSize.urdu}px`,
                color: theme.urduColor,
                textAlign: "center",
                lineHeight: "1.8",
                fontStyle: "italic",
                marginBottom: "14px",
              }}>
                {selectedAyah.urdu}
              </div>
            )}

            {/* Surah */}
            {showSurah && (
              <div style={{
                fontSize: "11px",
                color: theme.surahColor,
                textAlign: "center",
                letterSpacing: "0.5px",
              }}>
                — {selectedAyah.surah} ({selectedAyah.ayah})
              </div>
            )}

            {/* App name */}
            <div style={{
              position: "absolute", bottom: "10px", right: "14px",
              fontSize: "9px", color: theme.surahColor, opacity: 0.5,
              letterSpacing: "1px",
            }}>
              NOOR AL-QURAN
            </div>
          </div>
        </div>

        {/* ── ACTION BUTTONS ── */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
          <button onClick={handleShare} style={{
            flex: 1, background: "rgba(201,168,76,0.12)",
            border: "1px solid rgba(201,168,76,0.3)",
            color: "#C9A84C", borderRadius: "14px", padding: "12px",
            cursor: "pointer", fontSize: "13px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
            transition: "all 0.2s",
          }}>
            {copied ? <BsCheck2 size={15} /> : <BsShare size={15} />}
            {copied ? "Copied!" : "Share"}
          </button>
          <button onClick={handleDownload} style={{
            flex: 1, background: "rgba(39,174,96,0.1)",
            border: "1px solid rgba(39,174,96,0.3)",
            color: "#27AE60", borderRadius: "14px", padding: "12px",
            cursor: "pointer", fontSize: "13px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
          }}>
            <BsDownload size={15} /> Download
          </button>
        </div>

        {/* ── THEMES ── */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "11px", color: "#3a3028", letterSpacing: "1.5px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
            <BsPalette size={12} color="#C9A84C" /> THEME
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {THEMES.map(t => (
              <button key={t.id} className="theme-dot"
                onClick={() => setSelectedTheme(t)}
                title={t.name}
                style={{
                  width: "36px", height: "36px", borderRadius: "50%",
                  background: t.bg,
                  border: `2px solid ${selectedTheme.id === t.id ? "#C9A84C" : "rgba(255,255,255,0.1)"}`,
                  cursor: "pointer", flexShrink: 0,
                  transition: "transform 0.15s, border-color 0.2s",
                  boxShadow: selectedTheme.id === t.id ? "0 0 12px rgba(201,168,76,0.4)" : "none",
                }} />
            ))}
          </div>
        </div>

        {/* ── FONT SIZE ── */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "11px", color: "#3a3028", letterSpacing: "1.5px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
            <BsTypeH1 size={12} color="#C9A84C" /> FONT SIZE
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {FONT_SIZES.map(f => (
              <button key={f.id} onClick={() => setFontSize(f)} style={{
                flex: 1, background: fontSize.id === f.id ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${fontSize.id === f.id ? "#C9A84C" : "rgba(255,255,255,0.07)"}`,
                color: fontSize.id === f.id ? "#C9A84C" : "#6a5f52",
                borderRadius: "10px", padding: "9px", cursor: "pointer",
                fontSize: "12px", transition: "all 0.2s",
              }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── TOGGLES ── */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontSize: "11px", color: "#3a3028", letterSpacing: "1.5px", marginBottom: "10px" }}>OPTIONS</div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {[
              { label: "Bismillah", val: showBismillah, set: setShowBismillah },
              { label: "Urdu", val: showUrdu, set: setShowUrdu },
              { label: "Surah Name", val: showSurah, set: setShowSurah },
            ].map(o => (
              <button key={o.label} onClick={() => o.set(!o.val)} style={{
                background: o.val ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${o.val ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.07)"}`,
                color: o.val ? "#C9A84C" : "#5a5040",
                borderRadius: "20px", padding: "7px 14px",
                cursor: "pointer", fontSize: "12px",
                display: "flex", alignItems: "center", gap: "5px",
                transition: "all 0.2s",
              }}>
                {o.val && <BsCheck2 size={11} />}
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── AYAH SELECTOR ── */}
        <div>
          <div style={{ fontSize: "11px", color: "#3a3028", letterSpacing: "1.5px", marginBottom: "12px" }}>
            AYAH CHUNEIN
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {AYAHS.map((a, i) => (
              <button key={i} className="ayah-pill"
                onClick={() => setSelectedAyah(a)}
                style={{
                  background: selectedAyah === a ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${selectedAyah === a ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.06)"}`,
                  color: selectedAyah === a ? "#C9A84C" : "#6a5f52",
                  borderRadius: "12px", padding: "12px 14px",
                  cursor: "pointer", textAlign: "right",
                  transition: "all 0.2s",
                }}>
                <div style={{ fontFamily: "'Amiri', serif", fontSize: "18px", direction: "rtl", marginBottom: "4px", color: selectedAyah === a ? "#C9A84C" : "#e2d9c8" }}>
                  {a.arabic}
                </div>
                <div style={{ fontSize: "11px", direction: "ltr", textAlign: "left", color: "#4a4030" }}>
                  {a.surah} • {a.ayah}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}