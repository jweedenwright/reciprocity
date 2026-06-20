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
 * Extract a short summary (first non-heading, non-table, non-empty line) from markdown.
 *
 * @param {string} markdown
 * @returns {string}
 */
export function markdownSummary(markdown) {
  const lines = markdown.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (
      trimmed &&
      !trimmed.startsWith('#') &&
      !trimmed.startsWith('---') &&
      !trimmed.startsWith('|')
    ) {
      // Strip bold markers for cleaner display
      return trimmed.replace(/\*\*/g, '').slice(0, 120);
    }
  }
  return '';
}

/**
 * Parse recipe metadata from a markdown recipe.
 *
 * Supports table format:  | **Author** | Brunch Club |
 * and legacy inline format: **Author:** Brunch Club
 *
 * @param {string} markdown
 * @returns {{ prepTime?: string, cookTime?: string, servings?: string, author?: string, tags?: string[] }}
 */
export function parseRecipeMetadata(markdown) {
  const meta = {};

  // Match field from table row: | **Field Name** | value |
  const parseTableField = (fieldName) => {
    const pattern = fieldName.replace(/\s+/g, '\\s+');
    const re = new RegExp(`\\|\\s*\\*\\*${pattern}\\*\\*\\s*\\|\\s*([^|\\n]+?)\\s*\\|`);
    const m = markdown.match(re);
    return m ? m[1].trim() : null;
  };

  // Match field from legacy inline format: **Field Name:** value
  const parseLegacyField = (fieldName) => {
    const pattern = fieldName.replace(/\s+/g, '\\s*');
    const re = new RegExp(`\\*\\*${pattern}:\\*\\*\\s*(.+)`);
    const m = markdown.match(re);
    return m ? m[1].trim() : null;
  };

  const getValue = (fieldName) =>
    parseTableField(fieldName) ?? parseLegacyField(fieldName) ?? undefined;

  meta.prepTime = getValue('Prep Time');
  meta.cookTime = getValue('Cook Time');
  meta.servings = getValue('Servings');
  meta.author = getValue('Author');

  const tagsStr = getValue('Tags');
  if (tagsStr) {
    meta.tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }

  // Remove undefined keys to match previous behaviour
  Object.keys(meta).forEach((k) => {
    if (meta[k] === undefined) delete meta[k];
  });

  return meta;
}
