import React from 'react';
import { X, Video, Sparkles, ExternalLink } from 'lucide-react';

const YouTubePlayer = ({ story, onClose }) => {
  const embedSrc = `https://www.youtube.com/embed/${story.youtubeId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div 
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Playing ${story.title}`}
    >
      <div 
        style={{ width: '100%', maxWidth: 860, background: '#141414', borderRadius: 24, border: '1px solid #2a2a2a', overflow: 'hidden', maxHeight: '92vh', overflowY: 'auto' }} 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', position: 'relative', textAlign: 'center' }}>
          <button 
            onClick={onClose} 
            style={{ position: 'absolute', top: 16, right: 16, background: '#2a2a2a', border: 'none', color: '#aaa', cursor: 'pointer', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Close player"
          >
            <X size={20} aria-hidden="true" />
          </button>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${story.color}20`, border: `1px solid ${story.color}40`, padding: '5px 14px', borderRadius: 30, marginBottom: 12, fontSize: '0.8rem', color: story.color, fontWeight: 600 }}>
            <Video size={14} aria-hidden="true" /> {story.channel}
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f5f5f5', marginBottom: 4 }}>{story.titleHindi || story.title}</h2>
          <p style={{ color: '#888', fontSize: '0.95rem', fontFamily: "'Noto Nastaliq Urdu', serif" }}>{story.titleUrdu}</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 12 }}>
            {story.language.map(l => (
              <span key={l} style={{ background: '#2a2a2a', color: '#aaa', padding: '3px 12px', borderRadius: 20, fontSize: '0.75rem' }}>{l}</span>
            ))}
          </div>
        </div>

        {/* Video */}
        <div style={{ padding: '0 24px' }}>
          <div style={{ aspectRatio: '16/9', borderRadius: 16, overflow: 'hidden', background: '#000' }}>
            <iframe
              width="100%" 
              height="100%"
              src={embedSrc}
              title={story.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>

        {/* Moral */}
        <div style={{ margin: '20px 24px', background: `${story.color}12`, border: `1px solid ${story.color}30`, borderRadius: 16, padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `${story.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Sparkles size={18} color={story.color} aria-hidden="true" />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: '#666', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Today's Lesson / आज का सबक</p>
            <p style={{ fontSize: '0.95rem', color: '#f5f5f5', fontStyle: 'italic', lineHeight: 1.6 }}>{story.moralHindi || story.moral}</p>
          </div>
        </div>

        {/* External Link */}
        <div style={{ padding: '0 24px 24px', textAlign: 'center' }}>
          <a 
            href={`https://youtube.com/watch?v=${story.youtubeId}`} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: story.color, textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, padding: '10px 22px', background: `${story.color}15`, border: `1px solid ${story.color}40`, borderRadius: 30 }}
          >
            <ExternalLink size={15} aria-hidden="true" /> YouTube par dekhein
          </a>
        </div>
      </div>
    </div>
  );
};

export default YouTubePlayer;