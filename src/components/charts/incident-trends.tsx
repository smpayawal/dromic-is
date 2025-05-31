import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartCard } from '@/components/ui/chart-card';

interface IncidentTrendsProps {
  className?: string;
}

const data = [
  { month: 'Jan', incidents: 8, resolved: 6 },
  { month: 'Feb', incidents: 12, resolved: 10 },
  { month: 'Mar', incidents: 15, resolved: 13 },
  { month: 'Apr', incidents: 18, resolved: 16 },
  { month: 'May', incidents: 22, resolved: 20 },
  { month: 'Jun', incidents: 16, resolved: 14 },
  { month: 'Jul', incidents: 20, resolved: 18 },
  { month: 'Aug', incidents: 25, resolved: 22 },
  { month: 'Sep', incidents: 19, resolved: 17 },
  { month: 'Oct', incidents: 14, resolved: 12 },
  { month: 'Nov', incidents: 17, resolved: 15 },
  { month: 'Dec', incidents: 12, resolved: 11 },
];

export function IncidentTrendsChart({ className }: IncidentTrendsProps) {
  return (
    <ChartCard
      title="Incident Trends (Last 12 Months)"
      type="line"
      height={300}
      className={className}
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis 
            dataKey="month" 
            stroke="#64748B"
            fontSize={12}
          />
          <YAxis 
            stroke="#64748B"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="incidents" 
            stroke="#A43E3E" 
            strokeWidth={3}
            dot={{ fill: '#A43E3E', strokeWidth: 2, r: 4 }}
            name="Total Incidents"
          />
          <Line 
            type="monotone" 
            dataKey="resolved" 
            stroke="#2E3192" 
            strokeWidth={3}
            dot={{ fill: '#2E3192', strokeWidth: 2, r: 4 }}
            name="Resolved"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
