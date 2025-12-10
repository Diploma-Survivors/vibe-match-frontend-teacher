'use client';

import { ThemeProvider } from '@/components/providers';
import { AppProvider } from '@/contexts/app-context';
import { ReduxProvider } from '@/store/providers';
import type { IssuerType, UserInfo } from '@/types/states';
import Dialog from '@mui/material/Dialog';
import { SessionProvider } from 'next-auth/react';
import { DialogProvider } from './dialog-provider';
import { ToastProvider } from './toast-provider';

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
        <DialogProvider>
          <ToastProvider>
            <ReduxProvider>
              <AppProvider
                initialUser={initialUser}
                initialIssuer={initialIssuer}
              >
                {children}
              </AppProvider>
            </ReduxProvider>
          </ToastProvider>
        </DialogProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
