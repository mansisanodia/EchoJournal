import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#4E7353','#C4704F','#C97D0E','#71A067','#D98B6A','#6B8F71','#87422B'];

const EmotionPieChart = ({ data }) => {
  if (!data?.length) return (
    <div className="h-64 flex items-center justify-center text-sage-300 text-sm">
      Record a few entries to see your emotion breakdown.
    </div>
  );
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="45%" innerRadius={55} outerRadius={85}
            paddingAngle={4} dataKey="value">
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#FAF9F4" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', borderColor: '#E0EAD9', borderRadius: '16px', fontSize: '12px', color: '#2C4730', boxShadow: '0 4px 24px rgba(78,115,83,0.12)' }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle"
            formatter={(v) => <span className="text-xs text-sage-600 font-medium">{v}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmotionPieChart;
