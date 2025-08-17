import React from 'react';
import { useAllocationsData } from '../../hooks/useAPI';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

const AllocationsCard = () => {
  const { data, loading, error } = useAllocationsData();

  // Données de fallback pour les allocations
  const fallbackAllocations = [
    { name: 'Actions', value: 65, color: '#10b981' },
    { name: 'Obligations', value: 25, color: '#3b82f6' },
    { name: 'Matières premières', value: 5, color: '#f59e0b' },
    { name: 'Liquidités', value: 5, color: '#6b7280' }
  ];

  if (loading) {
    return (
      <Card className="bg-[#1a1a2e] border-[#2a2a3e] shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-[#ffffff] text-lg font-semibold">
            Allocations de portefeuille
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-48 bg-[#2a2a3e] rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const allocations = data?.allocations || fallbackAllocations;
  const dataStatus = data?.data_status || 'SIMULÉ';

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent && typeof percent === 'number') ? (percent * 100).toFixed(0) : '0'}%`}
      </text>
    );
  };

  return (
    <Card className="bg-[#1a1a2e] border-[#2a2a3e] shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-[#ffffff] text-lg font-semibold">
          Allocations de portefeuille
          <span className={`px-2 py-1 text-xs font-bold rounded-full ml-2 ${
            dataStatus === 'LIVE' 
              ? 'bg-[#00ff88] text-black' 
              : 'bg-[#ffa502] text-black'
          }`}>
            {dataStatus === 'LIVE' ? 'LIVE' : 'SIMULÉ'}
          </span>
        </CardTitle>
        <CardDescription className="text-[#ffffff]">
          Répartition des actifs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={allocations}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {Array.isArray(allocations) ? allocations.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                )) : null}
              </Pie>
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry) => (
                  <span style={{ color: entry.color, fontSize: '12px' }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AllocationsCard;

