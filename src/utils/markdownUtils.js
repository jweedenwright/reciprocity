/**
 * Build the canonical markdown string for a recipe object.
 * This is used when sharing or exporting a recipe as a .md file.
 *
 * @param {import('../storage/recipeStorage').Recipe} recipe
 * @returns {string}
 */
export function recipeToMarkdown(recipe) {
  return recipe.content;
}

/**
 * Extract a short summary (first non-heading, non-empty line) from markdown.
 *
 * @param {string} markdown
 * @returns {string}
 */
export function markdownSummary(markdown) {
  const lines = markdown.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('---')) {
      // Strip bold markers for cleaner display
      return trimmed.replace(/\*\*/g, '').slice(0, 120);
    }
  }
  return '';
}

/**
 * Parse front-matter-style metadata from the first lines of a markdown recipe.
 * Looks for lines like: **Prep Time:** 15 minutes
 *
 * @param {string} markdown
 * @returns {{ prepTime?: string, cookTime?: string, servings?: string, author?: string, tags?: string[] }}
 */
export function parseRecipeMetadata(markdown) {
  const meta = {};
  const prepMatch = markdown.match(/\*\*Prep Time:\*\*\s*(.+)/);
  if (prepMatch) meta.prepTime = prepMatch[1].trim();

  const cookMatch = markdown.match(/\*\*Cook Time:\*\*\s*(.+)/);
  if (cookMatch) meta.cookTime = cookMatch[1].trim();

  const servingsMatch = markdown.match(/\*\*Servings:\*\*\s*(.+)/);
  if (servingsMatch) meta.servings = servingsMatch[1].trim();

  const authorMatch = markdown.match(/\*\*Author:\*\*\s*(.+)/);
  if (authorMatch) meta.author = authorMatch[1].trim();

  const tagsMatch = markdown.match(/\*\*Tags:\*\*\s*(.+)/);
  if (tagsMatch) {
    meta.tags = tagsMatch[1]
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }

  return meta;
}
