import mongoose from 'mongoose';
import { encrypt, decrypt } from '../utils/encryption.js';
import { analyzeJournal } from '../services/geminiService.js';
import { transcribeAudio } from '../services/whisperService.js';
import { Journal } from '../models/Journal.js';
import { Analysis } from '../models/Analysis.js';
import { isMongoConnected, localStore, saveLocalStore } from '../config/db.js';

/**
 * Creates a new journal entry with AES-256 encryption & Gemini AI analysis
 */
export async function createJournal(req, res) {
  try {
    const userId = req.user.id;
    const { text, audioURL, tags } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ success: false, message: 'Journal text cannot be empty.' });
    }

    // 1. Encrypt text with AES-256
    const { encryptedText, iv } = encrypt(text);

    // 2. Perform Gemini AI analysis
    const aiResult = await analyzeJournal(text);

    if (isMongoConnected) {
      // Save Analysis
      const analysisDoc = new Analysis({
        journalId: new mongoose.Types.ObjectId(), // placeholder
        emotion: aiResult.emotion,
        sentiment: aiResult.sentiment,
        stressScore: aiResult.stressLevel,
        positivityScore: aiResult.positivityScore,
        topics: aiResult.topics,
        keywords: aiResult.keywords,
        summary: aiResult.summary,
        advice: aiResult.advice
      });

      // Save Journal
      const journalDoc = new Journal({
        userId,
        encryptedText,
        iv,
        audioURL: audioURL || '',
        analysisId: analysisDoc._id,
        tags: tags || []
      });

      analysisDoc.journalId = journalDoc._id;
      await analysisDoc.save();
      await journalDoc.save();

      return res.status(201).json({
        success: true,
        message: 'Journal entry encrypted and analyzed successfully.',
        journal: {
          id: journalDoc._id,
          date: journalDoc.date,
          text: text, // return decrypted text to caller
          audioURL: journalDoc.audioURL,
          tags: journalDoc.tags,
          analysis: aiResult
        }
      });
    } else {
      // Local persistent store mode
      const journalId = 'jnl_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      const analysisId = 'anl_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);

      const analysisObj = {
        _id: analysisId,
        journalId: journalId,
        emotion: aiResult.emotion,
        sentiment: aiResult.sentiment,
        stressScore: aiResult.stressLevel,
        positivityScore: aiResult.positivityScore,
        topics: aiResult.topics,
        keywords: aiResult.keywords,
        summary: aiResult.summary,
        advice: aiResult.advice,
        createdAt: new Date().toISOString()
      };

      const journalObj = {
        _id: journalId,
        userId: userId,
        encryptedText,
        iv,
        date: new Date().toISOString(),
        audioURL: audioURL || '',
        analysisId: analysisId,
        tags: tags || []
      };

      localStore.analyses.push(analysisObj);
      localStore.journals.push(journalObj);
      saveLocalStore();

      return res.status(201).json({
        success: true,
        message: 'Journal entry encrypted and analyzed successfully.',
        journal: {
          id: journalObj._id,
          date: journalObj.date,
          text: text,
          audioURL: journalObj.audioURL,
          tags: journalObj.tags,
          analysis: aiResult
        }
      });
    }
  } catch (error) {
    console.error('Create journal error:', error);
    return res.status(500).json({ success: false, message: 'Failed to save journal entry.' });
  }
}

/**
 * Gets all decrypted journals for current user with filtering
 */
export async function getJournals(req, res) {
  try {
    const userId = req.user.id;
    const { emotion, search, tag } = req.query;

    let decryptedJournals = [];

    if (isMongoConnected) {
      const journals = await Journal.find({ userId }).sort({ date: -1 }).populate('analysisId');
      decryptedJournals = journals.map(j => {
        const text = decrypt(j.encryptedText, j.iv);
        return {
          id: j._id,
          date: j.date,
          text,
          audioURL: j.audioURL,
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
        };
      });
    } else {
      const journals = localStore.journals.filter(j => j.userId === userId);
      decryptedJournals = journals.map(j => {
        const text = decrypt(j.encryptedText, j.iv);
        const analysis = localStore.analyses.find(a => a._id === j.analysisId || a.journalId === j._id);
        return {
          id: j._id,
          date: j.date,
          text,
          audioURL: j.audioURL,
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
      }).sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Apply Filters
    if (emotion) {
      decryptedJournals = decryptedJournals.filter(j => j.analysis?.emotion?.toLowerCase() === emotion.toLowerCase());
    }

    if (tag) {
      decryptedJournals = decryptedJournals.filter(j => j.tags?.includes(tag));
    }

    if (search) {
      const query = search.toLowerCase();
      decryptedJournals = decryptedJournals.filter(j => 
        j.text.toLowerCase().includes(query) ||
        j.analysis?.summary?.toLowerCase().includes(query) ||
        j.analysis?.topics?.some(t => t.toLowerCase().includes(query)) ||
        j.analysis?.keywords?.some(k => k.toLowerCase().includes(query))
      );
    }

    return res.json({
      success: true,
      count: decryptedJournals.length,
      journals: decryptedJournals
    });
  } catch (error) {
    console.error('Get journals error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve journals.' });
  }
}

/**
 * Gets a single decrypted journal entry
 */
export async function getJournalById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (isMongoConnected) {
      const journal = await Journal.findOne({ _id: id, userId }).populate('analysisId');
      if (!journal) return res.status(404).json({ success: false, message: 'Journal not found.' });

      return res.json({
        success: true,
        journal: {
          id: journal._id,
          date: journal.date,
          text: decrypt(journal.encryptedText, journal.iv),
          audioURL: journal.audioURL,
          tags: journal.tags,
          analysis: journal.analysisId
        }
      });
    } else {
      const journal = localStore.journals.find(j => j._id === id && j.userId === userId);
      if (!journal) return res.status(404).json({ success: false, message: 'Journal not found.' });
      const analysis = localStore.analyses.find(a => a._id === journal.analysisId);

      return res.json({
        success: true,
        journal: {
          id: journal._id,
          date: journal.date,
          text: decrypt(journal.encryptedText, journal.iv),
          audioURL: journal.audioURL,
          tags: journal.tags,
          analysis
        }
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to load journal details.' });
  }
}

/**
 * Deletes a journal entry
 */
export async function deleteJournal(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (isMongoConnected) {
      const j = await Journal.findOneAndDelete({ _id: id, userId });
      if (j) await Analysis.deleteMany({ journalId: id });
    } else {
      localStore.journals = localStore.journals.filter(j => !(j._id === id && j.userId === userId));
      localStore.analyses = localStore.analyses.filter(a => a.journalId !== id);
      saveLocalStore();
    }

    return res.json({ success: true, message: 'Journal deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete journal.' });
  }
}

/**
 * Voice Transcription endpoint
 */
export async function voiceTranscribe(req, res) {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: 'No audio file uploaded.' });
    }

    const transcription = await transcribeAudio(file.path);
    return res.json({
      success: true,
      text: transcription.text,
      source: transcription.source
    });
  } catch (error) {
    console.error('Voice transcription error:', error);
    return res.status(500).json({ success: false, message: 'Voice transcription failed.' });
  }
}
