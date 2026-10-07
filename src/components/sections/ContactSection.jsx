"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Turnstile } from "@marsidev/react-turnstile";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent]   = useState(false);
  const [busy, setBusy]   = useState(false);
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const reset = () => {
    setForm({ name: "", email: "", message: "" });
    setTurnstileToken("");
    setSent(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!turnstileToken) {
      setError("Please complete the verification.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...form,
            turnstileToken,
        }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
      // Tokens are single-use — reset so the next attempt gets a fresh one.
      setTurnstileToken("");
      turnstileRef.current?.reset();
    } finally {
      setBusy(false);
    }
  };

  const field =
    "w-full bg-transparent text-white font-sans text-base md:text-[17px] placeholder-neutral-500 outline-none";

  return (
    <section
      id="contact"
      className="w-full bg-[#030303] py-20 md:py-28 px-6 md:px-14 border-t border-neutral-900"
    >
      <div className="max-w-3xl mx-auto">

        {/* Two-column layout: heading left, form right */}
        <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-20">

            {/* Left — identity */}
            <div className="flex flex-col justify-between gap-10">
              <div>
                <h2 className="font-sans font-semibold text-4xl md:text-[2.8rem] tracking-tight text-white uppercase leading-[1.1]">
                  Start<br />
                  <span className="text-neutral-400">
                    a project
                  </span>
                </h2>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[12px] tracking-[0.14em] font-sans font-semibold text-neutral-300 uppercase">
                  Response within 24 hrs
                </p>
                <p className="text-[14px] md:text-[15px] font-sans text-neutral-400 leading-relaxed">
                  You can contact enquiries on this mail id
                </p>
                <a
                  href="mailto:matts@alttrednexxus.com"
                  className="text-[16px] md:text-[17px] font-sans text-white underline-offset-4 hover:underline transition-colors duration-300"
                >
                  matts@alttrednexxus.com
                </a>
              </div>
            </div>

            {/* Right — form / success */}
            {sent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="flex flex-col justify-between min-h-[320px] md:min-h-[380px]"
              >
                <div className="flex flex-col gap-5">
                  <p className="text-[12px] tracking-[0.14em] font-sans font-semibold text-neutral-300 uppercase">
                    Message sent
                  </p>
                  <h3 className="font-sans font-semibold text-3xl md:text-4xl tracking-tight text-white uppercase leading-[1.1]">
                    Thank you{form.name ? `, ${form.name.split(" ")[0]}` : ""}.
                    <br />
                    <span className="text-neutral-400">We&apos;ll be in touch.</span>
                  </h3>
                  <p className="text-[15px] font-sans text-neutral-400 leading-relaxed max-w-sm">
                    Expect a reply within 24 hours at{" "}
                    <span className="text-neutral-300">{form.email}</span>.
                  </p>
                </div>
                <div className="pt-10 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={reset}
                    className="text-[12px] tracking-[0.14em] font-sans font-semibold uppercase text-neutral-400 hover:text-white transition-colors duration-300"
                  >
                    Send another message
                  </button>
                </div>
              </motion.div>
            ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-0">

              <div className="group pb-5 mb-5 border-b border-neutral-600 focus-within:border-white transition-colors duration-300">
                <label htmlFor="contact-name" className="block text-[12px] tracking-[0.14em] font-sans font-semibold text-neutral-300 uppercase mb-3 group-focus-within:text-white transition-colors duration-300">
                  Name
                </label>
                <input
                  id="contact-name" type="text" name="name" autoComplete="name" value={form.name} onChange={onChange}
                  required placeholder="Your full name"
                  className={field}
                />
              </div>

              <div className="group pb-5 mb-5 border-b border-neutral-600 focus-within:border-white transition-colors duration-300">
                <label htmlFor="contact-email" className="block text-[12px] tracking-[0.14em] font-sans font-semibold text-neutral-300 uppercase mb-3 group-focus-within:text-white transition-colors duration-300">
                  Email
                </label>
                <input
                  id="contact-email" type="email" name="email" autoComplete="email" value={form.email} onChange={onChange}
                  required placeholder="your@email.com"
                  className={field}
                />
              </div>

              <div className="group pb-5 border-b border-neutral-600 focus-within:border-white transition-colors duration-300">
                <label htmlFor="contact-message" className="block text-[12px] tracking-[0.14em] font-sans font-semibold text-neutral-300 uppercase mb-3 group-focus-within:text-white transition-colors duration-300">
                  Message
                </label>
                <textarea
                  id="contact-message" name="message" value={form.message} onChange={onChange}
                  required placeholder="Tell us about your project…"
                  rows={4}
                  className={`${field} resize-none`}
                />
              </div>

              <div className="pt-7 flex flex-col gap-3">
                <Turnstile
                  ref={turnstileRef}
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAE6bWGblrsXoW3Cb"}
                  onSuccess={(token) => setTurnstileToken(token)}
                  onExpire={() => setTurnstileToken("")}
                  onError={() => setTurnstileToken("")}
                />
                <button
                  type="submit"
                  disabled={busy}
                  className="text-[13px] tracking-[0.14em] font-sans font-bold uppercase text-black bg-white px-8 py-4 rounded-full hover:bg-neutral-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {busy ? "SENDING…" : "SEND MESSAGE"}
                </button>
                {error && (
                  <p role="alert" className="text-[14px] font-sans text-red-400">{error}</p>
                )}
              </div>
            </form>
            )}

          </motion.div>
      </div>
    </section>
  );
}
