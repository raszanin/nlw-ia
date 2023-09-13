import "dotenv/config";
import { OpenAI } from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

console.log(process.env.OPENAI_KEY);
