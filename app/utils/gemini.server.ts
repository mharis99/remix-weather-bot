
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { DynamicTool } from "langchain/tools";
import { z } from "zod";
import { getCurrentWeather } from "./openweather"; 

// Create Gemini model
const model = new ChatGoogleGenerativeAI({
  modelName: "models/gemini-1.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

const weatherTool = new DynamicTool({
  name: "getCurrentWeather",
  description: "Get current weather for a city. Input should be the city name as a string.",
  func: async (city: string) => {
    const result = await getCurrentWeather(city);
    return `Weather in ${city}: ${result}`;
  },
  schema: z.string(),
});

const executorPromise = initializeAgentExecutorWithOptions([weatherTool], model, {
  agentType: "zero-shot-react-description",
});

export async function getGeminiAgentResponse(input: string) {
  const executor = await executorPromise;
  const result = await executor.invoke({ input });

  if (typeof result === "string") {
    return result;
  } else if (typeof result === "object" && result.output) {
    return result.output;
  }
  
  return "no response.";
}
