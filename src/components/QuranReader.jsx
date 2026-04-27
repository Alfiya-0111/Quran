import { useState, useEffect, useRef } from "react";
import { useFirebaseUser } from "../hooks/useFirebaseUser";


// ─── Surah List ───
const SURAHS = [
  { number: 1, name: "Al-Fatihah", arabic: "الفاتحة", meaning: "The Opening", ayahs: 7 },
  { number: 2, name: "Al-Baqarah", arabic: "البقرة", meaning: "The Cow", ayahs: 286 },
  { number: 3, name: "Aali Imran", arabic: "آل عمران", meaning: "Family of Imran", ayahs: 200 },
  { number: 4, name: "An-Nisa", arabic: "النساء", meaning: "The Women", ayahs: 176 },
  { number: 5, name: "Al-Maidah", arabic: "المائدة", meaning: "The Table", ayahs: 120 },
  { number: 6, name: "Al-Anam", arabic: "الأنعام", meaning: "The Cattle", ayahs: 165 },
  { number: 7, name: "Al-Araf", arabic: "الأعراف", meaning: "The Heights", ayahs: 206 },
  { number: 8, name: "Al-Anfal", arabic: "الأنفال", meaning: "The Spoils", ayahs: 75 },
  { number: 9, name: "At-Tawbah", arabic: "التوبة", meaning: "Repentance", ayahs: 129 },
  { number: 10, name: "Yunus", arabic: "يونس", meaning: "Jonah", ayahs: 109 },
  { number: 11, name: "Hud", arabic: "هود", meaning: "Hud", ayahs: 123 },
  { number: 12, name: "Yusuf", arabic: "يوسف", meaning: "Joseph", ayahs: 111 },
  { number: 13, name: "Ar-Ra'd", arabic: "الرعد", meaning: "The Thunder", ayahs: 43 },
  { number: 14, name: "Ibrahim", arabic: "إبراهيم", meaning: "Abraham", ayahs: 52 },
  { number: 15, name: "Al-Hijr", arabic: "الحجر", meaning: "The Rocky Tract", ayahs: 99 },
  { number: 16, name: "An-Nahl", arabic: "النحل", meaning: "The Bee", ayahs: 128 },
  { number: 17, name: "Al-Isra", arabic: "الإسراء", meaning: "The Night Journey", ayahs: 111 },
  { number: 18, name: "Al-Kahf", arabic: "الكهف", meaning: "The Cave", ayahs: 110 },
  { number: 36, name: "Ya-Sin", arabic: "يس", meaning: "Ya Sin", ayahs: 83 },
  { number: 55, name: "Ar-Rahman", arabic: "الرحمن", meaning: "The Beneficent", ayahs: 78 },
  { number: 56, name: "Al-Waqiah", arabic: "الواقعة", meaning: "The Event", ayahs: 96 },
  { number: 67, name: "Al-Mulk", arabic: "الملك", meaning: "The Sovereignty", ayahs: 30 },
  { number: 112, name: "Al-Ikhlas", arabic: "الإخلاص", meaning: "Sincerity", ayahs: 4 },
  { number: 113, name: "Al-Falaq", arabic: "الفلق", meaning: "The Daybreak", ayahs: 5 },
  { number: 114, name: "An-Nas", arabic: "الناس", meaning: "Mankind", ayahs: 6 },
];

const RECITERS = [
  { id: "ar.alafasy", name: "Mishary Alafasy", arabic: "مشاري العفاسي" },
  { id: "ar.abdurrahmaansudais", name: "Sudais", arabic: "السديس" },
  { id: "ar.husary", name: "Husary", arabic: "الحصري" },
  { id: "ar.minshawi", name: "Minshawi", arabic: "المنشاوي" },
];

const TRANSLATIONS = [
  { id: "ur.jalandhry", name: "Urdu — Jalandhri", lang: "ur-PK" },
  { id: "ur.maududi", name: "Urdu — Maududi", lang: "ur-PK" },
  { id: "en.sahih", name: "English — Sahih International", lang: "en-US" },
  { id: "hi.hindi", name: "Hindi", lang: "hi-IN" },
];

// ─── Urdu to Roman Urdu Converter ───
const toRomanUrdu = (urduText) => {
  if (!urduText) return "";

  let roman = urduText
    .replace(/مد/g, "mudd")
    .replace(/عبد/g, "Abd")
    .replace(/اللہ/g, "Allaah")
    .replace(/اللّٰہ/g, "Allaah")
    .replace(/رحمن/g, "Rehman")
    .replace(/رحیم/g, "Raheem")
    .replace(/محمد/g, "Mohammad")
    .replace(/مصطفی/g, "Mustafa")
    .replace(/احمد/g, "Ahmad")
    .replace(/قرآن/g, "Qur'an")
    .replace(/اسلام/g, "Islaam")
    .replace(/مسلم/g, "Muslim")
    .replace(/ایمان/g, "Imaan")
    .replace(/نماز/g, "Namaaz")
    .replace(/روزہ/g, "Rozah")
    .replace(/حج/g, "Hajj")
    .replace(/زکوٰۃ/g, "Zakaat")
    .replace(/جنت/g, "Jannat")
    .replace(/جہنم/g, "Jahannum")
    .replace(/دعا/g, "Dua")
    .replace(/صبر/g, "Sabr")
    .replace(/شکر/g, "Shukr")
    .replace(/توبہ/g, "Taubah")
    .replace(/بخشش/g, "Bakhshish")
    .replace(/رحمت/g, "Rehmat")
    .replace(/برکت/g, "Barkat")
    .replace(/سلامتی/g, "Salaamati")
    .replace(/امن/g, "Aman")
    .replace(/عدل/g, "Adl")
    .replace(/انصاف/g, "Insaaf")
    .replace(/سچ/g, "Sach")
    .replace(/جھوٹ/g, "Jhooth")
    .replace(/نیکی/g, "Neki")
    .replace(/بدی/g, "Badi")
    .replace(/گناہ/g, "Gunaah")
    .replace(/ثواب/g, "Sawaab")
    .replace(/عذاب/g, "Azaab")
    .replace(/قیامت/g, "Qayaamat")
    .replace(/روز/g, "Roz")
    .replace(/حشر/g, "Hashr")
    .replace(/جزا/g, "Jaza")
    .replace(/سزا/g, "Saza")
    .replace(/نبی/g, "Nabi")
    .replace(/رسول/g, "Rasool")
    .replace(/کعبہ/g, "Ka'bah")
    .replace(/مسجد/g, "Masjid")
    .replace(/مکہ/g, "Makkah")
    .replace(/مدینہ/g, "Madinah")
    .replace(/الحمدللہ/g, "Alhamdulillaah")
    .replace(/ماشاءاللہ/g, "MashaAllaah")
    .replace(/انشاءاللہ/g, "InshaAllaah")
    .replace(/سبحان اللہ/g, "SubhanAllaah")
    .replace(/اللہ اکبر/g, "Allaahu Akbar")
    .replace(/استغفراللہ/g, "Astaghfirullaah")
    .replace(/بسم اللہ/g, "Bismillaah")
    .replace(/جزاک اللہ/g, "JazaakAllaah")
    .replace(/بارک اللہ/g, "BaarakAllaah");

  const replacements = {
    "اللہ": "Allaah", "کے": "ke", "کی": "ki", "کا": "ka", "ہے": "hai",
    "ہیں": "hain", "اور": "aur", "سے": "se", "میں": "mein", "پر": "par",
    "نے": "ne", "کو": "ko", "بھی": "bhi", "نہیں": "nahin", "یہ": "yeh",
    "وہ": "woh", "جو": "jo", "کہ": "ke", "تک": "tak", "تھا": "tha",
    "تھی": "thi", "گیا": "gayaa", "گئی": "gayii", "کر": "kar", "کیا": "kiyaa",
    "کرنا": "karnaa", "کرنے": "karne", "کرتا": "kartaa", "کرتی": "karti",
    "جب": "jab", "تو": "to", "پھر": "phir", "کیونکہ": "kyunke", "اگر": "agar",
    "لیکن": "lekin", "یا": "yaa", "ہر": "har", "سب": "sab", "تمام": "tamaam",
    "بہت": "bohat", "زیادہ": "zyaadah", "کم": "kam", "اچھا": "achchhaa",
    "برا": "buraa", "نیا": "nayaa", "پہلا": "pehlaa", "آخری": "aakhiri",
    "تعریف": "taareef", "خدا": "Khudaa", "سزاوار": "sazaawaar",
    "مخلوقات": "makhluqaat", "پروردگار": "parvardigaar", "طرح": "tarah",
    "ہی": "hi", "بندہ": "bandah", "بندی": "bandi", "عبد": "Abd",
    "عام": "aam", "خاص": "khaas", "طرف": "taraf", "طاقت": "taaqat",
    "قدرت": "qudrat", "مقدر": "muqaddar", "تقدیر": "taqdeer",
    "نصیب": "naseeb", "قسمت": "qismat", "دولت": "daulat", "مال": "maal",
    "دنیا": "duniyaa", "آخرت": "aakhirat", "زندگی": "zindagii",
    "موت": "maut", "روح": "rooh", "جسم": "jism", "خون": "khoon",
    "پیار": "pyaar", "محبت": "mohabbat", "نفرت": "nafrat", "دوست": "dost",
    "دشمن": "dushman", "باپ": "baap", "ماں": "maa", "بیٹا": "betaa",
    "بیٹی": "betii", "بہن": "behan", "شوہر": "shohar", "بیوی": "biwii",
    "بچہ": "bachchah", "خاندان": "khaandaan", "گھر": "ghar",
    "دریا": "dariyaa", "سمندر": "samundar", "پہاڑ": "pahaad",
    "جنگل": "jungle", "چاند": "chaand", "سورج": "sooraj",
    "آسمان": "aasmaan", "زمین": "zamiin", "پانی": "paanii",
    "آگ": "aag", "ہوا": "hawaa", "کتاب": "kitaab", "علم": "ilm",
    "دل": "dil", "جان": "jaan", "نفس": "nafs", "قلب": "qalb",
    "حق": "haq", "باطل": "baatil", "امانت": "amaanat", "وفا": "wafaa",
    "خیال": "khayaal", "فکر": "fikr", "سوچ": "soch", "عقل": "aql",
    "حلال": "halaal", "حرام": "haraam", "فرض": "farz", "سنت": "sunnat",
    "پہلے": "pehle", "بعد": "baad", "اب": "ab", "کل": "kal",
    "آج": "aaj", "ابھی": "abhii", "ہمیشہ": "hameshah",
    "اکثر": "aksar", "بالکل": "bilkuul", "پورا": "puuraa",
    "نیا": "nayaa", "صاف": "saaf", "خوبصورت": "khoobsoorat",
    "وقت": "waqt", "دن": "din", "رات": "raat", "ہفتہ": "haftah",
    "مہینہ": "maheenah", "سال": "saal", "زمانہ": "zamaanah",
    "سلام": "salaam", "شادی": "shaadii", "نکاح": "nikaah",
    "اولاد": "aulaad", "نسل": "nasl", "قبیلہ": "qabiilah",
    "بزرگ": "buzurg", "رشتہ": "rishtah", "یار": "yaar",
    "رفیق": "rafiiq", "صدقہ": "sadqah", "خیر": "khair",
    "نعمت": "nemat", "فضل": "fazl", "کرم": "karam",
    "حمد": "hamd", "تسبیح": "tasbiih", "درود": "daruud",
    "معاہدہ": "moaahedah", "وعدہ": "waadah", "قسم": "qasm",
    "ظلم": "zulm", "انصاف": "insaaf", "عدالت": "adaalat",
    "قانون": "qaanoon", "حکومت": "hukumat", "ملک": "mulk",
    "شہر": "shehar", "گاؤں": "gaaun", "راستہ": "raastah",
    "مدد": "maddd", "تعاون": "taaawun", "شراکت": "shiraakat",
    "کامیابی": "kaamyaabii", "ناکامی": "naakaamii", "کوشش": "koshish",
    "محنت": "mehnat", "کام": "kaam", "نوکری": "naukrii",
    "صحت": "sehat", "بیماری": "bimaarii", "دوا": "dawaa",
    "خوف": "khauf", "ہمت": "himmat", "یقین": "yaqiin",
    "امید": "ummiid", "خوشی": "khushii", "غم": "gham",
    "درد": "dard", "صبر": "sabr", "شکر": "shukr", "رضا": "razaa",
    "توبہ": "taubah", "استغفار": "istighfaar", "ذکر": "zikr",
    "دین": "diin", "ملت": "millat", "عقیدہ": "aqiidah",
    "شریعت": "shariiat", "حکمت": "hikmat", "معرفت": "marifat",
    "نیت": "niyat", "احساس": "ehsaas", "جذبہ": "jazbah",
    "خواہش": "khwaaish", "ارادہ": "iraadah",
  };

  const sortedKeys = Object.keys(replacements).sort((a, b) => b.length - a.length);
  for (const urdu of sortedKeys) {
    const regex = new RegExp(urdu.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
    roman = roman.replace(regex, replacements[urdu]);
  }

  const charMap = {
    "ا": "aa", "آ": "aa", "ب": "b", "پ": "p", "ت": "t", "ٹ": "t", "ث": "s",
    "ج": "j", "چ": "ch", "ح": "h", "خ": "kh", "د": "d", "ڈ": "d", "ذ": "z",
    "ر": "r", "ڑ": "r", "ز": "z", "ژ": "zh", "س": "s", "ش": "sh", "ص": "s",
    "ض": "z", "ط": "t", "ظ": "z", "ع": "a", "غ": "gh", "ف": "f", "ق": "q",
    "ک": "k", "گ": "g", "ل": "l", "م": "m", "ن": "n", "ں": "n", "و": "o",
    "ہ": "h", "ھ": "h", "ی": "i", "ے": "e", "ء": "'", "ئ": "i", "ؤ": "o",
    "ۂ": "h", "ۓ": "e", "َ": "", "ِ": "", "ُ": "", "ّ": "", "ْ": "", "ٰ": "",
    "۔": ".", "،": ",", "؟": "?", "؛": ";",
  };

  let result = "";
  for (const char of roman) {
    result += charMap[char] || char;
  }

  return result.replace(/\s+/g, " ").trim();
};

// ─── TTS Helper ───
const speakText = (text, rate = 0.8) => {
  if (!text || !window.speechSynthesis) return null;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices() || [];
  const hindiVoice = voices.find(v =>
    v.lang.includes("hi") ||
    v.name.toLowerCase().includes("hindi") ||
    v.name.toLowerCase().includes("google हिन्दी")
  );
  if (hindiVoice) {
    utterance.voice = hindiVoice;
    utterance.lang = hindiVoice.lang;
  } else {
    utterance.lang = "hi-IN";
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

// ─── Main Component ───
export default function QuranReader() {
  const { userId, loading: userLoading, loadBookmarks, saveBookmarks } = useFirebaseUser();

  const [view, setView] = useState("list");
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReciter, setSelectedReciter] = useState(RECITERS[0]);
  const [selectedTranslation, setSelectedTranslation] = useState(TRANSLATIONS[0]);
  const [playingAyah, setPlayingAyah] = useState(null);
  const [playingMode, setPlayingMode] = useState(null);
  const [showTranslation, setShowTranslation] = useState(true);
  const [fontSize, setFontSize] = useState(28);
  const [bookmarks, setBookmarks] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const audioRef = useRef(null);

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
      setBookmarks(saved);
    };
    fetchBookmarks();
  }, [userId]);

  useEffect(() => {
    if (!userId || bookmarks.length === 0) return;
    saveBookmarks(bookmarks);
  }, [bookmarks, userId]);

  // ─── Load Surah — translation & reciter as params (stale state fix) ───
  const loadSurah = async (
    surah,
    translation = selectedTranslation,
    reciter = selectedReciter
  ) => {
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
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
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

  // ─── Single Ayah: Arabic only ───
  const playArabic = (ayah) => {
    stopAllAudio();
    const audio = new Audio(ayah.audioUrl);
    audioRef.current = audio;
    audio.play();
    setPlayingAyah(ayah.number);
    setPlayingMode("arabic");
    audio.onended = () => { setPlayingAyah(null); setPlayingMode(null); };
  };

  // ─── Single Ayah: Translation only ───
  const playTranslation = (ayah) => {
    if (!window.speechSynthesis) {
      alert("Aapka browser TTS support nahi karta");
      return;
    }
    stopAllAudio();
    setPlayingAyah(ayah.number);
    setPlayingMode("translation");
    const cleanText = ayah.translation.replace(/[﴾﴿]/g, "").replace(/\s+/g, " ").trim();
    const romanUrdu = toRomanUrdu(cleanText);
    speakText(romanUrdu, 0.8);
    const duration = Math.max(3000, romanUrdu.length * 90);
    setTimeout(() => { setPlayingAyah(null); setPlayingMode(null); }, duration);
  };

  // ─── Single Ayah: Arabic + Translation ───
  const playBoth = (ayah) => {
    stopAllAudio();
    setPlayingAyah(ayah.number);
    setPlayingMode("both");
    const audio = new Audio(ayah.audioUrl);
    audioRef.current = audio;
    audio.play();
    audio.onended = () => {
      const cleanText = ayah.translation.replace(/[﴾﴿]/g, "").replace(/\s+/g, " ").trim();
      const romanUrdu = toRomanUrdu(cleanText);
      speakText(romanUrdu, 0.8);
      const duration = Math.max(3000, romanUrdu.length * 90);
      setTimeout(() => { setPlayingAyah(null); setPlayingMode(null); }, duration);
    };
  };

  const handlePlay = (ayah, mode = "both") => {
    if (playingAyah === ayah.number && playingMode === mode) {
      stopAllAudio();
      return;
    }
    if (mode === "arabic") playArabic(ayah);
    else if (mode === "translation") playTranslation(ayah);
    else playBoth(ayah);
  };

  // ─── Full Surah: Arabic only (sequential) ───
  const playAllSurah = () => {
    if (playingMode === "surah") { stopAllAudio(); return; }
    stopAllAudio();
    if (ayahs.length === 0) return;

    let index = 0;
    let stopped = false;

    const playNext = () => {
      if (stopped || index >= ayahs.length) {
        if (!stopped) { setPlayingAyah(null); setPlayingMode(null); }
        return;
      }
      const ayah = ayahs[index];
      setPlayingAyah(ayah.number);
      setPlayingMode("surah");

      const audio = new Audio(ayah.audioUrl);
      audioRef.current = audio;

      audio.onended = () => { index++; playNext(); };
      audio.onerror = () => { index++; playNext(); };

      audio.play().catch(() => { index++; playNext(); });
    };

    // Override stopAllAudio to also set stopped flag
    const origStop = audioRef;
    playNext();
  };

  // ─── Full Surah: Arabic + Translation (sequential) ───
  const playAllWithTranslation = () => {
    if (playingMode === "surahBoth") { stopAllAudio(); return; }
    stopAllAudio();
    if (ayahs.length === 0) return;

    let index = 0;

    const playNext = () => {
      if (index >= ayahs.length) {
        setPlayingAyah(null);
        setPlayingMode(null);
        return;
      }

      const ayah = ayahs[index];
      setPlayingAyah(ayah.number);
      setPlayingMode("surahBoth");

      // Step 1: Arabic audio
      const audio = new Audio(ayah.audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        // Step 2: Translation TTS
        const cleanText = ayah.translation
          .replace(/[﴾﴿]/g, "")
          .replace(/\s+/g, " ")
          .trim();
        const romanUrdu = toRomanUrdu(cleanText);

        const utterance = new SpeechSynthesisUtterance(romanUrdu);
        const voices = window.speechSynthesis.getVoices() || [];
        const hindiVoice = voices.find(v =>
          v.lang.includes("hi") || v.name.toLowerCase().includes("hindi")
        );
        if (hindiVoice) {
          utterance.voice = hindiVoice;
          utterance.lang = hindiVoice.lang;
        } else {
          utterance.lang = "hi-IN";
        }
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;

        // Step 3: Next ayah after translation ends
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
    setBookmarks(prev =>
      prev.includes(key) ? prev.filter(b => b !== key) : [...prev, key]
    );
  };

  const isBookmarked = (ayahNumber) =>
    bookmarks.includes(`${selectedSurah?.number}:${ayahNumber}`);

  // ══════════════════════════════════════════
  // ─── SURAH LIST VIEW ───
  // ══════════════════════════════════════════
  if (view === "list") {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#0c1118",
        color: "#e2d9c8",
        fontFamily: "'Georgia', serif",
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Amiri:ital@0;1&display=swap');
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-track { background: #0c1118; }
          ::-webkit-scrollbar-thumb { background: #2a3040; border-radius: 4px; }
          .surah-row:hover { background: rgba(201,168,76,0.06) !important; border-color: rgba(201,168,76,0.3) !important; }
          .surah-row { transition: all 0.2s ease; }
          @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
          .fade-in { animation: fadeIn 0.4s ease forwards; }
        `}</style>

        <div style={{
          background: "linear-gradient(180deg, #111820 0%, #0c1118 100%)",
          borderBottom: "1px solid rgba(201,168,76,0.15)",
          padding: "32px 20px 24px",
          textAlign: "center",
          position: "sticky", top: 0, zIndex: 10,
          backdropFilter: "blur(20px)",
        }}>
          <div style={{ maxWidth: "640px", margin: "0 auto" }}>
            <div style={{ fontSize: "13px", color: "#C9A84C", letterSpacing: "4px", marginBottom: "6px", opacity: 0.8 }}>
              القرآن الكريم
            </div>
            <h1 style={{ fontSize: "26px", fontWeight: "400", margin: "0 0 20px", letterSpacing: "1px" }}>
              Al-Quran Al-Kareem
            </h1>
            <div style={{ position: "relative" }}>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Surah dhundein... (naam, number, meaning)"
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(201,168,76,0.2)",
                  borderRadius: "12px",
                  padding: "12px 16px 12px 42px",
                  color: "#e2d9c8", fontSize: "14px",
                  outline: "none",
                }}
              />
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", opacity: 0.5 }}>🔍</span>
            </div>
          </div>
        </div>

        <div style={{
          display: "flex", justifyContent: "center", gap: "32px",
          padding: "16px", borderBottom: "1px solid rgba(255,255,255,0.05)",
          fontSize: "12px", color: "#5a5040",
        }}>
          <span>114 Surahs</span>
          <span style={{ color: "#C9A84C", opacity: 0.4 }}>•</span>
          <span>6,236 Ayaat</span>
          <span style={{ color: "#C9A84C", opacity: 0.4 }}>•</span>
          <span>30 Paras</span>
          {bookmarks.length > 0 && <>
            <span style={{ color: "#C9A84C", opacity: 0.4 }}>•</span>
            <span style={{ color: "#C9A84C" }}>🔖 {bookmarks.length} Bookmarks</span>
          </>}
        </div>

        <div style={{ maxWidth: "640px", margin: "0 auto", padding: "16px 16px 60px" }}>
          {filteredSurahs.map((surah, i) => (
            <div
              key={surah.number}
              className="surah-row fade-in"
              onClick={() => loadSurah(surah)}
              style={{
                display: "flex", alignItems: "center",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "14px",
                padding: "14px 16px",
                marginBottom: "8px",
                cursor: "pointer",
                animationDelay: `${i * 0.03}s`,
                opacity: 0,
              }}
            >
              <div style={{
                width: "40px", height: "40px", flexShrink: 0,
                background: "rgba(201,168,76,0.08)",
                border: "1px solid rgba(201,168,76,0.2)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "13px", color: "#C9A84C", fontFamily: "monospace",
                marginRight: "14px",
              }}>
                {surah.number}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "15px", marginBottom: "2px" }}>{surah.name}</div>
                <div style={{ fontSize: "12px", color: "#5a5040" }}>{surah.meaning} • {surah.ayahs} ayaat</div>
              </div>
              <div style={{
                fontFamily: "'Amiri', 'Traditional Arabic', serif",
                fontSize: "22px", color: "#C9A84C", opacity: 0.8,
                textAlign: "right",
              }}>
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
      </div>
    );
  }

  // ══════════════════════════════════════════
  // ─── READER VIEW ───
  // ══════════════════════════════════════════
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0c1118",
      color: "#e2d9c8",
      fontFamily: "'Georgia', serif",
    }}>
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
        .play-btn:hover { transform: scale(1.1); }
        .play-btn.active { background: rgba(201,168,76,0.25) !important; border-color: #C9A84C !important; }
        .hdr-btn { transition: all 0.2s; cursor: pointer; }
        .hdr-btn:hover { opacity: 0.85; transform: scale(1.03); }
      `}</style>

      {/* ─── STICKY HEADER ─── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "rgba(12,17,24,0.97)",
        borderBottom: "1px solid rgba(201,168,76,0.12)",
        backdropFilter: "blur(20px)",
        padding: "0 16px",
      }}>
        {/* Top row */}
        <div style={{
          maxWidth: "680px", margin: "0 auto",
          display: "flex", alignItems: "center",
          height: "56px", gap: "8px",
        }}>
          {/* Back */}
          <button
            className="hdr-btn"
            onClick={() => { setView("list"); stopAllAudio(); }}
            style={{
              background: "none", border: "none", color: "#C9A84C",
              fontSize: "20px", padding: "4px 8px",
              borderRadius: "8px", flexShrink: 0,
            }}
          >
            ←
          </button>

          {/* Surah info */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "15px", fontWeight: "500" }}>{selectedSurah?.name}</div>
            <div style={{ fontSize: "11px", color: "#5a5040" }}>
              {selectedSurah?.ayahs} ayaat • {selectedSurah?.meaning}
            </div>
          </div>

          {/* Arabic title */}
          <div style={{
            fontFamily: "'Amiri', serif", fontSize: "20px",
            color: "#C9A84C", opacity: 0.7, flexShrink: 0,
          }}>
            {selectedSurah?.arabic}
          </div>

          {/* ── Play Surah (Arabic only) ── */}
          <button
            className="hdr-btn"
            onClick={playAllSurah}
            title="Puri Surah Arabic play karo"
            style={{
              background: playingMode === "surah"
                ? "rgba(201,168,76,0.2)"
                : "rgba(255,255,255,0.05)",
              border: `1px solid ${playingMode === "surah" ? "#C9A84C" : "rgba(201,168,76,0.3)"}`,
              color: "#C9A84C",
              fontSize: "12px",
              padding: "6px 10px",
              borderRadius: "8px",
              flexShrink: 0,
              display: "flex", alignItems: "center", gap: "4px",
            }}
          >
            {playingMode === "surah" ? "⏸" : "▶"} عربي
          </button>

          {/* ── Play Surah + Translation ── */}
          <button
            className="hdr-btn"
            onClick={playAllWithTranslation}
            title="Puri Surah Arabic + Tarjuma play karo"
            style={{
              background: playingMode === "surahBoth"
                ? "rgba(142,68,173,0.2)"
                : "rgba(255,255,255,0.05)",
              border: `1px solid ${playingMode === "surahBoth" ? "#8E44AD" : "rgba(142,68,173,0.4)"}`,
              color: "#8E44AD",
              fontSize: "12px",
              padding: "6px 10px",
              borderRadius: "8px",
              flexShrink: 0,
              display: "flex", alignItems: "center", gap: "4px",
            }}
          >
            {playingMode === "surahBoth" ? "⏸" : "▶"} + ترجمہ
          </button>

          {/* Settings */}
          <button
            className="hdr-btn"
            onClick={() => setSettingsOpen(!settingsOpen)}
            style={{
              background: settingsOpen ? "rgba(201,168,76,0.15)" : "none",
              border: "1px solid rgba(201,168,76,0.2)",
              color: "#C9A84C",
              fontSize: "14px", padding: "6px 10px",
              borderRadius: "8px", flexShrink: 0,
            }}
          >
            ⚙️
          </button>
        </div>

        {/* ─── SETTINGS PANEL ─── */}
        {settingsOpen && (
          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            padding: "16px",
            maxWidth: "680px", margin: "0 auto",
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "12px" }}>

              {/* Qari */}
              <div>
                <div style={{ color: "#5a5040", marginBottom: "6px" }}>Qari</div>
                <select
                  value={selectedReciter.id}
                  onChange={e => {
                    const newReciter = RECITERS.find(r => r.id === e.target.value);
                    setSelectedReciter(newReciter);
                    stopAllAudio();
                    if (selectedSurah) loadSurah(selectedSurah, selectedTranslation, newReciter);
                  }}
                  style={{
                    width: "100%", background: "#111820",
                    border: "1px solid rgba(201,168,76,0.2)",
                    color: "#e2d9c8", padding: "8px", borderRadius: "8px",
                    fontSize: "12px",
                  }}
                >
                  {RECITERS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>

              {/* Translation */}
              <div>
                <div style={{ color: "#5a5040", marginBottom: "6px" }}>Translation</div>
                <select
                  value={selectedTranslation.id}
                  onChange={e => {
                    const newTrans = TRANSLATIONS.find(t => t.id === e.target.value);
                    setSelectedTranslation(newTrans);
                    if (selectedSurah) loadSurah(selectedSurah, newTrans, selectedReciter);
                  }}
                  style={{
                    width: "100%", background: "#111820",
                    border: "1px solid rgba(201,168,76,0.2)",
                    color: "#e2d9c8", padding: "8px", borderRadius: "8px",
                    fontSize: "12px",
                  }}
                >
                  {TRANSLATIONS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>

              {/* Font size */}
              <div>
                <div style={{ color: "#5a5040", marginBottom: "6px" }}>Arabic Font: {fontSize}px</div>
                <input
                  type="range" min="20" max="40" value={fontSize}
                  onChange={e => setFontSize(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#C9A84C" }}
                />
              </div>

              {/* Translation toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingTop: "18px" }}>
                <span style={{ color: "#5a5040" }}>Translation</span>
                <button
                  onClick={() => setShowTranslation(!showTranslation)}
                  style={{
                    background: showTranslation ? "#C9A84C" : "rgba(255,255,255,0.05)",
                    border: "none", borderRadius: "20px",
                    width: "44px", height: "24px", cursor: "pointer",
                    position: "relative", transition: "all 0.2s",
                  }}
                >
                  <span style={{
                    position: "absolute", top: "3px",
                    left: showTranslation ? "22px" : "3px",
                    width: "18px", height: "18px",
                    background: "white", borderRadius: "50%",
                    transition: "left 0.2s",
                  }} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bismillah */}
      {selectedSurah?.number !== 9 && (
        <div style={{
          textAlign: "center", padding: "32px 20px 8px",
          fontFamily: "'Amiri', serif",
          fontSize: "28px", color: "#C9A84C", opacity: 0.7,
          letterSpacing: "2px",
        }}>
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{
            width: "40px", height: "40px", margin: "0 auto 20px",
            border: "2px solid rgba(201,168,76,0.2)",
            borderTopColor: "#C9A84C",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }} />
          <p style={{ color: "#5a5040", fontSize: "14px" }}>Loading {selectedSurah?.name}...</p>
        </div>
      )}

      {/* ─── AYAH LIST ─── */}
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "16px 16px 80px" }}>
        {ayahs.map((ayah, i) => {
          const isPlaying = playingAyah === ayah.number;
          return (
            <div
              key={ayah.number}
              className="ayah-card"
              style={{
                background: isBookmarked(ayah.number) ? "rgba(201,168,76,0.04)" : "transparent",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                padding: "24px 8px",
                animationDelay: `${i * 0.04}s`,
                position: "relative",
              }}
            >
              {/* Ayah header */}
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: "16px",
              }}>
                {/* Ayah number badge */}
                <div style={{
                  width: "34px", height: "34px",
                  background: isPlaying ? "rgba(201,168,76,0.2)" : "rgba(201,168,76,0.08)",
                  border: `1px solid ${isPlaying ? "#C9A84C" : "rgba(201,168,76,0.15)"}`,
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", color: "#C9A84C", fontFamily: "monospace",
                }}>
                  {isPlaying ? "♪" : ayah.number}
                </div>

                {/* Per-ayah action buttons */}
                <div className="ayah-actions" style={{
                  display: "flex", gap: "6px", opacity: 0.4,
                  transition: "opacity 0.2s", alignItems: "center",
                }}>
                  <button
                    onClick={() => handlePlay(ayah, "arabic")}
                    className={`play-btn ${isPlaying && playingMode === "arabic" ? "active" : ""}`}
                    style={{
                      background: isPlaying && playingMode === "arabic"
                        ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(201,168,76,0.2)",
                      borderRadius: "8px", padding: "6px 10px",
                      color: "#C9A84C", cursor: "pointer", fontSize: "12px",
                    }}
                    title="Arabic Qirat"
                  >
                    {isPlaying && playingMode === "arabic" ? "⏸" : "▶"} عربي
                  </button>

                  <button
                    onClick={() => handlePlay(ayah, "translation")}
                    className={`play-btn ${isPlaying && playingMode === "translation" ? "active" : ""}`}
                    style={{
                      background: isPlaying && playingMode === "translation"
                        ? "rgba(39,174,96,0.2)" : "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(39,174,96,0.3)",
                      borderRadius: "8px", padding: "6px 10px",
                      color: "#27AE60", cursor: "pointer", fontSize: "12px",
                    }}
                    title="Roman Urdu Translation"
                  >
                    {isPlaying && playingMode === "translation" ? "⏸" : "▶"} ترجمہ
                  </button>

                  <button
                    onClick={() => handlePlay(ayah, "both")}
                    className={`play-btn ${isPlaying && playingMode === "both" ? "active" : ""}`}
                    style={{
                      background: isPlaying && playingMode === "both"
                        ? "rgba(142,68,173,0.2)" : "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(142,68,173,0.3)",
                      borderRadius: "8px", padding: "6px 10px",
                      color: "#8E44AD", cursor: "pointer", fontSize: "12px",
                    }}
                    title="Arabic + Translation"
                  >
                    {isPlaying && playingMode === "both" ? "⏸" : "▶"} دونوں
                  </button>

                  <button
                    onClick={() => toggleBookmark(ayah.number)}
                    style={{
                      background: isBookmarked(ayah.number)
                        ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(201,168,76,0.2)",
                      borderRadius: "8px", padding: "6px 10px",
                      color: isBookmarked(ayah.number) ? "#C9A84C" : "#5a5040",
                      cursor: "pointer", fontSize: "14px",
                    }}
                    title="Bookmark"
                  >
                    🔖
                  </button>
                </div>
              </div>

              {/* Arabic text */}
              <div style={{
                fontFamily: "'Amiri', 'Traditional Arabic', serif",
                fontSize: `${fontSize}px`,
                lineHeight: "2.4",
                textAlign: "right",
                direction: "rtl",
                color: "#f0e8d5",
                marginBottom: showTranslation ? "16px" : "0",
                padding: "8px 0",
              }}>
                {ayah.arabic}
                <span style={{
                  display: "inline-block", marginRight: "8px",
                  fontSize: "18px", color: "#C9A84C", opacity: 0.6,
                  fontFamily: "serif",
                }}>
                  ﴿{toArabicNum(ayah.number)}﴾
                </span>
              </div>

              {/* Translation text */}
              {showTranslation && (
                <div style={{
                  fontSize: "13px", color: "#9a8870",
                  lineHeight: "1.9",
                  borderLeft: "2px solid rgba(201,168,76,0.15)",
                  paddingLeft: "12px",
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