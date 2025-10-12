"use client";

import { memo, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const COLORS = ['#10b981', '#22c55e', '#34d399', '#6ee7b7', '#86efac', '#a7f3d0'];

interface MultiLineChartProps {
  data: Array<Record<string, string | number>>;
  title: string;
  description?: string;
  lines: Array<{ dataKey: string; name: string; color?: string }>;
  xAxisKey?: string;
  height?: number;
}

function MultiLineChartComponent({ 
  data, 
  title, 
  description, 
  lines,
  xAxisKey = 'name',
  height = 350 
}: MultiLineChartProps) {
  // Memoize lines rendering
  const renderedLines = useMemo(() => 
    lines.map((line, index) => (
      <Line
        key={line.dataKey}
        type="monotone"
        dataKey={line.dataKey}
        name={line.name}
        stroke={line.color || COLORS[index % COLORS.length]}
        strokeWidth={2}
      />
    )),
    [lines]
  );

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} style={{ fontSize: '12px' }} />
            <YAxis style={{ fontSize: '12px' }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} iconSize={10} />
            {renderedLines}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Memoize to prevent unnecessary re-renders
export const MultiLineChart = memo(MultiLineChartComponent);
