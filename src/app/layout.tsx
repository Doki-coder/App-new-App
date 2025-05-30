import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { UserProvider } from '@/contexts/user-provider';
import { Toaster } from '@/components/ui/toaster';
import RootLayoutClient from './root-layout-client';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'برنامه دخل و خرج',
  description: 'مدیریت هوشمند دخل و خرج شخصی شما',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <RootLayoutClient>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {children}
          <Toaster />
        </body>
      </RootLayoutClient>
    </UserProvider>
  );
}
