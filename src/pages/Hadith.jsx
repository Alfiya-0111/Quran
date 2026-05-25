import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Helmet } from "react-helmet-async";

const COLORS = {
  bg: "#0c1118",
  surface: "#111827",
  card: "#1a2332",
  gold: "#C9A84C",
  goldLight: "#e8c97a",
  goldDim: "#8a6f30",
  goldFaint: "#C9A84C18",
  text: "#e8e0d0",
  textDim: "#8a9ab0",
  accentGreen: "#4ade80",
};

// ── Sahih Muslim Sample Hadiths (Offline/Static Data) ──
const HADITHS = [
  {
    id: 1,
    book: "Kitab al-Iman",
    bookUrdu: "کتاب الایمان",
    bookHindi: "ईमान की किताब",
    bookEnglish: "Book of Faith",
    number: 1,
    arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ فَهِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوْ امْرَأَةٍ يَتَزَوَّجُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ",
    urdu: "اعمال کا دار و مدار نیتوں پر ہے، اور ہر شخص کو وہی ملے گا جس کی اس نے نیت کی۔ پس جس کی ہجرت اللہ اور اس کے رسول کی طرف ہوئی تو اس کی ہجرت اللہ اور اس کے رسول کی طرف ہے، اور جس کی ہجرت کسی دنیاوی فائدے یا کسی عورت سے نکاح کرنے کے لیے ہوئی تو اس کی ہجرت اسی کی طرف ہے جس کے لیے اس نے ہجرت کی۔",
    hindi: "कर्म नियतों पर निर्भर करते हैं, और हर व्यक्ति को वही मिलेगा जिसकी उसने नियत की। तो जिसकी हिजरत अल्लाह और उसके रसूल की तरफ हुई तो उसकी हिजरत अल्लाह और उसके रसूल की तरफ है, और जिसकी हिजरत किसी दुनियावी फायदे या किसी औरत से निकाह करने के लिए हुई तो उसकी हिजरत उसी की तरफ है जिसके लिए उसने हिजरत की।",
    english: "Actions are but by intentions, and every person will have what he intended. So whoever's migration was to Allah and His Messenger, his migration is to Allah and His Messenger. And whoever's migration was for some worldly gain or a woman he wished to marry, his migration is to that which he migrated.",
    narrator: "Umar ibn Al-Khattab (RA)",
    narratorUrdu: "عمر بن الخطاب رضی اللہ عنہ",
    narratorHindi: "उमर बिन खत्ताब रज़ियल्लाहु अन्हु",
    narratorEnglish: "Umar ibn Al-Khattab (RA)",
    reference: "Sahih Muslim 1907a",
    grade: "Sahih",
  },
  {
    id: 2,
    book: "Kitab al-Iman",
    bookUrdu: "کتاب الایمان",
    bookHindi: "ईमान की किताब",
    bookEnglish: "Book of Faith",
    number: 2,
    arabic: "بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلَاةِ، وَإِيتَاءِ الزَّكَاةِ، وَالْحَجِّ، وَصَوْمِ رَمَضَانَ",
    urdu: "اسلام پانچ چیزوں پر بنایا گیا ہے: گواہی دینا کہ اللہ کے سوا کوئی معبود نہیں اور محمد ﷺ اللہ کے رسول ہیں، نماز قائم کرنا، زکوٰۃ دینا، حج کرنا اور رمضان کے روزے رکھنا۔",
    hindi: "इस्लाम पांच चीज़ों पर बनाया गया है: गवाही देना कि अल्लाह के सिवा कोई इबादत के लायक नहीं और मुहम्मद ﷺ अल्लाह के रसूल हैं, नमाज़ क़ायम करना, ज़कात देना, हज करना और रमज़ान के रोज़े रखना।",
    english: "Islam is built upon five: Testifying that there is no deity worthy of worship except Allah and that Muhammad is the Messenger of Allah, establishing prayer, giving zakah, performing Hajj, and fasting Ramadan.",
    narrator: "Ibn Umar (RA)",
    narratorUrdu: "ابن عمر رضی اللہ عنہما",
    narratorHindi: "इब्न उमर रज़ियल्लाहु अन्हुमा",
    narratorEnglish: "Ibn Umar (RA)",
    reference: "Sahih Muslim 16c",
    grade: "Sahih",
  },
  {
    id: 3,
    book: "Kitab al-Birr wal-Silah",
    bookUrdu: "کتاب البر والصلۃ",
    bookHindi: "नेकी और रिश्तेदारी की किताब",
    bookEnglish: "Book of Virtue and Maintaining Ties of Kinship",
    number: 2548,
    arabic: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    urdu: "تم میں سے کوئی شخص مؤمن نہیں ہو سکتا جب تک کہ اپنے بھائی کے لیے وہی چیز پسند نہ کرے جو اپنے لیے پسند کرتا ہے۔",
    hindi: "तुम में से कोई शख़्स मोमिन नहीं हो सकता जब तक कि अपने भाई के लिए वही चीज़ पसंद न करे जो अपने लिए पसंद करता है।",
    english: "None of you truly believes until he loves for his brother what he loves for himself.",
    narrator: "Anas ibn Malik (RA)",
    narratorUrdu: "انس بن مالک رضی اللہ عنہ",
    narratorHindi: "अनस बिन मालिक रज़ियल्लाहु अन्हु",
    narratorEnglish: "Anas ibn Malik (RA)",
    reference: "Sahih Muslim 45a",
    grade: "Sahih",
  },
  {
    id: 4,
    book: "Kitab al-Zuhd",
    bookUrdu: "کتاب الزہد",
    bookHindi: "दुनिया से बेज़ारी की किताब",
    bookEnglish: "Book of Asceticism",
    number: 2961,
    arabic: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    urdu: "جس شخص نے علم حاصل کرنے کے لیے کوئی راستہ اختیار کیا، اللہ نے اس کے لیے اس کے ذریعے جنت کا راستہ آسان کر دیا۔",
    hindi: "जिस शख़्स ने इल्म हासिल करने के लिए कोई रास्ता इख़्तियार किया, अल्लाह ने उसके लिए उसके ज़रिए जन्नत का रास्ता आसान कर दिया।",
    english: "Whoever takes a path upon which to obtain knowledge, Allah makes the path to Paradise easy for him.",
    narrator: "Abu Hurairah (RA)",
    narratorUrdu: "ابو ہریرہ رضی اللہ عنہ",
    narratorHindi: "अबू हुरैरा रज़ियल्लाहु अन्हु",
    narratorEnglish: "Abu Hurairah (RA)",
    reference: "Sahih Muslim 2699",
    grade: "Sahih",
  },
  {
    id: 5,
    book: "Kitab al-Dhikr",
    bookUrdu: "کتاب الذکر",
    bookHindi: "ज़िक्र की किताब",
    bookEnglish: "Book of Remembrance",
    number: 2704,
    arabic: "الطَّهُورُ شَطْرُ الْإِيمَانِ، وَالْحَمْدُ لِلَّهِ تَمْلَأُ الْمِيزَانَ، وَسُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ تَمْلَآنِ أَوْ تَمْلَأُ مَا بَيْنَ السَّمَاوَاتِ وَالْأَرْضِ",
    urdu: "پاکیزگی ایمان کا آدھا حصہ ہے، اور الحمدللہ میزان کو بھر دیتی ہے، اور سبحان اللہ اور الحمدللہ آسمانوں اور زمین کے درمیان کو بھر دیتی ہیں۔",
    hindi: "पाकीज़गी ईमान का आधा हिस्सा है, और अल्हम्दुलिल्लाह मीज़ान को भर देती है, और सुब्हानल्लाह और अल्हम्दुलिल्लाह आसमानों और ज़मीन के दरमियान को भर देती हैं।",
    english: "Cleanliness is half of faith. Alhamdulillah fills the scale. SubhanAllah and Alhamdulillah fill or fill what is between the heavens and the earth.",
    narrator: "Abu Malik Al-Ash'ari (RA)",
    narratorUrdu: "ابو مالک اشعری رضی اللہ عنہ",
    narratorHindi: "अबू मालिक अशअरी रज़ियल्लाहु अन्हु",
    narratorEnglish: "Abu Malik Al-Ash'ari (RA)",
    reference: "Sahih Muslim 223",
    grade: "Sahih",
  },
  {
    id: 6,
    book: "Kitab al-Salah",
    bookUrdu: "کتاب الصلوۃ",
    bookHindi: "नमाज़ की किताब",
    bookEnglish: "Book of Prayer",
    number: 397,
    arabic: "صَلِّ قَبْلَ أَنْ تُصَلَّى عَلَيْكَ",
    urdu: "تم پر نماز پڑھی جانے سے پہلے نماز پڑھو (یعنی نمازِ جنازہ سے پہلے نمازِ تحیّت المسجد ادا کرو)۔",
    hindi: "तुम पर नमाज़ पढ़ी जाने से पहले नमाज़ पढ़ो (यानी नमाज़-ए-जनाज़ा से पहले नमाज़-ए-तहिय्यतुल मस्जिद अदा करो)।",
    english: "Pray before you are prayed upon (i.e., perform the greeting prayer before the funeral prayer).",
    narrator: "Abu Hurairah (RA)",
    narratorUrdu: "ابو ہریرہ رضی اللہ عنہ",
    narratorHindi: "अबू हुरैरा रज़ियल्लाहु अन्हु",
    narratorEnglish: "Abu Hurairah (RA)",
    reference: "Sahih Muslim 714a",
    grade: "Sahih",
  },
  {
    id: 7,
    book: "Kitab al-Jannah",
    bookUrdu: "کتاب الجنۃ",
    bookHindi: "जन्नत की किताब",
    bookEnglish: "Book of Paradise",
    number: 2824,
    arabic: "إِنَّ فِي الْجَنَّةِ مِائَةَ دَرَجَةٍ أَعَدَّهَا اللَّهُ لِلْمُجَاهِدِينَ فِي سَبِيلِ اللَّهِ",
    urdu: "بیشک جنت میں سو درجے ہیں جنہیں اللہ نے اللہ کی راہ میں جہاد کرنے والوں کے لیے تیار کیے ہیں۔",
    hindi: "बेशक जन्नत में सौ दरजे हैं जिन्हें अल्लाह ने अल्लाह की राह में जिहाद करने वालों के लिए तैयार किए हैं।",
    english: "Indeed, in Paradise there are one hundred levels that Allah has prepared for those who fight in His cause.",
    narrator: "Abu Hurairah (RA)",
    narratorUrdu: "ابو ہریرہ رضی اللہ عنہ",
    narratorHindi: "अबू हुरैरा रज़ियल्लाहु अन्हु",
    narratorEnglish: "Abu Hurairah (RA)",
    reference: "Sahih Muslim 1883",
    grade: "Sahih",
  },
  {
    id: 8,
    book: "Kitab al-Riqaq",
    bookUrdu: "کتاب الرقاق",
    bookHindi: "नर्मी की किताब",
    bookEnglish: "Book of Heart-Melting Narrations",
    number: 2860,
    arabic: "الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ",
    urdu: "دنیا مومن کے لیے قید خانہ ہے اور کافر کے لیے جنت ہے۔",
    hindi: "दुनिया मोमिन के लिए क़ैदखाना है और काफिर के लिए जन्नत है।",
    english: "The world is a prison for the believer and a paradise for the disbeliever.",
    narrator: "Abu Hurairah (RA)",
    narratorUrdu: "ابو ہریرہ رضی اللہ عنہ",
    narratorHindi: "अबू हुरैरा रज़ियल्लाहु अन्हु",
    narratorEnglish: "Abu Hurairah (RA)",
    reference: "Sahih Muslim 2956",
    grade: "Sahih",
  },
];

// ── Books List for Filter ──
const BOOKS = [
  { id: "all", label: "Sab", labelUrdu: "سب", labelHindi: "सब", labelEnglish: "All" },
  { id: "Kitab al-Iman", label: "Iman", labelUrdu: "ایمان", labelHindi: "ईमान", labelEnglish: "Faith" },
  { id: "Kitab al-Salah", label: "Salah", labelUrdu: "نماز", labelHindi: "नमाज़", labelEnglish: "Prayer" },
  { id: "Kitab al-Birr wal-Silah", label: "Birr", labelUrdu: "بر", labelHindi: "नेकी", labelEnglish: "Virtue" },
  { id: "Kitab al-Dhikr", label: "Dhikr", labelUrdu: "ذکر", labelHindi: "ज़िक्र", labelEnglish: "Remembrance" },
  { id: "Kitab al-Zuhd", label: "Zuhd", labelUrdu: "زہد", labelHindi: "ज़ुह्द", labelEnglish: "Asceticism" },
  { id: "Kitab al-Jannah", label: "Jannah", labelUrdu: "جنّت", labelHindi: "जन्नत", labelEnglish: "Paradise" },
  { id: "Kitab al-Riqaq", label: "Riqaq", labelUrdu: "رقاق", labelHindi: "रिक़ाक़", labelEnglish: "Heart-Melting" },
];

// ── Language Config ──
const LANGUAGES = [
  { code: "urdu", label: "اردو", voice: false, langCode: "ur-PK", voiceLang: "ur-PK" },
  { code: "hindi", label: "हिंदी", voice: true, langCode: "hi-IN", voiceLang: "hi-IN" },
  { code: "english", label: "English", voice: true, langCode: "en-US", voiceLang: "en-US" },
  { code: "arabic", label: "العربية", voice: true, langCode: "ar-SA", voiceLang: "ar-SA" },
];

// ── Google TTS Function ──
function speakText(text, langCode, onEnd) {
  if (!window.speechSynthesis) {
    alert("Voice support not available on this device");
    return;
  }
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langCode;
  utterance.rate = 0.9;
  utterance.pitch = 1;
  
  // Try to find Google voice
  const voices = window.speechSynthesis.getVoices();
  const googleVoice = voices.find(v => 
    v.name.includes("Google") && v.lang.startsWith(langCode.split("-")[0])
  );
  const fallbackVoice = voices.find(v => v.lang.startsWith(langCode.split("-")[0]));
  
  if (googleVoice) {
    utterance.voice = googleVoice;
  } else if (fallbackVoice) {
    utterance.voice = fallbackVoice;
  }
  
  utterance.onend = () => onEnd?.();
  utterance.onerror = (err) => {
    console.error("TTS Error:", err);
    onEnd?.();
  };
  
  window.speechSynthesis.speak(utterance);
}

function stopSpeaking() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

// ── Voice Button Component ──
function VoiceButton({ text, langCode, isPlaying, onPlay, onStop }) {
  if (!langCode) return null; // Urdu ke liye no voice button
  
  return (
    <button
      onClick={() => isPlaying ? onStop() : onPlay()}
      aria-label={isPlaying ? "Stop voice" : "Play voice"}
      style={{
        background: isPlaying ? `${COLORS.gold}33` : "transparent",
        border: `1px solid ${isPlaying ? COLORS.gold : COLORS.goldDim}`,
        borderRadius: "50%",
        width: "36px",
        height: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: isPlaying ? COLORS.gold : COLORS.textDim,
        fontSize: "16px",
        transition: "all 0.2s",
        flexShrink: 0,
      }}
    >
      {isPlaying ? "⏹" : "🔊"}
    </button>
  );
}

// ── Hadith Card Component ──
function HadithCard({ hadith, lang, isPlaying, onPlay, onStop }) {
  const currentLang = LANGUAGES.find(l => l.code === lang);
  
  const getText = () => {
    switch(lang) {
      case "urdu": return hadith.urdu;
      case "hindi": return hadith.hindi;
      case "english": return hadith.english;
      case "arabic": return hadith.arabic;
      default: return hadith.urdu;
    }
  };
  
  const getNarrator = () => {
    switch(lang) {
      case "urdu": return hadith.narratorUrdu;
      case "hindi": return hadith.narratorHindi;
      case "english": return hadith.narratorEnglish;
      default: return hadith.narrator;
    }
  };
  
  const getBook = () => {
    switch(lang) {
      case "urdu": return hadith.bookUrdu;
      case "hindi": return hadith.bookHindi;
      case "english": return hadith.bookEnglish;
      default: return hadith.book;
    }
  };

  const text = getText();
  const isCurrentlyPlaying = isPlaying === hadith.id;

  return (
    <div
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.goldDim}`,
        borderRadius: "16px",
        padding: "20px",
        marginBottom: "16px",
        position: "relative",
      }}
    >
      {/* Header: Book + Number + Voice */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", gap: "12px" }}>
        <div style={{ flex: 1 }}>
          <div style={{ color: COLORS.goldDim, fontSize: "11px", letterSpacing: "1px", marginBottom: "4px" }}>
            {getBook()} • Hadith #{hadith.number}
          </div>
          <div style={{ color: COLORS.gold, fontSize: "12px", fontWeight: "600" }}>
            {hadith.reference}
          </div>
        </div>
        <VoiceButton
          text={text}
          langCode={currentLang?.voice ? currentLang.voiceLang : null}
          isPlaying={isCurrentlyPlaying}
          onPlay={() => onPlay(hadith.id, text, currentLang?.voiceLang)}
          onStop={onStop}
        />
      </div>

      {/* Arabic Text (always shown on top) */}
      <div
        lang="ar"
        dir="rtl"
        style={{
          color: COLORS.gold,
          fontSize: lang === "arabic" ? "22px" : "18px",
          fontFamily: "serif",
          lineHeight: 1.8,
          marginBottom: "16px",
          textAlign: "right",
          borderBottom: lang === "arabic" ? "none" : `1px solid ${COLORS.goldDim}`,
          paddingBottom: lang === "arabic" ? "0" : "16px",
        }}
      >
        {hadith.arabic}
      </div>

      {/* Translation Text */}
      {lang !== "arabic" && (
        <div
          lang={lang === "urdu" || lang === "hindi" ? "ur" : "en"}
          dir={lang === "urdu" || lang === "hindi" ? "rtl" : "ltr"}
          style={{
            color: COLORS.text,
            fontSize: "15px",
            lineHeight: 1.8,
            marginBottom: "16px",
            textAlign: lang === "urdu" || lang === "hindi" ? "right" : "left",
            fontFamily: lang === "hindi" ? "system-ui, sans-serif" : "inherit",
          }}
        >
          {text}
        </div>
      )}

      {/* Footer: Narrator + Grade */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        borderTop: `1px solid ${COLORS.goldDim}`,
        paddingTop: "12px",
      }}>
        <div style={{ color: COLORS.textDim, fontSize: "12px" }}>
          <span style={{ color: COLORS.goldDim }}>Ravi: </span>
          {getNarrator()}
        </div>
        <div style={{ 
          background: `${COLORS.accentGreen}22`, 
          color: COLORS.accentGreen,
          padding: "4px 10px",
          borderRadius: "20px",
          fontSize: "11px",
          fontWeight: "600",
          letterSpacing: "0.5px",
        }}>
          {hadith.grade}
        </div>
      </div>
    </div>
  );
}

export default function Hadith() {
  const [lang, setLang] = useState("urdu");
  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState("all");
  const [playingId, setPlayingId] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("hadith_favs") || "[]"); } 
    catch { return []; }
  });

  // Load voices on mount
  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices(); // Trigger load
    }
  }, []);

  // Save favorites
  useEffect(() => {
    localStorage.setItem("hadith_favs", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFav = useCallback((id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  }, []);

  const handlePlay = useCallback((id, text, voiceLang) => {
    setPlayingId(id);
    speakText(text, voiceLang, () => setPlayingId(null));
  }, []);

  const handleStop = useCallback(() => {
    stopSpeaking();
    setPlayingId(null);
  }, []);

  const filtered = useMemo(() => {
    let result = HADITHS;
    
    if (selectedBook !== "all") {
      result = result.filter(h => h.book === selectedBook);
    }
    
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(h => 
        h.urdu.toLowerCase().includes(q) ||
        h.hindi.toLowerCase().includes(q) ||
        h.english.toLowerCase().includes(q) ||
        h.arabic.includes(q) ||
        h.narrator.toLowerCase().includes(q) ||
        h.reference.toLowerCase().includes(q)
      );
    }
    
    return result;
  }, [selectedBook, search]);

  const currentLang = LANGUAGES.find(l => l.code === lang);

  return (
    <>
      <Helmet>
        <title>Sahih Muslim Hadith — Hindi Urdu English Arabic | Soulayah</title>
        <meta name="description" content="Read Sahih Muslim Hadith in Urdu, Hindi, English and Arabic with translation. Authentic hadiths with narrator chain and grade. Free Islamic hadith app." />
        <meta name="keywords" content="sahih muslim, hadith in urdu, hadith in hindi, hadees sharif, islamic hadith, bukhari muslim, hadith translation" />
        <link rel="canonical" href="https://soulayah.vercel.app/hadith" />
        <meta property="og:title" content="Sahih Muslim Hadith — Hindi Urdu English | Soulayah" />
        <meta property="og:description" content="Authentic Sahih Muslim Hadith with translation in Urdu, Hindi, English and Arabic. Read and listen with Google Voice." />
      </Helmet>

      <div style={{ 
        minHeight: "100vh", 
        background: COLORS.bg, 
        color: COLORS.text, 
        fontFamily: "system-ui, sans-serif",
        paddingBottom: "100px",
      }}>
        {/* Header */}
        <header style={{ 
          background: `linear-gradient(180deg, #0f1822 0%, ${COLORS.bg} 100%)`, 
          borderBottom: `1px solid ${COLORS.goldDim}`, 
          padding: "24px 20px 16px",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>📖</div>
            <h1 style={{ color: COLORS.gold, fontSize: "24px", fontFamily: "Georgia, serif", margin: "0 0 4px" }}>
              Sahih Muslim
            </h1>
            <p style={{ color: COLORS.textDim, fontSize: "13px", margin: 0 }}>
              صحیح مسلم کی احادیث
            </p>
          </div>

          {/* Language Selector */}
          <div style={{ 
            display: "flex", 
            gap: "8px", 
            marginBottom: "16px",
            overflowX: "auto",
            paddingBottom: "4px",
          }}>
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => {
                  handleStop();
                  setLang(l.code);
                }}
                aria-pressed={lang === l.code}
                style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  whiteSpace: "nowrap",
                  border: `1px solid ${lang === l.code ? COLORS.gold : COLORS.goldDim}`,
                  background: lang === l.code ? `${COLORS.gold}22` : "transparent",
                  color: lang === l.code ? COLORS.gold : COLORS.textDim,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {l.label}
                {l.voice && <span style={{ fontSize: "10px" }}>🔊</span>}
                {!l.voice && <span style={{ fontSize: "10px", opacity: 0.5 }}>👁</span>}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ maxWidth: "480px", margin: "0 auto" }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={
                lang === "urdu" ? "حدیث تلاش کریں..." :
                lang === "hindi" ? "हदीस खोजें..." :
                lang === "arabic" ? "ابحث في الحديث..." :
                "Search hadith..."
              }
              autoComplete="off"
              style={{
                width: "100%",
                background: COLORS.card,
                border: `1px solid ${COLORS.goldDim}`,
                borderRadius: "12px",
                padding: "12px 16px",
                color: COLORS.text,
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        </header>

        {/* Book Filters */}
        <div style={{ 
          display: "flex", 
          gap: "8px", 
          padding: "16px 20px",
          overflowX: "auto",
          maxWidth: "480px",
          margin: "0 auto",
        }}>
          {BOOKS.map(book => {
            const label = lang === "urdu" ? book.labelUrdu : 
                         lang === "hindi" ? book.labelHindi : 
                         lang === "arabic" ? book.labelEnglish : 
                         book.labelEnglish;
            return (
              <button
                key={book.id}
                onClick={() => setSelectedBook(book.id)}
                aria-pressed={selectedBook === book.id}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                  border: `1px solid ${selectedBook === book.id ? COLORS.gold : COLORS.goldDim}`,
                  background: selectedBook === book.id ? `${COLORS.gold}22` : "transparent",
                  color: selectedBook === book.id ? COLORS.gold : COLORS.textDim,
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Hadith List */}
        <main style={{ padding: "0 20px", maxWidth: "480px", margin: "0 auto" }}>
          <div style={{ color: COLORS.textDim, fontSize: "12px", marginBottom: "16px" }}>
            {filtered.length} hadith dikh rahe hain
          </div>

          {filtered.map(hadith => (
            <HadithCard
              key={hadith.id}
              hadith={hadith}
              lang={lang}
              isPlaying={playingId}
              onPlay={handlePlay}
              onStop={handleStop}
            />
          ))}

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: COLORS.textDim }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>📖</div>
              <div>
                {lang === "urdu" ? "کوئی حدیث نہیں ملی" :
                 lang === "hindi" ? "कोई हदीस नहीं मिली" :
                 lang === "arabic" ? "لم يتم العثور على حديث" :
                 "No hadith found"}
              </div>
            </div>
          )}
        </main>
      </div>

      <style>{`
        *:focus-visible { outline: 2px solid #C9A84C; outline-offset: 2px; }
      `}</style>
    </>
  );
}