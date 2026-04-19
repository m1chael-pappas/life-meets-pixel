"use client";

import { useState, useTransition } from "react";

import { sendContactMessage } from "@/app/actions/contact";

const TOPICS = [
  { id: "review-request", label: "REVIEW REQUEST" },
  { id: "tip", label: "NEWS TIP" },
  { id: "collab", label: "COLLAB" },
  { id: "feedback", label: "FEEDBACK" },
  { id: "business", label: "BUSINESS" },
  { id: "other", label: "OTHER" },
];

const MAX_LEN = 1000;

export function ContactForm() {
  const [topic, setTopic] = useState<string>("feedback");
  const [message, setMessage] = useState<string>("");
  const [ack, setAck] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const charClass =
    message.length > MAX_LEN ? "hot" : message.length > MAX_LEN * 0.8 ? "warn" : "";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAck(null);
    setErrorMsg(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    startTransition(async () => {
      const result = await sendContactMessage(data);
      if (result.ok) {
        setAck("Transmission received. We'll respond within 48 hours.");
        form.reset();
        setMessage("");
      } else {
        setErrorMsg(result.error);
      }
    });
  }

  return (
    <form className="terminal" onSubmit={handleSubmit} noValidate>
      <div className="terminal__chrome">
        <div className="terminal__dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <span className="terminal__title">lmp-contact ~ send message</span>
        <span className="terminal__status">
          READY<span className="blink">_</span>
        </span>
      </div>
      <div className="terminal__body">
        <div className="terminal__preamble">
          <span className="line">
            <span className="prompt">&gt;</span> initializing transmission channel…
          </span>
          <span className="line">
            <span className="prompt">&gt;</span> handshake{" "}
            <span className="ok">[OK]</span>
          </span>
          <span className="line">
            <span className="prompt">&gt;</span> awaiting input.
          </span>
        </div>

        <div className="field-row">
          <label className="field-label" htmlFor="name">
            ▶ HANDLE <span className="req">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="field-input"
            placeholder="Your name"
            autoComplete="name"
          />
        </div>

        <div className="field-row">
          <label className="field-label" htmlFor="email">
            ▶ EMAIL <span className="req">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="field-input"
            placeholder="you@email.com"
            autoComplete="email"
          />
        </div>

        <div className="field-row">
          <label className="field-label">▶ TOPIC</label>
          <div className="topic-grid" role="radiogroup" aria-label="Topic">
            {TOPICS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`topic-opt ${topic === t.id ? "is-on" : ""}`}
                role="radio"
                aria-checked={topic === t.id}
                onClick={() => setTopic(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <input type="hidden" name="topic" value={topic} />
        </div>

        <div className="field-row">
          <label className="field-label" htmlFor="message">
            ▶ MESSAGE <span className="req">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            className="field-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={MAX_LEN}
            placeholder="Drop your transmission here…"
          />
        </div>

        <div className="send-row">
          <span className="hint-text">No PR fluff, please.</span>
          <span className={`char-count ${charClass}`}>
            {message.length} / {MAX_LEN}
          </span>
          <button
            type="submit"
            className="retro-btn retro-btn--magenta"
            disabled={isPending}
          >
            {isPending ? "TRANSMITTING…" : "▶ SEND"}
          </button>
        </div>

        {ack && (
          <div className="ack-line" role="status">
            <span className="blink">●</span>
            {ack}
          </div>
        )}
        {errorMsg && (
          <div
            className="ack-line"
            role="alert"
            style={{
              color: "var(--heart)",
              background: "rgba(255, 82, 117, 0.08)",
              borderLeftColor: "var(--heart)",
            }}
          >
            <span>⚠</span>
            {errorMsg}
          </div>
        )}
      </div>
    </form>
  );
}
