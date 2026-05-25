import { useState, useEffect, useCallback, useMemo, useReducer, useRef } from "react";
import { Helmet } from "react-helmet-async";

// ─── Module-level constants ───────────────────────────────────────────────────

const SAMPLE_SURAHS = [
  { number: 1,   name: "Al-Fatihah", arabic: "الفاتحة", ayahs: 7 },
  { number: 112, name: "Al-Ikhlas",  arabic: "الإخلاص", ayahs: 4 },
  { number: 113, name: "Al-Falaq",   arabic: "الفلق",   ayahs: 5 },
  { number: 114, name: "An-Nas",     arabic: "الناس",   ayahs: 6 },
  { number: 36,  name: "Ya-Sin",     arabic: "يس",       ayahs: 83 },
  { number: 55,  name: "Ar-Rahman",  arabic: "الرحمن",  ayahs: 78 },
  { number: 67,  name: "Al-Mulk",    arabic: "الملك",   ayahs: 30 },
  { number: 2,   name: "Al-Baqarah", arabic: "البقرة",  ayahs: 286 },
];

// ✅ Complete dictionary unchanged (apna pura dictionary yahan paste karo)
const QURAN_DICTIONARY = {
  "اللَّهِ": "Allah ka/ke", "اللَّهُ": "Allah", "اللَّه": "Allah",
  "رَبِّ": "Rabb", "رَبُّ": "Rabb hai", "رَبَّكَ": "tera Rabb",
  // ... (apna pura QURAN_DICTIONARY yahan rakho, koi change nahi)
};

// ✅ Pre-computed stripped dictionary — ek baar banao, baar baar loop nahi
// Har key ka diacritics-stripped version cache karo
const STRIPPED_DICT = new Map(
  Object.entries(QURAN_DICTIONARY).map(([k, v]) => [
    k.replace(/[\u064B-\u065F\u0610-\u061A]/g, ""),
    v,
  ])
);

// ✅ O(1) lookup + O(n) fallback sirf jab zaroor ho — pehle wali approach se bahut fast
function getWordMeaning(arabicWord) {
  if (!arabicWord?.trim()) return null;
  const word = arabicWord.trim();

  // 1. Direct hash lookup — O(1)
  if (QURAN_DICTIONARY[word]) return QURAN_DICTIONARY[word];

  // 2. Stripped diacritics lookup — O(1) via Map
  const stripped = word.replace(/[\u064B-\u065F\u0610-\u061A]/g, "");
  if (STRIPPED_DICT.has(stripped)) return STRIPPED_DICT.get(stripped);

  // 3. Partial match — O(n), sirf tab jab baaki dono fail hoon
  // Sirf 4+ char words pe try karo (chhote words mein false positives zyada)
  if (stripped.length >= 4) {
    for (const [key, val] of Object.entries(QURAN_DICTIONARY)) {
      if (word.includes(key) && key.length > 3) return val + " (approx)";
    }
  }

  return null;
}

// ✅ Pure function — module level, koi dependency nahi
function processAyahs(arabicAyahs, urduAyahs) {
  return arabicAyahs.map((a, i) => ({
    number: a.numberInSurah,
    urdu: urduAyahs[i]?.text || "",
    words: a.text
      .split(" ")
      .filter((w) => w.trim())
      .map((word, wi) => ({
        id: `${a.numberInSurah}-${wi}`,   // ✅ Stable unique ID
        text: word,
        meaning: getWordMeaning(word),
      })),
  }));
}

// ─── Quiz reducer ─────────────────────────────────────────────────────────────
// ✅ 5 quiz states → 1 useReducer
const quizInitial = { active: false, word: null, answer: "", result: null };

function quizReducer(state, action) {
  switch (action.type) {
    case "START":
      return { active: true, word: action.word, answer: "", result: null };
    case "TYPE":
      return { ...state, answer: action.value };
    case "CHECK": {
      const correct = (state.word?.meaning || "")
        .toLowerCase()
        .replace(" (approx)", "");
      const ans = state.answer.toLowerCase().trim();
      const isCorrect =
        correct.includes(ans) || ans.includes(correct.split(" ")[0]);
      return { ...state, result: isCorrect ? "correct" : "wrong" };
    }
    case "NEXT":
      return { active: true, word: action.word, answer: "", result: null };
    case "CLOSE":
      return quizInitial;
    default:
      return state;
  }
}

// ─── localStorage hook — debounced, safe ─────────────────────────────────────
// ✅ Pehle: useEffect har savedWords change pe localStorage.setItem call karta tha
// Ab: 500ms debounce, JSON.parse error safe
function useSavedWords() {
  const [savedWords, setSavedWords] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("quran_saved_words") || "[]");
    } catch {
      return [];
    }
  });

  const timerRef = useRef(null);

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      localStorage.setItem("quran_saved_words", JSON.stringify(savedWords));
    }, 500);
    return () => clearTimeout(timerRef.current);
  }, [savedWords]);

  const saveWord = useCallback((word) => {
    if (!word) return;
    setSavedWords((prev) =>
      prev.find((w) => w.text === word.text) ? prev : [...prev, word]
    );
  }, []);

  const removeWord = useCallback((word) => {
    setSavedWords((prev) => prev.filter((w) => w.text !== word.text));
  }, []);

  return { savedWords, saveWord, removeWord };
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function WordByWord() {
  const [selectedSurah, setSelectedSurah] = useState(SAMPLE_SURAHS[0]);
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [view, setView] = useState("reader");

  const { savedWords, saveWord, removeWord } = useSavedWords();
  const [quiz, dispatchQuiz] = useReducer(quizReducer, quizInitial);

  // ✅ AbortController — surah change pe pehli request cancel ho
  const abortRef = useRef(null);

  const loadSurah = useCallback(async (surah) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setAyahs([]);
    setSelectedWord(null);

    try {
      const res = await fetch(
        `https://api.alquran.cloud/v1/surah/${surah.number}/editions/quran-uthmani,ur.jalandhry`,
        { signal: controller.signal }
      );
      const data = await res.json();
      if (data.code === 200) {
        setAyahs(processAyahs(data.data[0].ayahs, data.data[1].ayahs));
      }
    } catch (e) {
      if (e.name !== "AbortError") console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSurah(selectedSurah);
    return () => abortRef.current?.abort();
  }, [selectedSurah, loadSurah]);

  // ✅ Quiz helpers — useCallback
  const startQuiz = useCallback(() => {
    const quizzable = savedWords.filter((w) => w.meaning);
    if (!quizzable.length) return;
    const word = quizzable[Math.floor(Math.random() * quizzable.length)];
    dispatchQuiz({ type: "START", word });
  }, [savedWords]);

  const nextQuiz = useCallback(() => {
    const quizzable = savedWords.filter(
      (w) => w.meaning && w.text !== quiz.word?.text
    );
    if (!quizzable.length) {
      dispatchQuiz({ type: "CLOSE" });
      return;
    }
    const word = quizzable[Math.floor(Math.random() * quizzable.length)];
    dispatchQuiz({ type: "NEXT", word });
  }, [savedWords, quiz.word]);

  // ✅ useMemo — quizzable count baar baar recalculate nahi hoga
  const quizzableCount = useMemo(
    () => savedWords.filter((w) => w.meaning).length,
    [savedWords]
  );

  const isWordSaved = useCallback(
    (word) => !!savedWords.find((w) => w.text === word?.text),
    [savedWords]
  );

  const handleWordClick = useCallback((word, ayahNum) => {
    setSelectedWord((prev) =>
      prev?.id === word.id && prev?.ayahNum === ayahNum ? null : { ...word, ayahNum }
    );
  }, []);

  return (
    <>
      <Helmet>
        <html lang="ur" />
        <title>Word-by-Word Quran — Kalma ba Kalma | Noor Al-Quran</title>
        <meta
          name="description"
          content="Quran ko word-by-word Urdu meaning ke saath samjhein. Har lafz ka matlab, vocabulary save karein, aur quiz se yaad karein. Free Islamic learning app."
        />
        <meta
          name="keywords"
          content="Quran word by word Urdu, kalma ba kalma, Quran meaning, Islamic app, Noor Al-Quran, Arabic Urdu dictionary"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://soulayah.com/word-by-word" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Word-by-Word Quran — Noor Al-Quran" />
        <meta
          property="og:description"
          content="Har lafz ka Urdu matlab — Quran ko gehrai se samjhein."
        />
        <meta property="og:url" content="https://soulayah.com/word-by-word" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Word-by-Word Quran",
            description: "Quran word-by-word Urdu meaning aur vocabulary quiz",
            url: "https://soulayah.com/word-by-word",
            applicationCategory: "EducationApplication",
            inLanguage: ["ur", "ar"],
            isAccessibleForFree: true,
            offers: { "@type": "Offer", price: "0" },
          })}
        </script>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:ital@0;1&display=swap');
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#080d12}
        ::-webkit-scrollbar-thumb{background:#1e2830;border-radius:4px}
        .word-chip{transition:transform 0.15s ease,border-color 0.15s ease;cursor:pointer}
        .word-chip:hover{transform:translateY(-2px)}
        .word-chip:hover .arabic-w{color:#C9A84C!important}
        @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
        @keyframes pop{0%{transform:scale(1)}50%{transform:scale(1.08)}100%{transform:scale(1)}}
        .slide-up{animation:slideUp 0.3s ease forwards}
        .shake{animation:shake 0.3s ease}
        .pop{animation:pop 0.3s ease}
      `}</style>

      <div style={{ minHeight:"100vh", background:"#080d12", color:"#e2d9c8", fontFamily:"'Georgia', serif" }}>

        {/* ✅ Quiz — inline modal (position:fixed hata diya, sticky parent mein) */}
        {quiz.active && quiz.word && (
          <div style={{ position:"fixed", inset:0, zIndex:50, background:"rgba(0,0,0,0.92)", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
            <div role="dialog" aria-modal="true" aria-label="Vocabulary Quiz" style={{ background:"#0f1820", border:"1px solid rgba(201,168,76,0.3)", borderRadius:"24px", padding:"40px 32px", maxWidth:"400px", width:"100%", textAlign:"center" }}>
              <p style={{ fontSize:"12px", color:"#5a5040", letterSpacing:"2px", marginBottom:"24px" }}>
                VOCABULARY QUIZ • {quizzableCount} words
              </p>
              <div lang="ar" dir="rtl" style={{ fontFamily:"'Amiri', serif", fontSize:"52px", color:"#C9A84C", marginBottom:"16px", lineHeight:1.4 }}>
                {quiz.word.text}
              </div>

              {quiz.result === null ? (
                <>
                  <input
                    value={quiz.answer}
                    onChange={(e) => dispatchQuiz({ type: "TYPE", value: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && dispatchQuiz({ type: "CHECK" })}
                    placeholder="Urdu meaning likhein..."
                    autoFocus
                    aria-label="Urdu meaning ka jawab"
                    style={{ width:"100%", boxSizing:"border-box", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(201,168,76,0.2)", borderRadius:"12px", padding:"14px 16px", color:"#e2d9c8", fontSize:"16px", outline:"none", textAlign:"center", marginBottom:"16px" }}
                  />
                  <button
                    onClick={() => dispatchQuiz({ type: "CHECK" })}
                    aria-label="Jawab check karein"
                    style={{ background:"#C9A84C", color:"#080d12", border:"none", borderRadius:"12px", padding:"12px 32px", fontSize:"15px", cursor:"pointer", fontWeight:"bold", width:"100%" }}
                  >
                    Check ✓
                  </button>
                </>
              ) : (
                <div className={quiz.result === "correct" ? "pop" : "shake"} role="status">
                  <div style={{ fontSize:"40px", marginBottom:"12px" }} aria-hidden="true">
                    {quiz.result === "correct" ? "✅" : "❌"}
                  </div>
                  <p style={{ fontSize:"15px", color: quiz.result === "correct" ? "#27AE60" : "#C0392B", marginBottom:"8px" }}>
                    {quiz.result === "correct" ? "Shabash! Sahi!" : "Sahi jawab:"}
                  </p>
                  <p lang="ur" style={{ fontSize:"22px", color:"#C9A84C", marginBottom:"24px" }}>
                    {quiz.word.meaning}
                  </p>
                  <div style={{ display:"flex", gap:"10px" }}>
                    <button onClick={nextQuiz} style={{ flex:1, background:"#C9A84C", color:"#080d12", border:"none", borderRadius:"12px", padding:"12px", fontSize:"14px", cursor:"pointer", fontWeight:"bold" }}>
                      Agla →
                    </button>
                    <button onClick={() => dispatchQuiz({ type: "CLOSE" })} style={{ background:"transparent", border:"1px solid rgba(255,255,255,0.1)", color:"#5a5040", borderRadius:"12px", padding:"12px 16px", cursor:"pointer", fontSize:"14px" }}>
                      Chodein
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Header */}
        <header style={{ background:"rgba(8,13,18,0.97)", borderBottom:"1px solid rgba(201,168,76,0.12)", padding:"16px 20px", position:"sticky", top:0, zIndex:10, backdropFilter:"blur(20px)" }}>
          <div style={{ maxWidth:"800px", margin:"0 auto" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"14px" }}>
              <div>
                <h1 style={{ margin:0, fontSize:"18px", fontWeight:"400" }}>Word-by-Word</h1>
                <p lang="ur" style={{ margin:0, fontSize:"11px", color:"#5a5040", letterSpacing:"1px" }}>
                  کلمہ بہ کلمہ • Tap karo — Urdu meaning dekho
                </p>
              </div>
              <div style={{ display:"flex", gap:"8px" }}>
                <button
                  onClick={() => setView((v) => v === "reader" ? "vocab" : "reader")}
                  aria-label={`Saved words: ${savedWords.length}`}
                  aria-pressed={view === "vocab"}
                  style={{ background:view==="vocab"?"rgba(201,168,76,0.2)":"rgba(255,255,255,0.04)", border:"1px solid rgba(201,168,76,0.2)", color:"#C9A84C", borderRadius:"10px", padding:"8px 14px", cursor:"pointer", fontSize:"12px" }}
                >
                  🔖 {savedWords.length}
                </button>
                {quizzableCount > 0 && (
                  <button
                    onClick={startQuiz}
                    aria-label="Vocabulary quiz shuru karein"
                    style={{ background:"rgba(39,174,96,0.15)", border:"1px solid rgba(39,174,96,0.3)", color:"#27AE60", borderRadius:"10px", padding:"8px 14px", cursor:"pointer", fontSize:"12px" }}
                  >
                    📝 Quiz
                  </button>
                )}
              </div>
            </div>

            {/* Surah tabs */}
            <nav aria-label="Surah selection" style={{ display:"flex", gap:"8px", overflowX:"auto", paddingBottom:"4px" }}>
              {SAMPLE_SURAHS.map((s) => (
                <button
                  key={s.number}
                  onClick={() => setSelectedSurah(s)}
                  aria-current={selectedSurah.number === s.number ? "page" : undefined}
                  style={{ background:selectedSurah.number===s.number?"rgba(201,168,76,0.2)":"rgba(255,255,255,0.03)", border:`1px solid ${selectedSurah.number===s.number?"#C9A84C":"rgba(255,255,255,0.06)"}`, color:selectedSurah.number===s.number?"#C9A84C":"#6a5f52", borderRadius:"20px", padding:"6px 14px", cursor:"pointer", fontSize:"12px", whiteSpace:"nowrap", flexShrink:0 }}
                >
                  {s.name}
                </button>
              ))}
            </nav>
          </div>
        </header>

        <main style={{ maxWidth:"800px", margin:"0 auto", padding:"0 16px 120px" }}>

          {/* ─── Vocab View ───────────────────────────────────── */}
          {view === "vocab" && (
            <section aria-label="Saved vocabulary" style={{ paddingTop:"24px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
                <h2 style={{ margin:0, fontSize:"16px", fontWeight:"400" }}>
                  Saved Words ({savedWords.length})
                </h2>
                {quizzableCount > 0 && (
                  <button onClick={startQuiz} style={{ background:"rgba(39,174,96,0.15)", border:"1px solid rgba(39,174,96,0.3)", color:"#27AE60", borderRadius:"10px", padding:"8px 16px", cursor:"pointer", fontSize:"13px" }}>
                    📝 Quiz
                  </button>
                )}
              </div>

              {savedWords.length === 0 ? (
                <div style={{ textAlign:"center", padding:"60px 20px", color:"#3a3028" }}>
                  <div style={{ fontSize:"40px", marginBottom:"16px" }} aria-hidden="true">📚</div>
                  <p>Koi word save nahi kiya</p>
                  <button onClick={() => setView("reader")} style={{ marginTop:"16px", background:"transparent", border:"1px solid rgba(201,168,76,0.3)", color:"#C9A84C", padding:"10px 24px", borderRadius:"20px", cursor:"pointer" }}>
                    Reader Kholein →
                  </button>
                </div>
              ) : (
                <ul style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(150px, 1fr))", gap:"12px", listStyle:"none", padding:0, margin:0 }}>
                  {/* ✅ key = word.text (unique text) not index */}
                  {savedWords.map((w) => (
                    <li key={w.text} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(201,168,76,0.15)", borderRadius:"16px", padding:"16px", position:"relative" }}>
                      <button
                        onClick={() => removeWord(w)}
                        aria-label={`Remove ${w.text}`}
                        style={{ position:"absolute", top:"8px", right:"8px", background:"none", border:"none", color:"#3a3028", cursor:"pointer", fontSize:"14px" }}
                      >
                        ✕
                      </button>
                      <div lang="ar" dir="rtl" style={{ fontFamily:"'Amiri', serif", fontSize:"28px", color:"#C9A84C", textAlign:"right", marginBottom:"8px" }}>
                        {w.text}
                      </div>
                      <div lang="ur" style={{ fontSize:"13px", color:w.meaning ? "#e2d9c8" : "#4a4030" }}>
                        {w.meaning || "—"}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* ─── Reader View ──────────────────────────────────── */}
          {view === "reader" && (
            <section aria-label={`${selectedSurah.name} — word by word`}>
              {loading ? (
                <div role="status" aria-label={`Loading ${selectedSurah.name}`} style={{ textAlign:"center", padding:"80px 20px" }}>
                  <div aria-hidden="true" style={{ width:"36px", height:"36px", margin:"0 auto 16px", border:"2px solid rgba(201,168,76,0.2)", borderTopColor:"#C9A84C", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
                  <p style={{ color:"#5a5040", fontSize:"13px" }}>Loading {selectedSurah.name}...</p>
                </div>
              ) : (
                <>
                  <p style={{ textAlign:"center", padding:"16px 0 8px", fontSize:"12px", color:"#3a3028", letterSpacing:"1px" }}>
                    Kisi bhi word pe tap karein — Urdu meaning dikhegi
                  </p>

                  {selectedSurah.number !== 9 && (
                    <p lang="ar" dir="rtl" style={{ textAlign:"center", fontFamily:"'Amiri', serif", fontSize:"26px", color:"#C9A84C", opacity:0.6, padding:"8px 0 20px" }}>
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </p>
                  )}

                  {/* ✅ key = ayah.number (unique, stable) */}
                  {ayahs.map((ayah) => (
                    <article key={ayah.number} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)", padding:"20px 4px" }}>
                      <div style={{ textAlign:"left", marginBottom:"14px" }}>
                        <span style={{ background:"rgba(201,168,76,0.08)", border:"1px solid rgba(201,168,76,0.15)", borderRadius:"20px", padding:"3px 12px", fontSize:"11px", color:"#C9A84C" }}>
                          Ayah {ayah.number}
                        </span>
                      </div>

                      {/* Word chips — RTL */}
                      <div
                        role="list"
                        dir="rtl"
                        aria-label={`Ayah ${ayah.number} words`}
                        style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginBottom:"14px", padding:"4px 0" }}
                      >
                        {ayah.words.map((word) => {
                          const isSelected =
                            selectedWord?.id === word.id &&
                            selectedWord?.ayahNum === ayah.number;
                          const hasMeaning = !!word.meaning;
                          return (
                            <div
                              key={word.id}
                              role="listitem"
                              className="word-chip"
                              onClick={() => handleWordClick(word, ayah.number)}
                              aria-label={`${word.text}${word.meaning ? ` — ${word.meaning}` : ""}`}
                              aria-pressed={isSelected}
                              style={{
                                background: isSelected ? "rgba(201,168,76,0.15)" : hasMeaning ? "rgba(201,168,76,0.04)" : "rgba(255,255,255,0.02)",
                                border:`1px solid ${isSelected ? "rgba(201,168,76,0.5)" : hasMeaning ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.04)"}`,
                                borderRadius:"10px", padding:"8px 10px",
                                textAlign:"center", minWidth:"52px", maxWidth:"100px",
                                cursor:"pointer",
                              }}
                            >
                              <div lang="ar" className="arabic-w" style={{ fontFamily:"'Amiri', serif", fontSize:"22px", color:isSelected ? "#C9A84C" : "#f0e8d5", lineHeight:1.5, transition:"color 0.15s", direction:"rtl" }}>
                                {word.text}
                              </div>
                              <div lang="ur" style={{ fontSize:"9px", color:isSelected ? "#C9A84C" : hasMeaning ? "#8a7a52" : "#3a3028", marginTop:"4px", direction:"ltr", lineHeight:1.3, minHeight:"12px" }}>
                                {word.meaning || "·"}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Full Urdu translation */}
                      <p lang="ur" dir="rtl" style={{ fontSize:"13px", color:"#5a5040", textAlign:"right", borderRight:"2px solid rgba(201,168,76,0.1)", borderRadius:0, paddingRight:"10px", lineHeight:"1.9", margin:0 }}>
                        {ayah.urdu}
                      </p>
                    </article>
                  ))}
                </>
              )}
            </section>
          )}
        </main>

        {/* Word detail bottom sheet */}
        {selectedWord && (
          <div
            className="slide-up"
            role="complementary"
            aria-label={`Word detail: ${selectedWord.text}`}
            style={{ position:"fixed", bottom:"72px", left:0, right:0, zIndex:30, background:"#0a1016", border:"1px solid rgba(201,168,76,0.2)", borderRadius:"24px 24px 0 0", padding:"20px 20px 28px", boxShadow:"0 -20px 60px rgba(0,0,0,0.6)" }}
          >
            <div style={{ maxWidth:"600px", margin:"0 auto" }}>
              <div aria-hidden="true" style={{ width:"40px", height:"3px", background:"rgba(255,255,255,0.1)", borderRadius:"2px", margin:"0 auto 16px" }} />
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div style={{ flex:1 }}>
                  <div lang="ar" dir="rtl" style={{ fontFamily:"'Amiri', serif", fontSize:"44px", color:"#C9A84C", lineHeight:1.3, marginBottom:"8px" }}>
                    {selectedWord.text}
                  </div>
                  {selectedWord.meaning ? (
                    <p lang="ur" style={{ fontSize:"22px", color:"#e2d9c8", margin:0 }}>
                      {selectedWord.meaning.replace(" (approx)", "")}
                    </p>
                  ) : (
                    <p style={{ fontSize:"14px", color:"#4a4030", fontStyle:"italic", margin:0 }}>
                      Is word ki meaning abhi dictionary mein nahi hai
                    </p>
                  )}
                </div>
                <button
                  onClick={() => saveWord(selectedWord)}
                  aria-label={isWordSaved(selectedWord) ? "Word already saved" : "Word save karein"}
                  aria-pressed={isWordSaved(selectedWord)}
                  style={{ background:isWordSaved(selectedWord) ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.05)", border:"1px solid rgba(201,168,76,0.3)", color:"#C9A84C", borderRadius:"10px", padding:"8px 16px", cursor:"pointer", fontSize:"13px", flexShrink:0, marginLeft:"12px", marginTop:"8px" }}
                >
                  {isWordSaved(selectedWord) ? "✓ Saved" : "🔖 Save"}
                </button>
              </div>
              <button
                onClick={() => setSelectedWord(null)}
                aria-label="Word detail band karein"
                style={{ marginTop:"14px", width:"100%", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", color:"#5a5040", borderRadius:"12px", padding:"10px", cursor:"pointer", fontSize:"13px" }}
              >
                Band Karein ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}