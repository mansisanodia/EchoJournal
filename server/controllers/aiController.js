import { analyzeJournal, parseSmartSearchQuery, generateChatReflection } from '../services/geminiService.js';
import { decrypt } from '../utils/encryption.js';
import { Journal } from '../models/Journal.js';
import { isMongoConnected, localStore } from '../config/db.js';

export async function analyzeText(req, res) {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'Text is required for analysis.' });

    const analysis = await analyzeJournal(text);
    return res.json({ success: true, analysis });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Analysis failed.' });
  }
}

export async function smartSearch(req, res) {
  try {
    const { query } = req.body;
    const userId = req.user.id;

    if (!query) return res.status(400).json({ success: false, message: 'Search query is required.' });

    const nlpFilters = await parseSmartSearchQuery(query);

    // Fetch user journals & decrypt
    let decrypted = [];
    if (isMongoConnected) {
      const journals = await Journal.find({ userId }).populate('analysisId');
      decrypted = journals.map(j => ({
        id: j._id,
        date: j.date,
        text: decrypt(j.encryptedText, j.iv),
        tags: j.tags,
        analysis: j.analysisId
      }));
    } else {
      const journals = localStore.journals.filter(j => j.userId === userId);
      decrypted = journals.map(j => {
        const text = decrypt(j.encryptedText, j.iv);
        const analysis = localStore.analyses.find(a => a._id === j.analysisId || a.journalId === j._id);
        return { id: j._id, date: j.date, text, tags: j.tags, analysis };
      });
    }

    // Filter using Gemini NLP insights + keywords
    const filtered = decrypted.filter(item => {
      const textLower = item.text.toLowerCase();
      const summaryLower = (item.analysis?.summary || '').toLowerCase();
      const emoMatch = !nlpFilters.targetEmotion || (item.analysis?.emotion?.toLowerCase() === nlpFilters.targetEmotion.toLowerCase());
      
      const kwMatch = nlpFilters.searchKeywords.length === 0 || nlpFilters.searchKeywords.some(kw => 
        textLower.includes(kw.toLowerCase()) || 
        summaryLower.includes(kw.toLowerCase()) ||
        item.analysis?.topics?.some(t => t.toLowerCase().includes(kw.toLowerCase()))
      );

      return emoMatch && kwMatch;
    });

    return res.json({
      success: true,
      query,
      nlpFilters,
      resultsCount: filtered.length,
      results: filtered
    });
  } catch (error) {
    console.error('Smart search error:', error);
    return res.status(500).json({ success: false, message: 'Smart search failed.' });
  }
}

export async function chatReflection(req, res) {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    if (!message) return res.status(400).json({ success: false, message: 'Message is required.' });

    // Fetch decrypted history
    let decrypted = [];
    if (isMongoConnected) {
      const journals = await Journal.find({ userId }).sort({ date: -1 }).limit(15).populate('analysisId');
      decrypted = journals.map(j => ({
        date: j.date,
        text: decrypt(j.encryptedText, j.iv),
        analysis: j.analysisId
      }));
    } else {
      const journals = localStore.journals.filter(j => j.userId === userId).slice(-15);
      decrypted = journals.map(j => ({
        date: j.date,
        text: decrypt(j.encryptedText, j.iv),
        analysis: localStore.analyses.find(a => a._id === j.analysisId)
      }));
    }

    const reply = await generateChatReflection(message, decrypted);
    return res.json({
      success: true,
      reply
    });
  } catch (error) {
    console.error('Chat reflection error:', error);
    return res.status(500).json({ success: false, message: 'Reflection conversation failed.' });
  }
}
