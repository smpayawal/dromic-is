import React from 'react';
import Navbar from './navigation/navbar'; // Import the Navbar component

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Here you might add logic to check if the user is authenticated
  // For now, we assume the user is logged in if they reach this layout.
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar /> {/* Render the navigation bar */}
      <main className="flex-grow pt-20 md:pt-24 p-4"> {/* Add top padding to account for sticky navbar */}
        {children} {/* Render the specific page content */}
      </main>
      {/* You could add a footer here if needed */}
    </div>
  );
}
