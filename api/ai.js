// api/ai.js — Vercel serverless function
// This runs on the server, so GEMINI_API_KEY is never exposed to the browser.
// Your Netlify frontend calls this endpoint; this function calls Google's API.

export default async function handler(req, res) {
  // Allow your Netlify site to call this backend.
  // Replace the URL below with your actual Netlify URL once you know it.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured on server." });
  }

  const { system, message, history } = req.body || {};
  if (!message) {
    return res.status(400).json({ error: "Missing message field." });
  }

  // Build the Gemini request. We include the system prompt as the first
  // turn in the conversation (Gemini 1.5 supports system instructions directly).
  const contents = [];

  // Add prior conversation history if provided (for AI Coach multi-turn)
  if (Array.isArray(history)) {
    for (const turn of history) {
      contents.push({
        role: turn.role === "assistant" ? "model" : "user",
        parts: [{ text: turn.text }],
      });
    }
  }

  // Add the current user message
  contents.push({ role: "user", parts: [{ text: message }] });

  const requestBody = {
    contents,
    systemInstruction: system ? { parts: [{ text: system }] } : undefined,
    generationConfig: {
      maxOutputTokens: 800,
      temperature: 0.8,
    },
  };

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", geminiRes.status, errText);
      return res.status(502).json({ error: "AI service error. Please try again." });
    }

    const data = await geminiRes.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I couldn't generate a response right now — please try again.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Backend error:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
}
