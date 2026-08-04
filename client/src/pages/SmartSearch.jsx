import React, { useState } from 'react';
import { Search, Sparkles, BookOpen, Filter } from 'lucide-react';
import api from '../services/api';
import JournalCard from '../components/JournalCard';
import LoadingSpinner from '../components/LoadingSpinner';

const SmartSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedJournal, setSelectedJournal] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    try {
      const res = await api.post('/ai/smart-search', { query });
      if (res.data.success) {
        setResults(res.data);
      } else {
        setError(res.data.message || 'Search failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing smart NLP search');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-honey-50 border border-honey-100 text-xs font-semibold text-honey-600 mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Gemini NLP Natural Language Search
        </div>
        <h1 className="text-3xl font-serif font-bold text-sage-900">Smart Journal Search</h1>
        <p className="text-sm text-sage-500">
          Search your encrypted journals using natural human language (e.g. "When was I stressed about work deadlines?")
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="card p-4 rounded-3xl space-y-4 shadow-nature-md bg-white">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-sage-400 absolute left-4" />
          <input
            type="text"
            placeholder="Type anything e.g. 'Entries where I felt hopeful about sleep or family'..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="input-nature pl-12 pr-32 py-4 text-sm"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="btn-terra absolute right-2 px-6 py-2.5 text-xs rounded-xl disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Example prompts */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
          <span className="text-sage-400 font-medium">Try asking:</span>
          {[
            'Show entries where I mentioned sleep issues',
            'When was I feeling happy and joyful?',
            'Work stress and deadlines',
            'Moments of gratitude with friends'
          ].map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => { setQuery(prompt); }}
              className="px-3 py-1 rounded-xl bg-sage-50 hover:bg-sage-100 border border-sage-100 text-sage-600 transition-colors"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </form>

      {error && (
        <div className="p-4 rounded-2xl bg-terra-50 border border-terra-100 text-terra-600 text-xs">
          {error}
        </div>
      )}

      {loading && <LoadingSpinner label="Gemini AI is interpreting your natural language query..." />}

      {/* Results View */}
      {results && !loading && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-sage-800">
              Found {results.results?.length || 0} Relevant Reflections
            </h2>
            {results.queryParsed && (
              <span className="text-xs text-sage-400">
                Parsed Filters: <strong>{JSON.stringify(results.queryParsed)}</strong>
              </span>
            )}
          </div>

          {results.results?.length === 0 ? (
            <div className="card rounded-3xl p-12 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-sage-300 mx-auto" />
              <p className="text-sage-600 font-serif text-base">No matching reflections found</p>
              <p className="text-xs text-sage-400">Try rephrasing your search query or asking a broader question.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.results.map(j => (
                <JournalCard
                  key={j.id}
                  journal={j}
                  onClick={setSelectedJournal}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
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

export default SmartSearch;
