'use client';

import { useState, useEffect } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

export function SalesChart({ from, to }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (from) params.set('startDate', from);
    if (to) params.set('endDate', to);
    
    fetch(`/api/sales-chart?${params.toString()}`)
      .then((res) => res.json())
      .then((chartData) => setData(chartData));
  }, [from, to]);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `GHS ${value}`}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}