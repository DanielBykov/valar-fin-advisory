"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "done" | "error";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setStatus("done");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(json.error || "That didn't go through. Try again, or email us directly.");
      }
    } catch {
      setStatus("error");
      setMessage("That didn't go through. Try again, or email us directly.");
    }
  }

  if (status === "done") {
    return (
      <p data-cmp="NewsletterSignup.Done" className="text-[15px] font-medium text-valar-navy">
        You&apos;re on the list. Check your inbox to confirm.
      </p>
    );
  }

  return (
    <form data-cmp="NewsletterSignup" onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.co.nz"
          aria-label="Email address"
          className="min-w-[240px] flex-1 rounded-lg border border-valar-concrete bg-valar-fog px-4 py-3 text-[15px] text-valar-navy focus:border-valar-amber focus:outline-none focus:ring-2 focus:ring-valar-amber/30"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-lg bg-valar-amber px-6 py-3 text-[15px] font-bold text-valar-navy transition-colors hover:bg-valar-amber-hover disabled:opacity-60"
        >
          {status === "sending" ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      {status === "error" && (
        <p role="alert" className="text-sm text-red-700">
          {message}
        </p>
      )}
    </form>
  );
}
