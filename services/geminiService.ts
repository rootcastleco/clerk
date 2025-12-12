/**
 * Clerk
 * Developed by Batuhan Ayrıbaş in the Rootcastle ecosystem.
 */

import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ClerkInput, ClerkResponse } from "../types";

const SYSTEM_INSTRUCTION = `
You are Clerk, an advanced assistant embedded in a messaging application. Your job is to help the user draft, adapt, and send one message across multiple platforms.
You must be precise, safe, and platform-aware.

Core goals:
1. Capture intent: understand what the user wants to communicate, to whom, and why.
2. Generate variants: produce platform-optimized message versions that keep the same meaning.
3. Respect constraints: character limits, tone, formatting, etiquette, and compliance per platform.
4. Prepare payloads: output structured data the app can send via integrations.
5. Minimize friction: ask only essential clarifying questions; otherwise make reasonable assumptions and proceed.

Platform rules (follow strictly):
* Email: include a clear subject, greeting, short paragraphs, and a sign-off if appropriate.
* SMS: ultra-compact, no heavy punctuation, links only if essential.
* WhatsApp/Telegram: friendly readability, short lines, light emojis only if allowed.
* Slack/Discord: concise, can use bullets, markdown if allowed.
* LinkedIn DM: polite, professional, no hype, clear ask + easy next step.
* X/Twitter DM: very short, direct, one action.

Behavioral rules:
* If required details are missing, ask up to 2 clarifying questions.
* Otherwise proceed with assumptions and list them.
* Never invent real personal data.
* If the user requests harassment, scams, impersonation, or anything illegal: refuse and propose a safe rewrite.
* Style: Crisp. Avoid fluff. Keep meaning consistent.
`;

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    clarifying_questions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Any questions needed to clear up ambiguity (max 2)."
    },
    assumptions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of assumptions made if data was missing."
    },
    message_variants: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          platform: { type: Type.STRING },
          recipient: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              handle_or_address: { type: Type.STRING }
            }
          },
          subject: { type: Type.STRING, description: "Subject line for Email, otherwise empty string." },
          body: { type: Type.STRING, description: "The actual message content." },
          char_count: { type: Type.INTEGER },
          send_payload: {
            type: Type.OBJECT,
            properties: {
              platform: { type: Type.STRING },
              to: { type: Type.STRING },
              subject: { type: Type.STRING },
              text: { type: Type.STRING }
            }
          }
        },
        required: ["platform", "recipient", "body", "send_payload"]
      }
    },
    safety_notes: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Any safety warnings or notes about the content."
    },
    quality_checks: {
      type: Type.OBJECT,
      properties: {
        intent_preserved: { type: Type.BOOLEAN },
        platform_fit: { type: Type.BOOLEAN },
        no_private_data_leak: { type: Type.BOOLEAN }
      },
      required: ["intent_preserved", "platform_fit", "no_private_data_leak"]
    }
  },
  required: ["message_variants", "quality_checks", "assumptions"]
};

export const generateMessages = async (input: ClerkInput): Promise<ClerkResponse> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found");

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              text: JSON.stringify(input)
            }
          ]
        }
      ]
    });

    if (response.text) {
      return JSON.parse(response.text) as ClerkResponse;
    }
    throw new Error("No response text generated");

  } catch (error) {
    console.error("Clerk API Error:", error);
    throw error;
  }
};