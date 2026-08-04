import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const ALGORITHM = 'aes-256-cbc';
// Fallback key if ENCRYPTION_MASTER_KEY is not defined (32 bytes = 64 hex chars)
const MASTER_KEY_HEX = process.env.ENCRYPTION_MASTER_KEY || '4a8f9c1e7d2b3a4f5e6d7c8b9a0f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f';
const KEY = Buffer.from(MASTER_KEY_HEX.substring(0, 64), 'hex');

/**
 * Encrypts plain text using AES-256-CBC
 * @param {string} text 
 * @returns {{ encryptedText: string, iv: string }}
 */
export function encrypt(text) {
  if (!text) return { encryptedText: '', iv: '' };
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return {
    encryptedText: encrypted,
    iv: iv.toString('hex')
  };
}

/**
 * Decrypts encrypted hex text using stored IV and master key
 * @param {string} encryptedText 
 * @param {string} ivHex 
 * @returns {string} Decrypted plain text
 */
export function decrypt(encryptedText, ivHex) {
  if (!encryptedText || !ivHex) return '';
  try {
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error.message);
    return '[Decryption Error: Invalid Key or Corrupted Data]';
  }
}
