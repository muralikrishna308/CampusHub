import React, { useState, useEffect, useRef, useCallback } from "react";
import { qaList, QUICK_REPLIES, SYNONYMS } from "./Chatbotdata";
import "../styles/chatbot.css";

/*Time helper*/
const now = () =>
  new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

const todayLabel = () => {
  const d = new Date();
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });
};


const ScoutIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill={color} opacity="0.4"/>
    <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" fill={color}/>
    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="white"/>
    <circle cx="12" cy="12" r="1.5" fill={color}/>
    <path d="M12 5V7" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 17V19" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M19 12H17" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M7 12H5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const UserIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
  </svg>
);

const RichText = ({ text }) => {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, li) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g).map((p, pi) =>
          p.startsWith("**") && p.endsWith("**")
            ? <strong key={pi}>{p.slice(2, -2)}</strong>
            : p
        );
        return (
          <p key={li} style={{ margin: '4px 0' }}>
            {parts}
          </p>
        );
      })}
    </>
  );
};

/*SMART MATCHING ENGINE*/
const STOP_WORDS = new Set([
  "is", "the", "a", "an", "of", "and", "or", "in", "on", "at",
  "am", "are", "was", "were", "be", "been", "being",
  "this", "that", "these", "those", "it", "its",
  "will", "would", "could", "should", "shall",
  "very", "so", "just", "also", "please", "okay", "ok",
  "do", "does", "did", "have", "has", "had", "i", "my", "me", "your"
]);

const applySynonyms = (text) =>
  text.split(" ").map((w) => SYNONYMS[w] ?? w).join(" ");

const findBestAnswer = (rawInput) => {
  const normalised = applySynonyms(
    rawInput.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim()
  );
  const words = normalised.split(" ").filter((w) => w && !STOP_WORDS.has(w));

  let best = null;
  let maxScore = 0;

  qaList.forEach((item) => {
    let score = 0;
    item.keywords.forEach((kw) => {
      const k = applySynonyms(kw.toLowerCase().replace(/[^\w\s]/g, ""));
      const kWords = k.split(" ").filter(Boolean);
      if (kWords.length > 1) {
        if (normalised.includes(k)) {
          score += 6;
        } else {
          const hits = kWords.filter(
            (kw2) => !STOP_WORDS.has(kw2) && (words.includes(kw2) || normalised.includes(kw2))
          ).length;
          score += hits * 1.5;
        }
      } else {
        if (words.includes(k)) score += 4;
        else if (normalised.includes(k)) score += 2;
      }
    });
    if (score > maxScore) { maxScore = score; best = item; }
  });

  if (best && maxScore >= 1) return best.answer;

  return (
    "Hmm, not sure I got that 🤔 — could you rephrase?\n\n" +
    "Try: **register**, **browse events**, **admin**, **login**, or **feedback**.\n" +
    "Or use the quick-reply chips below 👇"
  );
};

/*CHATBOT COMPONENT */
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimised, setMinimised] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [imgError, setImgError] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 0,
      sender: "bot",
      time: now(),
      text: "Hey! 👋 I'm **Hub Scout** — ask me anything about CampusEventHub.\n\nTry the quick-reply chips below to get started! 👇",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const msgId = useRef(1);

  /* Auto-scroll */
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* Focus input when opened */
  useEffect(() => {
    if (isOpen && !isMinimised)
      setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen, isMinimised]);

  const openChat = () => { setIsOpen(true); setShowBadge(false); };

  /* Send logic */
  const sendMessage = useCallback((text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((p) => [...p, { id: msgId.current++, sender: "user", time: now(), text: trimmed }]);

    const answer = findBestAnswer(trimmed);
    /* shorter delay — feels snappier */
    const delay = 400 + Math.min(answer.length * 1.5, 700);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((p) => [...p, { id: msgId.current++, sender: "bot", time: now(), text: answer }]);
    }, delay);
  }, []);

  const handleSend = useCallback(() => {
    sendMessage(userInput);
    setUserInput("");
  }, [userInput, sendMessage]);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  /* ── JSX ── */
  return (
    <div className="cb-wrapper">

      {/* ── FAB ── */}
      <button
        id="chatbot-trigger"
        className={`cb-fab ${isOpen ? "cb-fab--open" : ""}`}
        onClick={isOpen ? () => setIsOpen(false) : openChat}
        aria-label="Toggle chatbot"
      >
        <span className="cb-fab__icon">
          {isOpen ? "✕" : (imgError ? "🤖" : <img src="/bot-logo.png" alt="Bot Logo" style={{ width: '38px', height: '38px', borderRadius: '50%' }} onError={() => setImgError(true)} />)}
        </span>
        {showBadge && !isOpen && <span className="cb-fab__badge">1</span>}
      </button>

      {/* ── Panel ── */}
      <div className={`cb-panel ${isOpen ? "cb-panel--open" : ""} ${isMinimised ? "cb-panel--mini" : ""}`}>

        {/* HEADER */}
        <div className="cb-header">
          <div className="cb-header__glow" />
          <div className="cb-avatar-wrap">
            <div className="cb-bot-avatar">
              {imgError ? "🤖" : <img src="/bot-logo.png" alt="Bot" style={{ width: '40px', height: '40px', objectFit: 'contain' }} onError={() => setImgError(true)} />}
            </div>
            <span className="cb-online-ring" />
          </div>
          <div className="cb-header__info">
            <span className="cb-header__name">Hub Scout</span>
            <span className="cb-header__sub">
              <span className="cb-green-dot" />
              Online · Always here to help
            </span>
          </div>
          <div className="cb-header__actions">
            <button
              className="cb-hdr-btn"
              onClick={() => setMinimised((p) => !p)}
              title={isMinimised ? "Expand" : "Minimise"}
            >
              {isMinimised ? "▲" : "▼"}
            </button>
            <button className="cb-hdr-btn" onClick={() => setIsOpen(false)} title="Close">✕</button>
          </div>
        </div>

        {!isMinimised && (
          <>
            {/* STATS RIBBON */}
            <div className="cb-ribbon">
              <span>⚡ Instant answers</span>
              <span className="cb-ribbon-sep">·</span>
              <span>📅 340+ events</span>
              <span className="cb-ribbon-sep">·</span>
              <span>🏫 120+ colleges</span>
            </div>

            {/* MESSAGES */}
            <div className="cb-body">
              {/* Date divider */}
              <div className="cb-date-divider">{todayLabel()}</div>

              {messages.map((msg) => (
                <div key={msg.id} className={`cb-row cb-row--${msg.sender}`}>
                  {msg.sender === "bot" && (
                    <div className="cb-mini-avatar cb-mini-avatar--bot">
                      {imgError ? "🤖" : <img src="/bot-logo.png" alt="Bot" style={{ width: '22px', height: '22px', objectFit: 'contain' }} onError={() => setImgError(true)} />}
                    </div>
                  )}

                  <div className="cb-msg-group">
                    <div className={`cb-bubble cb-bubble--${msg.sender}`}>
                      <RichText text={msg.text} />
                    </div>
                    <span className="cb-time">{msg.time}</span>
                  </div>

                  {msg.sender === "user" &&
                    <div className="cb-mini-avatar cb-mini-avatar--user">
                      <UserIcon size={16} />
                    </div>}
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="cb-row cb-row--bot">
                  <div className="cb-mini-avatar cb-mini-avatar--bot">
                    {imgError ? "🤖" : <img src="/bot-logo.png" alt="Bot" style={{ width: '22px', height: '22px', objectFit: 'contain' }} onError={() => setImgError(true)} />}
                  </div>
                  <div className="cb-bubble cb-bubble--bot cb-typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* QUICK REPLIES */}
            <div className="cb-quick">
              <p className="cb-quick__label">Quick Questions</p>
              <div className="cb-chips">
                {QUICK_REPLIES.map((qr) => (
                  <button key={qr.label} className="cb-chip" onClick={() => sendMessage(qr.query)}>
                    {qr.label}
                  </button>
                ))}
              </div>
            </div>

            {/* INPUT */}
            <div className="cb-footer">
              <div className={`cb-input-bar ${userInput ? "cb-input-bar--active" : ""}`}>
                <input
                  ref={inputRef}
                  className="cb-input"
                  type="text"
                  placeholder="Ask anything…"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={handleKey}
                  maxLength={300}
                  aria-label="Chat input"
                />
                <button
                  className="cb-send"
                  onClick={handleSend}
                  disabled={!userInput.trim() || isTyping}
                  aria-label="Send"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <p className="cb-brand">Powered by CampusEventHub AI</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chatbot;