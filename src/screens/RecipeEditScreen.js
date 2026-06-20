import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { createRecipe, getRecipeById, updateRecipe } from '../storage/recipeStorage';

const PLACEHOLDER_CONTENT = `# My Recipe Title

**Author:** Your Name  
**Prep Time:** 10 minutes  
**Cook Time:** 20 minutes  
**Servings:** 4  
**Tags:** Dinner, Quick

---

## Description

Describe your recipe here.

---

## Ingredients

| Type | Ingredient | Metric | Imperial |
|---|---|---|---|
| Pantry | Ingredient 1 | 100 g | 3.5 oz |
| Fridge | Ingredient 2 | 2 large | 2 large |

---

## Instructions

1. Step one
2. Step two

---

## Notes

Any extra tips go here.
`;

/**
 * Recipe creation/edit screen — a raw markdown editor with a live preview toggle.
 */
export default function RecipeEditScreen({ navigation, route }) {
  const recipeId = route.params?.recipeId;
  const isEditing = Boolean(recipeId);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState(PLACEHOLDER_CONTENT);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEditing) return;
    setLoading(true);
    getRecipeById(recipeId)
      .then((recipe) => {
        if (recipe) {
          setTitle(recipe.title);
          setContent(recipe.content);
        }
      })
      .finally(() => setLoading(false));
  }, [recipeId, isEditing]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Edit Recipe' : 'New Recipe',
    });
  }, [isEditing, navigation]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Missing title', 'Please enter a recipe title.');
      return;
    }
    if (!content.trim()) {
      Alert.alert('Missing content', 'Please add some recipe content.');
      return;
    }

    setSaving(true);
    try {
      if (isEditing) {
        await updateRecipe(recipeId, { title: title.trim(), content });
        navigation.navigate('RecipeDetail', { recipeId });
      } else {
        const recipe = await createRecipe({
          title: title.trim(),
          author: 'Community Member',
          tags: [],
          prepTime: '',
          cookTime: '',
          servings: '',
          content,
        });
        navigation.replace('RecipeDetail', { recipeId: recipe.id });
      }
    } catch (err) {
      Alert.alert('Error', 'Could not save the recipe. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Recipe Title</Text>
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Grandma's Apple Pie"
          placeholderTextColor="#bbb"
          returnKeyType="next"
          accessibilityLabel="Recipe title"
        />

        <Text style={styles.label}>Markdown Content</Text>
        <Text style={styles.hint}>
          Write your recipe using Markdown. Use # for headings, - for lists, **bold**, etc.
        </Text>
        <TextInput
          style={styles.editor}
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
          autoCorrect={false}
          autoCapitalize="none"
          placeholder={PLACEHOLDER_CONTENT}
          placeholderTextColor="#ccc"
          accessibilityLabel="Recipe markdown content"
        />

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
          accessibilityLabel={isEditing ? 'Update recipe' : 'Save recipe'}
          accessibilityRole="button"
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>{isEditing ? 'Update Recipe' : 'Save Recipe'}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  titleInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 20,
  },
  editor: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#1a1a1a',
    minHeight: 400,
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: '#1a73e8',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
