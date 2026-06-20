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

// Unicode fraction character → numeric value
const UNICODE_FRACS = {
  '½': 0.5,
  '¼': 0.25,
  '¾': 0.75,
  '⅓': 1 / 3,
  '⅔': 2 / 3,
  '⅛': 0.125,
  '⅜': 0.375,
  '⅝': 0.625,
  '⅞': 0.875,
};

// Ordered from largest to smallest so the closest fraction wins
const FRAC_DISPLAY = [
  [0.875, '⅞'],
  [0.75, '¾'],
  [0.667, '⅔'],
  [0.625, '⅝'],
  [0.5, '½'],
  [0.375, '⅜'],
  [0.333, '⅓'],
  [0.25, '¼'],
  [0.125, '⅛'],
];

/** Format a scaled number back to a human-readable string, reusing unicode fractions where possible. */
function formatScaledNumber(n) {
  if (n <= 0) return '0';
  const intPart = Math.floor(n);
  const fracPart = n - intPart;

  let bestFrac = null;
  let minDiff = 0.04; // tolerance for snapping to a nice fraction
  for (const [val, sym] of FRAC_DISPLAY) {
    const diff = Math.abs(fracPart - val);
    if (diff < minDiff) {
      minDiff = diff;
      bestFrac = sym;
    }
  }

  if (bestFrac !== null) {
    return intPart === 0 ? bestFrac : `${intPart}${bestFrac}`;
  }

  if (Math.abs(fracPart) < 0.01) return intPart.toString();

  // Fall back to a decimal with reasonable precision
  return parseFloat(n.toPrecision(4)).toString();
}

/** Scale a single ingredient cell value (e.g. "500 g", "½ cup", "2 large") by multiplier. */
function scaleAmountStr(cell, multiplier) {
  const trimmed = cell.trim();
  if (!trimmed || /^to\s+/i.test(trimmed)) return trimmed;

  const fracChars = '½¼¾⅓⅔⅛⅜⅝⅞';
  // Match a leading numeric token: integer, decimal, unicode fraction, or mixed like "1½"
  const amountRe = new RegExp(`^(\\d+(?:\\.\\d+)?[${fracChars}]?|[${fracChars}])`);
  const m = trimmed.match(amountRe);
  if (!m) return trimmed;

  const raw = m[1];
  const rest = trimmed.slice(raw.length);

  // Detect trailing unicode fraction character in the token (handles "1½" → 1.5)
  const trailFrac = raw.match(new RegExp(`([${fracChars}])$`));
  let num;
  if (trailFrac) {
    const fracVal = UNICODE_FRACS[trailFrac[1]] ?? 0;
    const intStr = raw.slice(0, raw.length - 1);
    num = (intStr ? parseFloat(intStr) : 0) + fracVal;
  } else if (UNICODE_FRACS[raw] !== undefined) {
    num = UNICODE_FRACS[raw];
  } else {
    num = parseFloat(raw);
  }

  if (isNaN(num)) return trimmed;

  return formatScaledNumber(num * multiplier) + rest;
}

/**
 * Return a copy of `content` where all ingredient amounts in the
 * `## Ingredients` section have been multiplied by `multiplier`.
 * Only the Metric and Imperial table columns are scaled.
 * Non-numeric values like "to taste" are left unchanged.
 *
 * @param {string} content - Full recipe markdown content.
 * @param {number} multiplier - Scale factor (1 = unchanged).
 * @returns {string}
 */
export function scaleMarkdownIngredients(content, multiplier) {
  if (multiplier === 1 || !content) return content;

  const headingRe = /^##\s+Ingredients[^\n]*\n/m;
  const match = headingRe.exec(content);
  if (!match) return content;

  const beforeIngredients = content.slice(0, match.index + match[0].length);
  const afterHeading = content.slice(beforeIngredients.length);

  const nextHeadingRe = /^##\s+/m;
  const nextMatch = nextHeadingRe.exec(afterHeading);

  const ingredientsSection = nextMatch ? afterHeading.slice(0, nextMatch.index) : afterHeading;
  const afterIngredients = nextMatch ? afterHeading.slice(nextMatch.index) : '';

  const scaledLines = ingredientsSection.split('\n').map((line) => {
    if (!line.trim().startsWith('|')) return line;
    const parts = line.split('|');
    // A table row starts and ends with |, so parts[0] and parts[last] are empty strings
    const cells = parts.slice(1, parts.length - 1);
    if (cells.length !== 3) return line;
    // Skip separator rows (e.g. |---|---|---|)
    if (cells.every((c) => /^[-:\s]+$/.test(c.trim()))) return line;
    // Skip header row
    if (cells[0].trim().toLowerCase() === 'ingredient') return line;
    const scaledMetric = scaleAmountStr(cells[1], multiplier);
    const scaledImperial = scaleAmountStr(cells[2], multiplier);
    return `| ${cells[0].trim()} | ${scaledMetric} | ${scaledImperial} |`;
  });

  return beforeIngredients + scaledLines.join('\n') + afterIngredients;
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
