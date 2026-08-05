"use client";

import { createContext, useContext, useState } from "react";

type FooterVisibilityValue = {
  hideFooter: boolean;
  setHideFooter: (hidden: boolean) => void;
};

const FooterVisibilityContext = createContext<FooterVisibilityValue>({
  hideFooter: false,
  setHideFooter: () => {},
});

export function FooterVisibilityProvider({ children }: { children: React.ReactNode }) {
  const [hideFooter, setHideFooter] = useState(false);
  return (
    <FooterVisibilityContext.Provider value={{ hideFooter, setHideFooter }}>
      {children}
    </FooterVisibilityContext.Provider>
  );
}

export function useFooterVisibility() {
  return useContext(FooterVisibilityContext);
}
