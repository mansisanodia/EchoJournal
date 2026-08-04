import React from 'react';
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart
} from 'recharts';

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-4 py-3 text-xs shadow-nature-lg">
      <p className="font-semibold text-sage-700 mb-1 font-serif">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}%
        </p>
      ))}
    </div>
  );
};

const TrendChart = ({ data }) => {
  if (!data?.length) return (
    <div className="h-64 flex items-center justify-center text-sage-300 text-sm">
      No entries yet — start journaling to see your mood journey!
    </div>
  );
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="posGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#6B8F71" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6B8F71" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="strGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#C4704F" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#C4704F" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E0EAD9" />
          <XAxis dataKey="date" stroke="#94B08A" fontSize={11} tickLine={false} />
          <YAxis stroke="#94B08A" fontSize={11} domain={[0,100]} tickLine={false} />
          <Tooltip content={<Tip />} />
          <Area type="monotone" dataKey="positivity" name="Positivity" stroke="#4E7353" strokeWidth={2.5} fill="url(#posGrad)" dot={{ r: 3, fill: '#4E7353' }} activeDot={{ r: 6 }} />
          <Area type="monotone" dataKey="stress"     name="Stress"     stroke="#C4704F" strokeWidth={2.5} fill="url(#strGrad)" dot={{ r: 3, fill: '#C4704F' }} activeDot={{ r: 6 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
