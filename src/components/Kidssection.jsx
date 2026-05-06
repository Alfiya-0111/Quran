import { useState } from "react";

// ── Palette ──────────────────────────────────────────────────────────
const C = {
  bg: "#0f1923",
  card: "#1a2535",
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
};

// ── Data ─────────────────────────────────────────────────────────────

const ARABIC_LETTERS = [
  { letter: "ا", name: "Alif", sound: "A", color: C.green, emoji: "🍎" },
  { letter: "ب", name: "Ba", sound: "B", color: C.blue, emoji: "🦋" },
  { letter: "ت", name: "Ta", sound: "T", color: C.pink, emoji: "🌷" },
  { letter: "ث", name: "Tha", sound: "Th", color: C.yellow, emoji: "🌟" },
  { letter: "ج", name: "Jeem", sound: "J", color: C.orange, emoji: "🌈" },
  { letter: "ح", name: "Ha", sound: "H", color: C.teal, emoji: "🌺" },
  { letter: "خ", name: "Kha", sound: "Kh", color: C.purple, emoji: "🦁" },
  { letter: "د", name: "Dal", sound: "D", color: C.red, emoji: "🐬" },
  { letter: "ذ", name: "Dhal", sound: "Dh", color: C.green, emoji: "🦊" },
  { letter: "ر", name: "Ra", sound: "R", color: C.blue, emoji: "🌹" },
  { letter: "ز", name: "Zay", sound: "Z", color: C.pink, emoji: "⚡" },
  { letter: "س", name: "Seen", sound: "S", color: C.yellow, emoji: "⭐" },
  { letter: "ش", name: "Sheen", sound: "Sh", color: C.orange, emoji: "🌞" },
  { letter: "ص", name: "Sad", sound: "S", color: C.teal, emoji: "🐠" },
  { letter: "ض", name: "Dad", sound: "D", color: C.purple, emoji: "🦄" },
  { letter: "ط", name: "Ta", sound: "T", color: C.red, emoji: "🐯" },
  { letter: "ظ", name: "Dha", sound: "Dh", color: C.green, emoji: "🦋" },
  { letter: "ع", name: "Ain", sound: "A'", color: C.blue, emoji: "👁️" },
  { letter: "غ", name: "Ghain", sound: "Gh", color: C.pink, emoji: "🌙" },
  { letter: "ف", name: "Fa", sound: "F", color: C.yellow, emoji: "🦚" },
  { letter: "ق", name: "Qaf", sound: "Q", color: C.orange, emoji: "🌴" },
  { letter: "ك", name: "Kaf", sound: "K", color: C.teal, emoji: "🎋" },
  { letter: "ل", name: "Lam", sound: "L", color: C.purple, emoji: "🍋" },
  { letter: "م", name: "Meem", sound: "M", color: C.red, emoji: "🌊" },
  { letter: "ن", name: "Noon", sound: "N", color: C.green, emoji: "⭐" },
  { letter: "ه", name: "Ha", sound: "H", color: C.blue, emoji: "🌿" },
  { letter: "و", name: "Waw", sound: "W", color: C.pink, emoji: "🌸" },
  { letter: "ي", name: "Ya", sound: "Y", color: C.yellow, emoji: "🌻" },
];

const SHORT_SURAHS = [
  {
    num: 114, name: "An-Nas", arabic: "سُورَةُ النَّاس", meaning: "Insaan",
    ayahs: 6, emoji: "👥", color: C.blue,
    verses: [
      { ar: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", ur: "Kaho: Mein panaah maangta hoon insaanon ke Rabb ki" },
      { ar: "مَلِكِ النَّاسِ", ur: "Insaanon ke Badshah ki" },
      { ar: "إِلَٰهِ النَّاسِ", ur: "Insaanon ke Ilaah ki" },
      { ar: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", ur: "Waswase dene wale chhupaane wale ke shar se" },
      { ar: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", ur: "Jo insaanon ke seenon mein waswase daalta hai" },
      { ar: "مِنَ الْجِنَّةِ وَالنَّاسِ", ur: "Jinnat mein se bhi aur insaanon mein se bhi" },
    ]
  },
  {
    num: 113, name: "Al-Falaq", arabic: "سُورَةُ الْفَلَق", meaning: "Subah ka Noor",
    ayahs: 5, emoji: "🌅", color: C.orange,
    verses: [
      { ar: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", ur: "Kaho: Mein panaah maangta hoon subah ke Rabb ki" },
      { ar: "مِن شَرِّ مَا خَلَقَ", ur: "Har cheez ke shar se jo usne banayi" },
      { ar: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", ur: "Aur andheri raat ke shar se jab chhaa jaaye" },
      { ar: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", ur: "Aur gaanth mein phoonk maarne waalon ke shar se" },
      { ar: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", ur: "Aur haasid ke shar se jab hasad kare" },
    ]
  },
  {
    num: 112, name: "Al-Ikhlas", arabic: "سُورَةُ الْإِخْلَاص", meaning: "Ek hai Allah",
    ayahs: 4, emoji: "☝️", color: C.yellow,
    verses: [
      { ar: "قُلْ هُوَ اللَّهُ أَحَدٌ", ur: "Kaho: Woh Allah ek hai" },
      { ar: "اللَّهُ الصَّمَدُ", ur: "Allah bebnyaaz hai" },
      { ar: "لَمْ يَلِدْ وَلَمْ يُولَدْ", ur: "Na uski koi aulaad hai na woh kisi ka bacha" },
      { ar: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", ur: "Aur koi uske barabar nahi" },
    ]
  },
  {
    num: 111, name: "Al-Masad", arabic: "سُورَةُ الْمَسَد", meaning: "Buri Niyyat Ka Anjam",
    ayahs: 5, emoji: "🔥", color: C.red,
    verses: [
      { ar: "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ", ur: "Abu Lahab ke haath tabah ho gaye aur woh tabah ho gaya" },
      { ar: "مَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ", ur: "Uske maal ne aur jo usne kamaya kuch kaam na aaya" },
      { ar: "سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ", ur: "Woh bhaDakti aag mein daakhil hoga" },
      { ar: "وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ", ur: "Aur uski biwi bhi — lakDiyan uthane waali" },
      { ar: "فِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ", ur: "Uske gale mein moondh ki rassi hogi" },
    ]
  },
  {
    num: 110, name: "An-Nasr", arabic: "سُورَةُ النَّصْر", meaning: "Allah Ki Madad",
    ayahs: 3, emoji: "🏆", color: C.green,
    verses: [
      { ar: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ", ur: "Jab Allah ki madad aa jaaye aur Fatah mil jaaye" },
      { ar: "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا", ur: "Aur log Allah ke deen mein jhund ke jhund daaKhil hon" },
      { ar: "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا", ur: "Toh apne Rabb ki tasbeh aur hamd karo aur maafi maango — woh toubah qubool karta hai" },
    ]
  },
  {
    num: 108, name: "Al-Kawthar", arabic: "سُورَةُ الْكَوْثَر", meaning: "Bahut Zyada Bhalaai",
    ayahs: 3, emoji: "🌊", color: C.teal,
    verses: [
      { ar: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", ur: "Hum ne tumhe Kawthar (bahut bhalaayi) di" },
      { ar: "فَصَلِّ لِرَبِّكَ وَانْحَرْ", ur: "Pas apne Rabb ke liye namaaz padho aur qurbani karo" },
      { ar: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ", ur: "Beshak tumhara dushman hi bepanaah hai" },
    ]
  },
];

const PROPHETS = [
  { name: "Adam AS", arabic: "آدم", emoji: "🌱", story: "Allah ne Hazrat Adam AS ko apne haath se mitti se banaya. Woh pehle insaan the. Jannat mein rehte the. Phir zameen par aaye aur toubah ki — Allah ne maaf kar diya.", color: C.green, fact: "Quran mein 25 baar unka zikr hai" },
  { name: "Nooh AS", arabic: "نوح", emoji: "🚢", story: "Hazrat Nooh AS ne 950 saal apni qoum ko samjhaya. Koi nahi maana toh Allah ne tofan bheja. Unhon ne kashti banayi — iman wale bache, zalimon ka wajood khatam hua.", color: C.blue, fact: "950 saal tak tabligh ki" },
  { name: "Ibrahim AS", arabic: "إبراهيم", emoji: "🔥", story: "Hazrat Ibrahim AS ne but todey. Zaalim badshah Namrud ne unhe aag mein daala. Magar Allah ne aag ko hukm diya — 'Ibrahim ke liye thandi aur salamat ho ja!' Aag gulzaar ban gayi.", color: C.orange, fact: "Khalilullah — Allah ke dost" },
  { name: "Yusuf AS", arabic: "يوسف", emoji: "👑", story: "Hazrat Yusuf AS ke bhai ne unhe kuwen mein daala. Phir Misr mein ghulaam bane. Qaidi bane. Magar Allah ne unhe Misr ka Wazir-e-Aazam bana diya. Sabar ka ek mast nateeja!", color: C.yellow, fact: "Sabse khoobsurat kahani — poori surah unhi par" },
  { name: "Moosa AS", arabic: "موسى", emoji: "🪄", story: "Hazrat Moosa AS Firown ke ghar mein pale. Allah ne unhe Nabi banaya. Lathhi se daryaa ko do hissa kar diya. Bani Israel ko aazaad karaya Firown ke zulm se.", color: C.teal, fact: "Quran mein sabse zyada naam aata hai" },
  { name: "Isa AS", arabic: "عيسى", emoji: "🕊️", story: "Hazrat Isa AS bina baap ke paida hue — Allah ka mojza. Logon ko ilaj karte, andhe ko aankhein dete, murdon ko zinda karte. Aakhir aasman par utha liye gaye — qayamat se pehle waapis aayenge.", color: C.purple, fact: "Allah ka kalmah — Maryam AS ke bete" },
  { name: "Muhammad ﷺ", arabic: "محمد", emoji: "🌙", story: "Nabi Kareem ﷺ Mecca mein paida hue. Ghaar-e-Hira mein pehli wahi aayi. 23 saal mein Quran mukammal hua. Poori insaaniyat ke liye rehmat bana ke bheje gaye — Rahmatul lil Aalameen!", color: C.yellow, fact: "Aakhri Nabi — Khatamun Nabiyyeen ﷺ" },
];

const DUAS_KIDS = [
  { title: "Khane Se Pehle", arabic: "بِسْمِ اللَّهِ", urdu: "Allah ke naam se", emoji: "🍽️", color: C.orange },
  { title: "Khane Ke Baad", arabic: "الْحَمْدُ لِلَّهِ", urdu: "Tamam taarif Allah ke liye", emoji: "😊", color: C.green },
  { title: "Sone Se Pehle", arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", urdu: "Tere naam se Allah! Marta hoon aur jeeta hoon", emoji: "😴", color: C.blue },
  { title: "Neend Se Uthke", arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا", urdu: "Shukar hai Allah ka jisne hamein zindagi di", emoji: "🌅", color: C.yellow },
  { title: "Ghar Se Nikalte Waqt", arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ", urdu: "Allah ke naam se, Allah par bharosa kiya", emoji: "🚪", color: C.pink },
  { title: "Aaine Mein Dekh Ke", arabic: "اللَّهُمَّ أَنْتَ حَسَّنْتَ خَلْقِي", urdu: "Aye Allah! Tune meri soorat achhi banayi", emoji: "🪞", color: C.teal },
];

// ── Sub-views ─────────────────────────────────────────────────────────

function HuroofView() {
  const [selected, setSelected] = useState(null);
  const [learned, setLearned] = useState(() => {
    try { return JSON.parse(localStorage.getItem("kids_huroof") || "[]"); } catch { return []; }
  });

  const toggleLearned = (name) => {
    const updated = learned.includes(name) ? learned.filter(n => n !== name) : [...learned, name];
    setLearned(updated);
    localStorage.setItem("kids_huroof", JSON.stringify(updated));
  };

  return (
    <div>
      {/* Progress */}
      <div style={{ background: C.card, borderRadius: "16px", padding: "16px", marginBottom: "16px", border: "1px solid #2a3a4a" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ color: C.text, fontSize: "13px" }}>Progress</span>
          <span style={{ color: C.yellow, fontSize: "13px", fontWeight: "bold" }}>{learned.length}/28</span>
        </div>
        <div style={{ background: "#0f1923", borderRadius: "8px", height: "10px", overflow: "hidden" }}>
          <div style={{ background: `linear-gradient(90deg, ${C.yellow}, ${C.orange})`, height: "100%", width: `${(learned.length / 28) * 100}%`, borderRadius: "8px", transition: "width 0.5s" }} />
        </div>
      </div>

      {selected ? (
        <div style={{ textAlign: "center" }}>
          <button onClick={() => setSelected(null)} style={{ background: "transparent", border: `1px solid #2a3a4a`, color: C.dim, borderRadius: "10px", padding: "8px 14px", cursor: "pointer", fontSize: "13px", marginBottom: "16px" }}>← Wapas</button>
          <div style={{ background: C.card, borderRadius: "24px", padding: "40px 24px", border: `2px solid ${selected.color}` }}>
            <div style={{ fontSize: "60px", marginBottom: "8px" }}>{selected.emoji}</div>
            <div style={{ fontSize: "80px", color: selected.color, fontFamily: "serif", marginBottom: "12px" }}>{selected.letter}</div>
            <div style={{ fontSize: "28px", color: C.text, fontWeight: "bold", marginBottom: "4px" }}>{selected.name}</div>
            <div style={{ fontSize: "18px", color: C.dim, marginBottom: "24px" }}>Sound: "{selected.sound}"</div>
            <button
              onClick={() => { toggleLearned(selected.name); }}
              style={{ padding: "14px 32px", borderRadius: "20px", border: "none", background: learned.includes(selected.name) ? C.green : selected.color, color: "#0f1923", fontSize: "16px", fontWeight: "800", cursor: "pointer" }}
            >{learned.includes(selected.name) ? "✓ Seekh Liya!" : "Seekh Liya! ⭐"}</button>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
          {ARABIC_LETTERS.map((l, i) => (
            <div
              key={l.name}
              onClick={() => setSelected(l)}
              style={{
                background: C.card, borderRadius: "14px", padding: "14px 8px",
                textAlign: "center", cursor: "pointer", border: `2px solid ${learned.includes(l.name) ? l.color : "#2a3a4a"}`,
                position: "relative", animation: `popIn 0.3s ease ${i * 0.02}s both`
              }}
            >
              {learned.includes(l.name) && <div style={{ position: "absolute", top: "4px", right: "6px", fontSize: "10px", color: C.green }}>✓</div>}
              <div style={{ fontSize: "28px", color: l.color, fontFamily: "serif" }}>{l.letter}</div>
              <div style={{ fontSize: "10px", color: C.dim, marginTop: "4px" }}>{l.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SurahsView() {
  const [selected, setSelected] = useState(null);

  if (selected) {
    return (
      <div>
        <button onClick={() => setSelected(null)} style={{ background: "transparent", border: `1px solid #2a3a4a`, color: C.dim, borderRadius: "10px", padding: "8px 14px", cursor: "pointer", fontSize: "13px", marginBottom: "16px" }}>← Wapas</button>
        <div style={{ background: C.card, borderRadius: "20px", padding: "24px", border: `1px solid ${selected.color}` }}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div style={{ fontSize: "36px" }}>{selected.emoji}</div>
            <div style={{ color: selected.color, fontSize: "22px", fontFamily: "serif", fontWeight: "bold" }}>{selected.name}</div>
            <div style={{ color: C.text, fontSize: "26px", direction: "rtl", fontFamily: "serif", marginTop: "8px" }}>{selected.arabic}</div>
            <div style={{ color: C.dim, fontSize: "13px", marginTop: "4px" }}>Matlab: {selected.meaning} • {selected.ayahs} Aayaat</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {selected.verses.map((v, i) => (
              <div key={i} style={{ background: "#0f1923", borderRadius: "14px", padding: "16px", borderLeft: `3px solid ${selected.color}` }}>
                <div style={{ color: selected.color, fontSize: "20px", direction: "rtl", fontFamily: "serif", textAlign: "right", marginBottom: "8px", lineHeight: 1.8 }}>{v.ar}</div>
                <div style={{ color: C.dim, fontSize: "13px" }}>{v.ur}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {SHORT_SURAHS.map((s, i) => (
        <div
          key={s.num}
          onClick={() => setSelected(s)}
          style={{ background: C.card, borderRadius: "16px", padding: "18px", cursor: "pointer", border: `1px solid #2a3a4a`, display: "flex", alignItems: "center", gap: "16px", animation: `slideIn 0.3s ease ${i * 0.05}s both` }}
        >
          <div style={{ fontSize: "36px" }}>{s.emoji}</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: s.color, fontSize: "17px", fontWeight: "700" }}>{s.name}</div>
            <div style={{ color: C.text, fontSize: "18px", fontFamily: "serif", direction: "rtl" }}>{s.arabic}</div>
            <div style={{ color: C.dim, fontSize: "12px", marginTop: "2px" }}>{s.meaning} • {s.ayahs} aayaat</div>
          </div>
          <div style={{ color: s.color, fontSize: "18px" }}>›</div>
        </div>
      ))}
    </div>
  );
}

function ProphetsView() {
  const [selected, setSelected] = useState(null);

  if (selected) {
    return (
      <div>
        <button onClick={() => setSelected(null)} style={{ background: "transparent", border: `1px solid #2a3a4a`, color: C.dim, borderRadius: "10px", padding: "8px 14px", cursor: "pointer", fontSize: "13px", marginBottom: "16px" }}>← Wapas</button>
        <div style={{ background: C.card, borderRadius: "24px", padding: "28px", border: `2px solid ${selected.color}` }}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div style={{ fontSize: "60px", marginBottom: "8px" }}>{selected.emoji}</div>
            <div style={{ color: selected.color, fontSize: "26px", fontWeight: "800" }}>{selected.name}</div>
            <div style={{ color: C.text, fontSize: "24px", fontFamily: "serif", direction: "rtl", marginTop: "4px" }}>{selected.arabic}</div>
          </div>
          <div style={{ background: "#0f1923", borderRadius: "16px", padding: "20px", marginBottom: "16px" }}>
            <div style={{ color: C.yellow, fontSize: "12px", letterSpacing: "1px", marginBottom: "10px" }}>📖 KAHANI</div>
            <div style={{ color: C.text, fontSize: "15px", lineHeight: "1.8" }}>{selected.story}</div>
          </div>
          <div style={{ background: `${selected.color}22`, border: `1px solid ${selected.color}`, borderRadius: "12px", padding: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }}>⭐</span>
            <span style={{ color: selected.color, fontSize: "13px", fontWeight: "600" }}>{selected.fact}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
      {PROPHETS.map((p, i) => (
        <div
          key={p.name}
          onClick={() => setSelected(p)}
          style={{ background: C.card, borderRadius: "18px", padding: "20px", cursor: "pointer", textAlign: "center", border: `1px solid #2a3a4a`, animation: `popIn 0.3s ease ${i * 0.05}s both` }}
        >
          <div style={{ fontSize: "40px", marginBottom: "8px" }}>{p.emoji}</div>
          <div style={{ color: p.color, fontSize: "14px", fontWeight: "700" }}>{p.name}</div>
          <div style={{ color: C.text, fontSize: "18px", fontFamily: "serif", direction: "rtl", marginTop: "4px" }}>{p.arabic}</div>
        </div>
      ))}
    </div>
  );
}

function DuasView() {
  const [flipped, setFlipped] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {DUAS_KIDS.map((d, i) => (
        <div
          key={d.title}
          onClick={() => setFlipped(flipped === i ? null : i)}
          style={{ background: C.card, borderRadius: "16px", padding: "18px", cursor: "pointer", border: `1px solid ${flipped === i ? d.color : "#2a3a4a"}`, transition: "border 0.2s", animation: `slideIn 0.3s ease ${i * 0.05}s both` }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ fontSize: "28px" }}>{d.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: d.color, fontSize: "15px", fontWeight: "700" }}>{d.title}</div>
              {flipped === i && (
                <>
                  <div style={{ color: C.text, fontSize: "20px", fontFamily: "serif", direction: "rtl", textAlign: "right", marginTop: "10px", lineHeight: 1.8 }}>{d.arabic}</div>
                  <div style={{ color: C.dim, fontSize: "13px", marginTop: "6px" }}>{d.urdu}</div>
                </>
              )}
            </div>
            <div style={{ color: d.color, fontSize: "20px" }}>{flipped === i ? "▲" : "▼"}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────
export default function KidsSection() {
  const [tab, setTab] = useState("huroof");

  const tabs = [
    { id: "huroof", label: "Huroof", emoji: "🔤" },
    { id: "surahs", label: "Surahs", emoji: "📖" },
    { id: "prophets", label: "Anbiya", emoji: "⭐" },
    { id: "duas", label: "Duaen", emoji: "🤲" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "system-ui, sans-serif", paddingBottom: "80px" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a2535, #0f1923)", borderBottom: "1px solid #2a3a4a", padding: "24px 20px 16px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "6px" }}>👶</div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", margin: "0 0 4px", background: `linear-gradient(90deg, ${C.yellow}, ${C.orange})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Kids Corner
          </h1>
          <p style={{ color: C.dim, fontSize: "13px", margin: 0 }}>Islamic seekho — khel khel mein! 🌟</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #2a3a4a", background: "#111827" }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1, padding: "14px 4px", border: "none", background: "transparent",
              cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
              borderBottom: tab === t.id ? `3px solid ${C.yellow}` : "3px solid transparent",
            }}
          >
            <span style={{ fontSize: "20px" }}>{t.emoji}</span>
            <span style={{ fontSize: "10px", color: tab === t.id ? C.yellow : C.dim, fontWeight: tab === t.id ? "700" : "400" }}>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "20px", maxWidth: "480px", margin: "0 auto" }}>
        {tab === "huroof" && <HuroofView />}
        {tab === "surahs" && <SurahsView />}
        {tab === "prophets" && <ProphetsView />}
        {tab === "duas" && <DuasView />}
      </div>

      <style>{`
        @keyframes popIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
}