import React from 'react';

const colorMap = {
  sage:   { wrap: 'bg-sage-50   border-sage-100',  icon: 'bg-sage-100   text-sage-500',   val: 'text-sage-800',   sub: 'text-sage-400'  },
  terra:  { wrap: 'bg-terra-50  border-terra-100', icon: 'bg-terra-100  text-terra-500',  val: 'text-terra-800',  sub: 'text-terra-400' },
  honey:  { wrap: 'bg-honey-50  border-honey-100', icon: 'bg-honey-100  text-honey-600',  val: 'text-honey-800',  sub: 'text-honey-500' },
  forest: { wrap: 'bg-forest-50 border-forest-100',icon: 'bg-forest-100 text-forest-600', val: 'text-forest-800', sub: 'text-forest-400'},
  cream:  { wrap: 'bg-cream-200 border-cream-300', icon: 'bg-cream-300  text-stone-warm', val: 'text-sage-800',   sub: 'text-sage-400'  },
};

const MoodCard = ({ title, value, subtitle, icon: Icon, color = 'sage', trend }) => {
  const c = colorMap[color] || colorMap.sage;
  return (
    <div className={`card card-hover rounded-3xl p-5 border ${c.wrap} flex flex-col gap-4`}>
      <div className="flex items-center justify-between">
        <span className="section-label">{title}</span>
        <div className={`w-9 h-9 rounded-xl ${c.icon} flex items-center justify-center`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
      </div>

      <div>
        <p className={`text-2xl sm:text-3xl font-serif font-bold ${c.val} leading-none`}>{value}</p>
        {subtitle && <p className={`text-xs mt-1 ${c.sub}`}>{subtitle}</p>}
      </div>

      {trend && (
        <div className="pt-2 border-t border-current/10 flex items-center gap-1 text-[11px] font-medium">
          <span className={trend.isUp ? 'text-terra-500' : 'text-sage-500'}>
            {trend.isUp ? '↑' : '↓'} {trend.text}
          </span>
          <span className={c.sub}>vs last month</span>
        </div>
      )}
    </div>
  );
};

export default MoodCard;
