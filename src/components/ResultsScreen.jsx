import React, { memo } from "react";

// ─── Palette ──────────────────────────────────────────────────────────
const C = {
  bg: "#0a0f1a",
  card: "#111827",
  text: "#f0ece0",
  dim: "#8a9ab0",
  green: "#4ade80",
  orange: "#fb923c",
  gold: "#C9A84C",
};

// ─── Confetti Component ─────────────────────────────────────────────
function Confetti() {
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    duration: 1.5 + Math.random() * 1,
    color: [C.gold, C.green, "#60a5fa", "#c084fc", "#f472b6", C.orange][Math.floor(Math.random() * 6)],
    size: 4 + Math.random() * 6,
  }));

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 100, overflow: "hidden" }} aria-hidden="true">
      {pieces.map(p => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: "-20px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animation: `confettiFall ${p.duration}s ease-out ${p.delay}s forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Progress Ring ────────────────────────────────────────────────────
function ProgressRing({ progress, size = 80, stroke = 6, color = C.gold }) {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div style={{ position: "relative", width: size, height: size }} role="img" aria-label={`${Math.round(progress)}% complete`}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "18px", fontWeight: "800", color,
      }}>
        {Math.round(progress)}%
      </div>
    </div>
  );
}

// ─── Share Utilities ──────────────────────────────────────────────────
const shareResults = async (score, totalPossible, percentage, categoryName, correctCount, totalQuestions) => {
  const message = `🧠 *Islamic Quiz Results* 🧠\n\n` +
    `📚 Category: *${categoryName}*\n` +
    `⭐ Score: *${score} / ${totalPossible}*\n` +
    `📊 Percentage: *${percentage}%*\n` +
    `✅ Correct: *${correctCount} / ${totalQuestions}*\n\n` +
    `Test your Islamic knowledge too! 🌙`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Islamic Quiz Results',
        text: message.replace(/\*/g, ''),
        url: window.location.href,
      });
      return;
    } catch (err) { /* user cancelled */ }
  }
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
};

const shareToWhatsApp = (score, totalPossible, percentage, categoryName, correctCount, totalQuestions) => {
  const message = `🧠 *Islamic Quiz Results* 🧠%0A%0A` +
    `📚 Category: *${categoryName}*%0A` +
    `⭐ Score: *${score} / ${totalPossible}*%0A` +
    `📊 Percentage: *${percentage}%*%0A` +
    `✅ Correct: *${correctCount} / ${totalQuestions}*%0A%0A` +
    `Test your Islamic knowledge too! 🌙`;
  window.open(`https://wa.me/?text=${message}`, '_blank');
};

const copyResults = (score, totalPossible, percentage, categoryName, correctCount, totalQuestions) => {
  const text = `🧠 Islamic Quiz Results 🧠\n\n` +
    `📚 Category: ${categoryName}\n` +
    `⭐ Score: ${score} / ${totalPossible}\n` +
    `📊 Percentage: ${percentage}%\n` +
    `✅ Correct: ${correctCount} / ${totalQuestions}\n\n` +
    `Test your Islamic knowledge too! 🌙`;
  navigator.clipboard.writeText(text).then(() => {
    alert('Results copied to clipboard! 📋');
  });
};

// ─── ResultsScreen Component ──────────────────────────────────────────
const ResultsScreen = memo(function ResultsScreen({ score, totalPossible, answers, bestStreak, category, onBack, onRetry }) {
  const percentage = Math.round((score / totalPossible) * 100);
  const correctCount = answers.filter(a => a.correct).length;
  const isPerfect = percentage === 100;
  const isGood = percentage >= 70;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "system-ui, sans-serif" }}>
      {isPerfect && <Confetti />}

      <div style={{
        background: "linear-gradient(180deg, #111820, #0a0f1a)",
        borderBottom: "1px solid rgba(201,168,76,0.1)", padding: "40px 20px",
        textAlign: "center",
      }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }} aria-hidden="true">
          {isPerfect ? "🏆" : isGood ? "🌟" : "💪"}
        </div>
        <h1 style={{ fontSize: "24px", fontWeight: "800", margin: "0 0 8px" }}>
          {isPerfect ? "MashaAllah! Perfect Score!" : isGood ? "Bahut Achha!" : "Practice Karein!"}
        </h1>
        <p style={{ color: C.dim, fontSize: "14px", margin: "0 0 20px" }}>
          {category.name} — Quiz Complete
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
          <ProgressRing progress={percentage} color={isPerfect ? C.gold : isGood ? C.green : C.orange} />
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", justifyContent: "center" }}>
            <div style={{ background: C.card, borderRadius: "12px", padding: "10px 16px", border: "1px solid #2a3a4a" }}>
              <div style={{ color: C.dim, fontSize: "11px" }}>Score</div>
              <div style={{ color: C.gold, fontSize: "18px", fontWeight: "800" }}>{score} / {totalPossible}</div>
            </div>
            <div style={{ background: C.card, borderRadius: "12px", padding: "10px 16px", border: "1px solid #2a3a4a" }}>
              <div style={{ color: C.dim, fontSize: "11px" }}>Correct</div>
              <div style={{ color: C.green, fontSize: "18px", fontWeight: "800" }}>{correctCount} / {answers.length}</div>
            </div>
            {bestStreak >= 2 && (
              <div style={{ background: C.card, borderRadius: "12px", padding: "10px 16px", border: "1px solid #2a3a4a" }}>
                <div style={{ color: C.dim, fontSize: "11px" }}>Best Streak</div>
                <div style={{ color: C.orange, fontSize: "18px", fontWeight: "800" }}>🔥 {bestStreak}x</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Answers */}
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "24px 20px 40px" }}>
        <h2 style={{ color: C.dim, fontSize: "12px", letterSpacing: "2px", marginBottom: "16px", textTransform: "uppercase", fontWeight: "600" }}>
          Review Answers
        </h2>

        {answers.map((a, i) => (
          <div
            key={i}
            style={{
              background: C.card, borderRadius: "14px", padding: "16px", marginBottom: "10px",
              border: `1px solid ${a.correct ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)"}`,
              animation: `fadeUp 0.3s ease ${i * 0.05}s both`,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <span style={{ fontSize: "18px", flexShrink: 0, marginTop: "2px" }} aria-hidden="true">
                {a.correct ? "✅" : "❌"}
              </span>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px", lineHeight: "1.5" }}>
                  {i + 1}. {a.question}
                </h3>
                <p style={{ color: C.dim, fontSize: "12px", lineHeight: "1.6" }}>
                  💡 {a.fact}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Share on Results */}
        <div style={{ marginTop: "20px", marginBottom: "24px" }}>
          <p style={{ color: C.dim, fontSize: "12px", textAlign: "center", marginBottom: "12px" }}>
            Share your achievement! 🎉
          </p>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => shareToWhatsApp(score, totalPossible, percentage, category.name, correctCount, answers.length)}
              style={{ padding: "10px 16px", borderRadius: "12px", border: "none", background: "#25D366", color: "white", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}
            >
              📱 WhatsApp
            </button>
            <button onClick={() => shareResults(score, totalPossible, percentage, category.name, correctCount, answers.length)}
              style={{ padding: "10px 16px", borderRadius: "12px", border: "1px solid rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.1)", color: "#C9A84C", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}
            >
              🔗 Share
            </button>
            <button onClick={() => copyResults(score, totalPossible, percentage, category.name, correctCount, answers.length)}
              style={{ padding: "10px 16px", borderRadius: "12px", border: "1px solid #2a3a4a", background: "#111827", color: "#8a9ab0", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}
            >
              📋 Copy
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onBack}
            style={{
              flex: 1, padding: "14px", borderRadius: "14px", border: "1px solid #2a3a4a",
              background: "transparent", color: C.dim, fontSize: "14px", fontWeight: "700",
              cursor: "pointer", transition: "all 0.2s",
            }}
          >
            ← Categories
          </button>
          <button
            onClick={onRetry}
            style={{
              flex: 1, padding: "14px", borderRadius: "14px", border: "none",
              background: `linear-gradient(135deg, ${category.color}, ${category.color}bb)`,
              color: "#0a0f1a", fontSize: "14px", fontWeight: "800", cursor: "pointer",
              boxShadow: `0 4px 20px ${category.color}44`, transition: "all 0.2s",
            }}
          >
            🔄 Dobara Khelein
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
});

export default ResultsScreen;