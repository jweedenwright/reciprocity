import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { markdownSummary } from '../utils/markdownUtils';

/**
 * A card displayed in the recipe feed list.
 *
 * @param {{ recipe: import('../storage/recipeStorage').Recipe, onPress: () => void }} props
 */
export default function RecipeCard({ recipe, onPress }) {
  const summary = markdownSummary(recipe.content);
  const tagList = (recipe.tags ?? []).slice(0, 3);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.title} numberOfLines={2}>
        {recipe.title}
      </Text>
      <Text style={styles.author}>by {recipe.author}</Text>
      {summary ? (
        <Text style={styles.summary} numberOfLines={2}>
          {summary}
        </Text>
      ) : null}
      <View style={styles.meta}>
        {recipe.prepTime ? (
          <Text style={styles.metaItem}>⏱ {recipe.prepTime}</Text>
        ) : null}
        {recipe.servings ? (
          <Text style={styles.metaItem}>🍽 {recipe.servings}</Text>
        ) : null}
      </View>
      {tagList.length > 0 && (
        <View style={styles.tags}>
          {tagList.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  author: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
  },
  summary: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 10,
  },
  meta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  metaItem: {
    fontSize: 13,
    color: '#666',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#e8f4fd',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 12,
    color: '#1a73e8',
    fontWeight: '500',
  },
});
