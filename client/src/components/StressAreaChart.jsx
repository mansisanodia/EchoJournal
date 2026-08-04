import React from 'react';
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

const StressAreaChart = ({ data }) => {
  if (!data?.length) return (
    <div className="h-64 flex items-center justify-center text-sage-300 text-sm">
      No stress data yet.
    </div>
  );
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="terraGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#C4704F" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#C4704F" stopOpacity={0}    />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E0EAD9" />
          <XAxis dataKey="date" stroke="#94B08A" fontSize={11} tickLine={false} />
          <YAxis stroke="#94B08A" fontSize={11} domain={[0,100]} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', borderColor: '#EBBAA0', borderRadius: '16px', fontSize: '12px', color: '#63301E', boxShadow: '0 4px 24px rgba(196,112,79,0.15)' }}
          />
          <Area type="monotone" dataKey="stress" name="Stress Score"
            stroke="#C4704F" strokeWidth={3} fillOpacity={1} fill="url(#terraGrad)"
            dot={{ r: 3, fill: '#C4704F', stroke: '#fff', strokeWidth: 2 }}
            activeDot={{ r: 7 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StressAreaChart;
