'use client';

import type { UserInfo } from '@/types/states';
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
  initialIssuer: 'local' | 'moodle';
}

interface AppContextType {
  user: UserInfo | null;
  issuer: 'local' | 'moodle';
  isInDedicatedPages: boolean;
  shouldHideNavigation: boolean;
  isLoading: boolean;
  clearUserData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const dedicatedPagesPattern =
  process.env.NEXT_PUBLIC_DEDICATED_PAGES_PATTERN ||
  '/problems/(?:create|[^/]+(?:/(create|edit))?)';

export function AppProvider({
  children,
  initialUser,
  initialIssuer,
}: AppProviderProps) {
  const [user, setUser] = useState<UserInfo | null>(initialUser);
  const [issuer, setIssuer] = useState<'local' | 'moodle'>(initialIssuer);
  const [isLoading, setIsLoading] = useState(false);

  const pathname = usePathname();

  const DEDICATED_PAGES_REGEX = new RegExp(`^${dedicatedPagesPattern}$`);
  const isInDedicatedPages = DEDICATED_PAGES_REGEX.test(pathname);
  const shouldHideNavigation = issuer === 'moodle' && isInDedicatedPages;

  const clearUserData = () => {
    setUser(null);
    setIssuer('local');
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
