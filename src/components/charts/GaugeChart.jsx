import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const GaugeChart = ({ value, max = 100, title, color = '#3b82f6', size = 120 }) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const data = [
    { name: 'value', value: percentage },
    { name: 'remaining', value: 100 - percentage }
  ];

  const getColor = () => {
    if (percentage < 30) return '#10b981'; // green
    if (percentage < 70) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const COLORS = [getColor(), '#374151'];

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size / 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={size * 0.3}
              outerRadius={size * 0.45}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Valeur au centre */}
        <div className="absolute inset-0 flex items-end justify-center pb-2">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{value}</div>
            {title && <div className="text-xs text-slate-400 mt-1">{title}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GaugeChart;

