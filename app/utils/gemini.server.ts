// const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
// const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";


// export async function getGeminiResponse(message: string): Promise<string> {

//   const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       contents: [{ parts: [{ text: message }] }]
//     }),
//   });

//   const data = await res.json();
//   console.log(`Gemini raw response (${res.status}): ${data}`);
  
//   return (
//     data?.candidates?.[0]?.content?.parts?.[0]?.text ??
//     "Sorry, I couldn't get anything"
//   );
// }


// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// const model = new ChatGoogleGenerativeAI({
//   apiKey: process.env.GEMINI_API_KEY!,
//   modelName: "gemini-1.5-flash",
// });

// export async function getGeminiResponse(message: string): Promise<string> {
//   const res = await model.invoke(message);
//   return res.content || "Sorry, no response.";
// }


import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { RunnableSequence } from "@langchain/core/runnables";

const model = new ChatGoogleGenerativeAI({
  modelName: "models/gemini-1.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

const chain = RunnableSequence.from([
  async (input: string) => `You are a helpful weather agent. ${input}`,
  model,
  async (output) => output.content,
]);

export async function getGeminiAgentResponse(input: string) {
  return await chain.invoke(input);
}

