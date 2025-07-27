import { Form, useActionData } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getWeatherResponse } from "../utils/gemini.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const userMessage = formData.get("message") as string;

  const botReply = await getWeatherResponse(userMessage);

  return json({ userMessage, botReply });
};

export default function Index() {
  const data = useActionData<typeof action>();

  return (
    <div style={{ padding: 20 }}>
      <h1>🌤️ AI Weather Bot</h1>
      <Form method="post">
        <input
          name="message"
          type="text"
          placeholder="Ask about the weather..."
          style={{ width: "300px", marginRight: "10px" }}
        />
        <button type="submit">Ask</button>
      </Form>

      {data && (
        <div style={{ marginTop: "20px" }}>
          <p><strong>You:</strong> {data.userMessage}</p>
          <p><strong>Bot:</strong> {data.botReply}</p>
        </div>
      )}
    </div>
  );
}
