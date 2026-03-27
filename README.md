# DishDash

**Your Pantry, Perfected.**

DishDash is a mobile-first recipe discovery and meal planning app with an Inshorts-style swipe interface. Built during a vibe-coding sprint, it helps users discover recipes through an intuitive swipe deck, find meals based on what's in their pantry, identify dishes using AI-powered photo recognition, and plan daily meals — all wrapped in a warm, modern gourmet design system.

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

```
dishdash/
├── app/                           # Screens & routing (Expo Router)
│   ├── _layout.tsx               # Root layout, font loading, web phone-frame
│   ├── index.tsx                 # Auth check → redirect
│   ├── landing.tsx               # Marketing landing page
│   ├── login.tsx                 # Email login
│   ├── signup.tsx                # Account registration
│   ├── (tabs)/                   # Bottom tab navigator
│   │   ├── _layout.tsx           # Tab bar config (4 visible tabs)
│   │   ├── index.tsx             # Discover — swipe deck
│   │   ├── pantry.tsx            # Pantry — ingredient filter
│   │   ├── upload.tsx            # Log — AI dish recognition
│   │   ├── browse.tsx            # Feedback — user reviews
│   │   └── plan.tsx              # Today's Plan — meal display
│   └── recipe/
│       └── [id].tsx              # Recipe detail (dynamic route)
├── components/
│   ├── RecipeCard.tsx            # Swipeable recipe card
│   └── SharedHeader.tsx          # Branded header with nav
├── store/
│   └── useMealStore.ts           # Zustand global store
├── constants/
│   ├── theme.ts                  # Design tokens (colors, fonts, spacing)
│   ├── ingredientCategories.ts   # Pantry ingredient data
│   └── images.ts                 # Static image imports map
├── data/
│   ├── recipes_breakfast.json    # 18 breakfast recipes
│   └── recipes_lunchdinner.json  # 25+ lunch/dinner recipes
├── lib/
│   └── recognizeDish.ts          # Venice AI dish recognition
└── assets/
    └── recipes/                  # 45 recipe images (b001-b018, ld001-ld026)
```

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
