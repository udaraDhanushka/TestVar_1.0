import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Testvar',
  description: 'Learn and memorize with flashcards',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full m-0">
      <body className={`${inter.className} h-full m-0`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
