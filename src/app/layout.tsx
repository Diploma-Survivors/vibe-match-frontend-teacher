import type React from 'react';
import './globals.css';
import './styles/editor-theme.css';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { ServerProvider } from '@/components/providers/server-provider';
import { ThemeProvider } from '@/components/theme-provider';
import ConditionalLayout from '@/layout/conditional-layout';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SolVibe - Decentralized Social Media on Solana',
  description:
    'Empowering creators with decentralized ownership, privacy, and fair rewards.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={inter.className}>
        <ServerProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </ServerProvider>
      </body>
    </html>
  );
}
