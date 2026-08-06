import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API lazily or when requested
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'PairX - Premium Tiruppur Dating Platform',
    timestamp: new Date().toISOString(),
  });
});

// AI Icebreaker generator route
app.post('/api/ai-icebreaker', async (req, res) => {
  try {
    const { profileName, interests, location, tone } = req.body || {};
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback response if no API key set
      const fallbackStarters = [
        `Hey ${profileName || 'there'}! I noticed you enjoy ${interests?.[0] || 'exploring Tiruppur'}. Have you checked out the coffee lounge on PN Road lately?`,
        `Hi ${profileName || 'there'}! Great to meet a fellow Tiruppur local into ${interests?.slice(0, 2).join(' & ') || 'good conversations'}. What's your favorite weekend spot around ${location || 'town'}?`,
        `Hello ${profileName || 'there'}! That's a great profile. If we were to plan a 30-min coffee chat in Tiruppur, where would you recommend?`,
      ];
      return res.json({
        success: true,
        icebreaker: fallbackStarters[Math.floor(Math.random() * fallbackStarters.length)],
        isFallback: true,
      });
    }

    const prompt = `You are PairX AI Dating Assistant for Tiruppur, Tamil Nadu.
Generate a witty, respectful, engaging 2-sentence icebreaker message to send to ${profileName || 'a member'}.
Interests: ${interests?.join(', ') || 'Coffee, Music, Local exploration'}.
Local context: Tiruppur landmarks like PN Road, Avinashi Road, Kumaran Road, Rayapuram, Smart City promenade, Velan Hotel Cafe.
Tone: ${tone || 'friendly & charming'}.
Do NOT use hashtags or emojis overload. Keep it natural and authentic.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const icebreakerText = response.text?.trim() || `Hey ${profileName}, great profile! What's your favorite spot in Tiruppur?`;
    
    return res.json({
      success: true,
      icebreaker: icebreakerText,
      isFallback: false,
    });
  } catch (error: any) {
    console.error('Error generating AI icebreaker:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate icebreaker',
      icebreaker: `Hey! I loved reading your profile. How's your week going in Tiruppur?`,
    });
  }
});

// Broadcast notification route (Admin)
app.post('/api/admin/broadcast', (req, res) => {
  const { title, message, targetAudience } = req.body;
  console.log(`[PairX Admin Broadcast] ${title}: ${message} -> Audience: ${targetAudience}`);
  res.json({
    success: true,
    message: 'Broadcast notification dispatched successfully to Tiruppur network.',
    sentAt: new Date().toISOString(),
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PairX Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
