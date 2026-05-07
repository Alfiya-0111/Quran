import { useState, useEffect } from "react";

const COLORS = {
  bg: "#0c1118",
  surface: "#111827",
  card: "#1a2332",
  gold: "#C9A84C",
  goldLight: "#e8c97a",
  goldDim: "#8a6f30",
  text: "#e8e0d0",
  textDim: "#8a9ab0",
  green: "#2d6a4f",
  greenLight: "#52b788",
};

const ACTIVITY_TYPES = [
  { id: "quran", label: "Quran Padhna", icon: "📖", unit: "pages", color: "#C9A84C" },
  { id: "dua", label: "Dua Karna", icon: "🤲", unit: "duas", color: "#52b788" },
  { id: "sadqa", label: "Sadqa Dena", icon: "💛", unit: "times", color: "#e07b54" },
];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function getStorageKey(personId) {
  return `sadqa_logs_${personId}`;
}

function loadPersons() {
  try {
    return JSON.parse(localStorage.getItem("sadqa_persons") || "[]");
  } catch {
    return [];
  }
}

function savePersons(persons) {
  localStorage.setItem("sadqa_persons", JSON.stringify(persons));
}

function loadLogs(personId) {
  try {
    return JSON.parse(localStorage.getItem(getStorageKey(personId)) || "[]");
  } catch {
    return [];
  }
}

function saveLogs(personId, logs) {
  localStorage.setItem(getStorageKey(personId), JSON.stringify(logs));
}

// ─── Add Person Modal ───────────────────────────────────────────────
function AddPersonModal({ onAdd, onClose }) {
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");

  const relations = ["Abbu", "Ammi", "Dada", "Dadi", "Nana", "Nani", "Bhai", "Behen", "Dost", "Ustad", "Aur koi"];

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 100, padding: "20px"
    }}>
      <div style={{
        background: COLORS.card, borderRadius: "20px",
        border: `1px solid ${COLORS.goldDim}`,
        padding: "32px", width: "100%", maxWidth: "420px",
        boxShadow: `0 0 40px rgba(201,168,76,0.15)`
      }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "36px", marginBottom: "8px" }}>🕊️</div>
          <h2 style={{ color: COLORS.gold, fontSize: "20px", fontFamily: "Georgia, serif", margin: 0 }}>
            Naya Naam Add Karen
          </h2>
          <p style={{ color: COLORS.textDim, fontSize: "13px", marginTop: "6px" }}>
            Jinke liye amal karna chahte hain
          </p>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ color: COLORS.textDim, fontSize: "12px", display: "block", marginBottom: "6px" }}>
            NAAM *
          </label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Abbu ka naam likhen..."
            style={{
              width: "100%", background: COLORS.surface, border: `1px solid ${COLORS.goldDim}`,
              borderRadius: "10px", padding: "12px 14px", color: COLORS.text,
              fontSize: "15px", outline: "none", boxSizing: "border-box",
              fontFamily: "Georgia, serif"
            }}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ color: COLORS.textDim, fontSize: "12px", display: "block", marginBottom: "8px" }}>
            RISHTA
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {relations.map(r => (
              <button
                key={r}
                onClick={() => setRelation(r)}
                style={{
                  padding: "6px 14px", borderRadius: "20px", fontSize: "13px",
                  border: `1px solid ${relation === r ? COLORS.gold : COLORS.goldDim}`,
                  background: relation === r ? `${COLORS.gold}22` : "transparent",
                  color: relation === r ? COLORS.gold : COLORS.textDim,
                  cursor: "pointer"
                }}
              >{r}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "12px", borderRadius: "12px",
              border: `1px solid ${COLORS.goldDim}`, background: "transparent",
              color: COLORS.textDim, cursor: "pointer", fontSize: "14px"
            }}
          >Wapas</button>
          <button
            onClick={() => {
              if (name.trim()) {
                onAdd({ id: generateId(), name: name.trim(), relation, createdAt: getToday() });
                onClose();
              }
            }}
            disabled={!name.trim()}
            style={{
              flex: 2, padding: "12px", borderRadius: "12px",
              border: "none", background: name.trim() ? COLORS.gold : COLORS.goldDim,
              color: "#0c1118", cursor: name.trim() ? "pointer" : "not-allowed",
              fontSize: "14px", fontWeight: "700"
            }}
          >Add Karen ✨</button>
        </div>
      </div>
    </div>
  );
}

// ─── Log Activity Modal ─────────────────────────────────────────────
function LogActivityModal({ person, onLog, onClose }) {
  const [type, setType] = useState("quran");
  const [count, setCount] = useState(1);
  const [note, setNote] = useState("");

  const selected = ACTIVITY_TYPES.find(a => a.id === type);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 100, padding: "20px"
    }}>
      <div style={{
        background: COLORS.card, borderRadius: "20px",
        border: `1px solid ${COLORS.goldDim}`,
        padding: "32px", width: "100%", maxWidth: "420px",
        boxShadow: `0 0 40px rgba(201,168,76,0.15)`
      }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "14px", color: COLORS.textDim, marginBottom: "4px" }}>
            Ke liye amal karna hai
          </div>
          <div style={{ fontSize: "22px", color: COLORS.gold, fontFamily: "Georgia, serif", fontWeight: "bold" }}>
            {person.name}
          </div>
          <div style={{ fontSize: "12px", color: COLORS.goldDim }}>{person.relation}</div>
        </div>

        {/* Type Select */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          {ACTIVITY_TYPES.map(a => (
            <button
              key={a.id}
              onClick={() => setType(a.id)}
              style={{
                flex: 1, padding: "12px 6px", borderRadius: "12px", textAlign: "center",
                border: `1px solid ${type === a.id ? a.color : COLORS.goldDim}`,
                background: type === a.id ? `${a.color}22` : "transparent",
                cursor: "pointer"
              }}
            >
              <div style={{ fontSize: "22px" }}>{a.icon}</div>
              <div style={{ fontSize: "11px", color: type === a.id ? a.color : COLORS.textDim, marginTop: "4px" }}>
                {a.label}
              </div>
            </button>
          ))}
        </div>

        {/* Count */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ color: COLORS.textDim, fontSize: "12px", display: "block", marginBottom: "8px" }}>
            KITNA? ({selected?.unit})
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => setCount(c => Math.max(1, c - 1))}
              style={{
                width: "44px", height: "44px", borderRadius: "50%",
                border: `1px solid ${COLORS.goldDim}`, background: "transparent",
                color: COLORS.gold, fontSize: "22px", cursor: "pointer"
              }}
            >−</button>
            <div style={{
              flex: 1, textAlign: "center", fontSize: "32px",
              color: COLORS.gold, fontFamily: "Georgia, serif", fontWeight: "bold"
            }}>{count}</div>
            <button
              onClick={() => setCount(c => c + 1)}
              style={{
                width: "44px", height: "44px", borderRadius: "50%",
                border: `1px solid ${COLORS.goldDim}`, background: "transparent",
                color: COLORS.gold, fontSize: "22px", cursor: "pointer"
              }}
            >+</button>
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "10px", justifyContent: "center" }}>
            {[1, 5, 10, 20].map(n => (
              <button key={n} onClick={() => setCount(n)} style={{
                padding: "4px 12px", borderRadius: "20px", fontSize: "12px",
                border: `1px solid ${count === n ? COLORS.gold : COLORS.goldDim}`,
                background: count === n ? `${COLORS.gold}22` : "transparent",
                color: count === n ? COLORS.gold : COLORS.textDim, cursor: "pointer"
              }}>{n}</button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div style={{ marginBottom: "24px" }}>
          <input
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Koi note... (optional)"
            style={{
              width: "100%", background: COLORS.surface, border: `1px solid ${COLORS.goldDim}`,
              borderRadius: "10px", padding: "10px 14px", color: COLORS.text,
              fontSize: "14px", outline: "none", boxSizing: "border-box"
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "12px", borderRadius: "12px",
            border: `1px solid ${COLORS.goldDim}`, background: "transparent",
            color: COLORS.textDim, cursor: "pointer", fontSize: "14px"
          }}>Wapas</button>
          <button
            onClick={() => {
              onLog({ id: generateId(), type, count, note, date: getToday(), personId: person.id });
              onClose();
            }}
            style={{
              flex: 2, padding: "12px", borderRadius: "12px",
              border: "none", background: COLORS.gold,
              color: "#0c1118", cursor: "pointer", fontSize: "14px", fontWeight: "700"
            }}
          >Log Karen 🤲</button>
        </div>
      </div>
    </div>
  );
}

// ─── Person Card ────────────────────────────────────────────────────
function PersonCard({ person, onLog, onSelect, isSelected }) {
  const logs = loadLogs(person.id);
  const today = getToday();
  const todayLogs = logs.filter(l => l.date === today);

  const totals = ACTIVITY_TYPES.reduce((acc, a) => {
    acc[a.id] = logs.filter(l => l.type === a.id).reduce((s, l) => s + l.count, 0);
    return acc;
  }, {});

  const todayDone = todayLogs.length > 0;

  return (
    <div
      onClick={() => onSelect(person)}
      style={{
        background: isSelected ? `${COLORS.gold}11` : COLORS.card,
        border: `1px solid ${isSelected ? COLORS.gold : COLORS.goldDim}`,
        borderRadius: "16px", padding: "20px", cursor: "pointer",
        transition: "all 0.2s",
        boxShadow: isSelected ? `0 0 20px rgba(201,168,76,0.2)` : "none"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "20px" }}>🕊️</span>
            <span style={{ color: COLORS.gold, fontSize: "17px", fontFamily: "Georgia, serif", fontWeight: "bold" }}>
              {person.name}
            </span>
          </div>
          {person.relation && (
            <div style={{ color: COLORS.textDim, fontSize: "12px", marginTop: "2px", paddingLeft: "28px" }}>
              {person.relation}
            </div>
          )}
        </div>
        {todayDone && (
          <div style={{
            background: `${COLORS.greenLight}22`, border: `1px solid ${COLORS.greenLight}`,
            borderRadius: "20px", padding: "3px 10px", fontSize: "11px", color: COLORS.greenLight
          }}>✓ Aaj</div>
        )}
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
        {ACTIVITY_TYPES.map(a => (
          <div key={a.id} style={{
            flex: 1, background: COLORS.surface, borderRadius: "10px",
            padding: "10px 8px", textAlign: "center"
          }}>
            <div style={{ fontSize: "18px" }}>{a.icon}</div>
            <div style={{ color: a.color, fontSize: "18px", fontWeight: "bold", marginTop: "4px" }}>
              {totals[a.id]}
            </div>
            <div style={{ color: COLORS.textDim, fontSize: "10px" }}>{a.unit}</div>
          </div>
        ))}
      </div>

      <button
        onClick={e => { e.stopPropagation(); onLog(person); }}
        style={{
          width: "100%", marginTop: "14px", padding: "10px",
          borderRadius: "10px", border: `1px solid ${COLORS.gold}`,
          background: "transparent", color: COLORS.gold,
          cursor: "pointer", fontSize: "13px", fontWeight: "600"
        }}
      >+ Aaj Ka Amal Log Karen</button>
    </div>
  );
}

// ─── Detail View ────────────────────────────────────────────────────
function PersonDetail({ person, onLogNew }) {
  const logs = loadLogs(person.id);
  const today = getToday();

  // Last 7 days
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const dayLogs = logs.filter(l => l.date === dateStr);
    const total = dayLogs.reduce((s, l) => s + l.count, 0);
    return { date: dateStr, total, label: d.toLocaleDateString("ur-PK", { weekday: "short" }) };
  });

  const maxVal = Math.max(...last7.map(d => d.total), 1);

  const allTotals = ACTIVITY_TYPES.reduce((acc, a) => {
    acc[a.id] = logs.filter(l => l.type === a.id).reduce((s, l) => s + l.count, 0);
    return acc;
  }, {});

  const recentLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10);
  const streak = (() => {
    let s = 0;
    const d = new Date();
    while (true) {
      const ds = d.toISOString().split("T")[0];
      if (logs.some(l => l.date === ds)) { s++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return s;
  })();

  return (
    <div>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.card}, #1e2d40)`,
        border: `1px solid ${COLORS.goldDim}`, borderRadius: "16px",
        padding: "24px", marginBottom: "16px", textAlign: "center"
      }}>
        <div style={{ fontSize: "32px", marginBottom: "8px" }}>🕊️</div>
        <div style={{ color: COLORS.gold, fontSize: "22px", fontFamily: "Georgia, serif", fontWeight: "bold" }}>
          {person.name}
        </div>
        {person.relation && <div style={{ color: COLORS.textDim, fontSize: "13px", marginTop: "4px" }}>{person.relation}</div>}

        <div style={{
          display: "inline-block", marginTop: "12px",
          background: `${COLORS.gold}22`, border: `1px solid ${COLORS.goldDim}`,
          borderRadius: "20px", padding: "6px 16px",
          color: COLORS.gold, fontSize: "13px"
        }}>
          🔥 {streak} din ka silsila
        </div>

        <div style={{
          fontStyle: "italic", color: COLORS.textDim, fontSize: "12px",
          marginTop: "12px", lineHeight: "1.6"
        }}>
          "Jab insaan mar jaata hai toh uske amal ka silsila toot jaata hai, siwaye teen ke..."<br/>
          <span style={{ color: COLORS.goldDim }}>— Sahih Muslim</span>
        </div>
      </div>

      {/* Totals */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
        {ACTIVITY_TYPES.map(a => (
          <div key={a.id} style={{
            flex: 1, background: COLORS.card, border: `1px solid ${COLORS.goldDim}`,
            borderRadius: "14px", padding: "16px", textAlign: "center"
          }}>
            <div style={{ fontSize: "24px" }}>{a.icon}</div>
            <div style={{ color: a.color, fontSize: "24px", fontWeight: "bold", fontFamily: "Georgia, serif" }}>
              {allTotals[a.id]}
            </div>
            <div style={{ color: COLORS.textDim, fontSize: "11px", marginTop: "2px" }}>kul {a.unit}</div>
          </div>
        ))}
      </div>

      {/* 7 Day Chart */}
      <div style={{
        background: COLORS.card, border: `1px solid ${COLORS.goldDim}`,
        borderRadius: "16px", padding: "20px", marginBottom: "16px"
      }}>
        <div style={{ color: COLORS.gold, fontSize: "13px", marginBottom: "16px", fontWeight: "600" }}>
          📊 Pichhle 7 Din
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "80px" }}>
          {last7.map((d, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <div style={{ fontSize: "11px", color: COLORS.textDim }}>{d.total || ""}</div>
              <div style={{
                width: "100%", background: d.date === today ? COLORS.gold : `${COLORS.gold}55`,
                borderRadius: "6px 6px 0 0",
                height: `${Math.max(4, (d.total / maxVal) * 60)}px`,
                transition: "height 0.3s"
              }} />
              <div style={{ fontSize: "10px", color: COLORS.textDim }}>{d.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Button */}
      <button
        onClick={() => onLogNew(person)}
        style={{
          width: "100%", padding: "16px", borderRadius: "14px",
          border: "none", background: COLORS.gold,
          color: "#0c1118", cursor: "pointer", fontSize: "15px",
          fontWeight: "700", marginBottom: "16px"
        }}
      >🤲 Aaj Ka Amal Log Karen</button>

      {/* Recent Logs */}
      {recentLogs.length > 0 && (
        <div style={{
          background: COLORS.card, border: `1px solid ${COLORS.goldDim}`,
          borderRadius: "16px", padding: "20px"
        }}>
          <div style={{ color: COLORS.gold, fontSize: "13px", marginBottom: "14px", fontWeight: "600" }}>
            📋 Haal Ka Amal
          </div>
          {recentLogs.map(log => {
            const act = ACTIVITY_TYPES.find(a => a.id === log.type);
            return (
              <div key={log.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 0", borderBottom: `1px solid ${COLORS.surface}`
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "18px" }}>{act?.icon}</span>
                  <div>
                    <div style={{ color: COLORS.text, fontSize: "13px" }}>{act?.label}</div>
                    {log.note && <div style={{ color: COLORS.textDim, fontSize: "11px" }}>{log.note}</div>}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: act?.color, fontSize: "14px", fontWeight: "bold" }}>
                    {log.count} {act?.unit}
                  </div>
                  <div style={{ color: COLORS.textDim, fontSize: "10px" }}>{log.date}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────
export default function Sadqatracker() {
  const [persons, setPersons] = useState(loadPersons);
  const [showAddModal, setShowAddModal] = useState(false);
  const [logTarget, setLogTarget] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [, forceUpdate] = useState(0);

  const handleAddPerson = (person) => {
    const updated = [...persons, person];
    setPersons(updated);
    savePersons(updated);
  };

  const handleLog = (logEntry) => {
    const existing = loadLogs(logEntry.personId);
    saveLogs(logEntry.personId, [...existing, logEntry]);
    forceUpdate(n => n + 1);
  };

  return (
    <div style={{
      minHeight: "100vh", background: COLORS.bg, color: COLORS.text,
      fontFamily: "system-ui, sans-serif", paddingBottom: "80px"
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(180deg, #0f1822 0%, ${COLORS.bg} 100%)`,
        borderBottom: `1px solid ${COLORS.goldDim}`,
        padding: "24px 20px 20px"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "28px" }}>🕊️</div>
          <h1 style={{
            color: COLORS.gold, fontSize: "22px", fontFamily: "Georgia, serif",
            margin: "8px 0 4px", fontWeight: "bold"
          }}>Sadqa-e-Jariya</h1>
          <p style={{ color: COLORS.textDim, fontSize: "13px", margin: 0 }}>
            Apne azizoon ke liye amal ka silsila
          </p>
        </div>
      </div>

      <div style={{ padding: "20px", maxWidth: "480px", margin: "0 auto" }}>

        {/* View Toggle */}
        {selectedPerson ? (
          <>
            <button
              onClick={() => setSelectedPerson(null)}
              style={{
                background: "transparent", border: `1px solid ${COLORS.goldDim}`,
                color: COLORS.textDim, borderRadius: "10px", padding: "8px 14px",
                cursor: "pointer", fontSize: "13px", marginBottom: "16px"
              }}
            >← Wapas</button>
            <PersonDetail
              person={selectedPerson}
              onLogNew={(p) => setLogTarget(p)}
            />
          </>
        ) : (
          <>
            {/* Add Button */}
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                width: "100%", padding: "16px", borderRadius: "14px",
                border: `2px dashed ${COLORS.goldDim}`, background: "transparent",
                color: COLORS.gold, cursor: "pointer", fontSize: "15px",
                marginBottom: "20px", display: "flex", alignItems: "center",
                justifyContent: "center", gap: "8px"
              }}
            >
              <span style={{ fontSize: "20px" }}>+</span>
              Naya Naam Add Karen
            </button>

            {/* Person Cards */}
            {persons.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "60px 20px",
                color: COLORS.textDim
              }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🕊️</div>
                <div style={{ fontSize: "16px", color: COLORS.gold, fontFamily: "Georgia, serif" }}>
                  Pehla naam add karen
                </div>
                <div style={{ fontSize: "13px", marginTop: "8px", lineHeight: "1.6" }}>
                  Apne Abbu, Ammi, ya kisi bhi aziz ke liye<br/>
                  Quran, Dua, aur Sadqa track karen
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {persons.map(p => (
                  <PersonCard
                    key={p.id}
                    person={p}
                    onLog={setLogTarget}
                    onSelect={setSelectedPerson}
                    isSelected={false}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
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
  );
}