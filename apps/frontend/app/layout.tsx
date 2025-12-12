import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { APP_NAME } from '@repo/shared';
import { Header } from './components';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: APP_NAME,
  description:
    'Multi-AI Orchestration Service - Get consensus responses from OpenAI, Gemini, Claude, and Perplexity',
  keywords: ['AI', 'ChatGPT', 'Claude', 'Gemini', 'Perplexity', 'AI Orchestration'],
  authors: [{ name: 'AI Orchestrator' }],
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased bg-black`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
