import { Form, useActionData } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getGeminiAgentResponse } from "../utils/gemini.server";
import { useEffect, useRef } from "react";

type ChatMessage = { role: "user" | "bot"; text: string };

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const userMessage = formData.get("message") as string;
  const previousMessages = JSON.parse(
    formData.get("chatHistory") as string || "[]"
  ) as ChatMessage[];

  const botReply = await getGeminiAgentResponse(userMessage);

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
      inputRef.current.value = "";
    }
  }, [messages]);

  return (
    <div
      style={{
        padding: "1rem",
        maxWidth: "100%",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center" }}>AI Chat</h1>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: "1rem",
          height: "60vh",
          overflowY: "auto",
          marginBottom: "1rem",
          backgroundColor: "#f9f9f9",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: 12,
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <span
              style={{
                backgroundColor: msg.role === "user" ? "#d1e7dd" : "#c2c3f5ff",
                padding: "10px 14px",
                borderRadius: 16,
                maxWidth: "80%",
                fontSize: "0.95rem",
                lineHeight: 1.4,
              }}
            >
              <strong>{msg.role === "user" ? "You" : "AI"}:</strong>{" "}
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <Form method="post" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <input
          ref={inputRef}
          name="message"
          type="text"
          placeholder="Type your message..."
          style={{
            flex: "1 1 auto",
            padding: "10px",
            borderRadius: 8,
            border: "1px solid #ccc",
            fontSize: "1rem",
            minWidth: 0,
          }}
          required
        />
        <input
          type="hidden"
          name="chatHistory"
          value={JSON.stringify(messages)}
        />
        <button
          type="submit"
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            border: "none",
            backgroundColor: "#007bff",
            color: "#fff",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </Form>
    </div>
  );
}
