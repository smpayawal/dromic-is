"use client";

import React from 'react';

export default function ViewMatrixPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <header className="space-y-3 px-2">
        <h1 className="text-3xl font-bold text-main-color">DROMIC Matrix</h1>
        <p className="text-gray-600">
          View current DROMIC matrix data and disaster response information.
        </p>
      </header>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Matrix Overview</h2>
        <p className="text-gray-600">This page will display the DROMIC matrix view interface.</p>
      </div>
    </div>
  );
}
