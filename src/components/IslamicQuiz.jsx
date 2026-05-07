import { useState, useEffect, useCallback } from "react";

// ─── Palette ──────────────────────────────────────────────────────────
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
  goldDim: "rgba(201,168,76,0.15)",
};

// ─── Quiz Data ────────────────────────────────────────────────────────
const QUIZ_CATEGORIES = [
  {
    id: "quran",
    name: "Quran",
    arabic: "القرآن",
    emoji: "📖",
    color: C.green,
    description: "Surahs, Ayaat, aur Qurani ilm",
    questions: [
      { q: "Quran kitne paron (Juz) mein divided hai?", options: ["20", "30", "40", "25"], correct: 1, fact: "Quran 30 Paras (Juz) mein divided hai." },
      { q: "Sabse choti Surah kaunsi hai?", options: ["Al-Ikhlas", "Al-Kawthar", "An-Nas", "Al-Falaq"], correct: 1, fact: "Surah Al-Kawthar sirf 3 ayaat ki hai — sabse choti surah." },
      { q: "Surah Al-Baqarah mein kitni ayaat hain?", options: ["286", "200", "176", "120"], correct: 0, fact: "Surah Al-Baqarah 286 ayaat ki hai — sabse badi surah." },
      { q: "Bismillah kaunsi surah mein nahi hai?", options: ["At-Tawbah", "Al-Fatihah", "Ya-Sin", "Ar-Rahman"], correct: 0, fact: "Surah At-Tawbah (Surah 9) mein Bismillah nahi hai." },
      { q: "'Ar-Rahman' ka matlab kya hai?", options: ["The Merciful", "The Beneficent", "The Forgiving", "The Wise"], correct: 1, fact: "Ar-Rahman = The Beneficent (bohat zyada rehm karne wala)." },
      { q: "Quran pehli wahi kis ghaar mein aayi?", options: ["Ghaar-e-Hira", "Ghaar-e-Thaur", "Jabal-e-Noor", "Jabal-e-Uhad"], correct: 0, fact: "Pehli wahi Ghaar-e-Hira (Jabal-e-Noor) mein aayi." },
      { q: "'Al-Fatihah' ka matlab?", options: ["The Opening", "The Victory", "The Light", "The Dawn"], correct: 0, fact: "Al-Fatihah = The Opening (Quran ki pehli surah)." },
      { q: "Surah Ya-Sin ko kya kaha jata hai?", options: ["Qalb-ul-Quran", "Umm-ul-Kitab", "Surah-e-Rahmat", "Surah-e-Noor"], correct: 0, fact: "Surah Ya-Sin ko 'Qalb-ul-Quran' (Dil-e-Quran) kaha jata hai." },
      { q: "Quran mein kitne Surahs hain?", options: ["112", "114", "116", "110"], correct: 1, fact: "Quran mein total 114 Surahs hain." },
      { q: "'Al-Kahf' ka matlab?", options: ["The Cave", "The Elephant", "The Dawn", "The Star"], correct: 0, fact: "Al-Kahf = The Cave (Ashab-e-Kahf ki kahani isi surah mein hai)." },
    ]
  },
  {
    id: "prophets",
    name: "Anbiya",
    arabic: "الأنبياء",
    emoji: "⭐",
    color: C.blue,
    description: "Allah ke Pyare Nabi aur unki zindagi",
    questions: [
      { q: "Aakhri Nabi kaun hain?", options: ["Hazrat Isa AS", "Hazrat Moosa AS", "Hazrat Muhammad ﷺ", "Hazrat Ibrahim AS"], correct: 2, fact: "Hazrat Muhammad ﷺ aakhri Nabi hain — Khatamun Nabiyyeen." },
      { q: "Hazrat Nooh AS ne kitne saal tabligh ki?", options: ["100", "500", "950", "800"], correct: 2, fact: "Hazrat Nooh AS ne 950 saal apni qoum ko samjhaya." },
      { q: "Hazrat Ibrahim AS ko kya kaha jata hai?", options: ["Khalilullah", "Kaleemullah", "Roohullah", "Habibullah"], correct: 0, fact: "Hazrat Ibrahim AS = Khalilullah (Allah ke dost)." },
      { q: "Hazrat Yusuf AS kis mulk ke Wazir bane?", options: ["Sham", "Misr (Egypt)", "Iraq", "Yemen"], correct: 1, fact: "Hazrat Yusuf AS Misr (Egypt) ke Wazir-e-Aazam bane." },
      { q: "Hazrat Moosa AS ne kis badshah se muqabla kiya?", options: ["Namrud", "Firown", "Nebuchadnezzar", "Cyrus"], correct: 1, fact: "Hazrat Moosa AS ne Firown (Pharaoh) se muqabla kiya." },
      { q: "Hazrat Isa AS bina baap ke paida hue — yeh kis ka mojza tha?", options: ["Hazrat Maryam AS ka", "Hazrat Isa AS ka", "Allah ka", "Sab ka"], correct: 2, fact: "Hazrat Isa AS ka bina baap ke paida hona Allah ka mojza tha." },
      { q: "Hazrat Adam AS kis se banaye gaye?", options: ["Pani se", "Aag se", "Mitti se", "Hawa se"], correct: 2, fact: "Hazrat Adam AS ko Allah ne mitti (soil) se banaya." },
      { q: "Hazrat Muhammad ﷺ ka kunya (laqab) kya tha?", options: ["Abu Bakr", "Abu Talib", "Abul Qasim", "Abu Hurairah"], correct: 2, fact: "Hazrat Muhammad ﷺ ka kunya 'Abul Qasim' tha." },
      { q: "Hazrat Yunus AS kis machli ke pet mein gaye?", options: ["Whale", "Shark", "Dolphin", "Octopus"], correct: 0, fact: "Hazrat Yunus AS ek badi machli (whale) ke pet mein 3 din rahe." },
      { q: "Hazrat Sulaiman AS ko kis cheez par hukumat di gayi?", options: ["Sirf insaanon par", "Janwaron par", "Hawa, paani, jinnat, janwar — sab par", "Sirf jinnat par"], correct: 2, fact: "Hazrat Sulaiman AS ko hawa, paani, jinnat, janwar — sab par hukumat di gayi." },
    ]
  },
  {
    id: "pillars",
    name: "Arkan-e-Islam",
    arabic: "أركان الإسلام",
    emoji: "🕋",
    color: C.gold,
    description: "Islam ke 5 bunyadi rukn",
    questions: [
      { q: "Islam ke kitne Arkan (pillars) hain?", options: ["3", "4", "5", "6"], correct: 2, fact: "Islam ke 5 Arkan hain — 5 Pillars of Islam." },
      { q: "Pehla Rukn kya hai?", options: ["Namaz", "Roza", "Shahadah", "Zakat"], correct: 2, fact: "Pehla Rukn = Shahadah (Kalma Tayyabah padhna)." },
      { q: "Namaz din mein kitni farz hain?", options: ["3", "4", "5", "6"], correct: 2, fact: "Din mein 5 waqt ki Namaz farz hai — Fajr, Zuhr, Asr, Maghrib, Isha." },
      { q: "Zakat kis saal mein deni chahiye?", options: ["Har maheene", "Har saal", "Har hafte", "Har roz"], correct: 1, fact: "Zakat har saal (lunar year) apni savings par deni chahiye." },
      { q: "Hajj kis mahine mein farz hai?", options: ["Ramzan", "Shawwal", "Dhul-Hijjah", "Muharram"], correct: 2, fact: "Hajj Dhul-Hijjah ke mahine mein farz hai." },
      { q: "Roza kis mahine mein farz hai?", options: ["Shawwal", "Ramzan", "Muharram", "Rajab"], correct: 1, fact: "Roza Ramzan ke mahine mein farz hai." },
      { q: "Shahadah mein kya kehte hain?", options: ["Allahu Akbar", "La ilaha illallah", "SubhanAllah", "Alhamdulillah"], correct: 1, fact: "Shahadah = 'La ilaha illallah, Muhammadur Rasoolullah'" },
      { q: "Zakat kitne percent hoti hai?", options: ["2.5%", "5%", "10%", "1%"], correct: 0, fact: "Zakat = 2.5% (1/40th) of your eligible wealth." },
      { q: "Hajj kitni baar farz hai zindagi mein?", options: ["Har saal", "Sirf ek baar", "Do baar", "Jitni marzi"], correct: 1, fact: "Hajj sirf ek baar farz hai — agar taaqat aur wasail hon." },
      { q: "Roza kis waqt se kis waqt tak hota hai?", options: ["Maghrib se Fajr", "Fajr se Maghrib", "Zuhr se Asr", "Isha se Fajr"], correct: 1, fact: "Roza Fajr (subah) se Maghrib (shaam) tak hota hai." },
    ]
  },
  {
    id: "duas",
    name: "Duaen",
    arabic: "الأدعية",
    emoji: "🤲",
    color: C.purple,
    description: "Rozmarra ki duaen aur unke fawaid",
    questions: [
      { q: "Khane se pehle kya padhte hain?", options: ["Alhamdulillah", "Bismillah", "SubhanAllah", "Astaghfirullah"], correct: 1, fact: "Khane se pehle 'Bismillah' padhte hain." },
      { q: "Khane ke baad kya kehte hain?", options: ["Bismillah", "Alhamdulillah", "SubhanAllah", "Allahu Akbar"], correct: 1, fact: "Khane ke baad 'Alhamdulillah' kehte hain." },
      { q: "Ghar se nikalte waqt kya padhte hain?", options: ["Bismillahi tawakkaltu alallah", "Hasbunallahu wa ni'mal wakeel", "La hawla wa la quwwata", "SubhanAllahi wa bihamdihi"], correct: 0, fact: "Ghar se niklte waqt: 'Bismillahi tawakkaltu alallah'" },
      { q: "Sone se pehle kis surah ko padhna sunnat hai?", options: ["Al-Fatihah", "Al-Ikhlas, Al-Falaq, An-Nas", "Al-Baqarah", "Ya-Sin"], correct: 1, fact: "Sone se pehle Mu'awwidhatain (Al-Falaq + An-Nas) padhna sunnat hai." },
      { q: "'SubhanAllahi wa bihamdihi' 100 baar padhne ka sawab?", options: ["Gunah maaf", "Jannat mein ghar", "Dua qabool", "Sab kuch"], correct: 1, fact: "Rozana 100 baar padhne se Jannat mein ghar milega (Hadith)." },
      { q: "Dua qabool hone ka behtareen waqt?", options: ["Fajr ke baad", "Sajde mein", "Jumma ke din", "Sab"], correct: 3, fact: "Sajde mein, Fajr ke baad, Jumma ke din — sab behtareen waqt hain." },
      { q: "'Astaghfirullah' ka matlab?", options: ["Shukar hai Allah ka", "Allah se maafi maangna", "Allah ki taareef", "Allah pe bharosa"], correct: 1, fact: "Astaghfirullah = 'Main Allah se maafi maangta hoon'" },
      { q: "Takbeer-e-Tahreema kya hai?", options: ["Allahu Akbar", "SubhanAllah", "Alhamdulillah", "La ilaha illallah"], correct: 0, fact: "Namaz shuru karne ki takbeer = 'Allahu Akbar'" },
      { q: "'Hasbunallahu wa ni'mal wakeel' ka matlab?", options: ["Allah kaafi hai", "Allah behtareen wakeel hai", "Dono", "Koi nahi"], correct: 2, fact: "'Hasbunallahu wa ni'mal wakeel' = Allah kaafi hai aur woh behtareen wakeel hai." },
      { q: "Dua qabool hone ke baad kya karna chahiye?", options: ["Sirf haath uthana", "Durood Sharif padhna", "Aansu bahana", "Kuch nahi"], correct: 1, fact: "Dua shuru aur end mein Durood Sharif padhna behtar hai." },
    ]
  },
  {
    id: "seerah",
    name: "Seerah",
    arabic: "السيرة",
    emoji: "🌙",
    color: C.orange,
    description: "Nabi ﷺ ki zindagi aur waqiat",
    questions: [
      { q: "Hazrat Muhammad ﷺ ka paidaish ka din?", options: ["12 Rabi-ul-Awwal", "10 Muharram", "27 Rajab", "15 Shaban"], correct: 0, fact: "Hazrat Muhammad ﷺ 12 Rabi-ul-Awwal ko paida hue." },
      { q: "Hazrat Muhammad ﷺ ka kunya?", options: ["Abu Bakr", "Abu Talib", "Abul Qasim", "Abu Hurairah"], correct: 2, fact: "Hazrat Muhammad ﷺ ka kunya 'Abul Qasim' tha." },
      { q: "Pehli wahi kis ghaar mein aayi?", options: ["Ghaar-e-Hira", "Ghaar-e-Thaur", "Masjid-e-Nabwi", "Kaaba"], correct: 0, fact: "Pehli wahi Ghaar-e-Hira mein aayi — Hazrat Muhammad ﷺ 40 saal ke the." },
      { q: "Hijrat kis saal hui?", options: ["610 CE", "622 CE", "630 CE", "632 CE"], correct: 1, fact: "Hijrat 622 CE (1 Hijri) mein hui — Islamic calendar shuru hua." },
      { q: "Hazrat Muhammad ﷺ ki umar kya thi jab woh faut hue?", options: ["60", "61", "62", "63"], correct: 2, fact: "Hazrat Muhammad ﷺ 63 saal ki umar mein faut hue (11 Hijri)." },
      { q: "Fath-e-Makkah kis saal hua?", options: ["6 Hijri", "8 Hijri", "10 Hijri", "12 Hijri"], correct: 1, fact: "Fath-e-Makkah 8 Hijri (630 CE) mein hua." },
      { q: "Hazrat Muhammad ﷺ ki pehli biwi ka naam?", options: ["Hazrat Aisha RA", "Hazrat Khadijah RA", "Hazrat Hafsa RA", "Hazrat Sawdah RA"], correct: 1, fact: "Hazrat Khadijah RA pehli biwi thi — unhon ne sabse pehle Imaan qubool kiya." },
      { q: "Ghaar-e-Thaur mein kitne din chhupe rahe?", options: ["1 din", "2 din", "3 din", "5 din"], correct: 2, fact: "Hijrat ke waqt Ghaar-e-Thaur mein 3 din chhupe rahe." },
      { q: "Hazrat Muhammad ﷺ ka laqab 'Al-Ameen' ka matlab?", options: ["The Truthful", "The Trustworthy", "The Brave", "The Wise"], correct: 1, fact: "Al-Ameen = The Trustworthy (Amanatdar) — yeh laqab unhon ne bachpan se paaya." },
      { q: "Isra wa Mi'raj kis raat hua?", options: ["Shab-e-Barat", "Shab-e-Qadr", "Shab-e-Miraj", "Shab-e-Baraat"], correct: 2, fact: "Isra wa Mi'raj Shab-e-Miraj (27 Rajab) ko hua — Masjid-e-Aqsa se Arsh tak." },
    ]
  },
  {
    id: "general",
    name: "General",
    arabic: "عام",
    emoji: "🌍",
    color: C.teal,
    description: "Islamic general knowledge mix",
    questions: [
      { q: "Islam ka pehla masjid kaunsa tha?", options: ["Masjid-e-Nabwi", "Masjid-e-Quba", "Masjid-e-Aqsa", "Masjid-e-Haram"], correct: 1, fact: "Masjid-e-Quba Islam ka pehla masjid tha — Madina mein." },
      { q: "Kaaba kis ne banaya?", options: ["Hazrat Muhammad ﷺ", "Hazrat Ibrahim AS", "Hazrat Ismail AS", "Hazrat Ibrahim AS aur Hazrat Ismail AS"], correct: 3, fact: "Kaaba Hazrat Ibrahim AS aur Hazrat Ismail AS ne mil kar banaya." },
      { q: "Qibla pehle kis taraf tha?", options: ["Makka", "Madina", "Bait-ul-Maqdis (Jerusalem)", "Sham"], correct: 2, fact: "Pehle Qibla Bait-ul-Maqdis (Jerusalem) tha, phir Kaaba ki taraf badla gaya." },
      { q: "Jumma ki namaz kitne rakat hoti hai?", options: ["2", "4", "6", "8"], correct: 0, fact: "Jumma ki farz namaz sirf 2 rakat hoti hai (Khutba ke baad)." },
      { q: "Zakat kis par farz nahi?", options: ["Gold par", "Silver par", "Ghar par", "Business profit par"], correct: 2, fact: "Zakat ghar (residence) par farz nahi — sirf savings/investment par." },
      { q: "Islamic calendar ka pehla mahina?", options: ["Ramzan", "Muharram", "Rabi-ul-Awwal", "Dhul-Hijjah"], correct: 1, fact: "Islamic calendar ka pehla mahina Muharram hai." },
      { q: "Shab-e-Qadr kis mahine mein hai?", options: ["Shaban", "Ramzan", "Shawwal", "Dhul-Qadah"], correct: 1, fact: "Shab-e-Qadr Ramzan ke aakhri ashre ki taaq raaton mein hai." },
      { q: "Hajj ke dino mein kya pehna jata hai?", options: ["Normal kapde", "Ihram", "Kurta pajama", "Sherwani"], correct: 1, fact: "Hajj ke dino mein Ihram pehna jata hai — 2 safed kapde bina silai ke." },
      { q: "Tawaf kis cheez ke gird hota hai?", options: ["Masjid-e-Nabwi", "Kaaba", "Safa Marwa", "Mina"], correct: 1, fact: "Tawaf Kaaba (Baitullah) ke gird 7 chakkar lagane ko kehte hain." },
      { q: "Safa aur Marwa ke darmiyan kitne chakkar hain?", options: ["5", "6", "7", "8"], correct: 2, fact: "Safa aur Marwa ke darmiyan Sai' mein 7 chakkar hain." },
    ]
  },
];

// ─── Shuffle array ────────────────────────────────────────────────────
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Confetti Component ─────────────────────────────────────────────
function Confetti() {
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    duration: 1.5 + Math.random() * 1,
    color: [C.gold, C.green, C.blue, C.purple, C.pink, C.orange][Math.floor(Math.random() * 6)],
    size: 4 + Math.random() * 6,
  }));

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 100, overflow: "hidden" }}>
      {pieces.map(p => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: "-20px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animation: `confettiFall ${p.duration}s ease-out ${p.delay}s forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Progress Ring ────────────────────────────────────────────────────
function ProgressRing({ progress, size = 80, stroke = 6, color = C.gold }) {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "18px", fontWeight: "800", color,
      }}>
        {Math.round(progress)}%
      </div>
    </div>
  );
}

// ─── Streak Fire ─────────────────────────────────────────────────────
function StreakBadge({ streak }) {
  if (streak < 2) return null;
  const fireColor = streak >= 5 ? "#ff6b35" : streak >= 3 ? "#fbbf24" : "#fb923c";
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "4px",
      background: `${fireColor}22`, border: `1px solid ${fireColor}55`,
      borderRadius: "20px", padding: "3px 10px", fontSize: "12px", fontWeight: "700",
      color: fireColor, animation: "pulse 1s ease-in-out infinite",
    }}>
      🔥 {streak}x Streak!
    </div>
  );
}

// ─── Category Card ────────────────────────────────────────────────────
function CategoryCard({ cat, onClick, bestScore }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: C.card, borderRadius: "20px", padding: "24px",
        border: `1px solid ${bestScore === 100 ? cat.color : "#2a3a4a"}`,
        cursor: "pointer", position: "relative", overflow: "hidden",
        transition: "all 0.25s ease",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = cat.color; e.currentTarget.style.boxShadow = `0 8px 32px ${cat.color}22`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = bestScore === 100 ? cat.color : "#2a3a4a"; e.currentTarget.style.boxShadow = "none"; }}
    >
      {bestScore === 100 && (
        <div style={{ position: "absolute", top: "10px", right: "10px", fontSize: "20px" }}>🏆</div>
      )}
      <div style={{ fontSize: "40px", marginBottom: "12px" }}>{cat.emoji}</div>
      <div style={{ color: cat.color, fontSize: "18px", fontWeight: "700", marginBottom: "2px" }}>{cat.name}</div>
      <div style={{ color: C.dim, fontSize: "11px", fontFamily: "serif", direction: "rtl", marginBottom: "8px" }}>{cat.arabic}</div>
      <div style={{ color: C.dim, fontSize: "12px", lineHeight: "1.5" }}>{cat.description}</div>
      <div style={{ marginTop: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: C.dim, fontSize: "11px" }}>{cat.questions.length} Questions</span>
        {bestScore > 0 && (
          <span style={{ color: cat.color, fontSize: "12px", fontWeight: "700" }}>Best: {bestScore}%</span>
        )}
      </div>
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "3px",
        background: `linear-gradient(90deg, ${cat.color}, ${cat.color}66)`,
        opacity: 0.6, borderRadius: "0 0 20px 20px",
      }} />
    </div>
  );
}

// ─── Quiz Screen ──────────────────────────────────────────────────────
function QuizScreen({ category, onBack, onComplete }) {
  const [questions] = useState(() => shuffleArray(category.questions).slice(0, 7));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [timerActive, setTimerActive] = useState(true);

  // Timer
  useEffect(() => {
    if (!timerActive || showResult) return;
    if (timeLeft <= 0) {
      handleAnswer(-1); // timeout
      return;
    }
    const t = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, timerActive, showResult]);

  const handleAnswer = (idx) => {
    if (showResult) return;
    setTimerActive(false);
    setSelected(idx);
    setShowResult(true);

    const isCorrect = idx === questions[current].correct;
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak(prev => Math.max(prev, newStreak));
      // Bonus for streak
      const streakBonus = newStreak >= 3 ? 10 : newStreak >= 2 ? 5 : 0;
      setScore(prev => prev + 10 + streakBonus);
    } else {
      setStreak(0);
    }

    setAnswers(prev => [...prev, { question: questions[current].q, correct: isCorrect, selected: idx, fact: questions[current].fact }]);
  };

  const nextQuestion = () => {
    if (current + 1 >= questions.length) {
      onComplete(score, answers, bestStreak);
      return;
    }
    setCurrent(prev => prev + 1);
    setSelected(null);
    setShowResult(false);
    setTimeLeft(15);
    setTimerActive(true);
  };

  const q = questions[current];
  const progress = ((current) / questions.length) * 100;
  const isCorrect = selected === q.correct;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "system-ui, sans-serif", paddingBottom: "40px" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(180deg, #111820, #0a0f1a)",
        borderBottom: "1px solid rgba(201,168,76,0.1)", padding: "20px",
        position: "sticky", top: 0, zIndex: 10, backdropFilter: "blur(20px)",
      }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button
            onClick={onBack}
            style={{ background: "transparent", border: "1px solid #2a3a4a", color: C.dim, borderRadius: "10px", padding: "8px 14px", cursor: "pointer", fontSize: "13px" }}
          >
            ← Exit
          </button>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: category.color, fontSize: "13px", fontWeight: "700" }}>{category.name}</div>
            <div style={{ color: C.dim, fontSize: "11px" }}>Q {current + 1} / {questions.length}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <StreakBadge streak={streak} />
            <div style={{ color: C.gold, fontSize: "16px", fontWeight: "800" }}>⭐ {score}</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ maxWidth: "600px", margin: "12px auto 0", background: "rgba(255,255,255,0.05)", borderRadius: "6px", height: "6px", overflow: "hidden" }}>
          <div style={{
            background: `linear-gradient(90deg, ${category.color}, ${category.color}88)`,
            height: "100%", width: `${progress}%`, borderRadius: "6px", transition: "width 0.4s ease",
          }} />
        </div>
      </div>

      {/* Question Card */}
      <div style={{ maxWidth: "600px", margin: "24px auto", padding: "0 20px" }}>
        {/* Timer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
          <div style={{
            width: "48px", height: "48px", borderRadius: "50%",
            border: `2px solid ${timeLeft <= 5 ? C.red : timeLeft <= 8 ? C.orange : category.color}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px", fontWeight: "800",
            color: timeLeft <= 5 ? C.red : timeLeft <= 8 ? C.orange : category.color,
            animation: timeLeft <= 5 ? "pulse 0.5s ease-in-out infinite" : "none",
          }}>
            {timeLeft}
          </div>
        </div>

        <div style={{
          background: C.card, borderRadius: "20px", padding: "28px",
          border: `1px solid ${showResult ? (isCorrect ? "rgba(74,222,128,0.3)" : selected !== -1 ? "rgba(248,113,113,0.3)" : "rgba(248,113,113,0.3)") : "#2a3a4a"}`,
          marginBottom: "20px", animation: "fadeUp 0.4s ease",
        }}>
          <div style={{ color: C.dim, fontSize: "11px", letterSpacing: "2px", marginBottom: "12px", textTransform: "uppercase" }}>
            Question {current + 1}
          </div>
          <div style={{ fontSize: "18px", fontWeight: "600", lineHeight: "1.6", marginBottom: "4px" }}>
            {q.q}
          </div>
        </div>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {q.options.map((opt, i) => {
            let bg = C.card;
            let border = "#2a3a4a";
            let color = C.text;

            if (showResult) {
              if (i === q.correct) { bg = "rgba(74,222,128,0.1)"; border = "rgba(74,222,128,0.4)"; color = C.green; }
              else if (i === selected && i !== q.correct) { bg = "rgba(248,113,113,0.1)"; border = "rgba(248,113,113,0.4)"; color = C.red; }
              else { bg = "rgba(255,255,255,0.02)"; border = "#1f2d3a"; color = C.dim; }
            } else if (selected === i) {
              bg = `${category.color}18`; border = category.color; color = category.color;
            }

            return (
              <button
                key={i}
                onClick={() => !showResult && handleAnswer(i)}
                disabled={showResult}
                style={{
                  background: bg, border: `1.5px solid ${border}`, borderRadius: "14px",
                  padding: "16px 20px", textAlign: "left", cursor: showResult ? "default" : "pointer",
                  color, fontSize: "15px", fontWeight: "500", transition: "all 0.2s",
                  display: "flex", alignItems: "center", gap: "12px",
                }}
              >
                <span style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: showResult
                    ? (i === q.correct ? "rgba(74,222,128,0.2)" : i === selected ? "rgba(248,113,113,0.2)" : "rgba(255,255,255,0.05)")
                    : selected === i ? `${category.color}22` : "rgba(255,255,255,0.05)",
                  border: `1.5px solid ${showResult
                    ? (i === q.correct ? C.green : i === selected ? C.red : "#2a3a4a")
                    : selected === i ? category.color : "#2a3a4a"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", fontWeight: "700", flexShrink: 0,
                }}>
                  {showResult
                    ? (i === q.correct ? "✓" : i === selected ? "✗" : String.fromCharCode(65 + i))
                    : String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Fact / Explanation */}
        {showResult && (
          <div style={{
            marginTop: "16px", background: isCorrect ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)",
            border: `1px solid ${isCorrect ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}`,
            borderRadius: "14px", padding: "16px", animation: "fadeUp 0.3s ease",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "18px" }}>{isCorrect ? "✅" : "❌"}</span>
              <span style={{ color: isCorrect ? C.green : C.red, fontWeight: "700", fontSize: "14px" }}>
                {isCorrect ? "Sahi jawab!" : selected === -1 ? "Waqt khatam!" : "Galat jawab!"}
              </span>
            </div>
            <div style={{ color: C.dim, fontSize: "13px", lineHeight: "1.6" }}>
              💡 {q.fact}
            </div>
          </div>
        )}

        {/* Next Button */}
        {showResult && (
          <button
            onClick={nextQuestion}
            style={{
              marginTop: "16px", width: "100%", padding: "14px", borderRadius: "14px", border: "none",
              background: `linear-gradient(135deg, ${category.color}, ${category.color}bb)`,
              color: "#0a0f1a", fontSize: "16px", fontWeight: "800", cursor: "pointer",
              boxShadow: `0 4px 20px ${category.color}44`, animation: "fadeUp 0.3s ease",
              transition: "transform 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            {current + 1 >= questions.length ? "🎉 Results Dekhein" : "Agla Sawaal →"}
          </button>
        )}
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
      `}</style>
    </div>
  );
}

// ─── Results Screen ────────────────────────────────────────────────────
function ResultsScreen({ score, totalPossible, answers, bestStreak, category, onBack, onRetry }) {
  const percentage = Math.round((score / totalPossible) * 100);
  const correctCount = answers.filter(a => a.correct).length;
  const isPerfect = percentage === 100;
  const isGood = percentage >= 70;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "system-ui, sans-serif" }}>
      {isPerfect && <Confetti />}

      <div style={{
        background: "linear-gradient(180deg, #111820, #0a0f1a)",
        borderBottom: "1px solid rgba(201,168,76,0.1)", padding: "40px 20px",
        textAlign: "center",
      }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>
          {isPerfect ? "🏆" : isGood ? "🌟" : "💪"}
        </div>
        <h1 style={{ fontSize: "24px", fontWeight: "800", margin: "0 0 8px" }}>
          {isPerfect ? "MashaAllah! Perfect Score!" : isGood ? "Bahut Achha!" : "Practice Karein!"}
        </h1>
        <p style={{ color: C.dim, fontSize: "14px", margin: "0 0 20px" }}>
          {category.name} — Quiz Complete
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
          <ProgressRing progress={percentage} color={isPerfect ? C.gold : isGood ? C.green : C.orange} />
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", justifyContent: "center" }}>
            <div style={{ background: C.card, borderRadius: "12px", padding: "10px 16px", border: "1px solid #2a3a4a" }}>
              <div style={{ color: C.dim, fontSize: "11px" }}>Score</div>
              <div style={{ color: C.gold, fontSize: "18px", fontWeight: "800" }}>{score} / {totalPossible}</div>
            </div>
            <div style={{ background: C.card, borderRadius: "12px", padding: "10px 16px", border: "1px solid #2a3a4a" }}>
              <div style={{ color: C.dim, fontSize: "11px" }}>Correct</div>
              <div style={{ color: C.green, fontSize: "18px", fontWeight: "800" }}>{correctCount} / {answers.length}</div>
            </div>
            {bestStreak >= 2 && (
              <div style={{ background: C.card, borderRadius: "12px", padding: "10px 16px", border: "1px solid #2a3a4a" }}>
                <div style={{ color: C.dim, fontSize: "11px" }}>Best Streak</div>
                <div style={{ color: C.orange, fontSize: "18px", fontWeight: "800" }}>🔥 {bestStreak}x</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Answers */}
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "24px 20px 40px" }}>
        <div style={{ color: C.dim, fontSize: "12px", letterSpacing: "2px", marginBottom: "16px", textTransform: "uppercase", fontWeight: "600" }}>
          Review Answers
        </div>

        {answers.map((a, i) => (
          <div
            key={i}
            style={{
              background: C.card, borderRadius: "14px", padding: "16px", marginBottom: "10px",
              border: `1px solid ${a.correct ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)"}`,
              animation: `fadeUp 0.3s ease ${i * 0.05}s both`,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <span style={{ fontSize: "18px", flexShrink: 0, marginTop: "2px" }}>
                {a.correct ? "✅" : "❌"}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px", lineHeight: "1.5" }}>
                  {i + 1}. {a.question}
                </div>
                <div style={{ color: C.dim, fontSize: "12px", lineHeight: "1.6" }}>
                  💡 {a.fact}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
          <button
            onClick={onBack}
            style={{
              flex: 1, padding: "14px", borderRadius: "14px", border: "1px solid #2a3a4a",
              background: "transparent", color: C.dim, fontSize: "14px", fontWeight: "700",
              cursor: "pointer", transition: "all 0.2s",
            }}
          >
            ← Categories
          </button>
          <button
            onClick={onRetry}
            style={{
              flex: 1, padding: "14px", borderRadius: "14px", border: "none",
              background: `linear-gradient(135deg, ${category.color}, ${category.color}bb)`,
              color: "#0a0f1a", fontSize: "14px", fontWeight: "800", cursor: "pointer",
              boxShadow: `0 4px 20px ${category.color}44`, transition: "all 0.2s",
            }}
          >
            🔄 Dobara Khelein
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}

// ─── Leaderboard ──────────────────────────────────────────────────────
function Leaderboard({ scores, onBack }) {
  const sorted = [...scores].sort((a, b) => b.score - a.score).slice(0, 10);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "system-ui, sans-serif" }}>
      <div style={{
        background: "linear-gradient(180deg, #111820, #0a0f1a)",
        borderBottom: "1px solid rgba(201,168,76,0.1)", padding: "24px 20px",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{ maxWidth: "500px", margin: "0 auto", display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={onBack}
            style={{ background: "transparent", border: "1px solid #2a3a4a", color: C.dim, borderRadius: "10px", padding: "8px 14px", cursor: "pointer", fontSize: "13px" }}
          >
            ← Back
          </button>
          <div style={{ fontSize: "18px", fontWeight: "800" }}>🏆 Leaderboard</div>
        </div>
      </div>

      <div style={{ maxWidth: "500px", margin: "0 auto", padding: "24px 20px" }}>
        {sorted.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: C.dim }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📊</div>
            <p>Abhi tak koi quiz nahi kheli gayi!</p>
          </div>
        ) : (
          sorted.map((s, i) => (
            <div
              key={i}
              style={{
                background: C.card, borderRadius: "14px", padding: "14px 18px",
                marginBottom: "8px", display: "flex", alignItems: "center", gap: "12px",
                border: i === 0 ? `1px solid ${C.gold}55` : "1px solid #2a3a4a",
                animation: `fadeUp 0.3s ease ${i * 0.05}s both`,
              }}
            >
              <div style={{
                width: "32px", height: "32px", borderRadius: "50%",
                background: i === 0 ? `${C.gold}22` : i === 1 ? `${C.dim}22` : i === 2 ? `${C.orange}22` : "rgba(255,255,255,0.05)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px", fontWeight: "800",
                color: i === 0 ? C.gold : i === 1 ? C.dim : i === 2 ? C.orange : C.dim,
              }}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14px", fontWeight: "600" }}>{s.category}</div>
                <div style={{ color: C.dim, fontSize: "11px" }}>{s.date}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: C.gold, fontSize: "16px", fontWeight: "800" }}>{s.score} pts</div>
                <div style={{ color: C.dim, fontSize: "11px" }}>{s.percentage}%</div>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────
export default function IslamicQuiz() {
  const [screen, setScreen] = useState("home"); // home, quiz, results, leaderboard
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizStreak, setQuizStreak] = useState(0);
  const [scores, setScores] = useState(() => {
    try { return JSON.parse(localStorage.getItem("islamic_quiz_scores") || "[]"); } catch { return []; }
  });
  const [bestScores, setBestScores] = useState(() => {
    try { return JSON.parse(localStorage.getItem("islamic_quiz_best") || "{}"); } catch { return {}; }
  });

  const startQuiz = (cat) => {
    setSelectedCategory(cat);
    setScreen("quiz");
  };

  const completeQuiz = (score, answers, bestStreak) => {
    setQuizScore(score);
    setQuizAnswers(answers);
    setQuizStreak(bestStreak);

    const totalPossible = answers.length * 20; // max 20 per question with streak bonus
    const percentage = Math.round((score / totalPossible) * 100);

    const newScore = {
      category: selectedCategory.name,
      score,
      percentage,
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
    };

    const updatedScores = [...scores, newScore];
    setScores(updatedScores);
    localStorage.setItem("islamic_quiz_scores", JSON.stringify(updatedScores));

    // Update best score for category
    const currentBest = bestScores[selectedCategory.id] || 0;
    if (percentage > currentBest) {
      const updatedBest = { ...bestScores, [selectedCategory.id]: percentage };
      setBestScores(updatedBest);
      localStorage.setItem("islamic_quiz_best", JSON.stringify(updatedBest));
    }

    setScreen("results");
  };

  const retryQuiz = () => {
    setScreen("quiz");
  };

  const totalQuizzes = scores.length;
  const totalScore = scores.reduce((a, b) => a + b.score, 0);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "system-ui, sans-serif" }}>
      {screen === "home" && (
        <div>
          {/* Hero */}
          <div style={{
            background: "linear-gradient(135deg, #111827, #0a0f1a)",
            borderBottom: "1px solid rgba(201,168,76,0.1)", padding: "32px 20px 24px",
            textAlign: "center", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: "-50%", left: "-50%", width: "200%", height: "200%",
              background: "radial-gradient(circle at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 50%)",
              pointerEvents: "none",
            }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: "44px", marginBottom: "8px" }}>🧠</div>
              <h1 style={{
                fontSize: "26px", fontWeight: "800", margin: "0 0 6px",
                background: `linear-gradient(90deg, ${C.gold}, ${C.orange})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                Islamic Quiz
              </h1>
              <p style={{ color: C.dim, fontSize: "13px", margin: "0 0 16px" }}>
                Apni Islamic knowledge test karein! 🌟
              </p>

              {/* Stats */}
              <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
                <div style={{ background: C.card, borderRadius: "12px", padding: "10px 18px", border: "1px solid #2a3a4a" }}>
                  <div style={{ color: C.gold, fontSize: "18px", fontWeight: "800" }}>{totalQuizzes}</div>
                  <div style={{ color: C.dim, fontSize: "10px" }}>Quizzes</div>
                </div>
                <div style={{ background: C.card, borderRadius: "12px", padding: "10px 18px", border: "1px solid #2a3a4a" }}>
                  <div style={{ color: C.green, fontSize: "18px", fontWeight: "800" }}>{totalScore}</div>
                  <div style={{ color: C.dim, fontSize: "10px" }}>Total Score</div>
                </div>
                <div style={{ background: C.card, borderRadius: "12px", padding: "10px 18px", border: "1px solid #2a3a4a", cursor: "pointer" }}
                  onClick={() => setScreen("leaderboard")}
                >
                  <div style={{ color: C.blue, fontSize: "18px", fontWeight: "800" }}>🏆</div>
                  <div style={{ color: C.dim, fontSize: "10px" }}>Leaderboard</div>
                </div>
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div style={{ maxWidth: "640px", margin: "0 auto", padding: "24px 20px 40px" }}>
            <div style={{ color: C.dim, fontSize: "12px", letterSpacing: "2px", marginBottom: "16px", textTransform: "uppercase", fontWeight: "600" }}>
              Choose Category
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
              {QUIZ_CATEGORIES.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  cat={cat}
                  bestScore={bestScores[cat.id] || 0}
                  onClick={() => startQuiz(cat)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {screen === "quiz" && selectedCategory && (
        <QuizScreen
          category={selectedCategory}
          onBack={() => setScreen("home")}
          onComplete={completeQuiz}
        />
      )}

      {screen === "results" && selectedCategory && (
        <ResultsScreen
          score={quizScore}
          totalPossible={quizAnswers.length * 20}
          answers={quizAnswers}
          bestStreak={quizStreak}
          category={selectedCategory}
          onBack={() => setScreen("home")}
          onRetry={retryQuiz}
        />
      )}

      {screen === "leaderboard" && (
        <Leaderboard scores={scores} onBack={() => setScreen("home")} />
      )}
    </div>
  );
}