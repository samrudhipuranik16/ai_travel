import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/generate", async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Generate 3 hotels, 3 restaurants, and 3 visiting places for:
From: ${req.body.from}
To: ${req.body.to}
Start Date: ${req.body.startDate}
Duration: ${req.body.duration}
People: ${req.body.people}
Activity: ${req.body.activity}
    `;

    const result = await model.generateContent(prompt);
    res.json({ response: result.response.text() });

  } catch (e) {
    res.json({ error: e.message });
  }
});

app.listen(3000, () => console.log("Proxy running on 3000"));