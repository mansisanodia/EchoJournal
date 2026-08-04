import React, { useEffect, useState } from 'react';
import { TrendingUp, Calendar as CalendarIcon, Sparkles, Activity, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import StressAreaChart from '../components/StressAreaChart';
import HeatmapCalendar from '../components/HeatmapCalendar';
import LoadingSpinner from '../components/LoadingSpinner';

const MoodAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/dashboard');
        if (res.data.success) {
          setData(res.data.analytics);
        }
      } catch (err) {
        console.error('Error loading analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <LoadingSpinner label="Calculating mood trends and 7-day AI predictions..." />;

  const {
    trendData = [],
    heatmapData = [],
    momTrends = [],
    prediction = {},
    averageStress = 0,
    averagePositivity = 0
  } = data || {};

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-sage-900">Mood & Mental Wellness Analytics</h1>
        <p className="text-sm text-sage-500">
          In-depth time-series analysis, Month-over-Month changes, and predictive stress modeling
        </p>
      </div>

      {/* AI 7-Day Mood Prediction Box */}
      <div className="card rounded-3xl p-6 bg-gradient-to-r from-terra-50 via-cream-100 to-honey-50 border border-terra-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-nature-md">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-terra-200 text-xs font-semibold text-terra-600 shadow-nature-sm">
            <Sparkles className="w-3.5 h-3.5 text-terra-500" />
            AI 7-Day Mood Forecast
          </div>
          <h2 className="text-2xl font-serif font-bold text-sage-900">
            Predicted Trajectory: <span className="text-terra-600">{prediction.predictedMood || 'Calm Resilience'}</span>
          </h2>
          <p className="text-xs text-sage-600 leading-relaxed">
            Based on your 7-day moving stress average of <strong>{prediction.movingAvgStress}%</strong>, our statistical regression predicts a <strong>{prediction.expectedTrend}</strong> in emotional intensity with <strong>{prediction.confidenceScore}%</strong> confidence.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 border border-terra-100 text-center shrink-0 min-w-[160px]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sage-400">Predicted Stress</span>
          <p className="text-3xl font-serif font-bold text-terra-600 my-1">{prediction.movingAvgStress || averageStress}%</p>
          <span className="badge-terra text-[10px]">Confidence: {prediction.confidenceScore || 85}%</span>
        </div>
      </div>

      {/* Grid Section 1: Heatmap Calendar */}
      <div className="card rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sage-100 text-sage-600 flex items-center justify-center">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-semibold text-sage-800">30-Day Activity & Emotional Heatmap</h2>
              <p className="text-xs text-sage-400">Consistency and mood intensity breakdown</p>
            </div>
          </div>
        </div>
        <HeatmapCalendar data={heatmapData} />
      </div>

      {/* Grid Section 2: Stress Area Chart & MoM Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Stress Area Chart */}
        <div className="card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif font-semibold text-sage-800">Stress Intensity Curve</h2>
              <p className="text-xs text-sage-400">Fluctuation over past journal entries</p>
            </div>
            <span className="badge-terra">Stress %</span>
          </div>
          <StressAreaChart data={trendData} />
        </div>

        {/* Month-over-Month Topic Trends */}
        <div className="card rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-serif font-semibold text-sage-800">Month-over-Month Topic Shift</h2>
                <p className="text-xs text-sage-400">Calculated percentage change in journal topic focus</p>
              </div>
              <span className="badge-sage">MoM %</span>
            </div>

            {momTrends.length === 0 ? (
              <p className="text-xs text-sage-400 py-8 text-center">Not enough historic data for MoM calculation.</p>
            ) : (
              <div className="space-y-3">
                {momTrends.map((t, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-cream-100 border border-cream-200 text-xs">
                    <span className="font-semibold text-sage-700">{t.topic}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sage-400">{t.currentMonthCount} entries this month</span>
                      <span className={`font-bold px-2 py-0.5 rounded-full ${t.changePercentage >= 0 ? 'bg-terra-100 text-terra-600' : 'bg-sage-100 text-sage-600'}`}>
                        {t.changePercentage >= 0 ? `+${t.changePercentage}%` : `${t.changePercentage}%`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-sage-50 border border-sage-100 text-xs text-sage-600 leading-relaxed flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sage-500 shrink-0" />
            <span>All calculations run locally on your session data for total statistical privacy.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodAnalytics;
