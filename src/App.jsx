import { useState, useEffect, lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useLocation,
} from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";

import { MdOutlineWbSunny, MdOutlineQuiz } from "react-icons/md";
import { FaMosque, FaBookOpen, FaHeart, FaPrayingHands, FaLanguage, FaComments } from "react-icons/fa";
import { TbMoodKid, TbPlayCard2 } from "react-icons/tb";
import { GiPrayerBeads } from "react-icons/gi";
import { PiHandsPrayingFill } from "react-icons/pi";
import { BsPeople } from "react-icons/bs";

// ── Lazy Imports ──────────────────────────────────────────────
const Home           = lazy(() => import("./pages/Home"));
const Reader         = lazy(() => import("./pages/Reader"));
const MoodFinder     = lazy(() => import("./pages/MoodFinder"));
const Vocabulary     = lazy(() => import("./pages/Vocabulary"));
const TafsirChat     = lazy(() => import("./pages/TafsirChat"));
const Duas           = lazy(() => import("./pages/Duas"));
const FaimilyRead    = lazy(() => import("./pages/FaimilyRead"));
const Prayer         = lazy(() => import("./pages/Prayer"));
const Cards          = lazy(() => import("./pages/Cards"));
const Sadqa          = lazy(() => import("./pages/Sadqa"));
const CartoonStories = lazy(() => import("./pages/CartoonStories"));
const Names          = lazy(() => import("./pages/Names"));
const Kids           = lazy(() => import("./pages/Kids"));
const IslamicQuiz    = lazy(() => import("./components/IslamicQuiz"));

import "./App.css";

// ── Site config — ek jagah rakho, sab jagah use karo ────────────────
const SITE_URL   = "https://soulayah.com"; // ← apna domain
const SITE_NAME  = "Soulayah";
const OG_IMAGE   = `${SITE_URL}/og-image.png`;

// ── Per-page SEO data ────────────────────────────────────────────────
const PAGE_META = {
  "/": {
    title: `${SITE_NAME} — Quran, Duas, Prayer Times & Islamic App`,
    description: "Read Quran with translation, find duas by mood, get prayer times, Islamic stories for kids, and learn Arabic. Free Islamic companion app.",
    keywords: "quran app, quran online, duas, prayer times, Islamic app, quran in urdu, namaz time, islamic learning",
    lang: "en",
  },
  "/reader": {
    title: `Quran Reader — Arabic Text & Translation | ${SITE_NAME}`,
    description: "Read the Holy Quran with Arabic text, Hindi/Urdu/English translation, word-by-word meaning, and audio recitation. Beautiful and fast Quran reader.",
    keywords: "quran reader online, quran with urdu translation, quran hindi, quran audio, quran surah list",
    lang: "ar",
  },
  "/mood": {
    title: `Quran Ayaat by Mood — Dil Ka Sukoon | ${SITE_NAME}`,
    description: "Feeling anxious, sad, hopeless, or grateful? Find Quranic ayaat suited to your current emotion. Quran verses for every mood.",
    keywords: "quran for anxiety, quran verses for sadness, quran for hope, quran emotional healing, ayaat for sadness",
    lang: "en",
  },
  "/duas": {
    title: `Daily Duas & Azkar — Morning Evening Supplications | ${SITE_NAME}`,
    description: "Authentic daily duas and azkar for morning, evening, eating, sleeping, and more. Includes digital tasbeeh counter. Arabic with Urdu and Hindi translation.",
    keywords: "morning duas, evening azkar, subah ki duas, sham ki duas, tasbeeh counter online, daily duas",
    lang: "en",
  },
  "/prayer": {
    title: `Prayer Times & Qibla Direction — Namaz Waqt | ${SITE_NAME}`,
    description: "Accurate Islamic prayer times for your location. Fajr, Zuhr, Asr, Maghrib, Isha timings with Qibla direction finder. Never miss a salah.",
    keywords: "prayer times, namaz time, fajr time today, qibla direction, salah times, islamic prayer app",
    lang: "en",
  },
  "/cartoons": {
    title: `Islamic Cartoon Stories for Kids — Hindi Urdu English | ${SITE_NAME}`,
    description: "Watch Islamic cartoon stories for children. Prophet stories, Quran learning videos, Omar & Hana, IQRA Cartoon in Hindi, Urdu and English.",
    keywords: "islamic cartoons for kids, prophet stories cartoon, islamic stories hindi, IQRA cartoon, Omar Hana, quran for children",
    lang: "en",
  },
  "/sadqa": {
    title: `Sadqa-e-Jariya Tracker — Amal for Loved Ones | ${SITE_NAME}`,
    description: "Track Quran recitation, duas, and sadqa for your loved ones. Keep a continuous chain of charity and good deeds — Sadqa-e-Jariya.",
    keywords: "sadqa e jariya, amal tracker, quran tracker for marhoom, continuous charity islamic, islamic deed tracker",
    lang: "ur",
  },
  "/names": {
    title: `Allah Ke 99 Naam — Asma ul Husna | ${SITE_NAME}`,
    description: "Allah ke 99 naam — Asma ul Husna — Urdu tarjuma, fazilat aur fawaid ke saath. Search karein, favorites save karein. Ar-Rahman, Ar-Raheem aur tamam asma.",
    keywords: "99 names of allah, asma ul husna urdu, allah ke naam, 99 names benefits, asmaul husna hindi",
    lang: "ur",
  },
  "/kids": {
    title: `Islamic Learning for Kids — Arabic Huroof, Surahs & Duas | ${SITE_NAME}`,
    description: "Fun Islamic education for children. Learn Arabic alphabet (Huroof), short Surahs, Prophet stories, and daily duas with audio and emojis.",
    keywords: "islamic learning kids, arabic alphabet children, quran for kids, prophet stories kids, islamic duas kids, huroof learning",
    lang: "en",
  },
  "/quiz": {
    title: `Islamic Quiz — Quran, Prophets, Seerah | ${SITE_NAME}`,
    description: "Test your Islamic knowledge with quizzes on Quran, Prophets, 5 Pillars, Duas, and Seerah. Free Islamic quiz for kids and adults in Hindi/Urdu/English.",
    keywords: "islamic quiz, quran quiz, prophet quiz, islamic knowledge test, 5 pillars quiz, seerah quiz, islamic trivia",
    lang: "en",
  },
  "/cards": {
    title: `Quran Ayah Cards — Share Beautiful Islamic Cards | ${SITE_NAME}`,
    description: "Create and share beautiful Quran ayah cards. Multiple themes, font sizes, and download options. Sadqa tracker and Dua board included.",
    keywords: "quran ayah cards, islamic cards share, quran wallpaper, quran card maker, sadqa tracker, dua board",
    lang: "en",
  },
  "/family": {
    title: `Family Quran Reading Tracker — Read Together | ${SITE_NAME}`,
    description: "Track your family's Quran reading progress together. Mark surahs, verses, and complete Khatm-e-Quran as a family.",
    keywords: "family quran reading, quran tracker family, khatm quran together, family islamic app, quran khatam tracker",
    lang: "en",
  },
  "/vocab": {
    title: `Word-by-Word Quran — Learn Arabic | ${SITE_NAME}`,
    description: "Read the Quran word by word with Urdu/Hindi meaning. Tap any Arabic word to see its meaning. Save vocabulary and take quiz.",
    keywords: "quran word by word urdu, arabic words meaning, kalma ba kalma quran, learn quran arabic, quranic vocabulary",
    lang: "ur",
  },
  "/tafsir": {
    title: `Quran Tafsir Chat — AI Islamic Scholar | ${SITE_NAME}`,
    description: "Ask questions about Quranic verses and get detailed tafsir explanations in Hinglish. AI-powered Islamic scholar available 24/7.",
    keywords: "quran tafsir chat, islamic AI, quran explanation urdu hindi, ayaat ka matlab, islamic scholar online",
    lang: "en",
  },
};

// ── Per-page SEO Component ───────────────────────────────────────────
function PageSEO() {
  const location = useLocation();
  const meta = PAGE_META[location.pathname] || PAGE_META["/"];
  const canonicalUrl = `${SITE_URL}${location.pathname}`;

  return (
    <Helmet>
      <html lang={meta.lang} />
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      {meta.keywords && <meta name="keywords" content={meta.keywords} />}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={meta.lang === "ur" ? "ur_PK" : meta.lang === "ar" ? "ar_SA" : "en_US"} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={OG_IMAGE} />
    </Helmet>
  );
}

// ── Splash Screen ────────────────────────────────────────────────────
function SplashScreen({ onComplete }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 3500);
    const t2 = setTimeout(() => onComplete?.(), 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "#0a0a0f",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 1s ease-in-out",
        pointerEvents: fadeOut ? "none" : "all",
      }}
    >
      <div style={{ position: "absolute", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)", animation: "pulse 2s ease-in-out infinite" }} />
      <div style={{ position: "relative", animation: "float 3s ease-in-out infinite" }}>
        <img
          src="/splash-quran.png"
          alt="SoulAyah"
          width="280"
          height="auto"
          loading="eager"
          fetchpriority="high"
          style={{ width: "280px", height: "auto", filter: "drop-shadow(0 0 30px rgba(201,168,76,0.3))" }}
        />
      </div>
      <div style={{ marginTop: "40px", width: "200px", height: "2px", background: "rgba(201,168,76,0.1)", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{ width: "100%", height: "100%", background: "linear-gradient(90deg, transparent, #C9A84C, transparent)", animation: "loading 3s ease-in-out infinite" }} />
      </div>
      <p style={{ marginTop: "20px", color: "#C9A84C", fontSize: "12px", letterSpacing: "4px", opacity: 0.6, animation: "blink 1.5s ease-in-out infinite" }}>
        LOADING...
      </p>
      <style>{`
        @keyframes pulse { 0%,100%{transform:scale(1);opacity:.5} 50%{transform:scale(1.2);opacity:.8} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes loading { 0%{transform:scaleX(0)} 50%{transform:scaleX(1)} 100%{transform:scaleX(0);transform-origin:right} }
        @keyframes blink { 0%,100%{opacity:.6} 50%{opacity:.2} }
      `}</style>
    </div>
  );
}

// ── Bottom Nav ───────────────────────────────────────────────────────
const NAV_TABS = [
  { path: "/",         icon: <FaMosque />,          label: "Home"    },
  { path: "/reader",   icon: <FaBookOpen />,         label: "Reader"  },
  { path: "/mood",     icon: <FaHeart />,            label: "Mood"    },
  { path: "/cartoons", icon: <TbPlayCard2 />,        label: "Stories" },
  { path: "/duas",     icon: <FaPrayingHands />,     label: "Duas"    },
  { path: "/sadqa",    icon: <GiPrayerBeads />,      label: "Sadqa"   },
  { path: "/names",    icon: <PiHandsPrayingFill />, label: "Names"   },
  { path: "/prayer",   icon: <MdOutlineWbSunny />,   label: "Prayer"  },
  { path: "/kids",     icon: <TbMoodKid />,          label: "Kids"    },
  { path: "/quiz",     icon: <MdOutlineQuiz />,      label: "Quiz"    },
  { path: "/cards",    icon: <TbPlayCard2 />,        label: "Cards"   },
  { path: "/family",   icon: <BsPeople />,           label: "Family"  },
  { path: "/vocab",    icon: <FaLanguage />,         label: "Vocab"   },
  { path: "/tafsir",   icon: <FaComments />,         label: "Tafsir"  },
];

function BottomNav() {
  const location = useLocation();

  return (
    <nav
      aria-label="Main navigation"
      style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(7,9,13,0.97)",
        borderTop: "1px solid rgba(201,168,76,0.12)",
        backdropFilter: "blur(20px)",
        display: "flex", padding: "8px 0 12px",
        overflowX: "auto",
      }}
    >
      {NAV_TABS.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            aria-label={tab.label}
            aria-current={isActive ? "page" : undefined}
            style={{
              flex: 1, minWidth: "60px",
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: "4px",
              textDecoration: "none", padding: "6px 4px",
              color: isActive ? "#C9A84C" : "#3a3028",
              fontSize: "10px", letterSpacing: "0.5px",
              transition: "color 0.2s",
            }}
          >
            <span style={{ fontSize: "19px" }} aria-hidden="true">{tab.icon}</span>
            <span>{tab.label}</span>
            {isActive && <div style={{ width: "18px", height: "2px", borderRadius: "2px", background: "#C9A84C" }} />}
          </NavLink>
        );
      })}
    </nav>
  );
}

// ── Page Loader ──────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#C9A84C", fontSize: "12px", letterSpacing: "3px", opacity: 0.5 }}>
      LOADING...
    </div>
  );
}

function Layout({ children }) {
  return (
    <div style={{ paddingBottom: "72px" }}>
      {children}
      <BottomNav />
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────
function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isReady, setIsReady]       = useState(false);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    if (hasSeenSplash) setShowSplash(false);
    setIsReady(true);
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem("hasSeenSplash", "true");
    setShowSplash(false);
  };

  if (!isReady) return null;

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      <BrowserRouter>
        <PageSEO />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"         element={<Layout><Home /></Layout>} />
            <Route path="/reader"   element={<Layout><Reader /></Layout>} />
            <Route path="/mood"     element={<Layout><MoodFinder /></Layout>} />
            <Route path="/cartoons" element={<Layout><CartoonStories /></Layout>} />
            <Route path="/duas"     element={<Layout><Duas /></Layout>} />
            <Route path="/sadqa"    element={<Layout><Sadqa /></Layout>} />
            <Route path="/names"    element={<Layout><Names /></Layout>} />
            <Route path="/prayer"   element={<Layout><Prayer /></Layout>} />
            <Route path="/kids"     element={<Layout><Kids /></Layout>} />
            <Route path="/quiz"     element={<Layout><IslamicQuiz /></Layout>} />
            <Route path="/cards"    element={<Layout><Cards /></Layout>} />
            <Route path="/family"   element={<Layout><FaimilyRead /></Layout>} />
            <Route path="/vocab"    element={<Layout><Vocabulary /></Layout>} />
            <Route path="/tafsir"   element={<Layout><TafsirChat /></Layout>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;