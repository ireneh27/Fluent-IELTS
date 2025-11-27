import { GoogleGenAI, Type } from "@google/genai";
import { VocabWord, ScaffoldingTip, Feedback, SpeakingPart, StudyPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Vocabulary Generation ---
export const generateVocabularyList = async (topic: string): Promise<VocabWord[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate 5 advanced IELTS vocabulary words related to the topic: "${topic}". Include definition, example sentence, and synonyms.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word: { type: Type.STRING },
              definition: { type: Type.STRING },
              example: { type: Type.STRING },
              synonyms: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["word", "definition", "example", "synonyms"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as VocabWord[];
    }
    return [];
  } catch (error) {
    console.error("Error generating vocabulary:", error);
    return [];
  }
};

// --- Scaffolding / Tips ---
export const generateScaffolding = async (question: string): Promise<ScaffoldingTip | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Provide a scaffolding structure for answering the IELTS Speaking question: "${question}". Include a structure outline, key phrases to use, and a sample opening sentence.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            structure: { type: Type.ARRAY, items: { type: Type.STRING } },
            keyPhrases: { type: Type.ARRAY, items: { type: Type.STRING } },
            sampleOpener: { type: Type.STRING }
          },
          required: ["structure", "keyPhrases", "sampleOpener"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as ScaffoldingTip;
    }
    return null;
  } catch (error) {
    console.error("Error generating scaffolding:", error);
    return null;
  }
};

// --- Mock Test Question Generation ---
export const generateQuestion = async (part: SpeakingPart, topic?: string): Promise<string> => {
  const prompt = topic 
    ? `Generate one single IELTS Speaking ${part} question about ${topic}. Return only the question text.`
    : `Generate one single IELTS Speaking ${part} question about a common topic. Return only the question text.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        maxOutputTokens: 100,
      }
    });
    return response.text ? response.text.trim() : "Describe a memorable journey you have taken.";
  } catch (error) {
    console.error("Error generating question:", error);
    return "Describe a hobby you enjoy.";
  }
};

// --- Audio Evaluation ---
export const evaluateSpeaking = async (audioBase64: string, question: string, part: SpeakingPart): Promise<Feedback | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "audio/webm", // Assuming MediaRecorder uses webm
              data: audioBase64
            }
          },
          {
            text: `Act as an IELTS Examiner. Evaluate this audio response for the question: "${question}" (${part}). 
            Provide a strict assessment in JSON format including an estimated Band Score (0-9).
            Provide specific comments on:
            1. Fluency (including speaking rate and hesitation)
            2. Lexical Resource (vocabulary range)
            3. Grammatical Range & Accuracy (highlight errors)
            4. Pronunciation (clarity and intonation)
            Also provide an improved version of the answer.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bandScore: { type: Type.NUMBER },
            fluency: { type: Type.STRING },
            lexicalResource: { type: Type.STRING },
            grammaticalRange: { type: Type.STRING },
            pronunciation: { type: Type.STRING },
            improvedVersion: { type: Type.STRING }
          },
          required: ["bandScore", "fluency", "lexicalResource", "grammaticalRange", "pronunciation", "improvedVersion"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Feedback;
    }
    return null;
  } catch (error) {
    console.error("Error evaluating speaking:", error);
    // Fallback for demo if model fails (e.g. if audio format issue)
    return {
      bandScore: 6.0,
      fluency: "Unable to process audio. Please try again.",
      lexicalResource: "N/A",
      grammaticalRange: "N/A",
      pronunciation: "N/A",
      improvedVersion: "N/A"
    };
  }
};

// --- Study Plan Generation ---
export const generateStudyPlan = async (
  currentBand: number, 
  targetBand: number, 
  recentFeedback?: Feedback | null
): Promise<StudyPlan | null> => {
  try {
    let context = `Student Current Band: ${currentBand}, Target Band: ${targetBand}.`;
    
    if (recentFeedback) {
      context += `\nRecent Performance Analysis:
      - Fluency Issues: ${recentFeedback.fluency}
      - Grammar Issues: ${recentFeedback.grammaticalRange}
      - Pronunciation Issues: ${recentFeedback.pronunciation}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Create a personalized 3-day IELTS Speaking study plan based on the following student profile:
      ${context}
      
      Identify 3 key focus areas for improvement.
      Create a 3-day schedule where each day has a specific focus and 3 actionable activities (e.g., "Learn 5 idioms for Travel", "Practice Part 2 with a timer").`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            currentLevelAssessment: { type: Type.STRING, description: "A brief 1-sentence summary of where the student stands." },
            focusAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
            schedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.INTEGER },
                  focus: { type: Type.STRING },
                  activities: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as StudyPlan;
    }
    return null;
  } catch (error) {
    console.error("Error generating study plan:", error);
    return null;
  }
};
