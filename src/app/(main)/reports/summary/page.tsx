"use client";

import React from 'react';

export default function SummaryReportsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <header className="space-y-3 px-2">
        <h1 className="text-3xl font-bold text-main-color">Summary Reports</h1>
        <p className="text-gray-600">
          Comprehensive summary reports for disaster response activities.
        </p>
      </header>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Summary Analytics</h2>
        <p className="text-gray-600">This page will display summary reports and analytics.</p>
      </div>
    </div>
  );
}
