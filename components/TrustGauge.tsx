
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface TrustGaugeProps {
  score: number;
}

const TrustGauge: React.FC<TrustGaugeProps> = ({ score }) => {
  // Logic to determine color based on score
  const getColor = (s: number) => {
    if (s >= 80) return '#22c55e'; // Green-500
    if (s >= 50) return '#eab308'; // Yellow-500
    if (s >= 30) return '#f97316'; // Orange-500
    return '#ef4444'; // Red-500
  };

  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  const color = getColor(score);

  return (
    <div className="relative w-full h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={80}
            outerRadius={105}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="#f1f5f9" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
        <span className="text-5xl font-extrabold tracking-tighter" style={{ color }}>
          {score}%
        </span>
        <span className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">
          Trust Score
        </span>
      </div>
    </div>
  );
};

export default TrustGauge;
