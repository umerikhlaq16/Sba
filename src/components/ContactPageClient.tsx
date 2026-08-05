"use client";

import { useState } from "react";
import { useSection } from "@/contexts/ContentContext";

export default function ContactPageClient() {
  const [submitted, setSubmitted] = useState(false);
  const copy = useSection("contact") as {
    heading: string;
    subtext: string;
    email: string;
    phone: string;
    officeAddress: string;
    factoryAddress: string;
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="bg-background px-4 pb-20 pt-32 sm:px-6 sm:pt-40 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <p className="text-xs font-medium uppercase tracking-widest text-brand">Contact</p>
        <h1 className="mt-3 max-w-xl font-serif text-3xl leading-snug text-foreground sm:text-4xl">
          {copy.heading}
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground/60">{copy.subtext}</p>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            {submitted ? (
              <div className="border border-foreground/10 p-8">
                <p className="font-serif text-lg text-foreground">Inquiry sent.</p>
                <p className="mt-2 text-sm text-foreground/60">
                  Thanks for reaching out. We&apos;ll be in touch soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-xs font-medium uppercase tracking-wide text-foreground/50">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="Your name"
                      className="border border-foreground/15 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:border-brand focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="company" className="text-xs font-medium uppercase tracking-wide text-foreground/50">
                      Company
                    </label>
                    <input
                      id="company"
                      type="text"
                      placeholder="Your company"
                      className="border border-foreground/15 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:border-brand focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-xs font-medium uppercase tracking-wide text-foreground/50">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="you@company.com"
                      className="border border-foreground/15 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:border-brand focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="text-xs font-medium uppercase tracking-wide text-foreground/50">
                      Phone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+92 300 0000000"
                      className="border border-foreground/15 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:border-brand focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="subject" className="text-xs font-medium uppercase tracking-wide text-foreground/50">
                    Inquiry type
                  </label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="Export order, private label, general inquiry..."
                    className="border border-foreground/15 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:border-brand focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-xs font-medium uppercase tracking-wide text-foreground/50">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    placeholder="Tell us a bit more..."
                    className="resize-none border border-foreground/15 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:border-brand focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 self-start border border-brand px-7 py-3.5 text-[13px] font-medium uppercase tracking-[0.1em] text-brand hover:bg-brand hover:text-white"
                >
                  Send Inquiry
                </button>
              </form>
            )}

            <div className="mt-10 grid grid-cols-1 gap-6 border-t border-foreground/10 pt-8 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-foreground/40">Email</p>
                <p className="mt-1 text-sm text-foreground/70">{copy.email}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-foreground/40">Phone</p>
                <p className="mt-1 text-sm text-foreground/70">{copy.phone}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-foreground/40">Head Office</p>
                <p className="mt-1 text-sm text-foreground/70">{copy.officeAddress}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-foreground/40">Factory</p>
                <p className="mt-1 text-sm text-foreground/70">{copy.factoryAddress}</p>
              </div>
            </div>
          </div>

          <div className="h-[360px] overflow-hidden border border-foreground/10 lg:h-full lg:min-h-[500px]">
            <iframe
              title="Map"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                copy.factoryAddress || "Lahore, Pakistan"
              )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              className="h-full w-full grayscale"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
