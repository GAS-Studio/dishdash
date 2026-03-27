import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { recognizeDish, type DishResult } from "../../lib/recognizeDish";
import { useMealStore, type Recipe } from "../../store/useMealStore";
import SharedHeader from "../../components/SharedHeader";
import { colors, fonts, radius } from "../../constants/theme";

const TAB_BAR_HEIGHT = Platform.OS === "ios" ? 82 : 72;

export default function UploadScreen() {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DishResult | null>(null);
  const [added, setAdded] = useState(false);
  const [mealSlot, setMealSlot] = useState<"lunch" | "dinner">(
    new Date().getHours() < 15 ? "lunch" : "dinner"
  );
  const { setLunch, setDinner } = useMealStore();

  const pickImage = async (useCamera: boolean) => {
    setResult(null);
    setAdded(false);
    setImageBase64(null);

    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ["images"],
      quality: 0.7,
      base64: true,
    };

    const pickerResult = useCamera
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);

    if (!pickerResult.canceled && pickerResult.assets[0]) {
      setImageUri(pickerResult.assets[0].uri);
      setImageBase64(pickerResult.assets[0].base64 || null);
    }
  };

  const recognize = async () => {
    if (!imageUri || !imageBase64) return;
    setLoading(true);
    try {
      const mimeType = imageUri.toLowerCase().endsWith(".png")
        ? "image/png"
        : "image/jpeg";

      const dish = await recognizeDish(imageBase64, mimeType as "image/jpeg" | "image/png");
      setResult(dish);
    } catch (err) {
      console.error(err);
      Alert.alert("Recognition Failed", "Could not identify the dish. Try another photo.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToPlan = () => {
    if (!result) return;

    const recipe: Recipe = {
      id: `ai-${Date.now()}`,
      name: result.name,
      mealType: "lunch/dinner",
      cuisineTag: [result.cuisine],
      prepTime: result.prepTime,
      cookTime: result.cookTime,
      servings: 4,
      difficulty: result.difficulty,
      chefInspiration: "AI Recognized",
      description: result.description,
      ingredients: result.ingredients.map((name) => ({
        name,
        quantity: "",
        unit: "",
      })),
      steps: result.steps,
      macros: result.macros,
      imageUrl: imageUri || "",
    };

    if (mealSlot === "lunch") {
      setLunch(recipe);
    } else {
      setDinner(recipe);
    }
    setAdded(true);
    // Navigate to plan after a brief moment so user sees confirmation
    setTimeout(() => {
      router.push("/(tabs)/plan");
    }, 600);
  };

  return (
    <View style={styles.wrapper}>
      <SharedHeader />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.title}>Identify Dish</Text>
        <Text style={styles.subtitle}>
          Upload a photo and let AI recognize your dish
        </Text>

        {/* Image Area */}
        {!imageUri ? (
          <View style={styles.uploadArea}>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => pickImage(true)}
            >
              <Ionicons name="camera" size={32} color={colors.primary} />
              <Text style={styles.uploadText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => pickImage(false)}
            >
              <Ionicons name="images" size={32} color={colors.primary} />
              <Text style={styles.uploadText}>Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.previewContainer}>
            <Image source={{ uri: imageUri }} style={styles.preview} />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setImageUri(null);
                setImageBase64(null);
                setResult(null);
                setAdded(false);
              }}
            >
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* Recognize Button */}
        {imageUri && !result && (
          <TouchableOpacity
            style={[styles.recognizeBtn, loading && styles.disabledBtn]}
            onPress={recognize}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={colors.onPrimary} size="small" />
                <Text style={styles.btnText}>Recognizing...</Text>
              </View>
            ) : (
              <View style={styles.loadingRow}>
                <Ionicons name="flash" size={20} color={colors.onPrimary} />
                <Text style={styles.btnText}>Recognize Dish</Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        {/* Result Card */}
        {result && (
          <View style={styles.resultCard}>
            {/* Dish Name + Cuisine */}
            <View style={styles.resultHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.dishName}>{result.name}</Text>
                <View style={styles.cuisineTag}>
                  <Text style={styles.cuisineText}>{result.cuisine}</Text>
                </View>
              </View>
              <View style={styles.confidenceBadge}>
                <Text style={styles.confidenceText}>
                  {Math.round(result.confidence * 100)}%
                </Text>
              </View>
            </View>

            <Text style={styles.description}>{result.description}</Text>

            {/* Macros Row */}
            <View style={styles.macrosRow}>
              {[
                { label: "Cal", value: result.macros.calories, unit: "" },
                { label: "Protein", value: result.macros.protein, unit: "g" },
                { label: "Carbs", value: result.macros.carbs, unit: "g" },
                { label: "Fat", value: result.macros.fats, unit: "g" },
                { label: "Fibre", value: result.macros.fibre, unit: "g" },
              ].map((m) => (
                <View key={m.label} style={styles.macroItem}>
                  <Text style={styles.macroValue}>
                    {m.value}
                    {m.unit}
                  </Text>
                  <Text style={styles.macroLabel}>{m.label}</Text>
                </View>
              ))}
            </View>

            {/* Ingredients */}
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <View style={styles.ingredientWrap}>
              {result.ingredients.map((ing, i) => (
                <View key={i} style={styles.ingredientPill}>
                  <Text style={styles.ingredientText}>{ing}</Text>
                </View>
              ))}
            </View>

            {/* Steps */}
            <Text style={styles.sectionTitle}>Recipe</Text>
            {result.steps.map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <Text style={styles.stepNumber}>{i + 1}.</Text>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}

            {/* Meal Slot Selector */}
            <View style={styles.slotRow}>
              {(["lunch", "dinner"] as const).map((slot) => (
                <TouchableOpacity
                  key={slot}
                  style={[
                    styles.slotBtn,
                    mealSlot === slot && styles.slotBtnActive,
                  ]}
                  onPress={() => setMealSlot(slot)}
                >
                  <Text
                    style={[
                      styles.slotText,
                      mealSlot === slot && styles.slotTextActive,
                    ]}
                  >
                    {slot.charAt(0).toUpperCase() + slot.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Add to Plan */}
            {!added ? (
              <TouchableOpacity
                style={styles.addBtn}
                onPress={handleAddToPlan}
              >
                <Ionicons name="add-circle" size={22} color={colors.onPrimary} />
                <Text style={styles.addBtnText}>
                  Add to Today's{" "}
                  {mealSlot === "lunch" ? "Lunch" : "Dinner"}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.addedBanner}>
                <Ionicons name="checkmark-circle" size={22} color={colors.secondary} />
                <Text style={styles.addedText}>
                  Added to {mealSlot === "lunch" ? "Lunch" : "Dinner"}!
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 16,
    paddingBottom: TAB_BAR_HEIGHT + 40,
  },
  title: {
    fontSize: 26,
    fontFamily: fonts.displayBold,
    color: colors.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.onSurfaceVariant,
    marginBottom: 24,
  },
  // Upload area
  uploadArea: {
    flexDirection: "row",
    gap: 12,
  },
  uploadButton: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.outlineVariant,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceContainerLowest,
    gap: 8,
  },
  uploadText: {
    fontSize: 13,
    fontFamily: fonts.bodySemiBold,
    color: colors.onSurfaceVariant,
    textAlign: "center",
  },
  // Preview
  previewContainer: {
    position: "relative",
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  preview: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: radius.lg,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  // Recognize button
  recognizeBtn: {
    marginTop: 16,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  btnText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontFamily: fonts.bodyBold,
  },
  // Result card
  resultCard: {
    marginTop: 20,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.lg,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  dishName: {
    fontSize: 22,
    fontFamily: fonts.displayBold,
    color: colors.onSurface,
  },
  cuisineTag: {
    marginTop: 6,
    alignSelf: "flex-start",
    backgroundColor: colors.tertiaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  cuisineText: {
    fontSize: 12,
    fontFamily: fonts.bodySemiBold,
    color: colors.onTertiaryContainer,
  },
  confidenceBadge: {
    backgroundColor: colors.secondaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  confidenceText: {
    fontSize: 12,
    fontFamily: fonts.bodySemiBold,
    color: colors.secondary,
  },
  description: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.onSurfaceVariant,
    marginTop: 12,
    lineHeight: 20,
  },
  // Macros
  macrosRow: {
    flexDirection: "row",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
  },
  macroItem: {
    flex: 1,
    alignItems: "center",
  },
  macroValue: {
    fontSize: 15,
    fontFamily: fonts.bodyBold,
    color: colors.onSurface,
  },
  macroLabel: {
    fontSize: 10,
    fontFamily: fonts.body,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  // Ingredients
  sectionTitle: {
    fontSize: 12,
    fontFamily: fonts.bodyBold,
    color: colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 8,
  },
  ingredientWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  ingredientPill: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  ingredientText: {
    fontSize: 12,
    fontFamily: fonts.bodyMedium,
    color: colors.onSurface,
  },
  // Steps
  stepRow: {
    flexDirection: "row",
    marginBottom: 8,
    gap: 8,
  },
  stepNumber: {
    fontSize: 13,
    fontFamily: fonts.bodySemiBold,
    color: colors.primary,
    minWidth: 18,
  },
  stepText: {
    fontSize: 13,
    fontFamily: fonts.body,
    color: colors.onSurface,
    flex: 1,
    lineHeight: 19,
  },
  // Meal slot
  slotRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  slotBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: "center",
  },
  slotBtnActive: {
    backgroundColor: colors.primary,
  },
  slotText: {
    fontSize: 14,
    fontFamily: fonts.bodySemiBold,
    color: colors.onSurfaceVariant,
  },
  slotTextActive: {
    color: colors.onPrimary,
  },
  // Add button
  addBtn: {
    marginTop: 12,
    backgroundColor: colors.secondary,
    borderRadius: radius.md,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  addBtnText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontFamily: fonts.bodyBold,
  },
  addedBanner: {
    marginTop: 12,
    backgroundColor: colors.secondaryContainer,
    borderRadius: radius.md,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addedText: {
    color: colors.secondary,
    fontSize: 16,
    fontFamily: fonts.bodySemiBold,
  },
});
