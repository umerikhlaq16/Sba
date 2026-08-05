import type { Metadata } from "next";
import ContactPageClient from "@/components/ContactPageClient";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start an inquiry with SB Alliance — export orders, private label partnerships, and general inquiries for our Dr. Choice toothbrush range.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
