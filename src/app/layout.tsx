import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
// Import Youwe Component Library styles
import '@/styles/globals.css';
import '@youwe/component-library/styles/variables/core.css';
import '@youwe/component-library/styles/variables/responsive.css';
import '@youwe/component-library/styles/globals.css';
import '@youwe/component-library/styles/motion.css';
import { ApolloWrapper } from '@/lib/apollo';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Next.js Assignment',
    default: 'Next.js Assignment',
  },
  description:
    'A Next.js project with TypeScript, Yarn, and the Youwe Component Library',
  keywords: ['Next.js', 'React', 'TypeScript', 'Youwe Component Library'],
  authors: [{ name: 'Your Name' }],
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex flex-col font-sans antialiased`}
      >
        <div className='flex flex-grow flex-col'>
          <ApolloWrapper>{children}</ApolloWrapper>
        </div>
      </body>
    </html>
  );
}
