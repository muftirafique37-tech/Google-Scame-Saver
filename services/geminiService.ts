
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, GroundingSource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeWebsite = async (url: string): Promise<AnalysisResult> => {
  const model = 'gemini-3-flash-preview';
  
  // We use Google Search grounding to make the scan "authentic" and "real" 
  // as it checks live web data for scam reports.
  const response = await ai.models.generateContent({
    model,
    contents: `Act as a world-class cybersecurity expert. Perform an authentic deep-scan of the URL: ${url}. 
    Search for scam reports, phishing alerts, domain history, and trust ratings across the web. 
    Cross-reference your findings to provide a 100% accurate security verdict.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          trustScore: { type: Type.NUMBER, description: "A score from 0 to 100 where 100 is perfectly safe." },
          verdict: { type: Type.STRING, description: "One of: Safe, Suspicious, Dangerous, Neutral" },
          summary: { type: Type.STRING },
          riskFactors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                severity: { type: Type.STRING, description: "low, medium, or high" }
              },
              required: ["title", "description", "severity"]
            }
          },
          siteDetails: {
            type: Type.OBJECT,
            properties: {
              domainAge: { type: Type.STRING },
              sslStatus: { type: Type.STRING },
              popularity: { type: Type.STRING },
              serverLocation: { type: Type.STRING },
              ownerInfo: { type: Type.STRING }
            },
            required: ["domainAge", "sslStatus", "popularity", "serverLocation", "ownerInfo"]
          },
          recommendation: { type: Type.STRING }
        },
        required: ["trustScore", "verdict", "summary", "riskFactors", "siteDetails", "recommendation"]
      }
    }
  });

  try {
    const result = JSON.parse(response.text);
    
    // Extract real web sources from grounding metadata for authenticity
    const sources: GroundingSource[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title,
            uri: chunk.web.uri
          });
        }
      });
    }

    return {
      ...result,
      url,
      sources: sources.length > 0 ? sources : undefined
    };
  } catch (error) {
    console.error("Failed to parse analysis result:", error);
    throw new Error("Could not complete website analysis.");
  }
};
