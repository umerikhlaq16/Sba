import type { ProductIconType } from "@/lib/products";

export default function ProductIcon({ type, size = 30 }: { type: ProductIconType; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none" } as const;
  if (type === "brush") {
    return (
      <svg {...common}>
        <rect x="9" y="2" width="6" height="14" rx="3" stroke="#1e293b" strokeWidth="1.4" />
        <path d="M9 16h6l-1 6h-4l-1-6Z" stroke="#1e293b" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === "charge") {
    return (
      <svg {...common}>
        <path d="M13 2 3 14h7l-1 8 11-14h-7l1-6Z" stroke="#1e293b" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === "case") {
    return (
      <svg {...common}>
        <rect x="3" y="7" width="18" height="13" rx="2" stroke="#1e293b" strokeWidth="1.4" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="#1e293b" strokeWidth="1.4" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect x="3" y="8" width="18" height="12" rx="1.5" stroke="#1e293b" strokeWidth="1.4" />
      <path d="M3 12h18M12 8v12" stroke="#1e293b" strokeWidth="1.4" />
      <path d="M8 8c0-2 1.5-4 4-4s4 2 4 4" stroke="#1e293b" strokeWidth="1.4" />
    </svg>
  );
}
