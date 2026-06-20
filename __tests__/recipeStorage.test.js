import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createRecipe,
  deleteRecipe,
  getRecipeById,
  loadRecipes,
  resetRecipes,
  saveRecipes,
  updateRecipe,
} from '../src/storage/recipeStorage';

// AsyncStorage is auto-mocked by @react-native-async-storage/async-storage
// which provides an in-memory mock suitable for testing.

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('recipeStorage', () => {
  describe('loadRecipes', () => {
    it('seeds with built-in recipes on first load', async () => {
      const recipes = await loadRecipes();
      expect(recipes.length).toBeGreaterThan(0);
      expect(recipes[0]).toHaveProperty('id');
      expect(recipes[0]).toHaveProperty('title');
      expect(recipes[0]).toHaveProperty('content');
    });

    it('returns previously saved recipes on subsequent loads', async () => {
      const custom = [{ id: 'x', title: 'X', content: '# X', author: 'A', tags: [], createdAt: '' }];
      await saveRecipes(custom);
      const recipes = await loadRecipes();
      expect(recipes).toHaveLength(1);
      expect(recipes[0].id).toBe('x');
    });
  });

  describe('createRecipe', () => {
    it('creates a recipe and prepends it to the list', async () => {
      const data = {
        title: 'New Recipe',
        author: 'Alice',
        tags: ['Vegan'],
        prepTime: '5 min',
        cookTime: '10 min',
        servings: '2',
        content: '# New Recipe',
      };
      const recipe = await createRecipe(data);
      expect(recipe.id).toMatch(/^recipe-/);
      expect(recipe.title).toBe('New Recipe');
      expect(recipe.author).toBe('Alice');

      const all = await loadRecipes();
      expect(all[0].id).toBe(recipe.id);
    });
  });

  describe('getRecipeById', () => {
    it('returns the correct recipe', async () => {
      const created = await createRecipe({
        title: 'Find Me',
        author: 'Bob',
        tags: [],
        prepTime: '',
        cookTime: '',
        servings: '',
        content: '# Find Me',
      });
      const found = await getRecipeById(created.id);
      expect(found).not.toBeNull();
      expect(found.title).toBe('Find Me');
    });

    it('returns null for a non-existent id', async () => {
      const result = await getRecipeById('does-not-exist');
      expect(result).toBeNull();
    });
  });

  describe('updateRecipe', () => {
    it('updates fields on an existing recipe', async () => {
      const created = await createRecipe({
        title: 'Original',
        author: 'Carol',
        tags: [],
        prepTime: '',
        cookTime: '',
        servings: '',
        content: '# Original',
      });
      const updated = await updateRecipe(created.id, { title: 'Updated', content: '# Updated' });
      expect(updated.title).toBe('Updated');
      expect(updated.content).toBe('# Updated');
      expect(updated.author).toBe('Carol'); // unchanged

      const fetched = await getRecipeById(created.id);
      expect(fetched.title).toBe('Updated');
    });

    it('throws when the recipe does not exist', async () => {
      await expect(updateRecipe('nope', { title: 'X' })).rejects.toThrow('Recipe not found: nope');
    });
  });

  describe('deleteRecipe', () => {
    it('removes the recipe from storage', async () => {
      const created = await createRecipe({
        title: 'Delete Me',
        author: 'Dave',
        tags: [],
        prepTime: '',
        cookTime: '',
        servings: '',
        content: '# Delete Me',
      });
      await deleteRecipe(created.id);
      const found = await getRecipeById(created.id);
      expect(found).toBeNull();
    });
  });

  describe('resetRecipes', () => {
    it('clears storage so seeds are re-applied on next load', async () => {
      // First load seeds
      await loadRecipes();
      // Add custom
      await createRecipe({ title: 'Custom', author: 'E', tags: [], prepTime: '', cookTime: '', servings: '', content: '# C' });
      // Reset
      await resetRecipes();
      // Next load should return seeds again
      const recipes = await loadRecipes();
      expect(recipes.every((r) => r.id.startsWith('seed-'))).toBe(true);
    });
  });
});
