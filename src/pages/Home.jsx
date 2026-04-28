import { useNavigate } from 'react-router-dom'
import IslamicAd from '../components/IslamicAd';
import { FiBookOpen, FiHeart, FiType, FiMessageSquare, FiMoon } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { IoHandLeftOutline } from 'react-icons/io5';
import { RiUserHeartLine } from 'react-icons/ri';
import { BsPeople } from 'react-icons/bs';

// import { FaPrayingHands } from "react-icons/fa";
import { MdOutlineWbSunny } from "react-icons/md";

const DAILY_AYAHS = [
  { arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", translation: "Toh beshak mushkil ke saath aasaani hai.", surah: "Al-Inshirah", ayah: "94:5" },
  { arabic: "وَلَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ", translation: "Aur Allah ki rahmat se mayoos mat ho.", surah: "Az-Zumar", ayah: "39:53" },
  { arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", translation: "Beshak Allah sabr karne walon ke saath hai.", surah: "Al-Baqarah", ayah: "2:153" },
  { arabic: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ", translation: "Aur woh tumhare saath hai jahan bhi tum ho.", surah: "Al-Hadid", ayah: "57:4" },
  { arabic: "رَبِّ زِدْنِي عِلْمًا", translation: "Aiy mere Rabb! Mujhe ilm mein aur izafa farmao.", surah: "Ta-Ha", ayah: "20:114" },
]

const QUICK_SURAHS = [
  { number: 36, name: "Ya-Sin" },
  { number: 55, name: "Ar-Rahman" },
  { number: 67, name: "Al-Mulk" },
  { number: 112, name: "Al-Ikhlas" },
  { number: 1,   name: "Al-Fatihah" },
  { number: 18,  name: "Al-Kahf" },
]

const FEATURE_CARDS = [
  {
    Icon: FiBookOpen,
    title: 'Quran Reader',
    sub: 'Padho, suno, bookmark',
    badge: 'Audio • Bookmark',
    color: '#2C7873',
    path: '/reader',
  },
  {
    Icon: FiHeart,
    title: 'Dil Ka Haal',
    sub: 'Apni kaifiyat batao',
    badge: '8 Moods • AI',
    color: '#6B7FD7',
    path: '/mood',
  },
  { Icon: "🤲",
     title: 'Duas & Azkar', 
     sub: 'Subah shaam ki duaain',
      badge: 'Tasbeeh • Daily',
       color: '#E8A838',
        path: '/duas'
       },
    {
  Icon: BsPeople,        
  title: "Family Share",
  sub: "family",            
  badge: "Family parah",    
  color: "#ffffff",          
  path: "/family",
  label: "Family",
},
  {
    Icon: FiType,
    title: 'Word-by-Word',
    sub: 'Arabic seekho',
    badge: 'Tap • Save • Quiz',
    color: '#8E44AD',
    path: '/vocab',
  },
  {
    Icon: FiMessageSquare,
    title: 'Tafsir',
    sub: 'Kuch bhi poochho',
    badge: 'AI Scholar',
    color: '#C0392B',
    path: '/tafsir',
  },
]

export default function Home() {
  const navigate = useNavigate()
  const todayAyah = DAILY_AYAHS[new Date().getDay() % DAILY_AYAHS.length]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Subah Bakhair' : hour < 17 ? 'Assalamu Alaikum' : 'Shab Bakhair'

  return (
   <>
    <div style={{
      maxWidth: '480px', margin: '0 auto',
      padding: '28px 16px 16px',
      minHeight: '100vh',
      background: '#07090d',
    }}>

      {/* Greeting */}
      <div style={{ marginBottom: '28px', animation: 'fadeUp 0.4s ease' }}>
        <div style={{
          fontSize: '12px', color: '#6a5f52', letterSpacing: '2px',
          marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <FiMoon size={13} color="#C9A84C" style={{ opacity: 0.7 }} />
          {greeting}
        </div>
        <div style={{
          color: '#C9A84C',
          fontFamily: "'Amiri', serif",
          opacity: 0.9,
          lineHeight: '1.2',
          fontSize: 'clamp(28px, 8vw, 48px)',
          letterSpacing: 'clamp(2px, 1vw, 6px)',
          textAlign: 'center',
          marginTop: '6px',
          textShadow: '0 0 25px rgba(201,168,76,0.25)',
        }}>
          ﷽
        </div>
        <div style={{
          width: '48px', height: '1px',
          background: 'linear-gradient(90deg, #C9A84C, transparent)',
          marginTop: '12px',
        }} />
      </div>

      {/* Daily Ayah */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.02))',
        border: '1px solid rgba(201,168,76,0.2)',
        borderRadius: '20px', padding: '24px 20px',
        marginBottom: '20px',
        animation: 'fadeUp 0.4s ease 0.1s both',
      }}>
        <div style={{
          fontSize: '10px', color: '#6a5f52', letterSpacing: '2px', marginBottom: '14px',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <HiSparkles size={12} color="#C9A84C" style={{ opacity: 0.7 }} />
          AAJ KI AYAH
        </div>
        <div style={{
          fontFamily: "'Amiri', serif", fontSize: '26px',
          direction: 'rtl', textAlign: 'right',
          color: '#e2d9c8', lineHeight: '2.2', marginBottom: '14px',
        }}>
          {todayAyah.arabic}
        </div>
        <div style={{ fontSize: '13px', color: '#6a5f52', fontStyle: 'italic', lineHeight: '1.7', marginBottom: '10px' }}>
          {todayAyah.translation}
        </div>
        <div style={{ fontSize: '11px', color: '#C9A84C', opacity: 0.7 }}>
          — {todayAyah.surah} ({todayAyah.ayah})
        </div>
      </div>

      {/* Feature Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        {FEATURE_CARDS.map((f, i) => (
          <button
            key={f.path}
            onClick={() => navigate(f.path)}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '18px', padding: '18px 14px',
              textAlign: 'left', transition: 'all 0.25s', cursor: 'pointer',
              animation: `fadeUp 0.4s ease ${0.15 + i * 0.07}s both`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)'
              e.currentTarget.style.background = 'rgba(201,168,76,0.05)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
            }}
          >
            {/* Icon */}
           <div style={{
  width: '38px', height: '38px',
  background: `${f.color}18`,
  border: `1px solid ${f.color}40`,
  borderRadius: '12px',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  marginBottom: '12px',
  fontSize: '18px',  // emoji size
}}>
  {typeof f.Icon === 'string' ? (
    f.Icon  // emoji string — no size/color props
  ) : (
    <f.Icon size={18} color={f.color} />  // react-icon component
  )}
</div>
            <div style={{ fontSize: '14px', color: '#e2d9c8', marginBottom: '3px' }}>{f.title}</div>
            <div style={{ fontSize: '11px', color: '#6a5f52', marginBottom: '8px' }}>{f.sub}</div>
            <div style={{
              fontSize: '10px', color: f.color,
              background: `${f.color}1A`,
              padding: '3px 8px', borderRadius: '10px',
              display: 'inline-block',
            }}>
              {f.badge}
            </div>
          </button>
        ))}
      </div>

      {/* Quick Surahs */}
      <div style={{ animation: 'fadeUp 0.4s ease 0.5s both' }}>
        <div style={{ fontSize: '11px', color: '#3a3028', letterSpacing: '2px', marginBottom: '12px' }}>
          — MASHOOR SURAHS —
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {QUICK_SURAHS.map(s => (
            <button
              key={s.number}
              onClick={() => navigate('/reader', { state: { surahNumber: s.number } })}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '20px', padding: '7px 14px',
                color: '#6a5f52', fontSize: '12px', transition: 'all 0.2s', cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A84C'; e.currentTarget.style.color = '#C9A84C' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#6a5f52' }}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '60px', paddingBottom: '20px' }}>
        <div style={{
          width: '40px', height: '1px',
          background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
          margin: '0 auto 16px',
        }} />

        <p style={{ color: '#5a5040', fontSize: '11px', letterSpacing: '2px', margin: '0 0 4px' }}>
          Developed by
        </p>

        <p style={{
          color: '#C9A84C', fontSize: '14px', letterSpacing: '3px',
          fontWeight: '400', margin: 0,
          textShadow: '0 0 20px rgba(201,168,76,0.2)',
        }}>
          Alfiya • For the sake of Allah
        </p>

        {/* Dua line with hand icon */}
        <p style={{
          color: '#C9A84C', fontSize: '13px', letterSpacing: '2px',
          fontWeight: '400', margin: '6px 0 0',
          textShadow: '0 0 20px rgba(201,168,76,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        }}>
          <IoHandLeftOutline size={15} style={{ opacity: 0.8 }} />
          If you benefited, make dua for my Abbu
        </p>

        <p style={{ color: '#5a5040', fontSize: '11px', letterSpacing: '2px', margin: '6px 0 0' }}>
          "InshaAllah, beneficial for the Ummah"
        </p>

        <p style={{ color: '#3a3028', fontSize: '10px', marginTop: '8px', letterSpacing: '1px' }}>
          Sadqa-e-Jariya • Free Forever
        </p>
      </div>
    </div>

    <div style={{ marginTop: '40px' }}>
      {/* <IslamicAd /> <IslamicAd /> */}
    </div>
   </>
  )
}