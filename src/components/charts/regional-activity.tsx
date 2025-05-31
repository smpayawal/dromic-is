import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartCard } from '@/components/ui/chart-card';

interface RegionalActivityProps {
  className?: string;
}

const data = [
  { region: 'NCR', incidents: 45, resolved: 38, ongoing: 7 },
  { region: 'CAR', incidents: 32, resolved: 28, ongoing: 4 },
  { region: 'Region I', incidents: 28, resolved: 24, ongoing: 4 },
  { region: 'Region II', incidents: 22, resolved: 20, ongoing: 2 },
  { region: 'Region III', incidents: 38, resolved: 32, ongoing: 6 },
  { region: 'Region IV-A', incidents: 41, resolved: 35, ongoing: 6 },
  { region: 'Region IV-B', incidents: 19, resolved: 17, ongoing: 2 },
  { region: 'Region V', incidents: 33, resolved: 28, ongoing: 5 },
];

export function RegionalActivityChart({ className }: RegionalActivityProps) {
  return (
    <ChartCard
      title="Regional Activity Overview"
      type="area"
      height={300}
      className={className}
    >
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2E3192" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#2E3192" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorOngoing" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#A43E3E" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#A43E3E" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="region" 
            stroke="#64748B"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#64748B"
            fontSize={12}
            label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
          />
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="resolved" 
            stackId="1"
            stroke="#2E3192" 
            fill="url(#colorResolved)"
            name="Resolved"
          />
          <Area 
            type="monotone" 
            dataKey="ongoing" 
            stackId="1"
            stroke="#A43E3E" 
            fill="url(#colorOngoing)"
            name="Ongoing"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
