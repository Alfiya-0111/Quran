import React, { useState, useEffect, useCallback, lazy, Suspense, memo } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

// ── Lazy Load Heavy Views ─────────────────────────────────────────────
const HuroofView = lazy(() => import("./HuroofView"));
const SurahsView = lazy(() => import("./SurahsView"));
const ProphetsView = lazy(() => import("./ProphetsView"));
const DuasView = lazy(() => import("./DuasView"));

// ── Palette ──────────────────────────────────────────────────────────
const C = {
  bg: "#0a0f1a",
  card: "#111827",
  cardHover: "#1a2535",
  text: "#f0ece0",
  dim: "#8a9ab0",
  green: "#4ade80",
  yellow: "#fbbf24",
  pink: "#f472b6",
  blue: "#60a5fa",
  orange: "#fb923c",
  purple: "#c084fc",
  teal: "#2dd4bf",
  red: "#f87171",
  gold: "#C9A84C",
};

// ── Google TTS — Clear Urdu & Arabic voice ────────────────────────────
const audioRef = { current: null };

export function stopAudio() {
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current = null;
  }
}

export function playSequenceTTS(items, onDone) {
  stopAudio();
  let idx = 0;

  function playNext() {
    if (idx >= items.length) { onDone?.(); return; }
    const item = items[idx++];
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(item.text)}&tl=${item.lang || "ar"}&client=tw-ob`;
    const audio = new Audio(url);
    audioRef.current = audio;

    audio.play().catch(() => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(item.text);
        utter.lang = (item.lang || "ar") === "ar" ? "ar-SA" : "ur-PK";
        utter.rate = 0.75;
        utter.onend = () => setTimeout(playNext, item.pause || 500);
        window.speechSynthesis.speak(utter);
        return;
      }
      setTimeout(playNext, item.pause || 500);
    });

    audio.onended = () => setTimeout(playNext, item.pause || 500);
  }

  playNext();
}

// ── Data ─────────────────────────────────────────────────────────────
export const ARABIC_LETTERS = [
  { letter: "ا", name: "Alif",  sound: "A",  color: C.green,  emoji: "🦁", word: "أَسَد",    meaning: "Sher"    },
  { letter: "ب", name: "Ba",    sound: "B",  color: C.blue,   emoji: "🏠", word: "بَيْت",    meaning: "Ghar"    },
  { letter: "ت", name: "Ta",    sound: "T",  color: C.pink,   emoji: "🍎", word: "تُفَّاح",  meaning: "Seb"     },
  { letter: "ث", name: "Tha",   sound: "Th", color: C.yellow, emoji: "🦊", word: "ثَعْلَب",  meaning: "Lomdi"   },
  { letter: "ج", name: "Jeem",  sound: "J",  color: C.orange, emoji: "🐪", word: "جَمَل",    meaning: "Oont"    },
  { letter: "ح", name: "Ha",    sound: "H",  color: C.teal,   emoji: "🐴", word: "حِصَان",   meaning: "Ghoda"   },
  { letter: "خ", name: "Kha",   sound: "Kh", color: C.purple, emoji: "🍞", word: "خُبْز",    meaning: "Roti"    },
  { letter: "د", name: "Dal",   sound: "D",  color: C.red,    emoji: "🐻", word: "دُبّ",     meaning: "Bhaaloo" },
  { letter: "ذ", name: "Dhal",  sound: "Dh", color: C.green,  emoji: "🪰", word: "ذُبَاب",   meaning: "Makhi"   },
  { letter: "ر", name: "Ra",    sound: "R",  color: C.blue,   emoji: "🌹", word: "وَرْدَة",   meaning: "Phool"   },
  { letter: "ز", name: "Zay",   sound: "Z",  color: C.pink,   emoji: "🌸", word: "زَهْرَة",   meaning: "Gulaab"  },
  { letter: "س", name: "Seen",  sound: "S",  color: C.yellow, emoji: "🐟", word: "سَمَك",    meaning: "Machli"  },
  { letter: "ش", name: "Sheen", sound: "Sh", color: C.orange, emoji: "☀️", word: "شَمْس",    meaning: "Suraj"   },
  { letter: "ص", name: "Sad",   sound: "S",  color: C.teal,   emoji: "🦅", word: "صَقْر",    meaning: "Baaz"    },
  { letter: "ض", name: "Dad",   sound: "D",  color: C.purple, emoji: "🐸", word: "ضِفْدَع",   meaning: "Mendak"  },
  { letter: "ط", name: "Ta",    sound: "T",  color: C.red,    emoji: "🦚", word: "طَاوُوس",  meaning: "Mor"     },
  { letter: "ظ", name: "Dha",   sound: "Dh", color: C.green,  emoji: "🦌", word: "ظَبْي",    meaning: "Hiran"   },
  { letter: "ع", name: "Ain",   sound: "A'", color: C.blue,   emoji: "🍇", word: "عِنَب",    meaning: "Angoor"  },
  { letter: "غ", name: "Ghain", sound: "Gh", color: C.pink,   emoji: "🌲", word: "غَابَة",   meaning: "Jungle"  },
  { letter: "ف", name: "Fa",    sound: "F",  color: C.yellow, emoji: "🦋", word: "فَرَاشَة",  meaning: "Titli"   },
  { letter: "ق", name: "Qaf",   sound: "Q",  color: C.orange, emoji: "🌙", word: "قَمَر",    meaning: "Chaand"  },
  { letter: "ك", name: "Kaf",   sound: "K",  color: C.teal,   emoji: "🐶", word: "كَلْب",    meaning: "Kutta"   },
  { letter: "ل", name: "Lam",   sound: "L",  color: C.purple, emoji: "🌙", word: "لَيْل",    meaning: "Raat"    },
  { letter: "م", name: "Meem",  sound: "M",  color: C.red,    emoji: "🌊", word: "مَاء",     meaning: "Paani"   },
  { letter: "ن", name: "Noon",  sound: "N",  color: C.green,  emoji: "⭐", word: "نَجْم",    meaning: "Sitara"  },
  { letter: "ه", name: "Ha",    sound: "H",  color: C.blue,   emoji: "🌙", word: "هِلَال",   meaning: "Hilaal"  },
  { letter: "و", name: "Waw",   sound: "W",  color: C.pink,   emoji: "🌹", word: "وَرْد",    meaning: "Phool"   },
  { letter: "ي", name: "Ya",    sound: "Y",  color: C.yellow, emoji: "✋", word: "يَد",      meaning: "Haath"   },
];

export const SHORT_SURAHS = [
  {
    num: 114, name: "An-Nas", arabic: "سُورَةُ النَّاس", meaning: "Insaan",
    ayahs: 6, emoji: "👥", color: C.blue,
    verses: [
      { ar: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", ur: "Kaho mein panaah maangta hoon insaanon ke Rabb ki" },
      { ar: "مَلِكِ النَّاسِ", ur: "Insaanon ke Badshah ki" },
      { ar: "إِلَٰهِ النَّاسِ", ur: "Insaanon ke Ilaah ki" },
      { ar: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", ur: "Waswase dene wale ke shar se" },
      { ar: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", ur: "Jo insaanon ke seenon mein waswase daalta hai" },
      { ar: "مِنَ الْجِنَّةِ وَالنَّاسِ", ur: "Jinnat mein se bhi aur insaanon mein se bhi" },
    ]
  },
  {
    num: 113, name: "Al-Falaq", arabic: "سُورَةُ الْفَلَق", meaning: "Subah ka Noor",
    ayahs: 5, emoji: "🌅", color: C.orange,
    verses: [
      { ar: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", ur: "Kaho mein panaah maangta hoon subah ke Rabb ki" },
      { ar: "مِن شَرِّ مَا خَلَقَ", ur: "Har cheez ke shar se jo usne banayi" },
      { ar: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", ur: "Aur andheri raat ke shar se" },
      { ar: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", ur: "Aur gaanth mein phoonk maarne waalon ke shar se" },
      { ar: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", ur: "Aur haasid ke shar se jab hasad kare" },
    ]
  },
  {
    num: 112, name: "Al-Ikhlas", arabic: "سُورَةُ الْإِخْلَاص", meaning: "Ek hai Allah",
    ayahs: 4, emoji: "☝️", color: C.yellow,
    verses: [
      { ar: "قُلْ هُوَ اللَّهُ أَحَدٌ", ur: "Kaho woh Allah ek hai" },
      { ar: "اللَّهُ الصَّمَدُ", ur: "Allah bebnyaaz hai" },
      { ar: "لَمْ يَلِدْ وَلَمْ يُولَدْ", ur: "Na uski koi aulaad hai na woh kisi ka bacha" },
      { ar: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", ur: "Aur koi uske barabar nahi" },
    ]
  },
  {
    num: 110, name: "An-Nasr", arabic: "سُورَةُ النَّصْر", meaning: "Allah Ki Madad",
    ayahs: 3, emoji: "🏆", color: C.green,
    verses: [
      { ar: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ", ur: "Jab Allah ki madad aa jaaye aur fatah mil jaaye" },
      { ar: "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا", ur: "Aur log Allah ke deen mein jhund ke jhund dakhil hon" },
      { ar: "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا", ur: "Apne Rabb ki tasbeh karo aur maafi maango" },
    ]
  },
  {
    num: 108, name: "Al-Kawthar", arabic: "سُورَةُ الْكَوْثَر", meaning: "Bahut Zyada Bhalaai",
    ayahs: 3, emoji: "🌊", color: C.teal,
    verses: [
      { ar: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", ur: "Hum ne tumhe Kawthar yaani bahut bhalaayi di" },
      { ar: "فَصَلِّ لِرَبِّكَ وَانْحَرْ", ur: "Apne Rabb ke liye namaaz padho aur qurbani karo" },
      { ar: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ", ur: "Beshak tumhara dushman hi bepanaah hai" },
    ]
  },
  {
    num: 111, name: "Al-Masad", arabic: "سُورَةُ الْمَسَد", meaning: "Buri Niyyat Ka Anjam",
    ayahs: 5, emoji: "🔥", color: C.red,
    verses: [
      { ar: "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ", ur: "Abu Lahab ke haath tabah ho gaye aur woh tabah ho gaya" },
      { ar: "مَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ", ur: "Uske maal ne aur jo usne kamaya kuch kaam na aaya" },
      { ar: "سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ", ur: "Woh bhadakti aag mein daakhil hoga" },
      { ar: "وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ", ur: "Aur uski biwi bhi lakdiyan uthane waali" },
      { ar: "فِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ", ur: "Uske gale mein moondh ki rassi hogi" },
    ]
  },
];

export const PROPHETS = [
  { name: "Adam AS",       arabic: "آدم",      emoji: "🌱", color: C.green,  fact: "Quran mein 25 baar unka zikr hai",              story: "Allah ne Hazrat Adam AS ko apne haath se mitti se banaya. Woh pehle insaan the. Jannat mein rehte the. Phir zameen par aaye aur toubah ki aur Allah ne maaf kar diya." },
  { name: "Nooh AS",       arabic: "نوح",      emoji: "🚢", color: C.blue,   fact: "950 saal tak tabligh ki",                       story: "Hazrat Nooh AS ne 950 saal apni qoum ko samjhaya. Koi nahi maana toh Allah ne toofan bheja. Unhon ne kashti banayi. Iman wale bache aur zalimon ka wajood khatam hua." },
  { name: "Ibrahim AS",    arabic: "إبراهيم",  emoji: "🔥", color: C.orange, fact: "Khalilullah yaani Allah ke dost",                story: "Hazrat Ibrahim AS ne but todey. Zaalim badshah Namrud ne unhe aag mein daala. Magar Allah ne aag ko hukm diya ke Ibrahim ke liye thandi aur salamat ho ja. Aag gulzaar ban gayi." },
  { name: "Yusuf AS",      arabic: "يوسف",     emoji: "👑", color: C.yellow, fact: "Sabse khoobsurat kahani poori surah unhi par",   story: "Hazrat Yusuf AS ke bhai ne unhe kuwen mein daala. Phir Misr mein ghulaam bane. Qaidi bane. Magar Allah ne unhe Misr ka Wazir e Aazam bana diya. Sabar ka kitna acha nateeja." },
  { name: "Moosa AS",      arabic: "موسى",     emoji: "🪄", color: C.teal,   fact: "Quran mein sabse zyada naam aata hai",           story: "Hazrat Moosa AS Firown ke ghar mein pale. Allah ne unhe Nabi banaya. Lathhi se darya ko do hissa kar diya. Bani Israel ko aazaad karaya Firown ke zulm se." },
  { name: "Isa AS",        arabic: "عيسى",     emoji: "🕊️", color: C.purple, fact: "Allah ka kalmah aur Maryam AS ke bete",          story: "Hazrat Isa AS bina baap ke paida hue jo Allah ka mojza tha. Logon ko ilaj karte andhe ko aankhein dete murdon ko zinda karte. Aakhir aasman par utha liye gaye." },
  { name: "Muhammad ﷺ",   arabic: "محمد",     emoji: "🌙", color: C.yellow, fact: "Aakhri Nabi Khatamun Nabiyyeen",                 story: "Nabi Kareem ﷺ Mecca mein paida hue. Ghaar e Hira mein pehli wahi aayi. Teis saal mein Quran mukammal hua. Poori insaaniyat ke liye rehmat bana ke bheje gaye." },
];

export const DUAS_KIDS = [
  { title: "Khane Se Pehle",     arabic: "بِسْمِ اللَّهِ",                          urdu: "Allah ke naam se shuru karta hoon",          emoji: "🍽️", color: C.orange },
  { title: "Khane Ke Baad",      arabic: "الْحَمْدُ لِلَّهِ",                         urdu: "Tamam taarif Allah ke liye hai",             emoji: "😊",  color: C.green  },
  { title: "Sone Se Pehle",      arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",   urdu: "Tere naam se Allah marta hoon aur jeeta hoon", emoji: "😴",  color: C.blue   },
  { title: "Neend Se Uthke",     arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا",      urdu: "Shukar hai Allah ka jisne hamein zindagi di", emoji: "🌅",  color: C.yellow },
  { title: "Ghar Se Nikalte",    arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ", urdu: "Allah ke naam se Allah par bharosa kiya",    emoji: "🚪",  color: C.pink   },
  { title: "Aaine Mein Dekh Ke", arabic: "اللَّهُمَّ أَنْتَ حَسَّنْتَ خَلْقِي",      urdu: "Aye Allah tune meri soorat achhi banayi",    emoji: "🪞",  color: C.teal   },
];

// ── Shared styles ─────────────────────────────────────────────────────
export const backBtn = {
  background: "transparent", border: "1px solid #2a3a4a",
  color: C.dim, borderRadius: "10px", padding: "8px 16px",
  cursor: "pointer", fontSize: "13px", marginBottom: "16px",
};

// ── Voice Button ──────────────────────────────────────────────────────
export function VoiceBtn({ onClick, speaking, color, size = "md" }) {
  const sz = size === "sm" ? { btn: "30px", icon: "13px" } : { btn: "42px", icon: "18px" };
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick(); }}
      title="Suno"
      aria-label={speaking ? "Stop audio" : "Play audio"}
      style={{
        width: sz.btn, height: sz.btn, borderRadius: "50%", border: "none",
        background: speaking ? color : `${color}22`,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", fontSize: sz.icon, flexShrink: 0,
        transition: "all 0.2s",
        boxShadow: speaking ? `0 0 14px ${color}99` : "none",
      }}
    >
      {speaking ? "⏹" : "🔊"}
    </button>
  );
}

// ── SEO Structured Data ──────────────────────────────────────────────
const generateKidsStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "LearningResource",
  "name": "Kids Corner - Islamic Learning for Children",
  "description": "Learn Arabic letters (Huroof), short Surahs, Prophet stories, and daily Duas for kids. With audio, emojis, and fun interactive learning.",
  "educationalLevel": "Preschool to Elementary",
  "inLanguage": ["ar", "ur", "hi", "en"],
  "audience": {
    "@type": "EducationalAudience",
    "educationalRole": "student"
  },
  "about": [
    { "@type": "Thing", "name": "Arabic Alphabet" },
    { "@type": "Thing", "name": "Quran Surahs" },
    { "@type": "Thing", "name": "Islamic Prophets" },
    { "@type": "Thing", "name": "Islamic Duas" }
  ]
});

// ── Tabs Configuration ───────────────────────────────────────────────
const tabs = [
  { id: "huroof",   label: "Huroof", emoji: "🔤", description: "Arabic letters with sounds" },
  { id: "surahs",   label: "Surahs", emoji: "📖", description: "Short Surahs for kids" },
  { id: "prophets", label: "Anbiya", emoji: "⭐", description: "Prophet stories" },
  { id: "duas",     label: "Duaen",  emoji: "🤲", description: "Daily Duas for children" },
];

// ── Main Component ────────────────────────────────────────────────────
export default function KidsCorner() {
  const [tab, setTab] = useState("huroof");

  const handleTabChange = useCallback((newTab) => {
    stopAudio();
    setTab(newTab);
  }, []);

  const structuredData = React.useMemo(() => generateKidsStructuredData(), []);

  return (
    <HelmetProvider>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>Kids Corner - Learn Arabic Letters, Surahs & Duas for Kids</title>
        <meta name="title" content="Kids Corner - Learn Arabic Letters, Surahs & Duas for Kids" />
        <meta name="description" content="Fun Islamic learning for kids! Arabic alphabet (Huroof), short Surahs, Prophet stories, and daily Duas with audio. Interactive and engaging for children." />
        <meta name="keywords" content="Islamic learning for kids, Arabic alphabet for children, Quran for kids, Prophet stories kids, Islamic duas for kids, Huroof learning, Surah for kids, Islamic education children" />
        <meta name="author" content="Islamic Kids Corner" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Arabic, Urdu, Hindi, English" />
        <meta name="revisit-after" content="7 days" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://soulayah.com/kids-corner" />
        <meta property="og:title" content="Kids Corner - Islamic Learning for Children" />
        <meta property="og:description" content="Fun way for kids to learn Arabic letters, short Surahs, Prophet stories, and daily Duas with audio and emojis!" />
        <meta property="og:image" content="https://soulayah.com/kids-og-image.jpg" />
        <meta property="og:site_name" content="Islamic Kids Corner" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://soulayah.com/kids-corner" />
        <meta property="twitter:title" content="Kids Corner - Islamic Learning for Children" />
        <meta property="twitter:description" content="Fun way for kids to learn Arabic letters, short Surahs, Prophet stories, and daily Duas with audio and emojis!" />
        <meta property="twitter:image" content="https://soulayah.com/kids-og-image.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://soulayah.com/kids-corner" />
        
        {/* Preconnect for TTS */}
        <link rel="preconnect" href="https://translate.google.com" />
        <link rel="dns-prefetch" href="https://translate.google.com" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "system-ui, sans-serif", paddingBottom: "90px" }}>
        {/* Header */}
        <header style={{ background: "linear-gradient(135deg, #111827, #0a0f1a)", borderBottom: "1px solid #1f2d3a", padding: "24px 20px 16px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "34px", marginBottom: "4px" }} aria-hidden="true">👶</div>
            <h1 style={{
              fontSize: "22px", fontWeight: "800", margin: "0 0 4px",
              background: `linear-gradient(90deg, ${C.yellow}, ${C.orange})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              Kids Corner
            </h1>
            <p style={{ color: C.dim, fontSize: "12px", margin: "0 0 10px" }}>Islamic seekho — khel khel mein! 🌟</p>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: "20px", padding: "4px 14px", color: C.gold, fontSize: "11px",
            }}>
              🔊 Clear Arabic + Urdu voice — Google TTS
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav style={{ display: "flex", borderBottom: "1px solid #1f2d3a", background: "#0d1520", position: "sticky", top: 0, zIndex: 10 }} role="tablist" aria-label="Kids Corner sections">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              role="tab"
              aria-selected={tab === t.id}
              aria-controls={`panel-${t.id}`}
              style={{
                flex: 1, padding: "12px 4px", border: "none", background: "transparent",
                cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                borderBottom: tab === t.id ? `3px solid ${C.yellow}` : "3px solid transparent",
                transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: "20px" }} aria-hidden="true">{t.emoji}</span>
              <span style={{ 
                fontSize: "10px", 
                color: tab === t.id ? C.yellow : C.dim, 
                fontWeight: tab === t.id ? "700" : "400" 
              }}>
                {t.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Content Area */}
        <main style={{ padding: "20px", maxWidth: "480px", margin: "0 auto" }}>
          <Suspense fallback={
            <div style={{ textAlign: "center", padding: "40px", color: C.dim }}>
              <div style={{ fontSize: "30px", marginBottom: "12px" }}>⏳</div>
              <p>Loading...</p>
            </div>
          }>
            {tab === "huroof" && (
              <div id="panel-huroof" role="tabpanel" aria-label="Arabic Letters">
                <HuroofView />
              </div>
            )}
            {tab === "surahs" && (
              <div id="panel-surahs" role="tabpanel" aria-label="Short Surahs">
                <SurahsView />
              </div>
            )}
            {tab === "prophets" && (
              <div id="panel-prophets" role="tabpanel" aria-label="Prophet Stories">
                <ProphetsView />
              </div>
            )}
            {tab === "duas" && (
              <div id="panel-duas" role="tabpanel" aria-label="Daily Duas">
                <DuasView />
              </div>
            )}
          </Suspense>
        </main>

        <style>{`
          @keyframes popIn   { from { opacity:0; transform:scale(0.85);      } to { opacity:1; transform:scale(1);      } }
          @keyframes slideIn { from { opacity:0; transform:translateX(-14px); } to { opacity:1; transform:translateX(0); } }
          @keyframes fadeUp  { from { opacity:0; transform:translateY(10px);  } to { opacity:1; transform:translateY(0); } }
          @keyframes float   { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-8px)} }
          @keyframes bounce  { 0%,100%{transform:scale(1)}       50%{transform:scale(1.08)}      }
        `}</style>
      </div>
    </HelmetProvider>
  );
}