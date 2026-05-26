// src/components/BooksGrid.jsx
import React from 'react';
import { SAHIH_MUSLIM_BOOKS } from '../data/booksList';

const BooksGrid = ({ onSelectBook, selectedBookId }) => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📚 Sahih Muslim — Books</h2>
      <div style={styles.grid}>
        {SAHIH_MUSLIM_BOOKS.map((book) => (
          <button
            key={book.id}
            onClick={() => onSelectBook(book.id)}
            style={{
              ...styles.bookCard,
              ...(selectedBookId === book.id ? styles.activeCard : {}),
            }}
          >
            <span style={styles.icon}>{book.icon}</span>
            <h3 style={styles.bookTitle}>{book.title}</h3>
            <p style={styles.bookArabic}>{book.titleArabic}</p>
            <p style={styles.bookEnglish}>{book.english}</p>
            <span style={styles.count}>{book.hadithCount} Hadiths</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  heading: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: '32px',
    fontSize: '28px',
    fontWeight: '700',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '16px',
  },
  bookCard: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    padding: '24px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  activeCard: {
    border: '2px solid #667eea',
    boxShadow: '0 0 20px rgba(102, 126, 234, 0.4)',
    transform: 'translateY(-4px)',
  },
  icon: {
    fontSize: '40px',
    marginBottom: '8px',
  },
  bookTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
    color: '#e0e0e0',
  },
  bookArabic: {
    fontSize: '18px',
    fontFamily: '"Scheherazade New", serif',
    color: '#e8d5b7',
    margin: 0,
  },
  bookEnglish: {
    fontSize: '13px',
    color: '#888',
    margin: 0,
  },
  count: {
    background: 'rgba(102, 126, 234, 0.2)',
    color: '#667eea',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    marginTop: '8px',
  },
};

export default BooksGrid;