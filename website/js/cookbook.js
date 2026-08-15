// Used to pull all recipes from our Google endpoint
const recipes = []
async function getCookbook() { 
    try {
        console.log("Fetching: " + config.api + 'api/cookbook');
        const response = await axios.get(config.api + 'api/cookbook');
        if (response.status !== 200) throw new Error('Network error')
        const rawData = await response.data // Or response.json(), depending on your API structure
        app.config.globalProperties.$recipes = rawData;
        return true;
    } catch (error) {
        console.error('Failed to fetch HTML:', error)
        app.config.globalProperties.$hasError.value = true
        return false;
    } finally {
        app.config.globalProperties.$isLoading.value = false
    }
};

// Used to load all recipes into the UI
async function showCookbook() {
    app.config.globalProperties.$recipes.forEach((item) => {
        var li = "<li class='list-group-item justify-content-between align-items-center recipe' tag='a' href='#/recipe/" + item.id + "' data-id='" + item.id + "' action>";
        li += "<div class='d-flex'><h3 class='fw-bold'>" + DOMPurify.sanitize(item.name).replace('.md','') + "</h3></div><div class='d-flex'><p>";
        item.description.split('|').forEach(tag => {
            li += "<span class='badge badge-warning rounded-pill'>" + DOMPurify.sanitize(tag) + "</span>";
        });
        li += "</p></div></li>";
        document.querySelector('#recipe-list ul').innerHTML += li;
    });
    document.querySelectorAll('.recipe').forEach(item => {
        recipes.push(item);
        item.addEventListener('click', (event) => {
            const id = event.currentTarget.getAttribute('data-id');
            window.location.hash = '#/recipe/' + id;
        });
    });

    // Bind the event listener
    document.getElementById('recipeSearch').addEventListener('keyup', (event) => {
        // Pass in the value from the input box
        filterRecipes(event.target.value);
    });
}

// Used to filter recipes on the cook book page
function filterRecipes(filterValue) {
    const query = filterValue.toLowerCase();
    console.log(filterValue);
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