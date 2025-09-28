"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { UserInfo } from "@/types/states";

interface AppProviderProps {
  children: ReactNode;
  initialUser: UserInfo | null;
  initialIssuer: "local" | "moodle";
}

interface AppContextType {
  user: UserInfo | null;
  issuer: "local" | "moodle";
  isInDedicatedPages: boolean;
  shouldHideNavigation: boolean;
  isLoading: boolean;
  clearUserData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const dedicatedPagesPattern = process.env.DEDICATED_PAGES_PATTERN || 
  "/problems/(?:create|[^/]+(?:/(create|edit))?)";


export function AppProvider({ children, initialUser, initialIssuer }: AppProviderProps) {
  const [user, setUser] = useState<UserInfo | null>(initialUser);
  const [issuer, setIssuer] = useState<"local" | "moodle">(initialIssuer);
  const [isLoading, setIsLoading] = useState(false);

  console.log("Initial Issuer:", initialIssuer);

  const pathname = usePathname();

  const DEDICATED_PAGES_REGEX = new RegExp(`^${dedicatedPagesPattern}$`);
  const isInDedicatedPages = DEDICATED_PAGES_REGEX.test(pathname);
  console.log("Current Pathname:", pathname);
  console.log("Is in Dedicated Pages:", isInDedicatedPages);
  const shouldHideNavigation = issuer === "moodle" && isInDedicatedPages;
  console.log("Should Hide Navigation:", shouldHideNavigation);

  const clearUserData = () => {
    setUser(null);
    setIssuer("local");
  };


  const value: AppContextType = {
    user,
    issuer,
    isInDedicatedPages,
    shouldHideNavigation,
    isLoading,
    clearUserData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
