import { useState, useEffect, useRef } from "react";

// ─── Surah List ───
const SURAHS = [
  { number: 1, name: "Al-Fatihah", arabic: "الفاتحة", meaning: "The Opening", ayahs: 7 },
  { number: 2, name: "Al-Baqarah", arabic: "البقرة", meaning: "The Cow", ayahs: 286 },
  { number: 3, name: "Aali Imran", arabic: "آل عمران", meaning: "Family of Imran", ayahs: 200 },
  { number: 4, name: "An-Nisa", arabic: "النساء", meaning: "The Women", ayahs: 176 },
  { number: 5, name: "Al-Maidah", arabic: "المائدة", meaning: "The Table", ayahs: 120 },
  { number: 6, name: "Al-Anam", arabic: "الأنعام", meaning: "The Cattle", ayahs: 165 },
  { number: 7, name: "Al-Araf", arabic: "الأعراف", meaning: "The Heights", ayahs: 206 },
  { number: 8, name: "Al-Anfal", arabic: "الأنفال", meaning: "The Spoils", ayahs: 75 },
  { number: 9, name: "At-Tawbah", arabic: "التوبة", meaning: "Repentance", ayahs: 129 },
  { number: 10, name: "Yunus", arabic: "يونس", meaning: "Jonah", ayahs: 109 },
  { number: 11, name: "Hud", arabic: "هود", meaning: "Hud", ayahs: 123 },
  { number: 12, name: "Yusuf", arabic: "يوسف", meaning: "Joseph", ayahs: 111 },
  { number: 13, name: "Ar-Ra'd", arabic: "الرعد", meaning: "The Thunder", ayahs: 43 },
  { number: 14, name: "Ibrahim", arabic: "إبراهيم", meaning: "Abraham", ayahs: 52 },
  { number: 15, name: "Al-Hijr", arabic: "الحجر", meaning: "The Rocky Tract", ayahs: 99 },
  { number: 16, name: "An-Nahl", arabic: "النحل", meaning: "The Bee", ayahs: 128 },
  { number: 17, name: "Al-Isra", arabic: "الإسراء", meaning: "The Night Journey", ayahs: 111 },
  { number: 18, name: "Al-Kahf", arabic: "الكهف", meaning: "The Cave", ayahs: 110 },
  { number: 36, name: "Ya-Sin", arabic: "يس", meaning: "Ya Sin", ayahs: 83 },
  { number: 55, name: "Ar-Rahman", arabic: "الرحمن", meaning: "The Beneficent", ayahs: 78 },
  { number: 56, name: "Al-Waqiah", arabic: "الواقعة", meaning: "The Event", ayahs: 96 },
  { number: 67, name: "Al-Mulk", arabic: "الملك", meaning: "The Sovereignty", ayahs: 30 },
  { number: 112, name: "Al-Ikhlas", arabic: "الإخلاص", meaning: "Sincerity", ayahs: 4 },
  { number: 113, name: "Al-Falaq", arabic: "الفلق", meaning: "The Daybreak", ayahs: 5 },
  { number: 114, name: "An-Nas", arabic: "الناس", meaning: "Mankind", ayahs: 6 },
];

const RECITERS = [
  { id: "ar.alafasy", name: "Mishary Alafasy", arabic: "مشاري العفاسي" },
  { id: "ar.abdurrahmaansudais", name: "Sudais", arabic: "السديس" },
  { id: "ar.husary", name: "Husary", arabic: "الحصري" },
  { id: "ar.minshawi", name: "Minshawi", arabic: "المنشاوي" },
];

const TRANSLATIONS = [
  { id: "ur.jalandhry", name: "Urdu — Jalandhri", lang: "ur-PK" },
  { id: "ur.maududi", name: "Urdu — Maududi", lang: "ur-PK" },
  { id: "en.sahih", name: "English — Sahih International", lang: "en-US" },
  { id: "hi.hindi", name: "Hindi", lang: "hi-IN" },
];

// ─── Urdu to Roman Urdu Converter ───
const toRomanUrdu = (urduText) => {
  if (!urduText) return "";
  
  // Pehle common problematic words fix karo
  let roman = urduText
    // Double consonants taaki TTS stretch kare
    .replace(/مد/g, "mudd")           // madd → mudd (taaki "madam" na bole)
    .replace(/عبد/g, "Abd")           // Abdul sahi rahe
    .replace(/اللہ/g, "Allaah")       // Allah ko stretch karo
    .replace(/اللّٰہ/g, "Allaah")
    .replace(/رحمن/g, "Rehman")       // Rehman (not Reh-maan)
    .replace(/رحیم/g, "Raheem")       // Raheem (not Ra-heem)
    .replace(/محمد/g, "Mohammad")     // Mohammad (not Mo-ham-mad)
    .replace(/مصطفی/g, "Mustafa")     // Mustafa
    .replace(/احمد/g, "Ahmad")        // Ahmad
    .replace(/قرآن/g, "Qur'an")       // Qur'an
    .replace(/اسلام/g, "Islaam")      // Islaam
    .replace(/مسلم/g, "Muslim")       // Muslim
    .replace(/ایمان/g, "Imaan")       // Imaan
    .replace(/نماز/g, "Namaaz")       // Namaaz
    .replace(/روزہ/g, "Rozah")        // Rozah
    .replace(/حج/g, "Hajj")           // Hajj
    .replace(/زکوٰۃ/g, "Zakaat")      // Zakaat
    .replace(/جنت/g, "Jannat")        // Jannat
    .replace(/جہنم/g, "Jahannum")     // Jahannum
    .replace(/دعا/g, "Dua")           // Dua
    .replace(/صبر/g, "Sabr")          // Sabr
    .replace(/شکر/g, "Shukr")         // Shukr
    .replace(/توبہ/g, "Taubah")       // Taubah
    .replace(/بخشش/g, "Bakhshish")    // Bakhshish
    .replace(/رحمت/g, "Rehmat")       // Rehmat
    .replace(/برکت/g, "Barkat")       // Barkat
    .replace(/سلامتی/g, "Salaamati")  // Salaamati
    .replace(/امن/g, "Aman")          // Aman
    .replace(/عدل/g, "Adl")           // Adl
    .replace(/انصاف/g, "Insaaf")      // Insaaf
    .replace(/سچ/g, "Sach")           // Sach
    .replace(/جھوٹ/g, "Jhooth")       // Jhooth
    .replace(/نیکی/g, "Neki")         // Neki
    .replace(/بدی/g, "Badi")          // Badi
    .replace(/گناہ/g, "Gunaah")       // Gunaah
    .replace(/ثواب/g, "Sawaab")       // Sawaab
    .replace(/عذاب/g, "Azaab")        // Azaab
    .replace(/قیامت/g, "Qayaamat")    // Qayaamat
    .replace(/روز/g, "Roz")           // Roz
    .replace(/حشر/g, "Hashr")         // Hashr
    .replace(/جزا/g, "Jaza")          // Jaza
    .replace(/سزا/g, "Saza")          // Saza
    .replace(/نبی/g, "Nabi")          // Nabi
    .replace(/رسول/g, "Rasool")       // Rasool
    .replace(/کعبہ/g, "Ka'bah")       // Ka'bah
    .replace(/مسجد/g, "Masjid")       // Masjid
    .replace(/مکہ/g, "Makkah")        // Makkah
    .replace(/مدینہ/g, "Madinah")     // Madinah
    .replace(/الحمدللہ/g, "Alhamdulillaah")  // Alhamdulillaah
    .replace(/ماشاءاللہ/g, "MashaAllaah")    // MashaAllaah
    .replace(/انشاءاللہ/g, "InshaAllaah")    // InshaAllaah
    .replace(/سبحان اللہ/g, "SubhanAllaah")  // SubhanAllaah
    .replace(/اللہ اکبر/g, "Allaahu Akbar")  // Allaahu Akbar
    .replace(/استغفراللہ/g, "Astaghfirullaah") // Astaghfirullaah
    .replace(/بسم اللہ/g, "Bismillaah")      // Bismillaah
    .replace(/جزاک اللہ/g, "JazaakAllaah")   // JazaakAllaah
    .replace(/بارک اللہ/g, "BaarakAllaah");  // BaarakAllaah

  // Baaki words ke liye mapping
  const replacements = {
    "اللہ": "Allaah", "کے": "ke", "کی": "ki", "کا": "ka", "ہے": "hai",
    "ہیں": "hain", "اور": "aur", "سے": "se", "میں": "mein", "پر": "par",
    "نے": "ne", "کو": "ko", "بھی": "bhi", "نہیں": "nahin", "یہ": "yeh",
    "وہ": "woh", "جو": "jo", "کہ": "ke", "تک": "tak", "تھا": "tha",
    "تھی": "thi", "گیا": "gayaa", "گئی": "gayii", "کر": "kar", "کیا": "kiyaa",
    "کرنا": "karnaa", "کرنے": "karne", "کرتا": "kartaa", "کرتی": "karti",
    "جب": "jab", "تو": "to", "پھر": "phir", "کیونکہ": "kyunke", "اگر": "agar",
    "لیکن": "lekin", "یا": "yaa", "ہر": "har", "سب": "sab", "تمام": "tamaam",
    "بہت": "bohat", "زیادہ": "zyaadah", "کم": "kam", "اچھا": "achchhaa",
    "برا": "buraa", "نیا": "nayaa", "پہلا": "pehlaa", "آخری": "aakhiri",
    "تعریف": "taareef", "خدا": "Khudaa", "سزاوار": "sazaawaar", "مخلوقات": "makhluqaat",
    "پروردگار": "parvardigaar", "طرح": "tarah", "تمام": "tamaam", "ہی": "hi",
    "بندہ": "bandah", "بندی": "bandi", "عبد": "Abd", "عام": "aam",
    "خاص": "khaas", "طرف": "taraf", "طاقت": "taaqat", "قدرت": "qudrat",
    "مقدر": "muqaddar", "تقدیر": "taqdeer", "نصیب": "naseeb", "قسمت": "qismat",
    "بخت": "bakht", "دولت": "daulat", "مال": "maal", "دنیا": "duniyaa",
    "آخرت": "aakhirat", "زندگی": "zindagii", "موت": "maut", "مردہ": "murdaa",
    "زندہ": "zindah", "روح": "rooh", "جسم": "jism", "بدن": "badan",
    "خون": "khoon", "پسینہ": "paseenah", "آنسو": "aansoo", "ہنسی": "hansii",
    "رونا": "ronaa", "غصہ": "ghussah", "پیار": "pyaar", "محبت": "mohabbat",
    "نفرت": "nafrat", "دوست": "dost", "دشمن": "dushman", "باپ": "baap",
    "ماں": "maa", "بیٹا": "betaa", "بیٹی": "betii", "بhai": "bhai",
    "بہن": "behan", "شوہر": "shohar", "بیوی": "biwii", "بچہ": "bachchah",
    "خاندان": "khaandaan", "گھر": "ghar", "دروازہ": "darwaazah", "کھڑکی": "khirakii",
    "چھت": "chhat", "دیوار": "diwaar", "فرش": "farsh", "دیہات": "dehaat",
    "شہر": "shehar", "بازار": "baazaar", "دکان": "dukaan", "سڑک": "sarak",
    "گاڑی": "gaarii", "موٹر": "motor", "سائیکل": "saaiqil", "ہوائی جہاز": "hawaaii jahaaz",
    "کشتیاں": "kashtiyaan", "دریا": "dariyaa", "سمندر": "samundar", "پہاڑ": "pahaad",
    "جنگل": "jungle", "صحرا": "sahraa", "چاند": "chaand", "سورج": "sooraj",
    "تارہ": "taarah", "آسمان": "aasmaan", "زمین": "zamiin", "پانی": "paanii",
    "آگ": "aag", "ہوا": "hawaa", "مٹی": "mittii", "پتھر": "patthar",
    "لوہا": "lohaa", "سونا": "sonaa", "چاندی": "chaandii", "تانبا": "taambaa",
    "کپڑا": "kapdaa", "لکڑی": "lakrrii", "کاغذ": "kaagaz", "قلم": "qalam",
    "کتاب": "kitaab", "درس": "dars", "سبق": "sabaq", "امتحان": "imtihaan",
    "پاس": "paas", "فیل": "fail", "نمبر": "number", "اسکول": "school",
    "کالج": "college", "یونیورسٹی": "university", "استاد": "ustaaz", "طالب علم": "taalib ilm",
    "ڈاکٹر": "doctor", "انجینئر": "engineer", "وکیل": "vakeel", "جج": "jaj",
    "پولیس": "police", "فوج": "fauj", "سیاستدان": "siyaasatdaan", "وزیر": "wazir",
    "بادشاہ": "baadshaah", "رانی": "raanii", "ملک": "mulk", "حکومت": "hukumat",
    "قانون": "qaanoon", "عدالت": "adaalat", "جیل": "jail", "سزا": "sazaa",
    "جرم": "jurm", "چور": "chor", "ڈاکو": "daakoo", "قتل": "qatl",
    "چاقو": "chaakoo", "پستول": "pistol", "بم": "bam", "لڑائی": "laraaii",
    "جنگ": "jang", "امن": "aman", "معاہدہ": "moaahedah", "دوستی": "dostii",
    "بھائی چارہ": "bhaaii chaarah", "اتحاد": "ittahaad", "اتفاق": "ittifaaq",
    "اتفاق رائے": "ittifaaq raaey", "اکثریت": "aksariyat", "اقلیت": "aqaliyat",
    "فرقہ": "firqah", "مذہب": "mazhab", "فرقہ واریت": "firqah waariyat",
    "تعصب": "taassub", "رواداری": "rawaadaarii", "برداشت": "burdaasht",
    "مساوات": "musaawaat", "برابری": "baraabarii", "انصاف": "insaaf",
    "حق": "haq", "باطل": "baatil", "سچ": "sach", "جھوٹ": "jhooth",
    "امانتداری": "amaanatdaarii", "دیانتداری": "diyaanatdaarii", "ایمانداری": "imaandaarii",
    "خیانت": "khiyaanat", "دھوکہ": "dhokhaa", "فریب": "fareb", "جعلسازی": "jaalsaaazii",
    "چالاکی": "chaalaakii", "سمجھداری": "samajhdaarii", "bewaqoofi": "bewaqoofii",
    "احمق": "ahmaq", "پاگل": "paagal", "دیوانہ": "diwaanah", "عقلمند": "aqlmand",
    "دانشمند": "daanishmand", "عالم": "aalim", "جاہل": "jaahil", "پڑھالکھا": "parhalkhaa",
    "انپڑھ": "anparh", "تعلیم": "taleem", "علم": "ilm", "فن": "fun",
    "ہنر": "hunar", "مہارت": "mahaarat", "کامیابی": "kaamyaabii", "ناکامی": "naakaamii",
    "کوشش": "koshish", "محنت": "mehnat", "کام": "kaam", "نوکری": "naukrii",
    "دکان": "dukaan", "کاروبار": "kaarobaar", "منافع": "munaafa", "نقصان": "nuqsaan",
    "قرض": "qarz", "سود": "sood", "بینک": "bank", "پیسہ": "paisah",
    "روپیہ": "rupiyah", "دولت": "daulat", "غریب": "ghariib", "امیر": "amiir",
    "سادہ": "saadah", "آرام": "aaraam", "تکلیف": "takliif", "بیماری": "bimaarii",
    "صحت": "sehat", "دوا": "dawaa", "ڈاکٹر": "doctor", "ہسپتال": "hospital",
    "دواخانہ": "dawaakhaanah", "شفاخانہ": "shifaakhaanah", "علاج": "ilaaj",
    "تندرستی": "tandurustii", "تازگی": "taazgii", "توانائی": "twaanaaii",
    "کمزوری": "kamzorii", "طاقت": "taaqat", "زور": "zor", "بل": "bal",
    "شجاعت": "shajaaat", "بہادری": "bahaadurii", "دلیری": "dilerii", "بزدلی": "buzdlii",
    "خوف": "khauf", "ڈر": "dar", "ہمت": "himmat", "حوصلہ": "hausalah",
    "یقین": "yaqiin", "بھروسہ": "bharosah", "اعتماد": "etemaad", "شک": "shak",
    "وسوسہ": "waswasah", "گمان": "gumaan", "ظن": "zann", "یقینی": "yaqiinii",
    "ممکن": "mumkin", "ناممکن": "naamumkin", "آسان": "aasaan", "مushkil": "mushkil",
    "مشکل": "mushkil", "آسان": "aasaan", "پہلے": "pehle", "بعد": "baad",
    "اب": "ab", "کل": "kal", "آج": "aaj", "ابھی": "abhii", "تب": "tab",
    "پھر": "phir", "دوبارہ": "dobaarah", "باربار": "baarbaar", "کبھی": "kabhi",
    "کبھی نہیں": "kabhi nahin", "ہمیشہ": "hameshah", "کبھی کبھی": "kabhi kabhi",
    "اکثر": "aksar", "بیشتر": "bishtar", "تقریباً": "taqreeban", "بالکل": "bilkuul",
    "ذرا": "zaraa", "بہت زیادہ": "bohat zyaadah", "تھوڑا": "thodaa", "کافی": "kaafii",
    "پورا": "puuraa", "ادھورا": "adhooraa", "خالی": "khaalii", "بھرا": "bharaa",
    "نیا": "nayaa", "پurana": "puraanaa", "تازہ": "taazah", "پuranaa": "puraanaa",
    "گندہ": "gandah", "صاف": "saaf", "خوبصورت": "khoobsoorat", "بدصورت": "badsuurat",
    "میٹھا": "meethaa", "کڑوا": "kadwaa", "نمکین": "namkiin", "چٹپٹا": "chatpataa",
    "تیز": "tez", "دھیما": "dheemaa", "تیزرفتار": "tez raftaar", "آہستہ": "aahistah",
    "جلدی": "jaldii", "دیر": "der", "وقت": "waqt", "گھڑی": "gharrii",
    "منٹ": "minute", "گھنٹہ": "ghantah", "دن": "din", "رات": "raat",
    "ہفتہ": "haftah", "مہینہ": "maheenah", "سال": "saal", "صدی": "sadii",
    "عرصہ": "arsah", "دور": "daur", "زمانہ": "zamaanah", "عہد": "ahd",
    "ابتدا": "ibtidaa", "انتہا": "intahaa", "درمیان": "darmiyaan", "بیچ": "beech",
    "کنارہ": "kinaarah", "مرکز": "markaz", "اہمیت": "ahmiyat", "قدر": "qadar",
    "وصف": "wasf", "صفت": "sifat", "ناں": "naam", "پہچان": "pehchaan",
    "شناخت": "shinaakht", "عکس": "aks", "صورت": "soorat", "شکل": "shakl",
    "انداز": "andaaz", "طریقہ": "tariqah", "طریقہ کار": "tariqah kaar",
    "نظام": "nizaam", "قاعدہ": "qaaedah", "اصول": "usool", "شرط": "shart",
    "ضرورت": "zaruurat", "فائدہ": "faaidah", "نقصان": "nuqsaan", "اثر": "asar",
    "نتيجہ": "nateejah", "سبب": "sabab", "وجہ": "wajah", "علت": "illat",
    "دلیل": "daleel", "ثبوت": "suboot", "شہادت": "shahaadat", "گواہی": "gawaahii",
    "اعتراف": "itraaf", "انکار": "inkaar", "تردید": "tardid", "تصدیق": "tasdeeq",
    "تائید": "taaeed", "حمایت": "himaayat", "مخالفت": "mukhaalafat", "تنقید": "tanqid",
    "تعریف": "taareef", "توصیف": "tauseef", "تذکرہ": "tazkirah", "یاد": "yaad",
    "فراموشی": "fraamoshii", "یادداشت": "yaaddaasht", "دماغ": "dimaaq", "ذہن": "zehn",
    "خیال": "khayaal", "فکر": "fikr", "سوچ": "soch", "سمجھ": "samajh",
    "عقل": "aql", "شعور": "shaoor", "واقفیت": "waqifiyat", "آگاہی": "aagaahii",
    "علم": "ilm", "جاہل": "jaahil", "تعلیم": "taleem", "تربیت": "tarbiyat",
    "ادب": "adab", "اخلاق": "akhlaaq", "کردار": "kirdaar", "عادت": "aadat",
    "رویہ": "rawiyah", "سلوک": "sulook", "عمل": "amal", "کام": "kaam",
    "حرکت": "harkat", "سکون": "sukoon", "چپ": "chup", "آواز": "aawaaz",
    "شور": "shor", "دھماکہ": "dhamaakah", "خاموشی": "khaamoshii", "پردہ": "purdah",
    "حجاب": "hijaab", "نقاب": "niqaab", "برقع": "burqah", "چادر": "chaadar",
    "شال": "shaal", "کپڑے": "kapre", "لباس": "libaas", "پوشاک": "poshaak",
    "زیب تن": "zeb tan", "سونا": "sonaa", "چاندی": "chaandii", "جواہرات": "jawaahiraat",
    "زیور": "zaywar", "آرائش": "aaraaish", "سجاوٹ": "sajaawat", "رنگ": "rang",
    "روپ": "roop", "خوشبو": "khushboo", "عطر": "itr", "گلاب": "gulaab",
    "چنبیلی": "chanbelii", "موٹی": "motii", "مرجان": "marjaan", "یاقوت": "yaaqoot",
    "زمرد": "zamurd", "فیروزہ": "feerozah", "نیلم": "neelam", "پکھراج": "pukhraaj",
    "ہیرا": "heeraa", "زیرکن": "zeerkan", "موزنائٹ": "moaznaait", "سونے چاندی": "sone chaandii",
    "دھات": "dhaat", "لوہا": "lohaa", "پیتل": "peetal", "تانبا": "taambaa",
    "سیسہ": "seesah", "آبشار": "aabshaar", "چشمہ": "chashmah", "کنواں": "kunwaan",
    "تالاب": "taalaab", "جھیل": "jheel", "نہر": "nehar", "کینال": "kainal",
    "پل": "pul", "سرنگ": "surang", "راستہ": "raastah", "گزرگاہ": "guzargaaah",
    "شاہراہ": "shaahraah", "سڑک": "sarak", "گلی": "galii", "گلی کوچہ": "galii koochah",
    "محلہ": "mohallah", "بستی": "bastii", "گاؤں": "gaaun", "قصبہ": "qasbah",
    "شہر": "shehar", "میٹروپولس": "metropolis", "دارالحکومت": "daarulhukumat",
    "صوبہ": "soobah", "ضلع": "zilaa", "تحصیل": "tehsiil", "یونین کونسل": "union council",
    "دیہی": "dehii", "شہری": "shehrii", "آبادی": "aabaadii", "آدمی": "aadmi",
    "عورت": "aurat", "مرد": "mard", "لڑکا": "larkaa", "لڑکی": "larkii",
    "بچہ": "bachchah", "نوجوان": "nojawaan", "جوان": "jawaan", "بوڑھا": "boorhah",
    "عمر": "umr", "سن": "sin", "جنم": "janam", "پیدائش": "paidaaish",
    "وفات": "wafaat", "موت": "maut", "تدفین": "tadfiin", "جنازہ": "janaazah",
    "قبر": "qabr", "قبرستان": "kabristaan", "مزار": "mazaar", "شہید": "shaheed",
    "مارا": "maaraa", "زخمی": "zakhmi", "بیمار": "biimaar", "صحت مند": "sehatmand",
    "تندرست": "tandurust", "کمزور": "kamzor", "طاقتور": "taaqatwar", "بہادر": "bahaadur",
    "بزدل": "buzdil", "سچا": "sachchaa", "جھوٹا": "jhoothaa", "امین": "ameen",
    "خائن": "khaain", "نیک": "nek", "بد": "bad", "پاک": "paak",
    "ناپاک": "naapaak", "حلال": "halaal", "حرام": "haraam", "جائز": "jaayiz",
    "ناجائز": "naajaayiz", "فرض": "farz", "واجب": "waajib", "سنت": "sunnat",
    "مستحب": "mustahabb", "مباح": "mbaah", "مکروہ": "makrooh", "ناپسندیدہ": "naapasandidah",
    "پسندیدہ": "pasandidah", "مناسب": "munaasib", "غیرمناسب": "ghair munaasib",
    "اچھا": "achchhaa", "برا": "buraa", "خوش": "khush", "غمگین": "ghamgiin",
    "مسرور": "masroor", "رنجیدہ": "ranjiidah", "خوشحال": "khushhaal", "بدحال": "badhaal",
    "امید": "ummiid", "ناامید": "naaummiid", "خوشی": "khushii", "غم": "gham",
    "درد": "dard", "الم": "alam", "تکلیف": "takliif", "آزمائش": "aazmaaish",
    "مصیبت": "musibat", "آفت": "aafat", "بلاء": "balaa", "امتحان": "imtihaan",
    "صبر": "sabr", "شکر": "shukr", "رضا": "razaa", "تسلیم": "taslim",
    "اتباع": "ittibaa", "اطاعت": "itaat", "فرمانبرداری": "furmaanbardaarii",
    "سرکشی": "sarkashii", "نافرمانی": "nafarmaanii", "گناہ": "gunaah", "معصیت": "maasiyat",
    "توبہ": "taubah", "استغفار": "istighfaar", "توبہ نصوح": "taubah nasooh",
    "انابت": "inaabat", "رجوع": "rujoo", "تجدید ایمان": "tajdiid eemaan",
    "تجدید عہد": "tajdiid ahd", "بیعت": "baiat", "خلافت": "khilaafat",
    "امارت": "imaarat", "قیادت": "qiyaadat", "رہبری": "rehbarii", "پیروی": "pervii",
    "اتباع": "ittibaa", "اقتدا": "iqtidaa", "تقلید": "taqliid", "اجتہاد": "ijtihaad",
    "تدبر": "tadabbur", "تفکر": "tafakkur", "تذکر": "tazakkur", "ذکر": "zikr",
    "فکر": "fikr", "خیال": "khayaal", "توجہ": "tawajjuh", "لحاظ": "lihaaz",
    "عنایت": "inaayat", "کرم": "karam", "فضل": "fazl", "رحمت": "rehmat",
    "نعمت": "nemat", "نعماء": "namaa", "اسباب": "asaab", "ذریعہ": "zariiah",
    "وسیلہ": "wasiilah", "طریق": "tariiq", "راستہ": "raastah", "منہج": "minhaj",
    "طریقت": "tariiqat", "حقیقت": "haqiiqat", "شریعت": "shariiat", "دین": "diin",
    "ملت": "millat", "فرقہ": "firqah", "مسلک": "maslak", "عقیدہ": "aqiidah",
    "نظریہ": "nazariiah", "رائے": "raaey", "خیال": "khayaal", "گمان": "gumaan",
    "یقین": "yaqiin", "علم": "ilm", "معرفت": "marifat", "حکمت": "hikmat",
    "دانش": "daanish", "عقل": "aql", "فہم": "fahm", "درک": "idrak",
    "شعور": "shaoor", "حواس": "haawas", "بصیرت": "baseerat", "بصارت": "basaarat",
    "سماعت": "samaat", "شمامت": "shamaamat", "ذائقہ": "zaaaiqah", "لمس": "lams",
    "احساس": "ehsaas", "جذبہ": "jazbah", "خواہش": "khwaaish", "ارادہ": "iraadah",
    "قصد": "qasd", "نیت": "niyat", "دل": "dil", "جان": "jaan",
    "روح": "rooh", "نفس": "nafs", "قلب": "qalb", "سرائر": "saraair",
    "ضمیر": "zamiir", "وجدان": "wijdaan", "ہوش": "hosh", "خودی": "khudii",
    "انانیت": "anaaniyat", "غرور": "ghuroor", "تکبر": "takabbur", "عجب": "ujub",
    "حسد": "hasad", "بغض": "bugz", "کینہ": "kiinah", "عداوت": "adaawat",
    "دشمنی": "dushmanii", "حسد": "hasad", "رشک": "rishk", "غبطہ": "ghibtah",
    "رحم": "rahm", "ترس": "tars", "شفقت": "shafqat", "محبت": "mohabbat",
    "الفت": "ulfat", "دوستی": "dostii", "یاری": "yaarii", "رفاقت": "rufaqqat",
    "صحبت": "sohbat", "معاشرت": "muaaasharat", "ملنساری": "milnasaarii", "خلوص": "khulus",
    "صداقت": "sadaaqat", "دیانت": "diyaanat", "امانت": "amaanat", "وفا": "wafaa",
    "عہد شکنی": "ahd shiknii", "خیانت": "khiyaanat", "جھوٹ": "jhooth", "فریب": "fareb",
    "دھوکہ": "dhokhaa", "نیرنگی": "neerangii", "حیلہ": "heelah", "ترکیب": "tarkiib",
    "چال": "chaal", "دام": "daam", "جال": "jaal", "فریب": "fareb",
    "حیلہ سازی": "heelah saazii", "مکاری": "makaarii", "عیاری": "aiyaarii",
    "سادہ دلی": "saadah dilii", "سادگی": "saadagii", "بے ساختگی": "be saakhtagii",
    "فطرت": "fitrat", "سرشت": "sarisht", "طبع": "taba", "مزاج": "mizaaj",
    "خو": "khuu", "ذات": "zaat", "ہستی": "hastii", "وجود": "wujuud",
    "عدم": "adum", "فنا": "fanaa", "بقا": "baqaa", "دوام": "dawaam",
    "زوال": "zawaal", "تباہی": "tabaahii", "بربادی": "barbaadii", "تباہ و برباد": "tabaah o barbaad",
    "ہلاکت": "halaakat", "موت": "maut", "فوت": "faut", "وفات": "wafaat",
    "انتقال": "intiqaal", "رحلت": "rahlat", "شہادت": "shahaadat", "قتل": "qatl",
    "خونریزی": "khoonriizii", "خونخواری": "khoonkhwarii", "ظلم": "zulm", "ستم": "sitam",
    "جبر": "jabr", "تعدی": "tadii", "تجاوز": "tajaawuz", "سرکشی": "sarkashii",
    "فساد": "fasaad", "فتنہ": "fitnah", "فتور": "fatuur", "بگاڑ": "bigaar",
    "اصلاح": "islaah", "تصحیح": "tasheeh", "درستگی": "durustagii", "سدھار": "sidhaar",
    "تجدید": "tajdiid", "تجديد": "tajdiid", "احیا": "ahyaa", "تعمیر": "tamiir",
    "تشکیل": "tashkiil", "تنظیم": "tanziim", "انتظام": "intizaam", "بندوبست": "bandobast",
    "نظامت": "nizaamat", "ریاست": "riyaasat", "حکومت": "hukumat", "سلطنت": "saltanat",
    "ملکیت": "milkiyat", "ملک": "mulk", "سرزمین": "sarzamiin", "خطہ": "kittah",
    "اقلیم": "iqlim", "علاقہ": "ilaaqah", "پٹہ": "pattah", "جاگیر": "jaagiir",
    "مکان": "makaan", "گھر": "ghar", "مسکن": "maskan", "آشیانہ": "aashiyaanah",
    "آبادگاہ": "aabaadgaah", "مستقر": "mustaqarr", "ٹھکانہ": "thikaanah", "پناہ": "panaah",
    "پناہ گاہ": "panaah gaah", "آسرا": "aasraa", "سہارا": "sahaaraa", "مدد": "maddd",
    "اعانت": "iaanat", "مددگاری": "madddgaarii", "تعاون": "taaawun", "همکاری": "hamkaarii",
    "شراکت": "shiraakat", "حصہ داری": "hissah daarii", "تقسیم": "taqsiim", "بانٹ": "baant",
    "خیرات": "khairaat", "صدقہ": "sadqah", "خیر": "khair", "بھلائی": "bhalaaii",
    "نیکی": "neki", "احسان": "ehsaan", "منّت": "mannat", "فضل": "fazl",
    "کرم": "karam", "عنایت": "inaayat", "نوازش": "nawaazish", "احسان مندی": "ehsaan mandii",
    "شکر گزاری": "shukr guzaarii", "نعمت شناسی": "nemat shinaasii", "حمد": "hamd",
    "ثناء": "sanaa", "تسبیح": "tasbiih", "تحمید": "tahmiid", "تکبیر": "takbiir",
    "تہلیل": "tahliil", "تصدیق": "tasdeeq", "اقرار": "iqraar", "اعتراف": "itraaf",
    "تسلیم": "taslim", "رضا": "razaa", "خوشامد": "khushaamad", "ستائش": "staaish",
    "مدح": "madah", "ثناء": "sanaa", "آفرین": "aafariin", "واہ واہ": "waah waah",
    "تعریف": "taareef", "توصیف": "tauseef", "تمجید": "tamjiid", "تکریم": "takriim",
    "احترام": "ehtiraam", "تعظیم": "taaziim", "اکرام": "ikraam", "تکریم": "takriim",
    "سلام": "salaam", "تحیت": "tahiyyat", "آداب": "aadaab", "تعظیمات": "taaziimaat",
    "سلوات": "salawaat", "درود": "daruud", "صلاۃ": "salaat", "سلامتی": "salaamati",
    "امن": "aman", "آشتی": "aashtii", "صلح": "sulh", "مصالحت": "musaalahat",
    "سازش": "saazish", "سولہ": "solah", "معاہدہ": "moaahedah", "عہد و پیمان": "ahd o piimaan",
    "وعدہ": "waadah", "عہد": "ahd", "قسم": "qasm", "حلف": "half",
    "بیعت": "baiat", "عقد": "aqd", "نکاح": "nikaah", "شادی": "shaadii",
    "ازدواج": "azdawaaj", "خانہ آبادی": "khaanah aabaadii", "اولاد": "aulaad",
    "نسل": "nasl", "قبیلہ": "qabiilah", "خاندان": "khaandaan", "بزرگ": "buzurg",
    "باپ دادا": "baap daadaa", "اجداد": "ajdaad", "پردادا": "pardaadaa", "ناتا": "naataa",
    "رشتہ": "rishtah", "قرابت": "qaraabat", "خویش": "khwiish", "عزیز": "aziiz",
    "دوست": "dost", "یار": "yaar", "رفیق": "rafiiq", "ہمدم": "hamdam",
    "ہم نشین": "ham nashiin", "ہم سفر": "ham safar", "ہم عمر": "ham umr",
    "ہم مکتب": "ham maktab", "ہم جماعت": "ham jamaaat", "ہم پلہ": "ham pallah",
    "ہم سر": "ham sar", "ہم پایہ": "ham paayah", "ہم خیال": "ham khayaal",
    "ہم عقیدہ": "ham aqiidah", "ہم مسلک": "ham maslak", "ہم مذہب": "ham mazhab",
    "ہم وطن": "ham watan", "ہم زبان": "ham zubaan", "ہم قوم": "ham qaum",
    "ہم خاندان": "ham khaandaan", "ہم نسب": "ham nasab", "ہم شجرہ": "ham shajarah",
    "ہم ریشہ": "ham riishah", "ہم بنیاد": "ham buniyaad", "ہم اصل": "ham asal",
    "ہم جنس": "ham jins", "ہم صنف": "ham sanf", "ہم نوع": "ham nau",
    "ہم ذات": "ham zaat", "ہم سرشت": "ham sarisht", "ہم فطرت": "ham fitrat",
    "ہم طبع": "ham taba", "ہم مزاج": "ham mizaaj", "ہم خُو": "ham khuu",
    "ہم ذوق": "ham zauq", "ہم شوق": "ham shauq", "ہم میل": "ham mail",
    "ہم رنگ": "ham rang", "ہم آہنگ": "ham aahang", "ہم نوا": "ham nawaa",
    "ہم آواز": "ham aawaaz", "ہم آہن": "ham aahan", "ہم عصر": "ham asr",
    "ہم زمانہ": "ham zamaanah", "ہم عہد": "ham ahd", "ہم دور": "ham daur",
    "ہم قرن": "ham qarn", "ہم صدی": "ham sadii", "ہم سال": "ham saal",
    "ہم مہینہ": "ham maheenah", "ہم ہفتہ": "ham haftah", "ہم دن": "ham din",
    "ہم رات": "ham raat", "ہم وقت": "ham waqt", "ہم لمحہ": "ham lamhah",
    "ہم پل": "ham pal", "ہم چشم": "ham chashm", "ہم نگاہ": "ham nigaah",
    "ہم نظر": "ham nazar", "ہم بصر": "ham basar", "ہم بصیرت": "ham baseerat",
    "ہم درک": "ham idraak", "ہم فہم": "ham fahm", "ہم عقل": "ham aql",
    "ہم ذہن": "ham zehn", "ہم خیال": "ham khayaal", "ہم فکر": "ham fikr",
    "ہم سوچ": "ham soch", "ہم سمجھ": "ham samajh", "ہم شعور": "ham shaoor",
    "ہم احساس": "ham ehsaas", "ہم جذبہ": "ham jazbah", "ہم خواہش": "ham khwaaish",
    "ہم ارادہ": "ham iraadah", "ہم قصد": "ham qasd", "ہم نیت": "ham niyat",
    "ہم دل": "ham dil", "ہم جان": "ham jaan", "ہم روح": "ham rooh",
    "ہم نفس": "ham nafs", "ہم قلب": "ham qalb", "ہم سرائر": "ham saraair",
    "ہم ضمیر": "ham zamiir", "ہم وجدان": "ham wijdaan", "ہم ہوش": "ham hosh",
    "ہم خُودی": "ham khudii", "ہم انانیت": "ham anaaniyat", "ہم غرور": "ham ghuroor",
    "ہم تکبر": "ham takabbur", "ہم عجب": "ham ujub", "ہم حسد": "ham hasad",
    "ہم بغض": "ham bugz", "ہم کینہ": "ham kiinah", "ہم عداوت": "ham adaawat",
    "ہم دشمنی": "ham dushmanii", "ہم رشک": "ham rishk", "ہم غبطہ": "ham ghibtah",
    "ہم رحم": "ham rahm", "ہم ترس": "ham tars", "ہم شفقت": "ham shafqat",
    "ہم محبت": "ham mohabbat", "ہم الفت": "ham ulfat", "ہم دوستی": "ham dostii",
    "ہم یاری": "ham yaarii", "ہم رفاقت": "ham rufaqqat", "ہم صحبت": "ham sohbat",
    "ہم معاشرت": "ham muaaasharat", "ہم ملنساری": "ham milnasaarii", "ہم خلوص": "ham khulus",
    "ہم صداقت": "ham sadaaqat", "ہم دیانت": "ham diyaanat", "ہم امانت": "ham amaanat",
    "ہم وفا": "ham wafaa", "ہم عہد شکنی": "ham ahd shiknii", "ہم خیانت": "ham khiyaanat",
    "ہم جھوٹ": "ham jhooth", "ہم فریب": "ham fareb", "ہم دھوکہ": "ham dhokhaa",
    "ہم نیرنگی": "ham neerangii", "ہم حیلہ": "ham heelah", "ہم ترکیب": "ham tarkiib",
    "ہم چال": "ham chaal", "ہم دام": "ham daam", "ہم جال": "ham jaal",
    "ہم حیلہ سازی": "ham heelah saazii", "ہم مکاری": "ham makaarii", "ہم عیاری": "ham aiyaarii",
    "ہم سادہ دلی": "ham saadah dilii", "ہم سادگی": "ham saadagii", "ہم بے ساختگی": "ham be saakhtagii",
    "ہم فطرت": "ham fitrat", "ہم سرشت": "ham sarisht", "ہم طبع": "ham taba",
    "ہم مزاج": "ham mizaaj", "ہم خُو": "ham khuu", "ہم ذات": "ham zaat",
    "ہم ہستی": "ham hastii", "ہم وجود": "ham wujuud", "ہم عدم": "ham adum",
    "ہم فنا": "ham fanaa", "ہم بقا": "ham baqaa", "ہم دوام": "ham dawaam",
    "ہم زوال": "ham zawaal", "ہم تباہی": "ham tabaahii", "ہم بربادی": "ham barbaadii",
    "ہم تباہ و برباد": "ham tabaah o barbaad", "ہم ہلاکت": "ham halaakat",
    "ہم موت": "ham maut", "ہم فوت": "ham faut", "ہم وفات": "ham wafaat",
    "ہم انتقال": "ham intiqaal", "ہم رحلت": "ham rahlat", "ہم شہادت": "ham shahaadat",
    "ہم قتل": "ham qatl", "ہم خونریزی": "ham khoonriizii", "ہم خونخواری": "ham khoonkhwarii",
    "ہم ظلم": "ham zulm", "ہم ستم": "ham sitam", "ہم جبر": "ham jabr",
    "ہم تعدی": "ham tadii", "ہم تجاوز": "ham tajaawuz", "ہم سرکشی": "ham sarkashii",
    "ہم فساد": "ham fasaad", "ہم فتنہ": "ham fitnah", "ہم فتور": "ham fatuur",
    "ہم بگاڑ": "ham bigaar", "ہم اصلاح": "ham islaah", "ہم تصحیح": "ham tasheeh",
    "ہم درستگی": "ham durustagii", "ہم سدھار": "ham sidhaar", "ہم تجدید": "ham tajdiid",
    "ہم احیا": "ham ahyaa", "ہم تعمیر": "ham tamiir", "ہم تشکیل": "ham tashkiil",
    "ہم تنظیم": "ham tanziim", "ہم انتظام": "ham intizaam", "ہم بندوبست": "ham bandobast",
    "ہم نظامت": "ham nizaamat", "ہم ریاست": "ham riyaasat", "ہم حکومت": "ham hukumat",
    "ہم سلطنت": "ham saltanat", "ہم ملکیت": "ham milkiyat", "ہم ملک": "ham mulk",
    "ہم سرزمین": "ham sarzamiin", "ہم خطہ": "ham kittah", "ہم اقلیم": "ham iqlim",
    "ہم علاقہ": "ham ilaaqah", "ہم پٹہ": "ham pattah", "ہم جاگیر": "ham jaagiir",
    "ہم مکان": "ham makaan", "ہم گھر": "ham ghar", "ہم مسکن": "ham maskan",
    "ہم آشیانہ": "ham aashiyaanah", "ہم آبادگاہ": "ham aabaadgaah", "ہم مستقر": "ham mustaqarr",
    "ہم ٹھکانہ": "ham thikaanah", "ہم پناہ": "ham panaah", "ہم پناہ گاہ": "ham panaah gaah",
    "ہم آسرا": "ham aasraa", "ہم سہارا": "ham sahaaraa", "ہم مدد": "ham maddd",
    "ہم اعانت": "ham iaanat", "ہم مددگاری": "ham madddgaarii", "ہم تعاون": "ham taaawun",
    "ہم همکاری": "ham hamkaarii", "ہم شراکت": "ham shiraakat", "ہم حصہ داری": "ham hissah daarii",
    "ہم تقسیم": "ham taqsiim", "ہم بانٹ": "ham baant", "ہم خیرات": "ham khairaat",
    "ہم صدقہ": "ham sadqah", "ہم خیر": "ham khair", "ہم بھلائی": "ham bhalaaii",
    "ہم نیکی": "ham neki", "ہم احسان": "ham ehsaan", "ہم منّت": "ham mannat",
    "ہم فضل": "ham fazl", "ہم کرم": "ham karam", "ہم عنایت": "ham inaayat",
    "ہم نوازش": "ham nawaazish", "ہم احسان مندی": "ham ehsaan mandii",
    "ہم شکر گزاری": "ham shukr guzaarii", "ہم نعمت شناسی": "ham nemat shinaasii",
    "ہم حمد": "ham hamd", "ہم ثناء": "ham sanaa", "ہم تسبیح": "ham tasbiih",
    "ہم تحمید": "ham tahmiid", "ہم تکبیر": "ham takbiir", "ہم تہلیل": "ham tahliil",
    "ہم تصدیق": "ham tasdeeq", "ہم اقرار": "ham iqraar", "ہم اعتراف": "ham itraaf",
    "ہم تسلیم": "ham taslim", "ہم رضا": "ham razaa", "ہم خوشامد": "ham khushaamad",
    "ہم ستائش": "ham staaish", "ہم مدح": "ham madah", "ہم ثناء": "ham sanaa",
    "ہم آفرین": "ham aafariin", "ہم واہ واہ": "ham waah waah", "ہم تعریف": "ham taareef",
    "ہم توصیف": "ham tauseef", "ہم تمجید": "ham tamjiid", "ہم تکریم": "ham takriim",
    "ہم احترام": "ham ehtiraam", "ہم تعظیم": "ham taaziim", "ہم اکرام": "ham ikraam",
    "ہم تکریم": "ham takriim", "ہم سلام": "ham salaam", "ہم تحیت": "ham tahiyyat",
    "ہم آداب": "ham aadaab", "ہم تعظیمات": "ham taaziimaat", "ہم سلوات": "ham salawaat",
    "ہم درود": "ham daruud", "ہم صلاۃ": "ham salaat", "ہم سلامتی": "ham salaamati",
    "ہم امن": "ham aman", "ہم آشتی": "ham aashtii", "ہم صلح": "ham sulh",
    "ہم مصالحت": "ham musaalahat", "ہم سازش": "ham saazish", "ہم سولہ": "ham solah",
    "ہم معاہدہ": "ham moaahedah", "ہم عہد و پیمان": "ham ahd o piimaan",
    "ہم وعدہ": "ham waadah", "ہم عہد": "ham ahd", "ہم قسم": "ham qasm",
    "ہم حلف": "ham half", "ہم بیعت": "ham baiat", "ہم عقد": "ham aqd",
    "ہم نکاح": "ham nikaah", "ہم شادی": "ham shaadii", "ہم ازدواج": "ham azdawaaj",
    "ہم خانہ آبادی": "ham khaanah aabaadii", "ہم اولاد": "ham aulaad", "ہم نسل": "ham nasl",
    "ہم قبیلہ": "ham qabiilah", "ہم خاندان": "ham khaandaan", "ہم بزرگ": "ham buzurg",
    "ہم باپ دادا": "ham baap daadaa", "ہم اجداد": "ham ajdaad", "ہم پردادا": "ham pardaadaa",
    "ہم ناتا": "ham naataa", "ہم رشتہ": "ham rishtah", "ہم قرابت": "ham qaraabat",
    "ہم خویش": "ham khwiish", "ہم عزیز": "ham aziiz", "ہم دوست": "ham dost",
    "ہم یار": "ham yaar", "ہم رفیق": "ham rafiiq", "ہم ہمدم": "ham hamdam",
    "ہم ہم نشین": "ham ham nashiin", "ہم ہم سفر": "ham ham safar", "ہم ہم عمر": "ham ham umr",
    "ہم ہم مکتب": "ham ham maktab", "ہم ہم جماعت": "ham ham jamaaat", "ہم ہم پلہ": "ham ham pallah",
    "ہم ہم سر": "ham ham sar", "ہم ہم پایہ": "ham ham paayah", "ہم ہم خیال": "ham ham khayaal",
    "ہم ہم عقیدہ": "ham ham aqiidah", "ہم ہم مسلک": "ham ham maslak", "ہم ہم مذہب": "ham ham mazhab",
    "ہم ہم وطن": "ham ham watan", "ہم ہم زبان": "ham ham zubaan", "ہم ہم قوم": "ham ham qaum",
    "ہم ہم خاندان": "ham ham khaandaan", "ہم ہم نسب": "ham ham nasab", "ہم ہم شجرہ": "ham ham shajarah",
    "ہم ہم ریشہ": "ham ham riishah", "ہم ہم بنیاد": "ham ham buniyaad", "ہم ہم اصل": "ham ham asal",
    "ہم ہم جنس": "ham ham jins", "ہم ہم صنف": "ham ham sanf", "ہم ہم نوع": "ham ham nau",
    "ہم ہم ذات": "ham ham zaat", "ہم ہم سرشت": "ham ham sarisht", "ہم ہم فطرت": "ham ham fitrat",
    "ہم ہم طبع": "ham ham taba", "ہم ہم مزاج": "ham ham mizaaj", "ہم ہم خُو": "ham ham khuu",
    "ہم ہم ذوق": "ham ham zauq", "ہم ہم شوق": "ham ham shauq", "ہم ہم میل": "ham ham mail",
    "ہم ہم رنگ": "ham ham rang", "ہم ہم آہنگ": "ham ham aahang", "ہم ہم نوا": "ham ham nawaa",
    "ہم ہم آواز": "ham ham aawaaz", "ہم ہم آہن": "ham ham aahan", "ہم ہم عصر": "ham ham asr",
    "ہم ہم زمانہ": "ham ham zamaanah", "ہم ہم عہد": "ham ham ahd", "ہم ہم دور": "ham ham daur",
    "ہم ہم قرن": "ham ham qarn", "ہم ہم صدی": "ham ham sadii", "ہم ہم سال": "ham ham saal",
    "ہم ہم مہینہ": "ham ham maheenah", "ہم ہم ہفتہ": "ham ham haftah", "ہم ہم دن": "ham ham din",
    "ہم ہم رات": "ham ham raat", "ہم ہم وقت": "ham ham waqt", "ہم ہم لمحہ": "ham ham lamhah",
    "ہم ہم پل": "ham ham pal", "ہم ہم چشم": "ham ham chashm", "ہم ہم نگاہ": "ham ham nigaah",
    "ہم ہم نظر": "ham ham nazar", "ہم ہم بصر": "ham ham basar", "ہم ہم بصیرت": "ham ham baseerat",
    "ہم ہم درک": "ham ham idraak", "ہم ہم فہم": "ham ham fahm", "ہم ہم عقل": "ham ham aql",
    "ہم ہم ذہن": "ham ham zehn", "ہم ہم خیال": "ham ham khayaal", "ہم ہم فکر": "ham ham fikr",
    "ہم ہم سوچ": "ham ham soch", "ہم ہم سمجھ": "ham ham samajh", "ہم ہم شعور": "ham ham shaoor",
    "ہم ہم احساس": "ham ham ehsaas", "ہم ہم جذبہ": "ham ham jazbah", "ہم ہم خواہش": "ham ham khwaaish",
    "ہم ہم ارادہ": "ham ham iraadah", "ہم ہم قصد": "ham ham qasd", "ہم ہم نیت": "ham ham niyat",
    "ہم ہم دل": "ham ham dil", "ہم ہم جان": "ham ham jaan", "ہم ہم روح": "ham ham rooh",
    "ہم ہم نفس": "ham ham nafs", "ہم ہم قلب": "ham ham qalb", "ہم ہم سرائر": "ham ham saraair",
    "ہم ہم ضمیر": "ham ham zamiir", "ہم ہم وجدان": "ham ham wijdaan", "ہم ہم ہوش": "ham ham hosh",
    "ہم ہم خُودی": "ham ham khudii", "ہم ہم انانیت": "ham ham anaaniyat", "ہم ہم غرور": "ham ham ghuroor",
    "ہم ہم تکبر": "ham ham takabbur", "ہم ہم عجب": "ham ham ujub", "ہم ہم حسد": "ham ham hasad",
    "ہم ہم بغض": "ham ham bugz", "ہم ہم کینہ": "ham ham kiinah", "ہم ہم عداوت": "ham ham adaawat",
    "ہم ہم دشمنی": "ham ham dushmanii", "ہم ہم رشک": "ham ham rishk", "ہم ہم غبطہ": "ham ham ghibtah",
    "ہم ہم رحم": "ham ham rahm", "ہم ہم ترس": "ham ham tars", "ہم ہم شفقت": "ham ham shafqat",
    "ہم ہم محبت": "ham ham mohabbat", "ہم ہم الفت": "ham ham ulfat", "ہم ہم دوستی": "ham ham dostii",
    "ہم ہم یاری": "ham ham yaarii", "ہم ہم رفاقت": "ham ham rufaqqat", "ہم ہم صحبت": "ham ham sohbat",
    "ہم ہم معاشرت": "ham ham muaaasharat", "ہم ہم ملنساری": "ham ham milnasaarii", "ہم ہم خلوص": "ham ham khulus",
    "ہم ہم صداقت": "ham ham sadaaqat", "ہم ہم دیانت": "ham ham diyaanat", "ہم ہم امانت": "ham ham amaanat",
    "ہم ہم وفا": "ham ham wafaa", "ہم ہم عہد شکنی": "ham ham ahd shiknii", "ہم ہم خیانت": "ham ham khiyaanat",
    "ہم ہم جھوٹ": "ham ham jhooth", "ہم ہم فریب": "ham ham fareb", "ہم ہم دھوکہ": "ham ham dhokhaa",
    "ہم ہم نیرنگی": "ham ham neerangii", "ہم ہم حیلہ": "ham ham heelah", "ہم ہم ترکیب": "ham ham tarkiib",
    "ہم ہم چال": "ham ham chaal", "ہم ہم دام": "ham ham daam", "ہم ہم جال": "ham ham jaal",
    "ہم ہم حیلہ سازی": "ham ham heelah saazii", "ہم ہم مکاری": "ham ham makaarii", "ہم ہم عیاری": "ham ham aiyaarii",
    "ہم ہم سادہ دلی": "ham ham saadah dilii", "ہم ہم سادگی": "ham ham saadagii", "ہم ہم بے ساختگی": "ham ham be saakhtagii",
    "ہم ہم فطرت": "ham ham fitrat", "ہم ہم سرشت": "ham ham sarisht", "ہم ہم طبع": "ham ham taba",
    "ہم ہم مزاج": "ham ham mizaaj", "ہم ہم خُو": "ham ham khuu", "ہم ہم ذات": "ham ham zaat",
    "ہم ہم ہستی": "ham ham hastii", "ہم ہم وجود": "ham ham wujuud", "ہم ہم عدم": "ham ham adum",
    "ہم ہم فنا": "ham ham fanaa", "ہم ہم بقا": "ham ham baqaa", "ہم ہم دوام": "ham ham dawaam",
    "ہم ہم زوال": "ham ham zawaal", "ہم ہم تباہی": "ham ham tabaahii", "ہم ہم بربادی": "ham ham barbaadii",
    "ہم ہم تباہ و برباد": "ham ham tabaah o barbaad", "ہم ہم ہلاکت": "ham ham halaakat",
    "ہم ہم موت": "ham ham maut", "ہم ہم فوت": "ham ham faut", "ہم ہم وفات": "ham ham wafaat",
    "ہم ہم انتقال": "ham ham intiqaal", "ہم ہم رحلت": "ham ham rahlat", "ہم ہم شہادت": "ham ham shahaadat",
    "ہم ہم قتل": "ham ham qatl", "ہم ہم خونریزی": "ham ham khoonriizii", "ہم ہم خونخواری": "ham ham khoonkhwarii",
    "ہم ہم ظلم": "ham ham zulm", "ہم ہم ستم": "ham ham sitam", "ہم ہم جبر": "ham ham jabr",
    "ہم ہم تعدی": "ham ham tadii", "ہم ہم تجاوز": "ham ham tajaawuz", "ہم ہم سرکشی": "ham ham sarkashii",
    "ہم ہم فساد": "ham ham fasaad", "ہم ہم فتنہ": "ham ham fitnah", "ہم ہم فتور": "ham ham fatuur",
    "ہم ہم بگاڑ": "ham ham bigaar", "ہم ہم اصلاح": "ham ham islaah", "ہم ہم تصحیح": "ham ham tasheeh",
    "ہم ہم درستگی": "ham ham durustagii", "ہم ہم سدھار": "ham ham sidhaar", "ہم ہم تجدید": "ham ham tajdiid",
    "ہم ہم احیا": "ham ham ahyaa", "ہم ہم تعمیر": "ham ham tamiir", "ہم ہم تشکیل": "ham ham tashkiil",
    "ہم ہم تنظیم": "ham ham tanziim", "ہم ہم انتظام": "ham ham intizaam", "ہم ہم بندوبست": "ham ham bandobast",
    "ہم ہم نظامت": "ham ham nizaamat", "ہم ہم ریاست": "ham ham riyaasat", "ہم ہم حکومت": "ham ham hukumat",
    "ہم ہم سلطنت": "ham ham saltanat", "ہم ہم ملکیت": "ham ham milkiyat", "ہم ہم ملک": "ham ham mulk",
    "ہم ہم سرزمین": "ham ham sarzamiin", "ہم ہم خطہ": "ham ham kittah", "ہم ہم اقلیم": "ham ham iqlim",
    "ہم ہم علاقہ": "ham ham ilaaqah", "ہم ہم پٹہ": "ham ham pattah", "ہم ہم جاگیر": "ham ham jaagiir",
    "ہم ہم مکان": "ham ham makaan", "ہم ہم گھر": "ham ham ghar", "ہم ہم مسکن": "ham ham maskan",
    "ہم ہم آشیانہ": "ham ham aashiyaanah", "ہم ہم آبادگاہ": "ham ham aabaadgaah", "ہم ہم مستقر": "ham ham mustaqarr",
    "ہم ہم ٹھکانہ": "ham ham thikaanah", "ہم ہم پناہ": "ham ham panaah", "ہم ہم پناہ گاہ": "ham ham panaah gaah",
    "ہم ہم آسرا": "ham ham aasraa", "ہم ہم سہارا": "ham ham sahaaraa", "ہم ہم مدد": "ham ham maddd",
    "ہم ہم اعانت": "ham ham iaanat", "ہم ہم مددگاری": "ham ham madddgaarii", "ہم ہم تعاون": "ham ham taaawun",
    "ہم ہم همکاری": "ham ham hamkaarii", "ہم ہم شراکت": "ham ham shiraakat", "ہم ہم حصہ داری": "ham ham hissah daarii",
    "ہم ہم تقسیم": "ham ham taqsiim", "ہم ہم بانٹ": "ham ham baant", "ہم ہم خیرات": "ham ham khairaat",
    "ہم ہم صدقہ": "ham ham sadqah", "ہم ہم خیر": "ham ham khair", "ہم ہم بھلائی": "ham ham bhalaaii",
    "ہم ہم نیکی": "ham ham neki", "ہم ہم احسان": "ham ham ehsaan", "ہم ہم منّت": "ham ham mannat",
    "ہم ہم فضل": "ham ham fazl", "ہم ہم کرم": "ham ham karam", "ہم ہم عنایت": "ham ham inaayat",
    "ہم ہم نوازش": "ham ham nawaazish", "ہم ہم احسان مندی": "ham ham ehsaan mandii",
    "ہم ہم شکر گزاری": "ham ham shukr guzaarii", "ہم ہم نعمت شناسی": "ham ham nemat shinaasii",
    "ہم ہم حمد": "ham ham hamd", "ہم ہم ثناء": "ham ham sanaa", "ہم ہم تسبیح": "ham ham tasbiih",
    "ہم ہم تحمید": "ham ham tahmiid", "ہم ہم تکبیر": "ham ham takbiir", "ہم ہم تہلیل": "ham ham tahliil",
    "ہم ہم تصدیق": "ham ham tasdeeq", "ہم ہم اقرار": "ham ham iqraar", "ہم ہم اعتراف": "ham ham itraaf",
    "ہم ہم تسلیم": "ham ham taslim", "ہم ہم رضا": "ham ham razaa", "ہم ہم خوشامد": "ham ham khushaamad",
    "ہم ہم ستائش": "ham ham staaish", "ہم ہم مدح": "ham ham madah", "ہم ہم ثناء": "ham ham sanaa",
    "ہم ہم آفرین": "ham ham aafariin", "ہم ہم واہ واہ": "ham ham waah waah", "ہم ہم تعریف": "ham ham taareef",
    "ہم ہم توصیف": "ham ham tauseef", "ہم ہم تمجید": "ham ham tamjiid", "ہم ہم تکریم": "ham ham takriim",
    "ہم ہم احترام": "ham ham ehtiraam", "ہم ہم تعظیم": "ham ham taaziim", "ہم ہم اکرام": "ham ham ikraam",
    "ہم ہم تکریم": "ham ham takriim", "ہم ہم سلام": "ham ham salaam", "ہم ہم تحیت": "ham ham tahiyyat",
    "ہم ہم آداب": "ham ham aadaab", "ہم ہم تعظیمات": "ham ham taaziimaat", "ہم ہم سلوات": "ham ham salawaat",
    "ہم ہم درود": "ham ham daruud", "ہم ہم صلاۃ": "ham ham salaat", "ہم ہم سلامتی": "ham ham salaamati",
    "ہم ہم امن": "ham ham aman", "ہم ہم آشتی": "ham ham aashtii", "ہم ہم صلح": "ham ham sulh",
    "ہم ہم مصالحت": "ham ham musaalahat", "ہم ہم سازش": "ham ham saazish", "ہم ہم سولہ": "ham ham solah",
    "ہم ہم معاہدہ": "ham ham moaahedah", "ہم ہم عہد و پیمان": "ham ham ahd o piimaan",
    "ہم ہم وعدہ": "ham ham waadah", "ہم ہم عہد": "ham ham ahd", "ہم ہم قسم": "ham ham qasm",
    "ہم ہم حلف": "ham ham half", "ہم ہم بیعت": "ham ham baiat", "ہم ہم عقد": "ham ham aqd",
    "ہم ہم نکاح": "ham ham nikaah", "ہم ہم شادی": "ham ham shaadii", "ہم ہم ازدواج": "ham ham azdawaaj",
    "ہم ہم خانہ آبادی": "ham ham khaanah aabaadii", "ہم ہم اولاد": "ham ham aulaad", "ہم ہم نسل": "ham ham nasl",
    "ہم ہم قبیلہ": "ham ham qabiilah", "ہم ہم خاندان": "ham ham khaandaan", "ہم ہم بزرگ": "ham ham buzurg",
    "ہم ہم باپ دادا": "ham ham baap daadaa", "ہم ہم اجداد": "ham ham ajdaad", "ہم ہم پردادا": "ham ham pardaadaa",
    "ہم ہم ناتا": "ham ham naataa", "ہم ہم رشتہ": "ham ham rishtah", "ہم ہم قرابت": "ham ham qaraabat",
    "ہم ہم خویش": "ham ham khwiish", "ہم ہم عزیز": "ham ham aziiz", "ہم ہم دوست": "ham ham dost",
    "ہم ہم یار": "ham ham yaar", "ہم ہم رفیق": "ham ham rafiiq", "ہم ہم ہمدم": "ham ham hamdam",
  };

  // Sorted by length (longest first)
  const sortedKeys = Object.keys(replacements).sort((a, b) => b.length - a.length);
  
  for (const urdu of sortedKeys) {
    const regex = new RegExp(urdu.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "g");
    roman = roman.replace(regex, replacements[urdu]);
  }
  
  // Character mapping for remaining Urdu text
  const charMap = {
    "ا": "aa", "آ": "aa", "ب": "b", "پ": "p", "ت": "t", "ٹ": "t", "ث": "s",
    "ج": "j", "چ": "ch", "ح": "h", "خ": "kh", "د": "d", "ڈ": "d", "ذ": "z",
    "ر": "r", "ڑ": "r", "ز": "z", "ژ": "zh", "س": "s", "ش": "sh", "ص": "s",
    "ض": "z", "ط": "t", "ظ": "z", "ع": "a", "غ": "gh", "ف": "f", "ق": "q",
    "ک": "k", "گ": "g", "ل": "l", "م": "m", "ن": "n", "ں": "n", "و": "o",
    "ہ": "h", "ھ": "h", "ی": "i", "ے": "e", "ء": "'", "ئ": "i", "ؤ": "o",
    "ۂ": "h", "ۓ": "e", "َ": "", "ِ": "", "ُ": "", "ّ": "", "ْ": "", "ٰ": "",
    "ٖ": "", "ٗ": "", "٘": "", "ٙ": "", "ٚ": "", "ٛ": "", "ٜ": "", "ٝ": "",
    "ٞ": "", "ٟ": "", "۔": ".", "،": ",", "؟": "?", "؛": ";",
  };

  let result = "";
  for (const char of roman) {
    result += charMap[char] || char;
  }
  
  return result.replace(/\s+/g, " ").trim();
};

// ─── TTS Helper Functions ───
const speakText = (text, lang = "hi-IN", rate = 0.8) => {
  if (!text || !window.speechSynthesis) {
    console.warn("TTS not supported or no text");
    return null;
  }
  
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices() || [];
  
  const hindiVoice = voices.find(v => 
    v.lang.includes("hi") || v.lang.includes("HI") ||
    v.name.toLowerCase().includes("hindi") ||
    v.name.toLowerCase().includes("google हिन्दी")
  );
  
  if (hindiVoice) {
    utterance.voice = hindiVoice;
    utterance.lang = hindiVoice.lang;
  } else {
    utterance.lang = "hi-IN";
  }
  
  utterance.rate = rate;
  utterance.pitch = 1;
  utterance.volume = 1;
  
  window.speechSynthesis.speak(utterance);
  return utterance;
};

const stopSpeaking = () => {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
};

export default function QuranReader() {
  const [view, setView] = useState("list");
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReciter, setSelectedReciter] = useState(RECITERS[0]);
  const [selectedTranslation, setSelectedTranslation] = useState(TRANSLATIONS[0]);
  const [playingAyah, setPlayingAyah] = useState(null);
  const [playingMode, setPlayingMode] = useState(null);
  const [showTranslation, setShowTranslation] = useState(true);
  const [fontSize, setFontSize] = useState(28);
  const [bookmarks, setBookmarks] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const audioRef = useRef(null);

  const filteredSurahs = SURAHS.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.arabic.includes(searchQuery) ||
    s.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(s.number).includes(searchQuery)
  );

  const loadSurah = async (surah) => {
    setSelectedSurah(surah);
    setView("reader");
    setLoading(true);
    setAyahs([]);
    stopAllAudio();
    try {
      const res = await fetch(
        `https://api.alquran.cloud/v1/surah/${surah.number}/editions/quran-uthmani,${selectedTranslation.id}`
      );
      const data = await res.json();
      if (data.code === 200) {
        const arabicAyahs = data.data[0].ayahs;
        const transAyahs = data.data[1].ayahs;
        const combined = arabicAyahs.map((a, i) => ({
          number: a.numberInSurah,
          arabic: a.text,
          translation: transAyahs[i]?.text || "",
          audioUrl: `https://cdn.islamic.network/quran/audio/128/${selectedReciter.id}/${a.number}.mp3`,
        }));
        setAyahs(combined);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const stopAllAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    stopSpeaking();
    setPlayingAyah(null);
    setPlayingMode(null);
  };

  const playArabic = (ayah) => {
    stopAllAudio();
    const audio = new Audio(ayah.audioUrl);
    audioRef.current = audio;
    audio.play();
    setPlayingAyah(ayah.number);
    setPlayingMode("arabic");
    audio.onended = () => {
      setPlayingAyah(null);
      setPlayingMode(null);
    };
  };

  const playTranslation = (ayah) => {
    if (!window.speechSynthesis) {
      alert("Aapka browser TTS support nahi karta");
      return;
    }
    
    stopAllAudio();
    setPlayingAyah(ayah.number);
    setPlayingMode("translation");
    
    const cleanText = ayah.translation
      .replace(/[﴾﴿]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    
    const romanUrdu = toRomanUrdu(cleanText);
    speakText(romanUrdu, "hi-IN", 0.8);
    
    const duration = Math.max(3000, romanUrdu.length * 90);
    setTimeout(() => {
      setPlayingAyah(null);
      setPlayingMode(null);
    }, duration);
  };

  const playBoth = (ayah) => {
    stopAllAudio();
    setPlayingAyah(ayah.number);
    setPlayingMode("both");

    const audio = new Audio(ayah.audioUrl);
    audioRef.current = audio;
    audio.play();

    audio.onended = () => {
      const cleanText = ayah.translation
        .replace(/[﴾﴿]/g, "")
        .replace(/\s+/g, " ")
        .trim();
      const romanUrdu = toRomanUrdu(cleanText);
      speakText(romanUrdu, "hi-IN", 0.8);
      
      const duration = Math.max(3000, romanUrdu.length * 90);
      setTimeout(() => {
        setPlayingAyah(null);
        setPlayingMode(null);
      }, duration);
    };
  };

  const handlePlay = (ayah, mode = "both") => {
    if (playingAyah === ayah.number && playingMode === mode) {
      stopAllAudio();
      return;
    }
    if (mode === "arabic") playArabic(ayah);
    else if (mode === "translation") playTranslation(ayah);
    else playBoth(ayah);
  };

  const toggleBookmark = (ayahNumber) => {
    const key = `${selectedSurah.number}:${ayahNumber}`;
    setBookmarks(prev =>
      prev.includes(key) ? prev.filter(b => b !== key) : [...prev, key]
    );
  };

  const isBookmarked = (ayahNumber) =>
    bookmarks.includes(`${selectedSurah?.number}:${ayahNumber}`);

  // ── SURAH LIST VIEW ──
  if (view === "list") {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#0c1118",
        color: "#e2d9c8",
        fontFamily: "'Georgia', serif",
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Amiri:ital@0;1&display=swap');
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-track { background: #0c1118; }
          ::-webkit-scrollbar-thumb { background: #2a3040; border-radius: 4px; }
          .surah-row:hover { background: rgba(201,168,76,0.06) !important; border-color: rgba(201,168,76,0.3) !important; }
          .surah-row { transition: all 0.2s ease; }
          @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
          .fade-in { animation: fadeIn 0.4s ease forwards; }
        `}</style>

        <div style={{
          background: "linear-gradient(180deg, #111820 0%, #0c1118 100%)",
          borderBottom: "1px solid rgba(201,168,76,0.15)",
          padding: "32px 20px 24px",
          textAlign: "center",
          position: "sticky", top: 0, zIndex: 10,
          backdropFilter: "blur(20px)",
        }}>
          <div style={{ maxWidth: "640px", margin: "0 auto" }}>
            <div style={{ fontSize: "13px", color: "#C9A84C", letterSpacing: "4px", marginBottom: "6px", opacity: 0.8 }}>
              القرآن الكريم
            </div>
            <h1 style={{ fontSize: "26px", fontWeight: "400", margin: "0 0 20px", letterSpacing: "1px" }}>
              Al-Quran Al-Kareem
            </h1>
            <div style={{ position: "relative" }}>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Surah dhundein... (naam, number, meaning)"
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(201,168,76,0.2)",
                  borderRadius: "12px",
                  padding: "12px 16px 12px 42px",
                  color: "#e2d9c8", fontSize: "14px",
                  outline: "none",
                }}
              />
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", opacity: 0.5 }}>🔍</span>
            </div>
          </div>
        </div>

        <div style={{
          display: "flex", justifyContent: "center", gap: "32px",
          padding: "16px", borderBottom: "1px solid rgba(255,255,255,0.05)",
          fontSize: "12px", color: "#5a5040",
        }}>
          <span>114 Surahs</span>
          <span style={{ color: "#C9A84C", opacity: 0.4 }}>•</span>
          <span>6,236 Ayaat</span>
          <span style={{ color: "#C9A84C", opacity: 0.4 }}>•</span>
          <span>30 Paras</span>
          {bookmarks.length > 0 && <>
            <span style={{ color: "#C9A84C", opacity: 0.4 }}>•</span>
            <span style={{ color: "#C9A84C" }}>🔖 {bookmarks.length} Bookmarks</span>
          </>}
        </div>

        <div style={{ maxWidth: "640px", margin: "0 auto", padding: "16px 16px 60px" }}>
          {filteredSurahs.map((surah, i) => (
            <div
              key={surah.number}
              className="surah-row fade-in"
              onClick={() => loadSurah(surah)}
              style={{
                display: "flex", alignItems: "center",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "14px",
                padding: "14px 16px",
                marginBottom: "8px",
                cursor: "pointer",
                animationDelay: `${i * 0.03}s`,
                opacity: 0,
              }}
            >
              <div style={{
                width: "40px", height: "40px", flexShrink: 0,
                background: "rgba(201,168,76,0.08)",
                border: "1px solid rgba(201,168,76,0.2)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "13px", color: "#C9A84C", fontFamily: "monospace",
                marginRight: "14px",
              }}>
                {surah.number}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "15px", marginBottom: "2px" }}>{surah.name}</div>
                <div style={{ fontSize: "12px", color: "#5a5040" }}>{surah.meaning} • {surah.ayahs} ayaat</div>
              </div>
              <div style={{
                fontFamily: "'Amiri', 'Traditional Arabic', serif",
                fontSize: "22px", color: "#C9A84C", opacity: 0.8,
                textAlign: "right",
              }}>
                {surah.arabic}
              </div>
            </div>
          ))}

          {filteredSurahs.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#3a3028" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔍</div>
              <p>Koi surah nahi mili</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── READER VIEW ──
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0c1118",
      color: "#e2d9c8",
      fontFamily: "'Georgia', serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:ital@0;1&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0c1118; }
        ::-webkit-scrollbar-thumb { background: #2a3040; border-radius: 4px; }
        .ayah-card:hover .ayah-actions { opacity: 1 !important; }
        .ayah-card { transition: background 0.2s; }
        .ayah-card:hover { background: rgba(201,168,76,0.04) !important; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .ayah-card { animation: fadeUp 0.4s ease forwards; opacity: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .play-btn { transition: all 0.2s; }
        .play-btn:hover { transform: scale(1.1); }
        .play-btn.active { background: rgba(201,168,76,0.25) !important; border-color: #C9A84C !important; }
      `}</style>

      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "rgba(12,17,24,0.95)",
        borderBottom: "1px solid rgba(201,168,76,0.12)",
        backdropFilter: "blur(20px)",
        padding: "0 16px",
      }}>
        <div style={{
          maxWidth: "680px", margin: "0 auto",
          display: "flex", alignItems: "center",
          height: "56px", gap: "12px",
        }}>
          <button onClick={() => { 
            setView("list"); 
            stopAllAudio();
          }}
            style={{
              background: "none", border: "none", color: "#C9A84C",
              cursor: "pointer", fontSize: "20px", padding: "4px 8px",
              borderRadius: "8px", flexShrink: 0,
            }}>
            ←
          </button>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "15px", fontWeight: "500" }}>{selectedSurah?.name}</div>
            <div style={{ fontSize: "11px", color: "#5a5040" }}>
              {selectedSurah?.ayahs} ayaat • {selectedSurah?.meaning}
            </div>
          </div>

          <div style={{
            fontFamily: "'Amiri', serif", fontSize: "20px",
            color: "#C9A84C", opacity: 0.7,
          }}>
            {selectedSurah?.arabic}
          </div>

          <button onClick={() => setSettingsOpen(!settingsOpen)}
            style={{
              background: settingsOpen ? "rgba(201,168,76,0.15)" : "none",
              border: "1px solid rgba(201,168,76,0.2)",
              color: "#C9A84C", cursor: "pointer",
              fontSize: "14px", padding: "6px 10px",
              borderRadius: "8px", flexShrink: 0,
            }}>
            ⚙️
          </button>
        </div>

        {settingsOpen && (
          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            padding: "16px",
            maxWidth: "680px", margin: "0 auto",
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "12px" }}>
              <div>
                <div style={{ color: "#5a5040", marginBottom: "6px" }}>Qari</div>
                <select
                  value={selectedReciter.id}
                  onChange={e => setSelectedReciter(RECITERS.find(r => r.id === e.target.value))}
                  style={{
                    width: "100%", background: "#111820",
                    border: "1px solid rgba(201,168,76,0.2)",
                    color: "#e2d9c8", padding: "8px", borderRadius: "8px",
                    fontSize: "12px",
                  }}
                >
                  {RECITERS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>

              <div>
                <div style={{ color: "#5a5040", marginBottom: "6px" }}>Translation</div>
                <select
                  value={selectedTranslation.id}
                  onChange={e => {
                    setSelectedTranslation(TRANSLATIONS.find(t => t.id === e.target.value));
                    if (selectedSurah) loadSurah(selectedSurah);
                  }}
                  style={{
                    width: "100%", background: "#111820",
                    border: "1px solid rgba(201,168,76,0.2)",
                    color: "#e2d9c8", padding: "8px", borderRadius: "8px",
                    fontSize: "12px",
                  }}
                >
                  {TRANSLATIONS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>

              <div>
                <div style={{ color: "#5a5040", marginBottom: "6px" }}>Arabic Font Size: {fontSize}px</div>
                <input type="range" min="20" max="40" value={fontSize}
                  onChange={e => setFontSize(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#C9A84C" }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingTop: "18px" }}>
                <span style={{ color: "#5a5040" }}>Translation</span>
                <button
                  onClick={() => setShowTranslation(!showTranslation)}
                  style={{
                    background: showTranslation ? "#C9A84C" : "rgba(255,255,255,0.05)",
                    border: "none", borderRadius: "20px",
                    width: "44px", height: "24px", cursor: "pointer",
                    position: "relative", transition: "all 0.2s",
                  }}
                >
                  <span style={{
                    position: "absolute", top: "3px",
                    left: showTranslation ? "22px" : "3px",
                    width: "18px", height: "18px",
                    background: "white", borderRadius: "50%",
                    transition: "left 0.2s",
                  }} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedSurah?.number !== 9 && (
        <div style={{
          textAlign: "center", padding: "32px 20px 8px",
          fontFamily: "'Amiri', serif",
          fontSize: "28px", color: "#C9A84C", opacity: 0.7,
          letterSpacing: "2px",
        }}>
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{
            width: "40px", height: "40px", margin: "0 auto 20px",
            border: "2px solid rgba(201,168,76,0.2)",
            borderTopColor: "#C9A84C",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }} />
          <p style={{ color: "#5a5040", fontSize: "14px" }}>Loading {selectedSurah?.name}...</p>
        </div>
      )}

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "16px 16px 80px" }}>
        {ayahs.map((ayah, i) => {
          const isPlaying = playingAyah === ayah.number;
          return (
            <div
              key={ayah.number}
              className="ayah-card"
              style={{
                background: isBookmarked(ayah.number) ? "rgba(201,168,76,0.04)" : "transparent",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                padding: "24px 8px",
                animationDelay: `${i * 0.04}s`,
                position: "relative",
              }}
            >
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: "16px",
              }}>
                <div style={{
                  width: "34px", height: "34px",
                  background: isPlaying ? "rgba(201,168,76,0.2)" : "rgba(201,168,76,0.08)",
                  border: `1px solid ${isPlaying ? "#C9A84C" : "rgba(201,168,76,0.15)"}`,
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", color: "#C9A84C", fontFamily: "monospace",
                }}>
                  {isPlaying ? "♪" : ayah.number}
                </div>

                <div className="ayah-actions" style={{
                  display: "flex", gap: "6px", opacity: 0.4,
                  transition: "opacity 0.2s", alignItems: "center",
                }}>
                  <button
                    onClick={() => handlePlay(ayah, "arabic")}
                    className={`play-btn ${isPlaying && playingMode === "arabic" ? "active" : ""}`}
                    style={{
                      background: isPlaying && playingMode === "arabic" ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(201,168,76,0.2)",
                      borderRadius: "8px", padding: "6px 10px",
                      color: "#C9A84C", cursor: "pointer", fontSize: "12px",
                    }}
                    title="Arabic Qirat"
                  >
                    {isPlaying && playingMode === "arabic" ? "⏸" : "▶"} عربي
                  </button>

                  <button
                    onClick={() => handlePlay(ayah, "translation")}
                    className={`play-btn ${isPlaying && playingMode === "translation" ? "active" : ""}`}
                    style={{
                      background: isPlaying && playingMode === "translation" ? "rgba(39,174,96,0.2)" : "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(39,174,96,0.3)",
                      borderRadius: "8px", padding: "6px 10px",
                      color: "#27AE60", cursor: "pointer", fontSize: "12px",
                    }}
                    title="Roman Urdu Translation"
                  >
                    {isPlaying && playingMode === "translation" ? "⏸" : "▶"} ترجمہ
                  </button>

                  <button
                    onClick={() => handlePlay(ayah, "both")}
                    className={`play-btn ${isPlaying && playingMode === "both" ? "active" : ""}`}
                    style={{
                      background: isPlaying && playingMode === "both" ? "rgba(142,68,173,0.2)" : "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(142,68,173,0.3)",
                      borderRadius: "8px", padding: "6px 10px",
                      color: "#8E44AD", cursor: "pointer", fontSize: "12px",
                    }}
                    title="Arabic + Translation"
                  >
                    {isPlaying && playingMode === "both" ? "⏸" : "▶"} دونوں
                  </button>

                  <button
                    onClick={() => toggleBookmark(ayah.number)}
                    style={{
                      background: isBookmarked(ayah.number) ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(201,168,76,0.2)",
                      borderRadius: "8px", padding: "6px 10px",
                      color: isBookmarked(ayah.number) ? "#C9A84C" : "#5a5040",
                      cursor: "pointer", fontSize: "14px",
                    }}
                    title="Bookmark"
                  >
                    🔖
                  </button>
                </div>
              </div>

              <div style={{
                fontFamily: "'Amiri', 'Traditional Arabic', serif",
                fontSize: `${fontSize}px`,
                lineHeight: "2.4",
                textAlign: "right",
                direction: "rtl",
                color: "#f0e8d5",
                marginBottom: showTranslation ? "16px" : "0",
                padding: "8px 0",
              }}>
                {ayah.arabic}
                <span style={{
                  display: "inline-block", marginRight: "8px",
                  fontSize: "18px", color: "#C9A84C", opacity: 0.6,
                  fontFamily: "serif",
                }}>
                  ﴿{toArabicNum(ayah.number)}﴾
                </span>
              </div>

              {showTranslation && (
                <div style={{
                  fontSize: "13px", color: "#9a8870",
                  lineHeight: "1.9",
                  borderLeft: "2px solid rgba(201,168,76,0.15)",
                  paddingLeft: "12px",
                }}>
                  {ayah.translation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function toArabicNum(n) {
  return String(n).replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);
}