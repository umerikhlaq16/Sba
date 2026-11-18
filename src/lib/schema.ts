export type FieldType = "text" | "textarea" | "image" | "list" | "listOfObjects" | "products" | "pageLink" | "toggle" | "color" | "number";

export const pageLinkOptions: { label: string; value: string }[] = [
  { label: "Home", value: "/" },
  { label: "Who We Are (section)", value: "/#about" },
  { label: "Products (section)", value: "/#products" },
  { label: "Facility & Process (section)", value: "/#facility" },
  { label: "Our Partners (section)", value: "/#partners" },
  { label: "Contact", value: "/contact" },
  { label: "Privacy Policy", value: "/privacy-policy" },
  { label: "Terms of Service", value: "/terms-of-service" },
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
        key: "title",
        label: "Tagline",
        type: "text",
        default: "Where aesthetics meets quality in oral care",
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
    ],
  },
  {
    key: "productsHome",
    label: "Products Section",
    page: "Home",
    fields: [
      { key: "enabled", label: "Show this section on the site", type: "toggle", default: true },
      { key: "eyebrow", label: "Eyebrow", type: "text", default: "The Dr. Choice Range" },
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
        default: "/dr-choice-catalog.pdf",
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
    key: "brandsHome",
    label: "Brands We Work With",
    page: "Home",
    fields: [
      { key: "enabled", label: "Show this section on the site", type: "toggle", default: true },
      { key: "eyebrow", label: "Eyebrow", type: "text", default: "Our Partners" },
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
    key: "footer",
    label: "Footer",
    page: "Global",
    fields: [
      {
        key: "description",
        label: "Description",
        type: "textarea",
        default: "Toothbrush manufacturer in Lahore, Pakistan, making the Dr. Choice range and private label brushes for local and export partners.",
        group: "Brand",
      },
      {
        key: "newsletterText",
        label: "Newsletter text",
        type: "textarea",
        default: "Product launches, catalog updates and export news. No spam.",
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
          { label: "Start an Inquiry", href: "/contact" },
          { label: "Download Catalog", href: "/dr-choice-catalog.pdf" },
          { label: "Our Partners", href: "/#partners" },
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
        default: "/privacy-policy",
        group: "Bottom Bar",
      },
      {
        key: "termsLink",
        label: "Terms of Service link",
        type: "pageLink",
        default: "/terms-of-service",
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
      { key: "storyImage", label: "Main photo (large, on the left)", type: "image", default: "" },
      {
        key: "gallery",
        label: "More photos (up to 4, shown beside the main photo)",
        type: "listOfObjects",
        itemFields: [{ key: "image", label: "Photo", type: "image" }],
        default: [],
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
        key: "heroSubtext",
        label: "Hero subtext",
        type: "textarea",
        default:
          "Every toothbrush is manufactured end-to-end at our facility in Sundar Industrial Estate, Lahore, from raw material to final packaging.",
      },
      { key: "facilityImage", label: "Facility photo (full width)", type: "image", default: "" },
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
