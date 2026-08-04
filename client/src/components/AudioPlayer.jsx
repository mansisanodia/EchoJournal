import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

const AudioPlayer = ({ src }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  if (!src) return null;

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
      <audio
        ref={audioRef}
        src={src}
        onEnded={() => setIsPlaying(false)}
      />
      <button
        onClick={togglePlay}
        className="w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-transform active:scale-95"
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
      </button>
      <div className="flex-1 flex items-center gap-2 text-slate-300 font-medium">
        <Volume2 className="w-4 h-4 text-indigo-400" />
        <span>Audio Recording Attached</span>
      </div>
    </div>
  );
};

export default AudioPlayer;
