import React from 'react';
import Navbar from './navigation/navbar'; // Import the Navbar component
import Footer from '@/components/layout/footer'; // Import the Footer component
import { UserProvider } from '@/lib/contexts/UserContext';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow pt-5 px-2 sm:px-4 md:px-6 lg:px-8 bg-gray-50">
          {children}
        </main>
        <Footer />
      </div>
    </UserProvider>
  );
}
