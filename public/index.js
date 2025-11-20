import { GoogleGenerativeAI } from "@google/generative-ai";

// Vercel Serverless Functions do not use app.listen.
// Instead, they export an asynchronous function that handles the request.

// Initialize the Gemini client using the environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// This is the standard export format for a Vercel Serverless Function
// Note: If you place this file in an 'api' directory, Vercel exposes it at /api
export default async function handler(req, res) {
  // Only handle POST requests, as defined by your original logic
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed. Only POST is supported." });
  }

  // Vercel serverless functions parse JSON automatically. The body is in req.body.
  const { from, to, start, days, people, type } = req.body;

  if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not set in Vercel environment variables." });
  }

  try {
    // Corrected prompt keys to match those sent from form.js (start, days, type)
    const prompt = `
Generate 3 hotels, 3 restaurants, and 3 visiting places for a trip with these details. Provide real and specific recommendations.
From: ${from}
To: ${to}
Start Date: ${start}
Duration: ${days} days
People: ${people}
Activity: ${type}
    `;

    const result = await model.generateContent(prompt);
    
    // Check for potential safety blocks or empty responses
    if (!result.response.text) {
        return res.status(500).json({ error: "AI response was empty or blocked by safety filters." });
    }

    res.status(200).json({ response: result.response.text() });

  } catch (e) {
    console.error("Gemini API Error:", e);
    // Return the specific error message to the frontend for debugging
    res.status(500).json({ error: e.message });
  }
}