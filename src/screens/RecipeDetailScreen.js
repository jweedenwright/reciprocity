import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
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
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useFocusEffect } from '@react-navigation/native';
import { deleteRecipe, getRecipeById } from '../storage/recipeStorage';
import { recipeToMarkdown, scaleMarkdownIngredients } from '../utils/markdownUtils';

/**
 * Split recipe content into three parts around the ## Instructions section:
 *   before  — everything up to and including the "## Instructions" heading line
 *   steps   — array of plain-text step strings parsed from "- [ ] …" items
 *   after   — everything from the next ## section onwards (with its leading separator)
 *
 * @param {string} content
 * @returns {{ before: string, steps: string[], after: string }}
 */
function parseInstructionSteps(content) {
  if (!content) return { before: '', steps: [], after: '' };

  const headingRe = /^##\s+Instructions[^\n]*\n/m;
  const headingMatch = headingRe.exec(content);
  if (!headingMatch) return { before: content, steps: [], after: '' };

  const before = content.slice(0, headingMatch.index + headingMatch[0].length);
  const bodyAndAfter = content.slice(before.length);

  const nextHeadingRe = /^##\s+/m;
  const nextMatch = nextHeadingRe.exec(bodyAndAfter);

  const instructionsBody = nextMatch
    ? bodyAndAfter.slice(0, nextMatch.index)
    : bodyAndAfter;

  // If the instructions body ends with a horizontal rule, keep it with 'after'
  let afterContent = nextMatch ? bodyAndAfter.slice(nextMatch.index) : '';
  const trailHrMatch = /(\n---\s*\n\s*)$/.exec(instructionsBody);
  if (trailHrMatch && afterContent) {
    afterContent = instructionsBody.slice(trailHrMatch.index) + afterContent;
  }

  // Extract task-list steps: "- [ ] step text" or "- [x] step text"
  const steps = [];
  for (const line of instructionsBody.split('\n')) {
    const m = line.match(/^-\s+\[[ xX]\]\s+([\s\S]+)$/);
    if (m) steps.push(m[1].trim());
  }

  return { before, steps, after: afterContent };
}

/**
 * Render step text that may contain **bold** markers as inline React Native Text.
 *
 * @param {string} text
 * @param {boolean} checked
 * @returns {React.ReactNode[]}
 */
function renderStepText(text, checked) {
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <Text key={i} style={styles.stepBold}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    return part;
  });
}

/**
 * Recipe detail screen — renders the recipe's markdown content.
 */
export default function RecipeDetailScreen({ navigation, route }) {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkedSteps, setCheckedSteps] = useState(new Set());
  const [cookMode, setCookMode] = useState(false);
  const [multiplier, setMultiplier] = useState(1);

  // Keep screen awake while cook mode is active; release on unmount or toggle off
  useEffect(() => {
    if (cookMode) {
      activateKeepAwakeAsync('cook-mode');
    } else {
      deactivateKeepAwake('cook-mode');
    }
    return () => {
      deactivateKeepAwake('cook-mode');
    };
  }, [cookMode]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      setCheckedSteps(new Set());
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

  const scaledContent = useMemo(
    () => scaleMarkdownIngredients(recipe?.content ?? '', multiplier),
    [recipe?.content, multiplier],
  );

  const { before, steps, after } = useMemo(
    () => parseInstructionSteps(scaledContent),
    [scaledContent],
  );

  const toggleStep = (idx) => {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

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
      {/* Cook Mode + Multiplier toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity
          onPress={() => setCookMode((prev) => !prev)}
          style={[styles.cookModeBtn, cookMode && styles.cookModeBtnActive]}
          accessibilityRole="switch"
          accessibilityState={{ checked: cookMode }}
          accessibilityLabel="Cook mode"
        >
          <Text style={[styles.cookModeBtnText, cookMode && styles.cookModeBtnTextActive]}>
            {cookMode ? '🔥 Cook Mode ON' : '🍳 Cook Mode'}
          </Text>
        </TouchableOpacity>

        <View style={styles.multiplierGroup}>
          <Text style={styles.multiplierLabel}>Serves:</Text>
          {[1, 2, 3].map((val) => (
            <TouchableOpacity
              key={val}
              onPress={() => setMultiplier(val)}
              style={[styles.multiplierBtn, multiplier === val && styles.multiplierBtnActive]}
              accessibilityRole="radio"
              accessibilityState={{ checked: multiplier === val }}
              accessibilityLabel={`${val}×`}
            >
              <Text
                style={[
                  styles.multiplierBtnText,
                  multiplier === val && styles.multiplierBtnTextActive,
                ]}
              >
                {val}×
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Metadata, description, ingredients — rendered as Markdown */}
      <Markdown style={markdownStyles}>{before}</Markdown>

      {/* Interactive instruction steps */}
      {steps.length > 0 && (
        <View style={styles.stepsContainer}>
          {steps.map((step, idx) => {
            const isChecked = checkedSteps.has(idx);
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => toggleStep(idx)}
                activeOpacity={0.7}
                style={styles.stepRow}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isChecked }}
                accessibilityLabel={`Step ${idx + 1}`}
              >
                <Text style={[styles.stepCheckbox, isChecked && styles.stepCheckboxChecked]}>
                  {isChecked ? '\u2611' : '\u2610'}
                </Text>
                <Text style={[styles.stepText, isChecked && styles.stepDone]}>
                  {renderStepText(step, isChecked)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Notes and any remaining sections */}
      {after ? <Markdown style={markdownStyles}>{after}</Markdown> : null}

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
  // Instruction step list
  stepsContainer: {
    marginBottom: 4,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  stepCheckbox: {
    fontSize: 22,
    lineHeight: 26,
    marginRight: 10,
    color: '#555',
  },
  stepCheckboxChecked: {
    color: '#1a73e8',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
    color: '#1a1a1a',
  },
  stepDone: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  stepBold: {
    fontWeight: '700',
  },
  // Cook mode + multiplier toolbar
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f7fa',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    gap: 8,
  },
  cookModeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#bbb',
    backgroundColor: '#fff',
  },
  cookModeBtnActive: {
    borderColor: '#e8630a',
    backgroundColor: '#fff3ec',
  },
  cookModeBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  cookModeBtnTextActive: {
    color: '#e8630a',
  },
  multiplierGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  multiplierLabel: {
    fontSize: 13,
    color: '#555',
    marginRight: 4,
  },
  multiplierBtn: {
    width: 36,
    height: 32,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#bbb',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  multiplierBtnActive: {
    borderColor: '#1a73e8',
    backgroundColor: '#e8f0fe',
  },
  multiplierBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  multiplierBtnTextActive: {
    color: '#1a73e8',
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
  // Table styles
  table: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    marginVertical: 8,
  },
  thead: {
    backgroundColor: '#f5f7fa',
  },
  th: {
    flex: 1,
    padding: 8,
    fontWeight: '600',
    fontSize: 14,
    color: '#444',
  },
  tr: {
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
  },
  td: {
    flex: 1,
    padding: 8,
    fontSize: 14,
    color: '#1a1a1a',
  },
};
