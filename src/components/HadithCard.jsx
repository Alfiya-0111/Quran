// src/components/HadithCard.jsx
import React from 'react';

const HadithCard = ({ hadith, bookName, showArabic = true }) => {
  if (!hadith) return null;

  const {
    id,
    arabic,
    english,
    chapterId,
    bookId,
    hadith_number,
    reference,
  } = hadith;

  return (
    <div className="hadith-card" style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.badge}>Hadith #{hadith_number || id}</span>
        <span style={styles.bookTag}>{bookName || 'Sahih Muslim'}</span>
      </div>

      {/* Arabic Text */}
      {showArabic && arabic && (
        <div style={styles.arabicContainer}>
          <p style={styles.arabicText} dir="rtl">
            {arabic}
          </p>
        </div>
      )}

      {/* English Translation */}
      {english && (
        <div style={styles.englishContainer}>
          {english.narrator && (
            <p style={styles.narrator}>
              <strong>Narrator:</strong> {english.narrator}
            </p>
          )}
          <p style={styles.englishText}>{english.text}</p>
        </div>
      )}

      {/* Reference */}
      <div style={styles.footer}>
        <span style={styles.reference}>
          Reference: {reference || `Sahih Muslim, Book ${bookId}, Hadith ${id}`}
        </span>
        {chapterId && (
          <span style={styles.chapter}>Chapter: {chapterId}</span>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '20px',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    color: '#fff',
    transition: 'transform 0.2s ease',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '8px',
  },
  badge: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#fff',
  },
  bookTag: {
    background: 'rgba(255,255,255,0.1)',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    color: '#a0a0a0',
  },
  arabicContainer: {
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    borderRight: '4px solid #667eea',
  },
  arabicText: {
    fontFamily: '"Scheherazade New", "Traditional Arabic", "Arial", serif',
    fontSize: '22px',
    lineHeight: '2',
    color: '#e8d5b7',
    textAlign: 'right',
    margin: 0,
  },
  englishContainer: {
    padding: '4px',
  },
  narrator: {
    color: '#b8c5d6',
    fontSize: '14px',
    marginBottom: '12px',
    fontStyle: 'italic',
  },
  englishText: {
    fontSize: '16px',
    lineHeight: '1.8',
    color: '#e0e0e0',
    margin: 0,
  },
  footer: {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '8px',
    fontSize: '12px',
    color: '#888',
  },
  reference: {},
  chapter: {},
};

export default HadithCard;