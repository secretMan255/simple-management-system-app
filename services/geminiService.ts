import { GoogleGenAI } from "@google/genai";
import { StockItem } from "../types";

const apiKey = process.env.API_KEY || '';

// Safely initialize GenAI only if key is present to prevent crashes on load
// In a real app, we would handle this env check more robustly
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateStockInsights = async (stock: StockItem[]): Promise<string> => {
  if (!ai) {
    return "API Key not configured. Please set process.env.API_KEY.";
  }

  const prompt = `
    Analyze the following stock inventory data and provide a concise, actionable summary.
    Highlight items with 'Low Stock' or 'Out of Stock' status and suggest reorder priorities.
    Keep the tone professional and executive.
    
    Inventory Data:
    ${JSON.stringify(stock.map(s => ({ name: s.name, quantity: s.quantity, status: s.status })))}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate AI insights. Please try again later.";
  }
};

export const generateSalesPrediction = async (sales: any[]): Promise<string> => {
    if (!ai) {
      return "API Key not configured.";
    }
  
    const prompt = `
      Based on the recent sales transactions below, briefly identify the best-selling items 
      and predict a potential trend for next week.
      
      Sales Data:
      ${JSON.stringify(sales)}
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text || "No prediction generated.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Failed to generate sales prediction.";
    }
  };
