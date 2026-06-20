import React, { useCallback, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useFocusEffect } from '@react-navigation/native';
import { deleteRecipe, getRecipeById } from '../storage/recipeStorage';
import { recipeToMarkdown } from '../utils/markdownUtils';

/**
 * Recipe detail screen — renders the recipe's markdown content.
 */
export default function RecipeDetailScreen({ navigation, route }) {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      getRecipeById(recipeId)
        .then((data) => {
          if (active) setRecipe(data);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
    }, [recipeId]),
  );

  useLayoutEffect(() => {
    if (!recipe) return;
    navigation.setOptions({
      title: recipe.title,
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={handleShare}
            accessibilityLabel="Share recipe"
            style={styles.headerBtn}
          >
            <Text style={styles.headerBtnText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleEdit}
            accessibilityLabel="Edit recipe"
            style={styles.headerBtn}
          >
            <Text style={styles.headerBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [recipe, navigation]);

  const handleShare = async () => {
    if (!recipe) return;
    try {
      await Share.share({
        title: recipe.title,
        message: recipeToMarkdown(recipe),
      });
    } catch {
      // User cancelled or unsupported — no-op
    }
  };

  const handleEdit = () => {
    navigation.navigate('RecipeEdit', { recipeId: recipe.id });
  };

  const handleDelete = () => {
    Alert.alert('Delete Recipe', `Are you sure you want to delete "${recipe.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteRecipe(recipe.id);
          navigation.goBack();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Recipe not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Markdown style={markdownStyles}>{recipe.content}</Markdown>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
        accessibilityLabel="Delete recipe"
        accessibilityRole="button"
      >
        <Text style={styles.deleteButtonText}>Delete Recipe</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#888',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
    marginRight: 4,
  },
  headerBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  headerBtnText: {
    color: '#1a73e8',
    fontSize: 16,
    fontWeight: '500',
  },
  deleteButton: {
    marginTop: 32,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#d93025',
  },
  deleteButtonText: {
    color: '#d93025',
    fontSize: 15,
    fontWeight: '600',
  },
});

// Styles passed to the Markdown renderer
const markdownStyles = {
  body: {
    color: '#1a1a1a',
    fontSize: 15,
    lineHeight: 24,
  },
  heading1: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 0,
    marginBottom: 8,
  },
  heading2: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginTop: 20,
    marginBottom: 6,
  },
  heading3: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginTop: 14,
    marginBottom: 4,
  },
  hr: {
    backgroundColor: '#e0e0e0',
    height: 1,
    marginVertical: 16,
  },
  strong: {
    fontWeight: '700',
  },
  bullet_list: {
    marginBottom: 8,
  },
  ordered_list: {
    marginBottom: 8,
  },
  list_item: {
    marginBottom: 4,
  },
  blockquote: {
    backgroundColor: '#f5f7fa',
    borderLeftColor: '#1a73e8',
    borderLeftWidth: 4,
    paddingLeft: 12,
    paddingVertical: 4,
    marginVertical: 8,
  },
  code_inline: {
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    paddingHorizontal: 4,
    fontFamily: 'monospace',
    fontSize: 13,
  },
  fence: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    fontFamily: 'monospace',
    fontSize: 13,
  },
};
