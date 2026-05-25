import { useState, useEffect, useRef } from "react";
import { FiSearch, FiMic, FiMicOff } from "react-icons/fi";
import { useFirebaseUser } from "../hooks/useFirebaseUser";

// ─── All 114 Surahs ───
const SURAHS = [
  { number: 1, name: "Al-Fatihah", arabic: "الفاتحة", meaning: "The Opening", ayahs: 7, juz: 1 },
  { number: 2, name: "Al-Baqarah", arabic: "البقرة", meaning: "The Cow", ayahs: 286, juz: 1 },
  { number: 3, name: "Aali Imran", arabic: "آل عمران", meaning: "Family of Imran", ayahs: 200, juz: 3 },
  { number: 4, name: "An-Nisa", arabic: "النساء", meaning: "The Women", ayahs: 176, juz: 4 },
  { number: 5, name: "Al-Maidah", arabic: "المائدة", meaning: "The Table", ayahs: 120, juz: 6 },
  { number: 6, name: "Al-Anam", arabic: "الأنعام", meaning: "The Cattle", ayahs: 165, juz: 7 },
  { number: 7, name: "Al-Araf", arabic: "الأعراف", meaning: "The Heights", ayahs: 206, juz: 8 },
  { number: 8, name: "Al-Anfal", arabic: "الأنفال", meaning: "The Spoils of War", ayahs: 75, juz: 9 },
  { number: 9, name: "At-Tawbah", arabic: "التوبة", meaning: "Repentance", ayahs: 129, juz: 10 },
  { number: 10, name: "Yunus", arabic: "يونس", meaning: "Jonah", ayahs: 109, juz: 11 },
  { number: 11, name: "Hud", arabic: "هود", meaning: "Hud", ayahs: 123, juz: 11 },
  { number: 12, name: "Yusuf", arabic: "يوسف", meaning: "Joseph", ayahs: 111, juz: 12 },
  { number: 13, name: "Ar-Ra'd", arabic: "الرعد", meaning: "The Thunder", ayahs: 43, juz: 13 },
  { number: 14, name: "Ibrahim", arabic: "إبراهيم", meaning: "Abraham", ayahs: 52, juz: 13 },
  { number: 15, name: "Al-Hijr", arabic: "الحجر", meaning: "The Rocky Tract", ayahs: 99, juz: 14 },
  { number: 16, name: "An-Nahl", arabic: "النحل", meaning: "The Bee", ayahs: 128, juz: 14 },
  { number: 17, name: "Al-Isra", arabic: "الإسراء", meaning: "The Night Journey", ayahs: 111, juz: 15 },
  { number: 18, name: "Al-Kahf", arabic: "الكهف", meaning: "The Cave", ayahs: 110, juz: 15 },
  { number: 19, name: "Maryam", arabic: "مريم", meaning: "Mary", ayahs: 98, juz: 16 },
  { number: 20, name: "Ta-Ha", arabic: "طه", meaning: "Ta-Ha", ayahs: 135, juz: 16 },
  { number: 21, name: "Al-Anbiya", arabic: "الأنبياء", meaning: "The Prophets", ayahs: 112, juz: 17 },
  { number: 22, name: "Al-Hajj", arabic: "الحج", meaning: "The Pilgrimage", ayahs: 78, juz: 17 },
  { number: 23, name: "Al-Muminun", arabic: "المؤمنون", meaning: "The Believers", ayahs: 118, juz: 18 },
  { number: 24, name: "An-Nur", arabic: "النور", meaning: "The Light", ayahs: 64, juz: 18 },
  { number: 25, name: "Al-Furqan", arabic: "الفرقان", meaning: "The Criterion", ayahs: 77, juz: 18 },
  { number: 26, name: "Ash-Shu'ara", arabic: "الشعراء", meaning: "The Poets", ayahs: 227, juz: 19 },
  { number: 27, name: "An-Naml", arabic: "النمل", meaning: "The Ant", ayahs: 93, juz: 19 },
  { number: 28, name: "Al-Qasas", arabic: "القصص", meaning: "The Stories", ayahs: 88, juz: 20 },
  { number: 29, name: "Al-Ankabut", arabic: "العنكبوت", meaning: "The Spider", ayahs: 69, juz: 20 },
  { number: 30, name: "Ar-Rum", arabic: "الروم", meaning: "The Romans", ayahs: 60, juz: 21 },
  { number: 31, name: "Luqman", arabic: "لقمان", meaning: "Luqman", ayahs: 34, juz: 21 },
  { number: 32, name: "As-Sajdah", arabic: "السجدة", meaning: "The Prostration", ayahs: 30, juz: 21 },
  { number: 33, name: "Al-Ahzab", arabic: "الأحزاب", meaning: "The Combined Forces", ayahs: 73, juz: 21 },
  { number: 34, name: "Saba", arabic: "سبأ", meaning: "Sheba", ayahs: 54, juz: 22 },
  { number: 35, name: "Fatir", arabic: "فاطر", meaning: "Originator", ayahs: 45, juz: 22 },
  { number: 36, name: "Ya-Sin", arabic: "يس", meaning: "Ya Sin", ayahs: 83, juz: 22 },
  { number: 37, name: "As-Saffat", arabic: "الصافات", meaning: "Those Ranged in Ranks", ayahs: 182, juz: 23 },
  { number: 38, name: "Sad", arabic: "ص", meaning: "Sad", ayahs: 88, juz: 23 },
  { number: 39, name: "Az-Zumar", arabic: "الزمر", meaning: "The Groups", ayahs: 75, juz: 23 },
  { number: 40, name: "Ghafir", arabic: "غافر", meaning: "The Forgiver", ayahs: 85, juz: 24 },
  { number: 41, name: "Fussilat", arabic: "فصلت", meaning: "Explained in Detail", ayahs: 54, juz: 24 },
  { number: 42, name: "Ash-Shuraa", arabic: "الشورى", meaning: "The Consultation", ayahs: 53, juz: 25 },
  { number: 43, name: "Az-Zukhruf", arabic: "الزخرف", meaning: "The Gold Adornments", ayahs: 89, juz: 25 },
  { number: 44, name: "Ad-Dukhan", arabic: "الدخان", meaning: "The Smoke", ayahs: 59, juz: 25 },
  { number: 45, name: "Al-Jathiyah", arabic: "الجاثية", meaning: "Crouching", ayahs: 37, juz: 25 },
  { number: 46, name: "Al-Ahqaf", arabic: "الأحقاف", meaning: "The Wind-Curved Sandhills", ayahs: 35, juz: 26 },
  { number: 47, name: "Muhammad", arabic: "محمد", meaning: "Muhammad", ayahs: 38, juz: 26 },
  { number: 48, name: "Al-Fath", arabic: "الفتح", meaning: "The Victory", ayahs: 29, juz: 26 },
  { number: 49, name: "Al-Hujurat", arabic: "الحجرات", meaning: "The Rooms", ayahs: 18, juz: 26 },
  { number: 50, name: "Qaf", arabic: "ق", meaning: "Qaf", ayahs: 45, juz: 26 },
  { number: 51, name: "Adh-Dhariyat", arabic: "الذاريات", meaning: "The Winnowing Winds", ayahs: 60, juz: 26 },
  { number: 52, name: "At-Tur", arabic: "الطور", meaning: "The Mount", ayahs: 49, juz: 27 },
  { number: 53, name: "An-Najm", arabic: "النجم", meaning: "The Star", ayahs: 62, juz: 27 },
  { number: 54, name: "Al-Qamar", arabic: "القمر", meaning: "The Moon", ayahs: 55, juz: 27 },
  { number: 55, name: "Ar-Rahman", arabic: "الرحمن", meaning: "The Beneficent", ayahs: 78, juz: 27 },
  { number: 56, name: "Al-Waqiah", arabic: "الواقعة", meaning: "The Inevitable", ayahs: 96, juz: 27 },
  { number: 57, name: "Al-Hadid", arabic: "الحديد", meaning: "The Iron", ayahs: 29, juz: 27 },
  { number: 58, name: "Al-Mujadila", arabic: "المجادلة", meaning: "The Pleading Woman", ayahs: 22, juz: 28 },
  { number: 59, name: "Al-Hashr", arabic: "الحشر", meaning: "The Exile", ayahs: 24, juz: 28 },
  { number: 60, name: "Al-Mumtahanah", arabic: "الممتحنة", meaning: "She That is to be Examined", ayahs: 13, juz: 28 },
  { number: 61, name: "As-Saf", arabic: "الصف", meaning: "The Ranks", ayahs: 14, juz: 28 },
  { number: 62, name: "Al-Jumuah", arabic: "الجمعة", meaning: "Friday", ayahs: 11, juz: 28 },
  { number: 63, name: "Al-Munafiqun", arabic: "المنافقون", meaning: "The Hypocrites", ayahs: 11, juz: 28 },
  { number: 64, name: "At-Taghabun", arabic: "التغابن", meaning: "The Mutual Disillusion", ayahs: 18, juz: 28 },
  { number: 65, name: "At-Talaq", arabic: "الطلاق", meaning: "The Divorce", ayahs: 12, juz: 28 },
  { number: 66, name: "At-Tahrim", arabic: "التحريم", meaning: "The Prohibition", ayahs: 12, juz: 28 },
  { number: 67, name: "Al-Mulk", arabic: "الملك", meaning: "The Sovereignty", ayahs: 30, juz: 29 },
  { number: 68, name: "Al-Qalam", arabic: "القلم", meaning: "The Pen", ayahs: 52, juz: 29 },
  { number: 69, name: "Al-Haqqah", arabic: "الحاقة", meaning: "The Reality", ayahs: 52, juz: 29 },
  { number: 70, name: "Al-Maarij", arabic: "المعارج", meaning: "The Ascending Stairways", ayahs: 44, juz: 29 },
  { number: 71, name: "Nuh", arabic: "نوح", meaning: "Noah", ayahs: 28, juz: 29 },
  { number: 72, name: "Al-Jinn", arabic: "الجن", meaning: "The Jinn", ayahs: 28, juz: 29 },
  { number: 73, name: "Al-Muzzammil", arabic: "المزمل", meaning: "The Enshrouded One", ayahs: 20, juz: 29 },
  { number: 74, name: "Al-Muddaththir", arabic: "المدثر", meaning: "The Cloaked One", ayahs: 56, juz: 29 },
  { number: 75, name: "Al-Qiyamah", arabic: "القيامة", meaning: "The Resurrection", ayahs: 40, juz: 29 },
  { number: 76, name: "Al-Insan", arabic: "الإنسان", meaning: "The Human", ayahs: 31, juz: 29 },
  { number: 77, name: "Al-Mursalat", arabic: "المرسلات", meaning: "The Emissaries", ayahs: 50, juz: 29 },
  { number: 78, name: "An-Naba", arabic: "النبأ", meaning: "The Tidings", ayahs: 40, juz: 30 },
  { number: 79, name: "An-Naziat", arabic: "النازعات", meaning: "Those Who Drag Forth", ayahs: 46, juz: 30 },
  { number: 80, name: "Abasa", arabic: "عبس", meaning: "He Frowned", ayahs: 42, juz: 30 },
  { number: 81, name: "At-Takwir", arabic: "التكوير", meaning: "The Overthrowing", ayahs: 29, juz: 30 },
  { number: 82, name: "Al-Infitar", arabic: "الانفطار", meaning: "The Cleaving", ayahs: 19, juz: 30 },
  { number: 83, name: "Al-Mutaffifin", arabic: "المطففين", meaning: "The Defrauding", ayahs: 36, juz: 30 },
  { number: 84, name: "Al-Inshiqaq", arabic: "الانشقاق", meaning: "The Sundering", ayahs: 25, juz: 30 },
  { number: 85, name: "Al-Buruj", arabic: "البروج", meaning: "The Mansions of the Stars", ayahs: 22, juz: 30 },
  { number: 86, name: "At-Tariq", arabic: "الطارق", meaning: "The Nightcomer", ayahs: 17, juz: 30 },
  { number: 87, name: "Al-Ala", arabic: "الأعلى", meaning: "The Most High", ayahs: 19, juz: 30 },
  { number: 88, name: "Al-Ghashiyah", arabic: "الغاشية", meaning: "The Overwhelming", ayahs: 26, juz: 30 },
  { number: 89, name: "Al-Fajr", arabic: "الفجر", meaning: "The Dawn", ayahs: 30, juz: 30 },
  { number: 90, name: "Al-Balad", arabic: "البلد", meaning: "The City", ayahs: 20, juz: 30 },
  { number: 91, name: "Ash-Shams", arabic: "الشمس", meaning: "The Sun", ayahs: 15, juz: 30 },
  { number: 92, name: "Al-Layl", arabic: "الليل", meaning: "The Night", ayahs: 21, juz: 30 },
  { number: 93, name: "Ad-Duha", arabic: "الضحى", meaning: "The Morning Hours", ayahs: 11, juz: 30 },
  { number: 94, name: "Ash-Sharh", arabic: "الشرح", meaning: "The Relief", ayahs: 8, juz: 30 },
  { number: 95, name: "At-Tin", arabic: "التين", meaning: "The Fig", ayahs: 8, juz: 30 },
  { number: 96, name: "Al-Alaq", arabic: "العلق", meaning: "The Clot", ayahs: 19, juz: 30 },
  { number: 97, name: "Al-Qadr", arabic: "القدر", meaning: "The Power", ayahs: 5, juz: 30 },
  { number: 98, name: "Al-Bayyinah", arabic: "البينة", meaning: "The Clear Proof", ayahs: 8, juz: 30 },
  { number: 99, name: "Az-Zalzalah", arabic: "الزلزلة", meaning: "The Earthquake", ayahs: 8, juz: 30 },
  { number: 100, name: "Al-Adiyat", arabic: "العاديات", meaning: "The Chargers", ayahs: 11, juz: 30 },
  { number: 101, name: "Al-Qariah", arabic: "القارعة", meaning: "The Calamity", ayahs: 11, juz: 30 },
  { number: 102, name: "At-Takathur", arabic: "التكاثر", meaning: "The Rivalry in World Increase", ayahs: 8, juz: 30 },
  { number: 103, name: "Al-Asr", arabic: "العصر", meaning: "The Declining Day", ayahs: 3, juz: 30 },
  { number: 104, name: "Al-Humazah", arabic: "الهمزة", meaning: "The Traducer", ayahs: 9, juz: 30 },
  { number: 105, name: "Al-Fil", arabic: "الفيل", meaning: "The Elephant", ayahs: 5, juz: 30 },
  { number: 106, name: "Quraysh", arabic: "قريش", meaning: "Quraysh", ayahs: 4, juz: 30 },
  { number: 107, name: "Al-Maun", arabic: "الماعون", meaning: "The Small Kindnesses", ayahs: 7, juz: 30 },
  { number: 108, name: "Al-Kawthar", arabic: "الكوثر", meaning: "The Abundance", ayahs: 3, juz: 30 },
  { number: 109, name: "Al-Kafirun", arabic: "الكافرون", meaning: "The Disbelievers", ayahs: 6, juz: 30 },
  { number: 110, name: "An-Nasr", arabic: "النصر", meaning: "The Divine Support", ayahs: 3, juz: 30 },
  { number: 111, name: "Al-Masad", arabic: "المسد", meaning: "The Palm Fibre", ayahs: 5, juz: 30 },
  { number: 112, name: "Al-Ikhlas", arabic: "الإخلاص", meaning: "Sincerity", ayahs: 4, juz: 30 },
  { number: 113, name: "Al-Falaq", arabic: "الفلق", meaning: "The Daybreak", ayahs: 5, juz: 30 },
  { number: 114, name: "An-Nas", arabic: "الناس", meaning: "Mankind", ayahs: 6, juz: 30 },
];

// ─── 30 Paras (Juz) ───
const PARAS = Array.from({ length: 30 }, (_, i) => ({
  number: i + 1,
  name: `Juz ${i + 1}`,
  arabic: `الجزء ${toArabicNumStr(i + 1)}`,
  surahs: SURAHS.filter(s => s.juz === i + 1),
}));

function toArabicNumStr(n) {
  return String(n).replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);
}

const RECITERS = [
  { id: "ar.alafasy", name: "Mishary Alafasy", arabic: "مشاري العفاسي" },
  { id: "ar.abdurrahmaansudais", name: "Sudais", arabic: "السديس" },
  { id: "ar.husary", name: "Husary", arabic: "الحصري" },
  { id: "ar.minshawi", name: "Minshawi", arabic: "المنشاوي" },
];

const TRANSLATIONS = [
  { id: "hi.hindi", name: "Hindi", lang: "hi-IN" },
  { id: "en.sahih", name: "English — Sahih International", lang: "en-US" },
  { id: "ur.jalandhry", name: "Urdu — Jalandhri", lang: "ur-PK" },
  { id: "ur.maududi", name: "Urdu — Maududi", lang: "ur-PK" },
];

// ─── TTS Helper — only for Hindi & English (Urdu voice skip) ───
const speakText = (text, lang = "hi-IN", rate = 0.85) => {
  if (!text || !window.speechSynthesis) return null;
  // Urdu ke liye TTS nahi chalayenge
  if (lang === "ur-PK") return null;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices() || [];

  let voice = null;
  if (lang === "hi-IN") {
    voice = voices.find(v =>
      v.lang.startsWith("hi") ||
      v.name.toLowerCase().includes("hindi") ||
      v.name.toLowerCase().includes("google हिन्दी")
    );
  } else if (lang === "en-US") {
    voice = voices.find(v => v.lang.startsWith("en"));
  }

  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = lang;
  }

  utterance.rate = rate;
  utterance.pitch = 1;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
  return utterance;
};

const stopSpeaking = () => {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
};

// ─── Resume Storage Helpers ───
const RESUME_KEY = "noor_quran_resume";
const saveResume = (surahNum, ayahNum) => {
  try {
    localStorage.setItem(RESUME_KEY, JSON.stringify({ surahNum, ayahNum, savedAt: Date.now() }));
  } catch (_) {}
};
const loadResume = () => {
  try {
    const raw = localStorage.getItem(RESUME_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
};

// ─── Main Component ───
export default function QuranReader() {
  const { userId, loading: userLoading, loadBookmarks, saveBookmarks } = useFirebaseUser();

  const [tab, setTab] = useState("surah"); // "surah" | "para"
  const [view, setView] = useState("list");
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [selectedReciter, setSelectedReciter] = useState(RECITERS[0]);
  const [selectedTranslation, setSelectedTranslation] = useState(TRANSLATIONS[0]); // Hindi default
  const [playingAyah, setPlayingAyah] = useState(null);
  const [playingMode, setPlayingMode] = useState(null);
  const [showTranslation, setShowTranslation] = useState(true);
  const [fontSize, setFontSize] = useState(28);
  const [bookmarks, setBookmarks] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [resumeInfo, setResumeInfo] = useState(null);
  const [showResumeBanner, setShowResumeBanner] = useState(false);
  const [highlightAyah, setHighlightAyah] = useState(null);
  const audioRef = useRef(null);
  const recognitionRef = useRef(null);
  const ayahRefs = useRef({});

  // Check for resume on mount
  useEffect(() => {
    const resume = loadResume();
    if (resume) {
      setResumeInfo(resume);
      setShowResumeBanner(true);
    }
  }, []);

  const filteredSurahs = SURAHS.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.arabic.includes(searchQuery) ||
    s.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(s.number).includes(searchQuery)
  );

  // ─── Bookmarks ───
  useEffect(() => {
    if (!userId) return;
    const fetchBookmarks = async () => {
      const saved = await loadBookmarks();
      setBookmarks(saved || []);
    };
    fetchBookmarks();
  }, [userId]);

  useEffect(() => {
    if (!userId || bookmarks.length === 0) return;
    saveBookmarks(bookmarks);
  }, [bookmarks, userId]);

  // ─── Voice Search ───
  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Aapka browser voice search support nahi karta"); return; }
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.onresult = (e) => { setSearchQuery(e.results[0][0].transcript); setIsListening(false); };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // ─── Load Surah ───
  const loadSurah = async (surah, translation = selectedTranslation, reciter = selectedReciter) => {
    setSelectedSurah(surah);
    setView("reader");
    setLoading(true);
    setAyahs([]);
    stopAllAudio();
    try {
      const res = await fetch(
        `https://api.alquran.cloud/v1/surah/${surah.number}/editions/quran-uthmani,${translation.id}`
      );
      const data = await res.json();
      if (data.code === 200) {
        const arabicAyahs = data.data[0].ayahs;
        const transAyahs = data.data[1].ayahs;
        const combined = arabicAyahs.map((a, i) => ({
          number: a.numberInSurah,
          arabic: a.text,
          translation: transAyahs[i]?.text || "",
          audioUrl: `https://cdn.islamic.network/quran/audio/128/${reciter.id}/${a.number}.mp3`,
        }));
        setAyahs(combined);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  // ─── Resume Reading ───
  const handleResume = () => {
    if (!resumeInfo) return;
    const surah = SURAHS.find(s => s.number === resumeInfo.surahNum);
    if (!surah) return;
    setShowResumeBanner(false);
    loadSurah(surah).then(() => {
      setHighlightAyah(resumeInfo.ayahNum);
      setTimeout(() => {
        const el = ayahRefs.current[resumeInfo.ayahNum];
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => setHighlightAyah(null), 3000);
      }, 800);
    });
  };

  // Track last read ayah
  const handleAyahVisible = (ayahNum) => {
    if (selectedSurah) saveResume(selectedSurah.number, ayahNum);
  };

  // ─── Audio Controls ───
  const stopAllAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current = null;
    }
    stopSpeaking();
    setPlayingAyah(null);
    setPlayingMode(null);
  };

  const playArabic = (ayah) => {
    stopAllAudio();
    const audio = new Audio(ayah.audioUrl);
    audioRef.current = audio;
    audio.play();
    setPlayingAyah(ayah.number);
    setPlayingMode("arabic");
    audio.onended = () => { setPlayingAyah(null); setPlayingMode(null); };
  };

  const playTranslation = (ayah) => {
    const tLang = selectedTranslation.lang;
    // Urdu ke liye TTS nahi
    if (tLang === "ur-PK") {
      alert("Urdu translation ki voice available nahi hai. Hindi ya English select karein.");
      return;
    }
    if (!window.speechSynthesis) { alert("Aapka browser TTS support nahi karta"); return; }
    stopAllAudio();
    setPlayingAyah(ayah.number);
    setPlayingMode("translation");
    const cleanText = ayah.translation.replace(/[﴾﴿]/g, "").replace(/\s+/g, " ").trim();
    speakText(cleanText, tLang, 0.85);
    const duration = Math.max(3000, cleanText.length * 80);
    setTimeout(() => { setPlayingAyah(null); setPlayingMode(null); }, duration);
  };

  const playBoth = (ayah) => {
    const tLang = selectedTranslation.lang;
    stopAllAudio();
    setPlayingAyah(ayah.number);
    setPlayingMode("both");
    const audio = new Audio(ayah.audioUrl);
    audioRef.current = audio;
    audio.play();
    audio.onended = () => {
      if (tLang === "ur-PK") {
        setPlayingAyah(null); setPlayingMode(null);
        return;
      }
      const cleanText = ayah.translation.replace(/[﴾﴿]/g, "").replace(/\s+/g, " ").trim();
      speakText(cleanText, tLang, 0.85);
      const duration = Math.max(3000, cleanText.length * 80);
      setTimeout(() => { setPlayingAyah(null); setPlayingMode(null); }, duration);
    };
  };

  const handlePlay = (ayah, mode = "both") => {
    if (playingAyah === ayah.number && playingMode === mode) { stopAllAudio(); return; }
    if (mode === "arabic") playArabic(ayah);
    else if (mode === "translation") playTranslation(ayah);
    else playBoth(ayah);
  };

  const playAllSurah = () => {
    if (playingMode === "surah") { stopAllAudio(); return; }
    stopAllAudio();
    if (ayahs.length === 0) return;
    let index = 0;
    const playNext = () => {
      if (index >= ayahs.length) { setPlayingAyah(null); setPlayingMode(null); return; }
      const ayah = ayahs[index];
      setPlayingAyah(ayah.number); setPlayingMode("surah");
      const audio = new Audio(ayah.audioUrl);
      audioRef.current = audio;
      audio.onended = () => { index++; playNext(); };
      audio.onerror = () => { index++; playNext(); };
      audio.play().catch(() => { index++; playNext(); });
    };
    playNext();
  };

  const playAllWithTranslation = () => {
    const tLang = selectedTranslation.lang;
    if (playingMode === "surahBoth") { stopAllAudio(); return; }
    stopAllAudio();
    if (ayahs.length === 0) return;
    let index = 0;
    const playNext = () => {
      if (index >= ayahs.length) { setPlayingAyah(null); setPlayingMode(null); return; }
      const ayah = ayahs[index];
      setPlayingAyah(ayah.number); setPlayingMode("surahBoth");
      const audio = new Audio(ayah.audioUrl);
      audioRef.current = audio;
      audio.onended = () => {
        if (tLang === "ur-PK") { index++; playNext(); return; }
        const cleanText = ayah.translation.replace(/[﴾﴿]/g, "").replace(/\s+/g, " ").trim();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        const voices = window.speechSynthesis.getVoices() || [];
        let voice = null;
        if (tLang === "hi-IN") voice = voices.find(v => v.lang.startsWith("hi") || v.name.toLowerCase().includes("hindi"));
        else if (tLang === "en-US") voice = voices.find(v => v.lang.startsWith("en"));
        if (voice) { utterance.voice = voice; utterance.lang = voice.lang; } else { utterance.lang = tLang; }
        utterance.rate = 0.85; utterance.pitch = 1; utterance.volume = 1;
        utterance.onend = () => { index++; playNext(); };
        utterance.onerror = () => { index++; playNext(); };
        window.speechSynthesis.speak(utterance);
      };
      audio.onerror = () => { index++; playNext(); };
      audio.play().catch(() => { index++; playNext(); });
    };
    playNext();
  };

  // ─── Bookmarks ───
  const toggleBookmark = (ayahNumber) => {
    const key = `${selectedSurah.number}:${ayahNumber}`;
    setBookmarks(prev => prev.includes(key) ? prev.filter(b => b !== key) : [...prev, key]);
  };
  const isBookmarked = (ayahNumber) => bookmarks.includes(`${selectedSurah?.number}:${ayahNumber}`);

  // ══════════════════════════════════════════
  // ─── LIST VIEW ───
  // ══════════════════════════════════════════
  if (view === "list") {
    return (
      <div style={{ minHeight: "100vh", background: "#0c1118", color: "#e2d9c8", fontFamily: "'Georgia', serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Amiri:ital@0;1&display=swap');
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-track { background: #0c1118; }
          ::-webkit-scrollbar-thumb { background: #2a3040; border-radius: 4px; }
          .row-item:hover { background: rgba(201,168,76,0.07) !important; border-color: rgba(201,168,76,0.3) !important; }
          .row-item { transition: all 0.2s ease; }
          @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
          .fade-in { animation: fadeIn 0.4s ease forwards; }
          @keyframes micPulse { 0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,0.4);}50%{box-shadow:0 0 0 6px rgba(201,168,76,0);} }
          .mic-listening { animation: micPulse 1s ease-in-out infinite; }
          .search-input:focus { border-color: rgba(201,168,76,0.45) !important; }
          .tab-btn { transition: all 0.2s; cursor: pointer; }
          @keyframes slideIn { from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);} }
          .resume-banner { animation: slideIn 0.4s ease forwards; }
        `}</style>

        {/* ─── HEADER ─── */}
        <div style={{
          background: "linear-gradient(180deg,#111820 0%,#0c1118 100%)",
          borderBottom: "1px solid rgba(201,168,76,0.15)",
          padding: "28px 20px 20px",
          textAlign: "center",
          position: "sticky", top: 0, zIndex: 10,
          backdropFilter: "blur(20px)",
        }}>
          <div style={{ maxWidth: "640px", margin: "0 auto" }}>
            <div style={{ fontSize: "13px", color: "#C9A84C", letterSpacing: "4px", marginBottom: "4px", opacity: 0.8 }}>القرآن الكريم</div>
            <h1 style={{ fontSize: "24px", fontWeight: "400", margin: "0 0 16px", letterSpacing: "1px" }}>Al-Quran Al-Kareem</h1>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "14px", justifyContent: "center" }}>
              {[["surah", "📖 Surah"], ["para", "📚 Para (Juz)"]].map(([key, label]) => (
                <button key={key} className="tab-btn" onClick={() => setTab(key)} style={{
                  background: tab === key ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${tab === key ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.07)"}`,
                  color: tab === key ? "#C9A84C" : "#5a5040",
                  padding: "7px 18px", borderRadius: "20px", fontSize: "13px",
                }}>
                  {label}
                </button>
              ))}
            </div>

            {/* Search — only on Surah tab */}
            {tab === "surah" && (
              <div style={{ position: "relative" }}>
                <input
                  className="search-input"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Surah dhundein... (naam, number, meaning)"
                  style={{
                    width: "100%", boxSizing: "border-box",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(201,168,76,0.2)",
                    borderRadius: "12px", padding: "11px 48px 11px 42px",
                    color: "#e2d9c8", fontSize: "14px", outline: "none", transition: "border-color 0.2s",
                  }}
                />
                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", pointerEvents: "none", opacity: searchQuery ? 0.8 : 0.4 }}>
                  <FiSearch size={16} color="#C9A84C" />
                </span>
                <button onClick={startVoiceSearch} className={isListening ? "mic-listening" : ""} style={{
                  position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                  background: isListening ? "rgba(201,168,76,0.15)" : "none",
                  border: isListening ? "1px solid rgba(201,168,76,0.4)" : "1px solid transparent",
                  borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  width: "30px", height: "30px",
                  color: isListening ? "#C9A84C" : "#5a5040", transition: "all 0.2s",
                }}>
                  {isListening ? <FiMicOff size={15} /> : <FiMic size={15} />}
                </button>
              </div>
            )}
            {isListening && (
              <div style={{ marginTop: "8px", fontSize: "12px", color: "#C9A84C", opacity: 0.8, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "#C9A84C", animation: "micPulse 0.8s infinite" }} />
                Bol rahe hain...
              </div>
            )}
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ display: "flex", justifyContent: "center", gap: "24px", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "11px", color: "#5a5040" }}>
          <span>114 Surahs</span>
          <span style={{ color: "#C9A84C", opacity: 0.4 }}>•</span>
          <span>30 Paras</span>
          <span style={{ color: "#C9A84C", opacity: 0.4 }}>•</span>
          <span>6,236 Ayaat</span>
          {bookmarks.length > 0 && <>
            <span style={{ color: "#C9A84C", opacity: 0.4 }}>•</span>
            <span style={{ color: "#C9A84C" }}>🔖 {bookmarks.length}</span>
          </>}
        </div>

        {/* Resume Banner */}
        {showResumeBanner && resumeInfo && (
          <div className="resume-banner" style={{
            maxWidth: "640px", margin: "12px auto 0", padding: "0 16px",
          }}>
            <div style={{
              background: "rgba(201,168,76,0.08)",
              border: "1px solid rgba(201,168,76,0.25)",
              borderRadius: "12px", padding: "12px 16px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: "12px",
            }}>
              <div style={{ fontSize: "13px", color: "#C9A84C" }}>
                📌 Wahan se shuru karein jahan chorha tha?
                <span style={{ color: "#9a8870", marginLeft: "6px", fontSize: "12px" }}>
                  Surah {SURAHS.find(s => s.number === resumeInfo.surahNum)?.name} — Ayah {resumeInfo.ayahNum}
                </span>
              </div>
              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                <button onClick={handleResume} style={{
                  background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.4)",
                  color: "#C9A84C", padding: "5px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "12px",
                }}>Resume</button>
                <button onClick={() => setShowResumeBanner(false)} style={{
                  background: "none", border: "none", color: "#5a5040", cursor: "pointer", fontSize: "16px", padding: "4px",
                }}>×</button>
              </div>
            </div>
          </div>
        )}

        {/* ─── SURAH LIST ─── */}
        {tab === "surah" && (
          <div style={{ maxWidth: "640px", margin: "0 auto", padding: "14px 16px 60px" }}>
            {filteredSurahs.map((surah, i) => (
              <div key={surah.number} className="row-item fade-in" onClick={() => loadSurah(surah)} style={{
                display: "flex", alignItems: "center",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "14px", padding: "12px 14px", marginBottom: "7px",
                cursor: "pointer", animationDelay: `${i * 0.025}s`, opacity: 0,
              }}>
                <div style={{
                  width: "38px", height: "38px", flexShrink: 0,
                  background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.2)",
                  borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", color: "#C9A84C", fontFamily: "monospace", marginRight: "12px",
                }}>
                  {surah.number}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", marginBottom: "2px" }}>{surah.name}</div>
                  <div style={{ fontSize: "11px", color: "#5a5040" }}>{surah.meaning} • {surah.ayahs} ayaat • Juz {surah.juz}</div>
                </div>
                <div style={{ fontFamily: "'Amiri','Traditional Arabic',serif", fontSize: "20px", color: "#C9A84C", opacity: 0.8, textAlign: "right" }}>
                  {surah.arabic}
                </div>
              </div>
            ))}
            {filteredSurahs.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#3a3028" }}>
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔍</div>
                <p>Koi surah nahi mili</p>
              </div>
            )}
          </div>
        )}

        {/* ─── PARA LIST ─── */}
        {tab === "para" && (
          <div style={{ maxWidth: "640px", margin: "0 auto", padding: "14px 16px 60px" }}>
            {PARAS.map((para, i) => (
              <div key={para.number} className="row-item fade-in" style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "14px", marginBottom: "7px", overflow: "hidden",
                animationDelay: `${i * 0.025}s`, opacity: 0,
              }}>
                {/* Para Header */}
                <div style={{ display: "flex", alignItems: "center", padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{
                    width: "38px", height: "38px", flexShrink: 0,
                    background: "rgba(142,68,173,0.1)", border: "1px solid rgba(142,68,173,0.3)",
                    borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "12px", color: "#8E44AD", fontFamily: "monospace", marginRight: "12px",
                  }}>
                    {para.number}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", color: "#e2d9c8" }}>Juz {para.number}</div>
                    <div style={{ fontSize: "11px", color: "#5a5040" }}>{para.surahs.length} surahs</div>
                  </div>
                  <div style={{ fontFamily: "'Amiri',serif", fontSize: "18px", color: "#8E44AD", opacity: 0.7 }}>
                    {para.arabic}
                  </div>
                </div>
                {/* Surahs inside para */}
                <div style={{ padding: "8px 14px 10px" }}>
                  {para.surahs.map((surah) => (
                    <div key={surah.number} onClick={() => loadSurah(surah)} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "7px 8px", borderRadius: "8px", cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(201,168,76,0.06)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "11px", color: "#5a5040", minWidth: "20px" }}>{surah.number}</span>
                        <span style={{ fontSize: "13px", color: "#c8bca8" }}>{surah.name}</span>
                        <span style={{ fontSize: "11px", color: "#3a3028" }}>{surah.ayahs}v</span>
                      </div>
                      <span style={{ fontFamily: "'Amiri',serif", fontSize: "16px", color: "#C9A84C", opacity: 0.6 }}>{surah.arabic}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ══════════════════════════════════════════
  // ─── READER VIEW ───
  // ══════════════════════════════════════════
  return (
    <div style={{ minHeight: "100vh", background: "#0c1118", color: "#e2d9c8", fontFamily: "'Georgia', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:ital@0;1&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0c1118; }
        ::-webkit-scrollbar-thumb { background: #2a3040; border-radius: 4px; }
        .ayah-card:hover .ayah-actions { opacity: 1 !important; }
        .ayah-card { transition: background 0.2s; }
        .ayah-card:hover { background: rgba(201,168,76,0.04) !important; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .ayah-card { animation: fadeUp 0.4s ease forwards; opacity: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .play-btn { transition: all 0.2s; }
        .play-btn:hover { transform: scale(1.06); }
        .hdr-btn { transition: all 0.2s; cursor: pointer; }
        .hdr-btn:hover { opacity: 0.85; }
        @keyframes highlightPulse {
          0%,100% { background: rgba(201,168,76,0.04); }
          50% { background: rgba(201,168,76,0.18); }
        }
        .ayah-highlight { animation: highlightPulse 1s ease 3; }
      `}</style>

      {/* ─── STICKY HEADER ─── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "rgba(12,17,24,0.97)",
        borderBottom: "1px solid rgba(201,168,76,0.12)",
        backdropFilter: "blur(20px)", padding: "0 12px",
      }}>
        <div style={{
          maxWidth: "680px", margin: "0 auto",
          display: "flex", alignItems: "center",
          height: "54px", gap: "6px",
        }}>
          <button className="hdr-btn" onClick={() => { setView("list"); stopAllAudio(); }} style={{
            background: "none", border: "none", color: "#C9A84C", fontSize: "20px", padding: "4px 8px", borderRadius: "8px", flexShrink: 0,
          }}>←</button>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "14px", fontWeight: "500", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{selectedSurah?.name}</div>
            <div style={{ fontSize: "10px", color: "#5a5040" }}>{selectedSurah?.ayahs} ayaat • Juz {selectedSurah?.juz}</div>
          </div>

          <div style={{ fontFamily: "'Amiri',serif", fontSize: "18px", color: "#C9A84C", opacity: 0.7, flexShrink: 0 }}>
            {selectedSurah?.arabic}
          </div>

          <button className="hdr-btn" onClick={playAllSurah} title="Puri Surah Arabic" style={{
            background: playingMode === "surah" ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.05)",
            border: `1px solid ${playingMode === "surah" ? "#C9A84C" : "rgba(201,168,76,0.3)"}`,
            color: "#C9A84C", fontSize: "11px", padding: "5px 9px", borderRadius: "8px", flexShrink: 0,
            display: "flex", alignItems: "center", gap: "4px",
          }}>
            {playingMode === "surah" ? "⏸" : "▶"} عربي
          </button>

          <button className="hdr-btn" onClick={playAllWithTranslation} title="Arabic + Tarjuma" style={{
            background: playingMode === "surahBoth" ? "rgba(142,68,173,0.2)" : "rgba(255,255,255,0.05)",
            border: `1px solid ${playingMode === "surahBoth" ? "#8E44AD" : "rgba(142,68,173,0.4)"}`,
            color: "#8E44AD", fontSize: "11px", padding: "5px 9px", borderRadius: "8px", flexShrink: 0,
            display: "flex", alignItems: "center", gap: "4px",
          }}>
            {playingMode === "surahBoth" ? "⏸" : "▶"} +ترجمہ
          </button>

          <button className="hdr-btn" onClick={() => setSettingsOpen(!settingsOpen)} style={{
            background: settingsOpen ? "rgba(201,168,76,0.15)" : "none",
            border: "1px solid rgba(201,168,76,0.2)", color: "#C9A84C",
            fontSize: "14px", padding: "5px 8px", borderRadius: "8px", flexShrink: 0,
          }}>⚙️</button>
        </div>

        {/* Settings Panel */}
        {settingsOpen && (
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "14px 16px", maxWidth: "680px", margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "12px" }}>
              <div>
                <div style={{ color: "#5a5040", marginBottom: "5px" }}>Qari</div>
                <select value={selectedReciter.id} onChange={e => {
                  const r = RECITERS.find(r => r.id === e.target.value);
                  setSelectedReciter(r); stopAllAudio();
                  if (selectedSurah) loadSurah(selectedSurah, selectedTranslation, r);
                }} style={{ width: "100%", background: "#111820", border: "1px solid rgba(201,168,76,0.2)", color: "#e2d9c8", padding: "7px", borderRadius: "8px", fontSize: "12px" }}>
                  {RECITERS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <div style={{ color: "#5a5040", marginBottom: "5px" }}>Translation</div>
                <select value={selectedTranslation.id} onChange={e => {
                  const t = TRANSLATIONS.find(t => t.id === e.target.value);
                  setSelectedTranslation(t);
                  if (selectedSurah) loadSurah(selectedSurah, t, selectedReciter);
                }} style={{ width: "100%", background: "#111820", border: "1px solid rgba(201,168,76,0.2)", color: "#e2d9c8", padding: "7px", borderRadius: "8px", fontSize: "12px" }}>
                  {TRANSLATIONS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <div style={{ color: "#5a5040", marginBottom: "5px" }}>Arabic Font: {fontSize}px</div>
                <input type="range" min="20" max="40" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} style={{ width: "100%", accentColor: "#C9A84C" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingTop: "16px" }}>
                <span style={{ color: "#5a5040" }}>Translation</span>
                <button onClick={() => setShowTranslation(!showTranslation)} style={{
                  background: showTranslation ? "#C9A84C" : "rgba(255,255,255,0.05)",
                  border: "none", borderRadius: "20px", width: "44px", height: "24px", cursor: "pointer", position: "relative", transition: "all 0.2s",
                }}>
                  <span style={{ position: "absolute", top: "3px", left: showTranslation ? "22px" : "3px", width: "18px", height: "18px", background: "white", borderRadius: "50%", transition: "left 0.2s" }} />
                </button>
              </div>
            </div>
            {selectedTranslation.lang === "ur-PK" && (
              <div style={{ marginTop: "10px", padding: "8px 12px", background: "rgba(255,150,0,0.07)", border: "1px solid rgba(255,150,0,0.2)", borderRadius: "8px", fontSize: "11px", color: "#C9A84C" }}>
                ℹ️ Urdu translation ki voice available nahi — sirf Arabic audio chalega.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bismillah */}
      {selectedSurah?.number !== 9 && (
        <div style={{
          textAlign: "center", padding: "28px 20px 6px",
          fontFamily: "'Amiri',serif", fontSize: "26px", color: "#C9A84C", opacity: 0.7, letterSpacing: "2px",
        }}>
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{
            width: "38px", height: "38px", margin: "0 auto 18px",
            border: "2px solid rgba(201,168,76,0.2)", borderTopColor: "#C9A84C",
            borderRadius: "50%", animation: "spin 0.8s linear infinite",
          }} />
          <p style={{ color: "#5a5040", fontSize: "13px" }}>Loading {selectedSurah?.name}...</p>
        </div>
      )}

      {/* Ayah List */}
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "12px 14px 80px" }}>
        {ayahs.map((ayah, i) => {
          const isPlaying = playingAyah === ayah.number;
          const isHL = highlightAyah === ayah.number;
          return (
            <div
              key={ayah.number}
              className={`ayah-card${isHL ? " ayah-highlight" : ""}`}
              ref={el => ayahRefs.current[ayah.number] = el}
              onMouseEnter={() => handleAyahVisible(ayah.number)}
              style={{
                background: isBookmarked(ayah.number) ? "rgba(201,168,76,0.04)" : "transparent",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                padding: "20px 6px",
                animationDelay: `${i * 0.04}s`,
                position: "relative",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <div style={{
                  width: "32px", height: "32px",
                  background: isPlaying ? "rgba(201,168,76,0.2)" : "rgba(201,168,76,0.07)",
                  border: `1px solid ${isPlaying ? "#C9A84C" : "rgba(201,168,76,0.15)"}`,
                  borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "11px", color: "#C9A84C", fontFamily: "monospace",
                }}>
                  {isPlaying ? "♪" : ayah.number}
                </div>

                <div className="ayah-actions" style={{ display: "flex", gap: "5px", opacity: 0.4, transition: "opacity 0.2s", alignItems: "center" }}>
                  <button onClick={() => handlePlay(ayah, "arabic")} className="play-btn" style={{
                    background: isPlaying && playingMode === "arabic" ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(201,168,76,0.2)", borderRadius: "7px", padding: "5px 9px",
                    color: "#C9A84C", cursor: "pointer", fontSize: "11px",
                  }} title="Arabic Qirat">
                    {isPlaying && playingMode === "arabic" ? "⏸" : "▶"} عربي
                  </button>

                  <button onClick={() => handlePlay(ayah, "translation")} className="play-btn" style={{
                    background: isPlaying && playingMode === "translation" ? "rgba(39,174,96,0.2)" : "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(39,174,96,0.25)", borderRadius: "7px", padding: "5px 9px",
                    color: "#27AE60", cursor: "pointer", fontSize: "11px",
                    opacity: selectedTranslation.lang === "ur-PK" ? 0.35 : 1,
                  }} title={selectedTranslation.lang === "ur-PK" ? "Urdu voice available nahi" : "Translation voice"}>
                    {isPlaying && playingMode === "translation" ? "⏸" : "▶"} ترجمہ
                  </button>

                  <button onClick={() => handlePlay(ayah, "both")} className="play-btn" style={{
                    background: isPlaying && playingMode === "both" ? "rgba(142,68,173,0.2)" : "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(142,68,173,0.25)", borderRadius: "7px", padding: "5px 9px",
                    color: "#8E44AD", cursor: "pointer", fontSize: "11px",
                  }} title="Arabic + Translation">
                    {isPlaying && playingMode === "both" ? "⏸" : "▶"} دونوں
                  </button>

                  <button onClick={() => toggleBookmark(ayah.number)} style={{
                    background: isBookmarked(ayah.number) ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(201,168,76,0.2)", borderRadius: "7px", padding: "5px 9px",
                    color: isBookmarked(ayah.number) ? "#C9A84C" : "#5a5040", cursor: "pointer", fontSize: "13px",
                  }} title="Bookmark">🔖</button>
                </div>
              </div>

              {/* Arabic text */}
              <div style={{
                fontFamily: "'Amiri','Traditional Arabic',serif",
                fontSize: `${fontSize}px`, lineHeight: "2.4",
                textAlign: "right", direction: "rtl",
                color: "#f0e8d5", marginBottom: showTranslation ? "14px" : "0", padding: "6px 0",
              }}>
                {ayah.arabic}
                <span style={{ display: "inline-block", marginRight: "8px", fontSize: "17px", color: "#C9A84C", opacity: 0.6, fontFamily: "serif" }}>
                  ﴿{toArabicNum(ayah.number)}﴾
                </span>
              </div>

              {/* Translation */}
              {showTranslation && (
                <div style={{
                  fontSize: "13px", color: "#9a8870", lineHeight: "1.9",
                  borderLeft: "2px solid rgba(201,168,76,0.12)", paddingLeft: "12px",
                }}>
                  {ayah.translation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function toArabicNum(n) {
  return String(n).replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);
}