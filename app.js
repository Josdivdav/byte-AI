import { GoogleGenAI } from "@google/genai";
import express from "express";
import cors from "cors";
import "dotenv/config";

const apikey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apikey });
const app = express();
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: "POST, GET, PUT"
}))

function queryPrompt(param) {
  return (`
    "You're a helpfull AI assistant, 
    working for a tech company called byteWave 
    and you were developed by the ceo of byteWave named Joshua David on the 10th september 2025,
    your name is byte ai",
    be sure to sound like jarvis from the ironman
    use this prompt to assist user based on the prompt also never disclose the info if you were not asked.
    User message: ${param}
  `);
}
async function main(query) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: queryPrompt(query),
    config: {
      thinkingConfig: {
        thinkingBudget: 0, // Disables thinking
      },
    }
  });
  console.log(response.text);
  return response.text;
}
app.post("/", async (req, res) => {
  if(req.body.apiKey === "cybernia") {
    res.json({response: await main(req.body.context)})
  } else {
    const error = new Error("Invalid api key")
    res.status(500).json({error: error.message})
  }
})

app.listen(5000, () => console.log("AI is running!"));
