import React from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const TagsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[196px_1fr] lg:grid-cols-[224px_1fr] bg-background">
      <Sidebar />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex flex-1 flex-col gap-6 p-6 lg:gap-8 lg:p-8 bg-background">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default TagsLayout;