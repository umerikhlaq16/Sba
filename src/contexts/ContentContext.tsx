"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { collection, doc, getDocs, onSnapshot, writeBatch } from "firebase/firestore";
import { db, firebaseEnabled } from "@/lib/firebase";
import { contentSchema, getAllDefaults } from "@/lib/schema";
import { products as defaultProducts, type Product } from "@/lib/products";

type ContentMap = Record<string, Record<string, unknown>>;

type ContentContextValue = {
  content: ContentMap;
  products: Product[];
  loading: boolean;
  firebaseEnabled: boolean;
};

const ContentContext = createContext<ContentContextValue>({
  content: getAllDefaults(),
  products: defaultProducts,
  loading: false,
  firebaseEnabled: false,
});

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<ContentMap>(getAllDefaults());
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const seeded = useRef(false);
  const loadedSections = useRef(new Set<string>());
  const [contentReady, setContentReady] = useState(!firebaseEnabled);
  const [productsReady, setProductsReady] = useState(!firebaseEnabled);

  useEffect(() => {
    if (!firebaseEnabled || !db) return;
    const firestore = db;

    const unsubs = contentSchema.map((section) =>
      onSnapshot(doc(firestore, "content", section.key), (snap) => {
        if (snap.exists()) {
          setContent((prev) => ({
            ...prev,
            [section.key]: { ...prev[section.key], ...snap.data() },
          }));
        }
        loadedSections.current.add(section.key);
        if (loadedSections.current.size === contentSchema.length) {
          setContentReady(true);
        }
      })
    );

    async function seedProductsIfEmpty() {
      if (seeded.current) return;
      seeded.current = true;
      const existing = await getDocs(collection(firestore, "products"));
      if (existing.empty) {
        const batch = writeBatch(firestore);
        for (const p of defaultProducts) {
          const { slug, ...data } = p;
          batch.set(doc(firestore, "products", slug), data);
        }
        await batch.commit();
      }
    }
    seedProductsIfEmpty();

    const unsubProducts = onSnapshot(collection(firestore, "products"), (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map((d) => ({ slug: d.id, ...d.data() }) as Product);
        setProducts(list);
      }
      setProductsReady(true);
    });

    return () => {
      unsubs.forEach((u) => u());
      unsubProducts();
    };
  }, []);

  const loading = !(contentReady && productsReady);

  return (
    <ContentContext.Provider value={{ content, products, loading, firebaseEnabled }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}

export function useSection(key: string): Record<string, unknown> {
  const { content } = useContent();
  return content[key] ?? {};
}
