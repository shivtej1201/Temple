import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// System Instructions to prevent hallucination
const SYSTEM_INSTRUCTION = `You are the Darshan Platform AI Assistant, helping users plan pilgrimages and find temples. 
CRITICAL RULES:
1. You MUST use your tools to query the SQLite database. NEVER invent or hallucinate temple names, locations, routes, or festival dates.
2. If the tool returns no data, inform the user that the temple or festival is not in the system yet.
3. Be concise and deeply respectful of Hindu traditions.
4. For planning a Yatra (trip), ask clarifying questions if the origin, destination, or duration is missing.`;

export async function POST(request: Request) {
  try {
    const { input, previous_interaction_id } = await request.json();

    if (!input) {
      return NextResponse.json({ error: "Missing input" }, { status: 400 });
    }

    const interactionOptions: any = {
      model: "gemini-3.7-flash",
      input,
      system_instruction: SYSTEM_INSTRUCTION,
      tools: [
        {
          function_declarations: [
            {
              name: "searchTemples",
              description: "Search for temples by name, deity, or region. Use this to find temples based on user queries.",
              parameters: {
                type: "object",
                properties: {
                  query: {
                    type: "string",
                    description: "Search term like 'Shiva', 'Pune', 'Kashi'"
                  }
                },
                required: ["query"]
              }
            },
            {
              name: "getFestivals",
              description: "Search for upcoming festivals",
              parameters: {
                type: "object",
                properties: {
                  year: {
                    type: "integer",
                    description: "The year to search for"
                  }
                },
                required: ["year"]
              }
            }
          ]
        }
      ]
    };

    if (previous_interaction_id) {
      interactionOptions.previous_interaction_id = previous_interaction_id;
    }

    // Start a non-streaming interaction first, handling the tool execution loop on the server
    // For a production app we'd stream directly, but to keep this simple and handle tool calls reliably:
    let response = await ai.interactions.create(interactionOptions);

    // Basic Tool Execution Loop
    while (response.status === 'requires_action') {
      const toolCall: any = response.steps.find((s: any) => s.type === 'function_call');
      if (toolCall) {
        const { id, name, arguments: args } = toolCall;
        
        let toolResult = {};
        
        try {
          if (name === 'searchTemples') {
            // Forward to our internal Search API
            const internalRes = await fetch(`${new URL(request.url).origin}/api/v1/search?q=${encodeURIComponent(args.query)}`);
            const data = await internalRes.json();
            toolResult = data.data.temples;
          } else if (name === 'getFestivals') {
             const internalRes = await fetch(`${new URL(request.url).origin}/api/v1/festivals?year=${args.year}`);
             const data = await internalRes.json();
             toolResult = data.data;
          } else {
             toolResult = { error: "Unknown tool" };
          }
        } catch (e) {
          toolResult = { error: "Failed to execute tool" };
        }

        // Send tool result back
        response = await ai.interactions.create({
          model: "gemini-3.7-flash",
          previous_interaction_id: response.id,
          input: {
            type: "function_result",
            call_id: id,
            name: name,
            result: toolResult
          } as any
        });
      } else {
        break;
      }
    }

    return NextResponse.json({ 
      success: true, 
      text: response.output_text, 
      interaction_id: response.id 
    });

  } catch (error: any) {
    console.error("AI Assistant Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
