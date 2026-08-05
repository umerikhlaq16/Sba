export type Category = string;
export type ProductIconType = "brush" | "charge" | "case" | "bundle";

export type Product = {
  slug: string;
  name: string;
  price: string;
  category: Category;
  badge?: string;
  image: string | null;
  from: string;
  to: string;
  icon: ProductIconType;
  desc: string;
  tagline: string;
  features: string[];
  specs: { label: string; value: string }[];
};

export const products: Product[] = [
  {
    slug: "wave-action",
    name: "Wave Action",
    price: "",
    category: "Wave Action",
    badge: "Flagship",
    image: null,
    from: "#ffd9e2",
    to: "#ee4e72",
    icon: "brush",
    desc: "Wave-pattern bristle trim for a gentler, multi-angle clean.",
    tagline: "Our signature wave-trim bristles, engineered for everyday oral care.",
    features: [
      "Wave-pattern bristle trim reaches multiple tooth angles in one stroke",
      "Ergonomic handle designed for a comfortable, controlled grip",
      "Durable Nylon bristles for consistent, everyday performance",
      "Manufactured to export-grade quality standards",
    ],
    specs: [
      { label: "Bristle type", value: "Nylon, soft-medium" },
      { label: "Handle", value: "Ergonomic grip" },
      { label: "Use", value: "Daily, all ages" },
      { label: "Origin", value: "Made in Pakistan" },
    ],
  },
  {
    slug: "optic-care",
    name: "Optic Care",
    price: "",
    category: "Optic Care",
    image: null,
    from: "#dbeafe",
    to: "#60a5fa",
    icon: "brush",
    desc: "Fine, close-set bristles focused on a brighter, thorough clean.",
    tagline: "Precision bristle work, built for a brighter smile.",
    features: [
      "Fine, close-set bristles for thorough surface coverage",
      "Slim handle profile for easier reach and control",
      "Balanced bristle firmness for daily brightening care",
      "Consistent quality across every production batch",
    ],
    specs: [
      { label: "Bristle type", value: "Nylon, fine" },
      { label: "Handle", value: "Slim profile" },
      { label: "Use", value: "Daily, all ages" },
      { label: "Origin", value: "Made in Pakistan" },
    ],
  },
  {
    slug: "classic",
    name: "Classic",
    price: "",
    category: "Classic",
    image: null,
    from: "#e2e8f0",
    to: "#94a3b8",
    icon: "brush",
    desc: "The everyday reliable toothbrush, trusted across our home market.",
    tagline: "A dependable, everyday brush built for the whole family.",
    features: [
      "Straightforward, reliable design for everyday brushing",
      "Comfortable handle sized for a natural hold",
      "Consistent bristle quality at an accessible price point",
      "Our best-known name across the domestic market",
    ],
    specs: [
      { label: "Bristle type", value: "Nylon, medium" },
      { label: "Handle", value: "Classic grip" },
      { label: "Use", value: "Daily, all ages" },
      { label: "Origin", value: "Made in Pakistan" },
    ],
  },
  {
    slug: "super-classic",
    name: "Super Classic",
    price: "",
    category: "Super Classic",
    image: null,
    from: "#fef3c7",
    to: "#f59e0b",
    icon: "brush",
    desc: "A refined take on our Classic, with a firmer, more secure grip.",
    tagline: "The Classic, refined with a firmer grip and sturdier build.",
    features: [
      "Reinforced handle for a firmer, more secure grip",
      "Denser bristle fill for a fuller clean",
      "Built on the trusted Classic design, upgraded",
      "A consistent favorite among our export partners",
    ],
    specs: [
      { label: "Bristle type", value: "Nylon, medium-firm" },
      { label: "Handle", value: "Reinforced grip" },
      { label: "Use", value: "Daily, all ages" },
      { label: "Origin", value: "Made in Pakistan" },
    ],
  },
  {
    slug: "comfort",
    name: "Comfort",
    price: "",
    category: "Comfort",
    image: null,
    from: "#dcfce7",
    to: "#4ade80",
    icon: "brush",
    desc: "Soft-grip handle and gentle bristles, made for sensitive routines.",
    tagline: "Softer bristles and a cushioned grip, for gentler routines.",
    features: [
      "Soft-touch grip designed to reduce hand fatigue",
      "Gentler bristle fill suited to sensitive teeth and gums",
      "Rounded bristle tips for a comfortable, even clean",
      "A gentler everyday option within the Dr. Choice range",
    ],
    specs: [
      { label: "Bristle type", value: "Nylon, soft" },
      { label: "Handle", value: "Cushioned grip" },
      { label: "Use", value: "Daily, sensitive care" },
      { label: "Origin", value: "Made in Pakistan" },
    ],
  },
  {
    slug: "flexocare",
    name: "Flexocare",
    price: "",
    category: "Flexocare",
    image: null,
    from: "#ede9fe",
    to: "#a78bfa",
    icon: "brush",
    desc: "A flexible neck that adapts to brushing pressure for a safer clean.",
    tagline: "A flexible neck built to adapt as you brush.",
    features: [
      "Flexible neck construction adapts to brushing pressure",
      "Helps guard against over-brushing on gums and enamel",
      "Balanced bristle trim for consistent, even coverage",
      "Engineered and tested to our export quality standards",
    ],
    specs: [
      { label: "Bristle type", value: "Nylon, medium" },
      { label: "Handle", value: "Flexible neck" },
      { label: "Use", value: "Daily, all ages" },
      { label: "Origin", value: "Made in Pakistan" },
    ],
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}
