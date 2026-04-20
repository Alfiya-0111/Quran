import { useNavigate } from 'react-router-dom'

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

export default function Home() {
  const navigate = useNavigate()
  const todayAyah = DAILY_AYAHS[new Date().getDay() % DAILY_AYAHS.length]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Subah Bakhair' : hour < 17 ? 'Assalamu Alaikum' : 'Shab Bakhair'

  return (
    <div style={{
      maxWidth: '480px', margin: '0 auto',
      padding: '28px 16px 16px',
      minHeight: '100vh',
      background: '#07090d',
    }}>

      {/* Greeting */}
      <div style={{ marginBottom: '28px', animation: 'fadeUp 0.4s ease' }}>
        <div style={{ fontSize: '12px', color: '#6a5f52', letterSpacing: '2px', marginBottom: '4px' }}>
          {greeting} 🌙
        </div>
        <div style={{
          fontSize: '32px', color: '#C9A84C',
          fontFamily: "'Amiri', serif", letterSpacing: '4px', opacity: 0.8,
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
        <div style={{ fontSize: '10px', color: '#6a5f52', letterSpacing: '2px', marginBottom: '14px' }}>
          ✨ AAJ KI AYAH
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
        {[
          { icon: '📖', title: 'Quran Reader',  sub: 'Padho, suno, bookmark', badge: 'Audio • Bookmark', color: '#2C7873', path: '/reader' },
          { icon: '💙', title: 'Dil Ka Haal',   sub: 'Apni kaifiyat batao',   badge: '8 Moods • AI',    color: '#6B7FD7', path: '/mood'   },
          { icon: '🔤', title: 'Word-by-Word',  sub: 'Arabic seekho',          badge: 'Tap • Save • Quiz', color: '#8E44AD', path: '/vocab'  },
          { icon: '💬', title: 'Tafsir',         sub: 'Kuch bhi poochho',      badge: 'AI Scholar',     color: '#C0392B', path: '/tafsir' },
        ].map((f, i) => (
          <button
            key={f.path}
            onClick={() => navigate(f.path)}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '18px', padding: '18px 14px',
              textAlign: 'left', transition: 'all 0.25s',
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
            <div style={{ fontSize: '26px', marginBottom: '10px' }}>{f.icon}</div>
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
                color: '#6a5f52', fontSize: '12px', transition: 'all 0.2s',
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
      <div style={{ textAlign: 'center', marginTop: '40px', color: '#2a2520', fontSize: '11px' }}>
        <div style={{ fontFamily: "'Amiri', serif", fontSize: '16px', color: '#C9A84C', opacity: 0.3, marginBottom: '4px' }}>
          صدقہ جاریہ
        </div>
        Sadqa-e-Jariya • Free Forever • No Ads
      </div>
    </div>
  )
}