import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mic, Heart, Zap, BookOpen, Sparkles, Plus, Leaf, Activity, ArrowUpRight
} from 'lucide-react';
import api from '../services/api';
import MoodCard from '../components/MoodCard';
import TrendChart from '../components/TrendChart';
import EmotionPieChart from '../components/EmotionPieChart';
import JournalCard from '../components/JournalCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedJournal, setSelectedJournal] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/dashboard');
      if (res.data.success) {
        setData(res.data);
      } else {
        setError(res.data.message || 'Failed to load dashboard metrics');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteJournal = async (id) => {
    try {
      await api.delete(`/journal/${id}`);
      fetchDashboardData();
    } catch (err) {
      alert('Failed to delete journal entry.');
    }
  };

  if (loading) return <LoadingSpinner label="Gathering your mental wellness insights..." />;

  if (error) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center card card-terra mt-12 space-y-4">
        <p className="text-terra-600 font-medium">{error}</p>
        <button onClick={fetchDashboardData} className="btn-terra px-6 py-2">
          Retry Loading
        </button>
      </div>
    );
  }

  const { analytics, recentJournals } = data || {};

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="card rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-sage-50 via-cream-100 to-forest-50 border border-sage-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-sage-200 text-xs font-semibold text-sage-600 shadow-nature-sm">
            <Leaf className="w-3.5 h-3.5 text-sage-500 animate-sway" />
            Mindful Daily Check-in
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-sage-900">
            Welcome back to your safe space 🌿
          </h1>
          <p className="text-sm text-sage-600 leading-relaxed font-light">
            You've logged <span className="font-semibold text-sage-800">{analytics?.totalEntries || 0} journal entries</span>. Your overall emotional state is currently <span className="font-semibold text-sage-800">{analytics?.currentMood || 'Calm'}</span>.
          </p>
        </div>

        <Link to="/record" className="btn-terra px-6 py-3.5 rounded-2xl shrink-0 shadow-terra-glow text-sm">
          <Mic className="w-4 h-4" />
          <span>Record New Entry</span>
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MoodCard
          title="Current Mood"
          value={analytics?.currentMood || 'N/A'}
          subtitle={`Dominant: ${analytics?.mostMentionedTopic || 'General'}`}
          icon={Heart}
          color="sage"
        />
        <MoodCard
          title="Avg Stress Score"
          value={`${analytics?.averageStress || 0}%`}
          subtitle="Lower score indicates higher calm"
          icon={Zap}
          color="terra"
        />
        <MoodCard
          title="Positivity Score"
          value={`${analytics?.averagePositivity || 0}%`}
          subtitle="Emotional optimism metric"
          icon={Activity}
          color="forest"
        />
        <MoodCard
          title="Total Reflections"
          value={analytics?.totalEntries || 0}
          subtitle="Encrypted entries saved"
          icon={BookOpen}
          color="honey"
        />
      </div>

      {/* AI Insights Bar */}
      {analytics?.insights?.length > 0 && (
        <div className="card rounded-3xl p-6 bg-gradient-to-r from-honey-50 via-cream-50 to-sage-50 border border-honey-100 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-honey-600" />
            <h3 className="text-base font-serif font-semibold text-sage-800">
              AI Mindful Observations
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analytics.insights.map((insight, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/70 border border-honey-100 text-xs text-sage-700 leading-relaxed font-medium">
                {insight}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif font-semibold text-sage-800">Emotional Trend Journey</h2>
              <p className="text-xs text-sage-400">Tracking positivity vs. stress levels over time</p>
            </div>
            <span className="badge-sage">Live Recharts</span>
          </div>
          <TrendChart data={analytics?.trendData} />
        </div>

        <div className="card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif font-semibold text-sage-800">Emotion Mix</h2>
              <p className="text-xs text-sage-400">Distribution of recorded feelings</p>
            </div>
          </div>
          <EmotionPieChart data={analytics?.emotionDistribution} />
        </div>
      </div>

      {/* Recent Journals */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-bold text-sage-800">Recent Journal Entries</h2>
            <p className="text-xs text-sage-400">Decrypted automatically for your current session</p>
          </div>
          <Link to="/history" className="text-xs font-semibold text-sage-600 hover:text-sage-800 flex items-center gap-1">
            View All <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentJournals?.length === 0 ? (
          <div className="card rounded-3xl p-12 text-center space-y-4">
            <BookOpen className="w-12 h-12 text-sage-300 mx-auto" />
            <p className="text-sage-500 font-serif text-lg">No journal entries yet</p>
            <p className="text-xs text-sage-400 max-w-sm mx-auto">
              Start by recording your first voice reflection or typing out your thoughts.
            </p>
            <Link to="/record" className="btn-primary inline-flex px-6 py-2.5 text-xs">
              <Plus className="w-4 h-4" /> Create First Entry
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentJournals?.map(j => (
              <JournalCard
                key={j.id}
                journal={j}
                onDelete={handleDeleteJournal}
                onClick={setSelectedJournal}
              />
            ))}
          </div>
        )}
      </div>

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

export default Dashboard;
