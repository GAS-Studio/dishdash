# DishDash

**Your Pantry, Perfected.**

DishDash is a mobile-first recipe discovery and meal planning app with an Inshorts-style swipe interface. Built during a vibe-coding sprint, it helps users discover recipes through an intuitive swipe deck, find meals based on what's in their pantry, identify dishes using AI-powered photo recognition, and plan daily meals — all wrapped in a warm, modern gourmet design system.

Try it here: https://dishdash-seven.vercel.app/landing

---

## Table of Contents

- [Product Requirements (PRD)](#product-requirements-prd)
- [Features Built](#features-built)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Team & Roles](#team--roles)
- [Design & AI Tools](#design--ai-tools)
- [Sample Prompts Used](#sample-prompts-used)

---

## Product Requirements (PRD)

### Vision

A cooking companion app that lowers the friction of home cooking by meeting users where they are — their pantry, their cravings, and their camera roll.

### Target Users

Home cooks (primarily Indian cuisine enthusiasts) who want quick recipe inspiration, pantry-based meal planning, and a delightful mobile-first experience.

### Core Flows

| # | Flow | Description |
|---|------|-------------|
| 1 | **Discover (Swipe Deck)** | Tinder-style recipe cards — swipe right to select, up to skip. Choose lunch or dinner slot via modal. |
| 2 | **Pantry Filter** | Select ingredients you have on hand across 7 categories (vegetables, dairy, grains, proteins, herbs, spices, staples). Get ranked recipe matches with ingredient-match scores. |
| 3 | **AI Dish Recognition** | Take a photo or pick from gallery. AI identifies the dish, returns cuisine, macros, ingredients, and step-by-step recipe. Add directly to your meal plan. |
| 4 | **Today's Plan** | View your selected lunch and dinner with macros, cook time, servings, and difficulty. Clear and re-plan anytime. |
| 5 | **Feedback** | Star rating + category tags + free-text feedback. Returning users see a thank-you card with their review history and can submit more. |
| 6 | **Auth & Onboarding** | Landing page with feature showcase, sign-up/login flow. Returning users skip straight to the app. State persists across sessions. |

### Success Metrics

- User can go from opening the app to having a meal planned in under 60 seconds
- Pantry filter returns relevant matches within 2 taps
- AI dish recognition returns results with confidence scores
- Returning users are recognized and skip onboarding

---

## Features Built

### Authentication & Onboarding
- Marketing landing page with animated feature cards
- Sign-up and login screens with form validation
- Persistent user sessions (returning users skip landing page)
- Web-compatible localStorage persistence

### Discover Tab (Swipe Deck)
- Inshorts-style swipeable recipe cards (native) / card grid (web)
- 43+ recipes across breakfast, lunch, and dinner
- Meal slot selection modal (Lunch / Dinner)
- Recipe detail page with hero image, macros, ingredients, and steps

### Pantry Tab (What Can I Make?)
- 7 ingredient categories with 60+ selectable ingredients
- Real-time recipe matching ranked by ingredient overlap
- Visual match-score progress bars
- Direct "Add to Lunch/Dinner" from results

### Log Tab (AI Dish Recognition)
- Camera capture and gallery picker via expo-image-picker
- Venice AI integration (GPT-4o vision model) for dish identification
- Returns: dish name, cuisine, confidence %, description, macros, ingredients, and full recipe
- Mock fallback mode for development without API keys
- Auto meal-slot detection based on time of day

### Today's Plan
- Dual meal card layout (Lunch + Dinner)
- Macro summary, cook time, servings, difficulty badges
- Cuisine tags and chef inspiration text
- Clear Plan with confirmation dialog

### Feedback System
- 5-star interactive rating
- Category tag selection (UI/UX, AI Suggestions, Pantry Scanner, Other)
- Free-text feedback with character tracking
- Persistent feedback history with "already submitted" thank-you state
- "Share More Feedback" option for returning reviewers

### Shared Components
- DishDash branded header with "Today's Plan" quick-access button
- Consistent design tokens across all screens
- Phone-frame wrapper on web (390x844) for mobile preview
- Platform-adaptive alerts (native Alert vs web window.confirm)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React Native (Expo ~55) |
| **Routing** | Expo Router (file-based navigation) |
| **State Management** | Zustand v5 with manual localStorage persistence |
| **Language** | TypeScript 5.9 |
| **Typography** | Plus Jakarta Sans (via @expo-google-fonts) |
| **Swipe Deck** | react-native-deck-swiper (native platforms) |
| **Image Picker** | expo-image-picker |
| **AI / Vision** | Venice AI API (GPT-4o vision model) |
| **Web Support** | react-native-web |
| **Design System** | Custom theme tokens (colors, fonts, spacing, radius) |
| **Deployment** | Vercel (web), Expo (native) |
| **Version Control** | Git + GitHub |

---

## Project Structure

Here's how the codebase is organized — each folder has a specific job:

```
dishdash/
│
├── app/                            # All the SCREENS (pages) of the app
│   │                               #   Expo Router uses file names as URLs
│   │                               #   (like Next.js for mobile!)
│   │
│   ├── _layout.tsx                 # Wraps every screen — loads fonts,
│   │                               #   adds the phone-frame on web
│   ├── index.tsx                   # First thing that runs — checks if
│   │                               #   you're logged in, then redirects
│   ├── landing.tsx                 # Welcome page new users see first
│   ├── login.tsx                   # Log in with your email
│   ├── signup.tsx                  # Create a new account
│   │
│   ├── (tabs)/                     # The 4 tabs at the bottom of the app
│   │   ├── _layout.tsx             # Configures the tab bar (icons, colors)
│   │   ├── index.tsx               # 🍽️ Discover — swipe through recipe cards
│   │   ├── pantry.tsx              # 📋 Pantry — pick ingredients, find recipes
│   │   ├── upload.tsx              # 📷 Log — snap a photo, AI identifies the dish
│   │   ├── browse.tsx              # 💬 Feedback — rate the app & leave reviews
│   │   └── plan.tsx                # 📅 Today's Plan — see your lunch & dinner
│   │
│   └── recipe/
│       └── [id].tsx                # Recipe detail page — the [id] means it's
│                                   #   dynamic (one page for ALL recipes)
│
├── components/                     # REUSABLE UI pieces (used across screens)
│   ├── RecipeCard.tsx              # The swipeable card in the Discover tab
│   └── SharedHeader.tsx            # "DishDash" logo + "Today's Plan" button
│                                   #   shown at the top of every screen
│
├── store/                          # APP STATE (Zustand) — the "brain" of the app
│   └── useMealStore.ts             # Stores: logged-in user, selected meals,
│                                   #   pantry ingredients, feedback history
│                                   #   Saves to localStorage so data survives refresh
│
├── constants/                      # SETTINGS & CONFIG that don't change
│   ├── theme.ts                    # Brand colors, fonts, spacing, border radius
│   ├── ingredientCategories.ts     # List of all pantry ingredients by category
│   └── images.ts                   # Maps recipe IDs → their image files
│
├── data/                           # RECIPE DATABASE (static JSON files)
│   ├── recipes_breakfast.json      # 18 breakfast recipes (Poha, Dosa, Idli…)
│   └── recipes_lunchdinner.json    # 25+ lunch & dinner recipes (Dal, Paneer…)
│
├── lib/                            # UTILITIES & API helpers
│   └── recognizeDish.ts            # Sends photos to Venice AI (GPT-4o Vision)
│                                   #   to identify dishes — falls back to mock
│                                   #   data if no API key is set
│
└── assets/                         # STATIC FILES (images, icons)
    └── recipes/                    # 45 food photos used on recipe cards
        ├── b001.png … b018.png     # Breakfast images
        └── ld001.jpg … ld026.jpg   # Lunch & dinner images
```

> **Tip for beginners:** Start by reading `app/index.tsx` (the entry point), then `app/(tabs)/index.tsx` (the Discover screen), and `store/useMealStore.ts` (the state). That gives you the full picture of how data flows through the app!

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npx expo`)

### Installation

```bash
git clone https://github.com/GAS-Studio/dishdash.git
cd dishdash
npm install
```

### Running the App

```bash
# Web
npx expo start --web

# iOS Simulator
npx expo start --ios

# Android Emulator
npx expo start --android
```

### Environment Variables (Optional)

For AI dish recognition with real API calls:

```
EXPO_PUBLIC_VENICE_API_KEY=your_venice_api_key
```

Without this key, the app uses a mock fallback for the Log (Dish Recognition) tab.

---

## Team & Roles

This project was built by **GAS Studio** during a vibe-coding sprint.

| Team Member | Role | Contributions |
|-------------|------|---------------|
| **Person A** | Frontend & UX Lead | Swipe deck UI, recipe card component, recipe detail screen, design token system, Stitch-based theming, landing/login/signup pages, shared header, feedback history UI, state persistence, web compatibility fixes |
| **Person B** | AI & Data Lead | AI dish recognition (Venice AI / GPT-4o vision), photo upload screen, recipe data curation (43+ recipes), recipe image sourcing, mock fallback mode |
| **Person C** | Features & Planning Lead | Today's Plan screen, Pantry Filter screen (ingredient categories + recipe matching), Zustand store architecture, meal slot selection flow |

---

## Design & AI Tools

| Tool | Usage |
|------|-------|
| **Stitch** | UI design and prototyping — the "Modern Gourmet" theme (warm terracotta, olive green, golden yellow palette) was designed in Stitch and translated into React Native design tokens |
| **ChatGPT** | Image prompt generation — recipe image descriptions were written and refined using ChatGPT to get the right food photography style |
| **Gemini (ImageFX)** | Image creation — all recipe photos were generated using Google's Gemini / ImageFX based on the ChatGPT-crafted prompts |
| **Claude Code** | AI-assisted development — used throughout for building components, debugging, state management, and end-to-end testing |

---

## Sample Prompts Used

### Recipe Image Generation (ChatGPT + Gemini)

> "Generate a top-down food photography shot of Butter Paneer Masala in a rustic clay bowl, garnished with fresh cream and cilantro, warm natural lighting, wooden table background, shallow depth of field"

> "Overhead shot of crispy golden Masala Dosa on a banana leaf with coconut chutney and sambar in small steel bowls, South Indian restaurant setting, vibrant colors"

### AI Dish Recognition (Venice AI / GPT-4o)

> "You are a food recognition expert. Identify this dish from the photo. Return ONLY a JSON object with: name, cuisine (be specific — if Indian, specify region like Punjabi, Gujarati, South Indian), confidence score, description, ingredients, steps, macros per serving, prep time, cook time, and difficulty."

### UI Development (Claude Code)

> "Build a swipe deck recipe discovery screen using react-native-deck-swiper. Each card should show the recipe image, name, description, cuisine tags, and macro badges. Swiping right selects the recipe and opens a modal to choose Lunch or Dinner."

> "Create a pantry filter screen with ingredient categories (vegetables, dairy, grains, proteins, herbs, spices, staples). Users select what they have, tap 'Find Recipes', and see ranked matches with ingredient overlap scores."

> "Add persistent user sessions using Zustand. On web, persist to localStorage. Returning users should skip the landing page and go straight to the app."

---

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Terracotta Coral | `#E2725B` | Primary — CTAs, active states |
| Olive Green | `#8A9A5B` | Secondary — tags, badges |
| Golden Yellow | `#F4C430` | Tertiary — highlights, stars |
| Warm Brown | `#956E60` | Neutral — text, outlines |
| Peach Cream | `#FDF0EB` | Background |

---

## License

This project was created as part of a vibe-coding sprint by GAS Studio.

---

Built with vibe, code, and a whole lot of recipes.
