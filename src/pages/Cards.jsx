import React, { Suspense, lazy } from 'react'
// import Head from 'next/head' // Next.js ke liye; agar Vite/CRA hai toh react-helmet use karein

// Lazy load — initial bundle size kam karta hai
const Ayahcards = lazy(() => import('../components/Ayahcards'))

// Loading fallback — skeleton UI (CLS avoid karne ke liye fixed height)
function AyahcardsSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Ayah cards load ho rahe hain"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem',
        padding: '1.5rem',
        minHeight: '400px', // layout shift rokta hai
      }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          style={{
            height: '180px',
            borderRadius: '12px',
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.4s infinite',
          }}
        />
      ))}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}

export default function Cards() {
  return (
    <>
      {/* ── SEO Meta Tags ── */}
      {/* <Head>
        {/* Primary */}
        <title>Ayah Cards – Quran Ki Ayaat Explore Karein</title>
        <meta
          name="description"
          content="Quran ki khoobsurat ayaat ko card format mein explore karein. Arabic matn, urdu tarjuma aur tafseer ke saath."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://soulayah.com/cards" />

        {/* Open Graph (Facebook / WhatsApp) */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Ayah Cards – Quran Ki Ayaat Explore Karein" />
        <meta
          property="og:description"
          content="Quran ki khoobsurat ayaat ko card format mein explore karein."
        />
        <meta property="og:url" content="https://soulayah.com/cards" />
        <meta property="og:image" content="https://soulayah.com/og-image-cards.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ayah Cards – Quran Ki Ayaat Explore Karein" />
        <meta
          name="twitter:description"
          content="Quran ki khoobsurat ayaat ko card format mein explore karein."
        />
        <meta name="twitter:image" content="https://soulayah.com/og-image-cards.png" />

        {/* Performance hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      {/* </Head> */}

      {/* ── Page Structure ── */}
      <main>
        {/*
          <h1> hona zaroori hai page par — ek hi hona chahiye.
          Agar Ayahcards component ke andar already h1 hai toh
          wahan se manage karein aur yeh hata dein.
        */}
        <h1 className="sr-only">Ayah Cards – Quran Ki Ayaat</h1>

        <Suspense fallback={<AyahcardsSkeleton />}>
          <Ayahcards />
        </Suspense>
      </main>
    </>
  )
}

/*
  ── Agar Next.js use kar rahe hain toh SSG/ISR ke liye ──
  (yeh file mein add karein, export default ke baad)

export async function getStaticProps() {
  // Ayaat ka data build time par fetch karein
  // const ayaat = await fetchAyaat()
  return {
    props: {}, // ya { ayaat }
    revalidate: 3600, // ISR: har 1 ghante mein rebuild
  }
}
*/