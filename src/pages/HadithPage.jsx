// src/pages/HadithPage.jsx
import React, { useState, useEffect, useContext, useCallback } from "react";
import { LanguageContext, TRANSLATIONS } from "../App";

// ── Book Metadata ────────────────────────────────────────────────────
const SAHIH_MUSLIM_BOOKS = [
  { id: 1, slug: "iman", title: "Kitab al-Iman", titleUrdu: "کتاب الإیمان", titleHindi: "ईमान की किताब", english: "The Book of Faith", hadithCount: 92 },
  { id: 2, slug: "taharah", title: "Kitab al-Taharah", titleUrdu: "کتاب الطہارت", titleHindi: "पाकीज़गी की किताब", english: "The Book of Purification", hadithCount: 146 },
  { id: 3, slug: "salah", title: "Kitab al-Salah", titleUrdu: "کتاب الصلاۃ", titleHindi: "नमाज़ की किताब", english: "The Book of Prayer", hadithCount: 436 },
  { id: 4, slug: "zakat", title: "Kitab al-Zakat", titleUrdu: "کتاب الزکوٰۃ", titleHindi: "ज़कात की किताब", english: "The Book of Charity", hadithCount: 132 },
  { id: 5, slug: "hajj", title: "Kitab al-Hajj", titleUrdu: "کتاب الحج", titleHindi: "हज की किताब", english: "The Book of Pilgrimage", hadithCount: 312 },
  { id: 6, slug: "nikah", title: "Kitab al-Nikah", titleUrdu: "کتاب النکاح", titleHindi: "निकाह की किताब", english: "The Book of Marriage", hadithCount: 169 },
  { id: 7, slug: "business", title: "Kitab al-Buyu", titleUrdu: "کتاب البیوع", titleHindi: "व्यापार की किताब", english: "The Book of Business", hadithCount: 92 },
  { id: 8, slug: "jihad", title: "Kitab al-Jihad", titleUrdu: "کتاب الجہاد", titleHindi: "जिहाद की किताब", english: "The Book of Striving", hadithCount: 166 },
  { id: 9, slug: "food", title: "Kitab al-At'imah", titleUrdu: "کتاب الأطعمة", titleHindi: "खाने की किताब", english: "The Book of Food", hadithCount: 89 },
  { id: 10, slug: "jannah", title: "Kitab al-Jannah", titleUrdu: "کتاب الجنۃ", titleHindi: "जन्नत की किताब", english: "The Book of Paradise", hadithCount: 82 },
  { id: 11, slug: "riqaq", title: "Kitab al-Riqaq", titleUrdu: "کتاب الرقاق", titleHindi: "दिल को पिघलाने वाली किताब", english: "Heart-Melting Traditions", hadithCount: 184 },
  { id: 12, slug: "dhikr", title: "Kitab al-Dhikr", titleUrdu: "کتاب الذکر", titleHindi: "ज़िक्र की किताब", english: "The Book of Remembrance", hadithCount: 156 },
  { id: 13, slug: "dua", title: "Kitab al-Dua", titleUrdu: "کتاب الدعوات", titleHindi: "दुआ की किताब", english: "The Book of Supplications", hadithCount: 147 },
  { id: 14, slug: "manners", title: "Kitab al-Adab", titleUrdu: "کتاب الأدب", titleHindi: "आदाब की किताब", english: "The Book of Manners", hadithCount: 78 },
  { id: 15, slug: "knowledge", title: "Kitab al-Ilm", titleUrdu: "کتاب العلم", titleHindi: "इल्म की किताब", english: "The Book of Knowledge", hadithCount: 43 },
  { id: 16, slug: "judgement", title: "Kitab al-Qadar", titleUrdu: "کتاب القدر", titleHindi: "तक़दीर की किताब", english: "The Book of Destiny", hadithCount: 52 },
];

// ── Language Config ──────────────────────────────────────────────────
const LANGUAGES = [
  { code: "ur", label: "اردو", dir: "rtl" },
  { code: "hi", label: "हिंदी", dir: "ltr" },
  { code: "en", label: "English", dir: "ltr" },
];

// ── Translations for Hadith Page ─────────────────────────────────────
const HADITH_TEXTS = {
  en: {
    pageTitle: "Sahih Muslim",
    pageSubtitle: "7,563 Authentic Hadiths of Prophet Muhammad ﷺ",
    searchPlaceholder: "Search hadiths...",
    randomHadith: "🎲 Random Hadith",
    allBooks: "All Books",
    loading: "Loading hadiths...",
    noResults: "No hadiths found.",
    retry: "Retry",
    book: "Book",
    hadith: "Hadith",
    narrator: "Narrator",
    reference: "Reference",
  },
  ur: {
    pageTitle: "صحیح مسلم",
    pageSubtitle: "حضور ﷺ کی 7,563 صحیح احادیث",
    searchPlaceholder: "احادیث تلاش کریں...",
    randomHadith: "🎲 رینڈم حدیث",
    allBooks: "تمام کتب",
    loading: "احادیث لوڈ ہو رہی ہیں...",
    noResults: "کوئی حدیث نہیں ملی۔",
    retry: "دوبارہ کوشش کریں",
    book: "کتاب",
    hadith: "حدیث",
    narrator: "راوی",
    reference: "حوالہ",
  },
  hi: {
    pageTitle: "सहीह मुस्लिम",
    pageSubtitle: "हज़रत मुहम्मद ﷺ की 7,563 सहीह हदीसें",
    searchPlaceholder: "हदीसें खोजें...",
    randomHadith: "🎲 रैंडम हदीस",
    allBooks: "सभी किताबें",
    loading: "हदीसें लोड हो रही हैं...",
    noResults: "कोई हदीस नहीं मिली।",
    retry: "पुनः प्रयास करें",
    book: "किताब",
    hadith: "हदीस",
    narrator: "रावी",
    reference: "हवाला",
  },
};

// ── Static Hadith Data (Urdu + Hindi + English) ──────────────────────
const STATIC_HADITHS = [
  {
    id: 1,
    bookId: 1,
    hadith_number: 1907,
    arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    urdu: "اعمال کا دارومدار نیتوں پر ہے، اور ہر شخص کو وہی ملے گا جس کی اس نے نیت کی۔",
    hindi: "कर्म नियतों पर निर्भर करते हैं, और हर व्यक्ति को वही मिलेगा जिसकी उसने नियत की।",
    english: { narrator: "Umar ibn Al-Khattab (RA)", text: "Actions are but by intentions, and every person will have what he intended." },
    reference: "Sahih Muslim 1907a",
  },
  {
    id: 2,
    bookId: 1,
    hadith_number: 16,
    arabic: "بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلَاةِ، وَإِيتَاءِ الزَّكَاةِ، وَالْحَجِّ، وَصَوْمِ رَمَضَانَ",
    urdu: "اسلام پانچ چیزوں پر قائم ہے: گواہی دینا کہ اللہ کے سوا کوئی معبود نہیں اور محمد ﷺ اللہ کے رسول ہیں، نماز قائم کرنا، زکوٰۃ دینا، حج کرنا اور رمضان کے روزے رکھنا۔",
    hindi: "इस्लाम पांच चीज़ों पर क़ायम है: गवाही देना कि अल्लाह के सिवा कोई इबादत के लायक नहीं और मुहम्मद ﷺ अल्लाह के रसूल हैं, नमाज़ क़ायम करना, ज़कात देना, हज करना और रमज़ान के रोज़े रखना।",
    english: { narrator: "Ibn Umar (RA)", text: "Islam is built upon five: Testifying that there is no deity worthy of worship except Allah and that Muhammad is the Messenger of Allah, establishing prayer, giving zakah, performing Hajj, and fasting Ramadan." },
    reference: "Sahih Muslim 16c",
  },
  {
    id: 3,
    bookId: 12,
    hadith_number: 2699,
    arabic: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    urdu: "جس نے علم حاصل کرنے کے لیے کوئی راستہ اختیار کیا، اللہ نے اس کے لیے جنت کا راستہ آسان کر دیا۔",
    hindi: "जिसने इल्म हासिल करने के लिए कोई रास्ता इख़्तियार किया, अल्लाह ने उसके लिए जन्नत का रास्ता आसान कर दिया।",
    english: { narrator: "Abu Hurairah (RA)", text: "Whoever takes a path upon which to obtain knowledge, Allah makes the path to Paradise easy for him." },
    reference: "Sahih Muslim 2699",
  },
  {
    id: 4,
    bookId: 1,
    hadith_number: 45,
    arabic: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    urdu: "تم میں سے کوئی شخص مومن نہیں ہو سکتا جب تک اپنے بھائی کے لیے وہی چیز پسند نہ کرے جو اپنے لیے پسند کرتا ہے۔",
    hindi: "तुम में से कोई शख़्स मोमिन नहीं हो सकता जब तक अपने भाई के लिए वही चीज़ पसंद न करे जो अपने लिए पसंद करता है।",
    english: { narrator: "Anas ibn Malik (RA)", text: "None of you truly believes until he loves for his brother what he loves for himself." },
    reference: "Sahih Muslim 45a",
  },
  {
    id: 5,
    bookId: 12,
    hadith_number: 223,
    arabic: "الطَّهُورُ شَطْرُ الْإِيمَانِ، وَالْحَمْدُ لِلَّهِ تَمْلَأُ الْمِيزَانَ",
    urdu: "پاکیزگی ایمان کا آدھا حصہ ہے، اور الحمدللہ میزان کو بھر دیتی ہے۔",
    hindi: "पाकीज़गी ईमान का आधा हिस्सा है, और अल्हम्दुलिल्लाह मीज़ान को भर देती है।",
    english: { narrator: "Abu Malik Al-Ash'ari (RA)", text: "Cleanliness is half of faith. Alhamdulillah fills the scale." },
    reference: "Sahih Muslim 223",
  },
  {
    id: 6,
    bookId: 10,
    hadith_number: 1883,
    arabic: "إِنَّ فِي الْجَنَّةِ مِائَةَ دَرَجَةٍ أَعَدَّهَا اللَّهُ لِلْمُجَاهِدِينَ فِي سَبِيلِ اللَّهِ",
    urdu: "بیشک جنت میں سو درجے ہیں جنہیں اللہ نے اللہ کی راہ میں جہاد کرنے والوں کے لیے تیار کیے ہیں۔",
    hindi: "बेशक जन्नत में सौ दरजे हैं जिन्हें अल्लाह ने अल्लाह की राह में जिहाद करने वालों के लिए तैयार किए हैं।",
    english: { narrator: "Abu Hurairah (RA)", text: "Indeed, in Paradise there are one hundred levels that Allah has prepared for those who fight in His cause." },
    reference: "Sahih Muslim 1883",
  },
  {
    id: 7,
    bookId: 11,
    hadith_number: 2956,
    arabic: "الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ",
    urdu: "دنیا مومن کے لیے قید خانہ ہے اور کافر کے لیے جنت ہے۔",
    hindi: "दुनिया मोमिन के लिए क़ैदखाना है और काफिर के लिए जन्नत है।",
    english: { narrator: "Abu Hurairah (RA)", text: "The world is a prison for the believer and a paradise for the disbeliever." },
    reference: "Sahih Muslim 2956",
  },
  {
    id: 8,
    bookId: 13,
    hadith_number: 2702,
    arabic: "الدُّعَاءُ هُوَ الْعِبَادَةُ",
    urdu: "دعا ہی عبادت ہے۔",
    hindi: "दुआ ही इबादत है।",
    english: { narrator: "Nu'man ibn Bashir (RA)", text: "Supplication is worship." },
    reference: "Sahih Muslim 2702",
  },
];

// ── API Sources ──────────────────────────────────────────────────────
const CDN_BASE = "https://cdn.jsdelivr.net/npm/sahih-muslim@latest/bin/muslim.json";
const GITHUB_RAW = "https://raw.githubusercontent.com/AhmedBaset/hadith-json/v1.2.0/db/by_book/the_9_books/muslim.json";

let cache = null;

async function fetchAllHadiths() {
  if (cache) return cache;
  try {
    const res = await fetch(CDN_BASE);
    if (!res.ok) throw new Error("CDN failed");
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.hadiths || data.data || Object.values(data);
    cache = list;
    return list;
  } catch {
    try {
      const res = await fetch(GITHUB_RAW);
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.hadiths || data.data || Object.values(data);
      cache = list;
      return list;
    } catch {
      // Both APIs failed — return static data
      return STATIC_HADITHS;
    }
  }
}

// ── Hadith Card ──────────────────────────────────────────────────────
function HadithCard({ hadith, texts, lang, displayLang }) {
  const { id, arabic, english, urdu, hindi, hadith_number, bookId, chapterId, reference } = hadith;

  const book = SAHIH_MUSLIM_BOOKS.find((b) => b.id === bookId);
  const bookName =
    displayLang === "ur"
      ? book?.titleUrdu
      : displayLang === "hi"
      ? book?.titleHindi
      : book?.english;

  // Translation text based on selected display language
  const translationText =
    displayLang === "ur" ? urdu : displayLang === "hi" ? hindi : null;
  const isRTL = displayLang === "ur";

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "16px",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        color: "#fff",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
        <span
          style={{
            background: "linear-gradient(135deg, #C9A84C 0%, #a08030 100%)",
            padding: "5px 14px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "700",
            color: "#0a0a0f",
          }}
        >
          {texts.hadith} #{hadith_number || id}
        </span>
        <span style={{ color: "#888", fontSize: "12px" }}>
          {bookName || "Sahih Muslim"}
        </span>
      </div>

      {/* Arabic Text */}
      {arabic && (
        <div
          style={{
            background: "rgba(0,0,0,0.25)",
            borderRadius: "12px",
            padding: "18px",
            marginBottom: "14px",
            borderRight: "3px solid #C9A84C",
          }}
        >
          <p
            dir="rtl"
            style={{
              fontFamily: '"Scheherazade New", "Traditional Arabic", serif',
              fontSize: "20px",
              lineHeight: "2",
              color: "#e8d5b7",
              margin: 0,
              textAlign: "right",
            }}
          >
            {arabic}
          </p>
        </div>
      )}

      {/* Urdu / Hindi Translation */}
      {translationText && (
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            borderRadius: "10px",
            padding: "14px 16px",
            marginBottom: "14px",
            borderLeft: isRTL ? "none" : "3px solid #4a7fc1",
            borderRight: isRTL ? "3px solid #4a7fc1" : "none",
          }}
        >
          <p
            dir={isRTL ? "rtl" : "ltr"}
            style={{
              fontSize: "15px",
              lineHeight: "1.9",
              color: "#c8ddf0",
              margin: 0,
              textAlign: isRTL ? "right" : "left",
              fontFamily: displayLang === "hi" ? "system-ui, sans-serif" : "inherit",
            }}
          >
            {translationText}
          </p>
        </div>
      )}

      {/* English Translation */}
      {english?.text && (
        <div>
          {english.narrator && (
            <p style={{ color: "#b8c5d6", fontSize: "13px", marginBottom: "8px", fontStyle: "italic" }}>
              <strong style={{ color: "#C9A84C" }}>{texts.narrator}:</strong> {english.narrator}
            </p>
          )}
          <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#d0d0d0", margin: 0 }}>
            {english.text}
          </p>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          marginTop: "14px",
          paddingTop: "14px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          fontSize: "11px",
          color: "#666",
        }}
      >
        {texts.reference}: {reference || `Sahih Muslim, ${texts.book} ${bookId}, ${texts.hadith} ${id}`}
        {chapterId && ` | Chapter ${chapterId}`}
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────
export default function HadithPage() {
  const { lang } = useContext(LanguageContext);

  // displayLang controls which translation is shown inside cards
  const [displayLang, setDisplayLang] = useState("en");

  const t = HADITH_TEXTS[displayLang] || HADITH_TEXTS.en;

  const [hadiths, setHadiths] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const loadHadiths = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllHadiths();
      const list = Array.isArray(data) ? data : [];
      setHadiths(list);
      setFiltered(list);
    } catch (err) {
      setError(err.message);
      // Fallback to static data on error
      setHadiths(STATIC_HADITHS);
      setFiltered(STATIC_HADITHS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHadiths();
  }, [loadHadiths]);

  // Filter by search + book
  useEffect(() => {
    let result = [...hadiths];
    if (selectedBook) {
      result = result.filter((h) => h.bookId === selectedBook);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((h) => {
        const text = [
          h.english?.text || "",
          h.english?.narrator || "",
          h.arabic || "",
          h.urdu || "",
          h.hindi || "",
        ]
          .join(" ")
          .toLowerCase();
        return text.includes(q);
      });
    }
    setFiltered(result);
    setPage(1);
  }, [search, selectedBook, hadiths]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const loadRandom = () => {
    if (hadiths.length === 0) return;
    const r = hadiths[Math.floor(Math.random() * hadiths.length)];
    setFiltered([r]);
    setSelectedBook(null);
    setSearch("");
    setPage(1);
  };

  const getBookTitle = (book) => {
    if (displayLang === "ur") return book.titleUrdu;
    if (displayLang === "hi") return book.titleHindi;
    return book.english;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", paddingBottom: "80px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", padding: "32px 20px 16px" }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "800",
            margin: "0 0 8px",
            background: "linear-gradient(135deg, #C9A84C 0%, #e8d5b7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t.pageTitle}
        </h1>
        <p style={{ color: "#888", fontSize: "14px", margin: "0 0 16px" }}>{t.pageSubtitle}</p>

        {/* Language Toggle */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => setDisplayLang(l.code)}
              style={{
                padding: "7px 20px",
                borderRadius: "20px",
                border: "none",
                background:
                  displayLang === l.code
                    ? "linear-gradient(135deg, #C9A84C 0%, #a08030 100%)"
                    : "rgba(255,255,255,0.06)",
                color: displayLang === l.code ? "#0a0a0f" : "#aaa",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search + Random */}
      <div style={{ maxWidth: "700px", margin: "0 auto 20px", padding: "0 16px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.searchPlaceholder}
          style={{
            flex: 1,
            padding: "12px 18px",
            borderRadius: "12px",
            border: "1px solid rgba(201,168,76,0.2)",
            background: "rgba(255,255,255,0.05)",
            color: "#fff",
            fontSize: "15px",
            outline: "none",
          }}
        />
        <button
          onClick={loadRandom}
          style={{
            background: "linear-gradient(135deg, #C9A84C 0%, #a08030 100%)",
            color: "#0a0a0f",
            border: "none",
            padding: "12px 18px",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}
        >
          {t.randomHadith}
        </button>
      </div>

      {/* Books Filter */}
      <div style={{ maxWidth: "900px", margin: "0 auto 20px", padding: "0 16px" }}>
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px" }}>
          <button
            onClick={() => setSelectedBook(null)}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: "none",
              background:
                selectedBook === null
                  ? "linear-gradient(135deg, #C9A84C 0%, #a08030 100%)"
                  : "rgba(255,255,255,0.06)",
              color: selectedBook === null ? "#0a0a0f" : "#aaa",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
              whiteSpace: "nowrap",
            }}
          >
            {t.allBooks}
          </button>
          {SAHIH_MUSLIM_BOOKS.map((book) => (
            <button
              key={book.id}
              onClick={() => setSelectedBook(book.id === selectedBook ? null : book.id)}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                border: "none",
                background:
                  selectedBook === book.id
                    ? "linear-gradient(135deg, #C9A84C 0%, #a08030 100%)"
                    : "rgba(255,255,255,0.06)",
                color: selectedBook === book.id ? "#0a0a0f" : "#aaa",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "600",
                whiteSpace: "nowrap",
              }}
            >
              {getBookTitle(book)}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div style={{ maxWidth: "900px", margin: "0 auto 16px", padding: "0 16px", color: "#666", fontSize: "13px" }}>
        {filtered.length} {t.hadith.toLowerCase()}s
      </div>

      {/* Hadith List */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 16px" }}>
        {loading && paginated.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#C9A84C" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "3px solid rgba(201,168,76,0.2)",
                borderTop: "3px solid #C9A84C",
                borderRadius: "50%",
                margin: "0 auto 16px",
                animation: "spin 1s linear infinite",
              }}
            />
            <p>{t.loading}</p>
          </div>
        )}

        {error && (
          <div style={{ textAlign: "center", padding: "40px", color: "#ff6b6b" }}>
            <p>{error}</p>
            <button
              onClick={loadHadiths}
              style={{
                marginTop: "12px",
                background: "#C9A84C",
                color: "#0a0a0f",
                border: "none",
                padding: "10px 24px",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: "700",
              }}
            >
              {t.retry}
            </button>
          </div>
        )}

        {paginated.map((h, i) => (
          <HadithCard
            key={h.id || i}
            hadith={h}
            texts={t}
            lang={lang}
            displayLang={displayLang}
          />
        ))}

        {filtered.length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#666" }}>
            <p>{t.noResults}</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "24px", padding: "16px" }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                background:
                  page === 1
                    ? "rgba(255,255,255,0.05)"
                    : "linear-gradient(135deg, #C9A84C 0%, #a08030 100%)",
                color: page === 1 ? "#555" : "#0a0a0f",
                border: "none",
                padding: "10px 22px",
                borderRadius: "20px",
                cursor: page === 1 ? "not-allowed" : "pointer",
                fontWeight: "700",
                fontSize: "13px",
              }}
            >
              ←
            </button>
            <span style={{ color: "#888", fontSize: "14px", display: "flex", alignItems: "center" }}>
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                background:
                  page === totalPages
                    ? "rgba(255,255,255,0.05)"
                    : "linear-gradient(135deg, #C9A84C 0%, #a08030 100%)",
                color: page === totalPages ? "#555" : "#0a0a0f",
                border: "none",
                padding: "10px 22px",
                borderRadius: "20px",
                cursor: page === totalPages ? "not-allowed" : "pointer",
                fontWeight: "700",
                fontSize: "13px",
              }}
            >
              →
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}