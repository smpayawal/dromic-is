import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartCard } from '@/components/ui/chart-card';

interface ResponseTimeAnalysisProps {
  className?: string;
}

const data = [
  { category: 'Fire', avgTime: 8.5, target: 10 },
  { category: 'Flood', avgTime: 12.3, target: 15 },
  { category: 'Earthquake', avgTime: 6.2, target: 8 },
  { category: 'Landslide', avgTime: 14.7, target: 20 },
  { category: 'Typhoon', avgTime: 18.4, target: 24 },
  { category: 'Medical', avgTime: 4.8, target: 6 },
];

export function ResponseTimeChart({ className }: ResponseTimeAnalysisProps) {
  return (
    <ChartCard
      title="Response Time Analysis (Minutes)"
      type="bar"
      height={300}
      className={className}
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis 
            dataKey="category" 
            stroke="#64748B"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#64748B"
            fontSize={12}
            label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: number, name: string) => [
              `${value} min`,
              name === 'avgTime' ? 'Average Response' : 'Target Time'
            ]}
          />
          <Bar 
            dataKey="avgTime" 
            fill="#2E3192" 
            radius={[4, 4, 0, 0]}
            name="avgTime"
          />
          <Bar 
            dataKey="target" 
            fill="#FDB930" 
            radius={[4, 4, 0, 0]}
            opacity={0.7}
            name="target"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
