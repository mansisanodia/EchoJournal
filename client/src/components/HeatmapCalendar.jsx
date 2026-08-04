import React from 'react';

const getColor = (intensity, count) => {
  if (count === 0) return 'bg-cream-200 border-cream-300 text-sage-300';
  if (intensity === 3) return 'bg-terra-400  border-terra-300  text-white';
  if (intensity === 2) return 'bg-sage-400   border-sage-300   text-white';
  return                     'bg-honey-300  border-honey-200  text-honey-800';
};

const HeatmapCalendar = ({ data = [] }) => (
  <div className="space-y-3">
    <div className="flex flex-wrap items-center justify-between text-[11px] text-sage-400 gap-2">
      <span className="font-semibold">30-Day Activity Grid</span>
      <div className="flex items-center gap-3">
        {[
          { label: 'No entry',  cls: 'bg-cream-200 border-cream-300' },
          { label: 'Calm',      cls: 'bg-honey-300  border-honey-200' },
          { label: 'Positive',  cls: 'bg-sage-400   border-sage-300' },
          { label: 'Stressed',  cls: 'bg-terra-400  border-terra-300' },
        ].map(({ label, cls }) => (
          <span key={label} className="flex items-center gap-1">
            <span className={`w-3 h-3 rounded border ${cls} inline-block`} />
            {label}
          </span>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
      {data.map((day, idx) => (
        <div
          key={idx}
          title={`${day.date}: ${day.count} entries (${day.mood})`}
          className={`h-10 rounded-2xl border flex flex-col items-center justify-center text-[10px] font-bold cursor-default hover:scale-110 transition-transform ${getColor(day.intensity, day.count)}`}
        >
          {new Date(day.date + 'T00:00:00').getDate()}
        </div>
      ))}
    </div>
  </div>
);

export default HeatmapCalendar;
