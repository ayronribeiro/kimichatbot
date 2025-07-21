"use client";
import { useRef, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";

const SUGGESTIONS = [
  "How to get clients for Mentoring?",
  "How to create a sales funnel?",
  "Give me ideas for Reels scripts",
  "Help me create content for Instagram",
];

const FIRST_BOT_MSG = "Hello! I'm your personal mentor. How can I help you today?";

const AVATAR_URL = "https://mentoracademy.co/wp-content/uploads/2025/07/Mentor-Academy_VBI-1.png";

type Message = { from: "user" | "bot"; text: string };

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [minimized, setMinimized] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [showFirstMsg, setShowFirstMsg] = useState(false);
  const [typedMsg, setTypedMsg] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!minimized && messages.length === 0) {
      setShowTyping(true);
      setTimeout(() => {
        setShowTyping(false);
        setShowFirstMsg(true);
        let i = 0;
        const interval = setInterval(() => {
          setTypedMsg(FIRST_BOT_MSG.slice(0, i + 1));
          i++;
          if (i === FIRST_BOT_MSG.length) {
            clearInterval(interval);
            setTimeout(() => setShowSuggestions(true), 400);
          }
        }, 18);
      }, 1200);
    }
  }, [minimized, messages.length]);

  useEffect(() => {
    if (showFirstMsg && typedMsg === FIRST_BOT_MSG) {
      setTimeout(() => {
        setMessages([{ from: "bot", text: FIRST_BOT_MSG }]);
        setShowFirstMsg(false);
      }, 600);
    }
  }, [showFirstMsg, typedMsg]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, showSuggestions]);

  const sendMessage = async (msg: string) => {
    setMessages((msgs) => [...msgs, { from: "user", text: msg }]);
    setShowSuggestions(false);
    setLoading(true);
    setInput("");
    setTimeout(() => {
      if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }, 100);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: data.choices?.[0]?.message?.content || "Sorry, I could not get a response from the AI." },
      ]);
    } catch {
      setMessages((msgs) => [...msgs, { from: "bot", text: "Error connecting to the AI." }]);
    }
    setLoading(false);
    setTimeout(() => {
      if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }, 100);
  };

  const chatIcon = (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#ee3762" />
      <path d="M7 10.5C7 9.11929 8.11929 8 9.5 8H14.5C15.8807 8 17 9.11929 17 10.5V13.5C17 14.8807 15.8807 16 14.5 16H10.5L8 17V13.5V10.5Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );

  const chatBoxStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 32,
    right: 32,
    zIndex: 9999,
    width: fullscreen ? '98vw' : 440,
    maxWidth: fullscreen ? '98vw' : 440,
    height: fullscreen ? '90vh' : 700,
    maxHeight: fullscreen ? '90vh' : 700,
    background: "#fff",
    borderRadius: fullscreen ? 24 : 18,
    boxShadow: "0 4px 24px rgba(4,4,48,0.18)",
    display: minimized ? 'none' : 'flex',
    flexDirection: "column",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
    transition: 'all 0.2s',
  };

  const chatButtonStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 32,
    right: 32,
    zIndex: 9999,
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: '#ee3762',
    boxShadow: '0 2px 8px #ee376299',
    border: 'none',
    display: minimized ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background 0.2s',
  };

  return (
    <>
      <button style={chatButtonStyle} onClick={() => setMinimized(false)} aria-label="Open chat">
        {chatIcon}
      </button>
      <div style={chatBoxStyle}>
        <div style={{ background: "#040430", display: 'flex', alignItems: 'center', gap: 14, padding: fullscreen ? '18px 28px' : '12px 22px', borderTopLeftRadius: fullscreen ? 24 : 18, borderTopRightRadius: fullscreen ? 24 : 18, borderBottom: '1px solid #23234a' }}>
          <Image src={AVATAR_URL} alt="Mentor logo" width={fullscreen ? 48 : 38} height={fullscreen ? 48 : 38} style={{ objectFit: 'contain', background: 'transparent' }} />
          <span style={{ color: '#fff', fontWeight: 600, fontSize: fullscreen ? 18 : 15, letterSpacing: 0.2, opacity: 0.92, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Mentor Maker Agent</span>
          <button onClick={() => setMinimized(true)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#fff', fontSize: 26, cursor: 'pointer', fontWeight: 700, lineHeight: 1 }} aria-label="Minimize">–</button>
          <button onClick={() => setFullscreen(f => !f)} style={{ marginLeft: 8, background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer', fontWeight: 700, lineHeight: 1 }} aria-label={fullscreen ? "Restore" : "Expand"}>{fullscreen ? '🗗' : '🗖'}</button>
        </div>
        <div ref={bodyRef} style={{ flex: 1, padding: fullscreen ? 28 : 20, overflowY: "auto", background: "#9dc4fa36", display: 'flex', flexDirection: 'column', gap: 10 }}>
          {showTyping && (
            <div style={{ alignSelf: "flex-start", color: "#040430", fontSize: fullscreen ? 18 : 16, fontWeight: 500, marginBottom: 2 }}>
              <span style={{ background: "#fff", borderRadius: 14, padding: fullscreen ? '14px 20px' : '12px 16px', boxShadow: "0 2px 8px #04043011", display: 'inline-block' }}>
                <span style={{ marginRight: 8 }}>Mentor is typing</span>
                <span className="blinking-cursor">...</span>
              </span>
            </div>
          )}
          {showFirstMsg && (
            <div style={{ alignSelf: "flex-start", background: "#fff", color: "#040430", borderRadius: 14, padding: fullscreen ? '14px 20px' : '12px 16px', fontSize: fullscreen ? 18 : 16, fontWeight: 500, marginBottom: 2, boxShadow: "0 2px 8px #04043011", minHeight: 32 }}>
              {typedMsg}
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} style={{
              alignSelf: m.from === "user" ? "flex-end" : "flex-start",
              maxWidth: '85%',
              background: m.from === "user" ? "#ee3762" : "#fff",
              color: m.from === "user" ? "#fff" : "#040430",
              borderRadius: 14,
              borderBottomRightRadius: m.from === "user" ? 4 : 14,
              borderBottomLeftRadius: m.from === "user" ? 14 : 4,
              padding: fullscreen ? '14px 20px' : '12px 16px',
              marginBottom: 2,
              fontSize: fullscreen ? 18 : 16,
              boxShadow: m.from === "user" ? "0 2px 8px #ee376233" : "0 2px 8px #04043011",
              wordBreak: 'break-word',
              whiteSpace: 'pre-line',
            }}>
              {m.from === "bot" ? <ReactMarkdown
                components={{
                  h1: (props) => <h1 style={{fontSize:fullscreen?24:20, fontWeight:700, margin:'10px 0 4px 0', color:'#040430'}} {...props} />,
                  h2: (props) => <h2 style={{fontSize:fullscreen?22:18, fontWeight:600, margin:'8px 0 4px 0', color:'#040430'}} {...props} />,
                  ul: (props) => <ul style={{margin:'6px 0 6px 18px', padding:0, color:'#040430'}} {...props} />,
                  li: (props) => <li style={{marginBottom:2, color:'#040430'}} {...props} />,
                  a: (props) => <a style={{color:'#ee3762', textDecoration:'underline'}} target="_blank" rel="noopener noreferrer" {...props} />,
                  strong: (props) => <strong style={{color:'#040430'}} {...props} />,
                  code: (props) => <code style={{background:'#f4f4f4', borderRadius:4, padding:'2px 4px', fontSize:fullscreen?16:14}} {...props} />,
                  p: (props) => <p style={{margin:'6px 0', color:'#040430'}} {...props} />,
                }}
              >{m.text}</ReactMarkdown> : m.text}
            </div>
          ))}
          {showSuggestions && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, margin: '10px 0 0 0', alignSelf: 'flex-start' }}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  style={{
                    background: "#ee3762",
                    color: "#fff",
                    border: "none",
                    borderRadius: 12,
                    padding: "8px 16px",
                    cursor: "pointer",
                    fontSize: 15,
                    fontWeight: 500,
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={e => (e.currentTarget.style.background='#c72c50')}
                  onMouseOut={e => (e.currentTarget.style.background='#ee3762')}
                  onClick={() => sendMessage(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          {loading && <div style={{ color: "#040430", fontWeight: 500 }}>Thinking...</div>}
        </div>
        <div style={{ padding: fullscreen ? "22px 28px 14px 28px" : "18px 20px 10px 20px", background: "#fff", borderTop: '1px solid #e5e7eb', display: "flex", gap: 10, alignItems: "center" }}>
          <input
            style={{ flex: 1, padding: fullscreen ? "14px 20px" : "12px 16px", borderRadius: 12, border: "1px solid #9dc4fa", fontSize: fullscreen ? 18 : 16, outline: 'none', background: '#f9fafb', color: '#040430', fontWeight: 500, transition: 'border 0.2s' }}
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && input.trim()) sendMessage(input.trim()); }}
            disabled={loading || showTyping || showFirstMsg}
          />
          <button
            style={{ background: "#ee3762", color: "#fff", border: "none", borderRadius: 12, padding: fullscreen ? "14px 32px" : "12px 28px", cursor: "pointer", fontSize: fullscreen ? 18 : 16, fontWeight: 600, transition: 'background 0.2s' }}
            onMouseOver={e => (e.currentTarget.style.background='#c72c50')} onMouseOut={e => (e.currentTarget.style.background='#ee3762')}
            onClick={() => input.trim() && sendMessage(input.trim())}
            disabled={loading || showTyping || showFirstMsg}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
} 