import { useState, useCallback, useRef } from "react";

// ── Palette ──────────────────────────────────────────────────────────
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
};

// ── Google TTS — Clear Urdu & Arabic voice ────────────────────────────
const audioRef = { current: null };

function stopAudio() {
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current = null;
  }
}

function playSequenceTTS(items, onDone) {
  stopAudio();
  let idx = 0;

  function playNext() {
    if (idx >= items.length) { onDone?.(); return; }
    const item = items[idx++];
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(item.text)}&tl=${item.lang || "ar"}&client=tw-ob`;
    const audio = new Audio(url);
    audioRef.current = audio;

    audio.play().catch(() => {
      // Fallback: browser TTS
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(item.text);
        utter.lang = (item.lang || "ar") === "ar" ? "ar-SA" : "ur-PK";
        utter.rate = 0.75;
        utter.onend = () => setTimeout(playNext, item.pause || 500);
        window.speechSynthesis.speak(utter);
        return;
      }
      setTimeout(playNext, item.pause || 500);
    });

    audio.onended = () => setTimeout(playNext, item.pause || 500);
  }

  playNext();
}

// ── Data ─────────────────────────────────────────────────────────────
const ARABIC_LETTERS = [
  { letter: "ا", name: "Alif",  sound: "A",  color: C.green,  emoji: "🦁", word: "أَسَد",    meaning: "Sher"    },
  { letter: "ب", name: "Ba",    sound: "B",  color: C.blue,   emoji: "🏠", word: "بَيْت",    meaning: "Ghar"    },
  { letter: "ت", name: "Ta",    sound: "T",  color: C.pink,   emoji: "🍎", word: "تُفَّاح",  meaning: "Seb"     },
  { letter: "ث", name: "Tha",   sound: "Th", color: C.yellow, emoji: "🦊", word: "ثَعْلَب",  meaning: "Lomdi"   },
  { letter: "ج", name: "Jeem",  sound: "J",  color: C.orange, emoji: "🐪", word: "جَمَل",    meaning: "Oont"    },
  { letter: "ح", name: "Ha",    sound: "H",  color: C.teal,   emoji: "🐴", word: "حِصَان",   meaning: "Ghoda"   },
  { letter: "خ", name: "Kha",   sound: "Kh", color: C.purple, emoji: "🍞", word: "خُبْز",    meaning: "Roti"    },
  { letter: "د", name: "Dal",   sound: "D",  color: C.red,    emoji: "🐻", word: "دُبّ",     meaning: "Bhaaloo" },
  { letter: "ذ", name: "Dhal",  sound: "Dh", color: C.green,  emoji: "🪰", word: "ذُبَاب",   meaning: "Makhi"   },
  { letter: "ر", name: "Ra",    sound: "R",  color: C.blue,   emoji: "🌹", word: "وَرْدَة",   meaning: "Phool"   },
  { letter: "ز", name: "Zay",   sound: "Z",  color: C.pink,   emoji: "🌸", word: "زَهْرَة",   meaning: "Gulaab"  },
  { letter: "س", name: "Seen",  sound: "S",  color: C.yellow, emoji: "🐟", word: "سَمَك",    meaning: "Machli"  },
  { letter: "ش", name: "Sheen", sound: "Sh", color: C.orange, emoji: "☀️", word: "شَمْس",    meaning: "Suraj"   },
  { letter: "ص", name: "Sad",   sound: "S",  color: C.teal,   emoji: "🦅", word: "صَقْر",    meaning: "Baaz"    },
  { letter: "ض", name: "Dad",   sound: "D",  color: C.purple, emoji: "🐸", word: "ضِفْدَع",   meaning: "Mendak"  },
  { letter: "ط", name: "Ta",    sound: "T",  color: C.red,    emoji: "🦚", word: "طَاوُوس",  meaning: "Mor"     },
  { letter: "ظ", name: "Dha",   sound: "Dh", color: C.green,  emoji: "🦌", word: "ظَبْي",    meaning: "Hiran"   },
  { letter: "ع", name: "Ain",   sound: "A'", color: C.blue,   emoji: "🍇", word: "عِنَب",    meaning: "Angoor"  },
  { letter: "غ", name: "Ghain", sound: "Gh", color: C.pink,   emoji: "🌲", word: "غَابَة",   meaning: "Jungle"  },
  { letter: "ف", name: "Fa",    sound: "F",  color: C.yellow, emoji: "🦋", word: "فَرَاشَة",  meaning: "Titli"   },
  { letter: "ق", name: "Qaf",   sound: "Q",  color: C.orange, emoji: "🌙", word: "قَمَر",    meaning: "Chaand"  },
  { letter: "ك", name: "Kaf",   sound: "K",  color: C.teal,   emoji: "🐶", word: "كَلْب",    meaning: "Kutta"   },
  { letter: "ل", name: "Lam",   sound: "L",  color: C.purple, emoji: "🌙", word: "لَيْل",    meaning: "Raat"    },
  { letter: "م", name: "Meem",  sound: "M",  color: C.red,    emoji: "🌊", word: "مَاء",     meaning: "Paani"   },
  { letter: "ن", name: "Noon",  sound: "N",  color: C.green,  emoji: "⭐", word: "نَجْم",    meaning: "Sitara"  },
  { letter: "ه", name: "Ha",    sound: "H",  color: C.blue,   emoji: "🌙", word: "هِلَال",   meaning: "Hilaal"  },
  { letter: "و", name: "Waw",   sound: "W",  color: C.pink,   emoji: "🌹", word: "وَرْد",    meaning: "Phool"   },
  { letter: "ي", name: "Ya",    sound: "Y",  color: C.yellow, emoji: "✋", word: "يَد",      meaning: "Haath"   },
];

const SHORT_SURAHS = [
  {
    num: 114, name: "An-Nas", arabic: "سُورَةُ النَّاس", meaning: "Insaan",
    ayahs: 6, emoji: "👥", color: C.blue,
    verses: [
      { ar: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", ur: "Kaho mein panaah maangta hoon insaanon ke Rabb ki" },
      { ar: "مَلِكِ النَّاسِ", ur: "Insaanon ke Badshah ki" },
      { ar: "إِلَٰهِ النَّاسِ", ur: "Insaanon ke Ilaah ki" },
      { ar: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", ur: "Waswase dene wale ke shar se" },
      { ar: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", ur: "Jo insaanon ke seenon mein waswase daalta hai" },
      { ar: "مِنَ الْجِنَّةِ وَالنَّاسِ", ur: "Jinnat mein se bhi aur insaanon mein se bhi" },
    ]
  },
  {
    num: 113, name: "Al-Falaq", arabic: "سُورَةُ الْفَلَق", meaning: "Subah ka Noor",
    ayahs: 5, emoji: "🌅", color: C.orange,
    verses: [
      { ar: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", ur: "Kaho mein panaah maangta hoon subah ke Rabb ki" },
      { ar: "مِن شَرِّ مَا خَلَقَ", ur: "Har cheez ke shar se jo usne banayi" },
      { ar: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", ur: "Aur andheri raat ke shar se" },
      { ar: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", ur: "Aur gaanth mein phoonk maarne waalon ke shar se" },
      { ar: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", ur: "Aur haasid ke shar se jab hasad kare" },
    ]
  },
  {
    num: 112, name: "Al-Ikhlas", arabic: "سُورَةُ الْإِخْلَاص", meaning: "Ek hai Allah",
    ayahs: 4, emoji: "☝️", color: C.yellow,
    verses: [
      { ar: "قُلْ هُوَ اللَّهُ أَحَدٌ", ur: "Kaho woh Allah ek hai" },
      { ar: "اللَّهُ الصَّمَدُ", ur: "Allah bebnyaaz hai" },
      { ar: "لَمْ يَلِدْ وَلَمْ يُولَدْ", ur: "Na uski koi aulaad hai na woh kisi ka bacha" },
      { ar: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", ur: "Aur koi uske barabar nahi" },
    ]
  },
  {
    num: 110, name: "An-Nasr", arabic: "سُورَةُ النَّصْر", meaning: "Allah Ki Madad",
    ayahs: 3, emoji: "🏆", color: C.green,
    verses: [
      { ar: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ", ur: "Jab Allah ki madad aa jaaye aur fatah mil jaaye" },
      { ar: "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا", ur: "Aur log Allah ke deen mein jhund ke jhund dakhil hon" },
      { ar: "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا", ur: "Apne Rabb ki tasbeh karo aur maafi maango" },
    ]
  },
  {
    num: 108, name: "Al-Kawthar", arabic: "سُورَةُ الْكَوْثَر", meaning: "Bahut Zyada Bhalaai",
    ayahs: 3, emoji: "🌊", color: C.teal,
    verses: [
      { ar: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", ur: "Hum ne tumhe Kawthar yaani bahut bhalaayi di" },
      { ar: "فَصَلِّ لِرَبِّكَ وَانْحَرْ", ur: "Apne Rabb ke liye namaaz padho aur qurbani karo" },
      { ar: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ", ur: "Beshak tumhara dushman hi bepanaah hai" },
    ]
  },
  {
    num: 111, name: "Al-Masad", arabic: "سُورَةُ الْمَسَد", meaning: "Buri Niyyat Ka Anjam",
    ayahs: 5, emoji: "🔥", color: C.red,
    verses: [
      { ar: "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ", ur: "Abu Lahab ke haath tabah ho gaye aur woh tabah ho gaya" },
      { ar: "مَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ", ur: "Uske maal ne aur jo usne kamaya kuch kaam na aaya" },
      { ar: "سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ", ur: "Woh bhadakti aag mein daakhil hoga" },
      { ar: "وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ", ur: "Aur uski biwi bhi lakdiyan uthane waali" },
      { ar: "فِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ", ur: "Uske gale mein moondh ki rassi hogi" },
    ]
  },
];

const PROPHETS = [
  { name: "Adam AS",       arabic: "آدم",      emoji: "🌱", color: C.green,  fact: "Quran mein 25 baar unka zikr hai",              story: "Allah ne Hazrat Adam AS ko apne haath se mitti se banaya. Woh pehle insaan the. Jannat mein rehte the. Phir zameen par aaye aur toubah ki aur Allah ne maaf kar diya." },
  { name: "Nooh AS",       arabic: "نوح",      emoji: "🚢", color: C.blue,   fact: "950 saal tak tabligh ki",                       story: "Hazrat Nooh AS ne 950 saal apni qoum ko samjhaya. Koi nahi maana toh Allah ne toofan bheja. Unhon ne kashti banayi. Iman wale bache aur zalimon ka wajood khatam hua." },
  { name: "Ibrahim AS",    arabic: "إبراهيم",  emoji: "🔥", color: C.orange, fact: "Khalilullah yaani Allah ke dost",                story: "Hazrat Ibrahim AS ne but todey. Zaalim badshah Namrud ne unhe aag mein daala. Magar Allah ne aag ko hukm diya ke Ibrahim ke liye thandi aur salamat ho ja. Aag gulzaar ban gayi." },
  { name: "Yusuf AS",      arabic: "يوسف",     emoji: "👑", color: C.yellow, fact: "Sabse khoobsurat kahani poori surah unhi par",   story: "Hazrat Yusuf AS ke bhai ne unhe kuwen mein daala. Phir Misr mein ghulaam bane. Qaidi bane. Magar Allah ne unhe Misr ka Wazir e Aazam bana diya. Sabar ka kitna acha nateeja." },
  { name: "Moosa AS",      arabic: "موسى",     emoji: "🪄", color: C.teal,   fact: "Quran mein sabse zyada naam aata hai",           story: "Hazrat Moosa AS Firown ke ghar mein pale. Allah ne unhe Nabi banaya. Lathhi se darya ko do hissa kar diya. Bani Israel ko aazaad karaya Firown ke zulm se." },
  { name: "Isa AS",        arabic: "عيسى",     emoji: "🕊️", color: C.purple, fact: "Allah ka kalmah aur Maryam AS ke bete",          story: "Hazrat Isa AS bina baap ke paida hue jo Allah ka mojza tha. Logon ko ilaj karte andhe ko aankhein dete murdon ko zinda karte. Aakhir aasman par utha liye gaye." },
  { name: "Muhammad ﷺ",   arabic: "محمد",     emoji: "🌙", color: C.yellow, fact: "Aakhri Nabi Khatamun Nabiyyeen",                 story: "Nabi Kareem ﷺ Mecca mein paida hue. Ghaar e Hira mein pehli wahi aayi. Teis saal mein Quran mukammal hua. Poori insaaniyat ke liye rehmat bana ke bheje gaye." },
];

const DUAS_KIDS = [
  { title: "Khane Se Pehle",     arabic: "بِسْمِ اللَّهِ",                          urdu: "Allah ke naam se shuru karta hoon",          emoji: "🍽️", color: C.orange },
  { title: "Khane Ke Baad",      arabic: "الْحَمْدُ لِلَّهِ",                         urdu: "Tamam taarif Allah ke liye hai",             emoji: "😊",  color: C.green  },
  { title: "Sone Se Pehle",      arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",   urdu: "Tere naam se Allah marta hoon aur jeeta hoon", emoji: "😴",  color: C.blue   },
  { title: "Neend Se Uthke",     arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا",      urdu: "Shukar hai Allah ka jisne hamein zindagi di", emoji: "🌅",  color: C.yellow },
  { title: "Ghar Se Nikalte",    arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ", urdu: "Allah ke naam se Allah par bharosa kiya",    emoji: "🚪",  color: C.pink   },
  { title: "Aaine Mein Dekh Ke", arabic: "اللَّهُمَّ أَنْتَ حَسَّنْتَ خَلْقِي",      urdu: "Aye Allah tune meri soorat achhi banayi",    emoji: "🪞",  color: C.teal   },
];

// ── Shared styles ─────────────────────────────────────────────────────
const backBtn = {
  background: "transparent", border: "1px solid #2a3a4a",
  color: C.dim, borderRadius: "10px", padding: "8px 16px",
  cursor: "pointer", fontSize: "13px", marginBottom: "16px",
};

// ── Voice Button ──────────────────────────────────────────────────────
function VoiceBtn({ onClick, speaking, color, size = "md" }) {
  const sz = size === "sm" ? { btn: "30px", icon: "13px" } : { btn: "42px", icon: "18px" };
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick(); }}
      title="Suno"
      style={{
        width: sz.btn, height: sz.btn, borderRadius: "50%", border: "none",
        background: speaking ? color : `${color}22`,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", fontSize: sz.icon, flexShrink: 0,
        transition: "all 0.2s",
        boxShadow: speaking ? `0 0 14px ${color}99` : "none",
      }}
    >
      {speaking ? "⏹" : "🔊"}
    </button>
  );
}

// ── Huroof View ───────────────────────────────────────────────────────
function HuroofView() {
  const [selected, setSelected] = useState(null);
  const [speaking, setSpeaking] = useState(null);
  const [learned, setLearned]   = useState(() => {
    try { return JSON.parse(localStorage.getItem("kids_huroof") || "[]"); } catch { return []; }
  });

  const playLetter = (l, id) => {
    if (speaking === id) { stopAudio(); setSpeaking(null); return; }
    setSpeaking(id);
    // Sequence: Arabic letter → Arabic word → Urdu meaning
    playSequenceTTS([
      { text: l.letter,  lang: "ar", pause: 800 },
      { text: l.word,    lang: "ar", pause: 700 },
      { text: l.meaning, lang: "ur", pause: 300 },
    ], () => setSpeaking(null));
  };

  const toggleLearned = (name) => {
    const updated = learned.includes(name)
      ? learned.filter(n => n !== name)
      : [...learned, name];
    setLearned(updated);
    localStorage.setItem("kids_huroof", JSON.stringify(updated));
  };

  if (selected) {
    return (
      <div style={{ animation: "fadeUp 0.3s ease" }}>
        <button onClick={() => { setSelected(null); stopAudio(); setSpeaking(null); }} style={backBtn}>← Wapas</button>
        <div style={{
          background: C.card, borderRadius: "28px", padding: "36px 24px",
          border: `2px solid ${selected.color}`, textAlign: "center",
        }}>
          <div style={{ fontSize: "70px", marginBottom: "8px", animation: "bounce 1.5s ease infinite" }}>{selected.emoji}</div>

          <div style={{ fontSize: "24px", color: selected.color, fontFamily: "serif", direction: "rtl", marginBottom: "2px" }}>
            {selected.word}
          </div>
          <div style={{ fontSize: "13px", color: C.dim, marginBottom: "16px", letterSpacing: "1px" }}>
            {selected.meaning}
          </div>

          <div style={{
            fontSize: "110px", color: selected.color, fontFamily: "serif",
            lineHeight: 1, filter: `drop-shadow(0 0 28px ${selected.color}66)`, marginBottom: "20px",
          }}>
            {selected.letter}
          </div>

          <button
            onClick={() => playLetter(selected, "detail")}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              margin: "0 auto 24px", padding: "12px 32px", borderRadius: "20px", border: "none",
              background: speaking === "detail" ? selected.color : `${selected.color}22`,
              color: speaking === "detail" ? "#0a0f1a" : selected.color,
              fontSize: "15px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s",
              boxShadow: speaking === "detail" ? `0 0 16px ${selected.color}66` : "none",
            }}
          >
            {speaking === "detail" ? "⏹ Ruk Jao" : "🔊 Harf · Lafz · Matlab"}
          </button>

          <div style={{ fontSize: "26px", color: C.text, fontWeight: "800", marginBottom: "4px" }}>{selected.name}</div>
          <div style={{ fontSize: "15px", color: C.dim, marginBottom: "28px" }}>
            Awaaz: <span style={{ color: selected.color, fontWeight: "700" }}>"{selected.sound}"</span>
          </div>

          <button
            onClick={() => toggleLearned(selected.name)}
            style={{
              padding: "14px 36px", borderRadius: "20px", border: "none",
              background: learned.includes(selected.name)
                ? `linear-gradient(135deg, ${C.green}, #16a34a)`
                : `linear-gradient(135deg, ${selected.color}, ${selected.color}bb)`,
              color: "#0a0f1a", fontSize: "16px", fontWeight: "800", cursor: "pointer",
              boxShadow: `0 4px 16px ${selected.color}44`,
            }}
          >
            {learned.includes(selected.name) ? "✓ Seekh Liya! 🌟" : "Seekh Liya! ⭐"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Progress */}
      <div style={{ background: C.card, borderRadius: "16px", padding: "16px", marginBottom: "16px", border: "1px solid #2a3a4a" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ color: C.text, fontSize: "13px", fontWeight: "600" }}>Seekhe hue Huroof</span>
          <span style={{ color: C.yellow, fontSize: "14px", fontWeight: "800" }}>{learned.length}/28</span>
        </div>
        <div style={{ background: "#0a0f1a", borderRadius: "8px", height: "10px", overflow: "hidden" }}>
          <div style={{
            background: `linear-gradient(90deg, ${C.yellow}, ${C.orange})`,
            height: "100%", width: `${(learned.length / 28) * 100}%`,
            borderRadius: "8px", transition: "width 0.6s ease",
          }} />
        </div>
        {learned.length === 28 && (
          <div style={{ textAlign: "center", marginTop: "10px", color: C.gold, fontWeight: "700", fontSize: "13px" }}>
            🎉 MashaAllah! Saare huroof seekh liye!
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
        {ARABIC_LETTERS.map((l, i) => (
          <div
            key={l.name + i}
            style={{
              background: C.card, borderRadius: "16px", padding: "10px 6px 8px",
              textAlign: "center", cursor: "pointer", position: "relative",
              border: `2px solid ${learned.includes(l.name) ? l.color : "#2a3a4a"}`,
              animation: `popIn 0.3s ease ${i * 0.02}s both`,
              transition: "transform 0.15s, border-color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            {learned.includes(l.name) && (
              <div style={{ position: "absolute", top: "4px", right: "6px", fontSize: "10px", color: C.green }}>✓</div>
            )}
            <div style={{ fontSize: "16px", marginBottom: "2px" }}>{l.emoji}</div>
            <div
              onClick={() => setSelected(l)}
              style={{ fontSize: "32px", color: l.color, fontFamily: "serif", lineHeight: 1.1 }}
            >{l.letter}</div>
            <div style={{ fontSize: "9px", color: C.dim, marginTop: "2px" }}>{l.name}</div>
            <div style={{ fontSize: "10px", color: l.color, fontFamily: "serif", direction: "rtl", marginTop: "2px" }}>
              {l.word}
            </div>
            <div style={{ fontSize: "9px", color: C.dim, marginTop: "1px" }}>{l.meaning}</div>
            <button
              onClick={e => { e.stopPropagation(); playLetter(l, l.name + i); }}
              style={{
                marginTop: "5px", border: "none", background: "transparent",
                cursor: "pointer", fontSize: "14px", padding: "2px",
                opacity: speaking === l.name + i ? 1 : 0.4, transition: "opacity 0.2s",
              }}
            >
              {speaking === l.name + i ? "⏹" : "🔊"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Surahs View ───────────────────────────────────────────────────────
function SurahsView() {
  const [selected, setSelected] = useState(null);
  const [speaking, setSpeaking] = useState(null);
  const [playingAll, setPlayingAll] = useState(false);

  const playVerse = (verse, idx) => {
    if (speaking === idx) { stopAudio(); setSpeaking(null); return; }
    setSpeaking(idx);
    playSequenceTTS([
      { text: verse.ar, lang: "ar", pause: 700 },
      { text: verse.ur, lang: "ur", pause: 400 },
    ], () => setSpeaking(null));
  };

  const playAllVerses = (surah) => {
    if (playingAll) { stopAudio(); setPlayingAll(false); return; }
    setPlayingAll(true);
    const seq = surah.verses.flatMap(v => ([
      { text: v.ar, lang: "ar", pause: 600 },
      { text: v.ur, lang: "ur", pause: 900 },
    ]));
    playSequenceTTS(seq, () => setPlayingAll(false));
  };

  if (selected) {
    return (
      <div style={{ animation: "fadeUp 0.3s ease" }}>
        <button onClick={() => { setSelected(null); stopAudio(); setSpeaking(null); setPlayingAll(false); }} style={backBtn}>← Wapas</button>
        <div style={{ background: C.card, borderRadius: "22px", padding: "24px", border: `1px solid ${selected.color}` }}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div style={{ fontSize: "40px" }}>{selected.emoji}</div>
            <div style={{ color: selected.color, fontSize: "22px", fontWeight: "800", marginTop: "8px" }}>{selected.name}</div>
            <div style={{ color: C.text, fontSize: "28px", direction: "rtl", fontFamily: "serif", marginTop: "6px", lineHeight: 1.8 }}>{selected.arabic}</div>
            <div style={{ color: C.dim, fontSize: "13px", marginTop: "4px" }}>Matlab: {selected.meaning} • {selected.ayahs} Aayaat</div>
            <button
              onClick={() => playAllVerses(selected)}
              style={{
                marginTop: "16px", padding: "10px 28px", borderRadius: "20px", border: "none",
                background: playingAll ? selected.color : `${selected.color}22`,
                color: playingAll ? "#0a0f1a" : selected.color,
                fontSize: "14px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: "8px", margin: "16px auto 0",
              }}
            >
              {playingAll ? "⏹ Rokein" : "🔊 Poori Surah Sunao"}
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {selected.verses.map((v, i) => (
              <div key={i} style={{ background: "#0a0f1a", borderRadius: "14px", padding: "16px", borderLeft: `3px solid ${selected.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: selected.color, fontSize: "20px", direction: "rtl", fontFamily: "serif", textAlign: "right", marginBottom: "8px", lineHeight: 2 }}>{v.ar}</div>
                    <div style={{ color: C.dim, fontSize: "13px" }}>{v.ur}</div>
                  </div>
                  <VoiceBtn onClick={() => playVerse(v, i)} speaking={speaking === i} color={selected.color} size="sm" />
                </div>
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
          style={{
            background: C.card, borderRadius: "18px", padding: "18px", cursor: "pointer",
            border: `1px solid #2a3a4a`, display: "flex", alignItems: "center", gap: "14px",
            animation: `slideIn 0.3s ease ${i * 0.05}s both`, transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.background = C.cardHover; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a3a4a"; e.currentTarget.style.background = C.card; }}
        >
          <div style={{ fontSize: "36px" }}>{s.emoji}</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: s.color, fontSize: "17px", fontWeight: "700" }}>{s.name}</div>
            <div style={{ color: C.text, fontSize: "18px", fontFamily: "serif", direction: "rtl" }}>{s.arabic}</div>
            <div style={{ color: C.dim, fontSize: "12px", marginTop: "2px" }}>{s.meaning} • {s.ayahs} aayaat</div>
          </div>
          <div style={{ color: s.color, fontSize: "20px" }}>›</div>
        </div>
      ))}
    </div>
  );
}

// ── Prophets View ─────────────────────────────────────────────────────
function ProphetsView() {
  const [selected, setSelected] = useState(null);
  const [speaking, setSpeaking] = useState(false);

  const playStory = (p) => {
    if (speaking) { stopAudio(); setSpeaking(false); return; }
    setSpeaking(true);
    playSequenceTTS([
      { text: p.arabic, lang: "ar", pause: 900 },
      { text: p.story,  lang: "ur", pause: 600 },
      { text: p.fact,   lang: "ur", pause: 300 },
    ], () => setSpeaking(false));
  };

  if (selected) {
    return (
      <div style={{ animation: "fadeUp 0.3s ease" }}>
        <button onClick={() => { setSelected(null); stopAudio(); setSpeaking(false); }} style={backBtn}>← Wapas</button>
        <div style={{ background: C.card, borderRadius: "26px", padding: "28px", border: `2px solid ${selected.color}` }}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div style={{ fontSize: "64px", marginBottom: "8px", animation: "float 2s ease-in-out infinite" }}>{selected.emoji}</div>
            <div style={{ color: selected.color, fontSize: "26px", fontWeight: "800" }}>{selected.name}</div>
            <div style={{ color: C.text, fontSize: "26px", fontFamily: "serif", direction: "rtl", marginTop: "4px" }}>{selected.arabic}</div>
            <button
              onClick={() => playStory(selected)}
              style={{
                marginTop: "16px", padding: "10px 28px", borderRadius: "20px", border: "none",
                background: speaking ? selected.color : `${selected.color}22`,
                color: speaking ? "#0a0f1a" : selected.color,
                fontSize: "14px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: "8px", margin: "16px auto 0",
              }}
            >
              {speaking ? "⏹ Rokein" : "🔊 Kahani Sunao"}
            </button>
          </div>
          <div style={{ background: "#0a0f1a", borderRadius: "16px", padding: "20px", marginBottom: "16px" }}>
            <div style={{ color: C.yellow, fontSize: "11px", letterSpacing: "2px", marginBottom: "10px" }}>📖 KAHANI</div>
            <div style={{ color: C.text, fontSize: "15px", lineHeight: "1.9" }}>{selected.story}</div>
          </div>
          <div style={{ background: `${selected.color}18`, border: `1px solid ${selected.color}55`, borderRadius: "12px", padding: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
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
          style={{
            background: C.card, borderRadius: "18px", padding: "20px", cursor: "pointer",
            textAlign: "center", border: `1px solid #2a3a4a`,
            animation: `popIn 0.3s ease ${i * 0.05}s both`, transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = p.color; e.currentTarget.style.transform = "scale(1.02)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a3a4a"; e.currentTarget.style.transform = "scale(1)"; }}
        >
          <div style={{ fontSize: "40px", marginBottom: "8px" }}>{p.emoji}</div>
          <div style={{ color: p.color, fontSize: "13px", fontWeight: "700" }}>{p.name}</div>
          <div style={{ color: C.text, fontSize: "18px", fontFamily: "serif", direction: "rtl", marginTop: "4px" }}>{p.arabic}</div>
        </div>
      ))}
    </div>
  );
}

// ── Duas View ─────────────────────────────────────────────────────────
function DuasView() {
  const [flipped, setFlipped]   = useState(null);
  const [speaking, setSpeaking] = useState(null);

  const playDua = (d, i) => {
    if (speaking === i) { stopAudio(); setSpeaking(null); return; }
    setSpeaking(i);
    playSequenceTTS([
      { text: d.arabic, lang: "ar", pause: 900 },
      { text: d.urdu,   lang: "ur", pause: 300 },
    ], () => setSpeaking(null));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {DUAS_KIDS.map((d, i) => (
        <div
          key={d.title}
          style={{
            background: C.card, borderRadius: "18px", padding: "18px", cursor: "pointer",
            border: `1px solid ${flipped === i ? d.color : "#2a3a4a"}`,
            transition: "border 0.2s", animation: `slideIn 0.3s ease ${i * 0.05}s both`,
          }}
          onClick={() => setFlipped(flipped === i ? null : i)}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ fontSize: "28px" }}>{d.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: d.color, fontSize: "15px", fontWeight: "700" }}>{d.title}</div>
              {flipped === i && (
                <div style={{ animation: "fadeUp 0.2s ease" }}>
                  <div style={{ color: C.text, fontSize: "22px", fontFamily: "serif", direction: "rtl", textAlign: "right", marginTop: "12px", lineHeight: 2 }}>
                    {d.arabic}
                  </div>
                  <div style={{ color: C.dim, fontSize: "13px", marginTop: "6px" }}>{d.urdu}</div>
                </div>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <VoiceBtn onClick={() => playDua(d, i)} speaking={speaking === i} color={d.color} size="sm" />
              <div style={{ color: d.color, fontSize: "18px" }}>{flipped === i ? "▲" : "▼"}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────
export default function KidsGraph() {
  const [tab, setTab] = useState("huroof");

  const tabs = [
    { id: "huroof",   label: "Huroof", emoji: "🔤" },
    { id: "surahs",   label: "Surahs", emoji: "📖" },
    { id: "prophets", label: "Anbiya", emoji: "⭐" },
    { id: "duas",     label: "Duaen",  emoji: "🤲" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "system-ui, sans-serif", paddingBottom: "90px" }}>
      <div style={{ background: "linear-gradient(135deg, #111827, #0a0f1a)", borderBottom: "1px solid #1f2d3a", padding: "24px 20px 16px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "34px", marginBottom: "4px" }}>👶</div>
          <h1 style={{
            fontSize: "22px", fontWeight: "800", margin: "0 0 4px",
            background: `linear-gradient(90deg, ${C.yellow}, ${C.orange})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Kids Corner</h1>
          <p style={{ color: C.dim, fontSize: "12px", margin: "0 0 10px" }}>Islamic seekho — khel khel mein! 🌟</p>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)",
            borderRadius: "20px", padding: "4px 14px", color: C.gold, fontSize: "11px",
          }}>
            🔊 Clear Arabic + Urdu voice — Google TTS
          </div>
        </div>
      </div>

      <div style={{ display: "flex", borderBottom: "1px solid #1f2d3a", background: "#0d1520", position: "sticky", top: 0, zIndex: 10 }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); stopAudio(); }}
            style={{
              flex: 1, padding: "12px 4px", border: "none", background: "transparent",
              cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
              borderBottom: tab === t.id ? `3px solid ${C.yellow}` : "3px solid transparent",
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: "20px" }}>{t.emoji}</span>
            <span style={{ fontSize: "10px", color: tab === t.id ? C.yellow : C.dim, fontWeight: tab === t.id ? "700" : "400" }}>
              {t.label}
            </span>
          </button>
        ))}
      </div>

      <div style={{ padding: "20px", maxWidth: "480px", margin: "0 auto" }}>
        {tab === "huroof"   && <HuroofView />}
        {tab === "surahs"   && <SurahsView />}
        {tab === "prophets" && <ProphetsView />}
        {tab === "duas"     && <DuasView />}
      </div>

      <style>{`
        @keyframes popIn   { from { opacity:0; transform:scale(0.85);      } to { opacity:1; transform:scale(1);      } }
        @keyframes slideIn { from { opacity:0; transform:translateX(-14px); } to { opacity:1; transform:translateX(0); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(10px);  } to { opacity:1; transform:translateY(0); } }
        @keyframes float   { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-8px)} }
        @keyframes bounce  { 0%,100%{transform:scale(1)}       50%{transform:scale(1.08)}      }
      `}</style>
    </div>
  );
}