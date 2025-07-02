import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

/**
 * Selects an API key from a pool defined in environment variables.
 * This provides basic load distribution and resilience. If one key is bad,
 * a server restart will likely pick a different one.
 * @returns A randomly selected Google API key.
 */
function getGoogleApiKey(): string {
  const apiKeysString = process.env.GOOGLE_API_KEYS || process.env.GOOGLE_API_KEY;
  if (!apiKeysString) {
    console.warn("GOOGLE_API_KEY or GOOGLE_API_KEYS environment variable not set. Genkit may not function.");
    return '';
  }

  const keys = apiKeysString.split(',').map(key => key.trim()).filter(Boolean);
  
  if (keys.length === 0) {
    console.warn("No valid Google API keys found in environment variables.");
    return '';
  }
  
  const randomIndex = Math.floor(Math.random() * keys.length);
  return keys[randomIndex];
}


export const ai = genkit({
  plugins: [googleAI({ apiKey: getGoogleApiKey() })],
  model: 'googleai/gemini-2.0-flash',
});
