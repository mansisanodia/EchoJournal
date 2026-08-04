/**
 * Calculates analytics, month-over-month trend algorithms, and mood predictions
 * @param {Array} journalEntries List of decrypted entries with analysis object attached
 */
export function calculateTrendsAndAnalytics(journalEntries) {
  if (!journalEntries || journalEntries.length === 0) {
    return {
      totalEntries: 0,
      currentMood: 'Peaceful',
      averageStress: 30,
      averagePositivity: 70,
      topicTrends: [],
      keywordTrends: [],
      emotionDistribution: [],
      moodOverTime: [],
      stressScoreTrend: [],
      calendarHeatmap: [],
      insights: [
        'No journal entries recorded yet. Start your voice journaling journey today!'
      ],
      moodPrediction: {
        predictedMood: 'Calm & Balanced',
        confidenceScore: 85,
        predictedStress: 32,
        reasoning: 'Baseline projection based on initial setup.'
      }
    };
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // Group entries by period
  const currentMonthEntries = [];
  const previousMonthEntries = [];

  journalEntries.forEach(entry => {
    const entryDate = new Date(entry.date);
    if (entryDate >= thirtyDaysAgo) {
      currentMonthEntries.push(entry);
    } else if (entryDate >= sixtyDaysAgo) {
      previousMonthEntries.push(entry);
    }
  });

  // Calculate Topic Frequencies for both months
  const currTopicCounts = {};
  const prevTopicCounts = {};

  currentMonthEntries.forEach(e => {
    (e.analysis?.topics || []).forEach(t => {
      currTopicCounts[t] = (currTopicCounts[t] || 0) + 1;
    });
  });

  previousMonthEntries.forEach(e => {
    (e.analysis?.topics || []).forEach(t => {
      prevTopicCounts[t] = (prevTopicCounts[t] || 0) + 1;
    });
  });

  // Calculate MoM percentage change
  const topicTrends = Object.keys(currTopicCounts).map(topic => {
    const curr = currTopicCounts[topic];
    const prev = prevTopicCounts[topic] || 0;
    let changePct = 0;
    if (prev === 0) {
      changePct = curr > 0 ? 100 : 0;
    } else {
      changePct = Math.round(((curr - prev) / prev) * 100);
    }

    return {
      topic,
      currentCount: curr,
      previousCount: prev,
      percentageChange: changePct,
      direction: changePct >= 0 ? 'up' : 'down'
    };
  }).sort((a, b) => b.currentCount - a.currentCount);

  // Calculate Keyword Frequencies
  const currKeywordCounts = {};
  const prevKeywordCounts = {};

  currentMonthEntries.forEach(e => {
    (e.analysis?.keywords || []).forEach(k => {
      currKeywordCounts[k] = (currKeywordCounts[k] || 0) + 1;
    });
  });

  previousMonthEntries.forEach(e => {
    (e.analysis?.keywords || []).forEach(k => {
      prevKeywordCounts[k] = (prevKeywordCounts[k] || 0) + 1;
    });
  });

  const keywordTrends = Object.keys(currKeywordCounts).map(kw => {
    const curr = currKeywordCounts[kw];
    const prev = prevKeywordCounts[kw] || 0;
    const change = prev === 0 ? 100 : Math.round(((curr - prev) / prev) * 100);
    return { keyword: kw, count: curr, change };
  }).sort((a, b) => b.count - a.count).slice(0, 10);

  // Emotion Distribution (Pie chart data)
  const emotionCounts = {};
  journalEntries.forEach(e => {
    const emo = e.analysis?.emotion || 'Calm';
    emotionCounts[emo] = (emotionCounts[emo] || 0) + 1;
  });

  const emotionDistribution = Object.keys(emotionCounts).map(emo => ({
    name: emo,
    value: emotionCounts[emo]
  }));

  // Averages & Time Series
  let totalStress = 0;
  let totalPositivity = 0;
  const moodOverTime = [];
  const stressScoreTrend = [];

  const sortedEntries = [...journalEntries].sort((a, b) => new Date(a.date) - new Date(b.date));

  sortedEntries.forEach(e => {
    const dateStr = new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const stress = e.analysis?.stressScore || 30;
    const positivity = e.analysis?.positivityScore || 70;
    totalStress += stress;
    totalPositivity += positivity;

    moodOverTime.push({
      date: dateStr,
      positivity,
      stress,
      emotion: e.analysis?.emotion || 'Calm'
    });

    stressScoreTrend.push({
      date: dateStr,
      stress
    });
  });

  const avgStress = Math.round(totalStress / journalEntries.length);
  const avgPositivity = Math.round(totalPositivity / journalEntries.length);

  // Current Mood from latest entry
  const latestEntry = sortedEntries[sortedEntries.length - 1];
  const currentMood = latestEntry?.analysis?.emotion || 'Peaceful';

  // Insights generation
  const insights = [];
  insights.push(`You have completed ${journalEntries.length} voice journal entries.`);
  if (topicTrends.length > 0) {
    const topTopic = topicTrends[0];
    if (topTopic.percentageChange > 0) {
      insights.push(`Mentions of "${topTopic.topic}" increased by ${topTopic.percentageChange}% this month.`);
    } else {
      insights.push(`Mentions of "${topTopic.topic}" decreased by ${Math.abs(topTopic.percentageChange)}% this month.`);
    }
  }

  if (avgStress > 60) {
    insights.push(`Average stress level is currently elevated at ${avgStress}%. Consider scheduling relaxation breaks.`);
  } else {
    insights.push(`Positive emotional resilience is high with an average positivity score of ${avgPositivity}%.`);
  }

  // 7-day AI Mood Prediction (Simple Moving Average + Sentiment Regression)
  const recent7 = sortedEntries.slice(-7);
  const recent7StressAvg = Math.round(recent7.reduce((acc, curr) => acc + (curr.analysis?.stressScore || 30), 0) / (recent7.length || 1));
  const recent7PosAvg = Math.round(recent7.reduce((acc, curr) => acc + (curr.analysis?.positivityScore || 70), 0) / (recent7.length || 1));

  let predictedMood = 'Calm & Optimistic';
  if (recent7StressAvg > 65) predictedMood = 'Mild Work Tension';
  if (recent7PosAvg > 75) predictedMood = 'High Energy & Joyful';
  if (recent7PosAvg < 40) predictedMood = 'Reflective & Low Energy';

  const confidenceScore = Math.min(70 + recent7.length * 4, 94);

  // Calendar Heatmap data generation (last 30 days)
  const calendarHeatmap = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split('T')[0];
    const dayEntries = journalEntries.filter(e => new Date(e.date).toISOString().split('T')[0] === dateStr);
    let intensity = 0; // 0: no entry, 1: low stress/calm, 2: positive, 3: high stress
    let mood = 'No Entry';

    if (dayEntries.length > 0) {
      const last = dayEntries[dayEntries.length - 1];
      mood = last.analysis?.emotion || 'Calm';
      intensity = last.analysis?.stressScore > 65 ? 3 : (last.analysis?.positivityScore > 65 ? 2 : 1);
    }

    calendarHeatmap.push({
      date: dateStr,
      count: dayEntries.length,
      intensity,
      mood
    });
  }

  return {
    totalEntries: journalEntries.length,
    currentMood,
    averageStress: avgStress,
    averagePositivity: avgPositivity,
    mostMentionedTopic: topicTrends[0]?.topic || 'General Reflection',
    topicTrends,
    keywordTrends,
    emotionDistribution,
    moodOverTime,
    stressScoreTrend,
    calendarHeatmap,
    insights,
    moodPrediction: {
      predictedMood,
      confidenceScore,
      predictedStress: recent7StressAvg,
      reasoning: `Based on a 7-day sentiment moving average (${recent7PosAvg}% positivity, ${recent7StressAvg}% stress).`
    }
  };
}
