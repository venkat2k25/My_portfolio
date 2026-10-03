import { useEffect, useMemo, useRef, useState } from "react";
import "./GuideCharacter.css";

/** One "chapter" per section. `id` must match the section's id attribute. */
const STORY = [
  { id: "home", chapter: "PROLOGUE", title: "Boot Sequence",
    messages: ["Hey, traveller! I'm V.A.I., your guide through this world.",
      "Venkata Raja builds AI systems and full-stack products. Scroll down, or just ask me anything."] },
  { id: "about", chapter: "CHAPTER 01", title: "The Origin",
    messages: ["This is the origin story. Venkata is a Software Engineer at TCS, working on Japan Airlines partner testing.",
      "He holds an MCA from VIT Vellore (2025), with roots in AI/ML, full-stack and data analytics."] },
  { id: "work", chapter: "CHAPTER 02", title: "Loot & Builds",
    messages: ["Loot room! These are the projects he's shipped.", "Explore the builds to see his work across AI, testing tooling and full-stack apps."] },
  { id: "skills", chapter: "CHAPTER 03", title: "Skill Tree",
    messages: ["Skill tree unlocked! React, backend, AI agents and automation.",
      "Every skill here was levelled up by building real things."] },
  { id: "experience", chapter: "CHAPTER 04", title: "Quest Log",
    messages: ["Quest log time. At TCS he tests Amadeus Altea flows: PNR, codeshare, IATCI and iEMD.",
      "The journey runs from student to engineer, and the map isn't finished yet."] },
  { id: "contact", chapter: "FINAL BOSS", title: "Join Party",
    messages: ["You made it to the final level!", "Venkata is open to opportunities. Send a message and let's team up."] },
];

const SUGGESTIONS = ["What does Venkata do?", "Tell me about his experience", "How can I contact him?"];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function GuideCharacter({
  story = STORY,
  name = "V.A.I.",
  video = "/guide.webm",
  poster = "/guide-poster.png",
  endpoint = "/api/chat",
}) {
  const [activeId, setActiveId] = useState(story[0].id);
  const [open, setOpen] = useState(true);
  const [log, setLog] = useState([]); // {id, role: 'ai' | 'user' | 'sys', text}
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [hasChatted, setHasChatted] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);

  const logEl = useRef(null);
  const idRef = useRef(0);
  const runRef = useRef(0); // bumping this cancels any running story narration
  const chattedRef = useRef(false);

  const chapter = useMemo(() => story.find((s) => s.id === activeId) ?? story[0], [story, activeId]);

  /* ---------- which section is on screen ---------- */
  useEffect(() => {
    const visible = new Map();
    let observer;
    const t = setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => visible.set(e.target.id, e.isIntersecting));
          const current = story.find((s) => visible.get(s.id));
          if (current) setActiveId(current.id);
        },
        { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
      );
      story.forEach((s) => {
        const el = document.getElementById(s.id);
        if (el) observer.observe(el);
      });
    }, 300);
    return () => { clearTimeout(t); observer?.disconnect(); };
  }, [story]);

  /* ---------- typewriter helper ---------- */
  const typeMessage = async (text, shouldStop = () => false) => {
    const id = ++idRef.current;
    setLog((l) => [...l.slice(-40), { id, role: "ai", text: "" }]);
    const step = reduceMotion() ? text.length : 2;
    for (let i = step; i < text.length; i += step) {
      if (shouldStop()) return;
      setLog((l) => l.map((m) => (m.id === id ? { ...m, text: text.slice(0, i) } : m)));
      await sleep(14);
    }
    if (shouldStop()) return;
    setLog((l) => l.map((m) => (m.id === id ? { ...m, text } : m)));
  };

  /* ---------- story narration per chapter ---------- */
  useEffect(() => {
    if (!open) return;
    const run = ++runRef.current;
    const stopped = () => runRef.current !== run;

    // once the visitor has chatted, don't interrupt: just drop a chapter marker
    if (chattedRef.current) {
      setLog((l) => [...l.slice(-40), { id: ++idRef.current, role: "sys", text: `${chapter.chapter} · ${chapter.title}` }]);
      return;
    }

    (async () => {
      setLog([]);
      for (const msg of chapter.messages) {
        if (stopped()) return;
        setTyping(true);
        await sleep(reduceMotion() ? 0 : 500);
        if (stopped()) return;
        setTyping(false);
        await typeMessage(msg, stopped);
        await sleep(reduceMotion() ? 0 : 300);
      }
    })();

    return () => { runRef.current++; setTyping(false); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter, replayKey, open]);

  useEffect(() => {
    logEl.current?.scrollTo({ top: logEl.current.scrollHeight });
  }, [log, typing]);

  /* ---------- send a question to the AI ---------- */
  const send = async (raw) => {
    const text = raw.trim().slice(0, 300);
    if (!text || sending) return;

    runRef.current++; // stop any story narration
    chattedRef.current = true;
    setHasChatted(true);
    setTyping(false);
    setInput("");
    setSending(true);

    const userMsg = { id: ++idRef.current, role: "user", text };
    setLog((l) => [...l.slice(-40), userMsg]);

    const history = [...log, userMsg]
      .filter((m) => m.role !== "sys")
      .map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));
    while (history.length && history[0].role !== "user") history.shift();

    setTyping(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-10), section: chapter.title }),
      });
      const data = await res.json().catch(() => ({}));
      setTyping(false);
      await typeMessage(
        data.reply || "Signal lost in the void. Try again, or head to the Contact section."
      );
    } catch {
      setTyping(false);
      await typeMessage("Connection glitch on my side. Try again, or use the Contact section.");
    } finally {
      setSending(false);
    }
  };

  return (
    <aside className="guide">
      {open && (
        <div className="guide__bubble">
          <header className="guide__head">
            <span className="guide__dot" />
            <span className="guide__name">{name}</span>
            <span className="guide__chapter">{chapter.chapter}</span>
            <button className="guide__btn" title="Replay chapter" aria-label="Replay chapter"
              onClick={() => { chattedRef.current = false; setHasChatted(false); setReplayKey((k) => k + 1); }}>↻</button>
            <button className="guide__btn" title="Hide" aria-label="Hide guide chat" onClick={() => setOpen(false)}>✕</button>
          </header>

          <div className="guide__title">{chapter.title}</div>

          <div className="guide__log" data-lenis-prevent ref={logEl} role="log" aria-live="polite">
            {log.map((m) =>
              m.role === "sys" ? (
                <div className="guide__sys" key={m.id}>{m.text}</div>
              ) : (
                <p key={m.id} className={`guide__msg ${m.role === "user" ? "guide__msg--user" : ""}`}>{m.text}</p>
              )
            )}
            {typing && (
              <p className="guide__msg guide__msg--typing"><i /><i /><i /></p>
            )}
          </div>

          {!hasChatted && (
            <div className="guide__chips">
              {SUGGESTIONS.map((s) => (
                <button key={s} className="guide__chip" onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          )}

          <form className="guide__form" onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <input
              className="guide__input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Venkata…"
              maxLength={300}
              disabled={sending}
              aria-label="Ask the guide a question"
            />
            <button className="guide__send" type="submit" disabled={sending || !input.trim()} aria-label="Send">➤</button>
          </form>
        </div>
      )}

      <button className="guide__char" onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Hide guide chat" : "Show guide chat"}>
        {videoFailed ? (
          <img src={poster} alt="" />
        ) : (
          <video src={video} poster={poster} autoPlay loop muted playsInline preload="auto"
            onError={() => setVideoFailed(true)} />
        )}
        {!open && <span className="guide__ping">💬</span>}
      </button>
    </aside>
  );
}
