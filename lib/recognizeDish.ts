export type DishResult = {
  name: string;
  cuisine: string;
  confidence: number;
  description: string;
  ingredients: string[];
  steps: string[];
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fibre: number;
  };
  prepTime: number;
  cookTime: number;
  difficulty: string;
};

const VENICE_API_KEY = process.env.EXPO_PUBLIC_VENICE_API_KEY;
const VENICE_URL = "https://api.venice.ai/api/v1/chat/completions";

export async function recognizeDish(
  base64Image: string,
  mimeType: "image/jpeg" | "image/png" | "image/webp" = "image/jpeg"
): Promise<DishResult> {
  const response = await fetch(VENICE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${VENICE_API_KEY}`,
    },
    body: JSON.stringify({
      model: "openai-gpt-4o-2024-11-20",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
            {
              type: "text",
              text: `You are a food recognition expert. Identify this dish from the photo.

Return ONLY a JSON object (no markdown, no backticks, no explanation), with this exact structure:
{"name":"Dish Name","cuisine":"Specific Cuisine (e.g. Punjabi, South Indian, Italian, Mexican, Thai)","confidence":0.95,"description":"One-line description","ingredients":["ingredient1","ingredient2"],"steps":["Step 1","Step 2","Step 3"],"macros":{"calories":350,"protein":18,"carbs":30,"fats":15,"fibre":4},"prepTime":15,"cookTime":25,"difficulty":"easy"}

Be specific with cuisine. If Indian, specify region (Punjabi, Gujarati, South Indian, etc.). Estimate macros per serving. Return valid JSON only.`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Venice API error: ${response.status} ${err}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "";

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Could not parse AI response");
  return JSON.parse(jsonMatch[0]);
}
