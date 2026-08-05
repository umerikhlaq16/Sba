export type PolicyStatus = "draft" | "published";

export type PolicyPage = {
  id: string;
  title: string;
  slug: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  featuredImage: string;
  status: PolicyStatus;
  createdAt: number;
  updatedAt: number;
  publishedAt: number | null;
};

export const emptyPolicyPage: Omit<PolicyPage, "id"> = {
  title: "",
  slug: "",
  content: "",
  seoTitle: "",
  seoDescription: "",
  featuredImage: "",
  status: "draft",
  createdAt: 0,
  updatedAt: 0,
  publishedAt: null,
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
