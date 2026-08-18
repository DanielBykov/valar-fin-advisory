"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "done" | "error";

/**
 * Same list, same fields as the footer form — first name is what MailerLite
 * merges into the greeting, so both places have to ask for it.
 */
export default function NewsletterSignup({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const dark = tone === "dark";
  const field = [
    "rounded-lg px-4 py-3 text-[15px] outline-none focus:ring-2",
    dark
      ? "border-none bg-valar-indigo text-white placeholder:text-white/50 focus:ring-valar-amber"
      : "border border-valar-concrete bg-valar-fog text-valar-navy focus:border-valar-amber focus:ring-valar-amber/30",
  ].join(" ");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setStatus("done");
        setEmail("");
        setFirstName("");
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
      <p
        data-cmp="NewsletterSignup.Done"
        className={`text-[15px] font-medium ${dark ? "text-valar-amber" : "text-valar-navy"}`}
      >
        You&apos;re on the list. Check your inbox to confirm.
      </p>
    );
  }

  return (
    <form data-cmp="NewsletterSignup" onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First name"
          aria-label="First name"
          className={`w-36 ${field}`}
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.co.nz"
          aria-label="Email address"
          className={`min-w-[200px] flex-1 ${field}`}
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
        <p role="alert" className={`text-sm ${dark ? "text-valar-amber" : "text-red-700"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
