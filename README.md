# Reciprocity 🍳

A cross-platform community recipe app for Android and iOS built with [Expo](https://expo.dev) (React Native). Share, discover, and create recipes written in **Markdown**.

---

## Features

- 📖 **Browse recipes** — a searchable community feed of recipes
- ✍️ **Create & edit recipes** — write recipes in Markdown using a built-in editor
- 🎨 **Rendered markdown** — recipes are beautifully rendered with headings, lists, bold text, and more
- 🔗 **Share recipes** — share any recipe as a `.md`-formatted text with anyone
- 🗑️ **Delete recipes** — manage your recipe collection
- 📦 **Offline-first** — recipes are stored locally on your device using AsyncStorage
- 🌱 **Seed recipes** — three example recipes are pre-loaded on first launch

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)
- [Expo Go](https://expo.dev/go) app on your iOS or Android device (or an emulator)

### Install

```bash
npm install
```

### Run

```bash
# Start the Expo dev server
npm start

# Open on Android
npm run android

# Open on iOS (requires macOS)
npm run ios
```

### Test

```bash
npm test
```

---

## Project Structure

```
reciprocity/
├── App.js                     # Entry point
├── src/
│   ├── AppNavigator.js        # React Navigation root
│   ├── screens/
│   │   ├── FeedScreen.js      # Recipe list with search
│   │   ├── RecipeDetailScreen.js  # Markdown-rendered recipe view
│   │   └── RecipeEditScreen.js    # Markdown editor (create/edit)
│   ├── components/
│   │   └── RecipeCard.js      # Card component for the feed
│   ├── storage/
│   │   └── recipeStorage.js   # AsyncStorage CRUD helpers
│   ├── utils/
│   │   └── markdownUtils.js   # Markdown parsing utilities
│   └── data/
│       ├── seedRecipes.js     # Built-in seed recipes (JS strings)
│       └── recipes/           # Source .md files for seed content
│           ├── classic-spaghetti-bolognese.md
│           ├── avocado-toast.md
│           └── chocolate-chip-cookies.md
└── __tests__/
    ├── markdownUtils.test.js
    └── recipeStorage.test.js
```

---

## Recipe Markdown Format

Recipes are plain Markdown files. The app parses metadata from bold key-value pairs in the header:

```markdown
# Recipe Title

**Author:** Your Name  
**Prep Time:** 15 minutes  
**Cook Time:** 30 minutes  
**Servings:** 4  
**Tags:** Dinner, Vegetarian

---

## Description

Brief description of the dish.

---

## Ingredients

- Ingredient 1
- Ingredient 2

---

## Instructions

1. Step one
2. Step two

---

## Notes

Optional tips and variations.
```

---

## Contributing

This is a community app — contributions are welcome! Add your favourite recipes as `.md` files in `src/data/recipes/` and register them in `src/data/seedRecipes.js`.
