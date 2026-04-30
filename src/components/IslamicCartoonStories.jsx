import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Heart, Share2, Bookmark, 
  ChevronLeft, ChevronRight, Star, Clock, Users, Sparkles,
  BookOpen, Shield, Crown, Sun, Moon, Wind, Flame,
  X, Download, Maximize2, RotateCcw, Music, Video, Image,
  Headphones, ExternalLink, Search, Globe, Filter
} from 'lucide-react';

// ==================== ALL STORIES DATA ====================

const allVideos = [
  // ---- IQRA CARTOON (English/Urdu) ----
  {
    id: 1, title: "Nabi Adam (AS) - Pehla Insaan", titleUrdu: "حضرت آدمؑ - پہلا انسان", titleHindi: "नबी आदम (अस) - पहला इंसान",
    category: "Prophets", channel: "IQRA Cartoon", channelId: "UCSL4Dn-FQlvHZiSKipQZMqw",
    duration: "11:45", ageGroup: "4-8 years", language: ["English", "Urdu"],
    color: "#c9a84c", type: "youtube", youtubeId: "fzOBRSvmSC8",
    moral: "Humility and repentance open Allah's mercy",
    moralHindi: "नम्रता और तौबा अल्लाह की रहमत खोलती है",
    description: "Nabi Adam (AS) ki kahani jannat se duniya tak"
  },
  {
    id: 2, title: "Nabi Nuh (AS) - The Great Ark", titleUrdu: "حضرت نوحؑ - بڑی کشتی", titleHindi: "नबी नूह (अस) - बड़ी कश्ती",
    category: "Prophets", channel: "IQRA Cartoon", channelId: "UCSL4Dn-FQlvHZiSKipQZMqw",
    duration: "15:30", ageGroup: "5-10 years", language: ["English", "Urdu"],
    color: "#4a9b8e", type: "youtube", youtubeId: "CgYVH9IYF3c",
    moral: "Patience in dawah brings divine help",
    moralHindi: "दावत में सब्र दिवानी मदद लाता है",
    description: "Nuh (AS) ki 950 saal ki dawat aur kashti ka waqia"
  },
  {
    id: 3, title: "Nabi Hud (AS) - Aad ki Qaum", titleUrdu: "حضرت ہودؑ - عاد کی قوم", titleHindi: "नबी हूद (अस) - आद की कौम",
    category: "Prophets", channel: "IQRA Cartoon", channelId: "UCSL4Dn-FQlvHZiSKipQZMqw",
    duration: "12:45", ageGroup: "5-10 years", language: ["English", "Urdu"],
    color: "#e07a5f", type: "youtube", youtubeId: "o4tcfC9LArs",
    moral: "Pride brings destruction, humility brings salvation",
    moralHindi: "घमंड विनाश लाता है, नम्रता नजात दिलाती है",
    description: "Hud (AS) aur Aad ki quam ki kahani"
  },
  {
    id: 4, title: "Nabi Isa (AS) - The Miracle Prophet", titleUrdu: "حضرت عیسیٰؑ - معجزات کا نبی", titleHindi: "नबी ईसा (अस) - मोजजात का नबी",
    category: "Prophets", channel: "IQRA Cartoon", channelId: "UCSL4Dn-FQlvHZiSKipQZMqw",
    duration: "14:15", ageGroup: "6-12 years", language: ["English", "Urdu"],
    color: "#9db4c0", type: "youtube", youtubeId: "ZEBa_yFjvq8",
    moral: "Allah's power knows no limits",
    moralHindi: "अल्लाह की कुदरत की कोई हद नहीं",
    description: "Isa (AS) ke mojzaat aur unki kahani"
  },
  {
    id: 5, title: "Story of Prophet Lut (AS)", titleUrdu: "حضرت لوطؑ کی کہانی", titleHindi: "नबी लूत (अस) की कहानी",
    category: "Prophets", channel: "IQRA Cartoon", channelId: "UCSL4Dn-FQlvHZiSKipQZMqw",
    duration: "13:20", ageGroup: "6-12 years", language: ["English", "Urdu"],
    color: "#7c9885", type: "youtube", youtubeId: "R9L2F3n_y7M",
    moral: "Stay away from evil and trust Allah",
    moralHindi: "बुराई से दूर रहो और अल्लाह पर भरोसा करो",
    description: "Lut (AS) aur unki quam ki kahani"
  },
  {
    id: 6, title: "Story of Prophet Sulaiman (AS)", titleUrdu: "حضرت سلیمانؑ کی کہانی", titleHindi: "नबी सुलेमान (अस) की कहानी",
    category: "Prophets", channel: "IQRA Cartoon", channelId: "UCSL4Dn-FQlvHZiSKipQZMqw",
    duration: "16:00", ageGroup: "6-12 years", language: ["English", "Urdu"],
    color: "#c9a84c", type: "youtube", youtubeId: "nK9_2L6vL9A",
    moral: "True power comes with gratitude to Allah",
    moralHindi: "सच्ची ताकत अल्लाह के शुक्र के साथ आती है",
    description: "Sulaiman (AS) ke mojzaat aur unka raj"
  },

  // ---- IQRA CARTOON HINDI ----
  {
    id: 10, title: "Nabi Yunus (AS) - Machli ka Waqia", titleUrdu: "حضرت یونسؑ - مچھلی کا واقعہ", titleHindi: "नबी यूनुस (अस) - मछली का वाकया",
    category: "Prophets", channel: "IQRA Cartoon Hindi", channelId: "UCpIi4xyFRi0cKW-wMf4GNEA",
    duration: "20:30", ageGroup: "5-12 years", language: ["Hindi"],
    color: "#3d5a80", type: "youtube", youtubeId: "mL3nM2JdLdM",
    moral: "Patience, repentance, and Allah's boundless mercy",
    moralHindi: "सब्र, तौबा और अल्लाह की बेहिसाब रहमत",
    description: "Yunus (AS) ka machli ke pet mein tauba"
  },
  {
    id: 11, title: "Nabi Yusuf (AS) - Khoobsurat Nabi", titleUrdu: "حضرت یوسفؑ - خوبصورت نبی", titleHindi: "नबी यूसुफ (अस) - खूबसूरत नबी",
    category: "Prophets", channel: "IQRA Cartoon Hindi", channelId: "UCpIi4xyFRi0cKW-wMf4GNEA",
    duration: "18:45", ageGroup: "6-12 years", language: ["Hindi"],
    color: "#81b29a", type: "youtube", youtubeId: "kX7M9L8nQ2A",
    moral: "Beauty of character is greater than physical beauty",
    moralHindi: "चरित्र की खूबसूरती जिस्मानी खूबसूरती से बड़ी है",
    description: "Yusuf (AS) ki sabr aur husn ki kahani"
  },
  {
    id: 12, title: "Nabi Saleh (AS) - Oont ki Qaum", titleUrdu: "حضرت صالحؑ - اونٹ کی قوم", titleHindi: "नबी सालेह (अस) - ऊंट की कौम",
    category: "Prophets", channel: "IQRA Cartoon Hindi", channelId: "UCpIi4xyFRi0cKW-wMf4GNEA",
    duration: "14:30", ageGroup: "5-10 years", language: ["Hindi"],
    color: "#f2cc8f", type: "youtube", youtubeId: "4H8xpqVw07g",
    moral: "Disobedience to Allah brings destruction",
    moralHindi: "अल्लाह की नाफरमानी विनाश लाती है",
    description: "Saleh (AS) aur Thamud ki quam"
  },
  {
    id: 13, title: "Nabi Musa (AS) - Firon se Jung", titleUrdu: "حضرت موسیٰؑ - فرعون سے جنگ", titleHindi: "नबी मूसा (अस) - फिरौन से जंग",
    category: "Prophets", channel: "IQRA Cartoon Hindi", channelId: "UCpIi4xyFRi0cKW-wMf4GNEA",
    duration: "22:00", ageGroup: "7-12 years", language: ["Hindi"],
    color: "#7c9885", type: "youtube", youtubeId: "7-fFMnBqLBg",
    moral: "Truth always defeats falsehood",
    moralHindi: "सच हमेशा झूठ पर जीत हासिल करता है",
    description: "Musa (AS) ka Firon se muqabla"
  },
  {
    id: 14, title: "Nabi Ibrahim (AS) - Aag Mein Nahi Jala", titleUrdu: "حضرت ابراہیمؑ - آگ میں نہیں جلا", titleHindi: "नबी इब्राहीम (अस) - आग में नहीं जला",
    category: "Prophets", channel: "IQRA Cartoon Hindi", channelId: "UCpIi4xyFRi0cKW-wMf4GNEA",
    duration: "18:20", ageGroup: "6-12 years", language: ["Hindi"],
    color: "#d4a574", type: "youtube", youtubeId: "3eFCUkW6bkQ",
    moral: "True faith requires sacrifice and trust",
    moralHindi: "सच्चा ईमान कुर्बानी और भरोसे मांगता है",
    description: "Ibrahim (AS) ka imtihaan aur Nimrod se muqabla"
  },

  // ---- KIDS HUT URDU (Animated Islamic for kids - Urdu) ----
  {
    id: 20, title: "Namaz ka Tariqa - Animated", titleUrdu: "نماز کا طریقہ - اینیمیٹڈ", titleHindi: "नमाज का तरीका - एनिमेटेड",
    category: "Islamic Learning", channel: "Kids Hut Urdu", channelId: "UCq-XFXQ6kRbCvGvZq9T3AyA",
    duration: "8:30", ageGroup: "4-8 years", language: ["Urdu"],
    color: "#e07a5f", type: "youtube", youtubeId: "Q2L8N3K1P5A",
    moral: "Salah is our direct connection with Allah",
    moralHindi: "नमाज अल्लाह से हमारा सीधा कनेक्शन है",
    description: "Bachon ke liye namaz ka aasaan tariqa"
  },
  {
    id: 21, title: "Bismillah Song for Kids", titleUrdu: "بچوں کے لیے بسم اللہ سونگ", titleHindi: "बच्चों के लिए बिस्मिल्लाह सॉंग",
    category: "Islamic Learning", channel: "Kids Hut Urdu", channelId: "UCq-XFXQ6kRbCvGvZq9T3AyA",
    duration: "4:00", ageGroup: "3-7 years", language: ["Urdu"],
    color: "#c9a84c", type: "youtube", youtubeId: "W4R8N2J7M9B",
    moral: "Start everything with Allah's name",
    moralHindi: "हर काम की शुरुआत अल्लाह के नाम से करो",
    description: "Har kaam Bismillah se shuru karo"
  },
  {
    id: 22, title: "99 Names of Allah for Kids", titleUrdu: "اللہ کے 99 نام بچوں کے لیے", titleHindi: "बच्चों के लिए अल्लाह के 99 नाम",
    category: "Islamic Learning", channel: "Kids Hut Urdu", channelId: "UCq-XFXQ6kRbCvGvZq9T3AyA",
    duration: "10:15", ageGroup: "5-12 years", language: ["Urdu", "English"],
    color: "#4a9b8e", type: "youtube", youtubeId: "L6K3P8N2R4T",
    moral: "Know Allah through His beautiful names",
    moralHindi: "अल्लाह के खूबसूरत नामों से उसे पहचानो",
    description: "Asmaul Husna bachon ke liye"
  },

  // ---- OMAR & HANA (English/Malay - popular Islamic cartoon) ----
  {
    id: 30, title: "Omar & Hana - Ramadan Mubarak", titleUrdu: "عمر اور ہانا - رمضان مبارک", titleHindi: "उमर और हाना - रमजान मुबारक",
    category: "Animated Series", channel: "Omar & Hana", channelId: "UCMo74mGFCkpH7LJRS3qJoSQ",
    duration: "5:30", ageGroup: "3-8 years", language: ["English"],
    color: "#f2cc8f", type: "youtube", youtubeId: "Y8M2N4K6P3A",
    moral: "Ramadan is a blessing for all Muslims",
    moralHindi: "रमजान सभी मुसलमानों के लिए एक नेमत है",
    description: "Omar aur Hana ke saath Ramadan celebrate karo"
  },
  {
    id: 31, title: "Omar & Hana - Alhamdulillah", titleUrdu: "عمر اور ہانا - الحمداللہ", titleHindi: "उमर और हाना - अलहमदुलिल्लाह",
    category: "Animated Series", channel: "Omar & Hana", channelId: "UCMo74mGFCkpH7LJRS3qJoSQ",
    duration: "4:10", ageGroup: "3-8 years", language: ["English"],
    color: "#81b29a", type: "youtube", youtubeId: "B4N7M9K2L8P",
    moral: "Be grateful to Allah for everything",
    moralHindi: "हर चीज के लिए अल्लाह का शुक्र करो",
    description: "Shukr aur Alhamdulillah kehna seekho"
  },
  {
    id: 32, title: "Omar & Hana - Dua Before Sleeping", titleUrdu: "عمر اور ہانا - سونے سے پہلے دعا", titleHindi: "उमर और हाना - सोने से पहले दुआ",
    category: "Animated Series", channel: "Omar & Hana", channelId: "UCMo74mGFCkpH7LJRS3qJoSQ",
    duration: "3:45", ageGroup: "3-8 years", language: ["English"],
    color: "#9db4c0", type: "youtube", youtubeId: "C5D8E1F4H7I",
    moral: "Read dua before sleeping every night",
    moralHindi: "हर रात सोने से पहले दुआ पढ़ो",
    description: "Sone se pehle ki dua seekho Omar aur Hana ke saath"
  },
  {
    id: 33, title: "Omar & Hana - Wudu Song", titleUrdu: "عمر اور ہانا - وضو کا گانا", titleHindi: "उमर और हाना - वुजू का गाना",
    category: "Animated Series", channel: "Omar & Hana", channelId: "UCMo74mGFCkpH7LJRS3qJoSQ",
    duration: "3:20", ageGroup: "3-8 years", language: ["English"],
    color: "#4a9b8e", type: "youtube", youtubeId: "D9G2H5J8K1L",
    moral: "Cleanliness is half of faith",
    moralHindi: "सफाई आधा ईमान है",
    description: "Wudu ka sahi tariqa gane ke zariye"
  },

  // ---- LITTLE MUSLIMS (English animated) ----
  {
    id: 40, title: "Five Pillars of Islam - Animation", titleUrdu: "اسلام کے پانچ ستون - اینیمیشن", titleHindi: "इस्लाम के पांच स्तंभ - एनिमेशन",
    category: "Islamic Learning", channel: "Little Muslims", channelId: "UCCi46pqxEhqFEMSXm5k3l0g",
    duration: "6:45", ageGroup: "5-12 years", language: ["English"],
    color: "#c9a84c", type: "youtube", youtubeId: "E3F4G6H9J2M",
    moral: "Five pillars are the foundation of a Muslim's life",
    moralHindi: "पांच स्तंभ मुसलमान की जिंदगी की बुनियाद हैं",
    description: "Islam ke 5 arkan animated tariqe se"
  },
  {
    id: 41, title: "Surah Al-Fatiha for Kids", titleUrdu: "بچوں کے لیے سورہ الفاتحہ", titleHindi: "बच्चों के लिए सूरह अल-फातिहा",
    category: "Quran Learning", channel: "Little Muslims", channelId: "UCCi46pqxEhqFEMSXm5k3l0g",
    duration: "5:00", ageGroup: "4-10 years", language: ["English", "Urdu"],
    color: "#81b29a", type: "youtube", youtubeId: "F5H7J8K1L4N",
    moral: "Al-Fatiha is the heart of Quran",
    moralHindi: "अल-फातिहा कुरान का दिल है",
    description: "Surah Fatiha tarjume ke saath seekho"
  },

  // ---- QURAN FOR KIDS Hindi ----
  {
    id: 50, title: "Surah Ikhlas - Hindi Tafseer", titleUrdu: "سورہ اخلاص - ہندی تفسیر", titleHindi: "सूरह इखलास - हिंदी तफसीर",
    category: "Quran Learning", channel: "Quran Hindi", channelId: "UCvN_r5zAa9DHbHIFIX9AQNQ",
    duration: "7:30", ageGroup: "5-12 years", language: ["Hindi"],
    color: "#c9a84c", type: "youtube", youtubeId: "G7I9K2L5M8P",
    moral: "Allah is One, He has no partner",
    moralHindi: "अल्लाह एक है, उसका कोई शरीक नहीं",
    description: "Surah Ikhlas ka matlab Hindi mein samjho"
  },
  {
    id: 51, title: "Surah Al-Asr - Time is Precious", titleUrdu: "سورہ العصر - وقت قیمتی ہے", titleHindi: "सूरह अल-अस्र - वक्त कीमती है",
    category: "Quran Learning", channel: "Quran Hindi", channelId: "UCvN_r5zAa9DHbHIFIX9AQNQ",
    duration: "6:00", ageGroup: "5-12 years", language: ["Hindi"],
    color: "#e07a5f", type: "youtube", youtubeId: "H9K2L5N8Q1R",
    moral: "Value your time and do good deeds",
    moralHindi: "अपने वक्त की कद्र करो और नेक काम करो",
    description: "Surah Asr ka maqsad samjho"
  },

  // ---- ISLAMIC CARTOONS FOR KIDS (Multi-language) ----
  {
    id: 60, title: "Hajj - Steps for Kids Animated", titleUrdu: "حج - بچوں کے لیے قدم بہ قدم", titleHindi: "हज - बच्चों के लिए कदम दर कदम",
    category: "Islamic Learning", channel: "Islamic Kids TV", channelId: "UCi2SRc-sMFI-hJpD7_3Z0Fg",
    duration: "12:00", ageGroup: "7-12 years", language: ["English", "Urdu"],
    color: "#3d5a80", type: "youtube", youtubeId: "I1L4M7N0Q3S",
    moral: "Unity of Ummah starts with understanding Hajj",
    moralHindi: "उम्मत की एकता हज को समझने से शुरू होती है",
    description: "Hajj ke arkan bachon ke liye"
  },
  {
    id: 61, title: "Zakat & Sadaqah - Giving is Beautiful", titleUrdu: "زکوٰۃ اور صدقہ - دینا خوبصورت ہے", titleHindi: "जकात और सदका - देना खूबसूरत है",
    category: "Islamic Learning", channel: "Islamic Kids TV", channelId: "UCi2SRc-sMFI-hJpD7_3Z0Fg",
    duration: "9:15", ageGroup: "5-10 years", language: ["English"],
    color: "#81b29a", type: "youtube", youtubeId: "J3M6N9P2R5T",
    moral: "Sharing brings barakah in everything",
    moralHindi: "बांटने से हर चीज में बरकत आती है",
    description: "Zakat aur sadaqah ki importance"
  },

  // ---- BAYYINAH TV / NOUMAN ALI KHAN (for older kids/adults) ----
  {
    id: 70, title: "Why Quran - Nouman Ali Khan", titleUrdu: "قرآن کیوں - نعمان علی خان", titleHindi: "कुरान क्यों - नुमान अली खान",
    category: "For Adults", channel: "Nouman Ali Khan", channelId: "UCIIVEQGRlP2pLlx-fXB7cQQ",
    duration: "18:00", ageGroup: "14+ years", language: ["English"],
    color: "#3d405b", type: "youtube", youtubeId: "K5N8P3Q6S9U",
    moral: "The Quran is guidance for all of mankind",
    moralHindi: "कुरान पूरी इंसानियत के लिए हिदायत है",
    description: "Quran ke zaroorat aur maqsad samjho"
  },
  {
    id: 71, title: "Concept of Tawakkul in Islam", titleUrdu: "اسلام میں توکل کا تصور", titleHindi: "इस्लाम में तवक्कुल का तसव्वुर",
    category: "For Adults", channel: "Nouman Ali Khan", channelId: "UCIIVEQGRlP2pLlx-fXB7cQQ",
    duration: "22:00", ageGroup: "14+ years", language: ["English"],
    color: "#4a9b8e", type: "youtube", youtubeId: "L7P0Q4S8U2V",
    moral: "Trust Allah completely — He is the Best Planner",
    moralHindi: "अल्लाह पर पूरा भरोसा करो — वो बेहतरीन प्लानर है",
    description: "Tawakkul aur Allah par bharosa"
  },

  // ---- ISLAMIC LECTURES Hindi/Urdu ----
  {
    id: 80, title: "Bachon ki Tarbiyat - Islamic Parenting", titleUrdu: "بچوں کی تربیت - اسلامی والدین", titleHindi: "बच्चों की तरबियत - इस्लामी पेरेंटिंग",
    category: "For Adults", channel: "Islamic Hindi TV", channelId: "UCHindiIslamicTV",
    duration: "25:00", ageGroup: "Parents", language: ["Hindi", "Urdu"],
    color: "#c9a84c", type: "youtube", youtubeId: "M9R2T5U8W1X",
    moral: "Raising righteous children is the greatest sadaqah jariya",
    moralHindi: "नेक बच्चों की परवरिश सबसे बड़ा सदका जारिया है",
    description: "Islami andaz mein bachon ki tarbiyat"
  },
  {
    id: 81, title: "Ramzan Ki Fazilat - Hindi Bayan", titleUrdu: "رمضان کی فضیلت - ہندی بیان", titleHindi: "रमजान की फजीलत - हिंदी बयान",
    category: "For Adults", channel: "Islamic Hindi TV", channelId: "UCHindiIslamicTV",
    duration: "30:00", ageGroup: "14+ years", language: ["Hindi", "Urdu"],
    color: "#e07a5f", type: "youtube", youtubeId: "N1S4T7V0Y3Z",
    moral: "Ramadan is the month of Quran and forgiveness",
    moralHindi: "रमजान कुरान और माफी का महीना है",
    description: "Ramzan ki fazilat aur ibadat"
  },

  // ---- ANIMATED DUAS ----
  {
    id: 90, title: "Morning & Evening Duas Animated", titleUrdu: "صبح اور شام کی دعائیں", titleHindi: "सुबह और शाम की दुआएं",
    category: "Duas & Prayers", channel: "Dua Kids", channelId: "UCDuaKidsChannel",
    duration: "8:00", ageGroup: "All ages", language: ["Arabic", "English", "Urdu"],
    color: "#4a9b8e", type: "youtube", youtubeId: "O3U6W9Z2A5B",
    moral: "Start and end every day with remembrance of Allah",
    moralHindi: "हर दिन की शुरुआत और अंत अल्लाह की याद से करो",
    description: "Subah shaam ki masnoon duaein"
  },
  {
    id: 91, title: "Dua Before & After Eating", titleUrdu: "کھانے سے پہلے اور بعد کی دعا", titleHindi: "खाने से पहले और बाद की दुआ",
    category: "Duas & Prayers", channel: "Dua Kids", channelId: "UCDuaKidsChannel",
    duration: "4:30", ageGroup: "All ages", language: ["Arabic", "English", "Urdu"],
    color: "#f2cc8f", type: "youtube", youtubeId: "P5V8Y1B4C7D",
    moral: "Say Bismillah before eating and Alhamdulillah after",
    moralHindi: "खाने से पहले बिस्मिल्लाह और बाद में अलहमदुलिल्लाह कहो",
    description: "Khane ki masnoon duaein animated"
  },
  {
    id: 92, title: "Dua for Entering & Leaving Home", titleUrdu: "گھر میں داخل ہونے اور نکلنے کی دعا", titleHindi: "घर में दाखिल होने और निकलने की दुआ",
    category: "Duas & Prayers", channel: "Dua Kids", channelId: "UCDuaKidsChannel",
    duration: "5:00", ageGroup: "All ages", language: ["Arabic", "English"],
    color: "#e07a5f", type: "youtube", youtubeId: "Q7X0Y3Z6A9E",
    moral: "Seek Allah's protection every time you leave home",
    moralHindi: "घर से निकलते वक्त हर बार अल्लाह की हिफाजत मांगो",
    description: "Ghar mein daakhil hone aur nikalne ki dua"
  },

  // ---- QURAN RECITATION FOR KIDS ----
  {
    id: 100, title: "Surah Yaseen - Beautiful Recitation", titleUrdu: "سورہ یٰسین - خوبصورت تلاوت", titleHindi: "सूरह यासीन - खूबसूरत तिलावत",
    category: "Quran Learning", channel: "Quran Recitation", channelId: "UCQuranRecitation",
    duration: "28:00", ageGroup: "All ages", language: ["Arabic", "Urdu"],
    color: "#3d5a80", type: "youtube", youtubeId: "R9S2V5Y8Z1A",
    moral: "The heart of the Quran — recite it with love",
    moralHindi: "कुरान का दिल — इसे मोहब्बत से पढ़ो",
    description: "Surah Yaseen ki khoobsurat tilawat"
  },
  {
    id: 101, title: "Last 10 Surahs for Kids", titleUrdu: "بچوں کے لیے آخری 10 سورتیں", titleHindi: "बच्चों के लिए आखिरी 10 सूरतें",
    category: "Quran Learning", channel: "Quran Recitation", channelId: "UCQuranRecitation",
    duration: "15:00", ageGroup: "4-12 years", language: ["Arabic", "Urdu", "English"],
    color: "#c9a84c", type: "youtube", youtubeId: "S1T4U7X0Y3B",
    moral: "Memorize small surahs to read in every prayer",
    moralHindi: "छोटी सूरतें याद करो ताकि हर नमाज में पढ़ सको",
    description: "Bachon ke liye aakhri 10 surahs"
  },
];

// Channel info
const channels = [
  { id: "all", name: "All Channels", color: "#c9a84c" },
  { id: "IQRA Cartoon", name: "IQRA Cartoon", color: "#4a9b8e", url: "https://www.youtube.com/@IQRAcartoon" },
  { id: "IQRA Cartoon Hindi", name: "IQRA Hindi", color: "#e07a5f", url: "https://www.youtube.com/@IQRACartoonHindi" },
  { id: "Omar & Hana", name: "Omar & Hana", color: "#f2cc8f", url: "https://www.youtube.com/@OmarHana" },
  { id: "Kids Hut Urdu", name: "Kids Hut", color: "#81b29a", url: "" },
  { id: "Little Muslims", name: "Little Muslims", color: "#9db4c0", url: "" },
  { id: "Nouman Ali Khan", name: "Nouman Ali Khan", color: "#3d405b", url: "" },
  { id: "Islamic Hindi TV", name: "Islamic Hindi TV", color: "#c9a84c", url: "" },
  { id: "Dua Kids", name: "Dua Kids", color: "#7c9885", url: "" },
  { id: "Quran Recitation", name: "Quran", color: "#3d5a80", url: "" },
];

const categories = ["All", "Prophets", "Animated Series", "Islamic Learning", "Quran Learning", "Duas & Prayers", "For Adults"];
const languages = ["All", "Hindi", "Urdu", "English", "Arabic"];

// ==================== PARTICLE BACKGROUND ====================
const ParticleBackground = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedY: Math.random() * 0.4 + 0.1,
      opacity: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.5 ? '#c9a84c' : '#4a9b8e'
    }));
    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        p.y -= p.speedY;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(animate);
    };
    animate();
    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
};

// ==================== STORY CARD ====================
const StoryCard = ({ story, onClick, isFav, onFav }) => {
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const [thumbQuality, setThumbQuality] = useState('mqdefault');
  
  const thumb = imgErr
    ? `https://placehold.co/800x450/1a1a1a/c9a84c?text=${encodeURIComponent(story.title)}`
    : `https://i.ytimg.com/vi/${story.youtubeId}/${thumbQuality}.jpg`;

  return (
    <div
      style={{
        background: '#1a1a1a', border: `1px solid ${hovered ? story.color + '50' : '#2a2a2a'}`,
        borderRadius: '20px', overflow: 'hidden', cursor: 'pointer',
        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
        transform: hovered ? 'translateY(-7px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: hovered ? `0 20px 40px ${story.color}25` : '0 4px 20px rgba(0,0,0,0.3)'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(story)}
    >
      <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden' }}>
        <img src={thumb} alt={story.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: imgLoaded ? 1 : 0, transform: hovered ? 'scale(1.1)' : 'scale(1)', transition: 'all 0.5s ease' }}
          onLoad={() => setImgLoaded(true)}
          onError={() => {
            if (thumbQuality === 'mqdefault') {
              setThumbQuality('0');
            } else {
              setImgErr(true);
            }
          }}
        />
        {!imgLoaded && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)' }} />}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', opacity: hovered ? 1 : 0, transition: '0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: story.color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
            <Play size={24} color="white" style={{ marginLeft: 3 }} />
          </div>
        </div>
        {/* Badges */}
        <div style={{ position: 'absolute', top: 10, left: 10, background: `${story.color}25`, border: `1px solid ${story.color}60`, color: story.color, padding: '3px 9px', borderRadius: 8, fontSize: '0.7rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, backdropFilter: 'blur(8px)' }}>
          <Video size={11} /> {story.channel}
        </div>
        <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.75)', color: '#fff', padding: '3px 9px', borderRadius: 8, fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={11} /> {story.duration}
        </div>
        <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(0,0,0,0.65)', color: '#bbb', padding: '3px 8px', borderRadius: 6, fontSize: '0.65rem', backdropFilter: 'blur(6px)' }}>
          {story.language.join(' • ')}
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f5f5f5', marginBottom: 4, lineHeight: 1.4 }}>
          {story.titleHindi || story.title}
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#777', marginBottom: 10, fontFamily: "'Noto Nastaliq Urdu', serif", lineHeight: 1.6 }}>
          {story.titleUrdu}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.75rem', color: '#555', background: '#141414', padding: '3px 9px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Users size={11} /> {story.ageGroup}
          </span>
          <button style={{ background: 'none', border: 'none', color: isFav ? '#e07a5f' : '#555', cursor: 'pointer', padding: 6, display: 'flex' }}
            onClick={e => { e.stopPropagation(); onFav(story.id); }}>
            <Heart size={16} fill={isFav ? '#e07a5f' : 'none'} />
          </button>
        </div>
        {story.moralHindi && (
          <p style={{ fontSize: '0.8rem', color: '#666', fontStyle: 'italic', marginTop: 10, paddingTop: 10, borderTop: '1px solid #2a2a2a', lineHeight: 1.5 }}>
            ✨ {story.moralHindi}
          </p>
        )}
      </div>
    </div>
  );
};

// ==================== YOUTUBE PLAYER ====================
const YouTubePlayer = ({ story, onClose }) => {
  const embedSrc = `https://www.youtube.com/embed/${story.youtubeId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={onClose}>
      <div style={{ width: '100%', maxWidth: 860, background: '#141414', borderRadius: 24, border: '1px solid #2a2a2a', overflow: 'hidden', maxHeight: '92vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', position: 'relative', textAlign: 'center' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: '#2a2a2a', border: 'none', color: '#aaa', cursor: 'pointer', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={20} />
          </button>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${story.color}20`, border: `1px solid ${story.color}40`, padding: '5px 14px', borderRadius: 30, marginBottom: 12, fontSize: '0.8rem', color: story.color, fontWeight: 600 }}>
            <Video size={14} /> {story.channel}
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
              width="100%" height="100%"
              src={embedSrc}
              title={story.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Moral */}
        <div style={{ margin: '20px 24px', background: `${story.color}12`, border: `1px solid ${story.color}30`, borderRadius: 16, padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `${story.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Sparkles size={18} color={story.color} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: '#666', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Today's Lesson / आज का सबक</p>
            <p style={{ fontSize: '0.95rem', color: '#f5f5f5', fontStyle: 'italic', lineHeight: 1.6 }}>{story.moralHindi || story.moral}</p>
          </div>
        </div>

        {/* External Link */}
        <div style={{ padding: '0 24px 24px', textAlign: 'center' }}>
          <a href={`https://youtube.com/watch?v=${story.youtubeId}`} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: story.color, textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, padding: '10px 22px', background: `${story.color}15`, border: `1px solid ${story.color}40`, borderRadius: 30 }}>
            <ExternalLink size={15} /> YouTube par dekhein
          </a>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN APP ====================
const IslamicCartoonStories = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeLang, setActiveLang] = useState("All");
  const [activeChannel, setActiveChannel] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStory, setSelectedStory] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const toggleFav = (id) => setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);

  const filtered = allVideos.filter(s => {
    const catMatch = activeCategory === "All" || s.category === activeCategory;
    const langMatch = activeLang === "All" || s.language.includes(activeLang);
    const chanMatch = activeChannel === "all" || s.channel === activeChannel;
    const q = searchQuery.toLowerCase();
    const searchMatch = !q || [s.title, s.titleHindi, s.titleUrdu, s.channel, s.category, s.description]
      .some(f => f && f.toLowerCase().includes(q));
    return catMatch && langMatch && chanMatch && searchMatch;
  });

  // Group by category for display
  const grouped = {};
  filtered.forEach(s => {
    if (!grouped[s.category]) grouped[s.category] = [];
    grouped[s.category].push(s);
  });

  const categoryIcons = {
    "Prophets": Crown, "Animated Series": Star, "Islamic Learning": BookOpen,
    "Quran Learning": BookOpen, "Duas & Prayers": Moon, "For Adults": Users
  };
  const categoryColors = {
    "Prophets": "#c9a84c", "Animated Series": "#4a9b8e", "Islamic Learning": "#e07a5f",
    "Quran Learning": "#81b29a", "Duas & Prayers": "#9db4c0", "For Adults": "#3d405b"
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f5f5f5', fontFamily: "'Inter', 'Noto Nastaliq Urdu', sans-serif", position: 'relative', overflowX: 'hidden' }}>
      <ParticleBackground />

      {/* Header */}
      <header style={{ textAlign: 'center', padding: '40px 20px 20px', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', padding: '7px 20px', borderRadius: 50, fontSize: '0.82rem', color: '#c9a84c', marginBottom: 16, fontWeight: 500 }}>
          <Sparkles size={15} /> Islamic Content Hub
        </div>
        <h1 style={{ fontSize: 'clamp(1.6rem,5vw,2.4rem)', fontWeight: 700, color: '#c9a84c', marginBottom: 8, fontFamily: "'Noto Nastaliq Urdu', serif" }}>
          Islamic Video Library
        </h1>
        <p style={{ color: '#888', fontSize: '1rem', marginBottom: 6 }}>इस्लामी वीडियो लाइब्रेरी / اسلامی ویڈیو لائبریری</p>
        <p style={{ color: '#555', fontSize: '0.85rem', marginBottom: 24 }}>{allVideos.length}+ Videos • Multiple Channels • Hindi • Urdu • English</p>

        {/* Search */}
        <div style={{ maxWidth: 520, margin: '0 auto 0', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
          <input type="text" placeholder="Search videos, channels, prophets..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '13px 16px 13px 46px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 16, color: '#f5f5f5', fontSize: '0.93rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
          />
        </div>
      </header>

      {/* Filter Toggle */}
      <div style={{ position: 'relative', zIndex: 2, padding: '16px 20px 0', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => setShowFilters(v => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: showFilters ? 'rgba(201,168,76,0.15)' : '#1a1a1a', border: `1px solid ${showFilters ? '#c9a84c' : '#2a2a2a'}`, color: showFilters ? '#c9a84c' : '#888', padding: '9px 18px', borderRadius: 30, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, fontFamily: 'inherit' }}>
          <Filter size={15} /> Filters {showFilters ? '▲' : '▼'}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div style={{ position: 'relative', zIndex: 2, padding: '16px 20px', background: '#111', borderBottom: '1px solid #1f1f1f' }}>
          {/* Categories */}
          <p style={{ fontSize: '0.72rem', color: '#555', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Category</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                style={{ padding: '6px 16px', borderRadius: 30, border: `1px solid ${activeCategory === cat ? '#c9a84c' : '#2a2a2a'}`, background: activeCategory === cat ? 'rgba(201,168,76,0.15)' : 'transparent', color: activeCategory === cat ? '#c9a84c' : '#888', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                {cat}
              </button>
            ))}
          </div>
          {/* Languages */}
          <p style={{ fontSize: '0.72rem', color: '#555', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Language</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {languages.map(lang => (
              <button key={lang} onClick={() => setActiveLang(lang)}
                style={{ padding: '6px 16px', borderRadius: 30, border: `1px solid ${activeLang === lang ? '#4a9b8e' : '#2a2a2a'}`, background: activeLang === lang ? 'rgba(74,155,142,0.15)' : 'transparent', color: activeLang === lang ? '#4a9b8e' : '#888', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                {lang}
              </button>
            ))}
          </div>
          {/* Channels */}
          <p style={{ fontSize: '0.72rem', color: '#555', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Channel</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {channels.map(ch => (
              <button key={ch.id} onClick={() => setActiveChannel(ch.id)}
                style={{ padding: '6px 16px', borderRadius: 30, border: `1px solid ${activeChannel === ch.id ? ch.color : '#2a2a2a'}`, background: activeChannel === ch.id ? `${ch.color}15` : 'transparent', color: activeChannel === ch.id ? ch.color : '#888', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                {ch.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick lang row */}
      <div style={{ position: 'relative', zIndex: 2, overflowX: 'auto', padding: '16px 20px', display: 'flex', gap: 10, scrollbarWidth: 'none' }}>
        {languages.map(lang => (
          <button key={lang} onClick={() => setActiveLang(lang)}
            style={{ padding: '8px 20px', borderRadius: 30, border: `1px solid ${activeLang === lang ? '#c9a84c' : 'transparent'}`, background: activeLang === lang ? 'rgba(201,168,76,0.12)' : '#1a1a1a', color: activeLang === lang ? '#c9a84c' : '#777', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            {lang === 'All' ? '🌐 All' : lang === 'Hindi' ? '🇮🇳 Hindi' : lang === 'Urdu' ? '🟢 Urdu' : lang === 'English' ? '🇬🇧 English' : '🕌 Arabic'}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div style={{ position: 'relative', zIndex: 2, padding: '0 20px 16px' }}>
        <p style={{ fontSize: '0.85rem', color: '#555' }}>
          {filtered.length} video{filtered.length !== 1 ? 's' : ''} found
          {activeCategory !== 'All' && ` in "${activeCategory}"`}
          {activeLang !== 'All' && ` • ${activeLang}`}
          {activeChannel !== 'all' && ` • ${activeChannel}`}
        </p>
      </div>

      {/* Content Sections */}
      <div style={{ position: 'relative', zIndex: 2, padding: '0 20px', paddingBottom: 120 }}>
        {Object.keys(grouped).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#555' }}>
            <Search size={52} />
            <p style={{ fontSize: '1.2rem', marginTop: 16, color: '#888' }}>Koi video nahi mili</p>
            <p style={{ fontSize: '0.9rem', marginTop: 6 }}>Try different filters ya search terms</p>
            <button onClick={() => { setActiveCategory('All'); setActiveLang('All'); setActiveChannel('all'); setSearchQuery(''); }}
              style={{ marginTop: 20, padding: '10px 24px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', borderRadius: 30, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem' }}>
              Reset Filters
            </button>
          </div>
        ) : (
          Object.entries(grouped).map(([cat, videos]) => {
            const Icon = categoryIcons[cat] || Star;
            const col = categoryColors[cat] || '#c9a84c';
            return (
              <section key={cat} style={{ marginBottom: 48 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 13, background: `${col}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color={col} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f0f0f0', marginBottom: 2 }}>{cat}</h2>
                    <p style={{ fontSize: '0.8rem', color: '#555' }}>{videos.length} videos</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 18 }}>
                  {videos.map(s => (
                    <StoryCard key={s.id} story={s} onClick={setSelectedStory} isFav={favorites.includes(s.id)} onFav={toggleFav} />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>

      {/* Player */}
      {selectedStory && (
        <YouTubePlayer story={selectedStory} onClose={() => setSelectedStory(null)} />
      )}

      {/* Bottom Nav */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(14,14,14,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid #1f1f1f', display: 'flex', justifyContent: 'space-around', padding: '12px 0 20px', zIndex: 200 }}>
        {[
          { name: 'Home', icon: Sun, action: () => { setActiveCategory('All'); setActiveLang('All'); setActiveChannel('all'); setSearchQuery(''); } },
          { name: 'Prophets', icon: Crown, action: () => setActiveCategory('Prophets') },
          { name: 'Kids', icon: Star, action: () => setActiveCategory('Animated Series') },
          { name: 'Quran', icon: BookOpen, action: () => setActiveCategory('Quran Learning') },
          { name: 'Saved', icon: Heart, action: () => {} },
        ].map(item => {
          const Icon = item.icon;
          return (
            <button key={item.name} onClick={item.action}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: '#555', cursor: 'pointer', transition: 'color 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#c9a84c'}
              onMouseLeave={e => e.currentTarget.style.color = '#555'}>
              <Icon size={22} />
              <span style={{ fontSize: '0.67rem', fontWeight: 500 }}>{item.name}</span>
            </button>
          );
        })}
      </nav>

      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        ::-webkit-scrollbar { width:5px; height:5px }
        ::-webkit-scrollbar-track { background:#0a0a0a }
        ::-webkit-scrollbar-thumb { background:#2a2a2a; border-radius:3px }
      `}</style>
    </div>
  );
};

export default IslamicCartoonStories;