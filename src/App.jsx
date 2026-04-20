import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Reader from './pages/Reader';
import MoodFinder from './pages/MoodFinder';
import Vocabulary from './pages/Vocabulary';
import TafsirChat from './pages/TafsirChat';

import './App.css';

// ─── Splash Screen Component ───
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
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#0a0a0f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 1s ease-in-out',
        pointerEvents: fadeOut ? 'none' : 'all',
      }}
    >
      {/* Glow effect */}
      <div
        style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'pulse 2s ease-in-out infinite',
        }}
      />

      {/* Main Image */}
      <div style={{ position: 'relative', animation: 'float 3s ease-in-out infinite' }}>
        <img
          src="/splash-quran.png"
          alt="Quran & Islam"
          style={{
            width: '280px',
            height: 'auto',
            filter: 'drop-shadow(0 0 30px rgba(201,168,76,0.3))',
          }}
        />
      </div>

      {/* Loading bar */}
      <div
        style={{
          marginTop: '40px',
          width: '200px',
          height: '2px',
          background: 'rgba(201,168,76,0.1)',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: '100%',
            background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
            animation: 'loading 3s ease-in-out infinite',
            transformOrigin: 'left',
          }}
        />
      </div>

      {/* Loading text */}
      <p
        style={{
          marginTop: '20px',
          color: '#C9A84C',
          fontSize: '12px',
          letterSpacing: '4px',
          opacity: 0.6,
          animation: 'blink 1.5s ease-in-out infinite',
        }}
      >
        LOADING...
      </p>

      {/* Bismillah */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          fontFamily: "'Amiri', serif",
          fontSize: '18px',
          color: 'rgba(201,168,76,0.3)',
          letterSpacing: '2px',
        }}
      >
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </div>

      {/* Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes loading {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(1); }
          100% { transform: scaleX(0); transform-origin: right; }
        }
        @keyframes blink {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}

// ─── Bottom Navigation ───
function BottomNav() {
  const location = useLocation();

  const tabs = [
    { path: '/', icon: '🕌', label: 'Home' },
    { path: '/reader', icon: '📖', label: 'Reader' },
    { path: '/mood', icon: '💙', label: 'Mood' },
    { path: '/vocab', icon: '🔤', label: 'Vocab' },
    { path: '/tafsir', icon: '💬', label: 'Tafsir' },
  ];

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(7,9,13,0.97)',
      borderTop: '1px solid rgba(201,168,76,0.12)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      padding: '8px 0 12px',
    }}>
      {tabs.map(tab => {
        const isActive = location.pathname === tab.path;
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '3px',
              color: isActive ? '#C9A84C' : '#3a3028',
              textDecoration: 'none', padding: '6px 4px',
              borderRadius: '10px', transition: 'all 0.2s',
              fontSize: '10px', letterSpacing: '0.5px',
            }}
          >
            <span style={{ fontSize: '20px' }}>{tab.icon}</span>
            <span>{tab.label}</span>
            {isActive && (
              <div style={{
                width: '18px', height: '2px',
                background: '#C9A84C', borderRadius: '1px',
              }} />
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}

// ─── Layout with Bottom Nav ───
function Layout({ children }) {
  return (
    <div style={{ paddingBottom: '72px' }}>
      {children}
      <BottomNav />
    </div>
  );
}

// ─── Main App ───
function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if user has seen splash in this session
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      setShowSplash(false);
    }
    setIsReady(true);
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem('hasSeenSplash', 'true');
    setShowSplash(false);
  };

  if (!isReady) return null;

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/reader" element={<Layout><Reader /></Layout>} />
          <Route path="/mood" element={<Layout><MoodFinder /></Layout>} />
          <Route path="/vocab" element={<Layout><Vocabulary /></Layout>} />
          <Route path="/tafsir" element={<Layout><TafsirChat /></Layout>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;