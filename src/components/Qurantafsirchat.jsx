import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { FiMic, FiMicOff, FiSend } from "react-icons/fi";

// ✅ Module level — component ke bahar, ek baar define
const SUGGESTED_QUESTIONS = [
  "Surah Al-Fatihah ka khulasa batao",
  "Sabr ke baare mein Quran kya kehta hai?",
  "Rizq aur tawakkul ke baare mein ayaat batao",
  "Maut ke baad kya hoga? Quran ki roshni mein",
  "Aurat ke huqooq Quran mein",
  "Surah Yaseen kyun padhte hain?",
  "Quran mein sabse bari ayah kaunsi hai?",
  "Duniya ki mohabbat ke baare mein Quran kya kehta hai?",
];

const SYSTEM_PROMPT = `You are a knowledgeable, warm, and approachable Islamic scholar who specializes in Quran tafsir (exegesis). You help Muslims understand the Quran deeply.

Your style:
- Respond in Hinglish (Hindi-English mix) — like a friendly aalim talking to a young Muslim
- Always cite specific ayahs when relevant (Surah name + ayah number)
- Include Arabic text of key ayahs when quoting
- Give practical, relatable explanations connected to everyday life
- Be warm, encouraging, and spiritually uplifting
- Keep responses concise but meaningful — not too long
- If asked about controversial topics, give balanced scholarly perspectives
- Always remind that for personal religious decisions, they should consult a local scholar

Format your responses naturally — no markdown headers, just flowing conversation with Arabic text where needed.`;

const INITIAL_MESSAGE = {
  id: "init-0",
  role: "assistant",
  content:
    "Assalamu Alaikum wa Rahmatullahi wa Barakatuh! 🌙\n\nMain aapka Quran companion hoon. Aap mujhse kuch bhi pooch sakte hain — kisi ayah ka matlab, kisi surah ki tafsir, ya zindagi ke kisi masle mein Quran ki roshni. Kya sawaal hai aapka?",
};

// ✅ Arabic detection — module level, pure function
function isArabicLine(line) {
  if (!line.trim()) return false;
  const arabicChars = (line.match(/[\u0600-\u06FF]/g) || []).length;
  return arabicChars / line.length > 0.4;
}

// ✅ ID generator — unique message IDs
let msgCounter = 1;
function newId() {
  return `msg-${Date.now()}-${msgCounter++}`;
}

export default function QuranTafsirChat() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // ✅ Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ✅ Auto-resize textarea
  const resizeTextarea = useCallback((el) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, []);

  useEffect(() => {
    resizeTextarea(inputRef.current);
  }, [input, resizeTextarea]);

  // ✅ useCallback — formatMessage re-create na ho
  const formatMessage = useCallback((text) => {
    return text.split("\n").map((line, i) => {
      if (isArabicLine(line)) {
        return (
          <div
            key={i}
            lang="ar"
            dir="rtl"
            style={{
              fontFamily: "'Amiri', serif",
              fontSize: "22px",
              textAlign: "right",
              color: "#C9A84C",
              lineHeight: "2.2",
              margin: "8px 0",
              padding: "8px 12px",
              background: "rgba(201,168,76,0.06)",
              borderRight: "3px solid rgba(201,168,76,0.3)",
              borderRadius: "0 8px 8px 0",
            }}
          >
            {line}
          </div>
        );
      }
      return (
        <div key={i} style={{ marginBottom: line.trim() ? "4px" : "8px" }}>
          {line}
        </div>
      );
    });
  }, []);

  // ✅ useCallback — voice toggle
  const toggleVoice = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Aapka browser voice input support nahi karta");
      return;
    }
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "ur-PK";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;
    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.onresult = (e) => {
      let transcript = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }
      setInput(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => {
      setIsListening(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    };
    recognition.start();
  }, [isListening]);

  // ✅ useCallback — sendMessage
  const sendMessage = useCallback(
    async (text) => {
      const messageText = (text || input).trim();
      if (!messageText || loading) return;

      setInput("");
      setShowSuggestions(false);

      const userMsg = { id: newId(), role: "user", content: messageText };

      // ✅ Functional update — stale closure se bachao
      setMessages((prev) => {
        const newMessages = [...prev, userMsg];

        // API call inside functional update to capture latest messages
        const apiMessages = newMessages
          .filter((_, i) => i > 0)
          .map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
          }));

        (async () => {
          try {
            const response = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-goog-api-key": import.meta.env.VITE_GEMINI_API_KEY,
                },
                body: JSON.stringify({
                  systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
                  contents: apiMessages,
                }),
              }
            );

            if (!response.ok) {
              const errData = await response.json().catch(() => ({}));
              const errMsg = errData.error?.message || "";
              if (
                response.status === 429 ||
                errMsg.includes("quota") ||
                errMsg.includes("429")
              ) {
                throw new Error("QUOTA_EXCEEDED");
              }
              throw new Error(errMsg || `HTTP ${response.status}`);
            }

            const data = await response.json();
            const reply =
              data.candidates?.[0]?.content?.parts?.[0]?.text ||
              "Maafi chahta hoon, jawab nahi mil saka.";

            setMessages((prev) => [
              ...prev,
              { id: newId(), role: "assistant", content: reply },
            ]);
          } catch (e) {
            const errorMsg =
              e.message === "QUOTA_EXCEEDED" ||
              e.message?.includes("429") ||
              e.message?.includes("quota")
                ? "⚠️ Aapka free quota khatam ho gaya hai.\n\nKripya thodi der (1-2 minute) wait karein aur dobara try karein.\n\nJazakAllah Khair! 🙏"
                : "Kuch technical masla aa gaya. Dobara koshish karein.";
            setMessages((prev) => [
              ...prev,
              { id: newId(), role: "assistant", content: errorMsg },
            ]);
          } finally {
            setLoading(false);
            setTimeout(() => inputRef.current?.focus(), 100);
          }
        })();

        return newMessages;
      });

      setLoading(true);
    },
    [input, loading]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  // ✅ useMemo — send button disabled state
  const canSend = useMemo(
    () => input.trim().length > 0 && !loading,
    [input, loading]
  );

  return (
    <>
      {/* ✅ SEO Helmet */}
      <Helmet>
        <html lang="ur" />
        <title>Quran Tafsir Chat — AI Islamic Scholar | Noor Al-Quran</title>
        <meta
          name="description"
          content="Quran ki ayaat ka matlab, tafsir, aur Islamic guidance — AI scholar se Hinglish mein. Koi bhi sawaal karein, 24/7 available."
        />
        <meta
          name="keywords"
          content="Quran tafsir chat, Islamic AI, Quran in Urdu Hindi, ayaat ka matlab, Islamic scholar online, Noor Al-Quran"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://soulayah.com/tafsir" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Quran Tafsir Chat — AI Islamic Scholar" />
        <meta
          property="og:description"
          content="Quran ki ayaat ka matlab AI scholar se poochein — Hinglish mein, 24/7."
        />
        <meta property="og:url" content="https://soulayah.com/tafsir" />
        <meta property="og:locale" content="ur_PK" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Quran Tafsir Chat — Noor Al-Quran" />
        <meta
          name="twitter:description"
          content="AI Islamic scholar se Quran ki tafsir Hinglish mein poochein."
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Amiri:ital@0;1&display=swap"
        />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Quran Tafsir Chat",
            description:
              "AI-powered Quran tafsir aur Islamic guidance in Hinglish",
            url: "https://soulayah.com/tafsir",
            applicationCategory: "ReligiousApplication",
            inLanguage: ["ur", "hi", "en", "ar"],
            isAccessibleForFree: true,
            offers: { "@type": "Offer", price: "0" },
          })}
        </script>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:ital@0;1&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080e14; }
        ::-webkit-scrollbar-thumb { background: #1e2830; border-radius: 4px; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes micPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.5); }
          50% { box-shadow: 0 0 0 7px rgba(201,168,76,0); }
        }
        .msg-in { animation: fadeIn 0.3s ease forwards; }
        .suggestion-btn { transition: all 0.2s; }
        .suggestion-btn:hover { background: rgba(201,168,76,0.12) !important; border-color: rgba(201,168,76,0.4) !important; color: #C9A84C !important; }
        .mic-btn { transition: all 0.2s; }
        .mic-btn:hover { opacity: 0.85; }
        .mic-listening { animation: micPulse 1s ease-in-out infinite !important; }
        .send-btn { transition: all 0.2s; }
        .send-btn:hover:not(:disabled) { opacity: 0.85; transform: scale(1.05); }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#080e14",
          color: "#e2d9c8",
          fontFamily: "'Georgia', serif",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ✅ Semantic header */}
        <header
          style={{
            background: "rgba(8,14,20,0.97)",
            borderBottom: "1px solid rgba(201,168,76,0.12)",
            padding: "16px 20px",
            backdropFilter: "blur(20px)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              maxWidth: "700px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: "42px", height: "42px",
                background: "linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.05))",
                border: "1px solid rgba(201,168,76,0.3)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px", flexShrink: 0,
              }}
            >
              📖
            </div>
            <div>
              <h1 style={{ fontSize: "16px", fontWeight: "400", margin: 0 }}>
                Quran Tafsir Chat
              </h1>
              <p style={{ fontSize: "11px", color: "#4a7c59", letterSpacing: "1px", margin: 0 }}>
                ● AI Scholar — Hamesha Available
              </p>
            </div>
          </div>
        </header>

        {/* ✅ role="log" — screen readers ke liye live chat region */}
        <main
          role="log"
          aria-label="Quran Tafsir Chat messages"
          aria-live="polite"
          style={{
            flex: 1, overflowY: "auto", padding: "20px 16px",
            maxWidth: "700px", width: "100%", margin: "0 auto",
            boxSizing: "border-box",
          }}
        >
          {messages.map((msg) => (
            <article
              key={msg.id}
              className="msg-in"
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                marginBottom: "16px",
                gap: "10px",
                alignItems: "flex-start",
              }}
            >
              {msg.role === "assistant" && (
                <div
                  aria-hidden="true"
                  style={{
                    width: "32px", height: "32px", flexShrink: 0,
                    background: "rgba(201,168,76,0.1)",
                    border: "1px solid rgba(201,168,76,0.2)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "14px", marginTop: "2px",
                  }}
                >
                  ☪
                </div>
              )}
              <div
                style={{
                  maxWidth: "85%",
                  background: msg.role === "user" ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${msg.role === "user" ? "rgba(201,168,76,0.25)" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: msg.role === "user" ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                  padding: "14px 18px", fontSize: "14px", lineHeight: "1.8",
                  color: msg.role === "user" ? "#e8dcc8" : "#c8bfb0",
                }}
              >
                {msg.role === "assistant" ? formatMessage(msg.content) : msg.content}
              </div>
              {msg.role === "user" && (
                <div
                  aria-hidden="true"
                  style={{
                    width: "32px", height: "32px", flexShrink: 0,
                    background: "rgba(201,168,76,0.15)",
                    border: "1px solid rgba(201,168,76,0.3)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "14px", marginTop: "2px",
                  }}
                >
                  👤
                </div>
              )}
            </article>
          ))}

          {/* Loading dots */}
          {loading && (
            <div
              role="status"
              aria-label="Jawab aa raha hai..."
              style={{ display: "flex", gap: "10px", marginBottom: "16px", alignItems: "flex-start" }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: "32px", height: "32px", flexShrink: 0,
                  background: "rgba(201,168,76,0.1)",
                  border: "1px solid rgba(201,168,76,0.2)",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "14px",
                }}
              >
                ☪
              </div>
              <div style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "4px 18px 18px 18px",
                padding: "16px 20px",
                display: "flex", gap: "6px", alignItems: "center",
              }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    aria-hidden="true"
                    style={{
                      width: "6px", height: "6px",
                      background: "#C9A84C", borderRadius: "50%",
                      animation: `blink 1.2s ease ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Suggested questions */}
          {showSuggestions && messages.length === 1 && (
            <nav aria-label="Suggested questions">
              <p style={{
                fontSize: "11px", color: "#3a3028",
                letterSpacing: "1px", marginBottom: "12px", textAlign: "center",
              }}>
                — YA IN MEIN SE KOYI SAWAAL KAREIN —
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    className="suggestion-btn"
                    onClick={() => sendMessage(q)}
                    aria-label={`Poochein: ${q}`}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#6a5f52", borderRadius: "20px",
                      padding: "8px 14px", cursor: "pointer",
                      fontSize: "12px", letterSpacing: "0.3px",
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </nav>
          )}

          <div ref={messagesEndRef} />
        </main>

        {/* Input area */}
        <footer
          style={{
            background: "rgba(8,14,20,0.97)",
            borderTop: "1px solid rgba(201,168,76,0.1)",
            padding: "16px 20px",
            backdropFilter: "blur(20px)",
            flexShrink: 0,
          }}
        >
          <div
            style={{ maxWidth: "700px", margin: "0 auto", display: "flex", gap: "8px", alignItems: "flex-end" }}
            role="form"
            aria-label="Message input"
          >
            {/* Mic */}
            <button
              onClick={toggleVoice}
              className={`mic-btn${isListening ? " mic-listening" : ""}`}
              aria-label={isListening ? "Voice input band karo" : "Voice se sawaal karein (Urdu/Hindi)"}
              aria-pressed={isListening}
              style={{
                width: "48px", height: "48px", flexShrink: 0,
                background: isListening ? "rgba(201,168,76,0.18)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${isListening ? "rgba(201,168,76,0.5)" : "rgba(201,168,76,0.15)"}`,
                borderRadius: "14px",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                color: isListening ? "#C9A84C" : "#5a5040",
              }}
            >
              {isListening ? <FiMicOff size={18} aria-hidden="true" /> : <FiMic size={18} aria-hidden="true" />}
            </button>

            {/* Textarea */}
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onInput={(e) => resizeTextarea(e.target)}
              placeholder={
                isListening ? "🎙️ Sun raha hoon..." : "Koi bhi sawaal karein Quran ke baare mein..."
              }
              rows={1}
              aria-label="Apna sawaal yahan likhein"
              style={{
                flex: 1, boxSizing: "border-box",
                background: isListening ? "rgba(201,168,76,0.05)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${isListening ? "rgba(201,168,76,0.35)" : "rgba(201,168,76,0.2)"}`,
                borderRadius: "16px", padding: "14px 16px", color: "#e2d9c8",
                fontSize: "14px", outline: "none", resize: "none",
                lineHeight: "1.6", maxHeight: "120px", overflowY: "auto",
                fontFamily: "inherit", transition: "border-color 0.2s, background 0.2s",
              }}
            />

            {/* Send */}
            <button
              onClick={() => sendMessage()}
              disabled={!canSend}
              className="send-btn"
              aria-label="Sawaal bhejein"
              style={{
                background: canSend
                  ? "linear-gradient(135deg, #C9A84C, #a8863c)"
                  : "rgba(255,255,255,0.05)",
                border: "none", borderRadius: "14px",
                width: "48px", height: "48px",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: canSend ? "pointer" : "not-allowed",
                fontSize: "18px", flexShrink: 0,
              }}
            >
              {loading ? (
                <span aria-hidden="true">⟳</span>
              ) : (
                <FiSend size={18} aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Status */}
          <p
            aria-live="polite"
            style={{ textAlign: "center", marginTop: "10px", fontSize: "10px", letterSpacing: "0.5px", margin: "10px 0 0" }}
          >
            {isListening ? (
              <span style={{ color: "#C9A84C", opacity: 0.9 }}>
                🎙️ Bol rahe hain... (Urdu / Hindi) — dobara click karein band karne ke liye
              </span>
            ) : (
              <span style={{ color: "#2a2520" }}>
                Enter dabao ya button press karein • Shift+Enter naya line • 🎙️ voice ke liye mic dabaein
              </span>
            )}
          </p>
        </footer>
      </div>
    </>
  );
}