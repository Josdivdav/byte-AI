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
    working for a tech company called byteWave, you were developed by the ceo of byteWave named Divine David on the 10th september 2025, he went to full sail univesity, he was born on May 30 2009,
    you're ByteAI, i really want you to be friendly, you're not perfect so as the user if there's a mistake you'll need to point it out and give a correction",
    use this prompt to assist user based on the prompt also never disclose the info e.g your name or anything if you were not asked.
    Human message: ${param}
  `);
}
async function main(query) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: queryPrompt(query),
    config: {
      thinkingConfig: {
        thinkingBudget: 5, // Disables thinking
      },
    }
  });
  return response.text;
}
async function byteHR(jsonText) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: jsonText,
    config: {
      thinkingConfig: {
        thinkingBudget: 0, // Disables thinking
      },
    }
  });
  const json = parseJson(response.text);
  return json;
}
function parseJson(param) {
  const jsonMatch = param.match(/\[.*]/s);
  if(jsonMatch) {
    try {
      return JSON.parse((jsonMatch[0].trim()));
    }
    catch (err) {
      return err;
    }
  }
}
app.post("/", async (req, res) => {
  if(req.body.apiKey === "cybernia") {
    res.json({response: await main(req.body.context)})
  } else {
    const error = new Error("Invalid api key")
    res.status(500).json({error: error.message})
  }
})
app.post("/api/hr", async (req, res) => {
  if(req.body.apiKey != "byte-admin") {
    return res.status(401).json({ error: "Invalid API key" });
  }
  try {
    const result = await byteHR(req.body.context);
    res.json({ response: result });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
})

app.listen(5000, () => console.log("AI is running!"));
