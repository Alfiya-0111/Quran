// src/pages/HadithPage.jsx
import React, { useState, useEffect, useContext, useCallback } from "react";
import { LanguageContext, TRANSLATIONS } from "../App";

// ── Book Metadata ────────────────────────────────────────────────────
const SAHIH_MUSLIM_BOOKS = [
  { id: 1, slug: "iman", title: "Kitab al-Iman", titleUrdu: "کتاب الإیمان", titleHindi: "ईमान की किताब", english: "The Book of Faith", hadithCount: 92 },
  { id: 2, slug: "taharah", title: "Kitab al-Taharah", titleUrdu: "کتاب الطہارت", titleHindi: "पाकीज़गी की किताब", english: "The Book of Purification", hadithCount: 146 },
  { id: 3, slug: "salah", title: "Kitab al-Salah", titleUrdu: "کتاب الصلاۃ", titleHindi: "नमाज़ की किताब", english: "The Book of Prayer", hadithCount: 436 },
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
    cache = data;
    return data;
  } catch {
    const res = await fetch(GITHUB_RAW);
    const data = await res.json();
    cache = data;
    return data;
  }
}

// ── Hadith Card ──────────────────────────────────────────────────────
function HadithCard({ hadith, texts, lang }) {
  const {
    id,
    arabic,
    english,
    hadith_number,
    bookId,
    chapterId,
  } = hadith;

  const book = SAHIH_MUSLIM_BOOKS.find((b) => b.id === bookId);
  const bookName =
    lang === "ur" ? book?.titleUrdu : lang === "hi" ? book?.titleHindi : book?.english;

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

      <div
        style={{
          marginTop: "14px",
          paddingTop: "14px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          fontSize: "11px",
          color: "#666",
        }}
      >
        {texts.reference}: Sahih Muslim, {texts.book} {bookId}, {texts.hadith} {id}
        {chapterId && ` | Chapter ${chapterId}`}
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────
export default function HadithPage() {
  const { lang } = useContext(LanguageContext);
  const t = HADITH_TEXTS[lang] || HADITH_TEXTS.en;

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
const list = Array.isArray(data) ? data : data.hadiths || data.data || Object.values(data);
setHadiths(list);
setFiltered(list);
    } catch (err) {
      setError(err.message);
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
        const text = `${h.english?.text || ""} ${h.english?.narrator || ""} ${h.arabic || ""}`.toLowerCase();
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
    if (lang === "ur") return book.titleUrdu;
    if (lang === "hi") return book.titleHindi;
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
        <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>{t.pageSubtitle}</p>
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
              background: selectedBook === null ? "linear-gradient(135deg, #C9A84C 0%, #a08030 100%)" : "rgba(255,255,255,0.06)",
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
                background: selectedBook === book.id ? "linear-gradient(135deg, #C9A84C 0%, #a08030 100%)" : "rgba(255,255,255,0.06)",
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
          <HadithCard key={h.id || i} hadith={h} texts={t} lang={lang} />
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
                background: page === 1 ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #C9A84C 0%, #a08030 100%)",
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
                background: page === totalPages ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #C9A84C 0%, #a08030 100%)",
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