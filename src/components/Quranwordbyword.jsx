import { useState, useEffect } from "react";

const SAMPLE_SURAHS = [
  { number: 1, name: "Al-Fatihah", arabic: "الفاتحة", ayahs: 7 },
  { number: 112, name: "Al-Ikhlas", arabic: "الإخلاص", ayahs: 4 },
  { number: 113, name: "Al-Falaq", arabic: "الفلق", ayahs: 5 },
  { number: 114, name: "An-Nas", arabic: "الناس", ayahs: 6 },
  { number: 36, name: "Ya-Sin", arabic: "يس", ayahs: 83 },
  { number: 55, name: "Ar-Rahman", arabic: "الرحمن", ayahs: 78 },
  { number: 67, name: "Al-Mulk", arabic: "الملك", ayahs: 30 },
  { number: 2, name: "Al-Baqarah", arabic: "البقرة", ayahs: 286 },
];

// Comprehensive Quran Arabic-Urdu Dictionary
// Top ~500 most frequent Quran words
const QURAN_DICTIONARY = {
  // Allah & His Names
  "اللَّهِ": "Allah ka/ke", "اللَّهُ": "Allah", "اللَّه": "Allah",
  "رَبِّ": "Rabb", "رَبُّ": "Rabb hai", "رَبَّكَ": "tera Rabb", "رَبَّنَا": "hamare Rabb",
  "رَبِّهِ": "apne Rabb ka", "رَبِّهِمْ": "unke Rabb ka", "رَبَّهُ": "apne Rabb ko",
  "الرَّحْمَٰنِ": "Rehman", "الرَّحِيمِ": "Raheem", "الرَّحْمَٰنُ": "Rehman hai",
  "الْعَزِيزِ": "ghaalib", "الْعَزِيزُ": "ghaalib hai", "الْحَكِيمِ": "hikmat wala",
  "الْحَكِيمُ": "hikmat wala hai", "الْعَلِيمُ": "jaannay wala", "الْعَلِيمِ": "jaannay wale ka",
  "الْقَدِيرُ": "qadir hai", "الْغَفُورُ": "maaf karne wala", "الْغَفُورِ": "maaf karne wale ka",
  "الْكَرِيمُ": "kareem hai", "السَّمِيعُ": "sunne wala", "الْبَصِيرُ": "dekhne wala",
  "الْحَيُّ": "zinda", "الْقَيُّومُ": "qaim rakhne wala", "الْوَاحِدُ": "ek",
  "الصَّمَدُ": "bay-niyaz", "الْأَحَدُ": "yek", "أَحَدٌ": "ek",
  "الْمَلِكُ": "Badshah", "مَلِكِ": "Badshah ka", "الْقُدُّوسُ": "Paak",
  "السَّلَامُ": "Salaamati wala", "الْمُؤْمِنُ": "amaan dene wala",
  "الْخَالِقُ": "paida karne wala", "الرَّزَّاقُ": "rizq dene wala",
  "الْوَدُودُ": "muhabbat karne wala", "الْحَمِيدُ": "taarif ka haqdar",
  "الْوَلِيُّ": "dost, raakha", "الشَّكُورُ": "qadr karne wala",
  "الْحَفِيظُ": "hifaazat karne wala", "الْمُجِيبُ": "qabool karne wala",
  "الْوَاسِعُ": "wasi'", "اللَّطِيفُ": "meharbaan", "الْخَبِيرُ": "khabar rakhne wala",

  // Bismillah & Al-Fatihah
  "بِسْمِ": "naam se", "بِاسْمِ": "naam se",
  "الْحَمْدُ": "taarif", "لِلَّهِ": "Allah ke liye", "الْعَالَمِينَ": "tamam jahaan ka",
  "مَالِكِ": "Maalik", "يَوْمِ": "din ka", "الدِّينِ": "roze ka/insaaf ka",
  "إِيَّاكَ": "tujhi ko", "نَعْبُدُ": "hum ibadat karte hain",
  "وَإِيَّاكَ": "aur tujhi se", "نَسْتَعِينُ": "hum madad maangte hain",
  "اهْدِنَا": "dikha hamen", "الصِّرَاطَ": "raasta", "صِرَاطَ": "raasta",
  "الْمُسْتَقِيمَ": "seedha", "مُسْتَقِيمٍ": "seedha",
  "الَّذِينَ": "jin logon ne", "أَنْعَمْتَ": "tune inaam kiya",
  "عَلَيْهِمْ": "unpar", "عَلَيْهِ": "upar", "عَلَيْكَ": "tujhpar",
  "عَلَيْنَا": "hampar", "غَيْرِ": "na", "الْمَغْضُوبِ": "ghazab walon ka",
  "الضَّالِّينَ": "gumrah logon ka",

  // Pronouns & Particles
  "هُوَ": "woh (mard)", "هِيَ": "woh (aurat)", "هُمْ": "woh log",
  "هُمَا": "woh dono", "أَنَا": "main", "أَنتَ": "tum", "أَنتُمْ": "tum log",
  "نَحْنُ": "hum", "مَا": "jo/kya/nahi", "مَن": "kaun/jo",
  "لَا": "nahi", "لَمْ": "nahi tha", "لَن": "kabhi nahi",
  "لَيْسَ": "nahi hai", "لَوْ": "agar", "إِن": "agar/beshak",
  "إِنَّ": "beshak", "إِنَّهُ": "beshak woh", "إِنَّهُمْ": "beshak woh log",
  "إِنَّا": "beshak hum", "إِنِّي": "beshak main", "إِنَّكَ": "beshak tum",
  "إِنَّكُمْ": "beshak tum log", "كَانَ": "tha", "كَانُوا": "thay",
  "كَانَتْ": "thi", "قَدْ": "tahqeeq/zaroor", "قُلْ": "kaho",
  "قَالَ": "usne kaha", "قَالُوا": "unhon ne kaha", "قَالَتْ": "usne kahi",
  "وَ": "aur", "فَ": "toh", "ثُمَّ": "phir", "أَوْ": "ya",
  "بَلْ": "balki", "حَتَّىٰ": "yahan tak ke", "إِذَا": "jab",
  "إِذْ": "jab (pehle)", "مِن": "se", "فِي": "mein", "عَلَىٰ": "par",
  "إِلَىٰ": "ki taraf", "عَن": "se/ke baare mein", "بِ": "se/ke saath",
  "كَ": "ki tarah", "لِ": "ke liye", "هَٰذَا": "yeh", "هَٰذِهِ": "yeh",
  "ذَٰلِكَ": "woh", "تِلْكَ": "woh", "الَّتِي": "jo (aurat)",
  "الَّذِي": "jo (mard)", "كُلُّ": "har ek", "كُلَّ": "har ek",
  "كُلُّهُمْ": "woh sab", "جَمِيعًا": "sab milkar",

  // Common Nouns
  "النَّاسِ": "logon ka", "النَّاسُ": "log", "نَاسٌ": "log",
  "الْمُؤْمِنِينَ": "imaan walon", "الْمُؤْمِنُونَ": "imaan wale",
  "الْكَافِرِينَ": "kafir logon", "الْكَافِرُونَ": "kafir log",
  "الظَّالِمِينَ": "zaalim logon", "الْمُنَافِقِينَ": "munafiq logon",
  "الْمُسْلِمِينَ": "Musalman logon", "الْمُشْرِكِينَ": "mushrik logon",
  "أَهْلُ": "wale log", "أَصْحَابُ": "saathi/waale",
  "قَوْمِ": "qaum/qabile ka", "قَوْمٌ": "qaum", "قَوْمُ": "qaum",
  "أُمَّةٌ": "ummat", "أُمَمٌ": "ummatain",
  "الْيَوْمِ": "din ka/aaj", "يَوْمَ": "din ko",
  "الْآخِرَةِ": "aakhirat ki", "الدُّنْيَا": "duniya",
  "الْأَرْضِ": "zameen ki", "الْأَرْضُ": "zameen",
  "السَّمَاءِ": "aasmaan ka", "السَّمَاوَاتِ": "aasmaan",
  "الْبَحْرِ": "samandar ka", "الْبَرِّ": "khuski ka",
  "الشَّمْسِ": "sooraj ka", "الْقَمَرِ": "chaand ka",
  "اللَّيْلِ": "raat ka", "النَّهَارِ": "din ka",
  "الْمَاءِ": "paani ka", "نَارٌ": "aag", "النَّارِ": "aag ki",
  "الْجَنَّةَ": "jannat ko", "الْجَنَّةِ": "jannat ka",
  "النَّارَ": "aag ko", "جَهَنَّمَ": "jahannam",
  "الْعَذَابَ": "azaab ko", "الْعَذَابِ": "azaab ka",
  "الرَّحْمَةَ": "rahmat ko", "الرَّحْمَةِ": "rahmat ka",
  "الْهُدَىٰ": "hidaayat", "هُدًى": "hidaayat",
  "الْحَقِّ": "haq ka", "الْحَقُّ": "haq hai", "حَقٌّ": "haq",
  "الْبَاطِلَ": "baatil ko", "الْبَاطِلُ": "baatil",
  "الْعِلْمُ": "ilm", "الْعِلْمِ": "ilm ka", "عِلْمٌ": "ilm",
  "الْحِكْمَةَ": "hikmat ko", "الْحِكْمَةِ": "hikmat ka",
  "الْكِتَابَ": "kitaab ko", "الْكِتَابِ": "kitaab ka", "كِتَابٌ": "kitaab",
  "الْقُرْآنَ": "Quran ko", "الْقُرْآنِ": "Quran ka", "قُرْآنٌ": "Quran",
  "الْإِسْلَامُ": "Islam", "الْإِيمَانَ": "imaan ko", "الْإِيمَانِ": "imaan ka",
  "إِيمَانٌ": "imaan", "الصَّلَاةَ": "namaz ko", "الصَّلَاةِ": "namaz ka",
  "صَلَاةٌ": "namaz", "الزَّكَاةَ": "zakat ko", "الزَّكَاةِ": "zakat ka",
  "الصِّيَامَ": "roza ko", "الصَّبْرِ": "sabr ka", "صَبْرٌ": "sabr",
  "الشُّكْرِ": "shukar ka", "شُكْرٌ": "shukar",
  "الْمَسْجِدِ": "masjid ka", "مَسْجِدٌ": "masjid",
  "الرَّسُولُ": "Rasool hai", "الرَّسُولَ": "Rasool ko", "رَسُولٌ": "Rasool",
  "النَّبِيُّ": "Nabi hai", "النَّبِيَّ": "Nabi ko", "نَبِيٌّ": "Nabi",
  "الْمَلَائِكَةَ": "farishton ko", "مَلَائِكَةٌ": "farishte",
  "الشَّيْطَانَ": "Shaitaan ko", "الشَّيْطَانِ": "Shaitaan ka",
  "إِبْلِيسَ": "Iblees", "الْجِنَّ": "jinnat ko", "الْجِنِّ": "jinnat ka",
  "الْإِنسَانَ": "insaan ko", "الْإِنسَانِ": "insaan ka", "إِنسَانٌ": "insaan",
  "آدَمَ": "Adam AS", "إِبْرَاهِيمَ": "Ibrahim AS", "مُوسَىٰ": "Moosa AS",
  "عِيسَى": "Eesa AS", "مُحَمَّدٌ": "Muhammad SAW", "يُوسُفَ": "Yusuf AS",
  "نُوحٍ": "Nooh AS", "دَاوُودَ": "Dawood AS", "سُلَيْمَانَ": "Suleman AS",

  // Verbs
  "يَعْلَمُ": "jaanta hai", "يَعْلَمُونَ": "jaante hain", "عَلِمَ": "jaan liya",
  "يَرَىٰ": "dekhta hai", "رَأَى": "usne dekha", "يَسْمَعُ": "sunta hai",
  "يَقُولُ": "kehta hai", "يَقُولُونَ": "kehte hain",
  "يُرِيدُ": "chahta hai", "يُرِيدُونَ": "chahte hain", "أَرَادَ": "usne chaha",
  "يَأْمُرُ": "hukm deta hai", "أَمَرَ": "hukm diya",
  "يَنْهَىٰ": "mana karta hai", "نَهَىٰ": "mana kiya",
  "يَجْعَلُ": "bana deta hai", "جَعَلَ": "bana diya",
  "خَلَقَ": "paida kiya", "يَخْلُقُ": "paida karta hai",
  "يَهْدِي": "hidaayat deta hai", "هَدَىٰ": "hidaayat di",
  "يُضِلُّ": "gumraah karta hai", "أَضَلَّ": "gumraah kiya",
  "يَغْفِرُ": "maaf karta hai", "غَفَرَ": "maaf kiya",
  "يَرْزُقُ": "rizq deta hai", "رَزَقَ": "rizq diya",
  "يَتُوبُ": "maafi qabool karta hai", "تَابَ": "maafi qabool ki",
  "يُعَذِّبُ": "azaab deta hai", "يَنصُرُ": "madad karta hai",
  "نَصَرَ": "madad ki", "يَحْكُمُ": "faislah karta hai",
  "حَكَمَ": "faislah kiya", "يَشَاءُ": "chahta hai",
  "شَاءَ": "chaha", "يَكُونُ": "hoga", "كَانَ": "tha",
  "يُؤْمِنُ": "imaan laata hai", "يُؤْمِنُونَ": "imaan laate hain",
  "آمَنَ": "imaan laaya", "آمَنُوا": "imaan laaye",
  "كَفَرَ": "kaafir hua", "كَفَرُوا": "kaafir huay",
  "ظَلَمَ": "zulm kiya", "ظَلَمُوا": "zulm kiya",
  "أَطَاعَ": "itaa'at ki", "يُطِيعُ": "itaa'at karta hai",
  "عَصَىٰ": "naafarmani ki", "يَعْبُدُ": "ibadat karta hai",
  "عَبَدَ": "ibadat ki", "يَدْعُو": "duaa karta hai",
  "دَعَا": "duaa ki/pukara", "يَذْكُرُ": "yaad karta hai",
  "ذَكَرَ": "yaad kiya", "يَشْكُرُ": "shukar ada karta hai",
  "صَبَرَ": "sabr kiya", "يَصْبِرُ": "sabr karta hai",
  "تَوَكَّلَ": "bharosa kiya", "يَتَوَكَّلُ": "bharosa karta hai",
  "رَجَعَ": "laut aaya", "يَرْجِعُ": "laut aata hai",
  "دَخَلَ": "daakhil hua", "يَدْخُلُ": "daakhil hota hai",
  "خَرَجَ": "nikla", "يَخْرُجُ": "nikalta hai",
  "قَاتَلَ": "laṛa", "يُقَاتِلُ": "laṛta hai",
  "أَسْلَمَ": "Islam laya", "أُرْسِلَ": "bheja gaya",
  "أُنزِلَ": "naazil kiya gaya", "نَزَّلَ": "naazil kiya",
  "بَعَثَ": "uthaya/bheja", "تُوُفِّيَ": "wafaat paaya",
  "مَاتَ": "mara", "يَمُوتُ": "marta hai",
  "حَيِيَ": "zinda hua", "يَحْيَىٰ": "zinda hoga",

  // Adjectives & States
  "كَبِيرٌ": "bada", "صَغِيرٌ": "chhota", "عَظِيمٌ": "azeem",
  "كَثِيرٌ": "bahut", "قَلِيلٌ": "thoda", "جَدِيدٌ": "naya",
  "خَيْرٌ": "behtar/bhalai", "شَرٌّ": "buri", "شَرِّ": "burai ka",
  "حَسَنٌ": "achha", "سَيِّئٌ": "bura", "صَالِحٌ": "nek",
  "فَاسِقٌ": "faasiq", "ظَالِمٌ": "zaalim", "كَاذِبٌ": "jhoota",
  "صَادِقٌ": "sach wala", "عَادِلٌ": "insaaf wala",
  "قَرِيبٌ": "qareeb", "بَعِيدٌ": "door", "أَوَّلُ": "pehla",
  "آخِرُ": "aakhri", "أَكْبَرُ": "bara (comparative)",
  "أَصْغَرُ": "chhota (comparative)", "أَفْضَلُ": "behtar (comparative)",

  // Time Words
  "الْيَوْمَ": "aaj", "أَمْسِ": "kal (guzra)", "غَدًا": "kal (aane wala)",
  "اللَّيْلَ": "raat ko", "النَّهَارَ": "din ko",
  "الْآنَ": "abhi", "قَبْلَ": "pehle", "بَعْدَ": "baad mein",
  "حِينَ": "jab", "وَقْتٌ": "waqt", "سَنَةٌ": "saal",
  "شَهْرٌ": "maheena", "يَوْمٌ": "din", "سَاعَةٌ": "ghanta/pal",

  // Numbers
  "وَاحِدٌ": "ek", "اثْنَانِ": "do", "ثَلَاثَةٌ": "teen",
  "أَرْبَعَةٌ": "chaar", "خَمْسَةٌ": "paanch", "سَبْعَةٌ": "saat",
  "عَشَرَةٌ": "das", "مِئَةٌ": "sau", "أَلْفٌ": "hazaar",

  // Al-Ikhlas
  "قُلْ": "kaho", "هُوَ": "woh", "أَحَدٌ": "ek",
  "لَمْ": "nahi", "يَلِدْ": "kisi ko jaaya", "وَلَمْ": "aur nahi",
  "يُولَدْ": "paida hua", "يَكُن": "tha/hai", "لَّهُ": "uska",
  "كُفُوًا": "barabar wala",

  // Al-Falaq & An-Nas
  "أَعُوذُ": "panah maanta hoon", "بِرَبِّ": "Rabb ki",
  "الْفَلَقِ": "subah ka", "غَاسِقٍ": "andheri raat ki",
  "وَقَبَ": "chhaa jaye", "النَّفَّاثَاتِ": "phoonkne waliyon",
  "الْعُقَدِ": "gaanthon mein", "حَاسِدٍ": "hasad karne wale",
  "حَسَدَ": "hasad kare", "الْوَسْوَاسِ": "waswasa dene wale",
  "الْخَنَّاسِ": "peeche hat jaane wale", "يُوَسْوِسُ": "waswasa dalta hai",
  "صُدُورِ": "sinon mein", "الْجِنَّةِ": "jinnat mein se",

  // Ya-Sin key words
  "يٰسٓ": "Ya-Seen", "وَالْقُرْآنِ": "aur Quran ki",
  "الْحَكِيمِ": "hikmat wale ka", "لَمِنَ": "zaroor ho",
  "الْمُرْسَلِينَ": "rasoolon mein se", "تَنزِيلَ": "naazil kiya hua",
  "الْعَزِيزِ": "ghaalib ka", "لِتُنذِرَ": "taake tu daraye",
  "آبَاؤُهُمْ": "unke baap daada", "غَافِلُونَ": "ghaafil hain",
  "أَغْلَالًا": "ghale daale gaye", "فَهُمْ": "toh woh",
  "مُقْمَحُونَ": "gardan upar uthaye huay", "سَدًّا": "deewar",
  "فَأَغْشَيْنَاهُمْ": "hum ne andhera kar diya", "يُبْصِرُونَ": "dekhte hain",
  "أَنذَرْتَهُمْ": "tune inhein daraya", "يَنفَعُ": "faida deta hai",
  "مَنِ": "jo", "اتَّبَعَ": "peeche chala", "الذِّكْرَ": "nasihat ko",
  "خَشِيَ": "dara", "الرَّحْمَٰنَ": "Rehman se", "بِالْغَيْبِ": "bina dekhe",
  "بِمَغْفِرَةٍ": "mafi ki khushkhabri", "وَأَجْرٍ": "aur sawaab",
  "كَرِيمٍ": "bade ka",

  // Ar-Rahman key words
  "الرَّحْمَٰنُ": "Rehman ne", "عَلَّمَ": "sikhaya",
  "الْإِنسَانَ": "insaan ko", "الْبَيَانَ": "bolna",
  "الشَّمْسُ": "sooraj", "الْقَمَرُ": "chaand",
  "بِحُسْبَانٍ": "hisaab se", "النَّجْمُ": "sitaara/ghaas",
  "الشَّجَرُ": "darakht", "يَسْجُدَانِ": "sajda karte hain",
  "وَالسَّمَاءَ": "aasmaan ko", "رَفَعَهَا": "usne uthaya",
  "الْمِيزَانَ": "tarazu", "أَلَّا": "taake na",
  "تَطْغَوْا": "zyaadati na karo", "بِالْقِسْطِ": "insaaf ke saath",
  "تُخْسِرُوا": "ghaata mat karo", "وَالْأَرْضَ": "aur zameen ko",
  "لِلْأَنَامِ": "makhlooq ke liye", "فَاكِهَةٌ": "phal",
  "النَّخْلُ": "khajoor ka darakht", "الرَّيْحَانُ": "khushboo dar boota",
  "فَبِأَيِّ": "toh kaunsi", "آلَاءِ": "naimaton ko",
  "رَبِّكُمَا": "tumhare Rabb ki", "تُكَذِّبَانِ": "jhutlaate ho",
  "الثَّقَلَانِ": "insaan aur jinn", "سَنَفْرُغُ": "hum fursat nikaalenge",
  "الْمَارِجِ": "aag ki lahab se", "نُحَاسٌ": "aag ka dhuan",
  "فَلَا تَنتَصِرَانِ": "tum baacha na kar sakoge",

  // Al-Mulk key words
  "تَبَارَكَ": "barkat wala hai", "بِيَدِهِ": "jiske haath mein",
  "الْمُلْكُ": "baadshahat", "قَدِيرٌ": "qadir hai",
  "الْحَيَاةَ": "zindagi", "الْمَوْتَ": "maut",
  "لِيَبْلُوَكُمْ": "taake tumhara imtihaan kare",
  "أَيُّكُمْ": "tum mein se kaun", "أَحْسَنُ": "achhe",
  "عَمَلًا": "kaam", "طِبَاقًا": "tabaq dar tabaq",
  "تَفَاوُتٍ": "farq", "الْبَصَرَ": "aankhon ko",
  "هَلْ تَرَىٰ": "kya tum dekhte ho", "فُطُورٍ": "daraaren",
  "كَرَّتَيْنِ": "do baar", "خَاسِئًا": "naakaam",
  "حَسِيرٌ": "thaki hui", "زَيَّنَّا": "humne sajaya",
  "بِمَصَابِيحَ": "charaagon se", "الدُّنْيَا": "duniya ki",
  "رُجُومًا": "Shaitaan ko marne ka zariya",
  "سَعِيرَ": "bhadakti aag", "كَفَرُوا": "jinon ne kufar kiya",
  "أَلَمْ يَأْتِكُمْ": "kya nahi aaya tumhare paas", "نَذِيرٌ": "darane wala",
  "زَفِيرٌ": "aanein/aawaz", "شَهِيقٌ": "haank maarein",
  "تَفُورُ": "joshti hogi", "تَكَادُ": "qareeb tha",
  "مَيِّزًا": "todte huay", "الْمُتَكَبِّرِينَ": "takabbur karne wale",
  "خَشِيَ": "darta tha", "بِالْغَيْبِ": "bina dekhe",

  // Common Prepositions & Connectives
  "مَعَ": "ke saath", "بَيْنَ": "darmiyaan", "تَحْتَ": "neeche",
  "فَوْقَ": "upar", "أَمَامَ": "aage", "خَلْفَ": "peeche",
  "حَوْلَ": "aas paas", "عِنْدَ": "paas/nazdeek",
  "إِلَّا": "sirf/magar", "حَتَّىٰ": "yahan tak ke",
  "كَيْ": "taake", "لَعَلَّ": "shayad", "أَمَّا": "raha",
  "أَمْ": "ya", "أَيْنَ": "kahan", "مَتَىٰ": "kab",
  "كَيْفَ": "kaise", "لِمَاذَا": "kyun", "كَمْ": "kitna",

  // Body Parts
  "الْقَلْبِ": "dil ka", "قَلْبٌ": "dil", "الْعَيْنِ": "aankhon ka",
  "أَعْيُنٌ": "aankhen", "الْأُذُنِ": "kaan ka", "آذَانٌ": "kaan",
  "الْيَدِ": "haath ka", "أَيْدٍ": "haath", "الْوَجْهِ": "chehra ka",
  "وُجُوهٌ": "chehre", "الرَّأْسِ": "sar ka", "اللِّسَانِ": "zubaan ka",

  // Surah Al-Baqarah common words
  "الم": "Alif-Lam-Meem", "ذَٰلِكَ": "yeh", "الْكِتَابُ": "kitaab",
  "لَا رَيْبَ": "koi shak nahi", "فِيهِ": "is mein", "هُدًى": "hidaayat",
  "لِّلْمُتَّقِينَ": "parheezgaroon ke liye", "يُؤْمِنُونَ": "imaan laate hain",
  "بِالْغَيْبِ": "ghayb par", "يُقِيمُونَ": "qaim karte hain",
  "الصَّلَاةَ": "namaz ko", "وَمِمَّا": "aur jo kuch",
  "رَزَقْنَاهُمْ": "hum ne inhe diya", "يُنفِقُونَ": "kharch karte hain",
  "وَبِالْآخِرَةِ": "aur aakhirat par", "هُمْ يُوقِنُونَ": "yaqeen rakhte hain",
  "أُولَٰئِكَ": "yeh log", "عَلَىٰ هُدًى": "hidaayat par",
  "مِّن رَّبِّهِمْ": "apne Rabb ki taraf se", "وَأُولَٰئِكَ": "aur yeh log",
  "هُمُ الْمُفْلِحُونَ": "kamyab hain",
};

// Smart word lookup with diacritics handling
const getWordMeaning = (arabicWord) => {
  if (!arabicWord?.trim()) return null;
  const word = arabicWord.trim();

  // Direct match
  if (QURAN_DICTIONARY[word]) return QURAN_DICTIONARY[word];

  // Try removing some diacritics for broader match
  const stripped = word.replace(/[\u064B-\u065F\u0610-\u061A]/g, "");
  for (const [key, val] of Object.entries(QURAN_DICTIONARY)) {
    const keyStripped = key.replace(/[\u064B-\u065F\u0610-\u061A]/g, "");
    if (stripped === keyStripped) return val;
    if (stripped.length > 2 && keyStripped === stripped) return val;
  }

  // Partial match for longer words
  for (const [key, val] of Object.entries(QURAN_DICTIONARY)) {
    if (word.includes(key) && key.length > 3) return val + " (approx)";
  }

  return null;
};

export default function WordByWord() {
  const [selectedSurah, setSelectedSurah] = useState(SAMPLE_SURAHS[0]);
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [savedWords, setSavedWords] = useState(() => {
    try { return JSON.parse(localStorage.getItem("quran_saved_words") || "[]"); }
    catch { return []; }
  });
  const [view, setView] = useState("reader");
  const [quizMode, setQuizMode] = useState(false);
  const [quizWord, setQuizWord] = useState(null);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    localStorage.setItem("quran_saved_words", JSON.stringify(savedWords));
  }, [savedWords]);

  useEffect(() => { loadSurah(selectedSurah); }, [selectedSurah]);

  const loadSurah = async (surah) => {
    setLoading(true);
    setAyahs([]);
    setSelectedWord(null);
    try {
      const res = await fetch(
        `https://api.alquran.cloud/v1/surah/${surah.number}/editions/quran-uthmani,ur.jalandhry`
      );
      const data = await res.json();
      if (data.code === 200) {
        const arabicAyahs = data.data[0].ayahs;
        const urduAyahs = data.data[1].ayahs;
        setAyahs(arabicAyahs.map((a, i) => ({
          number: a.numberInSurah,
          urdu: urduAyahs[i]?.text || "",
          words: a.text.split(" ").filter(w => w.trim()).map((word, wi) => ({
            text: word,
            meaning: getWordMeaning(word),
            index: wi,
          })),
        })));
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const saveWord = (word) => {
    if (!word) return;
    if (!savedWords.find(w => w.text === word.text)) {
      setSavedWords(prev => [...prev, word]);
    }
  };

  const removeWord = (word) => {
    setSavedWords(prev => prev.filter(w => w.text !== word.text));
  };

  const startQuiz = () => {
    const quizzable = savedWords.filter(w => w.meaning);
    if (quizzable.length === 0) return;
    const random = quizzable[Math.floor(Math.random() * quizzable.length)];
    setQuizWord(random);
    setQuizAnswer("");
    setQuizResult(null);
    setQuizMode(true);
  };

  const checkAnswer = () => {
    if (!quizAnswer.trim()) return;
    const correct = (quizWord.meaning || "").toLowerCase().replace(" (approx)", "");
    const ans = quizAnswer.toLowerCase().trim();
    setQuizResult(correct.includes(ans) || ans.includes(correct.split(" ")[0]) ? "correct" : "wrong");
  };

  const nextQuiz = () => {
    const quizzable = savedWords.filter(w => w.meaning && w.text !== quizWord.text);
    if (quizzable.length === 0) { setQuizMode(false); return; }
    const random = quizzable[Math.floor(Math.random() * quizzable.length)];
    setQuizWord(random);
    setQuizAnswer("");
    setQuizResult(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080d12", color: "#e2d9c8", fontFamily: "'Georgia', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:ital@0;1&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080d12; }
        ::-webkit-scrollbar-thumb { background: #1e2830; border-radius: 4px; }
        .word-chip { transition: all 0.15s ease; cursor: pointer; }
        .word-chip:hover { transform: translateY(-2px); }
        .word-chip:hover .arabic-w { color: #C9A84C !important; }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        @keyframes pop { 0%{transform:scale(1)} 50%{transform:scale(1.08)} 100%{transform:scale(1)} }
        .slide-up { animation: slideUp 0.3s ease forwards; }
        .shake { animation: shake 0.3s ease; }
        .pop { animation: pop 0.3s ease; }
      `}</style>

      {/* Quiz Overlay */}
      {quizMode && quizWord && (
        <div style={{ position:"fixed", inset:0, zIndex:50, background:"rgba(0,0,0,0.92)", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
          <div style={{ background:"#0f1820", border:"1px solid rgba(201,168,76,0.3)", borderRadius:"24px", padding:"40px 32px", maxWidth:"400px", width:"100%", textAlign:"center" }}>
            <div style={{ fontSize:"12px", color:"#5a5040", letterSpacing:"2px", marginBottom:"24px" }}>
              VOCABULARY QUIZ • {savedWords.filter(w=>w.meaning).length} words
            </div>
            <div style={{ fontFamily:"'Amiri', serif", fontSize:"52px", color:"#C9A84C", marginBottom:"16px", lineHeight:1.4 }}>
              {quizWord.text}
            </div>
            {quizResult === null ? (
              <>
                <input value={quizAnswer} onChange={e => setQuizAnswer(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && checkAnswer()}
                  placeholder="Urdu meaning likhein..." autoFocus
                  style={{ width:"100%", boxSizing:"border-box", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(201,168,76,0.2)", borderRadius:"12px", padding:"14px 16px", color:"#e2d9c8", fontSize:"16px", outline:"none", textAlign:"center", marginBottom:"16px" }}
                />
                <button onClick={checkAnswer} style={{ background:"#C9A84C", color:"#080d12", border:"none", borderRadius:"12px", padding:"12px 32px", fontSize:"15px", cursor:"pointer", fontWeight:"bold", width:"100%" }}>
                  Check ✓
                </button>
              </>
            ) : (
              <div className={quizResult === "correct" ? "pop" : "shake"}>
                <div style={{ fontSize:"40px", marginBottom:"12px" }}>{quizResult === "correct" ? "✅" : "❌"}</div>
                <div style={{ fontSize:"15px", color:quizResult === "correct" ? "#27AE60" : "#C0392B", marginBottom:"8px" }}>
                  {quizResult === "correct" ? "Shabash! Sahi!" : "Sahi jawab:"}
                </div>
                <div style={{ fontSize:"22px", color:"#C9A84C", marginBottom:"24px" }}>{quizWord.meaning}</div>
                <div style={{ display:"flex", gap:"10px" }}>
                  <button onClick={nextQuiz} style={{ flex:1, background:"#C9A84C", color:"#080d12", border:"none", borderRadius:"12px", padding:"12px", fontSize:"14px", cursor:"pointer", fontWeight:"bold" }}>Agla →</button>
                  <button onClick={() => setQuizMode(false)} style={{ background:"transparent", border:"1px solid rgba(255,255,255,0.1)", color:"#5a5040", borderRadius:"12px", padding:"12px 16px", cursor:"pointer", fontSize:"14px" }}>Chodein</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background:"rgba(8,13,18,0.97)", borderBottom:"1px solid rgba(201,168,76,0.12)", padding:"16px 20px", position:"sticky", top:0, zIndex:10, backdropFilter:"blur(20px)" }}>
        <div style={{ maxWidth:"800px", margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"14px" }}>
            <div>
              <h1 style={{ margin:0, fontSize:"18px", fontWeight:"400" }}>Word-by-Word</h1>
              <p style={{ margin:0, fontSize:"11px", color:"#5a5040", letterSpacing:"1px" }}>کلمہ بہ کلمہ • Tap karo — Urdu meaning dekho</p>
            </div>
            <div style={{ display:"flex", gap:"8px" }}>
              <button onClick={() => setView(view === "reader" ? "vocab" : "reader")} style={{ background:view==="vocab"?"rgba(201,168,76,0.2)":"rgba(255,255,255,0.04)", border:"1px solid rgba(201,168,76,0.2)", color:"#C9A84C", borderRadius:"10px", padding:"8px 14px", cursor:"pointer", fontSize:"12px" }}>
                🔖 {savedWords.length}
              </button>
              {savedWords.filter(w => w.meaning).length > 0 && (
                <button onClick={startQuiz} style={{ background:"rgba(39,174,96,0.15)", border:"1px solid rgba(39,174,96,0.3)", color:"#27AE60", borderRadius:"10px", padding:"8px 14px", cursor:"pointer", fontSize:"12px" }}>📝 Quiz</button>
              )}
            </div>
          </div>
          <div style={{ display:"flex", gap:"8px", overflowX:"auto", paddingBottom:"4px" }}>
            {SAMPLE_SURAHS.map(s => (
              <button key={s.number} onClick={() => setSelectedSurah(s)} style={{ background:selectedSurah.number===s.number?"rgba(201,168,76,0.2)":"rgba(255,255,255,0.03)", border:`1px solid ${selectedSurah.number===s.number?"#C9A84C":"rgba(255,255,255,0.06)"}`, color:selectedSurah.number===s.number?"#C9A84C":"#6a5f52", borderRadius:"20px", padding:"6px 14px", cursor:"pointer", fontSize:"12px", whiteSpace:"nowrap", flexShrink:0 }}>
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:"800px", margin:"0 auto", padding:"0 16px 120px" }}>

        {/* Vocab View */}
        {view === "vocab" && (
          <div style={{ paddingTop:"24px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
              <h2 style={{ margin:0, fontSize:"16px", fontWeight:"400" }}>Saved Words ({savedWords.length})</h2>
              {savedWords.filter(w => w.meaning).length > 0 && (
                <button onClick={startQuiz} style={{ background:"rgba(39,174,96,0.15)", border:"1px solid rgba(39,174,96,0.3)", color:"#27AE60", borderRadius:"10px", padding:"8px 16px", cursor:"pointer", fontSize:"13px" }}>📝 Quiz</button>
              )}
            </div>
            {savedWords.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 20px", color:"#3a3028" }}>
                <div style={{ fontSize:"40px", marginBottom:"16px" }}>📚</div>
                <p>Koi word save nahi kiya</p>
                <button onClick={() => setView("reader")} style={{ marginTop:"16px", background:"transparent", border:"1px solid rgba(201,168,76,0.3)", color:"#C9A84C", padding:"10px 24px", borderRadius:"20px", cursor:"pointer" }}>Reader Kholein →</button>
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(150px, 1fr))", gap:"12px" }}>
                {savedWords.map((w, i) => (
                  <div key={i} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(201,168,76,0.15)", borderRadius:"16px", padding:"16px", position:"relative" }}>
                    <button onClick={() => removeWord(w)} style={{ position:"absolute", top:"8px", right:"8px", background:"none", border:"none", color:"#3a3028", cursor:"pointer", fontSize:"14px" }}>✕</button>
                    <div style={{ fontFamily:"'Amiri', serif", fontSize:"28px", color:"#C9A84C", textAlign:"right", marginBottom:"8px", direction:"rtl" }}>{w.text}</div>
                    <div style={{ fontSize:"13px", color: w.meaning ? "#e2d9c8" : "#4a4030" }}>{w.meaning || "—"}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reader View */}
        {view === "reader" && (
          <>
            {loading ? (
              <div style={{ textAlign:"center", padding:"80px 20px" }}>
                <div style={{ width:"36px", height:"36px", margin:"0 auto 16px", border:"2px solid rgba(201,168,76,0.2)", borderTopColor:"#C9A84C", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
                <p style={{ color:"#5a5040", fontSize:"13px" }}>Loading {selectedSurah.name}...</p>
              </div>
            ) : (
              <>
                <div style={{ textAlign:"center", padding:"16px 0 8px", fontSize:"12px", color:"#3a3028", letterSpacing:"1px" }}>
                  Kisi bhi word pe tap karein → Urdu meaning dikhegi
                </div>
                {selectedSurah.number !== 9 && (
                  <div style={{ textAlign:"center", fontFamily:"'Amiri', serif", fontSize:"26px", color:"#C9A84C", opacity:0.6, padding:"8px 0 20px" }}>
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </div>
                )}
                {ayahs.map((ayah) => (
                  <div key={ayah.number} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)", padding:"20px 4px" }}>
                    <div style={{ textAlign:"left", marginBottom:"14px" }}>
                      <span style={{ background:"rgba(201,168,76,0.08)", border:"1px solid rgba(201,168,76,0.15)", borderRadius:"20px", padding:"3px 12px", fontSize:"11px", color:"#C9A84C" }}>
                        Ayah {ayah.number}
                      </span>
                    </div>

                    {/* Word cards — RTL */}
                    <div style={{ display:"flex", flexWrap:"wrap", flexDirection:"row-reverse", gap:"8px", marginBottom:"14px", padding:"4px 0" }}>
                      {ayah.words.map((word, wi) => {
                        const isSelected = selectedWord?.text === word.text && selectedWord?.index === word.index && selectedWord?.ayahNum === ayah.number;
                        const hasMeaning = !!word.meaning;
                        return (
                          <div key={wi} className="word-chip"
                            onClick={() => setSelectedWord({ ...word, ayahNum: ayah.number })}
                            style={{
                              background: isSelected ? "rgba(201,168,76,0.15)" : hasMeaning ? "rgba(201,168,76,0.04)" : "rgba(255,255,255,0.02)",
                              border: `1px solid ${isSelected ? "rgba(201,168,76,0.5)" : hasMeaning ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.04)"}`,
                              borderRadius:"10px", padding:"8px 10px",
                              textAlign:"center", minWidth:"52px", maxWidth:"100px",
                            }}>
                            {/* Arabic */}
                            <div className="arabic-w" style={{ fontFamily:"'Amiri', serif", fontSize:"22px", color: isSelected ? "#C9A84C" : "#f0e8d5", lineHeight:1.5, transition:"color 0.15s", direction:"rtl" }}>
                              {word.text}
                            </div>
                            {/* Urdu meaning — shown below each word */}
                            <div style={{ fontSize:"9px", color: isSelected ? "#C9A84C" : hasMeaning ? "#8a7a52" : "#3a3028", marginTop:"4px", direction:"ltr", lineHeight:1.3, minHeight:"12px" }}>
                              {word.meaning || "·"}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Full Urdu */}
                    <div style={{ fontSize:"13px", color:"#5a5040", direction:"rtl", textAlign:"right", borderRight:"2px solid rgba(201,168,76,0.1)", paddingRight:"10px", lineHeight:"1.9" }}>
                      {ayah.urdu}
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>

      {/* Word Detail Bottom Sheet */}
      {selectedWord && (
        <div className="slide-up" style={{ position:"fixed", bottom:"72px", left:0, right:0, zIndex:30, background:"linear-gradient(180deg, #0f1820, #0a1016)", border:"1px solid rgba(201,168,76,0.2)", borderRadius:"24px 24px 0 0", padding:"20px 20px 28px", boxShadow:"0 -20px 60px rgba(0,0,0,0.6)" }}>
          <div style={{ maxWidth:"600px", margin:"0 auto" }}>
            <div style={{ width:"40px", height:"3px", background:"rgba(255,255,255,0.1)", borderRadius:"2px", margin:"0 auto 16px" }} />
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Amiri', serif", fontSize:"44px", color:"#C9A84C", lineHeight:1.3, marginBottom:"8px", direction:"rtl" }}>
                  {selectedWord.text}
                </div>
                {selectedWord.meaning ? (
                  <div style={{ fontSize:"22px", color:"#e2d9c8" }}>{selectedWord.meaning.replace(" (approx)", "")}</div>
                ) : (
                  <div style={{ fontSize:"14px", color:"#4a4030", fontStyle:"italic" }}>
                    Is word ki meaning abhi dictionary mein nahi hai
                  </div>
                )}
              </div>
              <button onClick={() => saveWord(selectedWord)} style={{
                background: savedWords.find(w => w.text === selectedWord.text) ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.05)",
                border:"1px solid rgba(201,168,76,0.3)", color:"#C9A84C",
                borderRadius:"10px", padding:"8px 16px", cursor:"pointer", fontSize:"13px",
                flexShrink:0, marginLeft:"12px", marginTop:"8px",
              }}>
                {savedWords.find(w => w.text === selectedWord.text) ? "✓ Saved" : "🔖 Save"}
              </button>
            </div>
            <button onClick={() => setSelectedWord(null)} style={{ marginTop:"14px", width:"100%", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", color:"#5a5040", borderRadius:"12px", padding:"10px", cursor:"pointer", fontSize:"13px" }}>
              Band Karein ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}