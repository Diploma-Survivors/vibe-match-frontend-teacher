'use client';

import { ThemeProvider } from '@/components/providers';
import { AppProvider } from '@/contexts/app-context';
import type { IssuerType, UserInfo } from '@/types/states';
import { SessionProvider } from 'next-auth/react';

interface ClientProviderProps {
  children: React.ReactNode;
  initialUser: UserInfo | null;
  initialIssuer: IssuerType;
}

export function ClientProvider({
  children,
  initialUser,
  initialIssuer,
}: ClientProviderProps) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AppProvider initialUser={initialUser} initialIssuer={initialIssuer}>
          {children}
        </AppProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
