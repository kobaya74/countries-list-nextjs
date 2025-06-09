import React from 'react';
import Header from '@/features/layout/Header';
import Footer from '@/features/layout/Footer';

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className='container mx-auto'>{children}</main>
      <Footer />
    </>
  );
}
