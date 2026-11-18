"use client";

import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LoadingScreen } from "@/components/Spinner";
import type { StoredInquiry } from "@/lib/submissions";

type Subscriber = { id: string; email: string; createdAt: number };

function formatDate(ms: number) {
  return new Date(ms).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<StoredInquiry[] | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [tab, setTab] = useState<"inquiries" | "subscribers">("inquiries");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (!db) return;
    const unsubInquiries = onSnapshot(
      query(collection(db, "inquiries"), orderBy("createdAt", "desc")),
      (snap) => setInquiries(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as StoredInquiry))
    );
    const unsubSubscribers = onSnapshot(
      query(collection(db, "subscribers"), orderBy("createdAt", "desc")),
      (snap) => setSubscribers(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Subscriber))
    );
    return () => {
      unsubInquiries();
      unsubSubscribers();
    };
  }, []);

  async function toggle(inq: StoredInquiry) {
    const opening = openId !== inq.id;
    setOpenId(opening ? inq.id : null);
    if (opening && inq.status === "new" && db) {
      await updateDoc(doc(db, "inquiries", inq.id), { status: "read" });
    }
  }

  async function removeInquiry(inq: StoredInquiry) {
    if (!db) return;
    if (!confirm(`Delete the inquiry from ${inq.name}? This cannot be undone.`)) return;
    await deleteDoc(doc(db, "inquiries", inq.id));
  }

  async function removeSubscriber(s: Subscriber) {
    if (!db) return;
    if (!confirm(`Remove ${s.email} from subscribers?`)) return;
    await deleteDoc(doc(db, "subscribers", s.id));
  }

  function exportSubscribers() {
    const csv = ["email,subscribed_at", ...subscribers.map((s) => `${s.email},${new Date(s.createdAt).toISOString()}`)].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (inquiries === null) return <LoadingScreen label="Loading inquiries..." />;

  const newCount = inquiries.filter((i) => i.status === "new").length;

  return (
    <div className="max-w-5xl">
      <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Inbox</p>
      <h1 className="mt-1 text-2xl text-gray-900">Inquiries &amp; subscribers</h1>

      <div className="mt-6 flex gap-2">
        {(["inquiries", "subscribers"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm ${
              tab === t ? "bg-gray-900 text-white" : "border border-gray-200 bg-white text-gray-600"
            }`}
          >
            {t === "inquiries" ? `Inquiries${newCount ? ` (${newCount} new)` : ""}` : `Subscribers (${subscribers.length})`}
          </button>
        ))}
      </div>

      {tab === "inquiries" ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
          {inquiries.length === 0 && <p className="p-8 text-center text-sm text-gray-500">No inquiries yet.</p>}
          {inquiries.map((inq) => (
            <div key={inq.id} className="border-b border-gray-100 last:border-b-0">
              <button onClick={() => toggle(inq)} className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-gray-50">
                <span className={`h-2 w-2 shrink-0 rounded-full ${inq.status === "new" ? "bg-pink-500" : "bg-transparent"}`} />
                <span className="min-w-0 flex-1">
                  <span className={`block truncate text-sm ${inq.status === "new" ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                    {inq.name}
                    {inq.company ? ` · ${inq.company}` : ""}
                  </span>
                  <span className="block truncate text-xs text-gray-500">{inq.subject || inq.message}</span>
                </span>
                <span className="shrink-0 text-xs text-gray-400">{formatDate(inq.createdAt)}</span>
              </button>
              {openId === inq.id && (
                <div className="space-y-3 bg-gray-50 px-5 py-5 text-sm text-gray-700 sm:pl-11">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <p>
                      <span className="text-gray-400">Email: </span>
                      <a className="text-gray-900 underline" href={`mailto:${inq.email}`}>
                        {inq.email}
                      </a>
                    </p>
                    {inq.phone && (
                      <p>
                        <span className="text-gray-400">Phone: </span>
                        <a className="text-gray-900 underline" href={`tel:${inq.phone}`}>
                          {inq.phone}
                        </a>
                      </p>
                    )}
                    {inq.subject && (
                      <p>
                        <span className="text-gray-400">Inquiry type: </span>
                        {inq.subject}
                      </p>
                    )}
                  </div>
                  <p className="whitespace-pre-wrap rounded-xl border border-gray-200 bg-white p-4">{inq.message}</p>
                  <div className="flex gap-3">
                    <a
                      href={`mailto:${inq.email}?subject=${encodeURIComponent(`Re: ${inq.subject || "Your inquiry"}`)}`}
                      className="rounded-full bg-gray-900 px-4 py-2 text-xs font-medium text-white"
                    >
                      Reply by email
                    </a>
                    <button onClick={() => removeInquiry(inq)} className="rounded-full border border-red-200 px-4 py-2 text-xs text-red-600">
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6">
          {subscribers.length > 0 && (
            <button onClick={exportSubscribers} className="mb-4 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700">
              Export CSV
            </button>
          )}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {subscribers.length === 0 && <p className="p-8 text-center text-sm text-gray-500">No subscribers yet.</p>}
            {subscribers.map((s) => (
              <div key={s.id} className="flex items-center gap-4 border-b border-gray-100 px-5 py-3 last:border-b-0">
                <span className="flex-1 truncate text-sm text-gray-800">{s.email}</span>
                <span className="text-xs text-gray-400">{formatDate(s.createdAt)}</span>
                <button onClick={() => removeSubscriber(s)} className="text-xs text-red-600">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
