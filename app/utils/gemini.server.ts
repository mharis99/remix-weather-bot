const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

export async function getWeatherResponse(message: string): Promise<string> {
  const prompt = `You are a weather bot. Only talk about weather. 
If someone says "${message}", answer with relevant weather info or a helpful reply about weather.`;

  const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    }),
  });

  const data = await res.json();
  console.log(`Gemini resp ${res.status}: ${await res.text()}`);
  console.log("Gemini API raw response:", JSON.stringify(data, null, 2));

  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    "Sorry, I couldn't get the weather info."
  );
}
