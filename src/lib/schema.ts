export type FieldType = "text" | "textarea" | "image" | "list" | "listOfObjects" | "products" | "pageLink" | "toggle" | "color" | "number";

export const pageLinkOptions: { label: string; value: string }[] = [
  { label: "Home", value: "/" },
  { label: "Who We Are (section)", value: "/#about" },
  { label: "Why SB Alliance (section)", value: "/#why-us" },
  { label: "Products (section)", value: "/#products" },
  { label: "Facility & Process (section)", value: "/#facility" },
  { label: "Our Partners (section)", value: "/#partners" },
  { label: "Contact", value: "/contact" },
];

export type SubField = { key: string; label: string; type: "text" | "textarea" | "image" };

export type FieldDef =
  | { key: string; label: string; type: "text"; default: string; group?: string }
  | { key: string; label: string; type: "textarea"; default: string; group?: string }
  | { key: string; label: string; type: "image"; default: string; group?: string }
  | { key: string; label: string; type: "list"; default: string[]; group?: string }
  | {
      key: string;
      label: string;
      type: "listOfObjects";
      itemFields: SubField[];
      default: Record<string, string>[];
      group?: string;
    }
  | {
      key: string;
      label: string;
      type: "products";
      count: number;
      slotLabels?: string[];
      default: string[];
      group?: string;
    }
  | { key: string; label: string; type: "pageLink"; default: string; group?: string }
  | { key: string; label: string; type: "toggle"; default: boolean; group?: string }
  | { key: string; label: string; type: "color"; default: string; group?: string }
  | { key: string; label: string; type: "number"; default: number; min?: number; max?: number; group?: string };

export type SectionDef = {
  key: string;
  label: string;
  page: string;
  fields: FieldDef[];
};

export const contentSchema: SectionDef[] = [
  {
    key: "hero",
    label: "Hero Banner",
    page: "Home",
    fields: [
      {
        key: "eyebrow",
        label: "Eyebrow label",
        type: "text",
        default: "Toothbrush Manufacturer",
        group: "Main Copy",
      },
      {
        key: "eyebrowSize",
        label: "Eyebrow label size",
        type: "number",
        default: 12,
        min: 10,
        max: 48,
        group: "Main Copy",
      },
      {
        key: "title",
        label: "Tagline",
        type: "text",
        default: "Where Aesthetics Meets Quality in Oral Care",
        group: "Main Copy",
      },
      {
        key: "description",
        label: "Description",
        type: "textarea",
        default:
          "SB Alliance is a leading manufacturer of toothbrush products in Pakistan, supplying locally and to our export client base across the MENA region. We embrace ergonomic designs and aim to strike a balance between quality and price sensitivity.",
        group: "Main Copy",
      },
      { key: "image", label: "Hero image (optional)", type: "image", default: "", group: "Main Copy" },
      {
        key: "video",
        label: "Hero video URL (optional, shows instead of image)",
        type: "text",
        default: "",
        group: "Main Copy",
      },
      {
        key: "slides",
        label: "Banner slider images (used instead of the single hero image above, if any are added)",
        type: "listOfObjects",
        itemFields: [{ key: "image", label: "Slide image", type: "image" }],
        default: [],
        group: "Main Copy",
      },
      {
        key: "primaryCtaLabel",
        label: "Primary button label",
        type: "text",
        default: "Start an Inquiry",
        group: "Buttons",
      },
      { key: "primaryCtaLink", label: "Primary button link", type: "pageLink", default: "/contact", group: "Buttons" },
      {
        key: "secondaryCtaLabel",
        label: "Secondary button label",
        type: "text",
        default: "View Dr. Choice Range",
        group: "Buttons",
      },
      {
        key: "secondaryCtaLink",
        label: "Secondary button link",
        type: "pageLink",
        default: "/#products",
        group: "Buttons",
      },
      {
        key: "stats",
        label: "Trust stats",
        type: "listOfObjects",
        itemFields: [
          { key: "value", label: "Value", type: "text" },
          { key: "label", label: "Label", type: "textarea" },
        ],
        default: [
          { value: "4%", label: "Pakistan market share" },
          { value: "75%", label: "Of sales from exports" },
          { value: "20M+", label: "Toothbrushes produced yearly" },
          { value: "40,000 sqft", label: "Manufacturing facility" },
        ],
        group: "Trust Stats",
      },
    ],
  },
  {
    key: "productsHome",
    label: "Products Section",
    page: "Home",
    fields: [
      { key: "enabled", label: "Show this section on the site", type: "toggle", default: true },
      { key: "eyebrow", label: "Eyebrow", type: "text", default: "The Dr. Choice Range" },
      { key: "eyebrowSize", label: "Eyebrow label size", type: "number", default: 12, min: 10, max: 48 },
      { key: "heading1", label: "Heading line 1", type: "text", default: "Toothbrush ranges manufactured for" },
      { key: "heading2", label: "Heading line 2", type: "text", default: "local and export markets alike." },
      {
        key: "ctaLink",
        label: "\"Download Catalog\" fallback link (used until a PDF is uploaded)",
        type: "pageLink",
        default: "/#products",
      },
      {
        key: "catalogPdfUrl",
        label: "Downloadable catalog PDF (optional URL)",
        type: "text",
        default: "",
      },
      {
        key: "selectedProducts",
        label: "Which products to show",
        type: "products",
        count: 4,
        default: [],
      },
    ],
  },
  {
    key: "catalogHome",
    label: "Catalog Section",
    page: "Home",
    fields: [
      { key: "enabled", label: "Show this section on the site", type: "toggle", default: true },
      { key: "eyebrow", label: "Eyebrow", type: "text", default: "Catalog", group: "Heading" },
      {
        key: "heading1",
        label: "Heading line 1",
        type: "text",
        default: "Explore the full Dr. Choice lineup",
        group: "Heading",
      },
      {
        key: "heading2",
        label: "Heading line 2",
        type: "text",
        default: "six ranges, one manufacturing standard.",
        group: "Heading",
      },
      {
        key: "selectedProducts",
        label: "Which products to show",
        type: "products",
        count: 4,
        slotLabels: ["Featured product", "Item 2", "Item 3", "Item 4"],
        default: [],
        group: "Products to Show",
      },
    ],
  },
  {
    key: "whyChooseUs",
    label: "Why Choose Us",
    page: "Home",
    fields: [
      { key: "enabled", label: "Show this section on the site", type: "toggle", default: true },
      { key: "eyebrow", label: "Eyebrow", type: "text", default: "Why SB Alliance" },
      { key: "eyebrowSize", label: "Eyebrow label size", type: "number", default: 30, min: 10, max: 60 },
      {
        key: "description",
        label: "Description",
        type: "textarea",
        default: "From raw material sourcing to final packaging, every stage of production is built to one consistent quality standard.",
      },
      {
        key: "headingPrefix",
        label: "Heading (before highlight)",
        type: "text",
        default: "A manufacturing partner built for",
      },
      { key: "headingHighlight", label: "Heading highlight", type: "text", default: "scale and consistency" },
      { key: "headingHighlightColor", label: "Highlight color", type: "color", default: "#ec93a6" },
      {
        key: "headingSuffix",
        label: "Heading (after highlight)",
        type: "text",
        default: "trusted by partners across Pakistan and the MENA region.",
      },
      {
        key: "reasons",
        label: "Reasons",
        type: "listOfObjects",
        itemFields: [
          { key: "title", label: "Title", type: "text" },
          { key: "desc", label: "Description", type: "textarea" },
        ],
        default: [
          {
            title: "Export-Grade Quality",
            desc: "Every range is manufactured and tested to meet the standards of our international export partners.",
          },
          {
            title: "Reliable Capacity",
            desc: "20 million+ units produced annually from our Sundar Industrial Estate facility.",
          },
          {
            title: "Ergonomic Design Expertise",
            desc: "Each range is engineered to balance everyday comfort with price sensitivity.",
          },
          {
            title: "Trusted Locally and Abroad",
            desc: "A growing share of Pakistan's market, with 75% of sales going to export.",
          },
        ],
      },
    ],
  },
  {
    key: "brandsHome",
    label: "Brands We Work With",
    page: "Home",
    fields: [
      { key: "enabled", label: "Show this section on the site", type: "toggle", default: true },
      { key: "eyebrow", label: "Eyebrow", type: "text", default: "Our Partners" },
      { key: "eyebrowSize", label: "Eyebrow label size", type: "number", default: 12, min: 10, max: 48 },
      { key: "heading", label: "Heading", type: "text", default: "Brands we manufacture for." },
      { key: "badgeLabel", label: "Badge label", type: "text", default: "Private Label" },
      {
        key: "brands",
        label: "Brands",
        type: "listOfObjects",
        itemFields: [
          { key: "name", label: "Brand name", type: "text" },
          { key: "logo", label: "Logo (optional)", type: "image" },
        ],
        default: [
          { name: "BrushUp", logo: "" },
          { name: "Nayaab", logo: "" },
          { name: "Charlie Gold", logo: "" },
          { name: "Arak", logo: "" },
          { name: "KLOVE Active", logo: "" },
          { name: "#EveryOne", logo: "" },
        ],
      },
    ],
  },
  {
    key: "testimonials",
    label: "Testimonials",
    page: "Home",
    fields: [
      { key: "enabled", label: "Show this section on the site", type: "toggle", default: true },
      { key: "eyebrow", label: "Eyebrow", type: "text", default: "Testimonials" },
      { key: "eyebrowSize", label: "Eyebrow label size", type: "number", default: 12, min: 10, max: 48 },
      { key: "heading1", label: "Heading line 1", type: "text", default: "Trusted by thousands" },
      { key: "heading2", label: "Heading line 2", type: "text", default: "of happier smiles." },
      {
        key: "subtext",
        label: "Subtext",
        type: "textarea",
        default: "Every brush is designed around real routines, here's what people are saying after making the switch.",
      },
      {
        key: "items",
        label: "Testimonials",
        type: "listOfObjects",
        itemFields: [
          { key: "quote", label: "Quote", type: "textarea" },
          { key: "name", label: "Name", type: "text" },
          { key: "role", label: "Role", type: "text" },
        ],
        default: [
          {
            quote: "Switching to the SB Alliance brush changed my morning routine completely. It feels noticeably more thorough than anything I've used before.",
            name: "Sarah M.",
            role: "Verified customer",
          },
          {
            quote: "The battery genuinely lasts weeks, not days. I travel a lot and never have to think about packing a charger.",
            name: "Daniel K.",
            role: "Verified customer",
          },
          {
            quote: "Simple, effective, well built. My dentist actually asked what brush I was using at my last cleaning.",
            name: "Priya R.",
            role: "Verified customer",
          },
        ],
      },
    ],
  },
  {
    key: "faq",
    label: "FAQ",
    page: "Home",
    fields: [
      { key: "enabled", label: "Show this section on the site", type: "toggle", default: true },
      { key: "eyebrow", label: "Eyebrow", type: "text", default: "FAQ" },
      { key: "eyebrowSize", label: "Eyebrow label size", type: "number", default: 12, min: 10, max: 48 },
      { key: "heading1", label: "Heading line 1", type: "text", default: "Common questions," },
      { key: "heading2", label: "Heading line 2", type: "text", default: "answered clearly." },
      {
        key: "subtext",
        label: "Subtext",
        type: "textarea",
        default: "Still deciding? Here's what people usually ask before ordering their first SB Alliance brush, from battery life to what ships in the box.",
      },
      {
        key: "items",
        label: "Questions",
        type: "listOfObjects",
        itemFields: [
          { key: "q", label: "Question", type: "text" },
          { key: "a", label: "Answer", type: "textarea" },
        ],
        default: [
          { q: "How long does the battery last?", a: "A full charge gives you up to 30 days of daily use, so you can go weeks between charges." },
          { q: "How often should I replace the brush head?", a: "We recommend replacing your brush head every 3 months, or sooner if the bristles start to fray." },
          { q: "Is it safe for sensitive teeth and gums?", a: "Yes. The dual-action motor has multiple intensity settings, including a gentle mode built for sensitive teeth and gums." },
          { q: "Is the brush waterproof?", a: "Yes, it's fully waterproof and safe to use in the shower." },
          { q: "What's included in the box?", a: "Your brush, a charging base, a starter brush head, and a travel case." },
        ],
      },
    ],
  },
  {
    key: "footer",
    label: "Footer",
    page: "Global",
    fields: [
      {
        key: "description",
        label: "Description",
        type: "textarea",
        default: "Thoughtfully engineered oral care, built for a cleaner, healthier smile every single day.",
        group: "Brand",
      },
      {
        key: "newsletterText",
        label: "Newsletter text",
        type: "textarea",
        default: "New drops, restocks, and routine tips no spam.",
        group: "Brand",
      },
      {
        key: "instagramUrl",
        label: "Instagram URL",
        type: "text",
        default: "#",
        group: "Social Links",
      },
      { key: "xUrl", label: "X (Twitter) URL", type: "text", default: "#", group: "Social Links" },
      { key: "linkedinUrl", label: "LinkedIn URL", type: "text", default: "#", group: "Social Links" },
      {
        key: "companyLinks",
        label: "Company column links",
        type: "listOfObjects",
        itemFields: [
          { key: "label", label: "Label", type: "text" },
          { key: "href", label: "Link", type: "text" },
        ],
        default: [
          { label: "Who We Are", href: "/#about" },
          { label: "Why SB Alliance", href: "/#why-us" },
          { label: "Products", href: "/#products" },
          { label: "Facility & Process", href: "/#facility" },
        ],
        group: "Company Links",
      },
      {
        key: "supportLinks",
        label: "Support column links",
        type: "listOfObjects",
        itemFields: [
          { key: "label", label: "Label", type: "text" },
          { key: "href", label: "Link", type: "text" },
        ],
        default: [
          { label: "FAQ", href: "/#faq" },
          { label: "Shipping", href: "/#faq" },
          { label: "Returns", href: "/#faq" },
          { label: "Warranty", href: "/#faq" },
        ],
        group: "Support Links",
      },
      {
        key: "creditText",
        label: "Credit text (year is added automatically)",
        type: "text",
        default: "SB Alliance. All rights reserved.",
        group: "Bottom Bar",
      },
      {
        key: "privacyLink",
        label: "Privacy Policy link",
        type: "pageLink",
        default: "#",
        group: "Bottom Bar",
      },
      {
        key: "termsLink",
        label: "Terms of Service link",
        type: "pageLink",
        default: "#",
        group: "Bottom Bar",
      },
    ],
  },
  {
    key: "about",
    label: "About Page",
    page: "About",
    fields: [
      {
        key: "heroTitle",
        label: "Hero title",
        type: "text",
        default: "A manufacturing partner rooted in craft, built for scale.",
      },
      {
        key: "heroSubtext",
        label: "Hero subtext",
        type: "textarea",
        default:
          "SB Alliance is a leading manufacturer of toothbrush products in Pakistan, supplying locally and to our export client base across the MENA region.",
      },
      {
        key: "storyHeading",
        label: "Story heading",
        type: "text",
        default: "Decades of experience, one manufacturing standard.",
      },
      {
        key: "storyPara1",
        label: "Story paragraph 1",
        type: "textarea",
        default:
          "SB Alliance is a family-run business built over more than a decade, backed by partners with 50+ years of combined experience in oral care manufacturing.",
      },
      {
        key: "storyPara2",
        label: "Story paragraph 2",
        type: "textarea",
        default:
          "We embrace ergonomic designs and aim to strike a balance between quality and price sensitivity, manufacturing every range under the Dr. Choice name to one consistent standard, from raw material sourcing to final packaging.",
      },
      { key: "storyImage", label: "Story image", type: "image", default: "" },
      {
        key: "labelSize",
        label: "Small label size (Who We Are, Our Story, What We Stand For)",
        type: "number",
        default: 15,
        min: 10,
        max: 48,
      },
    ],
  },
  {
    key: "facility",
    label: "Facility & Process Page",
    page: "Facility",
    fields: [
      {
        key: "heroTitle",
        label: "Hero title",
        type: "text",
        default: "Built for consistency, at scale.",
      },
      {
        key: "eyebrowSize",
        label: "Eyebrow label size (Facility & Process)",
        type: "number",
        default: 20,
        min: 10,
        max: 48,
      },
      {
        key: "heroSubtext",
        label: "Hero subtext",
        type: "textarea",
        default:
          "Every Dr. Choice toothbrush is manufactured end-to-end at our facility in Sundar Industrial Estate, Lahore, from raw material to final packaging.",
      },
      {
        key: "facilityHeading",
        label: "Facility heading",
        type: "text",
        default: "Sundar Industrial Estate, Lahore.",
      },
      {
        key: "facilityPara1",
        label: "Facility paragraph 1",
        type: "textarea",
        default:
          "Our production facility sits on a 40,000 sqft plot with 10,000 sqft of covered manufacturing space, purpose-built for toothbrush production at scale.",
      },
      {
        key: "facilityPara2",
        label: "Facility paragraph 2",
        type: "textarea",
        default:
          "With a production capacity of 20 million+ units per year, the facility supplies both our domestic market and our export client base across the MENA region.",
      },
      { key: "facilityImage", label: "Facility image", type: "image", default: "" },
    ],
  },
  {
    key: "categories",
    label: "Product Categories",
    page: "Catalog",
    fields: [
      {
        key: "items",
        label: "Categories",
        type: "list",
        default: ["Wave Action", "Optic Care", "Classic", "Super Classic", "Comfort", "Flexocare"],
      },
    ],
  },
  {
    key: "contact",
    label: "Contact Page",
    page: "Contact",
    fields: [
      { key: "heading", label: "Heading", type: "text", default: "Start an inquiry with the SB Alliance team." },
      {
        key: "subtext",
        label: "Subtext",
        type: "textarea",
        default:
          "Whether you're exploring the Dr. Choice range, a private label partnership, or an export order, send us a message and we'll get back to you within one business day.",
      },
      { key: "email", label: "Email", type: "text", default: "enquiry@sba.com.pk" },
      { key: "phone", label: "Phone", type: "text", default: "+92 300 9878789" },
      {
        key: "officeAddress",
        label: "Head office address",
        type: "text",
        default: "DHA, Lahore, Pakistan",
      },
      {
        key: "factoryAddress",
        label: "Factory address",
        type: "text",
        default: "Sundar Industrial Estate, Lahore, Pakistan",
      },
    ],
  },
];

export function getSectionDefaults(section: SectionDef): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of section.fields) out[f.key] = f.default;
  return out;
}

export function getAllDefaults(): Record<string, Record<string, unknown>> {
  const out: Record<string, Record<string, unknown>> = {};
  for (const s of contentSchema) out[s.key] = getSectionDefaults(s);
  return out;
}
