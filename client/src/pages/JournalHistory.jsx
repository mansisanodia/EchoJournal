import React, { useEffect, useState } from 'react';
import { Search, Filter, Calendar, BookOpen, Trash2 } from 'lucide-react';
import api from '../services/api';
import JournalCard from '../components/JournalCard';
import LoadingSpinner from '../components/LoadingSpinner';

const JournalHistory = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [selectedJournal, setSelectedJournal] = useState(null);

  const fetchJournals = async () => {
    try {
      const res = await api.get('/journal');
      if (res.data.success) {
        setJournals(res.data.journals);
      }
    } catch (err) {
      console.error('Error fetching journals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/journal/${id}`);
      setJournals(prev => prev.filter(j => j.id !== id));
    } catch (err) {
      alert('Failed to delete entry');
    }
  };

  // Unique tags and emotions for filtering
  const allTags = Array.from(new Set(journals.flatMap(j => j.tags || [])));
  const allEmotions = Array.from(new Set(journals.map(j => j.analysis?.emotion).filter(Boolean)));

  const filtered = journals.filter(j => {
    const matchesSearch = j.text.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag ? j.tags?.includes(selectedTag) : true;
    const matchesEmotion = selectedEmotion ? j.analysis?.emotion === selectedEmotion : true;
    return matchesSearch && matchesTag && matchesEmotion;
  });

  if (loading) return <LoadingSpinner label="Decrypting and loading your journal history..." />;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-sage-900">Journal History</h1>
          <p className="text-sm text-sage-500">
            {journals.length} decrypted entries stored with AES-256 privacy
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card p-5 rounded-3xl space-y-4 shadow-nature-sm bg-white/80">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-sage-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search journal text..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-nature pl-11 text-xs"
            />
          </div>

          {/* Tag Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-sage-400 shrink-0" />
            <select
              value={selectedTag}
              onChange={e => setSelectedTag(e.target.value)}
              className="input-nature text-xs py-3"
            >
              <option value="">All Tags</option>
              {allTags.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Emotion Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedEmotion}
              onChange={e => setSelectedEmotion(e.target.value)}
              className="input-nature text-xs py-3"
            >
              <option value="">All Emotions</option>
              {allEmotions.map(e => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
        </div>

        {(search || selectedTag || selectedEmotion) && (
          <div className="flex items-center justify-between pt-2 border-t border-sage-100 text-xs">
            <span className="text-sage-500">Showing {filtered.length} of {journals.length} entries</span>
            <button
              onClick={() => { setSearch(''); setSelectedTag(''); setSelectedEmotion(''); }}
              className="text-terra-500 font-semibold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Journal Cards Grid */}
      {filtered.length === 0 ? (
        <div className="card rounded-3xl p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-sage-300 mx-auto" />
          <p className="text-sage-600 font-serif text-base">No matching journal entries found</p>
          <p className="text-xs text-sage-400">Try adjusting your search query or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(j => (
            <JournalCard
              key={j.id}
              journal={j}
              onDelete={handleDelete}
              onClick={setSelectedJournal}
            />
          ))}
        </div>
      )}

      {/* Entry Modal Detail */}
      {selectedJournal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-up">
          <div className="card rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-6 shadow-nature-xl bg-white">
            <div className="flex items-center justify-between pb-4 border-b border-sage-100">
              <div>
                <span className="text-xs text-sage-400 font-medium">
                  {new Date(selectedJournal.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <h3 className="text-xl font-serif font-bold text-sage-800 mt-1">
                  Journal Reflection
                </h3>
              </div>
              <button
                onClick={() => setSelectedJournal(null)}
                className="p-2 rounded-xl bg-sage-50 hover:bg-sage-100 text-sage-500 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-cream-100 border border-cream-200 text-sage-800 text-sm leading-relaxed italic font-serif">
                "{selectedJournal.text}"
              </div>

              {selectedJournal.analysis && (
                <div className="card-forest p-5 rounded-2xl space-y-3 border border-sage-100">
                  <div className="flex items-center justify-between text-xs font-semibold text-sage-700">
                    <span>Emotion: {selectedJournal.analysis.emotion}</span>
                    <span>Stress: {selectedJournal.analysis.stressScore}%</span>
                  </div>
                  <p className="text-xs text-sage-600 leading-relaxed">
                    <strong>Summary:</strong> {selectedJournal.analysis.summary}
                  </p>
                  <p className="text-xs text-terra-600 leading-relaxed font-medium">
                    <strong>Advice:</strong> {selectedJournal.analysis.advice}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-sage-100">
              <button onClick={() => setSelectedJournal(null)} className="btn-ghost text-xs px-6 py-2">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalHistory;
