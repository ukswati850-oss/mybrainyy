import { Task } from "../types";
import { generateId } from "../lib/utils";
import { getGeminiResponse } from "./gemini";

// --- Prompts & Personas ---

const PERSONAS = {
  supportive: "You are a warm, empathetic life coach. Validate feelings first, then gently suggest small steps.",
  strict: "You are a no-nonsense drill sergeant productivity expert. Be direct, concise, and action-oriented.",
  analytical: "You are a data-driven strategist. Focus on logic, efficiency, and metrics.",
  zen: "You are a mindfulness guru. Focus on peace, balance, and breathing.",
};

// --- AI Functions ---

export const analyzeBrainDump = async (text: string, style: keyof typeof PERSONAS = 'supportive'): Promise<{ summary: string; tasks: Task[]; nextStep: string }> => {
  const systemPrompt = `
    ${PERSONAS[style]}
    
    Analyze the user's "brain dump" text. 
    1. Summarize their mental state and key issues in 2-3 sentences.
    2. Extract actionable tasks (max 3).
    3. Suggest ONE immediate, tiny next step (under 5 mins).
    
    Return JSON ONLY in this format:
    {
      "summary": "string",
      "tasks": [{"title": "string", "priority": "high|medium|low"}],
      "nextStep": "string"
    }
  `;

  try {
    const response = await getGeminiResponse(text, systemPrompt);
    const cleanJson = response.replace(/```json|```/g, '').trim();
    const data = JSON.parse(cleanJson);
    
    return {
      summary: data.summary,
      nextStep: data.nextStep,
      tasks: data.tasks.map((t: any) => ({
        id: generateId(),
        title: t.title,
        priority: t.priority,
        status: 'todo',
        createdAt: new Date(),
        description: "AI Extracted"
      }))
    };
  } catch (e) {
    // Fallback if API fails or key missing
    return {
      summary: "I've organized your thoughts locally (AI Offline).",
      nextStep: "Check your task list.",
      tasks: [{ id: generateId(), title: "Review notes", priority: "medium", status: "todo", createdAt: new Date() }]
    };
  }
};

export const breakDownGoal = async (goal: string): Promise<Task[]> => {
  const systemPrompt = `
    Break down this big goal into 3-5 small, actionable steps.
    Return JSON ONLY: [{"title": "string", "priority": "high|medium"}]
  `;

  try {
    const response = await getGeminiResponse(goal, systemPrompt);
    const cleanJson = response.replace(/```json|```/g, '').trim();
    const data = JSON.parse(cleanJson);
    
    return data.map((t: any) => ({
      id: generateId(),
      title: t.title,
      priority: t.priority || 'medium',
      status: 'todo',
      createdAt: new Date()
    }));
  } catch (e) {
    return [
      { id: generateId(), title: `Plan for ${goal}`, priority: 'high', status: 'todo', createdAt: new Date() }
    ];
  }
};

export const generateAutomation = async (type: 'email' | 'study' | 'plan', context: string): Promise<string> => {
  const prompts = {
    email: "Write a professional, concise email based on this context:",
    study: "Create a structured study plan with time blocks for:",
    plan: "Create a project execution plan with phases for:"
  };

  try {
    return await getGeminiResponse(context, prompts[type]);
  } catch (e) {
    return "AI Offline: Unable to generate content.";
  }
};

export const getLifeCoaching = async (moods: string[], energy: number, persona: string): Promise<string> => {
  const prompt = `
    User Persona: ${persona}
    Recent Moods: ${moods.join(', ')}
    Current Energy: ${energy}/10
    
    Give a short, personalized coaching tip (max 2 sentences) to optimize their day.
  `;
  
  try {
    return await getGeminiResponse(prompt, "You are an expert life coach.");
  } catch (e) {
    return "Take a deep breath and focus on one thing at a time.";
  }
};

export const generateSideHustleIdeas = async (interests: string): Promise<string[]> => {
  const prompt = `Generate 4 specific, profitable side hustle ideas for someone interested in: ${interests}. Return as a JSON array of strings only.`;
  
  try {
    const response = await getGeminiResponse(prompt);
    const cleanJson = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (e) {
    return ["Freelancing", "Content Creation", "Consulting", "Digital Products"];
  }
};

export const generateTeamReport = async (teamName: string): Promise<string> => {
  return await getGeminiResponse(`Generate a professional weekly status report template for a team named "${teamName}". Include sections for Highlights, Blockers, and Next Steps.`);
};
