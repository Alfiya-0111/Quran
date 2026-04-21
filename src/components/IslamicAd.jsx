import { useState, useEffect } from 'react';

const ISLAMIC_ADS = [
  {
    id: 1,
    title: "Premium Miswak - Sunnah Toothbrush",
    description: "Natural teeth cleaning, Sunnah of Prophet Muhammad ﷺ",
    image: "https://via.placeholder.com/300x150?text=Premium+Miswak",
    link: "https://example.com/miswak",
    brand: "Sunnah Essentials",
    tag: "Sunnah Product"
  },
  {
    id: 2,
    title: "Digital Tasbih Counter",
    description: "Easy dhikr counting with LED display. 33, 66, 99, 100 beads mode",
    image: "https://via.placeholder.com/300x150?text=Digital+Tasbih",
    link: "https://example.com/tasbih",
    brand: "Tasbih Pro",
    tag: "Dhikr Tool"
  },
  {
    id: 3,
    title: "Tafsir Ibn Kathir - Complete Set",
    description: "Authentic Quranic commentary in English. 10 volumes set",
    image: "https://via.placeholder.com/300x150?text=Tafsir+Ibn+Kathir",
    link: "https://example.com/tafsir",
    brand: "Darussalam",
    tag: "Islamic Book"
  },
  {
    id: 4,
    title: "Prayer Mat - Premium Velvet",
    description: "Soft velvet prayer mat with Kaaba design. Non-slip backing",
    image: "https://via.placeholder.com/300x150?text=Prayer+Mat",
    link: "https://example.com/prayermat",
    brand: "Muslim Gear",
    tag: "Prayer Essential"
  },
  {
    id: 5,
    title: "Quran Pen Reader",
    description: "Read & listen to Quran with word-by-word translation",
    image: "https://via.placeholder.com/300x150?text=Quran+Pen",
    link: "https://example.com/quranpen",
    brand: "Digital Quran",
    tag: "Learning Tool"
  },
  {
    id: 6,
    title: "Attar Collection - 6 Pack",
    description: "Alcohol-free Islamic perfumes. Oud, Musk, Amber & more",
    image: "https://via.placeholder.com/300x150?text=Attar+Collection",
    link: "https://example.com/attar",
    brand: "Pure Scents",
    tag: "Sunnah Fragrance"
  }
];
// ✅ Sirf Islamic products allow karo
const ALLOWED_CATEGORIES = [
  'islamic-books',
  'prayer-items', 
  'halal-food',
  'islamic-education',
  'modest-fashion'
];

// ❌ Block karo
const BLOCKED_CATEGORIES = [
  'finance',      // Riba risk
  'dating',       // Haram
  'alcohol',      // Haram
  'gambling',     // Haram
  'entertainment' // Mixed content
];
export default function IslamicAd() {
  const [currentAd, setCurrentAd] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Har 10 second mein ad change
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentAd(prev => (prev + 1) % ISLAMIC_ADS.length);
        setIsVisible(true);
      }, 500);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const ad = ISLAMIC_ADS[currentAd];

  if (!isVisible) return null;

  return (
    <a 
      href={ad.link} 
      target="_blank" 
      rel="noopener noreferrer"
      style={{
        display: 'block',
        textDecoration: 'none',
        margin: '20px auto',
        maxWidth: '400px',
      }}
    >
      <div style={{
        background: 'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.02) 100%)',
        border: '1px solid rgba(201,168,76,0.2)',
        borderRadius: '16px',
        padding: '16px',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(201,168,76,0.1)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      >
        {/* Tag */}
        <div style={{
          display: 'inline-block',
          background: 'rgba(201,168,76,0.15)',
          color: '#C9A84C',
          fontSize: '10px',
          padding: '4px 10px',
          borderRadius: '20px',
          marginBottom: '10px',
          letterSpacing: '1px',
        }}>
          {ad.tag}
        </div>

        {/* Image */}
        <img 
          src={ad.image} 
          alt={ad.title}
          style={{
            width: '100%',
            height: '150px',
            objectFit: 'cover',
            borderRadius: '10px',
            marginBottom: '12px',
          }}
        />

        {/* Content */}
        <h3 style={{
          color: '#e8dcc8',
          fontSize: '15px',
          margin: '0 0 6px',
          fontWeight: '500',
        }}>
          {ad.title}
        </h3>
        
        <p style={{
          color: '#8a7a6a',
          fontSize: '12px',
          lineHeight: '1.6',
          margin: '0 0 10px',
        }}>
          {ad.description}
        </p>

        {/* Brand */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{
            color: '#C9A84C',
            fontSize: '11px',
            opacity: 0.7,
          }}>
            {ad.brand}
          </span>
          <span style={{
            background: 'rgba(201,168,76,0.2)',
            color: '#C9A84C',
            fontSize: '11px',
            padding: '6px 14px',
            borderRadius: '20px',
          }}>
            Shop Now →
          </span>
        </div>
      </div>

      {/* Small label */}
      <p style={{
        textAlign: 'center',
        color: '#3a3028',
        fontSize: '10px',
        marginTop: '8px',
        letterSpacing: '1px',
      }}>
        Sponsored • Islamic Marketplace
      </p>
    </a>
  );
}