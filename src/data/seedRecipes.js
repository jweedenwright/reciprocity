// Seed recipe content stored as JS string constants so they are bundled
// without requiring extra Metro configuration for .md files.

export const bolognese = `# Classic Spaghetti Bolognese

**Author:** Community Kitchen  
**Prep Time:** 15 minutes  
**Cook Time:** 45 minutes  
**Servings:** 4  
**Tags:** Italian, Pasta, Dinner

---

## Description

A hearty, slow-cooked meat sauce tossed with al dente spaghetti. This classic Italian dish is a crowd-pleaser that fills the kitchen with incredible aromas.

---

## Ingredients

### Sauce
- 500g ground beef (or a mix of beef and pork)
- 1 large onion, finely diced
- 3 cloves garlic, minced
- 2 medium carrots, finely diced
- 2 stalks celery, finely diced
- 400g canned crushed tomatoes
- 2 tbsp tomato paste
- 120ml red wine (optional)
- 1 tsp dried oregano
- 1 tsp dried basil
- Salt and pepper to taste
- 2 tbsp olive oil

### Pasta
- 400g spaghetti
- Salt (for pasta water)

### To Serve
- Freshly grated Parmesan cheese
- Fresh basil leaves

---

## Instructions

1. **Brown the meat.** Heat olive oil in a large pan over medium-high heat. Add the ground beef and cook, breaking it up, until browned. Season with salt and pepper. Remove and set aside.

2. **Sauté the aromatics.** In the same pan, reduce heat to medium. Add onion, carrot, and celery; cook for 5–7 minutes until softened. Add garlic and cook for 1 more minute.

3. **Deglaze.** Pour in red wine (if using) and let it reduce by half, scraping up any browned bits.

4. **Simmer the sauce.** Add crushed tomatoes, tomato paste, oregano, basil, and the browned meat. Stir to combine. Reduce heat to low and simmer for 30 minutes, stirring occasionally.

5. **Cook the pasta.** Bring a large pot of salted water to a boil. Cook spaghetti according to package instructions until al dente. Reserve ½ cup pasta water before draining.

6. **Combine.** Toss the drained spaghetti into the sauce, adding a splash of pasta water if needed to loosen.

7. **Serve.** Plate the pasta and top with freshly grated Parmesan and fresh basil.

---

## Notes

- The sauce can be made ahead and refrigerated for up to 3 days, or frozen for up to 3 months.
- For a richer sauce, add a splash of whole milk or heavy cream in the last 10 minutes of simmering.
`;

export const avocadoToast = `# Avocado Toast with Poached Egg

**Author:** Brunch Club  
**Prep Time:** 5 minutes  
**Cook Time:** 5 minutes  
**Servings:** 2  
**Tags:** Breakfast, Brunch, Vegetarian, Quick

---

## Description

Creamy smashed avocado on crispy sourdough toast, topped with a perfectly poached egg and a sprinkle of chilli flakes. The ultimate brunch staple.

---

## Ingredients

- 2 thick slices sourdough bread
- 1 large ripe avocado
- 2 large eggs
- 1 tbsp white vinegar (for poaching)
- ½ lemon, juiced
- ¼ tsp red chilli flakes
- Salt and pepper to taste
- Extra virgin olive oil, to drizzle
- Microgreens or fresh herbs, to garnish (optional)

---

## Instructions

1. **Toast the bread.** Toast the sourdough slices until golden and crisp.

2. **Prepare the avocado.** Halve the avocado, remove the pit, and scoop the flesh into a bowl. Add lemon juice, salt, and pepper. Smash with a fork to your desired consistency — chunky or smooth.

3. **Poach the eggs.**
   - Fill a medium saucepan with about 8cm of water. Add white vinegar and bring to a gentle simmer.
   - Crack each egg into a small cup.
   - Stir the water to create a gentle whirlpool, then slide in one egg. Cook for 3 minutes for a runny yolk.
   - Remove with a slotted spoon and drain on paper towel. Repeat for the second egg.

4. **Assemble.** Spread the smashed avocado generously over each slice of toast.

5. **Top and serve.** Place a poached egg on top of each toast. Drizzle with olive oil, sprinkle with chilli flakes, and garnish with microgreens if using. Serve immediately.

---

## Notes

- For extra flavour, rub the toast with a cut garlic clove before adding avocado.
- Add sliced cherry tomatoes or a crumble of feta for variety.
- Use the freshest eggs possible — they hold together better when poached.
`;

export const chocolateChipCookies = `# Classic Chocolate Chip Cookies

**Author:** Sweet Tooth Society  
**Prep Time:** 15 minutes  
**Cook Time:** 12 minutes  
**Servings:** 24 cookies  
**Tags:** Dessert, Baking, Cookies, Sweet

---

## Description

Crispy on the edges, chewy in the centre, and loaded with chocolate chips. This no-fail recipe produces perfect cookies every time.

---

## Ingredients

- 225g (2 sticks) unsalted butter, softened to room temperature
- 200g (1 cup) granulated sugar
- 200g (1 cup, packed) light brown sugar
- 2 large eggs
- 2 tsp vanilla extract
- 375g (3 cups) all-purpose flour
- 1 tsp baking soda
- 1 tsp salt
- 340g (2 cups) semi-sweet chocolate chips

---

## Instructions

1. **Preheat oven** to 190°C (375°F). Line two baking sheets with parchment paper.

2. **Cream butter and sugars.** In a large bowl, beat the softened butter with both sugars using a hand mixer or stand mixer on medium speed until light and fluffy, about 3–4 minutes.

3. **Add eggs and vanilla.** Add the eggs one at a time, beating well after each addition. Mix in the vanilla extract.

4. **Combine dry ingredients.** In a separate bowl, whisk together the flour, baking soda, and salt.

5. **Mix together.** Gradually add the dry ingredients to the wet ingredients, mixing on low speed just until combined. Do not overmix.

6. **Fold in chocolate chips.** Using a spatula or wooden spoon, fold in the chocolate chips.

7. **Scoop.** Drop rounded tablespoons of dough onto the prepared baking sheets, spacing them about 5cm apart.

8. **Bake** for 10–12 minutes, or until the edges are golden but the centres still look slightly underdone.

9. **Cool.** Let the cookies cool on the baking sheet for 5 minutes before transferring to a wire rack.

---

## Notes

- For thicker, chewier cookies, refrigerate the dough for at least 1 hour (or overnight) before baking.
- Brown the butter first for a deeper, nuttier flavour.
- Cookies will continue to firm up as they cool — don't overbake!
- Store in an airtight container at room temperature for up to 5 days.
`;

/** @type {import('../storage/recipeStorage').Recipe[]} */
const SEED_RECIPES = [
  {
    id: 'seed-1',
    title: 'Classic Spaghetti Bolognese',
    author: 'Community Kitchen',
    tags: ['Italian', 'Pasta', 'Dinner'],
    prepTime: '15 minutes',
    cookTime: '45 minutes',
    servings: '4',
    createdAt: '2024-01-01T00:00:00.000Z',
    content: bolognese,
  },
  {
    id: 'seed-2',
    title: 'Avocado Toast with Poached Egg',
    author: 'Brunch Club',
    tags: ['Breakfast', 'Brunch', 'Vegetarian', 'Quick'],
    prepTime: '5 minutes',
    cookTime: '5 minutes',
    servings: '2',
    createdAt: '2024-01-02T00:00:00.000Z',
    content: avocadoToast,
  },
  {
    id: 'seed-3',
    title: 'Classic Chocolate Chip Cookies',
    author: 'Sweet Tooth Society',
    tags: ['Dessert', 'Baking', 'Cookies', 'Sweet'],
    prepTime: '15 minutes',
    cookTime: '12 minutes',
    servings: '24 cookies',
    createdAt: '2024-01-03T00:00:00.000Z',
    content: chocolateChipCookies,
  },
];

export default SEED_RECIPES;
