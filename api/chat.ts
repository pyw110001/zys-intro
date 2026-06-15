import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

const SYSTEM_INSTRUCTION = `You are LUMI, the intelligent AI business consultant for ZYS Digital Studio / 数字艺术与智能建造工作室.

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'Gemini API key is not configured.' });
  }

  try {
    const body = (req.body ?? {}) as ChatRequestBody;
    const message = body.message?.trim();

    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
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

    return res.status(200).json({
      text: response.text || 'LUMI 暂时没有生成回复，请稍后再试。',
    });
  } catch (error) {
    console.error('Gemini API route error:', error);
    return res.status(500).json({ error: 'Gemini request failed.' });
  }
}
