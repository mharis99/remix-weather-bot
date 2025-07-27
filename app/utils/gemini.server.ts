const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";


export async function getGeminiResponse(message: string): Promise<string> {

  const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: message }] }]
    }),
  });

  const data = await res.json();
  console.log(`Gemini raw response (${res.status}): ${data}`);
  
  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    "Sorry, I couldn't get anything"
  );
}
