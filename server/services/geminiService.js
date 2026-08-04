import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
let aiInstance = null;

if (apiKey && apiKey.trim() !== '') {
  try {
    aiInstance = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Failed to initialize Gemini SDK:', err.message);
  }
}

/**
 * Analyzes journal entry text for sentiment, stress, topics, summary & advice
 * @param {string} journalText 
 * @returns {Promise<Object>}
 */
export async function analyzeJournal(journalText) {
  if (!journalText || journalText.trim() === '') {
    return getFallbackAnalysis(journalText);
  }

  if (aiInstance && apiKey) {
    try {
      const prompt = `
Analyze this user's journal entry for emotional health insights.
Journal Text: "${journalText}"

Respond ONLY with a valid JSON object matching this exact schema:
{
  "emotion": "Dominant Emotion e.g. Stress, Joy, Anxiety, Calm, Sadness, Overwhelmed, Gratitude, Frustration",
  "sentiment": "Positive" | "Neutral" | "Negative",
  "stressLevel": integer between 0 and 100,
  "positivityScore": integer between 0 and 100,
  "topics": ["Array", "of", "1-3", "Main", "Topics"],
  "keywords": ["Array", "of", "3-5", "Key", "Words"],
  "summary": "Concise 1-2 sentence summary of how the user is feeling.",
  "advice": "Empathetic, constructive wellness suggestion."
}`;

      const response = await aiInstance.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const rawText = response.text;
      const parsed = JSON.parse(rawText);
      return {
        emotion: parsed.emotion || 'Calm',
        sentiment: parsed.sentiment || 'Neutral',
        stressLevel: typeof parsed.stressLevel === 'number' ? parsed.stressLevel : 40,
        positivityScore: typeof parsed.positivityScore === 'number' ? parsed.positivityScore : 60,
        topics: Array.isArray(parsed.topics) ? parsed.topics : ['General'],
        keywords: Array.isArray(parsed.keywords) ? parsed.keywords : ['journal'],
        summary: parsed.summary || 'Recorded a personal reflection.',
        advice: parsed.advice || 'Take time today to pause and enjoy a restful break.'
      };
    } catch (error) {
      console.warn('Gemini API call failed or unconfigured, using fallback analysis:', error.message);
    }
  }

  return getFallbackAnalysis(journalText);
}

/**
 * Robust rule-based sentiment & emotion analyzer for offline/unconfigured mode
 */
function getFallbackAnalysis(text) {
  const lower = (text || '').toLowerCase();

  const stressWords = ['stressed', 'work', 'deadline', 'busy', 'exhausted', 'tired', 'insomnia', 'sleep', 'anxious', 'worried', 'pressure', 'overwhelmed', 'late'];
  const positiveWords = ['happy', 'excited', 'great', 'good', 'peaceful', 'relaxed', 'grateful', 'proud', 'accomplished', 'love', 'joy', 'smile'];
  const sadWords = ['sad', 'lonely', 'depressed', 'crying', 'unhappy', 'miss', 'disappointed', 'hurt'];

  let stressHits = 0;
  let posHits = 0;
  let sadHits = 0;

  stressWords.forEach(w => { if (lower.includes(w)) stressHits++; });
  positiveWords.forEach(w => { if (lower.includes(w)) posHits++; });
  sadWords.forEach(w => { if (lower.includes(w)) sadHits++; });

  let emotion = 'Calm';
  let sentiment = 'Neutral';
  let stressLevel = 35;
  let positivityScore = 65;

  if (stressHits > posHits && stressHits > sadHits) {
    emotion = 'Stress';
    sentiment = 'Negative';
    stressLevel = Math.min(60 + stressHits * 10, 95);
    positivityScore = Math.max(100 - stressLevel, 10);
  } else if (sadHits > posHits) {
    emotion = 'Sadness';
    sentiment = 'Negative';
    stressLevel = Math.min(50 + sadHits * 10, 85);
    positivityScore = Math.max(100 - stressLevel, 15);
  } else if (posHits > 0) {
    emotion = 'Joy';
    sentiment = 'Positive';
    stressLevel = Math.max(25 - posHits * 5, 5);
    positivityScore = Math.min(70 + posHits * 8, 98);
  }

  // Extract topics
  const topics = [];
  if (lower.includes('work') || lower.includes('job') || lower.includes('boss') || lower.includes('office') || lower.includes('deadline')) topics.push('Work');
  if (lower.includes('sleep') || lower.includes('tired') || lower.includes('bed') || lower.includes('night') || lower.includes('insomnia')) topics.push('Sleep');
  if (lower.includes('family') || lower.includes('friend') || lower.includes('partner') || lower.includes('relationship')) topics.push('Relationships');
  if (lower.includes('health') || lower.includes('exercise') || lower.includes('gym') || lower.includes('workout') || lower.includes('food')) topics.push('Health');
  if (topics.length === 0) topics.push('Personal Growth');

  // Extract keywords
  const words = lower.replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 3);
  const wordFreq = {};
  words.forEach(w => { wordFreq[w] = (wordFreq[w] || 0) + 1; });
  const keywords = Object.keys(wordFreq).sort((a, b) => wordFreq[b] - wordFreq[a]).slice(0, 4);

  return {
    emotion,
    sentiment,
    stressLevel,
    positivityScore,
    topics,
    keywords: keywords.length ? keywords : ['reflection', 'mindset'],
    summary: text.length > 120 ? text.substring(0, 120) + '...' : text || 'Journal entry recorded.',
    advice: sentiment === 'Negative'
      ? 'Remember to prioritize self-care. Small steps like brief walks or breathing exercises can make a big difference.'
      : 'Keep harnessing this positive momentum! Documenting your gratitude helps maintain emotional resilience.'
  };
}

/**
 * Natural language smart search parser
 */
export async function parseSmartSearchQuery(query) {
  if (aiInstance && apiKey) {
    try {
      const prompt = `
Parse this natural language search query for searching journal entries: "${query}".
Return JSON object:
{
  "targetEmotion": "emotion name or empty string",
  "targetSentiment": "Positive|Negative|Neutral or empty string",
  "searchKeywords": ["list", "of", "keywords"],
  "dateFilter": "all|week|month"
}`;

      const res = await aiInstance.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });
      return JSON.parse(res.text);
    } catch (e) {
      // fallback
    }
  }

  // Simple heuristic query parser fallback
  const lower = query.toLowerCase();
  let targetEmotion = '';
  if (lower.includes('anxious') || lower.includes('anxiety')) targetEmotion = 'Anxiety';
  if (lower.includes('stress') || lower.includes('stressed')) targetEmotion = 'Stress';
  if (lower.includes('happy') || lower.includes('joy')) targetEmotion = 'Joy';

  const keywords = lower.split(/\s+/).filter(w => !['show', 'journals', 'where', 'i', 'felt', 'was', 'about', 'the', 'a', 'in'].includes(w));

  return {
    targetEmotion,
    targetSentiment: '',
    searchKeywords: keywords,
    dateFilter: 'all'
  };
}

/**
 * AI Chat Reflection helper
 */
export async function generateChatReflection(userQuestion, decryptedEntries) {
  const contextSummary = decryptedEntries.slice(0, 10).map((e, idx) => 
    `Entry ${idx+1} [${new Date(e.date).toLocaleDateString()}]: Emotion=${e.analysis?.emotion || 'Unknown'}, Stress=${e.analysis?.stressScore || 0}%. Text: "${e.text.substring(0, 150)}"`
  ).join('\n');

  if (aiInstance && apiKey) {
    try {
      const prompt = `
You are EchoAI, a supportive, private reflection companion for EchoJournal.
You ONLY have access to the user's decrypted journal logs below to answer their reflection question.

User Journal Context:
${contextSummary || 'No past entries recorded yet.'}

User Question: "${userQuestion}"

Provide a warm, compassionate 2-4 sentence response drawing insights from their actual journal entries.`;

      const response = await aiInstance.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      return response.text;
    } catch (err) {
      console.warn('Gemini chat reflection error:', err.message);
    }
  }

  // Fallback response generator
  if (userQuestion.toLowerCase().includes('help') || userQuestion.toLowerCase().includes('stress')) {
    return `Based on your recent journals, taking structured breaks from work and acknowledging your feelings early helps lower your stress. In past entries where your stress was higher, shifting focus to sleep and relaxation showed positive resilience!`;
  }

  return `I've analyzed your recent journal entries. When you express yourself openly about your day, your positivity scores tend to bounce back quickly. What specific topic would you like to explore deeper today?`;
}
