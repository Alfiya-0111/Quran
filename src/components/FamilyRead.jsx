// pages/FamilyRead.jsx
import { useState, useEffect, useCallback, useMemo, Suspense, lazy } from "react";
import { Helmet } from "react-helmet-async";
import {
  BsCheckCircleFill, BsCircle, BsPlus, BsTrash, BsShare,
  BsChevronDown, BsChevronUp, BsPeople, BsBook,
  BsArrowRight, BsStarFill, BsClock, BsCalendar3
} from "react-icons/bs";
import { FaPrayingHands } from "react-icons/fa";

// ─── SURAH DATA ───
const SURAHS = [
  { number: 1, name: "Al-Fatihah", verses: 7, arabic: "الفاتحة", category: "short" },
  { number: 2, name: "Al-Baqarah", verses: 286, arabic: "البقرة", category: "long" },
  { number: 3, name: "Aal-E-Imran", verses: 200, arabic: "آل عمران", category: "long" },
  { number: 36, name: "Ya-Sin", verses: 83, arabic: "يس", category: "medium" },
  { number: 55, name: "Ar-Rahman", verses: 78, arabic: "الرحمن", category: "medium" },
  { number: 67, name: "Al-Mulk", verses: 30, arabic: "الملك", category: "short" },
  { number: 112, name: "Al-Ikhlas", verses: 4, arabic: "الإخلاص", category: "short" },
  { number: 113, name: "Al-Falaq", verses: 5, arabic: "الفلق", category: "short" },
  { number: 114, name: "An-Nas", verses: 6, arabic: "الناس", category: "short" },
  { number: 18, name: "Al-Kahf", verses: 110, arabic: "الكهف", category: "medium" },
  { number: 32, name: "As-Sajdah", verses: 30, arabic: "السجدة", category: "short" },
  { number: 76, name: "Al-Insan", verses: 31, arabic: "الإنسان", category: "short" },
];

const TOTAL_QURAN_VERSES = 6236;

// ─── FAMILY MEMBERS ───
const DEFAULT_MEMBERS = [
  { id: 1, name: "Abbu", color: "#2C7873", avatar: "👨" },
  { id: 2, name: "Ammi", color: "#C9A84C", avatar: "👩" },
  { id: 3, name: "Bhai", color: "#7B6FD4", avatar: "👦" },
  { id: 4, name: "Behen", color: "#E8A838", avatar: "👧" },
];

const AVATARS = ["👨", "👩", "👦", "👧", "👴", "👵", "🧒", "👶", "🧕", "🧔"];
const COLORS = ["#2C7873", "#C9A84C", "#7B6FD4", "#E8A838", "#C0392B", "#8E44AD", "#27AE60", "#3498DB", "#E67E22", "#1ABC9C"];

// ─── SEO COMPONENT ───
function SEOHead({ activeTab }) {
  const seoData = useMemo(() => {
    const titles = {
      reading: "Family Quran Reading Tracker | Track Surah Progress Together",
      stats: "Family Quran Statistics | Leaderboard & Progress Dashboard",
      khatm: "Family Khatm Tracker | Complete Quran Reading Together",
    };
    const descriptions = {
      reading: "Track your family's Quran reading progress together. Read Surahs, mark verses, and complete Khatm-e-Quran as a family. Supports multiple family members with individual progress tracking.",
      stats: "View family Quran reading statistics, leaderboards, and completion rates. See who has read the most verses and which Surahs are completed.",
      khatm: "Track family Khatm-e-Quran progress. Monitor how many times your family has completed the full Quran together with detailed per-member statistics.",
    };

    const title = titles[activeTab] || titles.reading;
    const desc = descriptions[activeTab] || descriptions.reading;
    const url = `https://soulayah.com/family-read/${activeTab}`;
    const image = "https://soulayah.com/family-read-og.jpg";

    return { title, desc, url, image };
  }, [activeTab]);

  const schemaData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Family Quran Reading Tracker",
    "description": seoData.desc,
    "url": seoData.url,
    "applicationCategory": "ReligiousApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "inLanguage": ["ur", "en"],
    "about": {
      "@type": "Thing",
      "name": "Quran Reading",
      "description": "Family Quran reading and Khatm tracking application"
    }
  }), [seoData]);

  return (
    <Helmet prioritizeSeoTags>
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.desc} />
      <meta name="keywords" content="family quran reading, quran tracker, khatm tracker, surah progress, family islamic app, quran reading tracker, islamic family app, daily quran reading" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="ur, en" />
      <link rel="canonical" href={seoData.url} />

      {/* Open Graph */}
      <meta property="og:title" content={seoData.title} />
      <meta property="og:description" content={seoData.desc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={seoData.url} />
      <meta property="og:image" content={seoData.image} />
      <meta property="og:locale" content="ur_PK" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoData.title} />
      <meta name="twitter:description" content={seoData.desc} />
      <meta name="twitter:image" content={seoData.image} />

      {/* Preconnect */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* Structured Data */}
      <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
    </Helmet>
  );
}

// ─── LAZY LOADED TAB COMPONENTS ───
const ReadingTab = lazy(() => Promise.resolve({
  default: function ReadingTab({
    members, setMembers, progress, setProgress,
    selectedSurah, setSelectedSurah,
    newMemberName, setNewMemberName,
    showAddMember, setShowAddMember,
    getMemberProgress, updateProgress, getTotalRead, getSurahProgress,
    addMember, removeMember
  }) {
    return (
      <div className="fade-up">
        {/* Family Members */}
        <section aria-label="Family members" style={{ marginBottom: "20px" }}>
          <div style={{
            fontSize: "11px", color: "#3a3028", letterSpacing: "2px",
            marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px",
          }}>
            <BsPeople size={12} aria-hidden="true" /> GHAR KE LOG — {members.length}
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {members.map((member, i) => (
              <div
                key={member.id}
                className="member-card fade-up"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid rgba(255,255,255,0.07)`,
                  borderRadius: "16px", padding: "12px 16px",
                  display: "flex", alignItems: "center", gap: "10px",
                  cursor: "pointer",
                  animationDelay: `${i * 0.05}s`, opacity: 0,
                  position: "relative",
                  contain: "layout style paint",
                }}
                role="button"
                tabIndex={0}
                aria-label={`${member.name}, ${getTotalRead(member.id)} ayat read`}
                onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') setSelectedSurah(selectedSurah ? null : selectedSurah); }}
              >
                <div style={{
                  width: "36px", height: "36px",
                  borderRadius: "50%",
                  background: `${member.color}20`,
                  border: `2px solid ${member.color}50`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "18px",
                }} aria-hidden="true">
                  {member.avatar}
                </div>
                <div>
                  <div style={{ fontSize: "13px", color: "#e2d9c8", fontWeight: "500" }}>
                    {member.name}
                  </div>
                  <div style={{ fontSize: "11px", color: member.color }}>
                    {getTotalRead(member.id)} ayat
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeMember(member.id); }}
                  aria-label={`Remove ${member.name}`}
                  style={{
                    position: "absolute", top: "-6px", right: "-6px",
                    background: "#C0392B", border: "none",
                    color: "white", borderRadius: "50%",
                    width: "20px", height: "20px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", fontSize: "10px", padding: 0,
                  }}
                >
                  <BsTrash size={10} aria-hidden="true" />
                </button>
              </div>
            ))}

            {/* Add Member */}
            {showAddMember ? (
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px dashed rgba(201,168,76,0.4)",
                borderRadius: "16px", padding: "12px",
                display: "flex", alignItems: "center", gap: "8px",
              }}>
                <input
                  type="text"
                  value={newMemberName}
                  onChange={e => setNewMemberName(e.target.value)}
                  placeholder="Naam likhein..."
                  autoFocus
                  aria-label="New member name"
                  style={{
                    background: "transparent", border: "none",
                    color: "#e2d9c8", fontSize: "13px",
                    outline: "none", width: "100px",
                  }}
                  onKeyDown={e => e.key === "Enter" && addMember()}
                />
                <button
                  onClick={addMember}
                  aria-label="Add member"
                  style={{
                    background: "#C9A84C", border: "none",
                    color: "#07090d", borderRadius: "8px",
                    padding: "4px 10px", cursor: "pointer",
                    fontSize: "11px", fontWeight: "600",
                  }}
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAddMember(true)}
                aria-label="Add new family member"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px dashed rgba(255,255,255,0.15)",
                  borderRadius: "16px", padding: "12px 20px",
                  color: "#5a5040", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "6px",
                  fontSize: "13px",
                }}
              >
                <BsPlus size={18} aria-hidden="true" /> Add
              </button>
            )}
          </div>
        </section>

        {/* Surah List */}
        <section aria-label="Surah list" style={{ marginBottom: "20px" }}>
          <div style={{
            fontSize: "11px", color: "#3a3028", letterSpacing: "2px",
            marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px",
          }}>
            <BsBook size={12} aria-hidden="true" /> SURAHS
          </div>

          {SURAHS.map((surah, i) => {
            const progressPct = getSurahProgress(surah.number);
            const isSelected = selectedSurah === surah.number;

            return (
              <article
                key={surah.number}
                className="fade-up"
                style={{
                  background: isSelected ? "rgba(201,168,76,0.06)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${isSelected ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: "16px", padding: "16px",
                  marginBottom: "10px", cursor: "pointer",
                  animationDelay: `${i * 0.03}s`, opacity: 0,
                  transition: "all 0.2s",
                  contain: "layout style paint",
                }}
                onClick={() => setSelectedSurah(isSelected ? null : surah.number)}
                role="button"
                tabIndex={0}
                aria-expanded={isSelected}
                aria-label={`${surah.name}, ${surah.verses} verses, ${Math.round(progressPct)}% complete`}
                onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') setSelectedSurah(isSelected ? null : surah.number); }}
              >
                {/* Surah Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "40px", height: "40px",
                      background: "rgba(201,168,76,0.1)",
                      border: "1px solid rgba(201,168,76,0.2)",
                      borderRadius: "12px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'Amiri', serif",
                      fontSize: "16px", color: "#C9A84C",
                    }} aria-hidden="true">
                      {surah.number}
                    </div>
                    <div>
                      <h3 style={{ fontSize: "14px", color: "#e2d9c8", fontWeight: "500", margin: 0 }}>
                        {surah.name}
                      </h3>
                      <div style={{ fontSize: "11px", color: "#5a5040" }}>
                        {surah.verses} verses • {surah.arabic}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{
                      fontSize: "11px", color: progressPct >= 100 ? "#27AE60" : "#C9A84C",
                    }} aria-live="polite">
                      {Math.round(progressPct)}%
                    </div>
                    {isSelected ? <BsChevronUp size={14} color="#C9A84C" aria-hidden="true" /> : <BsChevronDown size={14} color="#5a5040" aria-hidden="true" />}
                  </div>
                </div>

                {/* Progress Bar */}
                <div
                  role="progressbar"
                  aria-valuenow={Math.round(progressPct)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${surah.name} progress`}
                  style={{
                    height: "3px", background: "rgba(255,255,255,0.04)",
                    borderRadius: "2px", marginTop: "12px", overflow: "hidden",
                  }}
                >
                  <div style={{
                    height: "100%", width: `${progressPct}%`,
                    background: progressPct >= 100 ? "#27AE60" : "#C9A84C",
                    borderRadius: "2px", transition: "width 0.5s ease",
                    willChange: "width",
                  }} />
                </div>

                {/* Expanded: Member Progress */}
                {isSelected && (
                  <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    {members.map(member => {
                      const memberProg = getMemberProgress(member.id, surah.number);
                      const memberPct = Math.min((memberProg / surah.verses) * 100, 100);

                      return (
                        <div key={member.id} style={{ marginBottom: "14px" }}>
                          <div style={{
                            display: "flex", justifyContent: "space-between",
                            alignItems: "center", marginBottom: "8px",
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span style={{ fontSize: "16px" }} aria-hidden="true">{member.avatar}</span>
                              <span style={{ fontSize: "13px", color: "#e2d9c8" }}>{member.name}</span>
                            </div>
                            <div style={{ fontSize: "11px", color: "#5a5040" }} aria-live="polite">
                              {memberProg}/{surah.verses}
                            </div>
                          </div>

                          {/* Quick verse buttons */}
                          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            {[1, 5, 10, 20, 50].map(inc => {
                              const newVerse = Math.min(memberProg + inc, surah.verses);
                              if (newVerse <= memberProg) return null;
                              return (
                                <button
                                  key={inc}
                                  className="verse-btn"
                                  onClick={() => updateProgress(member.id, surah.number, newVerse)}
                                  aria-label={`Add ${inc} verses for ${member.name}`}
                                  style={{
                                    background: `${member.color}15`,
                                    border: `1px solid ${member.color}40`,
                                    color: member.color,
                                    borderRadius: "8px", padding: "4px 10px",
                                    cursor: "pointer", fontSize: "11px",
                                    willChange: "transform",
                                  }}
                                >
                                  +{inc}
                                </button>
                              );
                            })}
                            {memberProg > 0 && (
                              <button
                                onClick={() => updateProgress(member.id, surah.number, 0)}
                                aria-label={`Reset progress for ${member.name}`}
                                style={{
                                  background: "rgba(192,57,43,0.1)",
                                  border: "1px solid rgba(192,57,43,0.3)",
                                  color: "#C0392B",
                                  borderRadius: "8px", padding: "4px 10px",
                                  cursor: "pointer", fontSize: "11px",
                                }}
                              >
                                Reset
                              </button>
                            )}
                            {memberProg >= surah.verses && (
                              <span style={{
                                fontSize: "11px", color: "#27AE60",
                                display: "flex", alignItems: "center", gap: "4px",
                              }}>
                                <BsCheckCircleFill size={12} aria-hidden="true" /> Mukammal!
                              </span>
                            )}
                          </div>

                          {/* Mini progress */}
                          <div
                            role="progressbar"
                            aria-valuenow={memberProg}
                            aria-valuemin={0}
                            aria-valuemax={surah.verses}
                            aria-label={`${member.name} progress`}
                            style={{
                              height: "2px", background: "rgba(255,255,255,0.04)",
                              borderRadius: "1px", marginTop: "8px", overflow: "hidden",
                            }}
                          >
                            <div style={{
                              height: "100%", width: `${memberPct}%`,
                              background: member.color,
                              borderRadius: "1px", transition: "width 0.3s ease",
                              willChange: "width",
                            }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </article>
            );
          })}
        </section>
      </div>
    );
  }
}));

const StatsTab = lazy(() => Promise.resolve({
  default: function StatsTab({ members, getTotalRead, getMemberProgress }) {
    const totalFamilyVerses = useMemo(() =>
      members.reduce((sum, m) => sum + getTotalRead(m.id), 0),
    [members, getTotalRead]);

    const sortedMembers = useMemo(() =>
      [...members].sort((a, b) => getTotalRead(b.id) - getTotalRead(a.id)),
    [members, getTotalRead]);

    const rankColors = ["#C9A84C", "#C0C0C0", "#CD7F32"];

    return (
      <div className="fade-up">
        {/* Total Progress Card */}
        <div style={{
          background: "linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.02))",
          border: "1px solid rgba(201,168,76,0.2)",
          borderRadius: "20px", padding: "24px",
          marginBottom: "20px", textAlign: "center",
        }}>
          <div style={{ fontSize: "11px", color: "#5a5040", letterSpacing: "2px", marginBottom: "8px" }}>
            TOTAL FAMILY PROGRESS
          </div>
          <div
            style={{
              fontSize: "48px", fontWeight: "300", color: "#C9A84C",
              fontFamily: "'Amiri', serif",
            }}
            aria-live="polite"
          >
            {totalFamilyVerses.toLocaleString()}
          </div>
          <div style={{ fontSize: "13px", color: "#6a5f52", marginTop: "4px" }}>
            ayat padhi gayi
          </div>
        </div>

        {/* Leaderboard */}
        <section aria-label="Family leaderboard" style={{ marginBottom: "20px" }}>
          <div style={{
            fontSize: "11px", color: "#3a3028", letterSpacing: "2px",
            marginBottom: "12px",
          }}>
            🏆 FAMILY LEADERBOARD
          </div>
          {sortedMembers.map((member, i) => {
            const total = getTotalRead(member.id);
            const quranPct = Math.floor(total / TOTAL_QURAN_VERSES * 100);
            return (
              <div
                key={member.id}
                className="fade-up"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "14px", padding: "14px 16px",
                  marginBottom: "8px", display: "flex",
                  alignItems: "center", gap: "12px",
                  animationDelay: `${i * 0.05}s`, opacity: 0,
                  contain: "layout style paint",
                }}
              >
                <div
                  style={{
                    width: "28px", height: "28px",
                    borderRadius: "50%",
                    background: i < 3 ? `${rankColors[i]}20` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${i < 3 ? rankColors[i] : "rgba(255,255,255,0.1)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "12px", color: i < 3 ? rankColors[i] : "#5a5040",
                    fontWeight: "600",
                  }}
                  aria-label={`Rank ${i + 1}`}
                >
                  {i + 1}
                </div>
                <span style={{ fontSize: "20px" }} aria-hidden="true">{member.avatar}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", color: "#e2d9c8" }}>{member.name}</div>
                  <div style={{ fontSize: "11px", color: member.color }}>
                    {total} ayat • {quranPct}% Quran
                  </div>
                </div>
                {i === 0 && <BsStarFill size={16} color="#C9A84C" aria-hidden="true" />}
              </div>
            );
          })}
        </section>

        {/* Surah completion */}
        <section aria-label="Surah completion status">
          <div style={{
            fontSize: "11px", color: "#3a3028", letterSpacing: "2px",
            marginBottom: "12px",
          }}>
            📖 SURAHS COMPLETED
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {SURAHS.map(surah => {
              const completedBy = members.filter(m => getMemberProgress(m.id, surah.number) >= surah.verses).length;
              const allDone = completedBy === members.length;
              return (
                <div key={surah.number} style={{
                  background: allDone ? "rgba(39,174,96,0.06)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${allDone ? "rgba(39,174,96,0.3)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: "12px", padding: "12px",
                }}>
                  <div style={{ fontSize: "13px", color: allDone ? "#27AE60" : "#e2d9c8" }}>
                    {surah.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#5a5040", marginTop: "4px" }}>
                    {completedBy}/{members.length} completed
                    {allDone && " ✅"}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    );
  }
}));

const KhatmTab = lazy(() => Promise.resolve({
  default: function KhatmTab({ members, getTotalRead, getKhatmCount }) {
    const totalFamilyVerses = useMemo(() =>
      members.reduce((sum, m) => sum + getTotalRead(m.id), 0),
    [members, getTotalRead]);

    return (
      <div className="fade-up">
        {/* Khatm Hero */}
        <div style={{
          background: "linear-gradient(135deg, rgba(201,168,76,0.1), rgba(201,168,76,0.02))",
          border: "1px solid rgba(201,168,76,0.25)",
          borderRadius: "24px", padding: "40px 24px",
          textAlign: "center", marginBottom: "24px",
        }}>
          <div style={{
            width: "100px", height: "100px",
            borderRadius: "50%",
            background: "rgba(201,168,76,0.1)",
            border: "2px solid rgba(201,168,76,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
            fontSize: "48px",
            animation: "pulse 2s ease-in-out infinite",
            willChange: "transform",
          }} aria-hidden="true">
            🤲
          </div>
          <div
            style={{
              fontSize: "32px", color: "#C9A84C",
              fontFamily: "'Amiri', serif", marginBottom: "8px",
            }}
            aria-live="polite"
          >
            {getKhatmCount()}
          </div>
          <div style={{ fontSize: "14px", color: "#e2d9c8", marginBottom: "4px" }}>
            Family Khatm-e-Quran
          </div>
          <div style={{ fontSize: "12px", color: "#5a5040" }}>
            {totalFamilyVerses.toLocaleString()} / {TOTAL_QURAN_VERSES.toLocaleString()} verses
          </div>
        </div>

        {/* Individual Khatm Progress */}
        <section aria-label="Individual khatm progress">
          <div style={{
            fontSize: "11px", color: "#3a3028", letterSpacing: "2px",
            marginBottom: "12px",
          }}>
            👤 HAR SHAKHS KA HISAAB
          </div>
          {members.map(member => {
            const total = getTotalRead(member.id);
            const pct = Math.min((total / TOTAL_QURAN_VERSES) * 100, 100);
            const khatms = Math.floor(total / TOTAL_QURAN_VERSES);
            return (
              <div key={member.id} style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "16px", padding: "16px",
                marginBottom: "10px",
                contain: "layout style paint",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                  <span style={{ fontSize: "24px" }} aria-hidden="true">{member.avatar}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", color: "#e2d9c8" }}>{member.name}</div>
                    <div style={{ fontSize: "11px", color: member.color }}>
                      {khatms > 0 ? `${khatms} Khatm completed` : "Khatm in progress..."}
                    </div>
                  </div>
                  <div style={{ fontSize: "18px", color: "#C9A84C", fontWeight: "300" }}>
                    {Math.round(pct)}%
                  </div>
                </div>
                <div
                  role="progressbar"
                  aria-valuenow={Math.round(pct)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${member.name} khatm progress`}
                  style={{
                    height: "6px", background: "rgba(255,255,255,0.04)",
                    borderRadius: "3px", overflow: "hidden",
                  }}
                >
                  <div style={{
                    height: "100%", width: `${pct}%`,
                    background: `linear-gradient(90deg, ${member.color}, #C9A84C)`,
                    borderRadius: "3px", transition: "width 0.5s ease",
                    willChange: "width",
                  }} />
                </div>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  marginTop: "6px", fontSize: "10px", color: "#3a3028",
                }}>
                  <span>0</span>
                  <span>{TOTAL_QURAN_VERSES.toLocaleString()} verses</span>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    );
  }
}));

// ─── MAIN COMPONENT ───
export default function FamilyRead() {
  const [members, setMembers] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_MEMBERS;
    const saved = localStorage.getItem("family_members");
    return saved ? JSON.parse(saved) : DEFAULT_MEMBERS;
  });

  const [progress, setProgress] = useState(() => {
    if (typeof window === 'undefined') return {};
    const saved = localStorage.getItem("family_progress");
    return saved ? JSON.parse(saved) : {};
  });

  const [selectedSurah, setSelectedSurah] = useState(null);
  const [newMemberName, setNewMemberName] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);
  const [activeTab, setActiveTab] = useState("reading");

  // Save to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem("family_members", JSON.stringify(members));
    localStorage.setItem("family_progress", JSON.stringify(progress));
  }, [members, progress]);

  // ─── MEMOIZED HELPERS ───
  const getMemberProgress = useCallback((memberId, surahNumber) => {
    return progress[`${memberId}-${surahNumber}`] || 0;
  }, [progress]);

  const updateProgress = useCallback((memberId, surahNumber, verse) => {
    setProgress(prev => ({
      ...prev,
      [`${memberId}-${surahNumber}`]: verse
    }));
  }, []);

  const getTotalRead = useCallback((memberId) => {
    return SURAHS.reduce((total, s) => total + (progress[`${memberId}-${s.number}`] || 0), 0);
  }, [progress]);

  const getSurahProgress = useCallback((surahNumber) => {
    const surah = SURAHS.find(s => s.number === surahNumber);
    if (!surah) return 0;
    const totalRead = members.reduce((sum, m) => sum + getMemberProgress(m.id, surahNumber), 0);
    return Math.min((totalRead / (surah.verses * members.length)) * 100, 100);
  }, [members, getMemberProgress]);

  const getKhatmCount = useCallback(() => {
    let khatm = 0;
    members.forEach(m => {
      const totalVerses = getTotalRead(m.id);
      if (totalVerses >= TOTAL_QURAN_VERSES) {
        khatm += Math.floor(totalVerses / TOTAL_QURAN_VERSES);
      }
    });
    return khatm;
  }, [members, getTotalRead]);

  const addMember = useCallback(() => {
    if (!newMemberName.trim()) return;
    const newMember = {
      id: Date.now(),
      name: newMemberName.trim(),
      color: COLORS[members.length % COLORS.length],
      avatar: AVATARS[members.length % AVATARS.length],
    };
    setMembers(prev => [...prev, newMember]);
    setNewMemberName("");
    setShowAddMember(false);
  }, [newMemberName, members.length]);

  const removeMember = useCallback((id) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    setProgress(prev => {
      const newProgress = { ...prev };
      Object.keys(newProgress).forEach(key => {
        if (key.startsWith(`${id}-`)) delete newProgress[key];
      });
      return newProgress;
    });
  }, []);

  const shareProgress = useCallback(() => {
    const text = members.map(m => {
      const total = getTotalRead(m.id);
      return `${m.avatar} ${m.name}: ${total} ayat padhi`;
    }).join("\n");

    const shareText = `📖 Aaj ki Family Reading:\n\n${text}\n\nAlhamdulillah! 🤲`;

    if (navigator.share) {
      navigator.share({
        title: "Family Quran Reading",
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Progress copied!");
    }
  }, [members, getTotalRead]);

  const tabConfig = useMemo(() => [
    { id: "reading", label: "📖 Padhai", icon: <BsBook size={14} /> },
    { id: "stats", label: "📊 Hisaab", icon: <BsStarFill size={14} /> },
    { id: "khatm", label: "🤲 Khatm", icon: <FaPrayingHands size={14} /> },
  ], []);

  return (
    <>
      <SEOHead activeTab={activeTab} />

      <div
        style={{
          minHeight: "100vh",
          background: "#07090d",
          color: "#e2d9c8",
          fontFamily: "'Georgia', serif",
          paddingBottom: "100px",
        }}
        lang="ur"
        dir="ltr"
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Amiri:ital@0;1&display=swap');
          @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
          @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
          @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(201,168,76,0.15)} 50%{box-shadow:0 0 40px rgba(201,168,76,0.4)} }
          .fade-up { animation: fadeUp 0.4s ease forwards; }
          .member-card { transition: all 0.25s; }
          .member-card:hover { transform: translateY(-2px); }
          .verse-btn { transition: all 0.15s; }
          .verse-btn:active { transform: scale(0.92); }
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-thumb { background: #1e2830; border-radius: 4px; }
          @media (prefers-reduced-motion: reduce) {
            .fade-up { animation: none !important; }
          }
        `}</style>

        {/* Skip to content */}
        <a href="#main-content" style={{
          position: "absolute", top: "-40px", left: "16px",
          background: "#C9A84C", color: "#000", padding: "8px 16px",
          borderRadius: "4px", textDecoration: "none", fontSize: "14px",
          zIndex: 100, transition: "top 0.2s",
        }} onFocus={e => e.target.style.top = "16px"} onBlur={e => e.target.style.top = "-40px"}>
          Skip to content
        </a>

        {/* Header */}
        <header style={{
          position: "sticky", top: 0, zIndex: 10,
          background: "rgba(7,9,13,0.97)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(201,168,76,0.1)",
          padding: "16px",
        }}>
          <div style={{ maxWidth: "520px", margin: "0 auto" }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: "16px",
            }}>
              <div>
                <h1 style={{
                  fontSize: "20px", fontWeight: "600", color: "#C9A84C",
                  display: "flex", alignItems: "center", gap: "10px",
                  margin: 0,
                }}>
                  <BsPeople size={22} aria-hidden="true" />
                  Family Read
                </h1>
                <div style={{ fontSize: "12px", color: "#5a5040", marginTop: "4px" }}>
                  Sath padhein, sawab batorein
                </div>
              </div>
              <button
                onClick={shareProgress}
                aria-label="Share family progress"
                style={{
                  background: "rgba(201,168,76,0.1)",
                  border: "1px solid rgba(201,168,76,0.3)",
                  color: "#C9A84C",
                  borderRadius: "12px", padding: "8px 14px",
                  cursor: "pointer", fontSize: "12px",
                  display: "flex", alignItems: "center", gap: "6px",
                }}
              >
                <BsShare size={14} aria-hidden="true" /> Share
              </button>
            </div>

            {/* Tabs */}
            <nav aria-label="Main navigation">
              <div style={{ display: "flex", gap: "8px" }}>
                {tabConfig.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    aria-current={activeTab === tab.id ? "page" : undefined}
                    aria-label={tab.label}
                    style={{
                      flex: 1,
                      background: activeTab === tab.id ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${activeTab === tab.id ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.07)"}`,
                      color: activeTab === tab.id ? "#C9A84C" : "#5a5040",
                      borderRadius: "12px", padding: "10px",
                      cursor: "pointer", fontSize: "12px",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                      transition: "all 0.2s",
                    }}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </header>

        <main id="main-content" style={{ maxWidth: "520px", margin: "0 auto", padding: "16px" }}>
          <Suspense fallback={
            <div style={{ textAlign: "center", padding: "40px", color: "#4a4030" }} aria-live="polite">
              Loading...
            </div>
          }>
            {activeTab === "reading" && (
              <ReadingTab
                members={members}
                setMembers={setMembers}
                progress={progress}
                setProgress={setProgress}
                selectedSurah={selectedSurah}
                setSelectedSurah={setSelectedSurah}
                newMemberName={newMemberName}
                setNewMemberName={setNewMemberName}
                showAddMember={showAddMember}
                setShowAddMember={setShowAddMember}
                getMemberProgress={getMemberProgress}
                updateProgress={updateProgress}
                getTotalRead={getTotalRead}
                getSurahProgress={getSurahProgress}
                addMember={addMember}
                removeMember={removeMember}
              />
            )}
            {activeTab === "stats" && (
              <StatsTab
                members={members}
                getTotalRead={getTotalRead}
                getMemberProgress={getMemberProgress}
              />
            )}
            {activeTab === "khatm" && (
              <KhatmTab
                members={members}
                getTotalRead={getTotalRead}
                getKhatmCount={getKhatmCount}
              />
            )}
          </Suspense>
        </main>
      </div>
    </>
  );
}
