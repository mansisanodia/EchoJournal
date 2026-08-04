import { decrypt } from '../utils/encryption.js';
import { calculateTrendsAndAnalytics } from '../services/trendService.js';
import { Journal } from '../models/Journal.js';
import { isMongoConnected, localStore } from '../config/db.js';

export async function getDashboardData(req, res) {
  try {
    const userId = req.user.id;

    let decryptedJournals = [];

    if (isMongoConnected) {
      const journals = await Journal.find({ userId }).sort({ date: -1 }).populate('analysisId');
      decryptedJournals = journals.map(j => ({
        id: j._id,
        date: j.date,
        text: decrypt(j.encryptedText, j.iv),
        tags: j.tags,
        analysis: j.analysisId ? {
          emotion: j.analysisId.emotion,
          sentiment: j.analysisId.sentiment,
          stressScore: j.analysisId.stressScore,
          positivityScore: j.analysisId.positivityScore,
          topics: j.analysisId.topics,
          keywords: j.analysisId.keywords,
          summary: j.analysisId.summary,
          advice: j.analysisId.advice
        } : null
      }));
    } else {
      const journals = localStore.journals.filter(j => j.userId === userId);
      decryptedJournals = journals.map(j => {
        const text = decrypt(j.encryptedText, j.iv);
        const analysis = localStore.analyses.find(a => a._id === j.analysisId || a.journalId === j._id);
        return {
          id: j._id,
          date: j.date,
          text,
          tags: j.tags,
          analysis: analysis ? {
            emotion: analysis.emotion,
            sentiment: analysis.sentiment,
            stressScore: analysis.stressScore,
            positivityScore: analysis.positivityScore,
            topics: analysis.topics,
            keywords: analysis.keywords,
            summary: analysis.summary,
            advice: analysis.advice
          } : null
        };
      });
    }

    const analytics = calculateTrendsAndAnalytics(decryptedJournals);

    return res.json({
      success: true,
      analytics,
      recentEntries: decryptedJournals.slice(0, 5)
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    return res.status(500).json({ success: false, message: 'Failed to build dashboard analytics.' });
  }
}
