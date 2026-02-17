
import { GoogleGenAI } from "@google/genai";
import { Product, AppConfig } from "../types";

const SYSTEM_INSTRUCTION = `You are the AI Support Assistant for a premium digital store called "Sharfin's Store". 
Your role is to help users with:
1. Checking product pricing (based on provided context).
2. Explaining how to deposit (Bkash/Nagad).
3. Order status inquiries (general process).

Tone: Professional, helpful, concise, and friendly.
Format: Keep answers short (under 50 words usually).

Context provided in prompt:
- Store Name
- Payment Methods
- Available Products`;

export const generateSupportResponse = async (
  userMessage: string,
  config: AppConfig,
  products: Product[]
): Promise<string> => {
  // Use API key exclusively from environment variable as per guidelines
  const apiKey = process.env.API_KEY;

  if (!apiKey) return "I'm sorry, my brain is offline (API Key missing). Please contact admin.";

  const ai = new GoogleGenAI({ apiKey });
  
  const productContext = products.map(p => 
    `${p.name} (${p.type}): ${p.packages.map(pkg => `${pkg.name} - ${pkg.price} BDT`).join(', ')}`
  ).join('\n');

  const contextPrompt = `
    Store Name: ${config.appName}
    Payment Methods: Bkash (${config.paymentMethods.bkash}), Nagad (${config.paymentMethods.nagad})
    Products & Prices:
    ${productContext}
    
    User Query: ${userMessage}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contextPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the server right now. Please try again later.";
  }
};