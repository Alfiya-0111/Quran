import { useState, useEffect } from "react";

const COLORS = {
  bg: "#0c1118",
  surface: "#111827",
  card: "#1a2332",
  gold: "#C9A84C",
  goldLight: "#e8c97a",
  goldDim: "#8a6f30",
  goldFaint: "#C9A84C18",
  text: "#e8e0d0",
  textDim: "#8a9ab0",
};

const NAMES = [
  { num: 1,  arabic: "ٱللَّٰه",        transliteration: "Allah",          urdu: "اللہ",              meaning: "The Greatest Name — All encompassing", benefit: "Har mushkil mein 'Ya Allah' kehne se dil ko sukoon milta hai" },
  { num: 2,  arabic: "ٱلرَّحْمَٰن",    transliteration: "Ar-Rahman",      urdu: "بے حد مہربان",      meaning: "The Most Gracious — Merciful to all creation", benefit: "Duniya mein sab par rehmat — Muslim, Kafir, Janwar sab par" },
  { num: 3,  arabic: "ٱلرَّحِيم",      transliteration: "Ar-Raheem",      urdu: "بار بار رحم کرنے والا", meaning: "The Most Merciful — Especially to believers", benefit: "Aakhirat mein sirf momineen ke liye khas rehmat" },
  { num: 4,  arabic: "ٱلْمَلِك",       transliteration: "Al-Malik",       urdu: "بادشاہ",            meaning: "The King — Sovereign of all existence", benefit: "Asli badshah sirf Allah hai — dunya ki badshahi fanaa hai" },
  { num: 5,  arabic: "ٱلْقُدُّوس",     transliteration: "Al-Quddus",      urdu: "پاک",               meaning: "The Most Pure — Free from all imperfections", benefit: "Allah tamam aiboon se bilkul paak aur munazzah hai" },
  { num: 6,  arabic: "ٱلسَّلَام",      transliteration: "As-Salam",       urdu: "سلامتی دینے والا",  meaning: "The Source of Peace — Giver of safety", benefit: "Jannat ka ek naam bhi As-Salam hai — amaan ka ghar" },
  { num: 7,  arabic: "ٱلْمُؤْمِن",     transliteration: "Al-Mu'min",      urdu: "امان دینے والا",    meaning: "The Guardian of Faith — Bestower of security", benefit: "Raat ko so kar uthna — Allah ki amaan mein uthna hai" },
  { num: 8,  arabic: "ٱلْمُهَيْمِن",   transliteration: "Al-Muhaymin",    urdu: "نگہبان",            meaning: "The Protector — Watchful over all things", benefit: "Har waqt tumhari hifaazat mein lagaa hai" },
  { num: 9,  arabic: "ٱلْعَزِيز",      transliteration: "Al-Azeez",       urdu: "غالب",              meaning: "The Almighty — All Powerful, Invincible", benefit: "Koi takat Allah ki qudrat ko rok nahi sakti" },
  { num: 10, arabic: "ٱلْجَبَّار",     transliteration: "Al-Jabbar",      urdu: "زبردست",            meaning: "The Compeller — Restorer of broken things", benefit: "Toote dil ko sirf Al-Jabbar joR sakta hai" },
  { num: 11, arabic: "ٱلْمُتَكَبِّر",  transliteration: "Al-Mutakabbir",  urdu: "بڑائی والا",        meaning: "The Supreme — Possessor of all greatness", benefit: "Takabbur sirf Allah ko zaib deta hai — insaan ke liye aib" },
  { num: 12, arabic: "ٱلْخَالِق",      transliteration: "Al-Khaliq",      urdu: "پیدا کرنے والا",    meaning: "The Creator — Brings into existence from nothing", benefit: "Allah ne teen andheroon mein bachche ko banaya — qudrat!" },
  { num: 13, arabic: "ٱلْبَارِئ",      transliteration: "Al-Bari",        urdu: "بنانے والا",        meaning: "The Originator — Fashions creation distinctly", benefit: "Har cheez ko alaida aur khas shakl dene wala" },
  { num: 14, arabic: "ٱلْمُصَوِّر",    transliteration: "Al-Musawwir",    urdu: "صورت بنانے والا",   meaning: "The Fashioner — Gives shape to all creation", benefit: "Maa ke pet mein tumhari soorat Allah ne khud banayi" },
  { num: 15, arabic: "ٱلْغَفَّار",     transliteration: "Al-Ghaffar",     urdu: "بہت بخشنے والا",    meaning: "The Forgiving — Repeatedly forgives sins", benefit: "Baar baar maafi maango — Al-Ghaffar kabhi thakta nahi" },
  { num: 16, arabic: "ٱلْقَهَّار",     transliteration: "Al-Qahhar",      urdu: "قہر کرنے والا",     meaning: "The Subduer — Overpowers everything", benefit: "Zulm karne wale Al-Qahhar se bacha nahi kar sakte" },
  { num: 17, arabic: "ٱلْوَهَّاب",     transliteration: "Al-Wahhab",      urdu: "بہت دینے والا",     meaning: "The Bestower — Gives freely without return", benefit: "Manga karo — Al-Wahhab dene mein deri nahi karta" },
  { num: 18, arabic: "ٱلرَّزَّاق",     transliteration: "Ar-Razzaq",      urdu: "روزی دینے والا",    meaning: "The Provider — Sustains all of creation", benefit: "Teri rizq ka zimmah Allah ne apne upar liya hua hai" },
  { num: 19, arabic: "ٱلْفَتَّاح",     transliteration: "Al-Fattah",      urdu: "کھولنے والا",       meaning: "The Opener — Opens doors of provision and mercy", benefit: "Koi darwaza band ho — Al-Fattah se maango — woh khul jaayega" },
  { num: 20, arabic: "ٱلْعَلِيم",      transliteration: "Al-Aleem",       urdu: "سب جاننے والا",     meaning: "The All-Knowing — Knows all apparent and hidden", benefit: "Dil ki baat bhi jaanta hai — bolne ki zaroorat nahi" },
  { num: 21, arabic: "ٱلْقَابِض",      transliteration: "Al-Qabid",       urdu: "تنگی دینے والا",    meaning: "The Withholder — Restricts provision by wisdom", benefit: "Takhleef mein bhi Allah ki hikmat hai — qabz uski marzi" },
  { num: 22, arabic: "ٱلْبَاسِط",      transliteration: "Al-Basit",       urdu: "کشادگی دینے والا",  meaning: "The Expander — Extends provision and mercy", benefit: "Tangdasti ke baad kushada hogi — Al-Basit wada karta hai" },
  { num: 23, arabic: "ٱلْخَافِض",      transliteration: "Al-Khafid",      urdu: "پست کرنے والا",     meaning: "The Abaser — Lowers the arrogant and oppressors", benefit: "Mutakabbiron ko Allah khud jhukaa deta hai" },
  { num: 24, arabic: "ٱلرَّافِع",      transliteration: "Ar-Rafi",        urdu: "بلند کرنے والا",    meaning: "The Exalter — Raises the humble and righteous", benefit: "Jo jhuke Allah ke aage — duniya mein ooncha hua" },
  { num: 25, arabic: "ٱلْمُعِز",       transliteration: "Al-Mu'izz",      urdu: "عزت دینے والا",     meaning: "The Honourer — Bestows dignity and honour", benefit: "Asli izzat sirf Allah ke paas se milti hai" },
  { num: 26, arabic: "ٱلْمُذِل",       transliteration: "Al-Mudhill",     urdu: "ذلیل کرنے والا",    meaning: "The Dishonorer — Humiliates the arrogant", benefit: "Allah ke bina izzat ki talab — zillat ka raasta hai" },
  { num: 27, arabic: "ٱلسَّمِيع",      transliteration: "As-Sami",        urdu: "سننے والا",         meaning: "The All-Hearing — Hears every sound and prayer", benefit: "Raat ke andheron mein ki gayi dua bhi sunta hai" },
  { num: 28, arabic: "ٱلْبَصِير",      transliteration: "Al-Baseer",      urdu: "دیکھنے والا",       meaning: "The All-Seeing — Sees all things clearly", benefit: "Andhere mein bhi, akela bhi — Allah dekh raha hai" },
  { num: 29, arabic: "ٱلْحَكَم",       transliteration: "Al-Hakam",       urdu: "فیصلہ کرنے والا",   meaning: "The Judge — Final arbiter of all matters", benefit: "Duniya mein insaaf na mile — Al-Hakam ka faisla baaqi hai" },
  { num: 30, arabic: "ٱلْعَدْل",       transliteration: "Al-Adl",         urdu: "انصاف والا",        meaning: "The Just — Perfect in justice and fairness", benefit: "Har zulm ka hisaab hoga — Al-Adl sone deta nahi" },
  { num: 31, arabic: "ٱللَّطِيف",      transliteration: "Al-Lateef",      urdu: "لطیف",              meaning: "The Subtle — Gentle and kind in all matters", benefit: "Itne piyaar se sambhalta hai ke pata bhi nahi chalta" },
  { num: 32, arabic: "ٱلْخَبِير",      transliteration: "Al-Khabeer",     urdu: "باخبر",             meaning: "The All-Aware — Fully acquainted with all things", benefit: "Tumhare iradon se bhi waqif hai — andar bahar sab" },
  { num: 33, arabic: "ٱلْحَلِيم",      transliteration: "Al-Haleem",      urdu: "بردبار",            meaning: "The Forbearing — Patient with the disobedient", benefit: "Gunaah karte hain phir bhi rizq milti hai — Al-Haleem ki wajah se" },
  { num: 34, arabic: "ٱلْعَظِيم",      transliteration: "Al-Azeem",       urdu: "عظمت والا",         meaning: "The Magnificent — Possessor of absolute greatness", benefit: "Ayatul Kursi mein do baar — Al-Azeem kitna bada hai" },
  { num: 35, arabic: "ٱلْغَفُور",      transliteration: "Al-Ghafoor",     urdu: "معاف کرنے والا",    meaning: "The Forgiving — Covers and pardons sins", benefit: "Gunaah ke baad sharminda hona — Al-Ghafoor ki taraf lautna" },
  { num: 36, arabic: "ٱلشَّكُور",      transliteration: "Ash-Shakoor",    urdu: "قدردان",            meaning: "The Appreciative — Rewards good deeds greatly", benefit: "Chota sa amal bhi qubool karta aur badha ke deta hai" },
  { num: 37, arabic: "ٱلْعَلِي",       transliteration: "Al-Ali",         urdu: "بلند",              meaning: "The Most High — Supremely exalted above all", benefit: "Arsh ke upar hai — phir bhi dil ke paas hai" },
  { num: 38, arabic: "ٱلْكَبِير",      transliteration: "Al-Kabeer",      urdu: "بڑا",               meaning: "The Greatest — Incomparably great in all aspects", benefit: "Allahu Akbar — Allah sab se bada — har waqt yaad karo" },
  { num: 39, arabic: "ٱلْحَفِيظ",      transliteration: "Al-Hafeez",      urdu: "حفاظت کرنے والا",   meaning: "The Preserver — Protects and guards all things", benefit: "Safar mein 'Bismillah' — Al-Hafeez ki hifaazat mein" },
  { num: 40, arabic: "ٱلْمُقِيت",      transliteration: "Al-Muqeet",      urdu: "طاقت دینے والا",    meaning: "The Sustainer — Provides strength and nourishment", benefit: "Jism ki bhi, rooh ki bhi parwarish karta hai" },
  { num: 41, arabic: "ٱلْحَسِيب",      transliteration: "Al-Haseeb",      urdu: "حساب لینے والا",    meaning: "The Reckoner — Sufficient as an accountant", benefit: "Hasbunallah — Allah kaafi hai — hisaab woh rakhega" },
  { num: 42, arabic: "ٱلْجَلِيل",      transliteration: "Al-Jaleel",      urdu: "جلال والا",         meaning: "The Majestic — Possessor of divine glory", benefit: "Allah ka jalaal — aankhon ki taqat bhi bardaasht na kare" },
  { num: 43, arabic: "ٱلْكَرِيم",      transliteration: "Al-Kareem",      urdu: "بزرگ",              meaning: "The Generous — Infinitely generous and noble", benefit: "Maango — Al-Kareem se — woh dene mein sharminda nahi karta" },
  { num: 44, arabic: "ٱلرَّقِيب",      transliteration: "Ar-Raqeeb",      urdu: "نگران",             meaning: "The Watchful — Ever-watchful over all actions", benefit: "Akele mein bhi Allah ki nigrani — gunaah se bachao" },
  { num: 45, arabic: "ٱلْمُجِيب",      transliteration: "Al-Mujeeb",      urdu: "دعا قبول کرنے والا", meaning: "The Responsive — Answers all sincere prayers", benefit: "Dua karo — Al-Mujeeb zaroor sunta aur jawab deta hai" },
  { num: 46, arabic: "ٱلْوَاسِع",      transliteration: "Al-Wasi",        urdu: "وسعت والا",         meaning: "The Vast — Infinite in mercy and knowledge", benefit: "Allah ki rehmat itni vast hai — koi bhi bahar nahi" },
  { num: 47, arabic: "ٱلْحَكِيم",      transliteration: "Al-Hakeem",      urdu: "حکمت والا",         meaning: "The Wise — Perfect wisdom in all decrees", benefit: "Jo Allah karta hai — usme gehri hikmat hai — samajh lo" },
  { num: 48, arabic: "ٱلْوَدُود",      transliteration: "Al-Wadood",      urdu: "محبت کرنے والا",    meaning: "The Loving — Bestows love and affection", benefit: "Allah ka pyaar maa se bhi sattar guna zyada hai" },
  { num: 49, arabic: "ٱلْمَجِيد",      transliteration: "Al-Majeed",      urdu: "بزرگ",              meaning: "The Glorious — Possessor of perfect glory", benefit: "Ibrahim AS ke liye durood mein Al-Majeed ka zikr" },
  { num: 50, arabic: "ٱلْبَاعِث",      transliteration: "Al-Ba'ith",      urdu: "اٹھانے والا",       meaning: "The Resurrector — Raises the dead on Judgment Day", benefit: "Maut ke baad — Al-Ba'ith uthayega — phir hisaab" },
  { num: 51, arabic: "ٱلشَّهِيد",      transliteration: "Ash-Shaheed",    urdu: "گواہ",              meaning: "The Witness — Present and witnessing all things", benefit: "Allah khud gawah hai — koi baat chhupi nahi" },
  { num: 52, arabic: "ٱلْحَق",         transliteration: "Al-Haqq",        urdu: "سچ",                meaning: "The Truth — Absolute and eternal truth", benefit: "Sirf Allah hamesha tha, hai aur rahega — Al-Haqq" },
  { num: 53, arabic: "ٱلْوَكِيل",      transliteration: "Al-Wakeel",      urdu: "کارساز",            meaning: "The Trustee — Best disposer of affairs", benefit: "Hasbiyallahu wa ni'mal wakeel — sab Allah par chord do" },
  { num: 54, arabic: "ٱلْقَوِي",       transliteration: "Al-Qawiyy",      urdu: "قوت والا",          meaning: "The Strong — Possessor of absolute strength", benefit: "Duniya ki koi taqat Allah ki taqat se maat nahi" },
  { num: 55, arabic: "ٱلْمَتِين",      transliteration: "Al-Mateen",      urdu: "مضبوط",             meaning: "The Firm — Steadfast, never weakens or tires", benefit: "Allah ka koi faisla nahi badla — Mateen hai woh" },
  { num: 56, arabic: "ٱلْوَلِي",       transliteration: "Al-Waliyy",      urdu: "دوست",              meaning: "The Protector — Guardian and friend of believers", benefit: "Allah mominon ka wali hai — akela kab mahsoos karein" },
  { num: 57, arabic: "ٱلْحَمِيد",      transliteration: "Al-Hameed",      urdu: "قابل تعریف",        meaning: "The Praiseworthy — Deserving all praise always", benefit: "Alhamdulillah — tamam taarif sirf Allah ke liye" },
  { num: 58, arabic: "ٱلْمُحْصِي",     transliteration: "Al-Muhsi",       urdu: "شمار کرنے والا",    meaning: "The Accounter — Counts and records everything", benefit: "Har patta jo gira — Allah ne gina — sochein kitna khayal!" },
  { num: 59, arabic: "ٱلْمُبْدِئ",     transliteration: "Al-Mubdi",       urdu: "شروع کرنے والا",    meaning: "The Originator — Begins creation from nothing", benefit: "Pehli baar banaya — bina kisi cheez ke — sirf 'Kun' se" },
  { num: 60, arabic: "ٱلْمُعِيد",      transliteration: "Al-Mu'eed",      urdu: "لوٹانے والا",       meaning: "The Restorer — Brings back creation after death", benefit: "Jaise pehli baar banaya — dobaara bhi bana sakta hai" },
  { num: 61, arabic: "ٱلْمُحْيِي",     transliteration: "Al-Muhyi",       urdu: "زندگی دینے والا",   meaning: "The Giver of Life — Gives life to all things", benefit: "Raat ki neend se uthana — Al-Muhyi ka roz ka ehsaan" },
  { num: 62, arabic: "ٱلْمُمِيت",      transliteration: "Al-Mumeet",      urdu: "موت دینے والا",     meaning: "The Taker of Life — Causes death by His will", benefit: "Maut se daro mat — Al-Mumeet apna raaz rakhta hai" },
  { num: 63, arabic: "ٱلْحَي",         transliteration: "Al-Hayy",        urdu: "ہمیشہ زندہ",        meaning: "The Ever-Living — Lives eternally without end", benefit: "Al-Hayy Al-Qayyum — Ayatul Kursi ka qalb — yad karo" },
  { num: 64, arabic: "ٱلْقَيُّوم",     transliteration: "Al-Qayyum",      urdu: "قائم رکھنے والا",   meaning: "The Self-Subsisting — Maintains all existence", benefit: "Allah ke bina ek pal bhi kuch qaim nahi reh sakta" },
  { num: 65, arabic: "ٱلْوَاجِد",      transliteration: "Al-Wajid",       urdu: "پانے والا",         meaning: "The Finder — Finds whatever He wills", benefit: "Kuch bhi chhupa nahi Allah se — woh paata hai sab" },
  { num: 66, arabic: "ٱلْمَاجِد",      transliteration: "Al-Majid",       urdu: "شریف",              meaning: "The Noble — Glorious and munificent", benefit: "Allah ki shaan mein koi kami nahi — har taraf se kamal" },
  { num: 67, arabic: "ٱلْوَاحِد",      transliteration: "Al-Wahid",       urdu: "اکیلا",             meaning: "The One — Unique and without partner or equal", benefit: "La ilaha illallah — Al-Wahid — koi shareek nahi" },
  { num: 68, arabic: "ٱلْأَحَد",       transliteration: "Al-Ahad",        urdu: "یکتا",              meaning: "The Unique — Absolutely one in all aspects", benefit: "Qul huwa Allahu Ahad — ikhlaas ki poori surah yahi naam" },
  { num: 69, arabic: "ٱلصَّمَد",       transliteration: "As-Samad",       urdu: "بے نیاز",           meaning: "The Eternal — Independent, all depend on Him", benefit: "Sab Allah ke mohtaaj — woh kisi ka mohtaaj nahi" },
  { num: 70, arabic: "ٱلْقَادِر",      transliteration: "Al-Qadir",       urdu: "قدرت والا",         meaning: "The Capable — Has power over all things", benefit: "Jo chahe — jaise chahe — jab chahe — Al-Qadir karta hai" },
  { num: 71, arabic: "ٱلْمُقْتَدِر",   transliteration: "Al-Muqtadir",    urdu: "قادر",              meaning: "The Powerful — All-Prevailing in power", benefit: "Allah ki qudrat ke saamne sab sar jhukate hain" },
  { num: 72, arabic: "ٱلْمُقَدِّم",    transliteration: "Al-Muqaddim",    urdu: "آگے کرنے والا",     meaning: "The Expediter — Brings forward what He wills", benefit: "Jo aage aana chahiye — Allah aage kar deta hai" },
  { num: 73, arabic: "ٱلْمُؤَخِّر",    transliteration: "Al-Mu'akhkhir",  urdu: "پیچھے کرنے والا",   meaning: "The Delayer — Puts back what He wills", benefit: "Deri mein bhi Allah ki hikmat — Al-Mu'akhkhir jaanta hai" },
  { num: 74, arabic: "ٱلْأَوَّل",      transliteration: "Al-Awwal",       urdu: "پہلا",              meaning: "The First — Before all things, without beginning", benefit: "Kuch bhi tha nahi — Allah tha — Al-Awwal" },
  { num: 75, arabic: "ٱلْآخِر",        transliteration: "Al-Akhir",       urdu: "آخری",              meaning: "The Last — After all things, without end", benefit: "Sab fanaa ho jaayega — Allah rahega — Al-Akhir" },
  { num: 76, arabic: "ٱلظَّاهِر",      transliteration: "Az-Zahir",       urdu: "ظاہر",              meaning: "The Manifest — Evident through His signs", benefit: "Har taraf Allah ki nishaniyan hain — aankhein kholo" },
  { num: 77, arabic: "ٱلْبَاطِن",      transliteration: "Al-Batin",       urdu: "پوشیدہ",            meaning: "The Hidden — Beyond all perception and understanding", benefit: "Zahir bhi hai, Batin bhi — dono saath — kamal Allah ka" },
  { num: 78, arabic: "ٱلْوَالِي",      transliteration: "Al-Wali",        urdu: "حاکم",              meaning: "The Governor — Administers all of creation", benefit: "Har cheez ka nizam Allah chlata hai — koi shareek nahi" },
  { num: 79, arabic: "ٱلْمُتَعَالِ",   transliteration: "Al-Muta'ali",    urdu: "بہت بلند",           meaning: "The Supreme — Exalted far above all things", benefit: "Allah ki azmat — socha hi nahi ja sakta — bohot aala hai" },
  { num: 80, arabic: "ٱلْبَر",         transliteration: "Al-Barr",        urdu: "نیکی کرنے والا",    meaning: "The Good — Source of all goodness and grace", benefit: "Bina maange bhi deta hai — Al-Barr ki yahi shaan" },
  { num: 81, arabic: "ٱلتَّوَّاب",     transliteration: "At-Tawwab",      urdu: "توبہ قبول کرنے والا", meaning: "The Acceptor of Repentance — Turns to forgive", benefit: "Lakh baar gunaah karo — toubah karo — At-Tawwab qubool karega" },
  { num: 82, arabic: "ٱلْمُنْتَقِم",   transliteration: "Al-Muntaqim",    urdu: "انتقام لینے والا",   meaning: "The Avenger — Takes retribution from wrongdoers", benefit: "Mazloom ki dua — Al-Muntaqim tak zaroor pohonchti hai" },
  { num: 83, arabic: "ٱلْعَفُو",       transliteration: "Al-Afuww",       urdu: "معاف کرنے والا",    meaning: "The Pardoner — Erases sins completely", benefit: "Laylatul Qadr ki dua — Ya Afuww — maaf kar de" },
  { num: 84, arabic: "ٱلرَّءُوف",      transliteration: "Ar-Ra'uf",       urdu: "شفقت والا",         meaning: "The Compassionate — Extremely kind and tender", benefit: "Quran mein Nabi SAW ke liye bhi yahi naam — Ra'uf Raheem" },
  { num: 85, arabic: "مَالِكُ ٱلْمُلْك", transliteration: "Malik ul Mulk", urdu: "بادشاہی کا مالک",  meaning: "Owner of all Sovereignty — All kingdoms belong to Him", benefit: "Izzat aur zillat dena — Malik ul Mulk ka kaam hai" },
  { num: 86, arabic: "ذُو ٱلْجَلَٰلِ وَٱلْإِكْرَام", transliteration: "Dhul Jalali wal Ikram", urdu: "جلال و اکرام والا", meaning: "Lord of Majesty and Honor — Perfect in glory", benefit: "Yeh ism tabaarak wa ta'ala — baar baar maango is naam se" },
  { num: 87, arabic: "ٱلْمُقْسِط",     transliteration: "Al-Muqsit",      urdu: "انصاف والا",        meaning: "The Equitable — Deals with perfect justice", benefit: "Duniya mein chahi insaaf — Al-Muqsit dega aakhirat mein" },
  { num: 88, arabic: "ٱلْجَامِع",      transliteration: "Al-Jami",        urdu: "جمع کرنے والا",     meaning: "The Gatherer — Will gather all on Judgment Day", benefit: "Qayamat mein sab ikattha honge — Al-Jami ka maidan" },
  { num: 89, arabic: "ٱلْغَنِي",       transliteration: "Al-Ghani",       urdu: "بے نیاز",           meaning: "The Self-Sufficient — Free of all needs", benefit: "Tumhari ibadat se usse kuch nahi milta — Al-Ghani hai woh" },
  { num: 90, arabic: "ٱلْمُغْنِي",     transliteration: "Al-Mughni",      urdu: "غنی کرنے والا",     meaning: "The Enricher — Grants sufficiency and richness", benefit: "Gareeb se ameer banana — Al-Mughni ek pal mein kar sakta" },
  { num: 91, arabic: "ٱلْمَانِع",      transliteration: "Al-Mani",        urdu: "روکنے والا",        meaning: "The Preventer — Withholds what would cause harm", benefit: "Jo nahi mila — shayad Al-Mani ne bachaya tumhe" },
  { num: 92, arabic: "ٱلضَّار",        transliteration: "Ad-Darr",        urdu: "نقصان دینے والا",   meaning: "The Distresser — Causes harm by divine wisdom", benefit: "Takleef bhi Allah deta hai — usme bhi hikmat chhipi hai" },
  { num: 93, arabic: "ٱلنَّافِع",      transliteration: "An-Nafi",        urdu: "نفع دینے والا",     meaning: "The Benefiter — Creates all benefit and good", benefit: "Koi fayda ya nuqsaan — sirf Allah ki marzi se" },
  { num: 94, arabic: "ٱلنُّور",        transliteration: "An-Nur",         urdu: "نور",               meaning: "The Light — Illuminates the heavens and earth", benefit: "Allahu nurus samawati wal ard — Surah Nur ki ayah" },
  { num: 95, arabic: "ٱلْهَادِي",      transliteration: "Al-Hadi",        urdu: "ہدایت دینے والا",   meaning: "The Guide — Guides whoever He wills to truth", benefit: "Hidayat Allah deta hai — maango — woh Al-Hadi hai" },
  { num: 96, arabic: "ٱلْبَدِيع",      transliteration: "Al-Badi",        urdu: "بے مثال بنانے والا", meaning: "The Originator — Creates wonders without precedent", benefit: "Snowflake ka ek ek pattern alag — Al-Badi ki shaan dekho" },
  { num: 97, arabic: "ٱلْبَاقِي",      transliteration: "Al-Baqi",        urdu: "ہمیشہ رہنے والا",   meaning: "The Everlasting — Eternal without end", benefit: "Sab jaayega — maal, shohrat, rishte — Al-Baqi rahega" },
  { num: 98, arabic: "ٱلْوَارِث",      transliteration: "Al-Warith",      urdu: "وارث",              meaning: "The Inheritor — Inherits all when creation ends", benefit: "Jab sab khatam — Al-Warith hoga — sab kuch sirf uska" },
  { num: 99, arabic: "ٱلرَّشِيد",      transliteration: "Ar-Rasheed",     urdu: "راہنما",            meaning: "The Guide to Right Path — Perfect in guidance", benefit: "Allah ka har kaam sahi raaste par — koi galti nahi usse" },
];

const CATEGORIES = [
  { id: "all", label: "Sab" },
  { id: "mercy", label: "Rehmat", ids: [2, 3, 15, 35, 36, 45, 80, 81, 83, 84] },
  { id: "power", label: "Qudrat", ids: [9, 10, 54, 55, 70, 71] },
  { id: "knowledge", label: "Ilm", ids: [20, 32, 44, 51, 58, 65] },
  { id: "creator", label: "Khaliq", ids: [12, 13, 14, 59, 60, 61, 96] },
];

export default function Asmaulhusna() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [category, setCategory] = useState("all");
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("asma_favs") || "[]"); }
    catch { return []; }
  });
  const [showFavs, setShowFavs] = useState(false);
  const [dailyName, setDailyName] = useState(null);

  useEffect(() => {
    const dayIndex = Math.floor(Date.now() / 86400000) % 99;
    setDailyName(NAMES[dayIndex]);
  }, []);

  const toggleFav = (num) => {
    const updated = favorites.includes(num)
      ? favorites.filter(n => n !== num)
      : [...favorites, num];
    setFavorites(updated);
    localStorage.setItem("asma_favs", JSON.stringify(updated));
  };

  const filtered = NAMES.filter(n => {
    const q = search.toLowerCase();
    const matchSearch = !q || n.transliteration.toLowerCase().includes(q) ||
      n.urdu.includes(q) || n.meaning.toLowerCase().includes(q);
    const matchCat = category === "all" ||
      (CATEGORIES.find(c => c.id === category)?.ids?.includes(n.num));
    const matchFav = !showFavs || favorites.includes(n.num);
    return matchSearch && matchCat && matchFav;
  });

  // Detail modal
  if (selected) {
    const isFav = favorites.includes(selected.num);
    const prev = NAMES[selected.num - 2];
    const next = NAMES[selected.num];
    return (
      <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "system-ui, sans-serif", paddingBottom: "80px" }}>
        <div style={{ background: `linear-gradient(180deg, #0f1822 0%, ${COLORS.bg} 100%)`, borderBottom: `1px solid ${COLORS.goldDim}`, padding: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={() => setSelected(null)} style={{ background: "transparent", border: `1px solid ${COLORS.goldDim}`, color: COLORS.textDim, borderRadius: "10px", padding: "8px 14px", cursor: "pointer", fontSize: "13px" }}>← Wapas</button>
          <span style={{ color: COLORS.textDim, fontSize: "13px" }}>{selected.num} / 99</span>
        </div>

        <div style={{ padding: "24px 20px", maxWidth: "480px", margin: "0 auto" }}>
          {/* Main Card */}
          <div style={{ background: `linear-gradient(135deg, #1a2332, #0f1c2a)`, border: `1px solid ${COLORS.gold}`, borderRadius: "24px", padding: "40px 24px", textAlign: "center", marginBottom: "20px", position: "relative" }}>
            <button onClick={() => toggleFav(selected.num)} style={{ position: "absolute", top: "16px", right: "16px", background: "transparent", border: "none", cursor: "pointer", fontSize: "22px" }}>
              {isFav ? "⭐" : "☆"}
            </button>
            <div style={{ color: COLORS.goldDim, fontSize: "13px", marginBottom: "16px", letterSpacing: "2px" }}>
              #{selected.num}
            </div>
            <div style={{ fontSize: "52px", color: COLORS.gold, fontFamily: "serif", lineHeight: 1.4, marginBottom: "16px", direction: "rtl" }}>
              {selected.arabic}
            </div>
            <div style={{ color: COLORS.goldLight, fontSize: "22px", fontWeight: "600", marginBottom: "8px" }}>
              {selected.transliteration}
            </div>
            <div style={{ color: COLORS.text, fontSize: "16px", fontFamily: "serif", direction: "rtl", marginBottom: "16px" }}>
              {selected.urdu}
            </div>
            <div style={{ color: COLORS.textDim, fontSize: "14px", lineHeight: "1.6", fontStyle: "italic" }}>
              {selected.meaning}
            </div>
          </div>

          {/* Benefit */}
          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.goldDim}`, borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
            <div style={{ color: COLORS.gold, fontSize: "12px", letterSpacing: "1px", marginBottom: "10px" }}>💡 Fائدہ / BENEFIT</div>
            <div style={{ color: COLORS.text, fontSize: "15px", lineHeight: "1.8", direction: "rtl", textAlign: "right" }}>
              {selected.benefit}
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", gap: "12px" }}>
            {prev && (
              <button onClick={() => setSelected(prev)} style={{ flex: 1, padding: "14px", borderRadius: "12px", border: `1px solid ${COLORS.goldDim}`, background: "transparent", color: COLORS.textDim, cursor: "pointer", fontSize: "13px" }}>
                ← {prev.transliteration}
              </button>
            )}
            {next && (
              <button onClick={() => setSelected(next)} style={{ flex: 1, padding: "14px", borderRadius: "12px", border: `1px solid ${COLORS.gold}`, background: `${COLORS.gold}18`, color: COLORS.gold, cursor: "pointer", fontSize: "13px" }}>
                {next.transliteration} →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "system-ui, sans-serif", paddingBottom: "80px" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(180deg, #0f1822 0%, ${COLORS.bg} 100%)`, borderBottom: `1px solid ${COLORS.goldDim}`, padding: "24px 20px 16px" }}>
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <div style={{ fontSize: "28px" }}>📿</div>
          <h1 style={{ color: COLORS.gold, fontSize: "22px", fontFamily: "Georgia, serif", margin: "8px 0 4px" }}>Asma ul Husna</h1>
          <p style={{ color: COLORS.textDim, fontSize: "13px", margin: 0 }}>اللہ کے ۹۹ نام</p>
        </div>
        {/* Search */}
        <div style={{ position: "relative", maxWidth: "480px", margin: "0 auto" }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Naam dhundhen... (e.g. Rahman, Kareem)"
            style={{ width: "100%", background: COLORS.card, border: `1px solid ${COLORS.goldDim}`, borderRadius: "12px", padding: "12px 16px", color: COLORS.text, fontSize: "14px", outline: "none", boxSizing: "border-box" }}
          />
        </div>
      </div>

      <div style={{ padding: "16px 20px", maxWidth: "480px", margin: "0 auto" }}>

        {/* Daily Name */}
        {dailyName && !search && (
          <div
            onClick={() => setSelected(dailyName)}
            style={{ background: `linear-gradient(135deg, #1e2d1e, #1a2332)`, border: `1px solid ${COLORS.gold}`, borderRadius: "16px", padding: "20px", marginBottom: "16px", cursor: "pointer", textAlign: "center" }}
          >
            <div style={{ color: COLORS.goldDim, fontSize: "11px", letterSpacing: "2px", marginBottom: "8px" }}>✨ AAJ KA NAAM</div>
            <div style={{ color: COLORS.gold, fontSize: "32px", fontFamily: "serif", direction: "rtl", marginBottom: "6px" }}>{dailyName.arabic}</div>
            <div style={{ color: COLORS.goldLight, fontSize: "16px", fontWeight: "600" }}>{dailyName.transliteration}</div>
            <div style={{ color: COLORS.textDim, fontSize: "12px", marginTop: "6px" }}>{dailyName.urdu}</div>
          </div>
        )}

        {/* Filters */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", overflowX: "auto", paddingBottom: "4px" }}>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => { setCategory(c.id); setShowFavs(false); }} style={{
              padding: "7px 14px", borderRadius: "20px", fontSize: "12px", whiteSpace: "nowrap",
              border: `1px solid ${category === c.id && !showFavs ? COLORS.gold : COLORS.goldDim}`,
              background: category === c.id && !showFavs ? `${COLORS.gold}22` : "transparent",
              color: category === c.id && !showFavs ? COLORS.gold : COLORS.textDim, cursor: "pointer"
            }}>{c.label}</button>
          ))}
          <button onClick={() => { setShowFavs(!showFavs); setCategory("all"); }} style={{
            padding: "7px 14px", borderRadius: "20px", fontSize: "12px", whiteSpace: "nowrap",
            border: `1px solid ${showFavs ? COLORS.gold : COLORS.goldDim}`,
            background: showFavs ? `${COLORS.gold}22` : "transparent",
            color: showFavs ? COLORS.gold : COLORS.textDim, cursor: "pointer"
          }}>⭐ Pasandida</button>
        </div>

        {/* Count */}
        <div style={{ color: COLORS.textDim, fontSize: "12px", marginBottom: "14px" }}>
          {filtered.length} naam dikh rahe hain
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {filtered.map((name, i) => (
            <div
              key={name.num}
              onClick={() => setSelected(name)}
              style={{
                background: COLORS.card, border: `1px solid ${COLORS.goldDim}`,
                borderRadius: "14px", padding: "16px 12px", cursor: "pointer",
                transition: "all 0.2s", textAlign: "center",
                position: "relative",
                animation: `fadeIn 0.3s ease ${i * 0.02}s both`
              }}
            >
              {favorites.includes(name.num) && (
                <div style={{ position: "absolute", top: "8px", right: "8px", fontSize: "12px" }}>⭐</div>
              )}
              <div style={{ color: COLORS.textDim, fontSize: "10px", marginBottom: "6px" }}>#{name.num}</div>
              <div style={{ color: COLORS.gold, fontSize: "22px", fontFamily: "serif", direction: "rtl", marginBottom: "6px", lineHeight: 1.4 }}>
                {name.arabic}
              </div>
              <div style={{ color: COLORS.goldLight, fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                {name.transliteration}
              </div>
              <div style={{ color: COLORS.textDim, fontSize: "10px" }}>{name.urdu}</div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: COLORS.textDim }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📿</div>
            <div>Koi naam nahi mila</div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}