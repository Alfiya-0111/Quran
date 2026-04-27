import { useState, useEffect } from "react";

const SAMPLE_SURAHS = [
  { number: 1, name: "Al-Fatihah", arabic: "الفاتحة", ayahs: 7 },
  { number: 112, name: "Al-Ikhlas", arabic: "الإخلاص", ayahs: 4 },
  { number: 113, name: "Al-Falaq", arabic: "الفلق", ayahs: 5 },
  { number: 114, name: "An-Nas", arabic: "الناس", ayahs: 6 },
  { number: 36, name: "Ya-Sin", arabic: "يس", ayahs: 83 },
  { number: 55, name: "Ar-Rahman", arabic: "الرحمن", ayahs: 78 },
  { number: 67, name: "Al-Mulk", arabic: "الملك", ayahs: 30 },
  { number: 2, name: "Al-Baqarah", arabic: "البقرة", ayahs: 286 },
];

export default function WordByWord() {
  const [selectedSurah, setSelectedSurah] = useState(SAMPLE_SURAHS[0]);
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [savedWords, setSavedWords] = useState(() => {
    try { return JSON.parse(localStorage.getItem("quran_saved_words") || "[]"); }
    catch { return []; }
  });
  const [view, setView] = useState("reader");
  const [quizMode, setQuizMode] = useState(false);
  const [quizWord, setQuizWord] = useState(null);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    localStorage.setItem("quran_saved_words", JSON.stringify(savedWords));
  }, [savedWords]);

  useEffect(() => { loadSurah(selectedSurah); }, [selectedSurah]);

  const loadSurah = async (surah) => {
    setLoading(true);
    setAyahs([]);
    setSelectedWord(null);
    try {
      const res = await fetch(
        `https://api.quran.com/api/v4/verses/by_chapter/${surah.number}?language=ur&words=true&word_fields=text_uthmani,transliteration,translation_text&per_page=286&page=1`,
        { headers: { Accept: "application/json" } }
      );
      const data = await res.json();
      if (data.verses) {
        setAyahs(data.verses.map(v => ({
          number: v.verse_number,
          urdu: v.translations?.[0]?.text?.replace(/<[^>]*>/g, "") || "",
          words: v.words?.filter(w => w.char_type_name !== "end") || [],
        })));
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const saveWord = (word) => {
    if (!word) return;
    if (!savedWords.find(w => w.text_uthmani === word.text_uthmani)) {
      setSavedWords(prev => [...prev, word]);
    }
  };

  const removeWord = (word) => {
    setSavedWords(prev => prev.filter(w => w.text_uthmani !== word.text_uthmani));
  };

  const startQuiz = () => {
    if (savedWords.length === 0) return;
    const random = savedWords[Math.floor(Math.random() * savedWords.length)];
    setQuizWord(random);
    setQuizAnswer("");
    setQuizResult(null);
    setQuizMode(true);
  };

  const checkAnswer = () => {
    if (!quizAnswer.trim()) return;
    const correct = (quizWord.translation_text || "").toLowerCase();
    const ans = quizAnswer.toLowerCase().trim();
    setQuizResult(correct.includes(ans) || ans.includes(correct.split(" ")[0]) ? "correct" : "wrong");
  };

  const nextQuiz = () => {
    const remaining = savedWords.filter(w => w.text_uthmani !== quizWord.text_uthmani);
    if (remaining.length === 0) { setQuizMode(false); return; }
    const random = remaining[Math.floor(Math.random() * remaining.length)];
    setQuizWord(random);
    setQuizAnswer("");
    setQuizResult(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080d12", color: "#e2d9c8", fontFamily: "'Georgia', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:ital@0;1&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080d12; }
        ::-webkit-scrollbar-thumb { background: #1e2830; border-radius: 4px; }
        .word-chip { transition: all 0.15s ease; cursor: pointer; }
        .word-chip:hover { transform: translateY(-2px); }
        .word-chip:hover .arabic-w { color: #C9A84C !important; }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        @keyframes pop { 0%{transform:scale(1)} 50%{transform:scale(1.08)} 100%{transform:scale(1)} }
        .slide-up { animation: slideUp 0.3s ease forwards; }
        .shake { animation: shake 0.3s ease; }
        .pop { animation: pop 0.3s ease; }
      `}</style>

      {/* Quiz Overlay */}
      {quizMode && quizWord && (
        <div style={{ position:"fixed", inset:0, zIndex:50, background:"rgba(0,0,0,0.92)", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
          <div style={{ background:"#0f1820", border:"1px solid rgba(201,168,76,0.3)", borderRadius:"24px", padding:"40px 32px", maxWidth:"400px", width:"100%", textAlign:"center" }}>
            <div style={{ fontSize:"12px", color:"#5a5040", letterSpacing:"2px", marginBottom:"24px" }}>VOCABULARY QUIZ</div>
            <div style={{ fontFamily:"'Amiri', serif", fontSize:"52px", color:"#C9A84C", marginBottom:"8px", lineHeight:1.4 }}>{quizWord.text_uthmani}</div>
            <div style={{ fontSize:"13px", color:"#5a5040", marginBottom:"32px" }}>{quizWord.transliteration}</div>
            {quizResult === null ? (
              <>
                <input value={quizAnswer} onChange={e => setQuizAnswer(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && checkAnswer()}
                  placeholder="Meaning likhein..." autoFocus
                  style={{ width:"100%", boxSizing:"border-box", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(201,168,76,0.2)", borderRadius:"12px", padding:"14px 16px", color:"#e2d9c8", fontSize:"16px", outline:"none", textAlign:"center", marginBottom:"16px" }}
                />
                <button onClick={checkAnswer} style={{ background:"#C9A84C", color:"#080d12", border:"none", borderRadius:"12px", padding:"12px 32px", fontSize:"15px", cursor:"pointer", fontWeight:"bold", width:"100%" }}>Check</button>
              </>
            ) : (
              <div className={quizResult === "correct" ? "pop" : "shake"}>
                <div style={{ fontSize:"40px", marginBottom:"12px" }}>{quizResult === "correct" ? "✅" : "❌"}</div>
                <div style={{ fontSize:"15px", color:quizResult === "correct" ? "#27AE60" : "#C0392B", marginBottom:"8px" }}>
                  {quizResult === "correct" ? "Shabash!" : "Sahi jawab:"}
                </div>
                <div style={{ fontSize:"20px", color:"#C9A84C", marginBottom:"24px" }}>{quizWord.translation_text}</div>
                <div style={{ display:"flex", gap:"10px" }}>
                  <button onClick={nextQuiz} style={{ flex:1, background:"#C9A84C", color:"#080d12", border:"none", borderRadius:"12px", padding:"12px", fontSize:"14px", cursor:"pointer", fontWeight:"bold" }}>Agla →</button>
                  <button onClick={() => setQuizMode(false)} style={{ background:"transparent", border:"1px solid rgba(255,255,255,0.1)", color:"#5a5040", borderRadius:"12px", padding:"12px 16px", cursor:"pointer", fontSize:"14px" }}>Chodein</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background:"rgba(8,13,18,0.97)", borderBottom:"1px solid rgba(201,168,76,0.12)", padding:"16px 20px", position:"sticky", top:0, zIndex:10, backdropFilter:"blur(20px)" }}>
        <div style={{ maxWidth:"800px", margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"14px" }}>
            <div>
              <h1 style={{ margin:0, fontSize:"18px", fontWeight:"400" }}>Word-by-Word</h1>
              <p style={{ margin:0, fontSize:"11px", color:"#5a5040", letterSpacing:"1px" }}>Tap any word — meaning dikhega</p>
            </div>
            <div style={{ display:"flex", gap:"8px" }}>
              <button onClick={() => setView(view === "reader" ? "vocab" : "reader")} style={{ background:view==="vocab"?"rgba(201,168,76,0.2)":"rgba(255,255,255,0.04)", border:"1px solid rgba(201,168,76,0.2)", color:"#C9A84C", borderRadius:"10px", padding:"8px 14px", cursor:"pointer", fontSize:"12px" }}>
                {savedWords.length} Saved
              </button>
              {savedWords.length > 0 && (
                <button onClick={startQuiz} style={{ background:"rgba(39,174,96,0.15)", border:"1px solid rgba(39,174,96,0.3)", color:"#27AE60", borderRadius:"10px", padding:"8px 14px", cursor:"pointer", fontSize:"12px" }}>Quiz</button>
              )}
            </div>
          </div>
          <div style={{ display:"flex", gap:"8px", overflowX:"auto", paddingBottom:"4px" }}>
            {SAMPLE_SURAHS.map(s => (
              <button key={s.number} onClick={() => setSelectedSurah(s)} style={{ background:selectedSurah.number===s.number?"rgba(201,168,76,0.2)":"rgba(255,255,255,0.03)", border:`1px solid ${selectedSurah.number===s.number?"#C9A84C":"rgba(255,255,255,0.06)"}`, color:selectedSurah.number===s.number?"#C9A84C":"#6a5f52", borderRadius:"20px", padding:"6px 14px", cursor:"pointer", fontSize:"12px", whiteSpace:"nowrap", flexShrink:0 }}>
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:"800px", margin:"0 auto", padding:"0 16px 120px" }}>

        {/* Vocab View */}
        {view === "vocab" && (
          <div style={{ paddingTop:"24px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
              <h2 style={{ margin:0, fontSize:"16px", fontWeight:"400" }}>Saved Words</h2>
              {savedWords.length > 0 && (
                <button onClick={startQuiz} style={{ background:"rgba(39,174,96,0.15)", border:"1px solid rgba(39,174,96,0.3)", color:"#27AE60", borderRadius:"10px", padding:"8px 16px", cursor:"pointer", fontSize:"13px" }}>Quiz Shuru Karein</button>
              )}
            </div>
            {savedWords.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 20px", color:"#3a3028" }}>
                <div style={{ fontSize:"40px", marginBottom:"16px" }}>📚</div>
                <p>Koi word save nahi kiya</p>
                <button onClick={() => setView("reader")} style={{ marginTop:"16px", background:"transparent", border:"1px solid rgba(201,168,76,0.3)", color:"#C9A84C", padding:"10px 24px", borderRadius:"20px", cursor:"pointer" }}>Reader Kholein</button>
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px, 1fr))", gap:"12px" }}>
                {savedWords.map((w, i) => (
                  <div key={i} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(201,168,76,0.15)", borderRadius:"16px", padding:"16px", position:"relative" }}>
                    <button onClick={() => removeWord(w)} style={{ position:"absolute", top:"8px", right:"8px", background:"none", border:"none", color:"#3a3028", cursor:"pointer", fontSize:"14px" }}>✕</button>
                    <div style={{ fontFamily:"'Amiri', serif", fontSize:"28px", color:"#C9A84C", textAlign:"right", marginBottom:"8px" }}>{w.text_uthmani}</div>
                    <div style={{ fontSize:"12px", color:"#9a8870", marginBottom:"4px" }}>{w.transliteration}</div>
                    <div style={{ fontSize:"13px", color:"#e2d9c8" }}>{w.translation_text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reader View */}
        {view === "reader" && (
          <>
            {loading ? (
              <div style={{ textAlign:"center", padding:"80px 20px" }}>
                <div style={{ width:"36px", height:"36px", margin:"0 auto 16px", border:"2px solid rgba(201,168,76,0.2)", borderTopColor:"#C9A84C", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
                <p style={{ color:"#5a5040", fontSize:"13px" }}>Loading {selectedSurah.name}...</p>
              </div>
            ) : (
              <>
                <div style={{ textAlign:"center", padding:"16px 0 8px", fontSize:"12px", color:"#3a3028", letterSpacing:"1px" }}>Kisi bhi word pe tap karein</div>
                {selectedSurah.number !== 9 && (
                  <div style={{ textAlign:"center", fontFamily:"'Amiri', serif", fontSize:"26px", color:"#C9A84C", opacity:0.6, padding:"8px 0 20px" }}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
                )}
                {ayahs.map((ayah) => (
                  <div key={ayah.number} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)", padding:"20px 4px" }}>
                    <div style={{ textAlign:"left", marginBottom:"14px" }}>
                      <span style={{ background:"rgba(201,168,76,0.08)", border:"1px solid rgba(201,168,76,0.15)", borderRadius:"20px", padding:"3px 12px", fontSize:"11px", color:"#C9A84C" }}>Ayah {ayah.number}</span>
                    </div>
                    <div style={{ display:"flex", flexWrap:"wrap", flexDirection:"row-reverse", gap:"6px", marginBottom:"14px" }}>
                      {ayah.words.map((word, wi) => {
                        const isSelected = selectedWord?.text_uthmani === word.text_uthmani && selectedWord?.position === word.position && selectedWord?.ayahNum === ayah.number;
                        return (
                          <div key={wi} className="word-chip"
                            onClick={() => setSelectedWord({ ...word, ayahNum: ayah.number })}
                            style={{ background:isSelected?"rgba(201,168,76,0.12)":"rgba(255,255,255,0.02)", border:`1px solid ${isSelected?"rgba(201,168,76,0.35)":"rgba(255,255,255,0.05)"}`, borderRadius:"10px", padding:"8px 10px", textAlign:"center", minWidth:"50px" }}>
                            <div className="arabic-w" style={{ fontFamily:"'Amiri', serif", fontSize:"22px", color:isSelected?"#C9A84C":"#f0e8d5", lineHeight:1.5, transition:"color 0.15s" }}>{word.text_uthmani}</div>
                            <div style={{ fontSize:"9px", color:"#4a4030", marginTop:"3px", direction:"ltr" }}>{word.transliteration}</div>
                            <div style={{ fontSize:"9px", color:"#5a5040", marginTop:"2px", direction:"ltr" }}>{word.translation_text}</div>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ fontSize:"13px", color:"#5a5040", direction:"rtl", textAlign:"right", borderRight:"2px solid rgba(201,168,76,0.1)", paddingRight:"10px", lineHeight:"1.9" }}>{ayah.urdu}</div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>

      {/* Word Detail Sheet */}
      {selectedWord && (
        <div className="slide-up" style={{ position:"fixed", bottom:"72px", left:0, right:0, zIndex:30, background:"linear-gradient(180deg, #0f1820, #0a1016)", border:"1px solid rgba(201,168,76,0.2)", borderRadius:"24px 24px 0 0", padding:"20px 20px 28px", boxShadow:"0 -20px 60px rgba(0,0,0,0.6)" }}>
          <div style={{ maxWidth:"600px", margin:"0 auto" }}>
            <div style={{ width:"40px", height:"3px", background:"rgba(255,255,255,0.1)", borderRadius:"2px", margin:"0 auto 16px" }} />
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Amiri', serif", fontSize:"42px", color:"#C9A84C", lineHeight:1.3, marginBottom:"4px" }}>{selectedWord.text_uthmani}</div>
                <div style={{ fontSize:"13px", color:"#6a5f52", marginBottom:"8px" }}>{selectedWord.transliteration}</div>
                <div style={{ fontSize:"22px", color:"#e2d9c8" }}>{selectedWord.translation_text}</div>
              </div>
              <button onClick={() => saveWord(selectedWord)} style={{ background:savedWords.find(w=>w.text_uthmani===selectedWord.text_uthmani)?"rgba(201,168,76,0.2)":"rgba(255,255,255,0.05)", border:"1px solid rgba(201,168,76,0.3)", color:"#C9A84C", borderRadius:"10px", padding:"8px 16px", cursor:"pointer", fontSize:"13px", flexShrink:0, marginLeft:"12px", marginTop:"8px" }}>
                {savedWords.find(w => w.text_uthmani === selectedWord.text_uthmani) ? "✓ Saved" : "🔖 Save"}
              </button>
            </div>
            <button onClick={() => setSelectedWord(null)} style={{ marginTop:"14px", width:"100%", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", color:"#5a5040", borderRadius:"12px", padding:"10px", cursor:"pointer", fontSize:"13px" }}>Band Karein ✕</button>
          </div>
        </div>
      )}
    </div>
  );
}