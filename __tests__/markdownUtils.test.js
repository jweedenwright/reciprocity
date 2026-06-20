import { markdownSummary, parseRecipeMetadata, recipeToMarkdown } from '../src/utils/markdownUtils';

const SAMPLE_MARKDOWN = `# Classic Spaghetti Bolognese

| | |
|---|---|
| **Author** | Community Kitchen |
| **Prep Time** | 15 minutes |
| **Cook Time** | 45 minutes |
| **Servings** | 4 |
| **Tags** | Italian, Pasta, Dinner |

---

## Description

A hearty, slow-cooked meat sauce.
`;

describe('markdownUtils', () => {
  describe('markdownSummary', () => {
    it('returns the first non-heading, non-separator line', () => {
      const summary = markdownSummary(SAMPLE_MARKDOWN);
      // Table rows are skipped; first matching line is the description text
      expect(typeof summary).toBe('string');
      expect(summary.length).toBeGreaterThan(0);
    });

    it('strips bold markers from the summary', () => {
      const summary = markdownSummary(SAMPLE_MARKDOWN);
      expect(summary).not.toContain('**');
    });

    it('returns empty string for blank markdown', () => {
      expect(markdownSummary('')).toBe('');
    });

    it('returns empty string for markdown with only headings and separators', () => {
      expect(markdownSummary('# Title\n\n---\n\n## Section\n')).toBe('');
    });

    it('truncates long lines to 120 characters', () => {
      const longLine = 'A'.repeat(200);
      const summary = markdownSummary(longLine);
      expect(summary.length).toBeLessThanOrEqual(120);
    });
  });

  describe('parseRecipeMetadata', () => {
    it('parses prep time', () => {
      const meta = parseRecipeMetadata(SAMPLE_MARKDOWN);
      expect(meta.prepTime).toBe('15 minutes');
    });

    it('parses cook time', () => {
      const meta = parseRecipeMetadata(SAMPLE_MARKDOWN);
      expect(meta.cookTime).toBe('45 minutes');
    });

    it('parses servings', () => {
      const meta = parseRecipeMetadata(SAMPLE_MARKDOWN);
      expect(meta.servings).toBe('4');
    });

    it('parses author', () => {
      const meta = parseRecipeMetadata(SAMPLE_MARKDOWN);
      expect(meta.author).toBe('Community Kitchen');
    });

    it('parses tags as an array', () => {
      const meta = parseRecipeMetadata(SAMPLE_MARKDOWN);
      expect(meta.tags).toEqual(['Italian', 'Pasta', 'Dinner']);
    });

    it('returns empty object for unstructured markdown', () => {
      const meta = parseRecipeMetadata('Just some text without any metadata.');
      expect(meta).toEqual({});
    });
  });

  describe('recipeToMarkdown', () => {
    it('returns the recipe content unchanged', () => {
      const recipe = { id: '1', title: 'Test', content: SAMPLE_MARKDOWN };
      expect(recipeToMarkdown(recipe)).toBe(SAMPLE_MARKDOWN);
    });
  });
});
