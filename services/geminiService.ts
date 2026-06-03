/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChatMessage } from '../types';

type ChatResponse = {
  text?: string;
  error?: string;
};

const toPayloadHistory = (history: ChatMessage[]) =>
  history
    .filter((message) => message.text.trim())
    .slice(-12)
    .map(({ role, text }) => ({ role, text }));

export const sendMessageToGemini = async (
  message: string,
  history: ChatMessage[] = [],
): Promise<string> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history: toPayloadHistory(history),
      }),
    });

    const payload = (await response.json()) as ChatResponse;

    if (!response.ok) {
      return payload.error || 'LUMI 暂时无法连接，请稍后再试。';
    }

    return payload.text || 'LUMI 暂时没有生成回复，请稍后再试。';
  } catch (error) {
    console.error('Gemini Error:', error);
    return '网络信号暂时中断，请稍后再试。';
  }
};
