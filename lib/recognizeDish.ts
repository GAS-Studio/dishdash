import Anthropic from "@anthropic-ai/sdk";

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

const IS_MOCK = !process.env.EXPO_PUBLIC_CLAUDE_API_KEY;

const client = new Anthropic({
  apiKey: process.env.EXPO_PUBLIC_CLAUDE_API_KEY ?? "mock",
  dangerouslyAllowBrowser: true,
});

export async function recognizeDish(
  base64Image: string,
  mimeType: "image/jpeg" | "image/png" | "image/webp" = "image/jpeg"
): Promise<DishResult> {
  if (IS_MOCK) {
    await new Promise((res) => setTimeout(res, 1500)); // simulate network delay
    return MOCK_RESULT;
  }

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mimeType,
              data: base64Image,
            },
          },
          {
            type: "text",
            text: `You are a food recognition expert. Identify this dish from the photo.

Return ONLY a JSON object (no markdown, no explanation), with this exact structure:
{
  "name": "Dish Name",
  "cuisine": "Specific Cuisine (e.g. Punjabi, South Indian, Italian, Mexican, Thai)",
  "confidence": 0.95,
  "description": "One-line description",
  "ingredients": ["ingredient1", "ingredient2"],
  "steps": ["Step 1", "Step 2", "Step 3"],
  "macros": { "calories": 350, "protein": 18, "carbs": 30, "fats": 15, "fibre": 4 },
  "prepTime": 15,
  "cookTime": 25,
  "difficulty": "easy"
}

Be specific with cuisine. Estimate macros per serving. Return valid JSON only.`,
          },
        ],
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Could not parse AI response");
  return JSON.parse(jsonMatch[0]);
}
