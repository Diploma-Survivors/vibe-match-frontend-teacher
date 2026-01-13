'use client';

import { ThemeProvider } from '@/components/providers';
import { AppProvider } from '@/contexts/app-context';
import { ReduxProvider } from '@/store/providers';
import type { DecodedAccessToken, IssuerType, UserInfo } from '@/types/states';
import Dialog from '@mui/material/Dialog';
import { SessionProvider } from 'next-auth/react';
import { DialogProvider } from './dialog-provider';
import { ToastProvider } from './toast-provider';

interface ClientProviderProps {
  children: React.ReactNode;
  decodedAccessToken: DecodedAccessToken | null;
}

export function ClientProvider({
  children,
  decodedAccessToken,
}: ClientProviderProps) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <DialogProvider>
          <ToastProvider>
            <ReduxProvider>
              <AppProvider decodedAccessToken={decodedAccessToken}>
                {children}
              </AppProvider>
            </ReduxProvider>
          </ToastProvider>
        </DialogProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
