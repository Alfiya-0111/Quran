// src/data/booksList.js — Sahih Muslim Books Metadata

export const SAHIH_MUSLIM_INFO = {
  id: 'sahih-muslim',
  name: 'Sahih Muslim',
  nameArabic: 'صحيح مسلم',
  nameUrdu: 'صحیح مسلم',
  author: 'Imam Muslim ibn al-Hajjaj al-Naysaburi',
  authorArabic: 'الإمام مسلم بن الحجاج النيسابوري',
  died: '261 AH',
  description: 'One of the six major hadith collections (Kutub al-Sittah). Considered second only to Sahih al-Bukhari in authenticity.',
  totalHadiths: 7563,
  totalChapters: 2200,
  language: ['Arabic', 'English'],
  source: 'https://hadithapi.pages.dev',
};

export const SAHIH_MUSLIM_BOOKS = [
  { id: 1, slug: 'iman', title: 'Kitab al-Iman', titleUrdu: 'کتاب الإیمان', titleArabic: 'كتاب الإيمان', english: 'The Book of Faith', hadithCount: 92, icon: '🕌' },
  { id: 2, slug: 'taharah', title: 'Kitab al-Taharah', titleUrdu: 'کتاب الطہارت', titleArabic: 'كتاب الطهارة', english: 'The Book of Purification', hadithCount: 146, icon: '💧' },
  { id: 3, slug: 'salah', title: 'Kitab al-Salah', titleUrdu: 'کتاب الصلاۃ', titleArabic: 'كتاب الصلاة', english: 'The Book of Prayer', hadithCount: 436, icon: '🤲' },
  { id: 4, slug: 'zakat', title: 'Kitab al-Zakat', titleUrdu: 'کتاب الزکوٰۃ', titleArabic: 'كتاب الزكاة', english: 'The Book of Charity', hadithCount: 132, icon: '💰' },
  { id: 5, slug: 'hajj', title: 'Kitab al-Hajj', titleUrdu: 'کتاب الحج', titleArabic: 'كتاب الحج', english: 'The Book of Pilgrimage', hadithCount: 312, icon: '🕋' },
  { id: 6, slug: 'nikah', title: 'Kitab al-Nikah', titleUrdu: 'کتاب النکاح', titleArabic: 'كتاب النكاح', english: 'The Book of Marriage', hadithCount: 169, icon: '💑' },
  { id: 7, slug: 'business', title: 'Kitab al-Buyu', titleUrdu: 'کتاب البیوع', titleArabic: 'كتاب البيوع', english: 'The Book of Business', hadithCount: 92, icon: '📊' },
  { id: 8, slug: 'jihad', title: 'Kitab al-Jihad', titleUrdu: 'کتاب الجہاد', titleArabic: 'كتاب الجهاد', english: 'The Book of Striving', hadithCount: 166, icon: '⚔️' },
  { id: 9, slug: 'food', title: 'Kitab al-At\'imah', titleUrdu: 'کتاب الأطعمة', titleArabic: 'كتاب الأطعمة', english: 'The Book of Food', hadithCount: 89, icon: '🍽️' },
  { id: 10, slug: 'jannah', title: 'Kitab al-Jannah', titleUrdu: 'کتاب الجنۃ', titleArabic: 'كتاب الجنة', english: 'The Book of Paradise', hadithCount: 82, icon: '🌟' },
  { id: 11, slug: 'riqaq', title: 'Kitab al-Riqaq', titleUrdu: 'کتاب الرقاق', titleArabic: 'كتاب الرقاق', english: 'The Book of Heart-Melting Traditions', hadithCount: 184, icon: '💔' },
  { id: 12, slug: 'dhikr', title: 'Kitab al-Dhikr', titleUrdu: 'کتاب الذکر', titleArabic: 'كتاب الذكر', english: 'The Book of Remembrance', hadithCount: 156, icon: '📿' },
  { id: 13, slug: 'dua', title: 'Kitab al-Dua', titleUrdu: 'کتاب الدعوات', titleArabic: 'كتاب الدعوات', english: 'The Book of Supplications', hadithCount: 147, icon: '🙏' },
  { id: 14, slug: 'manners', title: 'Kitab al-Adab', titleUrdu: 'کتاب الأدب', titleArabic: 'كتاب الأدب', english: 'The Book of Manners', hadithCount: 78, icon: '🎩' },
  { id: 15, slug: 'knowledge', title: 'Kitab al-Ilm', titleUrdu: 'کتاب العلم', titleArabic: 'كتاب العلم', english: 'The Book of Knowledge', hadithCount: 43, icon: '📚' },
  { id: 16, slug: 'judgement', title: 'Kitab al-Qadar', titleUrdu: 'کتاب القدر', titleArabic: 'كتاب القدر', english: 'The Book of Destiny', hadithCount: 52, icon: '⚖️' },
];

export default SAHIH_MUSLIM_BOOKS;