import axios from 'axios';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Transcribes audio file using OpenAI Whisper API if configured
 * @param {string} filePath 
 * @returns {Promise<{ text: string, source: string }>}
 */
export async function transcribeAudio(filePath) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey && apiKey.trim() !== '' && fs.existsSync(filePath)) {
    try {
      const FormData = (await import('form-data')).default;
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));
      form.append('model', 'whisper-1');

      const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', form, {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${apiKey}`
        }
      });

      return {
        text: response.data.text || '',
        source: 'whisper-api'
      };
    } catch (error) {
      console.warn('Whisper API call error, relying on client transcript:', error.message);
    }
  }

  return {
    text: '',
    source: 'web-speech-fallback'
  };
}
