// pages/FamilyRead.jsx
import { useState, useEffect, useRef } from "react";
import { BsCheckCircleFill, BsCircle, BsPlus, BsTrash, BsShare, BsChevronDown, BsChevronUp, BsPeople, BsBook, BsArrowRight, BsStarFill } from "react-icons/bs";
// import { GiPrayingHands } from "react-icons/gi"; // nahi hai, use karo: FaPrayingHands
import { FaPrayingHands } from "react-icons/fa";

// ─── SURAH DATA ───
const SURAHS = [
  { number: 1, name: "Al-Fatihah", verses: 7, arabic: "الفاتحة" },
  { number: 2, name: "Al-Baqarah", verses: 286, arabic: "البقرة" },
  { number: 3, name: "Aal-E-Imran", verses: 200, arabic: "آل عمران" },
  { number: 36, name: "Ya-Sin", verses: 83, arabic: "يس" },
  { number: 55, name: "Ar-Rahman", verses: 78, arabic: "الرحمن" },
  { number: 67, name: "Al-Mulk", verses: 30, arabic: "الملك" },
  { number: 112, name: "Al-Ikhlas", verses: 4, arabic: "الإخلاص" },
  { number: 113, name: "Al-Falaq", verses: 5, arabic: "الفلق" },
  { number: 114, name: "An-Nas", verses: 6, arabic: "الناس" },
  { number: 18, name: "Al-Kahf", verses: 110, arabic: "الكهف" },
  { number: 32, name: "As-Sajdah", verses: 30, arabic: "السجدة" },
  { number: 76, name: "Al-Insan", verses: 31, arabic: "الإنسان" },
];

// ─── FAMILY MEMBERS (LocalStorage se load honge) ───
const DEFAULT_MEMBERS = [
  { id: 1, name: "Abbu", color: "#2C7873", avatar: "👨" },
  { id: 2, name: "Ammi", color: "#C9A84C", avatar: "👩" },
  { id: 3, name: "Bhai", color: "#7B6FD4", avatar: "👦" },
  { id: 4, name: "Behen", color: "#E8A838", avatar: "👧" },
];

// ─── COMPONENT ───
export default function FamilyRead() {
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem("family_members");
    return saved ? JSON.parse(saved) : DEFAULT_MEMBERS;
  });
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem("family_progress");
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [newMemberName, setNewMemberName] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);
  const [activeTab, setActiveTab] = useState("reading"); // reading | stats | khatm

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("family_members", JSON.stringify(members));
    localStorage.setItem("family_progress", JSON.stringify(progress));
  }, [members, progress]);

  // ─── HELPERS ───
  const getMemberProgress = (memberId, surahNumber) => {
    return progress[`${memberId}-${surahNumber}`] || 0;
  };

  const updateProgress = (memberId, surahNumber, verse) => {
    setProgress(prev => ({
      ...prev,
      [`${memberId}-${surahNumber}`]: verse
    }));
  };

  const getTotalRead = (memberId) => {
    return SURAHS.reduce((total, s) => total + (progress[`${memberId}-${s.number}`] || 0), 0);
  };

  const getSurahProgress = (surahNumber) => {
    const surah = SURAHS.find(s => s.number === surahNumber);
    if (!surah) return 0;
    const totalRead = members.reduce((sum, m) => sum + getMemberProgress(m.id, surahNumber), 0);
    return Math.min((totalRead / (surah.verses * members.length)) * 100, 100);
  };

  const getKhatmCount = () => {
    // Har member ne kitni baar poora Quran padha
    let khatm = 0;
    members.forEach(m => {
      const totalVerses = getTotalRead(m.id);
      if (totalVerses >= 6236) khatm = Math.floor(totalVerses / 6236);
    });
    return khatm;
  };

  const addMember = () => {
    if (!newMemberName.trim()) return;
    const colors = ["#2C7873", "#C9A84C", "#7B6FD4", "#E8A838", "#C0392B", "#8E44AD", "#27AE60"];
    const avatars = ["👨", "👩", "👦", "👧", "👴", "👵", "🧒"];
    const newMember = {
      id: Date.now(),
      name: newMemberName,
      color: colors[members.length % colors.length],
      avatar: avatars[members.length % avatars.length],
    };
    setMembers([...members, newMember]);
    setNewMemberName("");
    setShowAddMember(false);
  };

  const removeMember = (id) => {
    setMembers(members.filter(m => m.id !== id));
    // Clean up progress
    const newProgress = { ...progress };
    Object.keys(newProgress).forEach(key => {
      if (key.startsWith(`${id}-`)) delete newProgress[key];
    });
    setProgress(newProgress);
  };

  const shareProgress = () => {
    const text = members.map(m => {
      const total = getTotalRead(m.id);
      return `${m.avatar} ${m.name}: ${total} ayat padhi`;
    }).join("\n");
    
    if (navigator.share) {
      navigator.share({
        title: "Family Quran Reading",
        text: `📖 Aaj ki Family Reading:\n\n${text}\n\nAlhamdulillah! 🤲`,
      });
    } else {
      navigator.clipboard.writeText(`📖 Family Quran Reading:\n\n${text}`);
      alert("Progress copied!");
    }
  };

  // ─── RENDER ───
  return (
    <div style={{
      minHeight: "100vh",
      background: "#07090d",
      color: "#e2d9c8",
      fontFamily: "'Georgia', serif",
      paddingBottom: "100px",
    }}>
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
      `}</style>

      {/* ── HEADER ── */}
      <div style={{
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
              <div style={{
                fontSize: "20px", fontWeight: "600", color: "#C9A84C",
                display: "flex", alignItems: "center", gap: "10px",
              }}>
                <BsPeople size={22} />
                Family Read
              </div>
              <div style={{ fontSize: "12px", color: "#5a5040", marginTop: "4px" }}>
                Sath padhein, sawab batorein
              </div>
            </div>
            <button
              onClick={shareProgress}
              style={{
                background: "rgba(201,168,76,0.1)",
                border: "1px solid rgba(201,168,76,0.3)",
                color: "#C9A84C",
                borderRadius: "12px", padding: "8px 14px",
                cursor: "pointer", fontSize: "12px",
                display: "flex", alignItems: "center", gap: "6px",
              }}
            >
              <BsShare size={14} /> Share
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { id: "reading", label: "📖 Padhai", icon: <BsBook size={14} /> },
              { id: "stats", label: "📊 Hisaab", icon: <BsStarFill size={14} /> },
              { id: "khatm", label: "🤲 Khatm", icon: <FaPrayingHands size={14} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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
        </div>
      </div>

      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "16px" }}>

        {/* ── TAB: READING ── */}
        {activeTab === "reading" && (
          <div className="fade-up">
            {/* Family Members */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{
                fontSize: "11px", color: "#3a3028", letterSpacing: "2px",
                marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px",
              }}>
                <BsPeople size={12} /> GHAR KE LOG — {members.length}
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
                    }}
                    onClick={() => setSelectedSurah(selectedSurah ? selectedSurah : null)}
                  >
                    <div style={{
                      width: "36px", height: "36px",
                      borderRadius: "50%",
                      background: `${member.color}20`,
                      border: `2px solid ${member.color}50`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "18px",
                    }}>
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
                      style={{
                        position: "absolute", top: "-6px", right: "-6px",
                        background: "#C0392B", border: "none",
                        color: "white", borderRadius: "50%",
                        width: "20px", height: "20px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", fontSize: "10px", padding: 0,
                      }}
                    >
                      <BsTrash size={10} />
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
                      style={{
                        background: "transparent", border: "none",
                        color: "#e2d9c8", fontSize: "13px",
                        outline: "none", width: "100px",
                      }}
                      onKeyDown={e => e.key === "Enter" && addMember()}
                    />
                    <button
                      onClick={addMember}
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
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px dashed rgba(255,255,255,0.15)",
                      borderRadius: "16px", padding: "12px 20px",
                      color: "#5a5040", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: "6px",
                      fontSize: "13px",
                    }}
                  >
                    <BsPlus size={18} /> Add
                  </button>
                )}
              </div>
            </div>

            {/* Surah List */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{
                fontSize: "11px", color: "#3a3028", letterSpacing: "2px",
                marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px",
              }}>
                <BsBook size={12} /> SURAHS
              </div>

              {SURAHS.map((surah, i) => {
                const progressPct = getSurahProgress(surah.number);
                const isSelected = selectedSurah === surah.number;

                return (
                  <div
                    key={surah.number}
                    className="fade-up"
                    style={{
                      background: isSelected ? "rgba(201,168,76,0.06)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${isSelected ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.06)"}`,
                      borderRadius: "16px", padding: "16px",
                      marginBottom: "10px", cursor: "pointer",
                      animationDelay: `${i * 0.03}s`, opacity: 0,
                      transition: "all 0.2s",
                    }}
                    onClick={() => setSelectedSurah(isSelected ? null : surah.number)}
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
                        }}>
                          {surah.number}
                        </div>
                        <div>
                          <div style={{ fontSize: "14px", color: "#e2d9c8", fontWeight: "500" }}>
                            {surah.name}
                          </div>
                          <div style={{ fontSize: "11px", color: "#5a5040" }}>
                            {surah.verses} verses • {surah.arabic}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{
                          fontSize: "11px", color: progressPct >= 100 ? "#27AE60" : "#C9A84C",
                        }}>
                          {Math.round(progressPct)}%
                        </div>
                        {isSelected ? <BsChevronUp size={14} color="#C9A84C" /> : <BsChevronDown size={14} color="#5a5040" />}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{
                      height: "3px", background: "rgba(255,255,255,0.04)",
                      borderRadius: "2px", marginTop: "12px", overflow: "hidden",
                    }}>
                      <div style={{
                        height: "100%", width: `${progressPct}%`,
                        background: progressPct >= 100 ? "#27AE60" : "#C9A84C",
                        borderRadius: "2px", transition: "width 0.5s ease",
                      }} />
                    </div>

                    {/* Expanded: Member Progress */}
                    {isSelected && (
                      <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        {members.map(member => {
                          const memberProg = getMemberProgress(member.id, surah.number);
                          const memberPct = Math.min((memberProg / surah.verses) * 100, 100);
                          const remaining = surah.verses - memberProg;

                          return (
                            <div key={member.id} style={{ marginBottom: "14px" }}>
                              <div style={{
                                display: "flex", justifyContent: "space-between",
                                alignItems: "center", marginBottom: "8px",
                              }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <span style={{ fontSize: "16px" }}>{member.avatar}</span>
                                  <span style={{ fontSize: "13px", color: "#e2d9c8" }}>{member.name}</span>
                                </div>
                                <div style={{ fontSize: "11px", color: "#5a5040" }}>
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
                                      style={{
                                        background: `${member.color}15`,
                                        border: `1px solid ${member.color}40`,
                                        color: member.color,
                                        borderRadius: "8px", padding: "4px 10px",
                                        cursor: "pointer", fontSize: "11px",
                                      }}
                                    >
                                      +{inc}
                                    </button>
                                  );
                                })}
                                {memberProg > 0 && (
                                  <button
                                    onClick={() => updateProgress(member.id, surah.number, 0)}
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
                                    <BsCheckCircleFill size={12} /> Mukammal!
                                  </span>
                                )}
                              </div>

                              {/* Mini progress */}
                              <div style={{
                                height: "2px", background: "rgba(255,255,255,0.04)",
                                borderRadius: "1px", marginTop: "8px", overflow: "hidden",
                              }}>
                                <div style={{
                                  height: "100%", width: `${memberPct}%`,
                                  background: member.color,
                                  borderRadius: "1px", transition: "width 0.3s ease",
                                }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB: STATS ── */}
        {activeTab === "stats" && (
          <div className="fade-up">
            <div style={{
              background: "linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.02))",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: "20px", padding: "24px",
              marginBottom: "20px", textAlign: "center",
            }}>
              <div style={{ fontSize: "11px", color: "#5a5040", letterSpacing: "2px", marginBottom: "8px" }}>
                TOTAL FAMILY PROGRESS
              </div>
              <div style={{
                fontSize: "48px", fontWeight: "300", color: "#C9A84C",
                fontFamily: "'Amiri', serif",
              }}>
                {members.reduce((sum, m) => sum + getTotalRead(m.id), 0).toLocaleString()}
              </div>
              <div style={{ fontSize: "13px", color: "#6a5f52", marginTop: "4px" }}>
                ayat padhi gayi
              </div>
            </div>

            {/* Leaderboard */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{
                fontSize: "11px", color: "#3a3028", letterSpacing: "2px",
                marginBottom: "12px",
              }}>
                🏆 FAMILY LEADERBOARD
              </div>
              {[...members]
                .sort((a, b) => getTotalRead(b.id) - getTotalRead(a.id))
                .map((member, i) => {
                  const total = getTotalRead(member.id);
                  const rankColors = ["#C9A84C", "#C0C0C0", "#CD7F32"];
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
                      }}
                    >
                      <div style={{
                        width: "28px", height: "28px",
                        borderRadius: "50%",
                        background: i < 3 ? `${rankColors[i]}20` : "rgba(255,255,255,0.04)",
                        border: `1px solid ${i < 3 ? rankColors[i] : "rgba(255,255,255,0.1)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "12px", color: i < 3 ? rankColors[i] : "#5a5040",
                        fontWeight: "600",
                      }}>
                        {i + 1}
                      </div>
                      <span style={{ fontSize: "20px" }}>{member.avatar}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "14px", color: "#e2d9c8" }}>{member.name}</div>
                        <div style={{ fontSize: "11px", color: member.color }}>
                          {total} ayat • {Math.floor(total / 6236 * 100)}% Quran
                        </div>
                      </div>
                      {i === 0 && <BsStarFill size={16} color="#C9A84C" />}
                    </div>
                  );
                })}
            </div>

            {/* Surah completion */}
            <div>
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
            </div>
          </div>
        )}

        {/* ── TAB: KHATM ── */}
        {activeTab === "khatm" && (
          <div className="fade-up">
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
              }}>
                🤲
              </div>
              <div style={{
                fontSize: "32px", color: "#C9A84C",
                fontFamily: "'Amiri', serif", marginBottom: "8px",
              }}>
                {getKhatmCount()}
              </div>
              <div style={{ fontSize: "14px", color: "#e2d9c8", marginBottom: "4px" }}>
                Family Khatm-e-Quran
              </div>
              <div style={{ fontSize: "12px", color: "#5a5040" }}>
                {members.reduce((sum, m) => sum + getTotalRead(m.id), 0).toLocaleString()} / 6,236 verses
              </div>
            </div>

            {/* Individual Khatm Progress */}
            <div>
              <div style={{
                fontSize: "11px", color: "#3a3028", letterSpacing: "2px",
                marginBottom: "12px",
              }}>
                👤 HAR SHAKHS KA HISAAB
              </div>
              {members.map(member => {
                const total = getTotalRead(member.id);
                const pct = Math.min((total / 6236) * 100, 100);
                const khatms = Math.floor(total / 6236);
                return (
                  <div key={member.id} style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "16px", padding: "16px",
                    marginBottom: "10px",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                      <span style={{ fontSize: "24px" }}>{member.avatar}</span>
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
                    <div style={{
                      height: "6px", background: "rgba(255,255,255,0.04)",
                      borderRadius: "3px", overflow: "hidden",
                    }}>
                      <div style={{
                        height: "100%", width: `${pct}%`,
                        background: `linear-gradient(90deg, ${member.color}, #C9A84C)`,
                        borderRadius: "3px", transition: "width 0.5s ease",
                      }} />
                    </div>
                    <div style={{
                      display: "flex", justifyContent: "space-between",
                      marginTop: "6px", fontSize: "10px", color: "#3a3028",
                    }}>
                      <span>0</span>
                      <span>6,236 verses</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}