
import { GoogleGenAI } from "@google/genai";
import { GEMINI_MODEL, APP_NAME } from "../constants";
import { ChatMessage } from "../types";

export class AIAssistantService {
  /**
   * Sends a message to the Gemini API, incorporating the provided chat history.
   * @param history Array of previous messages in the session.
   * @param message The new user message.
   */
  async sendMessage(history: ChatMessage[], message: string): Promise<string> {
    // Create a new instance right before the call to ensure the latest API key is used
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

    try {
      // Map history to the contents format required by the SDK
      const contents = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      // Add the current user prompt to the contents array
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      // Use ai.models.generateContent as it's the preferred method for prompt + history
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: contents,
        config: {
          systemInstruction: `Você é um assistente prestativo para o app ${APP_NAME}, uma plataforma para membros de uma comunidade espiritual. Forneça respostas concisas, acolhedoras e úteis.`,
        },
      });

      // Directly access the .text property from GenerateContentResponse
      return response.text || "Sem resposta da IA.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Falha ao comunicar com a IA. Verifique sua conexão.");
    }
  }
}

export const aiService = new AIAssistantService();
