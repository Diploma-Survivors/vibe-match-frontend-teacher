'use client';

import type { UserInfo } from '@/types/states';
import { IssuerType } from '@/types/states';
import { usePathname } from 'next/navigation';
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

interface AppProviderProps {
  children: ReactNode;
  initialUser: UserInfo | null;
  initialIssuer: IssuerType;
}

interface AppContextType {
  user: UserInfo | null;
  issuer: IssuerType;
  isInDedicatedPages: boolean;
  shouldHideNavigation: boolean;
  isLoading: boolean;
  clearUserData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const dedicatedPagesPattern =
  process.env.NEXT_PUBLIC_DEDICATED_PAGES_PATTERN ||
  '^(?:/problems/(?:create|[^/]+(?:/(create|edit))?)|/contests/(?:create|[^/]+(?:/(?:edit|stats|standing|submissions)))|/options)$';

export function AppProvider({
  children,
  initialUser,
  initialIssuer,
}: AppProviderProps) {
  const [user, setUser] = useState<UserInfo | null>(initialUser);
  const [issuer, setIssuer] = useState<IssuerType>(initialIssuer);
  const [isLoading, setIsLoading] = useState(false);

  const pathname = usePathname();

  const DEDICATED_PAGES_REGEX = new RegExp(dedicatedPagesPattern);
  const isInDedicatedPages = DEDICATED_PAGES_REGEX.test(pathname);
  const shouldHideNavigation =
    issuer === IssuerType.MOODLE && isInDedicatedPages;

  const clearUserData = () => {
    setUser(null);
    setIssuer(IssuerType.LOCAL);
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
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
