import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useLocation,
} from "react-router-dom";

import { MdOutlineWbSunny } from "react-icons/md";
import {
  FaMosque,
  FaBookOpen,
  FaHeart,
  FaPrayingHands,
  FaLanguage,
  FaComments,
} from "react-icons/fa";
import { TbMoodKid } from "react-icons/tb";

import { BsPeople } from 'react-icons/bs';
import { TbPlayCard2 } from "react-icons/tb";
import { GiPrayerBeads } from "react-icons/gi"
import { PiHandsPrayingFill } from "react-icons/pi"
import Home from "./pages/Home";
import Reader from "./pages/Reader";
import MoodFinder from "./pages/MoodFinder";
import Vocabulary from "./pages/Vocabulary";
import TafsirChat from "./pages/TafsirChat";
import Duas from './pages/Duas'
import FaimilyRead from "./pages/FaimilyRead";
import Prayer from './pages/Prayer'
import Cards from './pages/Cards'
import Sadqa from './pages/Sadqa'
// import Hidayah from "./pages/Hidayah";
import CartoonStories from "./pages/CartoonStories";
import Names from './pages/Names'

import "./App.css";
import KidsSection from "./components/KidsSection";

// ───────────────── Splash Screen ─────────────────
function SplashScreen({ onComplete }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 3500);
    const completeTimer = setTimeout(() => onComplete?.(), 4500);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0a0a0f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 1s ease-in-out",
        pointerEvents: fadeOut ? "none" : "all",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)",
          animation: "pulse 2s ease-in-out infinite",
        }}
      />

      {/* Main Image */}
      <div
        style={{
          position: "relative",
          animation: "float 3s ease-in-out infinite",
        }}
      >
        <img
          src="/splash-quran.png"
          alt="Quran App"
          style={{
            width: "280px",
            height: "auto",
            filter: "drop-shadow(0 0 30px rgba(201,168,76,0.3))",
          }}
        />
      </div>

      {/* Loading Bar */}
      <div
        style={{
          marginTop: "40px",
          width: "200px",
          height: "2px",
          background: "rgba(201,168,76,0.1)",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(90deg, transparent, #C9A84C, transparent)",
            animation: "loading 3s ease-in-out infinite",
          }}
        />
      </div>

      {/* Loading Text */}
      <p
        style={{
          marginTop: "20px",
          color: "#C9A84C",
          fontSize: "12px",
          letterSpacing: "4px",
          opacity: 0.6,
          animation: "blink 1.5s ease-in-out infinite",
        }}
      >
        LOADING...
      </p>

      {/* Animation */}
      <style>{`
        @keyframes pulse {
          0%,100% {transform:scale(1); opacity:0.5;}
          50% {transform:scale(1.2); opacity:0.8;}
        }

        @keyframes float {
          0%,100% {transform:translateY(0);}
          50% {transform:translateY(-10px);}
        }

        @keyframes loading {
          0% {transform:scaleX(0);}
          50% {transform:scaleX(1);}
          100% {
            transform:scaleX(0);
            transform-origin:right;
          }
        }

        @keyframes blink {
          0%,100% {opacity:0.6;}
          50% {opacity:0.2;}
        }
      `}</style>
    </div>
  );
}

// ───────────────── Bottom Navigation ─────────────────
function BottomNav() {
  const location = useLocation();

  const tabs = [
    {
      path: "/",
      icon: <FaMosque />,
      label: "Home",
    },
    {
      path: "/reader",
      icon: <FaBookOpen />,
      label: "Reader",
    },
    {
      path: "/mood",
      icon: <FaHeart />,
      label: "Mood",
    },
   
    {
      path: "/cartoons",
      icon: <TbPlayCard2 />,
      label: "Stories",
    },
    { 
      path: '/duas', 
      icon: <FaPrayingHands />, 
      label: 'Duas' 
    },
   {
  path: '/sadqa',
  icon: <GiPrayerBeads />,
  label: 'Sadqa'
},
{
  path: '/names',
  icon: <PiHandsPrayingFill />,
  label: 'Names'
},
    { 
      path: '/prayer', 
      icon: <MdOutlineWbSunny />, 
      label: 'Prayer' 
    },
    {
      path:'/kids',
      icon:<TbMoodKid />,
      lable:'Kids',
    },

    {
      path: "/cards",
      icon: <TbPlayCard2 />,
      label: "Cards",
    },
    {
      path: "/family",
      icon: <BsPeople />,
      label: "Family",
    },
    {
      path: "/vocab",
      icon: <FaLanguage />,
      label: "Vocab",
    },
    {
      path: "/tafsir",
      icon: <FaComments />,
      label: "Tafsir",
    },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "rgba(7,9,13,0.97)",
        borderTop: "1px solid rgba(201,168,76,0.12)",
        backdropFilter: "blur(20px)",
        display: "flex",
        padding: "8px 0 12px",
        overflow: "auto",
      }}
    >
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;

        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              textDecoration: "none",
              padding: "6px 4px",
              borderRadius: "10px",
              transition: "all 0.2s",
              color: isActive ? "#C9A84C" : "#3a3028",
              fontSize: "10px",
              letterSpacing: "0.5px",
              minWidth: "60px",
            }}
          >
            <span style={{ fontSize: "19px" }}>{tab.icon}</span>
            <span>{tab.label}</span>

            {isActive && (
              <div
                style={{
                  width: "18px",
                  height: "2px",
                  borderRadius: "2px",
                  background: "#C9A84C",
                }}
              />
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}

// ───────────────── Layout ─────────────────
function Layout({ children }) {
  return (
    <div style={{ paddingBottom: "72px" }}>
      {children}
      <BottomNav />
    </div>
  );
}

// ───────────────── Main App ─────────────────
function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");

    if (hasSeenSplash) {
      setShowSplash(false);
    }

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
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />

          <Route
            path="/reader"
            element={
              <Layout>
                <Reader />
              </Layout>
            }
          />

          <Route
            path="/mood"
            element={
              <Layout>
                <MoodFinder />
              </Layout>
            }
          />

         

          <Route
            path="/cartoons"
            element={
              <Layout>
                <CartoonStories />
              </Layout>
            }
          />

          <Route path="/duas" element={<Layout><Duas /></Layout>} />
          <Route path="/sadqa" element={<Layout><Sadqa /></Layout>} />
<Route path="/names" element={<Layout><Names /></Layout>} />

          <Route path="/prayer" element={<Layout><Prayer /></Layout>} />
           <Route path="/kids" element={<Layout><KidsSection /></Layout>} />

          <Route path="/cards" element={<Layout><Cards /></Layout>} />

          <Route
            path="/family"
            element={
              <Layout>
                <FaimilyRead />
              </Layout>
            }
          />

          <Route
            path="/vocab"
            element={
              <Layout>
                <Vocabulary />
              </Layout>
            }
          />

          <Route
            path="/tafsir"
            element={
              <Layout>
                <TafsirChat />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;