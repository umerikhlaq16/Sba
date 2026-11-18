import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type Inquiry = {
  name: string;
  company: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export type StoredInquiry = Inquiry & {
  id: string;
  createdAt: number;
  status: "new" | "read";
};

/**
 * Saves an inquiry to Firestore. Returns false when Firebase is not configured,
 * so the caller can fall back to opening the visitor's email app.
 */
export async function submitInquiry(data: Inquiry): Promise<boolean> {
  if (!db) return false;
  await addDoc(collection(db, "inquiries"), {
    ...data,
    status: "new",
    createdAt: Date.now(),
  });
  return true;
}

export async function submitSubscriber(email: string): Promise<boolean> {
  if (!db) return false;
  await addDoc(collection(db, "subscribers"), { email, createdAt: Date.now() });
  return true;
}

export function inquiryMailto(to: string, data: Inquiry) {
  const subject = `Website inquiry${data.subject ? `: ${data.subject}` : ""}`;
  const body = [
    `Name: ${data.name}`,
    `Company: ${data.company}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    "",
    data.message,
  ].join("\n");
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
