import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in the environment.");
  }
  return new GoogleGenAI({ apiKey });
};

export const geminiService = {
  analyzeSignal: async (scenarioName: string, decision: string, context: any) => {
    try {
      const ai = getAI();
      const prompt = `You are an expert Telecom Security AI assistant named "ShieldGuard Copilot".
Analyze the following fraud evaluation result for a telecom transaction:
Scenario: ${scenarioName}
Decision: ${decision}
Details: ${JSON.stringify(context, null, 2)}

Provide a concise, professional analysis (2-3 sentences) explaining the risk profile and what specific CAMARA network signal was most decisive. 
Then, suggest one proactive policy recommendation (e.g., "Implement a 24-hour quarantine for SIM swaps > $500").
Keep the tone technical and authoritative.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Copilot is temporarily offline. Please ensure your GEMINI_API_KEY is correctly set in the platform settings.";
    }
  },

  askCopilot: async (message: string, currentContext: any) => {
    try {
      const ai = getAI();
      const prompt = `You are "ShieldGuard Copilot", a specialized AI for Telecom Trust Infrastructure. 
The user is working in the Developer Playground.
Current Environment: ${JSON.stringify(currentContext, null, 2)}

User Question: ${message}

Answer concisely. Focus on CAMARA APIs (SIM Swap, Location, Device Status) and fraud prevention logic. If they ask about code, give brief snippets using the ShieldGuard SDK pattern (e.g. sg.evaluate()).`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      return response.text;
    } catch (error) {
       return "I'm unable to connect to the intelligence core right now. Check your API configuration.";
    }
  }
};
