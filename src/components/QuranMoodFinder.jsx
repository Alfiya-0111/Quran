import { useState } from "react";

const moods = [
  { id: "anxious", label: "پریشان ہوں", emoji: "😟", english: "Anxious / Worried", color: "#6B7FD7" },
  { id: "sad", label: "اداس ہوں", emoji: "😢", english: "Sad / Heartbroken", color: "#7E6FAB" },
  { id: "hopeless", label: "امید نہیں", emoji: "🌑", english: "Hopeless / Lost", color: "#4A5568" },
  { id: "grateful", label: "شکرگزار ہوں", emoji: "🌟", english: "Grateful / Blessed", color: "#C9A84C" },
  { id: "angry", label: "غصہ ہے", emoji: "😤", english: "Angry / Frustrated", color: "#C0392B" },
  { id: "lonely", label: "اکیلا محسوس", emoji: "🌙", english: "Lonely / Isolated", color: "#2C7873" },
  { id: "seeking", label: "رہنمائی چاہیے", emoji: "🧭", english: "Seeking Guidance", color: "#27AE60" },
  { id: "fearful", label: "ڈر لگ رہا", emoji: "😰", english: "Fearful / Scared", color: "#8E44AD" },
];

// Hardcoded curated ayahs — no AI needed, instant, always works!
const MOOD_AYAHS = {
  anxious: [
    {
      arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
      translation: "Sun lo! Allah ki yaad se hi dilon ko sukoon milta hai.",
      surah: "Ar-Ra'd", ayahNumber: 28,
      reflection: "Jab anxiety ho, toh zikr karo — 'SubhanAllah', 'Alhamdulillah'. Dil khud theek ho jaata hai.",
    },
    {
      arabic: "وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ",
      translation: "Aur na kamzor paro, na gham karo, tum hi ghalib ho agar momin ho.",
      surah: "Aali Imran", ayahNumber: 139,
      reflection: "Pareshan hona zaroori nahi — Allah ne tumhe in mushkilon se bada banaya hai.",
    },
    {
      arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا إِنَّ مَعَ الْعُسْرِ يُسْرًا",
      translation: "Toh beshak mushkil ke saath aasaani hai. Beshak mushkil ke saath aasaani hai.",
      surah: "Al-Inshirah", ayahNumber: "5-6",
      reflection: "Allah ne do baar kaha — mushkil ek hai, magar aasaaniyan do hain. Umeed raho!",
    },
  ],
  sad: [
    {
      arabic: "وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ إِنَّهُ لَا يَيْأَسُ مِن رَّوْحِ اللَّهِ إِلَّا الْقَوْمُ الْكَافِرُونَ",
      translation: "Aur Allah ki rahmat se mayoos mat ho. Allah ki rahmat se sirf kaafir hi mayoos hote hain.",
      surah: "Yusuf", ayahNumber: 87,
      reflection: "Udaasi mein bhi umeed rakho — Allah ka raham hamesha maujood hai.",
    },
    {
      arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
      translation: "Beshak Allah sabr karne walon ke saath hai.",
      surah: "Al-Baqarah", ayahNumber: 153,
      reflection: "Jab dil toot jaaye, sabr karo — Allah khud tumhare saath khada hai.",
    },
    {
      arabic: "وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ",
      translation: "Aur ho sakta hai ke tum kisi cheez ko na pasand karo aur woh tumhare liye behtar ho.",
      surah: "Al-Baqarah", ayahNumber: 216,
      reflection: "Jo kuch hua, shayad usme koi chupi hue bhalai hai — Allah ka plan hamesha behtar hota hai.",
    },
  ],
  hopeless: [
    {
      arabic: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",
      translation: "Keh do: Aey mere bando jo apne aap pe zulm kar chuke hain, Allah ki rahmat se mayoos mat ho.",
      surah: "Az-Zumar", ayahNumber: 53,
      reflection: "Chahe kitna bhi bura kiya ho — Allah ki rahmat sab se badi hai. Wapas aa jao.",
    },
    {
      arabic: "إِنَّهُ لَا يَيْأَسُ مِن رَّوْحِ اللَّهِ إِلَّا الْقَوْمُ الْكَافِرُونَ",
      translation: "Allah ki rahmat se sirf woh log mayoos hote hain jo iman nahi rakhte.",
      surah: "Yusuf", ayahNumber: 87,
      reflection: "Mayoosi kufr ki alamat hai — momin hamesha umeedwar rehta hai.",
    },
    {
      arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
      translation: "Aur jo Allah pe bharosa kare, woh uske liye kaafi hai.",
      surah: "At-Talaq", ayahNumber: 3,
      reflection: "Jab sab raaste band lagte hain, sirf Allah pe tawakkul karo — woh akela kaafi hai.",
    },
  ],
  grateful: [
    {
      arabic: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
      translation: "Agar tum shukr karo toh main tumhe aur zyada dunga.",
      surah: "Ibrahim", ayahNumber: 7,
      reflection: "Shukr karo — Allah ne promise kiya hai ke aur zyada milega!",
    },
    {
      arabic: "وَإِن تَعُدُّوا نِعْمَةَ اللَّهِ لَا تُحْصُوهَا",
      translation: "Aur agar tum Allah ki naimaton ko gino toh ginti nahi kar sakte.",
      surah: "An-Nahl", ayahNumber: 18,
      reflection: "Har cheez jo hai — sehat, ghar, rishte — sab Allah ka inaam hai. Shukar ada karo.",
    },
    {
      arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
      translation: "Tum mujhe yaad karo, main tumhe yaad karunga. Aur mera shukar karo, nakhusgiri mat karo.",
      surah: "Al-Baqarah", ayahNumber: 152,
      reflection: "Zikr aur shukar — yeh do cheezein Allah se qareeb karti hain.",
    },
  ],
  angry: [
    {
      arabic: "وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ",
      translation: "Aur woh jo gusse ko pee jaate hain aur logon ko maaf kar dete hain. Allah neki karne walon se muhabbat karta hai.",
      surah: "Aali Imran", ayahNumber: 134,
      reflection: "Gussa pee lena — yeh kamzori nahi, balki Allah ko pasand hai. Maafi dena sabse bada hua.",
    },
    {
      arabic: "خُذِ الْعَفْوَ وَأْمُرْ بِالْعُرْفِ وَأَعْرِضْ عَنِ الْجَاهِلِينَ",
      translation: "Maafi ka raasta apnao, bhalaai ka hukm do, aur jahilon se munh phair lo.",
      surah: "Al-A'raf", ayahNumber: 199,
      reflection: "Jahil se jhagda mat karo — unhe chhod do, yahi aql hai.",
    },
    {
      arabic: "وَلَمَن صَبَرَ وَغَفَرَ إِنَّ ذَٰلِكَ لَمِنْ عَزْمِ الْأُمُورِ",
      translation: "Aur jo sabr kare aur maaf kar de — yeh toh bari himmat ka kaam hai.",
      surah: "Ash-Shura", ayahNumber: 43,
      reflection: "Maaf karna sabse mushkil kaam hai — magar yeh bahaduri ki nishani hai.",
    },
  ],
  lonely: [
    {
      arabic: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ",
      translation: "Aur woh tumhare saath hai jahan bhi tum ho.",
      surah: "Al-Hadid", ayahNumber: 4,
      reflection: "Tum kabhi akele nahi — Allah hamesha saath hai, har jagah, har waqt.",
    },
    {
      arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
      translation: "Jab mere bande mujhse mere baare mein puchain, main qareeb hoon. Duaa karne wale ki duaa sunta hoon.",
      surah: "Al-Baqarah", ayahNumber: 186,
      reflection: "Allah door nahi — seedha baat karo, woh sunta hai. Duaa karo abhi.",
    },
    {
      arabic: "لَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا",
      translation: "Gham mat karo, beshak Allah hamare saath hai.",
      surah: "At-Tawbah", ayahNumber: 40,
      reflection: "Nabi SAW ne bhi yahi kaha tha cave mein — aur tum bhi yahi jaan lo.",
    },
  ],
  seeking: [
    {
      arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
      translation: "Hamen seedha raasta dikha.",
      surah: "Al-Fatihah", ayahNumber: 6,
      reflection: "Yeh duaa roz padhte ho — seedha raasta maango, Allah zaroor dikhayega.",
    },
    {
      arabic: "وَمَن يُؤْمِن بِاللَّهِ يَهْدِ قَلْبَهُ",
      translation: "Aur jo Allah pe iman rakhta hai, woh uske dil ko hidayat deta hai.",
      surah: "At-Taghabun", ayahNumber: 11,
      reflection: "Raasta confuse lagta hai? Iman mazboot karo — dil khud raah pakad leta hai.",
    },
    {
      arabic: "إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ",
      translation: "Beshak Allah kisi qaum ki halat nahi badalta jab tak woh khud apni halat na badlein.",
      surah: "Ar-Ra'd", ayahNumber: 11,
      reflection: "Guidance ka pehla qadam khud uthao — Allah baqi raasta khol deta hai.",
    },
  ],
  fearful: [
    {
      arabic: "لَا تَخَفْ وَلَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا",
      translation: "Dar mat aur gham mat kha — beshak Allah hamare saath hai.",
      surah: "At-Tawbah", ayahNumber: 40,
      reflection: "Nabi SAW ka yeh farmaan tumhare liye bhi hai — Allah saath hai toh dar kaisa?",
    },
    {
      arabic: "أَلَا إِنَّ أَوْلِيَاءَ اللَّهِ لَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ",
      translation: "Sun lo! Allah ke dosto pe na koi dar hai aur na woh ghamgeen hote hain.",
      surah: "Yunus", ayahNumber: 62,
      reflection: "Allah se dosti karlo — phir duniya ka koi dar nahi sataayega.",
    },
    {
      arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
      translation: "Hamare liye Allah kaafi hai aur woh kya achha kaarsa'az hai!",
      surah: "Aali Imran", ayahNumber: 173,
      reflection: "Jab dar lage, yeh padhte raho — Ibrahim AS aur Nabi SAW ne bhi yahi kaha tha.",
    },
  ],
};

export default function QuranMoodFinder() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [activeCard, setActiveCard] = useState(null);

  const ayahs = selectedMood ? MOOD_AYAHS[selectedMood.id] : [];
  const activeMoodObj = moods.find((m) => m.id === selectedMood?.id);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0f 0%, #0f1923 50%, #0a0f0a 100%)",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#e8dcc8",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none",
        backgroundImage: `radial-gradient(circle at 20% 20%, rgba(201,168,76,0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(107,127,215,0.05) 0%, transparent 50%)`,
        zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "720px", margin: "0 auto", padding: "40px 20px 80px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ fontSize: "42px", marginBottom: "8px", letterSpacing: "8px", color: "#C9A84C", opacity: 0.9 }}>
            ﷽
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: "400", letterSpacing: "2px", color: "#e8dcc8", margin: "0 0 8px", textShadow: "0 0 40px rgba(201,168,76,0.3)" }}>
            Quran — Dil Ka Dawa
          </h1>
          <p style={{ color: "#8a7a6a", fontSize: "14px", letterSpacing: "1px", margin: 0 }}>
            قرآن دل کا دوا • Apni Kaifiyat Batao
          </p>
          <div style={{ width: "60px", height: "1px", background: "linear-gradient(90deg, transparent, #C9A84C, transparent)", margin: "20px auto 0" }} />
        </div>

        {/* Mood Selection */}
        {!selectedMood && (
          <div>
            <p style={{ textAlign: "center", color: "#a09080", marginBottom: "32px", fontSize: "15px" }}>
              Abhi aap kaisa mehsoos kar rahe hain?
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px" }}>
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => { setSelectedMood(mood); setActiveCard(null); }}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "16px", padding: "20px 16px",
                    cursor: "pointer", transition: "all 0.3s ease",
                    textAlign: "center", color: "#e8dcc8",
                    backdropFilter: "blur(10px)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `rgba(${hexToRgb(mood.color)}, 0.12)`;
                    e.currentTarget.style.borderColor = mood.color;
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = `0 8px 30px rgba(${hexToRgb(mood.color)}, 0.15)`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ fontSize: "30px", marginBottom: "8px" }}>{mood.emoji}</div>
                  <div style={{ fontSize: "17px", fontFamily: "'Noto Nastaliq Urdu', serif", lineHeight: 1.8 }}>
                    {mood.label}
                  </div>
                  <div style={{ fontSize: "11px", color: "#6a5f52", marginTop: "4px", letterSpacing: "0.5px" }}>
                    {mood.english}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ayahs */}
        {selectedMood && ayahs.length > 0 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>{activeMoodObj?.emoji}</div>
              <h2 style={{ fontSize: "18px", fontWeight: "400", color: activeMoodObj?.color, margin: "0 0 4px" }}>
                {activeMoodObj?.label}
              </h2>
              <p style={{ color: "#5a4f42", fontSize: "13px", margin: 0 }}>Allah ka kalam — aapke liye</p>
            </div>

            {ayahs.map((ayah, i) => (
              <div
                key={i}
                onClick={() => setActiveCard(activeCard === i ? null : i)}
                style={{
                  background: activeCard === i ? `rgba(${hexToRgb(activeMoodObj?.color || "#C9A84C")}, 0.08)` : "rgba(255,255,255,0.025)",
                  border: `1px solid ${activeCard === i ? activeMoodObj?.color || "#C9A84C" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: "20px", padding: "28px 24px",
                  marginBottom: "16px", cursor: "pointer",
                  transition: "all 0.4s ease", backdropFilter: "blur(10px)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div style={{
                    background: `rgba(${hexToRgb(activeMoodObj?.color || "#C9A84C")}, 0.2)`,
                    color: activeMoodObj?.color || "#C9A84C",
                    fontSize: "11px", padding: "4px 12px", borderRadius: "20px",
                  }}>
                    {ayah.surah} • Ayah {ayah.ayahNumber}
                  </div>
                  <div style={{ color: "#3a3028", fontSize: "18px" }}>{activeCard === i ? "▲" : "▼"}</div>
                </div>

                <div style={{
                  fontSize: "24px", lineHeight: "2.2", textAlign: "right", direction: "rtl",
                  color: "#e8dcc8", fontFamily: "'Amiri', 'Traditional Arabic', serif",
                  marginBottom: "16px", padding: "12px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}>
                  {ayah.arabic}
                </div>

                <p style={{ color: "#b0a090", fontSize: "14px", lineHeight: "1.8", margin: 0, fontStyle: "italic" }}>
                  {ayah.translation}
                </p>

                {activeCard === i && (
                  <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <span style={{ fontSize: "16px", flexShrink: 0 }}>💭</span>
                      <p style={{ color: activeMoodObj?.color || "#C9A84C", fontSize: "13px", lineHeight: "1.8", margin: 0, opacity: 0.9 }}>
                        {ayah.reflection}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div style={{ textAlign: "center", marginTop: "32px" }}>
              <button
                onClick={() => { setSelectedMood(null); setActiveCard(null); }}
                style={{
                  background: "transparent", border: "1px solid rgba(201,168,76,0.4)",
                  color: "#C9A84C", padding: "12px 32px", borderRadius: "30px",
                  cursor: "pointer", fontSize: "14px", letterSpacing: "1px", transition: "all 0.3s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
              >
                ← Dusra Mood Choose Karein
              </button>
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "60px", color: "#3a3028", fontSize: "12px" }}>
          <p style={{ margin: "0 0 4px" }}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          <p style={{ margin: 0 }}>Sadqa-e-Jariya • Free Forever</p>
        </div>
      </div>
    </div>
  );
}

function hexToRgb(hex) {
  if (!hex) return "201,168,76";
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : "201,168,76";
}