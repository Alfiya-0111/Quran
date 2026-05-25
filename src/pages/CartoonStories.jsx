// pages/CartoonStories.jsx
// SEO App.jsx ke PageSEO se handle hoti hai (/cartoons route)
// IslamicCartoonStories ke andar bhi Helmet hai — dono milke kaam karte hain

import { Suspense, lazy } from 'react'

const IslamicCartoonStories = lazy(() => import('../components/IslamicCartoonStories'))

function CartoonStoriesSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Islamic cartoon stories load ho rahi hain"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '1.5rem',
        padding: '1.5rem',
        minHeight: '500px',
      }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{ borderRadius: '14px', overflow: 'hidden' }}>
          <div style={{
            height: '160px',
            background: 'linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.4s infinite',
          }} />
          <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#141414' }}>
            <div style={{ height: '14px', width: '75%', borderRadius: '6px', background: 'linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
            <div style={{ height: '12px', width: '50%', borderRadius: '6px', background: 'linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
          </div>
        </div>
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

export default function CartoonStories() {
  return (
    <main>
      <h1 className="sr-only">Islamic Cartoon Stories — Bachon Ke Liye Islami Kahaniyan</h1>
      <Suspense fallback={<CartoonStoriesSkeleton />}>
        <IslamicCartoonStories />
      </Suspense>
    </main>
  )
}