import AsyncStorage from '@react-native-async-storage/async-storage';
import SEED_RECIPES from '../data/seedRecipes';

const RECIPES_KEY = 'reciprocity:recipes';

/**
 * Load all recipes from AsyncStorage. Seeds built-in recipes on first load.
 * @returns {Promise<Recipe[]>}
 */
export async function loadRecipes() {
  const raw = await AsyncStorage.getItem(RECIPES_KEY);
  if (raw !== null) {
    return JSON.parse(raw);
  }
  // First run — seed with built-in recipes
  await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(SEED_RECIPES));
  return SEED_RECIPES;
}

/**
 * Save all recipes to AsyncStorage.
 * @param {Recipe[]} recipes
 */
export async function saveRecipes(recipes) {
  await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
}

/**
 * Get a single recipe by id.
 * @param {string} id
 * @returns {Promise<Recipe|null>}
 */
export async function getRecipeById(id) {
  const recipes = await loadRecipes();
  return recipes.find((r) => r.id === id) ?? null;
}

/**
 * Create a new recipe and persist it.
 * @param {{ title: string, author: string, tags: string[], prepTime: string, cookTime: string, servings: string, content: string }} data
 * @returns {Promise<Recipe>}
 */
export async function createRecipe(data) {
  const recipes = await loadRecipes();
  const recipe = {
    id: `recipe-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...data,
  };
  await saveRecipes([recipe, ...recipes]);
  return recipe;
}

/**
 * Update an existing recipe by id.
 * @param {string} id
 * @param {Partial<Recipe>} updates
 * @returns {Promise<Recipe>}
 */
export async function updateRecipe(id, updates) {
  const recipes = await loadRecipes();
  const index = recipes.findIndex((r) => r.id === id);
  if (index === -1) throw new Error(`Recipe not found: ${id}`);
  const updated = { ...recipes[index], ...updates };
  recipes[index] = updated;
  await saveRecipes(recipes);
  return updated;
}

/**
 * Delete a recipe by id.
 * @param {string} id
 */
export async function deleteRecipe(id) {
  const recipes = await loadRecipes();
  await saveRecipes(recipes.filter((r) => r.id !== id));
}

/**
 * Reset storage to seed data (useful for testing/debugging).
 */
export async function resetRecipes() {
  await AsyncStorage.removeItem(RECIPES_KEY);
}
