import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

/**
 * Reads all GEMINI_API_KEY_... variables from the environment.
 * @returns An array of API keys.
 */
function getGoogleApiKeys(): string[] {
  const keys: string[] = [];
  let i = 1;
  // Loop to find all keys like GEMINI_API_KEY_1, GEMINI_API_KEY_2, etc.
  while (process.env[`GEMINI_API_KEY_${i}`]) {
    keys.push(process.env[`GEMINI_API_KEY_${i}`]!);
    i++;
  }
  return keys;
}

/**
 * Selects a random API key from the available pool.
 * This is used for default Genkit initialization, but the robust failover
 * logic in `actions.ts` will manage keys for each request.
 * @returns A randomly selected Google API key.
 */
function selectApiKey(): string {
  const keys = getGoogleApiKeys();
  if (keys.length === 0) {
    console.warn("No GEMINI_API_KEY_... environment variables found. Genkit may not function.");
    return '';
  }
  const randomIndex = Math.floor(Math.random() * keys.length);
  return keys[randomIndex];
}


export const ai = genkit({
  plugins: [googleAI({ apiKey: selectApiKey() })],
  model: 'googleai/gemini-2.0-flash',
});
