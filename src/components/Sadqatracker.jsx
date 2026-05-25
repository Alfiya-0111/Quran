import { useState, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";

// ─── Constants — module level ─────────────────────────────────────────────────

const COLORS = {
  bg: "#0c1118", surface: "#111827", card: "#1a2332",
  gold: "#C9A84C", goldLight: "#e8c97a", goldDim: "#8a6f30",
  text: "#e8e0d0", textDim: "#8a9ab0",
  green: "#2d6a4f", greenLight: "#52b788",
};

const ACTIVITY_TYPES = [
  { id: "quran", label: "Quran Padhna", icon: "📖", unit: "pages",  color: "#C9A84C" },
  { id: "dua",   label: "Dua Karna",    icon: "🤲", unit: "duas",   color: "#52b788" },
  { id: "sadqa", label: "Sadqa Dena",   icon: "💛", unit: "times",  color: "#e07b54" },
];

const RELATIONS = ["Abbu", "Ammi", "Dada", "Dadi", "Nana", "Nani", "Bhai", "Behen", "Dost", "Ustad", "Aur koi"];
const QUICK_COUNTS = [1, 5, 10, 20];

// ─── Storage helpers — pure functions ────────────────────────────────────────

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function loadPersons() {
  try { return JSON.parse(localStorage.getItem("sadqa_persons") || "[]"); }
  catch { return []; }
}

function savePersons(persons) {
  localStorage.setItem("sadqa_persons", JSON.stringify(persons));
}

function loadLogsForPerson(personId) {
  try { return JSON.parse(localStorage.getItem(`sadqa_logs_${personId}`) || "[]"); }
  catch { return []; }
}

function saveLogsForPerson(personId, logs) {
  localStorage.setItem(`sadqa_logs_${personId}`, JSON.stringify(logs));
}

// ✅ Preload all logs for all persons at startup — ek baar, phir state mein
function loadAllLogs(persons) {
  const map = {};
  for (const p of persons) {
    map[p.id] = loadLogsForPerson(p.id);
  }
  return map;
}

// ─── Pure calculation helpers ─────────────────────────────────────────────────

function calcTotals(logs) {
  return ACTIVITY_TYPES.reduce((acc, a) => {
    acc[a.id] = logs
      .filter((l) => l.type === a.id)
      .reduce((s, l) => s + l.count, 0);
    return acc;
  }, {});
}

function calcStreak(logs) {
  let streak = 0;
  const d = new Date();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const ds = d.toISOString().split("T")[0];
    if (logs.some((l) => l.date === ds)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else break;
  }
  return streak;
}

function calcLast7(logs) {
  const today = getToday();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const dayLogs = logs.filter((l) => l.date === dateStr);
    const total = dayLogs.reduce((s, l) => s + l.count, 0);
    return {
      date: dateStr,
      total,
      isToday: dateStr === today,
      label: d.toLocaleDateString("ur-PK", { weekday: "short" }),
    };
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function AddPersonModal({ onAdd, onClose }) {
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");

  const handleAdd = useCallback(() => {
    if (!name.trim()) return;
    onAdd({ id: generateId(), name: name.trim(), relation, createdAt: getToday() });
    onClose();
  }, [name, relation, onAdd, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Naya naam add karein"
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100, padding:"20px" }}
    >
      <div style={{ background:COLORS.card, borderRadius:"20px", border:`1px solid ${COLORS.goldDim}`, padding:"32px", width:"100%", maxWidth:"420px" }}>
        <div style={{ textAlign:"center", marginBottom:"24px" }}>
          <div style={{ fontSize:"36px", marginBottom:"8px" }} aria-hidden="true">🕊️</div>
          <h2 style={{ color:COLORS.gold, fontSize:"20px", fontFamily:"Georgia, serif", margin:0 }}>
            Naya Naam Add Karen
          </h2>
          <p style={{ color:COLORS.textDim, fontSize:"13px", marginTop:"6px" }}>
            Jinke liye amal karna chahte hain
          </p>
        </div>

        <div style={{ marginBottom:"16px" }}>
          <label htmlFor="person-name" style={{ color:COLORS.textDim, fontSize:"12px", display:"block", marginBottom:"6px" }}>
            NAAM *
          </label>
          <input
            id="person-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Abbu ka naam likhen..."
            autoFocus
            style={{ width:"100%", background:COLORS.surface, border:`1px solid ${COLORS.goldDim}`, borderRadius:"10px", padding:"12px 14px", color:COLORS.text, fontSize:"15px", outline:"none", boxSizing:"border-box", fontFamily:"Georgia, serif" }}
          />
        </div>

        <div style={{ marginBottom:"24px" }}>
          <p style={{ color:COLORS.textDim, fontSize:"12px", marginBottom:"8px" }}>RISHTA</p>
          <div role="group" aria-label="Rishta chunein" style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
            {RELATIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRelation(r)}
                aria-pressed={relation === r}
                style={{ padding:"6px 14px", borderRadius:"20px", fontSize:"13px", border:`1px solid ${relation === r ? COLORS.gold : COLORS.goldDim}`, background:relation === r ? `${COLORS.gold}22` : "transparent", color:relation === r ? COLORS.gold : COLORS.textDim, cursor:"pointer" }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display:"flex", gap:"12px" }}>
          <button onClick={onClose} style={{ flex:1, padding:"12px", borderRadius:"12px", border:`1px solid ${COLORS.goldDim}`, background:"transparent", color:COLORS.textDim, cursor:"pointer", fontSize:"14px" }}>
            Wapas
          </button>
          <button
            onClick={handleAdd}
            disabled={!name.trim()}
            style={{ flex:2, padding:"12px", borderRadius:"12px", border:"none", background:name.trim() ? COLORS.gold : COLORS.goldDim, color:"#0c1118", cursor:name.trim() ? "pointer" : "not-allowed", fontSize:"14px", fontWeight:"700" }}
          >
            Add Karen ✨
          </button>
        </div>
      </div>
    </div>
  );
}

function LogActivityModal({ person, onLog, onClose }) {
  const [type, setType]   = useState("quran");
  const [count, setCount] = useState(1);
  const [note, setNote]   = useState("");

  const selected = useMemo(() => ACTIVITY_TYPES.find((a) => a.id === type), [type]);

  const handleLog = useCallback(() => {
    onLog({ id: generateId(), type, count, note, date: getToday(), personId: person.id });
    onClose();
  }, [type, count, note, person.id, onLog, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${person.name} ke liye amal log karein`}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100, padding:"20px" }}
    >
      <div style={{ background:COLORS.card, borderRadius:"20px", border:`1px solid ${COLORS.goldDim}`, padding:"32px", width:"100%", maxWidth:"420px" }}>
        <div style={{ textAlign:"center", marginBottom:"24px" }}>
          <p style={{ fontSize:"14px", color:COLORS.textDim, marginBottom:"4px" }}>Ke liye amal karna hai</p>
          <p style={{ fontSize:"22px", color:COLORS.gold, fontFamily:"Georgia, serif", fontWeight:"bold", margin:"0 0 4px" }}>
            {person.name}
          </p>
          <p style={{ fontSize:"12px", color:COLORS.goldDim, margin:0 }}>{person.relation}</p>
        </div>

        {/* Activity type */}
        <div role="group" aria-label="Amal ki qism" style={{ display:"flex", gap:"10px", marginBottom:"20px" }}>
          {ACTIVITY_TYPES.map((a) => (
            <button
              key={a.id}
              onClick={() => setType(a.id)}
              aria-pressed={type === a.id}
              style={{ flex:1, padding:"12px 6px", borderRadius:"12px", textAlign:"center", border:`1px solid ${type === a.id ? a.color : COLORS.goldDim}`, background:type === a.id ? `${a.color}22` : "transparent", cursor:"pointer" }}
            >
              <div style={{ fontSize:"22px" }} aria-hidden="true">{a.icon}</div>
              <div style={{ fontSize:"11px", color:type === a.id ? a.color : COLORS.textDim, marginTop:"4px" }}>{a.label}</div>
            </button>
          ))}
        </div>

        {/* Count */}
        <div style={{ marginBottom:"16px" }}>
          <label style={{ color:COLORS.textDim, fontSize:"12px", display:"block", marginBottom:"8px" }}>
            KITNA? ({selected?.unit})
          </label>
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            <button
              onClick={() => setCount((c) => Math.max(1, c - 1))}
              aria-label="Kam karo"
              style={{ width:"44px", height:"44px", borderRadius:"50%", border:`1px solid ${COLORS.goldDim}`, background:"transparent", color:COLORS.gold, fontSize:"22px", cursor:"pointer" }}
            >−</button>
            <div aria-live="polite" style={{ flex:1, textAlign:"center", fontSize:"32px", color:COLORS.gold, fontFamily:"Georgia, serif", fontWeight:"bold" }}>
              {count}
            </div>
            <button
              onClick={() => setCount((c) => c + 1)}
              aria-label="Zyada karo"
              style={{ width:"44px", height:"44px", borderRadius:"50%", border:`1px solid ${COLORS.goldDim}`, background:"transparent", color:COLORS.gold, fontSize:"22px", cursor:"pointer" }}
            >+</button>
          </div>
          <div style={{ display:"flex", gap:"8px", marginTop:"10px", justifyContent:"center" }}>
            {QUICK_COUNTS.map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                aria-pressed={count === n}
                style={{ padding:"4px 12px", borderRadius:"20px", fontSize:"12px", border:`1px solid ${count === n ? COLORS.gold : COLORS.goldDim}`, background:count === n ? `${COLORS.gold}22` : "transparent", color:count === n ? COLORS.gold : COLORS.textDim, cursor:"pointer" }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div style={{ marginBottom:"24px" }}>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Koi note... (optional)"
            aria-label="Optional note"
            style={{ width:"100%", background:COLORS.surface, border:`1px solid ${COLORS.goldDim}`, borderRadius:"10px", padding:"10px 14px", color:COLORS.text, fontSize:"14px", outline:"none", boxSizing:"border-box" }}
          />
        </div>

        <div style={{ display:"flex", gap:"12px" }}>
          <button onClick={onClose} style={{ flex:1, padding:"12px", borderRadius:"12px", border:`1px solid ${COLORS.goldDim}`, background:"transparent", color:COLORS.textDim, cursor:"pointer", fontSize:"14px" }}>
            Wapas
          </button>
          <button
            onClick={handleLog}
            style={{ flex:2, padding:"12px", borderRadius:"12px", border:"none", background:COLORS.gold, color:"#0c1118", cursor:"pointer", fontSize:"14px", fontWeight:"700" }}
          >
            Log Karen 🤲
          </button>
        </div>
      </div>
    </div>
  );
}

// ✅ PersonCard — logs prop se, localStorage read nahi karta
function PersonCard({ person, logs, onLog, onSelect }) {
  const today = getToday();

  // ✅ useMemo — bar bar recalculate nahi
  const totals    = useMemo(() => calcTotals(logs), [logs]);
  const todayDone = useMemo(() => logs.some((l) => l.date === today), [logs, today]);

  return (
    <article
      onClick={() => onSelect(person)}
      style={{ background:COLORS.card, border:`1px solid ${COLORS.goldDim}`, borderRadius:"16px", padding:"20px", cursor:"pointer", transition:"border-color 0.2s" }}
    >
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <span aria-hidden="true" style={{ fontSize:"20px" }}>🕊️</span>
            <span style={{ color:COLORS.gold, fontSize:"17px", fontFamily:"Georgia, serif", fontWeight:"bold" }}>
              {person.name}
            </span>
          </div>
          {person.relation && (
            <p style={{ color:COLORS.textDim, fontSize:"12px", marginTop:"2px", paddingLeft:"28px", margin:"2px 0 0 28px" }}>
              {person.relation}
            </p>
          )}
        </div>
        {todayDone && (
          <div role="status" style={{ background:`${COLORS.greenLight}22`, border:`1px solid ${COLORS.greenLight}`, borderRadius:"20px", padding:"3px 10px", fontSize:"11px", color:COLORS.greenLight }}>
            ✓ Aaj
          </div>
        )}
      </div>

      <div style={{ display:"flex", gap:"10px", marginTop:"16px" }}>
        {ACTIVITY_TYPES.map((a) => (
          <div key={a.id} style={{ flex:1, background:COLORS.surface, borderRadius:"10px", padding:"10px 8px", textAlign:"center" }}>
            <div aria-hidden="true" style={{ fontSize:"18px" }}>{a.icon}</div>
            <div style={{ color:a.color, fontSize:"18px", fontWeight:"bold", marginTop:"4px" }}>
              {totals[a.id]}
            </div>
            <div style={{ color:COLORS.textDim, fontSize:"10px" }}>{a.unit}</div>
          </div>
        ))}
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onLog(person); }}
        aria-label={`${person.name} ke liye aaj ka amal log karein`}
        style={{ width:"100%", marginTop:"14px", padding:"10px", borderRadius:"10px", border:`1px solid ${COLORS.gold}`, background:"transparent", color:COLORS.gold, cursor:"pointer", fontSize:"13px", fontWeight:"600" }}
      >
        + Aaj Ka Amal Log Karen
      </button>
    </article>
  );
}

// ✅ PersonDetail — logs prop se, memoized calculations
function PersonDetail({ person, logs, onLogNew }) {
  const today = getToday();

  const totals     = useMemo(() => calcTotals(logs), [logs]);
  const streak     = useMemo(() => calcStreak(logs), [logs]);
  const last7      = useMemo(() => calcLast7(logs), [logs]);
  const maxVal     = useMemo(() => Math.max(...last7.map((d) => d.total), 1), [last7]);
  const recentLogs = useMemo(
    () => [...logs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10),
    [logs]
  );

  return (
    <section aria-label={`${person.name} ka amal detail`}>
      {/* Header */}
      <div style={{ background:COLORS.card, border:`1px solid ${COLORS.goldDim}`, borderRadius:"16px", padding:"24px", marginBottom:"16px", textAlign:"center" }}>
        <div aria-hidden="true" style={{ fontSize:"32px", marginBottom:"8px" }}>🕊️</div>
        <h2 style={{ color:COLORS.gold, fontSize:"22px", fontFamily:"Georgia, serif", fontWeight:"bold", margin:"0 0 4px" }}>
          {person.name}
        </h2>
        {person.relation && (
          <p style={{ color:COLORS.textDim, fontSize:"13px", marginTop:"4px", margin:0 }}>{person.relation}</p>
        )}
        <div role="status" aria-label={`${streak} din ka silsila`} style={{ display:"inline-block", marginTop:"12px", background:`${COLORS.gold}22`, border:`1px solid ${COLORS.goldDim}`, borderRadius:"20px", padding:"6px 16px", color:COLORS.gold, fontSize:"13px" }}>
          🔥 {streak} din ka silsila
        </div>
        <blockquote style={{ fontStyle:"italic", color:COLORS.textDim, fontSize:"12px", marginTop:"12px", lineHeight:"1.6", borderLeft:"none", padding:0 }}>
          "Jab insaan mar jaata hai toh uske amal ka silsila toot jaata hai, siwaye teen ke..."
          <footer style={{ color:COLORS.goldDim, marginTop:"4px" }}>— Sahih Muslim</footer>
        </blockquote>
      </div>

      {/* Totals */}
      <div style={{ display:"flex", gap:"10px", marginBottom:"16px" }}>
        {ACTIVITY_TYPES.map((a) => (
          <div key={a.id} style={{ flex:1, background:COLORS.card, border:`1px solid ${COLORS.goldDim}`, borderRadius:"14px", padding:"16px", textAlign:"center" }}>
            <div aria-hidden="true" style={{ fontSize:"24px" }}>{a.icon}</div>
            <div style={{ color:a.color, fontSize:"24px", fontWeight:"bold", fontFamily:"Georgia, serif" }}>
              {totals[a.id]}
            </div>
            <div style={{ color:COLORS.textDim, fontSize:"11px", marginTop:"2px" }}>kul {a.unit}</div>
          </div>
        ))}
      </div>

      {/* 7-day chart */}
      <div style={{ background:COLORS.card, border:`1px solid ${COLORS.goldDim}`, borderRadius:"16px", padding:"20px", marginBottom:"16px" }}>
        <p style={{ color:COLORS.gold, fontSize:"13px", marginBottom:"16px", fontWeight:"600", margin:"0 0 16px" }}>
          📊 Pichhle 7 Din
        </p>
        <div role="img" aria-label="Pichhle 7 din ki activity chart" style={{ display:"flex", alignItems:"flex-end", gap:"8px", height:"80px" }}>
          {last7.map((d) => (
            <div key={d.date} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"4px" }}>
              <div style={{ fontSize:"11px", color:COLORS.textDim }}>{d.total || ""}</div>
              <div
                title={`${d.date}: ${d.total}`}
                style={{ width:"100%", background:d.isToday ? COLORS.gold : `${COLORS.gold}55`, borderRadius:"6px 6px 0 0", height:`${Math.max(4, (d.total / maxVal) * 60)}px`, transition:"height 0.3s" }}
              />
              <div style={{ fontSize:"10px", color:COLORS.textDim }}>{d.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Log button */}
      <button
        onClick={() => onLogNew(person)}
        style={{ width:"100%", padding:"16px", borderRadius:"14px", border:"none", background:COLORS.gold, color:"#0c1118", cursor:"pointer", fontSize:"15px", fontWeight:"700", marginBottom:"16px" }}
      >
        🤲 Aaj Ka Amal Log Karen
      </button>

      {/* Recent logs */}
      {recentLogs.length > 0 && (
        <div style={{ background:COLORS.card, border:`1px solid ${COLORS.goldDim}`, borderRadius:"16px", padding:"20px" }}>
          <p style={{ color:COLORS.gold, fontSize:"13px", marginBottom:"14px", fontWeight:"600", margin:"0 0 14px" }}>
            📋 Haal Ka Amal
          </p>
          <ul style={{ listStyle:"none", padding:0, margin:0 }}>
            {recentLogs.map((log) => {
              const act = ACTIVITY_TYPES.find((a) => a.id === log.type);
              return (
                <li key={log.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${COLORS.surface}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                    <span aria-hidden="true" style={{ fontSize:"18px" }}>{act?.icon}</span>
                    <div>
                      <p style={{ color:COLORS.text, fontSize:"13px", margin:0 }}>{act?.label}</p>
                      {log.note && <p style={{ color:COLORS.textDim, fontSize:"11px", margin:0 }}>{log.note}</p>}
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <p style={{ color:act?.color, fontSize:"14px", fontWeight:"bold", margin:0 }}>
                      {log.count} {act?.unit}
                    </p>
                    <time dateTime={log.date} style={{ color:COLORS.textDim, fontSize:"10px" }}>{log.date}</time>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SadqaTracker() {
  // ✅ Persons + all logs centralized in main component
  const [persons, setPersons]             = useState(loadPersons);
  const [allLogs, setAllLogs]             = useState(() => loadAllLogs(loadPersons()));
  const [showAddModal, setShowAddModal]   = useState(false);
  const [logTarget, setLogTarget]         = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);

  // ✅ handleAddPerson — useCallback
  const handleAddPerson = useCallback((person) => {
    setPersons((prev) => {
      const updated = [...prev, person];
      savePersons(updated);
      return updated;
    });
    // New person ka empty logs array
    setAllLogs((prev) => ({ ...prev, [person.id]: [] }));
  }, []);

  // ✅ handleLog — state update + localStorage write, forceUpdate nahi
  const handleLog = useCallback((logEntry) => {
    setAllLogs((prev) => {
      const existing = prev[logEntry.personId] || [];
      const updated = [...existing, logEntry];
      saveLogsForPerson(logEntry.personId, updated);
      return { ...prev, [logEntry.personId]: updated };
    });
  }, []);

  const handleSelectPerson = useCallback((person) => {
    setSelectedPerson(person);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedPerson(null);
  }, []);

  // ✅ selectedPerson ke saath latest logs sync (state se, loadLogs() nahi)
  const selectedLogs = selectedPerson ? (allLogs[selectedPerson.id] || []) : [];

  return (
    <>
      <Helmet>
        <html lang="ur" />
        <title>Sadqa-e-Jariya Tracker — Apne Azizoon ke Liye Amal | Noor Al-Quran</title>
        <meta
          name="description"
          content="Apne marhoomon aur azizoon ke liye Quran, Dua, aur Sadqa track karein. Amal ka silsila qaim rakhein — Sadqa-e-Jariya app."
        />
        <meta
          name="keywords"
          content="sadqa e jariya, amal tracker, quran tracker, dua tracker, Islamic app Urdu, Noor Al-Quran, marhoom ke liye amal"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://soulayah.com/sadqa-tracker" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Sadqa-e-Jariya Tracker — Noor Al-Quran" />
        <meta property="og:description" content="Apne azizoon ke liye Quran, Dua, Sadqa track karein." />
        <meta property="og:url" content="https://soulayah.com/sadqa-tracker" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Sadqa-e-Jariya Tracker",
            description: "Apne azizoon ke liye amal track karein",
            url: "https://soulayah.com/sadqa-tracker",
            applicationCategory: "ReligiousApplication",
            inLanguage: "ur",
            isAccessibleForFree: true,
            offers: { "@type": "Offer", price: "0" },
          })}
        </script>
      </Helmet>

      <div style={{ minHeight:"100vh", background:COLORS.bg, color:COLORS.text, fontFamily:"system-ui, sans-serif", paddingBottom:"80px" }}>

        <header style={{ background:COLORS.bg, borderBottom:`1px solid ${COLORS.goldDim}`, padding:"24px 20px 20px" }}>
          <div style={{ textAlign:"center" }}>
            <div aria-hidden="true" style={{ fontSize:"28px" }}>🕊️</div>
            <h1 style={{ color:COLORS.gold, fontSize:"22px", fontFamily:"Georgia, serif", margin:"8px 0 4px", fontWeight:"bold" }}>
              Sadqa-e-Jariya
            </h1>
            <p style={{ color:COLORS.textDim, fontSize:"13px", margin:0 }}>
              Apne azizoon ke liye amal ka silsila
            </p>
          </div>
        </header>

        <main style={{ padding:"20px", maxWidth:"480px", margin:"0 auto" }}>

          {selectedPerson ? (
            <>
              <button
                onClick={handleBack}
                aria-label="Person list pe wapas jaayein"
                style={{ background:"transparent", border:`1px solid ${COLORS.goldDim}`, color:COLORS.textDim, borderRadius:"10px", padding:"8px 14px", cursor:"pointer", fontSize:"13px", marginBottom:"16px" }}
              >
                ← Wapas
              </button>
              <PersonDetail
                person={selectedPerson}
                logs={selectedLogs}
                onLogNew={setLogTarget}
              />
            </>
          ) : (
            <>
              <button
                onClick={() => setShowAddModal(true)}
                aria-label="Naya naam add karein"
                style={{ width:"100%", padding:"16px", borderRadius:"14px", border:`2px dashed ${COLORS.goldDim}`, background:"transparent", color:COLORS.gold, cursor:"pointer", fontSize:"15px", marginBottom:"20px", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}
              >
                <span aria-hidden="true" style={{ fontSize:"20px" }}>+</span>
                Naya Naam Add Karen
              </button>

              {persons.length === 0 ? (
                <div style={{ textAlign:"center", padding:"60px 20px", color:COLORS.textDim }}>
                  <div aria-hidden="true" style={{ fontSize:"48px", marginBottom:"16px" }}>🕊️</div>
                  <p style={{ fontSize:"16px", color:COLORS.gold, fontFamily:"Georgia, serif" }}>
                    Pehla naam add karen
                  </p>
                  <p style={{ fontSize:"13px", marginTop:"8px", lineHeight:"1.6" }}>
                    Apne Abbu, Ammi, ya kisi bhi aziz ke liye<br />
                    Quran, Dua, aur Sadqa track karen
                  </p>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                  {persons.map((p) => (
                    <PersonCard
                      key={p.id}
                      person={p}
                      logs={allLogs[p.id] || []}
                      onLog={setLogTarget}
                      onSelect={handleSelectPerson}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </main>

        {showAddModal && (
          <AddPersonModal
            onAdd={handleAddPerson}
            onClose={() => setShowAddModal(false)}
          />
        )}
        {logTarget && (
          <LogActivityModal
            person={logTarget}
            onLog={handleLog}
            onClose={() => setLogTarget(null)}
          />
        )}
      </div>
    </>
  );
}