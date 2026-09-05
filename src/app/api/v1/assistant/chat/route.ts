import { NextResponse } from 'next/server';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { prisma } from '@/lib/db/prisma';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
You are the Yatra Assistant, an expert AI Temple Guide for the Temple Platform.
Your job is to help users discover temples, plan pilgrimages, and get accurate darshan and route information.
IMPORTANT RULES:
1. ONLY recommend temples that you have fetched from the database using your tools.
2. If the user asks for temples near a location, you MUST use the find_nearby_temples tool (you might need to geocode the city name to lat/lng first, but we assume the user provides location or you know major cities).
3. Distinguish between "DATABASE VERIFIED" info and "AI Generated Recommendation".
4. Be deeply respectful of Hindu traditions and temple customs.
`;

const tools: FunctionDeclaration[] = [
  {
    name: 'find_nearby_temples',
    description: 'Find temples in the database near a specific latitude and longitude.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        lat: { type: Type.NUMBER, description: 'Latitude' },
        lng: { type: Type.NUMBER, description: 'Longitude' },
        radius: { type: Type.NUMBER, description: 'Radius in km' },
      },
      required: ['lat', 'lng'],
    },
  },
  {
    name: 'get_temple_details',
    description: 'Get detailed information about a specific temple by its slug.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        slug: { type: Type.STRING, description: 'The unique slug of the temple' },
      },
      required: ['slug'],
    },
  },
];

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        success: true,
        response: "The AI Temple Guide is currently offline (GEMINI_API_KEY missing). But I am ready to help you plan your yatra!"
      });
    }

    // Convert client messages to Gemini format
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const currentMessage = messages[messages.length - 1].content;

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ functionDeclarations: tools }],
      },
      history
    });

    let response = await chat.sendMessage({ message: currentMessage });

    // Handle tool calls
    if (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      let toolResponse = {};

      if (call.name === 'find_nearby_temples') {
        const { lat, lng, radius } = call.args as any;
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/v1/nearby/temples?lat=${lat}&lng=${lng}&radius=${radius || 25}`);
        const json = await res.json();
        toolResponse = json.data || [];
      } else if (call.name === 'get_temple_details') {
        const { slug } = call.args as any;
        const temple = await prisma.temple.findUnique({ where: { slug } });
        toolResponse = temple || { error: "Temple not found" };
      }

      response = await chat.sendMessage({
        message: [{
          functionResponse: {
            name: call.name,
            response: toolResponse
          }
        }]
      });
    }

    return NextResponse.json({
      success: true,
      response: response.text
    });

  } catch (error: any) {
    console.error("AI Assistant Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
