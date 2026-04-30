import { useState, useRef, useEffect } from "react";
import {
  BsDownload,
  BsShare,
  BsPalette,
  BsTypeH1,
  BsCheck2,
  BsCalendarCheck,
  BsFire,
  BsHeart,
  BsHandThumbsUp,
  BsPlus,
  BsX,
  BsPerson,
  BsClock,
  BsPeopleFill,
} from "react-icons/bs";
import { FaHandsPraying } from "react-icons/fa6";
import { TbBuildingMosque } from "react-icons/tb";

// ── Curated Ayahs ──
const AYAHS = [
  {
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    urdu: "Beshak mushkil ke saath aasaani hai.",
    surah: "Al-Inshirah",
    ayah: "94:5",
  },
  {
    arabic: "وَلَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",
    urdu: "Allah ki rahmat se mayoos mat ho.",
    surah: "Az-Zumar",
    ayah: "39:53",
  },
  {
    arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    urdu: "Beshak Allah sabr karne walon ke saath hai.",
    surah: "Al-Baqarah",
    ayah: "2:153",
  },
  {
    arabic: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ",
    urdu: "Woh tumhare saath hai jahan bhi tum ho.",
    surah: "Al-Hadid",
    ayah: "57:4",
  },
  {
    arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    urdu: "Hamare liye Allah kaafi hai, woh kya achha kaarsa'az hai!",
    surah: "Aali Imran",
    ayah: "3:173",
  },
  {
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    urdu: "Ay mere Rabb! Mujhe ilm mein izafa farmao.",
    surah: "Ta-Ha",
    ayah: "20:114",
  },
  {
    arabic:
      "لَا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
    urdu: "Koi ilaah nahi magar tu, tu paak hai, main zaalinon mein se tha.",
    surah: "Al-Anbiya",
    ayah: "21:87",
  },
  {
    arabic: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ",
    urdu: "Allah aasmano aur zameen ka noor hai.",
    surah: "An-Nur",
    ayah: "24:35",
  },
  {
    arabic: "وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ",
    urdu:
      "Ho sakta hai tum kisi cheez ko na pasand karo aur woh tumhare liye behtar ho.",
    surah: "Al-Baqarah",
    ayah: "2:216",
  },
  {
    arabic: "إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ",
    urdu: "Beshak Allah neki karne walon ka ajar zaaya nahi karta.",
    surah: "At-Tawbah",
    ayah: "9:120",
  },
  {
    arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    urdu: "Jo Allah par bharosa kare woh uske liye kaafi hai.",
    surah: "At-Talaq",
    ayah: "65:3",
  },
  {
    arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    urdu: "Sun lo! Allah ki yaad se hi dilon ko sukoon milta hai.",
    surah: "Ar-Ra'd",
    ayah: "13:28",
  },
  {
    arabic:
      "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً",
    urdu: "Ay Rabb! Duniya mein bhalai de aur aakhirat mein bhalai de.",
    surah: "Al-Baqarah",
    ayah: "2:201",
  },
  {
    arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    urdu: "Beshak mushkil ke saath aasaani hai.",
    surah: "Al-Inshirah",
    ayah: "94:6",
  },
  {
    arabic:
      "وَقُل رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    urdu:
      "Aur kaho: Ay mere Rabb! Un dono par rahm kar jaise unhon ne mujhe bachpan mein pala.",
    surah: "Al-Isra",
    ayah: "17:24",
  },
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
    pattern:
      "radial-gradient(circle at 20% 20%, rgba(201,168,76,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(107,127,215,0.06) 0%, transparent 50%)",
  },
  {
    id: "green",
    name: "Islamic Green",
    bg: "linear-gradient(135deg, #0a1f0a 0%, #0f2d1a 100%)",
    border: "rgba(39,174,96,0.4)",
    arabicColor: "#2ecc71",
    urduColor: "#8fbc8f",
    surahColor: "rgba(39,174,96,0.6)",
    pattern:
      "radial-gradient(circle at 30% 30%, rgba(39,174,96,0.1) 0%, transparent 50%)",
  },
  {
    id: "purple",
    name: "Night Sky",
    bg: "linear-gradient(135deg, #0d0a1f 0%, #1a0f2d 100%)",
    border: "rgba(123,111,212,0.4)",
    arabicColor: "#9b8fe8",
    urduColor: "#8a7aa8",
    surahColor: "rgba(123,111,212,0.6)",
    pattern:
      "radial-gradient(circle at 70% 20%, rgba(123,111,212,0.1) 0%, transparent 50%)",
  },
  {
    id: "warm",
    name: "Warm Sunset",
    bg: "linear-gradient(135deg, #1f0a0a 0%, #2d1505 100%)",
    border: "rgba(232,168,56,0.4)",
    arabicColor: "#E8A838",
    urduColor: "#b09060",
    surahColor: "rgba(232,168,56,0.6)",
    pattern:
      "radial-gradient(circle at 50% 0%, rgba(232,168,56,0.1) 0%, transparent 60%)",
  },
  {
    id: "light",
    name: "Clean White",
    bg: "linear-gradient(135deg, #f8f4ee 0%, #ede8e0 100%)",
    border: "rgba(139,110,60,0.3)",
    arabicColor: "#5a3a10",
    urduColor: "#7a6a50",
    surahColor: "rgba(139,110,60,0.5)",
    pattern:
      "radial-gradient(circle at 20% 20%, rgba(201,168,76,0.08) 0%, transparent 50%)",
  },
  {
    id: "blue",
    name: "Ocean",
    bg: "linear-gradient(135deg, #0a0f1f 0%, #0a1a2d 100%)",
    border: "rgba(52,152,219,0.4)",
    arabicColor: "#5dade2",
    urduColor: "#7a9ab0",
    surahColor: "rgba(52,152,219,0.5)",
    pattern:
      "radial-gradient(circle at 80% 20%, rgba(52,152,219,0.1) 0%, transparent 50%)",
  },
];

const FONT_SIZES = [
  { id: "sm", label: "چھوٹا", arabic: 24, urdu: 13 },
  { id: "md", label: "درمیانہ", arabic: 30, urdu: 14 },
  { id: "lg", label: "بڑا", arabic: 36, urdu: 15 },
];

// ── Sadqa-e-Jariya Deeds ──
const DEEDS = [
  {
    id: "fajr",
    label: "Fajr ki Namaz",
    icon: "🕌",
    category: "Ibadat",
    points: 10,
  },
  {
    id: "quran",
    label: "Quran Tilawat",
    icon: "📖",
    category: "Ibadat",
    points: 15,
  },
  {
    id: "durood",
    label: "100 Durood Shareef",
    icon: "🤲",
    category: "Zikr",
    points: 20,
  },
  {
    id: "sadaqah",
    label: "Sadqa / Khairat",
    icon: "💚",
    category: "Charity",
    points: 25,
  },
  {
    id: "help",
    label: "Kisi ki Madad",
    icon: "🤝",
    category: "Akhlaaq",
    points: 15,
  },
  {
    id: "water",
    label: "Pani ka Sadqa",
    icon: "💧",
    category: "Sadqa-e-Jariya",
    points: 30,
  },
  {
    id: "tree",
    label: "Darakht Lagana",
    icon: "🌳",
    category: "Sadqa-e-Jariya",
    points: 50,
  },
  {
    id: "ilm",
    label: "Ilm ka Chirag",
    icon: "💡",
    category: "Sadqa-e-Jariya",
    points: 40,
  },
  {
    id: "parents",
    label: "Waldein ki Khidmat",
    icon: "👨‍👩‍👧",
    category: "Akhlaaq",
    points: 20,
  },
  {
    id: "smile",
    label: "Muskaan (Smile)",
    icon: "😊",
    category: "Akhlaaq",
    points: 5,
  },
];

// ── Dua Board Categories ──
const DUA_TYPES = [
  {
    id: "shifa",
    label: "Dua-e-Shifa",
    icon: "🏥",
    desc: "Bemari ki dua",
    color: "#27AE60",
    bg: "rgba(39,174,96,0.1)",
    border: "rgba(39,174,96,0.3)",
    arabic: "أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ",
  },
  {
    id: "maghfirat",
    label: "Dua-e-Maghfirat",
    icon: "🕊️",
    desc: "Inteqal ki dua",
    color: "#9b59b6",
    bg: "rgba(155,89,182,0.1)",
    border: "rgba(155,89,182,0.3)",
    arabic: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ",
  },
];

// ── Helper: Get today's date string ──
const getToday = () => new Date().toISOString().split("T")[0];

// ── Helper: Calculate streak ──
const calculateStreak = (history) => {
  if (!history || history.length === 0) return 0;
  const dates = [...new Set(history.map((h) => h.date))].sort().reverse();
  let streak = 0;
  const today = getToday();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  if (dates[0] === today || dates[0] === yesterday) {
    streak = 1;
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]);
      const curr = new Date(dates[i]);
      const diff = (prev - curr) / (1000 * 60 * 60 * 24);
      if (diff === 1) streak++;
      else break;
    }
  }
  return streak;
};

// ── Helper: Time ago ──
const timeAgo = (timestamp) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "abhi";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

// ── Generate unique ID ──
const uid = () => Math.random().toString(36).substr(2, 9);

export default function Ayahcards() {
  // ── Ayah Card State ──
  const [selectedAyah, setSelectedAyah] = useState(AYAHS[0]);
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [fontSize, setFontSize] = useState(FONT_SIZES[1]);
  const [showUrdu, setShowUrdu] = useState(true);
  const [showSurah, setShowSurah] = useState(true);
  const [showBismillah, setShowBismillah] = useState(true);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  // ── Sadqa Tracker State ──
  const [activeTab, setActiveTab] = useState("ayah"); // "ayah" | "tracker" | "dua"
  const [trackerHistory, setTrackerHistory] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("noor_tracker");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [todayDeeds, setTodayDeeds] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("noor_today");
      const parsed = saved ? JSON.parse(saved) : {};
      if (parsed.date === getToday()) return parsed.deeds || [];
      return [];
    }
    return [];
  });

  // ── Dua Board State ──
  const [duaPosts, setDuaPosts] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("noor_dua_posts");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [showDuaForm, setShowDuaForm] = useState(false);
  const [duaFormType, setDuaFormType] = useState("shifa");
  const [duaFormName, setDuaFormName] = useState("");
  const [duaFormDetail, setDuaFormDetail] = useState("");
  const [duaFilter, setDuaFilter] = useState("all");

  // ── Persist Data ──
  useEffect(() => {
    localStorage.setItem("noor_tracker", JSON.stringify(trackerHistory));
  }, [trackerHistory]);

  useEffect(() => {
    localStorage.setItem(
      "noor_today",
      JSON.stringify({ date: getToday(), deeds: todayDeeds })
    );
  }, [todayDeeds]);

  useEffect(() => {
    localStorage.setItem("noor_dua_posts", JSON.stringify(duaPosts));
  }, [duaPosts]);

  const streak = calculateStreak(trackerHistory);
  const todayPoints = todayDeeds.reduce((sum, d) => {
    const deed = DEEDS.find((x) => x.id === d);
    return sum + (deed ? deed.points : 0);
  }, 0);
  const totalPoints = trackerHistory.reduce((sum, h) => {
    const deed = DEEDS.find((x) => x.id === h.deedId);
    return sum + (deed ? deed.points : 0);
  }, 0);

  const toggleDeed = (deedId) => {
    const today = getToday();
    if (todayDeeds.includes(deedId)) {
      setTodayDeeds(todayDeeds.filter((d) => d !== deedId));
      setTrackerHistory(
        trackerHistory.filter(
          (h) => !(h.date === today && h.deedId === deedId)
        )
      );
    } else {
      setTodayDeeds([...todayDeeds, deedId]);
      setTrackerHistory([
        ...trackerHistory,
        { date: today, deedId, timestamp: Date.now() },
      ]);
    }
  };

  // ── Dua Board Functions ──
  const addDuaPost = () => {
    if (!duaFormName.trim()) return;
    const newPost = {
      id: uid(),
      type: duaFormType,
      name: duaFormName.trim(),
      detail: duaFormDetail.trim(),
      timestamp: Date.now(),
      ameens: [],
    };
    setDuaPosts([newPost, ...duaPosts]);
    setDuaFormName("");
    setDuaFormDetail("");
    setShowDuaForm(false);
  };

  const toggleAmeen = (postId) => {
    const deviceId =
      typeof window !== "undefined"
        ? localStorage.getItem("noor_device_id") || uid()
        : uid();
    if (typeof window !== "undefined")
      localStorage.setItem("noor_device_id", deviceId);

    setDuaPosts(
      duaPosts.map((post) => {
        if (post.id !== postId) return post;
        const hasAmeen = post.ameens.includes(deviceId);
        return {
          ...post,
          ameens: hasAmeen
            ? post.ameens.filter((id) => id !== deviceId)
            : [...post.ameens, deviceId],
        };
      })
    );
  };

  const deleteDuaPost = (postId) => {
    setDuaPosts(duaPosts.filter((p) => p.id !== postId));
  };

  const filteredDuaPosts =
    duaFilter === "all"
      ? duaPosts
      : duaPosts.filter((p) => p.type === duaFilter);

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
      const { default: html2canvas } = await import(
        "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.esm.min.js"
      );
      const canvas = await html2canvas(card, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
      });
      const link = document.createElement("a");
      link.download = `quran-ayah-${selectedAyah.ayah.replace(":", "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      alert("Download ke liye html2canvas install karein:\nnpm install html2canvas");
    }
  };

  // ── Category colors ──
  const catColors = {
    Ibadat: {
      bg: "rgba(201,168,76,0.1)",
      border: "rgba(201,168,76,0.3)",
      color: "#C9A84C",
    },
    Zikr: {
      bg: "rgba(155,89,182,0.1)",
      border: "rgba(155,89,182,0.3)",
      color: "#9b59b6",
    },
    Charity: {
      bg: "rgba(39,174,96,0.1)",
      border: "rgba(39,174,96,0.3)",
      color: "#27AE60",
    },
    "Sadqa-e-Jariya": {
      bg: "rgba(52,152,219,0.1)",
      border: "rgba(52,152,219,0.3)",
      color: "#5dade2",
    },
    Akhlaaq: {
      bg: "rgba(231,76,60,0.1)",
      border: "rgba(231,76,60,0.3)",
      color: "#e74c3c",
    },
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#07090d",
        color: "#e2d9c8",
        fontFamily: "'Georgia', serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:ital@0;1&display=swap');
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #1e2830; border-radius: 4px; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.3s ease forwards; }
        .ayah-pill:hover { border-color: rgba(201,168,76,0.4) !important; color: #C9A84C !important; }
        .theme-dot:hover { transform: scale(1.15); }
        .deed-card { transition: all 0.2s ease; }
        .deed-card:hover { transform: translateY(-2px); }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
        .pulse { animation: pulse 2s infinite; }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        .slide-up { animation: slideUp 0.3s ease forwards; }
        .dua-card { transition: all 0.25s ease; }
        .dua-card:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(0,0,0,0.3); }
        .ameen-btn { transition: all 0.2s ease; }
        .ameen-btn:active { transform: scale(0.95); }
      `}</style>

      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "rgba(7,9,13,0.97)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(201,168,76,0.1)",
          padding: "14px 16px",
        }}
      >
        <div
          style={{
            maxWidth: "520px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FaHandsPraying size={18} color="#C9A84C" />
            <span style={{ fontSize: "17px" }}>Noor Al-Quran</span>
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            {[
              { id: "ayah", label: "Ayah", icon: null },
              { id: "tracker", label: "Tracker", icon: <BsHeart size={11} /> },
              { id: "dua", label: "Dua Board", icon: <BsHandThumbsUp size={11} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background:
                    activeTab === tab.id
                      ? "rgba(201,168,76,0.15)"
                      : "transparent",
                  border: `1px solid ${activeTab === tab.id ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.07)"}`,
                  color: activeTab === tab.id ? "#C9A84C" : "#5a5040",
                  borderRadius: "10px",
                  padding: "6px 12px",
                  cursor: "pointer",
                  fontSize: "12px",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: "520px",
          margin: "0 auto",
          padding: "16px 16px 100px",
        }}
      >
        {/* ═══════════════════════════════════════
            AYAH CARDS TAB
           ═══════════════════════════════════════ */}
        {activeTab === "ayah" && (
          <div className="fade-up">
            {/* ── CARD PREVIEW ── */}
            <div style={{ marginBottom: "24px" }}>
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
                }}
              >
                {/* Decorative corner */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "80px",
                    height: "80px",
                    background: `radial-gradient(circle at top right, ${theme.border}, transparent 70%)`,
                    borderRadius: "0 20px 0 0",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "60px",
                    height: "60px",
                    background: `radial-gradient(circle at bottom left, ${theme.border}, transparent 70%)`,
                    borderRadius: "0 0 0 20px",
                  }}
                />

                {/* Bismillah */}
                {showBismillah && (
                  <div
                    style={{
                      fontFamily: "'Amiri', serif",
                      fontSize: "18px",
                      color: theme.arabicColor,
                      opacity: 0.5,
                      textAlign: "center",
                      marginBottom: "16px",
                      letterSpacing: "2px",
                    }}
                  >
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </div>
                )}

                {/* Arabic */}
                <div
                  style={{
                    fontFamily: "'Amiri', serif",
                    fontSize: `${fontSize.arabic}px`,
                    direction: "rtl",
                    textAlign: "center",
                    color: theme.arabicColor,
                    lineHeight: "2.2",
                    marginBottom: "16px",
                    flex: 1,
                  }}
                >
                  {selectedAyah.arabic}
                </div>

                {/* Divider */}
                <div
                  style={{
                    width: "60px",
                    height: "1px",
                    background: theme.border,
                    margin: "0 auto 14px",
                  }}
                />

                {/* Urdu */}
                {showUrdu && (
                  <div
                    style={{
                      fontSize: `${fontSize.urdu}px`,
                      color: theme.urduColor,
                      textAlign: "center",
                      lineHeight: "1.8",
                      fontStyle: "italic",
                      marginBottom: "14px",
                    }}
                  >
                    {selectedAyah.urdu}
                  </div>
                )}

                {/* Surah */}
                {showSurah && (
                  <div
                    style={{
                      fontSize: "11px",
                      color: theme.surahColor,
                      textAlign: "center",
                      letterSpacing: "0.5px",
                    }}
                  >
                    — {selectedAyah.surah} ({selectedAyah.ayah})
                  </div>
                )}

                {/* App name */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "14px",
                    fontSize: "9px",
                    color: theme.surahColor,
                    opacity: 0.5,
                    letterSpacing: "1px",
                  }}
                >
                  NOOR AL-QURAN
                </div>
              </div>
            </div>

            {/* ── ACTION BUTTONS ── */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
              <button
                onClick={handleShare}
                style={{
                  flex: 1,
                  background: "rgba(201,168,76,0.12)",
                  border: "1px solid rgba(201,168,76,0.3)",
                  color: "#C9A84C",
                  borderRadius: "14px",
                  padding: "12px",
                  cursor: "pointer",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "7px",
                  transition: "all 0.2s",
                }}
              >
                {copied ? <BsCheck2 size={15} /> : <BsShare size={15} />}
                {copied ? "Copied!" : "Share"}
              </button>
              <button
                onClick={handleDownload}
                style={{
                  flex: 1,
                  background: "rgba(39,174,96,0.1)",
                  border: "1px solid rgba(39,174,96,0.3)",
                  color: "#27AE60",
                  borderRadius: "14px",
                  padding: "12px",
                  cursor: "pointer",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "7px",
                }}
              >
                <BsDownload size={15} /> Download
              </button>
            </div>

            {/* ── THEMES ── */}
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "11px",
                  color: "#3a3028",
                  letterSpacing: "1.5px",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <BsPalette size={12} color="#C9A84C" /> THEME
              </div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    className="theme-dot"
                    onClick={() => setSelectedTheme(t)}
                    title={t.name}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: t.bg,
                      border: `2px solid ${selectedTheme.id === t.id ? "#C9A84C" : "rgba(255,255,255,0.1)"}`,
                      cursor: "pointer",
                      flexShrink: 0,
                      transition: "transform 0.15s, border-color 0.2s",
                      boxShadow:
                        selectedTheme.id === t.id
                          ? "0 0 12px rgba(201,168,76,0.4)"
                          : "none",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* ── FONT SIZE ── */}
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "11px",
                  color: "#3a3028",
                  letterSpacing: "1.5px",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <BsTypeH1 size={12} color="#C9A84C" /> FONT SIZE
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {FONT_SIZES.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFontSize(f)}
                    style={{
                      flex: 1,
                      background:
                        fontSize.id === f.id
                          ? "rgba(201,168,76,0.15)"
                          : "rgba(255,255,255,0.03)",
                      border: `1px solid ${fontSize.id === f.id ? "#C9A84C" : "rgba(255,255,255,0.07)"}`,
                      color: fontSize.id === f.id ? "#C9A84C" : "#6a5f52",
                      borderRadius: "10px",
                      padding: "9px",
                      cursor: "pointer",
                      fontSize: "12px",
                      transition: "all 0.2s",
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── TOGGLES ── */}
            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  fontSize: "11px",
                  color: "#3a3028",
                  letterSpacing: "1.5px",
                  marginBottom: "10px",
                }}
              >
                OPTIONS
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {[
                  {
                    label: "Bismillah",
                    val: showBismillah,
                    set: setShowBismillah,
                  },
                  { label: "Urdu", val: showUrdu, set: setShowUrdu },
                  { label: "Surah Name", val: showSurah, set: setShowSurah },
                ].map((o) => (
                  <button
                    key={o.label}
                    onClick={() => o.set(!o.val)}
                    style={{
                      background: o.val
                        ? "rgba(201,168,76,0.12)"
                        : "rgba(255,255,255,0.03)",
                      border: `1px solid ${o.val ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.07)"}`,
                      color: o.val ? "#C9A84C" : "#5a5040",
                      borderRadius: "20px",
                      padding: "7px 14px",
                      cursor: "pointer",
                      fontSize: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      transition: "all 0.2s",
                    }}
                  >
                    {o.val && <BsCheck2 size={11} />}
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── AYAH SELECTOR ── */}
            <div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#3a3028",
                  letterSpacing: "1.5px",
                  marginBottom: "12px",
                }}
              >
                AYAH CHUNEIN
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {AYAHS.map((a, i) => (
                  <button
                    key={i}
                    className="ayah-pill"
                    onClick={() => setSelectedAyah(a)}
                    style={{
                      background:
                        selectedAyah === a
                          ? "rgba(201,168,76,0.08)"
                          : "rgba(255,255,255,0.02)",
                      border: `1px solid ${selectedAyah === a ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.06)"}`,
                      color: selectedAyah === a ? "#C9A84C" : "#6a5f52",
                      borderRadius: "12px",
                      padding: "12px 14px",
                      cursor: "pointer",
                      textAlign: "right",
                      transition: "all 0.2s",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Amiri', serif",
                        fontSize: "18px",
                        direction: "rtl",
                        marginBottom: "4px",
                        color: selectedAyah === a ? "#C9A84C" : "#e2d9c8",
                      }}
                    >
                      {a.arabic}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        direction: "ltr",
                        textAlign: "left",
                        color: "#4a4030",
                      }}
                    >
                      {a.surah} • {a.ayah}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════
            SADQA-E-JARIYA TRACKER TAB
           ═══════════════════════════════════════ */}
        {activeTab === "tracker" && (
          <div className="fade-up">
            {/* Stats Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                marginBottom: "24px",
              }}
            >
              {/* Streak */}
              <div
                style={{
                  background: "rgba(201,168,76,0.08)",
                  border: "1px solid rgba(201,168,76,0.2)",
                  borderRadius: "16px",
                  padding: "16px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    marginBottom: "6px",
                  }}
                >
                  <BsFire size={16} color="#C9A84C" />
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#C9A84C",
                      letterSpacing: "1px",
                    }}
                  >
                    STREAK
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "28px",
                    color: "#C9A84C",
                    fontWeight: "bold",
                  }}
                >
                  {streak}
                </div>
                <div style={{ fontSize: "11px", color: "#5a5040" }}>
                  consecutive days
                </div>
              </div>

              {/* Today's Points */}
              <div
                style={{
                  background: "rgba(39,174,96,0.08)",
                  border: "1px solid rgba(39,174,96,0.2)",
                  borderRadius: "16px",
                  padding: "16px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    marginBottom: "6px",
                  }}
                >
                  <BsCalendarCheck size={16} color="#27AE60" />
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#27AE60",
                      letterSpacing: "1px",
                    }}
                  >
                    TODAY
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "28px",
                    color: "#27AE60",
                    fontWeight: "bold",
                  }}
                >
                  {todayPoints}
                </div>
                <div style={{ fontSize: "11px", color: "#5a5040" }}>
                  points earned
                </div>
              </div>
            </div>

            {/* Total Points Banner */}
            <div
              style={{
                background:
                  "linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(39,174,96,0.05) 100%)",
                border: "1px solid rgba(201,168,76,0.2)",
                borderRadius: "14px",
                padding: "14px 18px",
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#5a5040",
                    marginBottom: "2px",
                  }}
                >
                  TOTAL SADQA-E-JARIYA POINTS
                </div>
                <div
                  style={{
                    fontSize: "22px",
                    color: "#C9A84C",
                    fontWeight: "bold",
                  }}
                >
                  {totalPoints.toLocaleString()}
                </div>
              </div>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: "rgba(201,168,76,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaHandsPraying size={22} color="#C9A84C" />
              </div>
            </div>

            {/* Date Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "#3a3028",
                  letterSpacing: "1.5px",
                }}
              >
                TODAY'S DEEDS —{" "}
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: todayDeeds.length > 0 ? "#27AE60" : "#5a5040",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <BsCheck2 size={12} />
                {todayDeeds.length}/{DEEDS.length} completed
              </div>
            </div>

            {/* Deeds Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                marginBottom: "24px",
              }}
            >
              {DEEDS.map((deed) => {
                const isDone = todayDeeds.includes(deed.id);
                const colors = catColors[deed.category] || catColors.Akhlaaq;
                return (
                  <button
                    key={deed.id}
                    onClick={() => toggleDeed(deed.id)}
                    className="deed-card"
                    style={{
                      background: isDone
                        ? colors.bg
                        : "rgba(255,255,255,0.02)",
                      border: `1.5px solid ${isDone ? colors.border : "rgba(255,255,255,0.06)"}`,
                      borderRadius: "14px",
                      padding: "14px",
                      cursor: "pointer",
                      textAlign: "left",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {isDone && (
                      <div
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          background: colors.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <BsCheck2 size={10} color="#07090d" />
                      </div>
                    )}
                    <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                      {deed.icon}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: isDone ? colors.color : "#e2d9c8",
                        fontWeight: isDone ? "600" : "400",
                        marginBottom: "4px",
                        lineHeight: "1.4",
                      }}
                    >
                      {deed.label}
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: isDone ? colors.color : "#4a4030",
                        opacity: isDone ? 0.8 : 1,
                      }}
                    >
                      +{deed.points} pts • {deed.category}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Motivational Quote */}
            <div
              style={{
                background: "rgba(201,168,76,0.05)",
                border: "1px solid rgba(201,168,76,0.15)",
                borderRadius: "14px",
                padding: "16px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "'Amiri', serif",
                  fontSize: "16px",
                  color: "#C9A84C",
                  direction: "rtl",
                  marginBottom: "8px",
                }}
              >
                إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#6a5f52",
                  fontStyle: "italic",
                }}
              >
                "Beshak Allah neki karne walon ka ajar zaaya nahi karta."
              </div>
            </div>

            {/* Weekly Progress */}
            <div style={{ marginTop: "24px" }}>
              <div
                style={{
                  fontSize: "11px",
                  color: "#3a3028",
                  letterSpacing: "1.5px",
                  marginBottom: "12px",
                }}
              >
                LAST 7 DAYS
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  alignItems: "flex-end",
                  height: "60px",
                }}
              >
                {Array.from({ length: 7 }, (_, i) => {
                  const d = new Date();
                  d.setDate(d.getDate() - (6 - i));
                  const dateStr = d.toISOString().split("T")[0];
                  const dayPoints = trackerHistory
                    .filter((h) => h.date === dateStr)
                    .reduce((sum, h) => {
                      const deed = DEEDS.find((x) => x.id === h.deedId);
                      return sum + (deed ? deed.points : 0);
                    }, 0);
                  const maxPossible = DEEDS.reduce((s, d) => s + d.points, 0);
                  const height =
                    maxPossible > 0 ? (dayPoints / maxPossible) * 100 : 0;
                  const isToday = i === 6;

                  return (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: `${Math.max(height, 4)}%`,
                          minHeight: "4px",
                          background: isToday
                            ? "linear-gradient(to top, #27AE60, #C9A84C)"
                            : dayPoints > 0
                              ? "rgba(201,168,76,0.4)"
                              : "rgba(255,255,255,0.05)",
                          borderRadius: "4px 4px 0 0",
                          transition: "height 0.3s ease",
                        }}
                      />
                      <div
                        style={{
                          fontSize: "9px",
                          color: isToday ? "#C9A84C" : "#4a4030",
                        }}
                      >
                        {d.toLocaleDateString("en-US", { weekday: "narrow" })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════
            DUA BOARD TAB
           ═══════════════════════════════════════ */}
        {activeTab === "dua" && (
          <div className="fade-up">
            {/* Header Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "8px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  background: "rgba(201,168,76,0.08)",
                  border: "1px solid rgba(201,168,76,0.2)",
                  borderRadius: "14px",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "20px", color: "#C9A84C", fontWeight: "bold" }}>
                  {duaPosts.length}
                </div>
                <div style={{ fontSize: "10px", color: "#5a5040" }}>Total Duas</div>
              </div>
              <div
                style={{
                  background: "rgba(39,174,96,0.08)",
                  border: "1px solid rgba(39,174,96,0.2)",
                  borderRadius: "14px",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "20px", color: "#27AE60", fontWeight: "bold" }}>
                  {duaPosts.filter((p) => p.type === "shifa").length}
                </div>
                <div style={{ fontSize: "10px", color: "#5a5040" }}>Shifa</div>
              </div>
              <div
                style={{
                  background: "rgba(155,89,182,0.08)",
                  border: "1px solid rgba(155,89,182,0.2)",
                  borderRadius: "14px",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "20px", color: "#9b59b6", fontWeight: "bold" }}>
                  {duaPosts.filter((p) => p.type === "maghfirat").length}
                </div>
                <div style={{ fontSize: "10px", color: "#5a5040" }}>Maghfirat</div>
              </div>
            </div>

            {/* Add Dua Button */}
            <button
              onClick={() => setShowDuaForm(true)}
              style={{
                width: "100%",
                background: "rgba(201,168,76,0.1)",
                border: "1px dashed rgba(201,168,76,0.4)",
                color: "#C9A84C",
                borderRadius: "14px",
                padding: "14px",
                cursor: "pointer",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "20px",
                transition: "all 0.2s",
              }}
            >
              <BsPlus size={18} />
              Dua Request Add Karein
            </button>

            {/* Filter Tabs */}
            <div
              style={{
                display: "flex",
                gap: "6px",
                marginBottom: "16px",
                overflowX: "auto",
                paddingBottom: "4px",
              }}
            >
              {[
                { id: "all", label: "Sab", count: duaPosts.length },
                { id: "shifa", label: "Shifa", count: duaPosts.filter((p) => p.type === "shifa").length },
                { id: "maghfirat", label: "Maghfirat", count: duaPosts.filter((p) => p.type === "maghfirat").length },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setDuaFilter(f.id)}
                  style={{
                    background:
                      duaFilter === f.id
                        ? "rgba(201,168,76,0.15)"
                        : "rgba(255,255,255,0.03)",
                    border: `1px solid ${duaFilter === f.id ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.07)"}`,
                    color: duaFilter === f.id ? "#C9A84C" : "#5a5040",
                    borderRadius: "20px",
                    padding: "6px 14px",
                    cursor: "pointer",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s",
                  }}
                >
                  {f.label} {f.count > 0 && `(${f.count})`}
                </button>
              ))}
            </div>

            {/* Dua Posts */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {filteredDuaPosts.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 20px",
                    color: "#4a4030",
                  }}
                >
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>🤲</div>
                  <div style={{ fontSize: "14px", marginBottom: "4px" }}>
                    Abhi koi dua request nahi
                  </div>
                  <div style={{ fontSize: "12px" }}>
                    Pehli request add karein — log aake Aameen kahenge
                  </div>
                </div>
              )}

              {filteredDuaPosts.map((post) => {
                const typeInfo = DUA_TYPES.find((t) => t.id === post.type);
                const deviceId =
                  typeof window !== "undefined"
                    ? localStorage.getItem("noor_device_id") || ""
                    : "";
                const hasAmeen = post.ameens.includes(deviceId);

                return (
                  <div
                    key={post.id}
                    className="dua-card"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: `1px solid ${typeInfo.border}`,
                      borderRadius: "16px",
                      padding: "18px",
                      position: "relative",
                    }}
                  >
                    {/* Type Badge */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          background: typeInfo.bg,
                          border: `1px solid ${typeInfo.border}`,
                          borderRadius: "20px",
                          padding: "4px 10px",
                        }}
                      >
                        <span style={{ fontSize: "14px" }}>{typeInfo.icon}</span>
                        <span
                          style={{
                            fontSize: "11px",
                            color: typeInfo.color,
                            fontWeight: "600",
                          }}
                        >
                          {typeInfo.label}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "11px",
                          color: "#4a4030",
                        }}
                      >
                        <BsClock size={10} />
                        {timeAgo(post.timestamp)}
                      </div>
                    </div>

                    {/* Arabic Dua */}
                    <div
                      style={{
                        fontFamily: "'Amiri', serif",
                        fontSize: "18px",
                        color: typeInfo.color,
                        direction: "rtl",
                        textAlign: "center",
                        marginBottom: "12px",
                        lineHeight: "1.8",
                        opacity: 0.9,
                      }}
                    >
                      {typeInfo.arabic}
                    </div>

                    {/* Name */}
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#e2d9c8",
                        fontWeight: "600",
                        marginBottom: "4px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <BsPerson size={13} color="#4a4030" />
                      {post.name}
                    </div>

                    {/* Detail */}
                    {post.detail && (
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#6a5f52",
                          lineHeight: "1.6",
                          marginBottom: "14px",
                          padding: "8px 10px",
                          background: "rgba(255,255,255,0.02)",
                          borderRadius: "8px",
                        }}
                      >
                        {post.detail}
                      </div>
                    )}

                    {/* Ameen Button */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <button
                        onClick={() => toggleAmeen(post.id)}
                        className="ameen-btn"
                        style={{
                          background: hasAmeen
                            ? typeInfo.bg
                            : "rgba(255,255,255,0.03)",
                          border: `1.5px solid ${hasAmeen ? typeInfo.border : "rgba(255,255,255,0.1)"}`,
                          color: hasAmeen ? typeInfo.color : "#6a5f52",
                          borderRadius: "24px",
                          padding: "8px 18px",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: hasAmeen ? "600" : "400",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <BsHandThumbsUp size={14} />
                        {hasAmeen ? "Aameen! 🤲" : "Aameen"}
                      </button>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          fontSize: "12px",
                          color: "#4a4030",
                        }}
                      >
                        <BsPeopleFill size={12} color={typeInfo.color} />
                        <span style={{ color: typeInfo.color, fontWeight: "600" }}>
                          {post.ameens.length}
                        </span>
                        <span>log ne Aameen kaha</span>
                      </div>
                    </div>

                    {/* Delete (only for recent posts - demo purposes) */}
                    <button
                      onClick={() => deleteDuaPost(post.id)}
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        background: "transparent",
                        border: "none",
                        color: "#4a4030",
                        cursor: "pointer",
                        padding: "4px",
                        opacity: 0.5,
                      }}
                      title="Delete"
                    >
                      <BsX size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════
          DUA FORM MODAL
         ═══════════════════════════════════════ */}
      {showDuaForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(8px)",
            zIndex: 100,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
          onClick={() => setShowDuaForm(false)}
        >
          <div
            className="slide-up"
            style={{
              background: "#0d1117",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: "24px 24px 0 0",
              padding: "24px",
              width: "100%",
              maxWidth: "520px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <div>
                <div style={{ fontSize: "16px", color: "#e2d9c8", fontWeight: "600" }}>
                  Dua Request
                </div>
                <div style={{ fontSize: "12px", color: "#5a5040" }}>
                  Kisi ki tabiyat kharab ho ya inteqal ho
                </div>
              </div>
              <button
                onClick={() => setShowDuaForm(false)}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#e2d9c8",
                }}
              >
                <BsX size={18} />
              </button>
            </div>

            {/* Type Selector */}
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontSize: "11px",
                  color: "#3a3028",
                  letterSpacing: "1px",
                  marginBottom: "8px",
                }}
              >
                DUA KA QISAM
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {DUA_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setDuaFormType(type.id)}
                    style={{
                      flex: 1,
                      background:
                        duaFormType === type.id
                          ? type.bg
                          : "rgba(255,255,255,0.03)",
                      border: `1.5px solid ${duaFormType === type.id ? type.border : "rgba(255,255,255,0.07)"}`,
                      borderRadius: "12px",
                      padding: "12px",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ fontSize: "24px", marginBottom: "4px" }}>
                      {type.icon}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color:
                          duaFormType === type.id ? type.color : "#6a5f52",
                        fontWeight: "600",
                      }}
                    >
                      {type.label}
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#4a4030",
                        marginTop: "2px",
                      }}
                    >
                      {type.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div style={{ marginBottom: "14px" }}>
              <div
                style={{
                  fontSize: "11px",
                  color: "#3a3028",
                  letterSpacing: "1px",
                  marginBottom: "6px",
                }}
              >
                KIS KE LIYE DUA? *
              </div>
              <input
                type="text"
                value={duaFormName}
                onChange={(e) => setDuaFormName(e.target.value)}
                placeholder="Naam likhein..."
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  padding: "12px 14px",
                  color: "#e2d9c8",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  outline: "none",
                }}
              />
            </div>

            {/* Detail Input */}
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "11px",
                  color: "#3a3028",
                  letterSpacing: "1px",
                  marginBottom: "6px",
                }}
              >
                TAFSEELAT (Optional)
              </div>
              <textarea
                value={duaFormDetail}
                onChange={(e) => setDuaFormDetail(e.target.value)}
                placeholder="Kuch details likhein..."
                rows={3}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  padding: "12px 14px",
                  color: "#e2d9c8",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  outline: "none",
                  resize: "vertical",
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={addDuaPost}
              disabled={!duaFormName.trim()}
              style={{
                width: "100%",
                background: duaFormName.trim()
                  ? "rgba(201,168,76,0.15)"
                  : "rgba(255,255,255,0.03)",
                border: `1px solid ${duaFormName.trim() ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.07)"}`,
                color: duaFormName.trim() ? "#C9A84C" : "#4a4030",
                borderRadius: "14px",
                padding: "14px",
                cursor: duaFormName.trim() ? "pointer" : "not-allowed",
                fontSize: "14px",
                fontWeight: "600",
                transition: "all 0.2s",
              }}
            >
              Dua Request Post Karein
            </button>
          </div>
        </div>
      )}
    </div>
  );
}