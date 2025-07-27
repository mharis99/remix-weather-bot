import { Form, useActionData } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getGeminiResponse } from "../utils/gemini.server";
import { useEffect, useRef } from "react";

type ChatMessage = { role: "user" | "bot"; text: string };

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const userMessage = formData.get("message") as string;
  const previousMessages = JSON.parse(
    formData.get("chatHistory") as string || "[]"
  ) as ChatMessage[];

  const botReply = await getGeminiResponse(userMessage);

  const updatedMessages: ChatMessage[] = [
    ...previousMessages,
    { role: "user", text: userMessage },
    { role: "bot", text: botReply },
  ];

  return json({ messages: updatedMessages });
};

export default function Index() {
  const data = useActionData<typeof action>();
  const messages: ChatMessage[] = data?.messages || [];

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = ""; // Clear the input after form submission
    }
  }, [messages]); // Run every time messages change (i.e., after form submission)

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h1>AI Chat</h1>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: 10,
          height: "400px",
          overflowY: "scroll",
          marginBottom: 20,
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: 10,
              textAlign: msg.role === "user" ? "right" : "left",
            }}
          >
            <span
              style={{
                background: msg.role === "user" ? "#d1e7dd" : "#686befff",
                padding: 10,
                borderRadius: 8,
                display: "inline-block",
                maxWidth: "80%",
              }}
            >
              <strong>{msg.role === "user" ? "You" : "AI"}:</strong>{" "}
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <Form method="post">
        <input
          ref={inputRef}
          name="message"
          type="text"
          placeholder="Type your message..."
          style={{ width: "300px", marginRight: "10px" }}
          required
        />
        <input
          type="hidden"
          name="chatHistory"
          value={JSON.stringify(messages)}
        />
        <button type="submit">Send</button>
      </Form>
    </div>
  );
}
