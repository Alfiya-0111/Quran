import { useState, useEffect } from "react";
import SplashScreen from "./SplashScreen";
import Home from "./Home";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");

    // 📱 Mobile pe splash thoda short rakho
    const isMobile = window.innerWidth < 768;

    if (hasSeenSplash) {
      setShowSplash(false);
    } else {
      // optional: auto hide splash after time
      setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem("hasSeenSplash", "true");
      }, isMobile ? 2000 : 3000); // mobile fast, desktop slow
    }

    setIsReady(true);
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem("hasSeenSplash", "true");
    setShowSplash(false);
  };

  if (!isReady) return null;

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      maxWidth: "100vw",
      overflowX: "hidden",
      display: "flex",
      flexDirection: "column"
    }}>
      
      {/* Splash Overlay */}
      {showSplash && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "#fff"
        }}>
          <SplashScreen onComplete={handleSplashComplete} />
        </div>
      )}

      {/* Main App */}
      <div style={{
        flex: 1,
        width: "100%",
        padding: window.innerWidth < 768 ? "10px" : "20px"
      }}>
        <Home />
      </div>

    </div>
  );
}