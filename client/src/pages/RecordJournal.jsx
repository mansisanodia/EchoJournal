import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Recorder from '../components/Recorder';
import JournalCard from '../components/JournalCard';
import { CheckCircle, ArrowRight, BookOpen, Sparkles } from 'lucide-react';

const RecordJournal = () => {
  const [createdJournal, setCreatedJournal] = useState(null);
  const navigate = useNavigate();

  const handleSuccess = (journal) => {
    setCreatedJournal(journal);
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-serif font-bold text-sage-900">Voice & Text Journaling</h1>
        <p className="text-sm text-sage-500">
          Record your voice note or write your thoughts. Encrypted with AES-256 before storage.
        </p>
      </div>

      {!createdJournal ? (
        <Recorder onSuccess={handleSuccess} />
      ) : (
        <div className="space-y-6 animate-fade-up">
          {/* Success Banner */}
          <div className="card rounded-3xl p-6 bg-gradient-to-r from-forest-50 to-sage-50 border border-sage-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sage-400 text-white flex items-center justify-center font-bold">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-sage-800">
                  Journal Entry Saved & Encrypted!
                </h3>
                <p className="text-xs text-sage-600">
                  Gemini AI completed emotion analysis and stored your entry securely.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCreatedJournal(null)}
                className="btn-ghost text-xs px-4 py-2"
              >
                Record Another
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary text-xs px-5 py-2"
              >
                View Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* AI Analysis Result Card */}
          <div className="card rounded-3xl p-8 space-y-6 bg-white shadow-nature-lg">
            <div className="flex items-center justify-between pb-4 border-b border-sage-100">
              <span className="section-label">AI Reflection Analysis</span>
              <span className="badge-sage">Gemini AI</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-cream-100 border border-cream-200">
                <span className="text-[11px] font-bold text-sage-400 uppercase">Emotion Detected</span>
                <p className="text-2xl font-serif font-bold text-sage-800 mt-1">{createdJournal.analysis?.emotion || 'Calm'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-terra-50 border border-terra-100">
                <span className="text-[11px] font-bold text-terra-400 uppercase">Stress Score</span>
                <p className="text-2xl font-serif font-bold text-terra-600 mt-1">{createdJournal.analysis?.stressScore || 30}%</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-sage-400 uppercase">Executive Summary</h4>
              <p className="text-sm text-sage-700 leading-relaxed font-serif italic p-4 rounded-2xl bg-sage-50 border border-sage-100">
                "{createdJournal.analysis?.summary}"
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-terra-400 uppercase">Mindful Wellness Suggestion</h4>
              <p className="text-xs text-terra-700 leading-relaxed p-4 rounded-2xl bg-terra-50 border border-terra-100">
                {createdJournal.analysis?.advice}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordJournal;
