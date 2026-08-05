"use client";

import { motion } from "framer-motion";

const easeOut = [0.16, 1, 0.3, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

const cards = [
  {
    title: "Soft-clean",
    sub: "bristle head",
    from: "#c7d2fe",
    to: "#818cf8",
  },
  {
    title: "Fast charge",
    sub: "USB-C base",
    from: "#fbcfe8",
    to: "#f472b6",
  },
  {
    title: "Travel",
    sub: "ready case",
    from: "#bae6fd",
    to: "#38bdf8",
  },
];

export default function Hero() {
  return (
    <section className="relative flex min-h-[640px] flex-1 items-center overflow-hidden bg-white py-16 sm:py-20 lg:py-0">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-16 px-6 sm:px-8 lg:grid-cols-2 lg:gap-8"
      >
        {/* left: content */}
        <div className="flex flex-col gap-10">
          <motion.h1
            variants={fadeUp}
            className="max-w-md text-center text-4xl font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl lg:text-left"
          >
            Making everyday
            <br />
            brushing feel fresh
            <br />
            and effortless
          </motion.h1>

          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center justify-center gap-4 lg:justify-start"
          >
            <a
              href="#order"
              className="rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.03] active:scale-95"
            >
              Create an order
            </a>
            <a
              href="#app"
              className="rounded-full border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
            >
              Download app
            </a>

            <motion.span
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.6, duration: 0.5, ease: "backOut" }}
              whileHover={{ scale: 1.08 }}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-50"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 21s-7-4.35-9.5-8.4C.6 9.1 2 5.5 5.5 5A4.9 4.9 0 0 1 12 8a4.9 4.9 0 0 1 6.5-3c3.5.5 4.9 4.1 3 7.6C19 16.65 12 21 12 21Z"
                  fill="#818cf8"
                />
              </svg>
            </motion.span>
          </motion.div>

          {/* feature cards */}
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-3 gap-3 sm:gap-4"
          >
            {cards.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.5 + i * 0.12,
                  duration: 0.6,
                  ease: easeOut,
                }}
                whileHover={{ y: -4 }}
                className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-3 text-center shadow-sm sm:items-start sm:text-left"
              >
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, ${c.from}, ${c.to})`,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="7" fill="white" fillOpacity="0.5" />
                  </svg>
                </span>
                <p className="text-xs font-medium leading-snug text-gray-600">
                  {c.title}
                  <br />
                  {c.sub}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* right: big product image, bleeding off the edge on desktop */}
        <motion.div
          variants={fadeUp}
          className="relative mx-auto flex h-[300px] w-[220px] items-center justify-center sm:h-[380px] sm:w-[260px] lg:mx-0 lg:h-[560px] lg:w-full lg:justify-end lg:-mr-6 xl:-mr-16"
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute h-56 w-56 rounded-full bg-indigo-100 blur-3xl lg:h-72 lg:w-72"
          />

          <motion.div
            initial={{ rotate: -6, y: 20 }}
            animate={{ rotate: -6, y: [0, -14, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <svg
              viewBox="0 0 120 380"
              fill="none"
              className="h-[280px] w-auto drop-shadow-2xl sm:h-[360px] lg:h-[520px]"
            >
              <rect
                x="45"
                y="60"
                width="30"
                height="300"
                rx="15"
                fill="url(#body-gradient)"
              />
              <rect x="38" y="10" width="44" height="70" rx="18" fill="#f8fafc" />
              <circle cx="60" cy="20" r="4" fill="#cbd5e1" />
              <circle cx="48" cy="28" r="4" fill="#cbd5e1" />
              <circle cx="72" cy="28" r="4" fill="#cbd5e1" />
              <circle cx="60" cy="36" r="4" fill="#cbd5e1" />
              <defs>
                <linearGradient
                  id="body-gradient"
                  x1="45"
                  y1="60"
                  x2="75"
                  y2="360"
                >
                  <stop offset="0%" stopColor="#e0e7ff" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
              </defs>
            </svg>

            {[...Array(5)].map((_, i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -10, 0], opacity: [0.2, 0.8, 0.2] }}
                transition={{
                  duration: 2 + i * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.25,
                }}
                className="absolute h-1.5 w-1.5 rounded-full bg-indigo-200"
                style={{
                  top: `${10 + i * 16}%`,
                  left: i % 2 === 0 ? "-8%" : "104%",
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
