import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Pause, Play, RefreshCw, Leaf, Lock, Tag, Sprout } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const AVAILABLE_TAGS = ['Work','Sleep','Relationships','Health','Personal Growth','Gratitude','Fitness','Family'];

const Recorder = ({ onSuccess }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused,    setIsPaused]    = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript,  setTranscript]  = useState('');
  const [audioUrl,    setAudioUrl]    = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [bars,        setBars]        = useState(Array(12).fill(20));

  const mediaRecorderRef = useRef(null);
  const audioChunksRef   = useRef([]);
  const timerRef         = useRef(null);
  const recognitionRef   = useRef(null);
  const barsTimerRef     = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      const r = new SR();
      r.continuous = true; r.interimResults = true; r.lang = 'en-US';
      r.onresult = e => {
        let t = '';
        for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript + ' ';
        setTranscript(t.trim());
      };
      recognitionRef.current = r;
    }
  }, []);

  /* timer */
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => setRecordingTime(p => p + 1), 1000);
    } else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [isRecording, isPaused]);

  /* waveform bars animation */
  useEffect(() => {
    if (isRecording && !isPaused) {
      barsTimerRef.current = setInterval(() => {
        setBars(Array(12).fill(0).map(() => Math.floor(Math.random() * 80) + 10));
      }, 130);
    } else {
      clearInterval(barsTimerRef.current);
      setBars(Array(12).fill(20));
    }
    return () => clearInterval(barsTimerRef.current);
  }, [isRecording, isPaused]);

  const startRecording = async () => {
    setError(''); audioChunksRef.current = [];
    setTranscript(''); setAudioUrl(null); setRecordingTime(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      mr.ondataavailable = e => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      setIsRecording(true); setIsPaused(false);
      try { recognitionRef.current?.start(); } catch (_) {}
    } catch {
      setError('Microphone access unavailable. You can type your entry directly below.');
    }
  };

  const pauseRecording = () => {
    if (!mediaRecorderRef.current || !isRecording) return;
    if (isPaused) {
      mediaRecorderRef.current.resume(); setIsPaused(false);
      try { recognitionRef.current?.start(); } catch (_) {}
    } else {
      mediaRecorderRef.current.pause(); setIsPaused(true);
      recognitionRef.current?.stop();
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false); setIsPaused(false);
    recognitionRef.current?.stop();
  };

  const reset = () => {
    if (isRecording) stopRecording();
    setTranscript(''); setAudioUrl(null); setRecordingTime(0); setError('');
  };

  const toggleTag = t =>
    setSelectedTags(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);

  const handleSubmit = async () => {
    if (!transcript.trim()) { setError('Please record or type a journal entry first.'); return; }
    setLoading(true); setError('');
    try {
      const res = await api.post('/journal', { text: transcript, audioURL: audioUrl || '', tags: selectedTags });
      if (res.data.success) { onSuccess?.(res.data.journal); }
      else setError(res.data.message || 'Failed to save journal.');
    } catch (e) {
      setError(e.response?.data?.message || 'Server error saving journal entry.');
    } finally { setLoading(false); }
  };

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  if (loading) return <LoadingSpinner label="Encrypting with AES-256 & analyzing with Gemini AI…" />;

  return (
    <div className="card rounded-3xl p-6 sm:p-8 space-y-6 max-w-3xl mx-auto shadow-nature-lg">

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-sage-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-terra-100 border border-terra-200 flex items-center justify-center text-terra-500">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-semibold text-sage-800">Voice Journal</h2>
            <p className="text-xs text-sage-400">Speak naturally — transcript auto-generated & encrypted</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-sage-50 border border-sage-100 text-xs text-sage-500 font-mono font-semibold">
          <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-terra-400 animate-pulse' : 'bg-sage-300'}`} />
          {fmt(recordingTime)}
        </div>
      </div>

      {error && <div className="px-4 py-3 rounded-2xl bg-terra-50 border border-terra-100 text-terra-600 text-xs">{error}</div>}

      {/* Recording Stage */}
      <div className="flex flex-col items-center gap-6 p-8 rounded-3xl bg-gradient-to-b from-cream-100 to-cream-200 border border-cream-300">

        {/* Animated Waveform */}
        <div className="flex items-center gap-1 h-14">
          {bars.map((h, i) => (
            <div
              key={i}
              className="w-1.5 rounded-full transition-all duration-100"
              style={{
                height: `${h}%`,
                background: isRecording && !isPaused
                  ? `linear-gradient(to top, #4E7353, #94B08A)`
                  : '#BDCFB6',
              }}
            />
          ))}
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-4">
          {!isRecording ? (
            <button onClick={startRecording}
              className="btn-terra px-8 py-3.5 rounded-full text-base animate-pulse-green">
              <Mic className="w-5 h-5" />
              <span>Start Recording</span>
            </button>
          ) : (
            <>
              <button onClick={pauseRecording}
                className="p-3.5 rounded-full bg-honey-100 border border-honey-200 text-honey-600 hover:bg-honey-200 transition-all active:scale-95"
                title={isPaused ? 'Resume' : 'Pause'}>
                {isPaused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5" />}
              </button>
              <button onClick={stopRecording}
                className="btn-terra px-6 py-3.5 rounded-full">
                <Square className="w-4 h-4 fill-current" />
                <span>Stop</span>
              </button>
            </>
          )}
          {(transcript || audioUrl) && (
            <button onClick={reset}
              className="p-3.5 rounded-full bg-white border border-sage-100 text-sage-400 hover:text-sage-600 transition-all active:scale-95">
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>

        {audioUrl && !isRecording && (
          <audio src={audioUrl} controls className="w-full max-w-sm h-10 rounded-xl" />
        )}
      </div>

      {/* Transcript */}
      <div className="space-y-2">
        <label className="section-label flex justify-between items-center">
          <span>Transcript / Journal Entry</span>
          <span className="normal-case text-sage-300">Live Web Speech · Manual Edit OK</span>
        </label>
        <textarea rows={5} value={transcript} onChange={e => setTranscript(e.target.value)}
          placeholder="Click &quot;Start Recording&quot; and speak, e.g. &quot;I have been feeling overwhelmed with work lately...&quot;"
          className="input-nature resize-none text-sm" />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <label className="section-label flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5" /><span>Category Tags</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_TAGS.map(tag => {
            const active = selectedTags.includes(tag);
            return (
              <button key={tag} type="button" onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  active
                    ? 'bg-sage-400 text-white border-sage-300 shadow-nature-sm'
                    : 'bg-white text-sage-500 border-sage-100 hover:border-sage-200 hover:bg-sage-50'
                }`}>
                {active ? `✓ ${tag}` : `+ ${tag}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-sage-50 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-sage-400 font-medium">
          <Lock className="w-3.5 h-3.5 text-sage-300" />
          <span>AES-256 encrypted before saving</span>
        </div>
        <button onClick={handleSubmit} disabled={!transcript.trim()}
          className="btn-primary disabled:opacity-40 disabled:pointer-events-none">
          <Sprout className="w-4 h-4" />
          <span>Save & Analyze</span>
        </button>
      </div>
    </div>
  );
};

export default Recorder;
