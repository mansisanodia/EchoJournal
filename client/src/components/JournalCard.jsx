import React, { useState } from 'react';
import { Calendar, Tag, Trash2, ChevronRight, Lock, Leaf } from 'lucide-react';
import AudioPlayer from './AudioPlayer';

const emotionStyle = {
  Joy:     'badge-sage',
  Stress:  'badge-terra',
  Anxiety: 'badge-honey',
  Sadness: 'bg-purple-50 text-purple-600 border border-purple-100 px-2.5 py-0.5 rounded-full text-[11px] font-semibold',
  Calm:    'badge-forest',
};

const JournalCard = ({ journal, onDelete, onClick }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Delete this journal entry?')) {
      setDeleting(true);
      onDelete(journal.id);
    }
  };

  return (
    <div
      onClick={() => onClick?.(journal)}
      className="card card-hover rounded-3xl p-5 flex flex-col gap-4 cursor-pointer group"
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-sage-400 font-medium">
          <Calendar className="w-3.5 h-3.5 text-sage-300" />
          {new Date(journal.date).toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' })}
        </div>
        <div className="flex items-center gap-2">
          {journal.analysis?.emotion && (
            <span className={emotionStyle[journal.analysis.emotion] || 'badge-sage'}>
              {journal.analysis.emotion}
            </span>
          )}
          <button onClick={handleDelete} disabled={deleting}
            className="p-1.5 rounded-xl text-sage-300 hover:text-terra-500 hover:bg-terra-50 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Text excerpt */}
      <p className="text-sage-700 text-sm line-clamp-3 leading-relaxed font-normal italic">
        "{journal.text}"
      </p>

      {/* Audio */}
      {journal.audioURL && (
        <div onClick={e => e.stopPropagation()}>
          <AudioPlayer src={journal.audioURL} />
        </div>
      )}

      {/* Metrics */}
      {journal.analysis && (
        <div className="pt-3 border-t border-sage-50 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-3 font-medium">
            <span className="text-sage-400">Stress: <strong className="text-terra-500">{journal.analysis.stressScore}%</strong></span>
            <span className="text-sage-400">Positivity: <strong className="text-sage-600">{journal.analysis.positivityScore}%</strong></span>
          </div>
          <div className="flex items-center gap-1 text-sage-400 group-hover:text-sage-600 transition-colors group-hover:translate-x-1 duration-200">
            <span>Insights</span><ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      )}

      {/* Tags */}
      {journal.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {journal.tags.map(t => (
            <span key={t} className="px-2 py-0.5 rounded-lg bg-sage-50 text-sage-500 text-[10px] border border-sage-100">
              #{t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default JournalCard;
