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

const MOCK_RESULT: DishResult = {
  name: "Butter Chicken",
  cuisine: "Punjabi, North Indian",
  confidence: 0.96,
  description: "Tender chicken in a rich, creamy tomato-butter sauce — a true Indian classic.",
  ingredients: ["chicken", "butter", "tomato", "cream", "ginger-garlic paste", "kashmiri red chilli", "garam masala", "kasuri methi"],
  steps: [
    "Marinate chicken in yoghurt and spices for 30 minutes.",
    "Grill or pan-fry the chicken until charred.",
    "Make sauce: simmer tomatoes, butter, cashews, and spices, then blend smooth.",
    "Add chicken to the sauce, simmer 10 minutes.",
    "Finish with cream and crushed kasuri methi.",
  ],
  macros: { calories: 480, protein: 34, carbs: 12, fats: 32, fibre: 3 },
  prepTime: 20,
  cookTime: 30,
  difficulty: "medium",
};

const VENICE_API_KEY = process.env.EXPO_PUBLIC_VENICE_API_KEY;
const VENICE_URL = "https://api.venice.ai/api/v1/chat/completions";
const IS_MOCK = !VENICE_API_KEY;

export async function recognizeDish(
  base64Image: string,
  mimeType: "image/jpeg" | "image/png" | "image/webp" = "image/jpeg"
): Promise<DishResult> {
  // Fallback to mock if no API key is set
  if (IS_MOCK) {
    await new Promise((res) => setTimeout(res, 1500));
    return MOCK_RESULT;
  }

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
