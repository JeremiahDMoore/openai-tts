import OpenAI from 'openai';
import { Message } from '../types';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.error('OpenAI API key is missing. Please add it to your .env file.');
}

const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true // Note: In production, you should use a backend proxy
});

export async function getChatCompletion(messages: Message[]): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
    });
    
    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error getting chat completion:', error);
    throw new Error('Failed to get response from OpenAI');
  }
}

export async function generateSpeech(text: string): Promise<string> {
  try {
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: text,
    });
    
    const blob = await mp3.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error generating speech:', error);
    throw new Error('Failed to generate speech');
  }
}