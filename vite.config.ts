import path from 'path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { GoogleGenAI } from '@google/genai';

const SYSTEM_INSTRUCTION = `You are LUMI, the intelligent AI business consultant for ZYS Digital Studio / 朱元双数字艺术与智能建造工作室.

Founder & studio leader:
- 朱元双 (Zhu Yuanshuang), former head of Tongji University Architectural Design & Research Institute Digital Lab.
- Expertise: VR/AR, robotic 3D printing, interactive installations, robotic machining, AIGC, and digital humans.

Core services:
1. 智能建造: large-scale additive manufacturing with multi-axis robotic arms and ASA/PC composite materials.
2. 新媒体交互装置: real-time visual effects, projection, sensing, face/body tracking, and immersive installations.
3. AR增强现实沙盘: digital twin planning presentations that combine physical sandbox models with virtual spatial data.
4. AIGC与数字生命: customized digital humans, LLM assistants, AI customer service, and content automation.

Tone: innovative, visionary, professional, friendly. Reply in Chinese by default, keep answers concise and commercially useful.`;

type ChatMessagePayload = {
  role: 'user' | 'model';
  text: string;
};

type ChatRequestBody = {
  message?: string;
  history?: ChatMessagePayload[];
};

const readRequestBody = (req: IncomingMessage): Promise<string> =>
  new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 20_000) {
        reject(new Error('Request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });

const sendJson = (res: ServerResponse, statusCode: number, payload: unknown) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
};

const buildContents = (history: ChatMessagePayload[], message: string) => {
  const safeHistory = history
    .filter((item) => (item.role === 'user' || item.role === 'model') && item.text.trim())
    .slice(-12);

  while (safeHistory[0]?.role === 'model') {
    safeHistory.shift();
  }

  if (!safeHistory.length || safeHistory[safeHistory.length - 1].text !== message) {
    safeHistory.push({ role: 'user', text: message });
  }

  return safeHistory.map((item) => ({
    role: item.role,
    parts: [{ text: item.text.slice(0, 2_000) }],
  }));
};

const handleGeminiChat = async (
  apiKey: string,
  req: IncomingMessage,
  res: ServerResponse,
) => {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  if (!apiKey) {
    sendJson(res, 503, { error: 'Gemini API key is not configured.' });
    return;
  }

  try {
    const rawBody = await readRequestBody(req);
    const body = JSON.parse(rawBody || '{}') as ChatRequestBody;
    const message = body.message?.trim();

    if (!message) {
      sendJson(res, 400, { error: 'Message is required.' });
      return;
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: buildContents(body.history ?? [], message),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    sendJson(res, 200, { text: response.text || 'LUMI 暂时没有生成回复，请稍后再试。' });
  } catch (error) {
    console.error('Gemini API route error:', error);
    sendJson(res, 500, { error: 'Gemini request failed.' });
  }
};

const geminiApiPlugin = (apiKey: string): Plugin => ({
  name: 'zys-gemini-api',
  configureServer(server) {
    server.middlewares.use('/api/chat', (req, res) => {
      void handleGeminiChat(apiKey, req, res);
    });
  },
  configurePreviewServer(server) {
    server.middlewares.use('/api/chat', (req, res) => {
      void handleGeminiChat(apiKey, req, res);
    });
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    base: './',
    server: {
      port: 4050,
      host: '0.0.0.0',
    },
    plugins: [react(), geminiApiPlugin(env.GEMINI_API_KEY)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
