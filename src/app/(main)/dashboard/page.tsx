"use client";

import React from 'react';

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold text-main-color mb-6">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Add your dashboard content here */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Welcome to DROMIC-IS</h2>
          <p className="text-gray-600">
            This is your dashboard. You can manage disaster response operations and monitor information here.
          </p>
        </div>
      </div>
    </div>
  );
}
