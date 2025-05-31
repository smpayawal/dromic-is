import React from 'react';
import Navbar from './navigation/navbar'; // Import the Navbar component

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {  // Here you might add logic to check if the user is authenticated
  // For now, we assume the user is logged in if they reach this layout.
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar /> {/* Render the navigation bar */}
      <main className="flex-grow pt-20 md:pt-24 lg:pt-28 px-2 sm:px-4 md:px-6 lg:px-8 bg-gray-50"> {/* Reduced top padding for a more compact dashboard */}
        {children} {/* Render the specific page content */}
      </main>
      {/* You could add a footer here if needed */}
    </div>
  );
}
