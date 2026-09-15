// Used to pull all recipes from our Google endpoint
let api_recipes = []
let recipes = []
let recipe = {content: null }; // Using an object to hold the recipe data so that it can be reactive if needed
const recipeContainer = document.getElementById('main-content');

////////////////////////////////////////////////////////////
// COOK MODE BUTTON
// Initialize wake lock and elements
let wakeLock = null;
const cookModeBtn = document.getElementById('cook-mode');
console.log(cookModeBtn)

cookModeBtn.addEventListener('click', async () => {
  if (!wakeLock) {
    await enableCookMode();
  } else {
    await disableCookMode();
  }
});

document.addEventListener('visibilitychange', async () => {
  if (wakeLock !== null && document.visibilityState === 'visible') {
    wakeLock = await navigator.wakeLock.request('screen');
  }
});

async function enableCookMode() {
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    recipeContainer.classList.add('cook-mode-active');
    cookModeBtn.classList.add('btn-danger');
  } catch (err) {
    console.error(`${err.name}, ${err.message}`);
  }
}

async function disableCookMode() {
  if (wakeLock) {
    await wakeLock.release();
    wakeLock = null;
  }
  recipeContainer.classList.remove('cook-mode-active');
  cookModeBtn.classList.remove('btn-danger');
}

////////////////////////////////////////////////////////////
// TEXT SIZE BUTTON
const textSizeDecreaseBtn = document.getElementById('text-size-decrease');
const textSizeIncreaseBtn = document.getElementById('text-size-increase');
console.log(textSizeDecreaseBtn, textSizeIncreaseBtn);

textSizeDecreaseBtn.addEventListener('click', async () => {
    decreaseTextSize();
});

textSizeIncreaseBtn.addEventListener('click', async () => {
    increaseTextSize();
});
function decreaseTextSize() {
  document.documentElement.style.fontSize = (parseFloat(getComputedStyle(document.documentElement).fontSize) - .5) + 'px';
}

function increaseTextSize() {
  document.documentElement.style.fontSize = (parseFloat(getComputedStyle(document.documentElement).fontSize) + .5) + 'px';
}

////////////////////////////////////////////////////////////
// COOKBOOK FUNCTIONS ------------------------------
async function getCookbook() { 
    try {
        const response = await axios.get(config.api + 'api/cookbook');
        if (response.status !== 200) throw new Error('Network error')
        const rawData = await response.data // Or response.json(), depending on your API structure
        api_recipes = rawData;
        return true;
    } catch (error) {
        console.error('Failed to fetch HTML:', error)
        return false;
    }
};

// Used to load all recipes into the UI
async function showCookbook() {
    api_recipes = api_recipes.sort((a, b) => a.name.localeCompare(b.name));
    document.querySelector('#recipe-list ul').innerHTML = ''; // Clear existing list
    api_recipes.forEach((item) => {
        var li = "<li class='list-group-item justify-content-between align-items-center recipe'><a href='#/recipe/" + item.id + "' data-route='recipe/" + item.id + "' action>";
        li += "<div class='d-flex'><h3 class='fw-bold'>" + DOMPurify.sanitize(item.name).replace('.md','') + "</h3></div><div class='d-flex'><p>";
        item.description.split('|').forEach(tag => {
            li += "<span class='badge badge-warning rounded-pill'>" + DOMPurify.sanitize(tag) + "</span>";
        });
        li += "</p></div></a></li>";
        document.querySelector('#recipe-list ul').innerHTML += li;
    });
    // Cache the recipe elements for filtering
    recipes = Array.from(document.querySelectorAll('.recipe'));
    // Bind the event listener
    document.getElementById('recipeSearch').addEventListener('keyup', (event) => {
        // Pass in the value from the input box
        filterRecipes(event.target.value);
    });
}

// Used to filter recipes on the cook book page
function filterRecipes(filterValue) {
    const query = filterValue.toLowerCase();
    if (!filterValue) {
        // Show all when no filter is present
        recipes.forEach(item => {
            item.style.display = '';
        });
    } else {
        // Hide all recipes that do not match the filter
        recipes.forEach(item => {
            const name = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('p').textContent.toLowerCase();
            if (name.includes(query) || description.includes(query)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }
}

////////////////////////////////////////////////////////////
// RECIPE FUNCTIONS ------------------------------
async function getRecipe(id) { 
    console.log(id);
    try {
        console.log(config.api + 'api/recipe/' + id);
        const response = await axios.get(config.api + 'api/recipe/' + id);
        if (response.status !== 200) throw new Error('Network error')
        const rawData = await response.data // Or response.json(), depending on your API structure
        recipe = rawData;
        console.log(recipe)
        return true;
    } catch (error) {
        console.error('Failed to fetch HTML:', error)
        return false;
    }
};

// Used to load all recipes into the UI
async function showRecipe() {
    document.querySelector('#recipe-content').innerHTML = DOMPurify.sanitize(recipe.content);
}