import { useState, useEffect } from "react";
import SplashScreen from "./SplashScreen";
import Home from "./Home"; // Aapka Home component

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isReady, setIsReady] = useState(false);

  // Pehle check karo ke user ne splash screen pehle dekhi hai ya nahi
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

  if (!isReady) return null; // Initial load

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <Home />
    </>
  );
}