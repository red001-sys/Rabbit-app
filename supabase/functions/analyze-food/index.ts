import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const LANGUAGE_NAMES: Record<string, string> = {
  'en': 'English',
  'pt-BR': 'Portuguese (Brazil)',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'zh': 'Chinese (Simplified)',
  'ja': 'Japanese',
  'ko': 'Korean',
  'hi': 'Hindi',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { text, imageBase64, mode, language } = await req.json();

    const langCode = language || 'en';
    const langName = LANGUAGE_NAMES[langCode] || 'English';

    const systemPrompt = `You are a nutritionist specialized in food analysis. Your task is to identify foods and estimate their nutritional values per serving.

CRITICAL LANGUAGE RULE: You MUST respond ENTIRELY in ${langName}. All food names, descriptions, quantities, and any text must be in ${langName}. Do NOT use any other language. Do NOT translate to Portuguese unless the selected language is Portuguese.

RULES:
- Always respond in valid JSON
- ALL text fields (name, quantity, clarificationQuestion, error) MUST be in ${langName}
- If the user does not specify a quantity, set "needsQuantity": true and suggest a default quantity in ${langName}
- If you cannot identify the food, return "error" with a message in ${langName}
- NEVER invent nutritional values. Use real values from known nutritional tables (TACO, USDA)
- When values are estimates, set "isEstimate": true
- If the text is ambiguous or does not make sense as food, return "needsClarification": true with a question in ${langName}

JSON response format:
{
  "foods": [
    {
      "name": "food name in ${langName}",
      "quantity": "identified or suggested quantity in ${langName} (e.g. 100g, 1 unit)",
      "grams": 100,
      "nutrients": {
        "calories": 0,
        "protein": 0,
        "carbs": 0,
        "sugar": 0,
        "fat": 0,
        "sodium": 0,
        "fiber": 0
      },
      "isEstimate": true
    }
  ],
  "needsQuantity": false,
  "needsClarification": false,
  "clarificationQuestion": "",
  "error": null
}`;

    const messages: any[] = [
      { role: "system", content: systemPrompt },
    ];

    if (mode === 'photo' && imageBase64) {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: `Identify the food(s) in this image and estimate nutritional values. Respond in ${langName}.` },
          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
        ],
      });
    } else if (text) {
      messages.push({
        role: "user",
        content: `Analyze this food and return nutritional values. Respond in ${langName}: "${text}"`,
      });
    } else {
      return new Response(JSON.stringify({ error: "No data provided." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Insufficient credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Error analyzing food." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Error processing AI response." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-food error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
