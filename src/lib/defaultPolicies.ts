import type { PolicyPage } from "@/lib/policyPages";

// Built-in Privacy Policy and Terms pages, shown when no published page with the
// same slug exists in the admin panel. Publishing a page with the same slug from
// Admin → Policy Pages replaces these. Have them reviewed before relying on them.

const base = {
  seoDescription: "",
  featuredImage: "",
  status: "published" as const,
  createdAt: 0,
  updatedAt: 0,
  publishedAt: null,
};

export const defaultPolicies: PolicyPage[] = [
  {
    ...base,
    id: "default-privacy-policy",
    slug: "privacy-policy",
    title: "Privacy Policy",
    seoTitle: "Privacy Policy | SB Alliance",
    content: `
<p>This Privacy Policy explains how SB Alliance ("we", "us") collects and uses information when you visit this website or contact us.</p>
<h2>Information we collect</h2>
<ul>
  <li><strong>Inquiry details</strong> you submit through our contact form: your name, company, email address, phone number and message.</li>
  <li><strong>Newsletter sign-ups</strong>: your email address, if you choose to subscribe.</li>
  <li><strong>Basic technical data</strong> such as browser type and pages visited, collected by our hosting provider for security and performance.</li>
</ul>
<h2>How we use it</h2>
<ul>
  <li>To respond to your inquiry and discuss orders, private label or export partnerships.</li>
  <li>To send updates you have asked to receive. You can unsubscribe at any time by emailing us.</li>
  <li>To keep the website secure and working properly.</li>
</ul>
<p>We do not sell your personal information. We share it only with service providers that help us run this website (such as hosting and database providers), and when required by law.</p>
<h2>Retention</h2>
<p>We keep inquiry and subscriber information only as long as needed for the purposes above or as required for our business records.</p>
<h2>Your choices</h2>
<p>You may ask us to access, correct or delete the personal information we hold about you by contacting us at <a href="mailto:enquiry@sba.com.pk">enquiry@sba.com.pk</a>.</p>
<h2>Contact</h2>
<p>SB Alliance, DHA, Lahore, Pakistan · <a href="mailto:enquiry@sba.com.pk">enquiry@sba.com.pk</a></p>
`,
  },
  {
    ...base,
    id: "default-terms-of-service",
    slug: "terms-of-service",
    title: "Terms of Service",
    seoTitle: "Terms of Service | SB Alliance",
    content: `
<p>By using this website you agree to these terms. If you do not agree, please do not use the site.</p>
<h2>About this website</h2>
<p>This website provides information about SB Alliance and the Dr. Choice toothbrush range for business customers, distributors and partners. It does not sell products directly to consumers.</p>
<h2>Product information</h2>
<p>We aim to keep product descriptions, specifications and images accurate, but they are for general information only and may change without notice. Final specifications, pricing, minimum order quantities and delivery terms are agreed in writing for each order.</p>
<h2>Intellectual property</h2>
<p>The SB Alliance and Dr. Choice names, logos, images and content on this site belong to SB Alliance or its partners and may not be copied or used without permission. Partner brand names shown belong to their respective owners.</p>
<h2>Downloads</h2>
<p>Catalogs and documents on this site are provided for evaluating our products and may not be redistributed for other purposes.</p>
<h2>Limitation of liability</h2>
<p>This website is provided "as is". To the extent permitted by law, SB Alliance is not liable for any loss arising from use of the website or reliance on its content.</p>
<h2>Governing law</h2>
<p>These terms are governed by the laws of Pakistan, and disputes are subject to the courts of Lahore.</p>
<h2>Contact</h2>
<p>Questions about these terms: <a href="mailto:enquiry@sba.com.pk">enquiry@sba.com.pk</a></p>
`,
  },
];

export function getDefaultPolicy(slug: string) {
  return defaultPolicies.find((p) => p.slug === slug) ?? null;
}
