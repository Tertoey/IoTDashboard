"use client";

import { createContext, useContext, useState } from "react";

type Context = {};

const NavContext = createContext<any>(undefined);

export function NavWrapper({ children }: { children: React.ReactNode }) {
  let [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <NavContext.Provider value={{ isNavOpen, setIsNavOpen }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNavContext() {
  return useContext(NavContext);
}
