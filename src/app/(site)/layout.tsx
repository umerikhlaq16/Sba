"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Spinner from "@/components/Spinner";
import { ContentProvider, useContent } from "@/contexts/ContentContext";
import { FooterVisibilityProvider, useFooterVisibility } from "@/contexts/FooterVisibilityContext";

function FooterGate() {
  const { hideFooter } = useFooterVisibility();
  if (hideFooter) return null;
  return <Footer />;
}

// Content starts as hardcoded schema defaults and gets replaced once
// Firestore's real data arrives — rendering immediately caused a visible
// flash from default copy to the real, saved content. Waiting for
// `loading` to clear means the page only ever shows the real data.
function SiteReady({ children }: { children: React.ReactNode }) {
  const { loading } = useContent();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner size={32} className="border-foreground/15 border-t-brand" />
      </div>
    );
  }
  return <>{children}</>;
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ContentProvider>
      <FooterVisibilityProvider>
        <SiteReady>
          <div className="site-flat">
            <Navbar />
            {children}
            <FooterGate />
          </div>
        </SiteReady>
      </FooterVisibilityProvider>
    </ContentProvider>
  );
}
