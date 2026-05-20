"use client";

import { useState } from "react";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent]  = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = (e)  => { e.preventDefault(); setSent(true); };

  const field =
    "w-full bg-transparent text-white font-sans text-sm placeholder-neutral-700 outline-none";

  return (
    <section
      id="contact"
      className="w-full bg-[#030303] py-20 md:py-24 px-8 md:px-14 border-t border-neutral-900"
    >
      <div className="max-w-3xl mx-auto">

        {/* Two-column layout: heading left, form right */}
        {sent ? (
          <div className="py-16 flex flex-col gap-4">
            <p className="text-[10px] tracking-[0.35em] text-[#ff6b3d] uppercase font-sans font-bold">SENT</p>
            <h3 className="font-sans font-extrabold text-3xl tracking-tight text-white uppercase">
              We'll be in touch.
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-20">

            {/* Left — identity */}
            <div className="flex flex-col justify-between gap-10">
              <div>
                <p className="text-[10px] tracking-[0.35em] text-[#ff6b3d] uppercase font-sans font-bold mb-5">
                  GET IN TOUCH
                </p>
                <h2 className="font-sans font-extrabold text-4xl md:text-[2.8rem] tracking-tight text-white uppercase leading-[1.1]">
                  Start<br />
                  <span className="font-serif font-normal italic text-neutral-600 capitalize">
                    a project
                  </span>
                </h2>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[10px] tracking-[0.25em] font-sans text-neutral-600 uppercase">
                  Response within 24 hrs
                </p>
                <a
                  href="mailto:hello@alttrednexxus.agency"
                  className="text-xs font-sans text-neutral-500 hover:text-white transition-colors duration-300"
                >
                  hello@alttrednexxus.agency
                </a>
              </div>
            </div>

            {/* Right — form */}
            <form onSubmit={onSubmit} className="flex flex-col gap-0">

              <div className="group pb-5 mb-5 border-b border-neutral-800 focus-within:border-neutral-600 transition-colors duration-300">
                <label className="block text-[9px] tracking-[0.3em] font-sans font-bold text-neutral-700 uppercase mb-2.5 group-focus-within:text-neutral-400 transition-colors duration-300">
                  Name
                </label>
                <input
                  type="text" name="name" value={form.name} onChange={onChange}
                  required placeholder="Your full name"
                  className={field}
                />
              </div>

              <div className="group pb-5 mb-5 border-b border-neutral-800 focus-within:border-neutral-600 transition-colors duration-300">
                <label className="block text-[9px] tracking-[0.3em] font-sans font-bold text-neutral-700 uppercase mb-2.5 group-focus-within:text-neutral-400 transition-colors duration-300">
                  Email
                </label>
                <input
                  type="email" name="email" value={form.email} onChange={onChange}
                  required placeholder="your@email.com"
                  className={field}
                />
              </div>

              <div className="group pb-5 border-b border-neutral-800 focus-within:border-neutral-600 transition-colors duration-300">
                <label className="block text-[9px] tracking-[0.3em] font-sans font-bold text-neutral-700 uppercase mb-2.5 group-focus-within:text-neutral-400 transition-colors duration-300">
                  Message
                </label>
                <textarea
                  name="message" value={form.message} onChange={onChange}
                  required placeholder="Tell us about your project…"
                  rows={4}
                  className={`${field} resize-none`}
                />
              </div>

              <div className="pt-7">
                <button
                  type="submit"
                  className="text-[10px] tracking-[0.28em] font-sans font-bold uppercase text-black bg-white px-8 py-3.5 rounded-full hover:bg-[#ff6b3d] hover:text-white transition-all duration-300"
                >
                  SEND MESSAGE
                </button>
              </div>
            </form>

          </div>
        )}
      </div>
    </section>
  );
}
