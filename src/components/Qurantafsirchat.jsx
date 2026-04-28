import { useState, useRef, useEffect } from "react";
import { FiMic, FiMicOff } from "react-icons/fi";

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

export default function Qurantafsirchat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Assalamu Alaikum wa Rahmatullahi wa Barakatuh! 🌙\n\nMain aapka Quran companion hoon. Aap mujhse kuch bhi pooch sakte hain — kisi ayah ka matlab, kisi surah ki tafsir, ya zindagi ke kisi masle mein Quran ki roshni. Kya sawaal hai aapka?",
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea when input changes (e.g. after voice fill)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  // ─── Voice Input ───
  const toggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Aapka browser voice input support nahi karta");
      return;
    }

    // Already listening → stop
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ur-PK";
    recognition.interimResults = true;   // Live transcript dikhao
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

    recognition.onerror = (e) => {
      console.error("Voice error:", e.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      // Focus textarea after voice
      setTimeout(() => inputRef.current?.focus(), 100);
    };

    recognition.start();
  };

  const sendMessage = async (text) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    setInput("");
    setShowSuggestions(false);

    const userMsg = { role: "user", content: messageText };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);

    const apiMessages = newMessages
      .filter((_, i) => i > 0)
      .map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    setLoading(true);
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
        if (response.status === 429 || errMsg.includes("quota") || errMsg.includes("429")) {
          throw new Error("QUOTA_EXCEEDED");
        }
        throw new Error(errMsg || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Maafi chahta hoon, jawab nahi mil saka.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      const errorMsg = e.message === "QUOTA_EXCEEDED" || e.message?.includes("429") || e.message?.includes("quota")
        ? "⚠️ Aapka free quota khatam ho gaya hai.\n\nKripya thodi der (1-2 minute) wait karein aur dobara try karein. Ya phir nayi API key bana lein Google AI Studio se.\n\nJazakAllah Khair! 🙏"
        : "Kuch technical masla aa gaya. Dobara koshish karein.";
      setMessages(prev => [...prev, { role: "assistant", content: errorMsg }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const formatMessage = (text) => {
    return text.split("\n").map((line, i) => {
      const arabicRatio = (line.match(/[\u0600-\u06FF]/g) || []).length / (line.length || 1);
      if (arabicRatio > 0.4 && line.trim()) {
        return (
          <div key={i} style={{
            fontFamily: "'Amiri', serif", fontSize: "22px",
            direction: "rtl", textAlign: "right", color: "#C9A84C",
            lineHeight: "2.2", margin: "8px 0", padding: "8px 12px",
            background: "rgba(201,168,76,0.06)",
            borderRight: "3px solid rgba(201,168,76,0.3)",
            borderRadius: "0 8px 8px 0",
          }}>
            {line}
          </div>
        );
      }
      return <div key={i} style={{ marginBottom: line.trim() ? "4px" : "8px" }}>{line}</div>;
    });
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#080e14", color: "#e2d9c8",
      fontFamily: "'Georgia', serif", display: "flex", flexDirection: "column",
    }}>
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
        .suggestion-btn:hover { background: rgba(201,168,76,0.12) !important; border-color: rgba(201,168,76,0.4) !important; color: #C9A84C !important; }
        .suggestion-btn { transition: all 0.2s; }
        .mic-btn { transition: all 0.2s; }
        .mic-btn:hover { opacity: 0.85; }
        .mic-listening { animation: micPulse 1s ease-in-out infinite !important; }
      `}</style>

      {/* Header */}
      <div style={{
        background: "rgba(8,14,20,0.97)", borderBottom: "1px solid rgba(201,168,76,0.12)",
        padding: "16px 20px", backdropFilter: "blur(20px)", flexShrink: 0,
      }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            width: "42px", height: "42px",
            background: "linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.05))",
            border: "1px solid rgba(201,168,76,0.3)", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px", flexShrink: 0,
          }}>📖</div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "400" }}>Quran Tafsir Chat</div>
            <div style={{ fontSize: "11px", color: "#4a7c59", letterSpacing: "1px" }}>● AI Scholar — Hamesha Available</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "20px 16px",
        maxWidth: "700px", width: "100%", margin: "0 auto", boxSizing: "border-box",
      }}>
        {messages.map((msg, i) => (
          <div key={i} className="msg-in" style={{
            display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            marginBottom: "16px", gap: "10px", alignItems: "flex-start",
          }}>
            {msg.role === "assistant" && (
              <div style={{
                width: "32px", height: "32px", flexShrink: 0,
                background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)",
                borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px", marginTop: "2px",
              }}>☪</div>
            )}
            <div style={{
              maxWidth: "85%",
              background: msg.role === "user" ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${msg.role === "user" ? "rgba(201,168,76,0.25)" : "rgba(255,255,255,0.07)"}`,
              borderRadius: msg.role === "user" ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
              padding: "14px 18px", fontSize: "14px", lineHeight: "1.8",
              color: msg.role === "user" ? "#e8dcc8" : "#c8bfb0",
            }}>
              {msg.role === "assistant" ? formatMessage(msg.content) : msg.content}
            </div>
            {msg.role === "user" && (
              <div style={{
                width: "32px", height: "32px", flexShrink: 0,
                background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)",
                borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px", marginTop: "2px",
              }}>👤</div>
            )}
          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", gap: "10px", marginBottom: "16px", alignItems: "flex-start" }}>
            <div style={{
              width: "32px", height: "32px", flexShrink: 0,
              background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px",
            }}>☪</div>
            <div style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "4px 18px 18px 18px", padding: "16px 20px",
              display: "flex", gap: "6px", alignItems: "center",
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: "6px", height: "6px", background: "#C9A84C", borderRadius: "50%",
                  animation: `blink 1.2s ease ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {showSuggestions && messages.length === 1 && (
          <div style={{ marginTop: "8px" }}>
            <div style={{ fontSize: "11px", color: "#3a3028", letterSpacing: "1px", marginBottom: "12px", textAlign: "center" }}>
              — YA IN MEIN SE KOYI SAWAAL KAREIN —
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button key={i} className="suggestion-btn" onClick={() => sendMessage(q)} style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                  color: "#6a5f52", borderRadius: "20px", padding: "8px 14px",
                  cursor: "pointer", fontSize: "12px", letterSpacing: "0.3px",
                }}>{q}</button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        background: "rgba(8,14,20,0.97)", borderTop: "1px solid rgba(201,168,76,0.1)",
        padding: "16px 20px", backdropFilter: "blur(20px)", flexShrink: 0,
      }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", display: "flex", gap: "8px", alignItems: "flex-end" }}>

          {/* Mic Button */}
          <button
            onClick={toggleVoice}
            className={`mic-btn ${isListening ? "mic-listening" : ""}`}
            title={isListening ? "Sunna band karo" : "Bol ke sawaal karein (Urdu/Hindi)"}
            style={{
              width: "48px", height: "48px", flexShrink: 0,
              background: isListening
                ? "rgba(201,168,76,0.18)"
                : "rgba(255,255,255,0.05)",
              border: `1px solid ${isListening ? "rgba(201,168,76,0.5)" : "rgba(201,168,76,0.15)"}`,
              borderRadius: "14px",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              color: isListening ? "#C9A84C" : "#5a5040",
            }}
          >
            {isListening ? <FiMicOff size={18} /> : <FiMic size={18} />}
          </button>

          {/* Textarea */}
          <textarea
            ref={(el) => { inputRef.current = el; textareaRef.current = el; }}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder={isListening ? "🎙️ Sun raha hoon..." : "Koi bhi sawaal karein Quran ke baare mein..."}
            rows={1}
            style={{
              flex: 1, boxSizing: "border-box",
              background: isListening ? "rgba(201,168,76,0.05)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${isListening ? "rgba(201,168,76,0.35)" : "rgba(201,168,76,0.2)"}`,
              borderRadius: "16px", padding: "14px 16px", color: "#e2d9c8",
              fontSize: "14px", outline: "none", resize: "none",
              lineHeight: "1.6", maxHeight: "120px", overflowY: "auto",
              fontFamily: "inherit", transition: "border-color 0.2s, background 0.2s",
            }}
            onInput={e => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
          />

          {/* Send Button */}
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              background: input.trim() && !loading
                ? "linear-gradient(135deg, #C9A84C, #a8863c)"
                : "rgba(255,255,255,0.05)",
              border: "none", borderRadius: "14px", width: "48px", height: "48px",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              fontSize: "18px", flexShrink: 0, transition: "all 0.2s",
            }}
          >
            {loading ? "⟳" : "↑"}
          </button>
        </div>

        {/* Status row */}
        <div style={{ textAlign: "center", marginTop: "10px", fontSize: "10px", letterSpacing: "0.5px" }}>
          {isListening
            ? <span style={{ color: "#C9A84C", opacity: 0.9 }}>
                🎙️ Bol rahe hain... (Urdu / Hindi) — dobara click karein band karne ke liye
              </span>
            : <span style={{ color: "#2a2520" }}>
                Enter dabao ya button press karein • Shift+Enter naya line • 🎙️ voice ke liye mic dabaein
              </span>
          }
        </div>
      </div>
    </div>
  );
}