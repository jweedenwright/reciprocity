document.addEventListener("DOMContentLoaded", () => {
  const contentContainer = document.getElementById("main-content");

  // 1. Define the loading function
  async function loadPage(url) {
    try {

      // PRE-PAGE LOAD - Dynamic JavaScript for content loaded on specific pages
      if (url.indexOf('cookbook') != -1) {
        const cookbook_loaded = await app.config.globalProperties.$getCookbook();
      }

      // Fetch the standalone partial HTML file
      const response = await fetch(url);
      
      if (!response.ok) throw new Error("Page not found");
      
      const htmlText = await response.text();
      
      // Inject the HTML into the main container
      contentContainer.innerHTML = htmlText;

      // CRUCIAL FOR MDB: Reinitialize components inside the new HTML snippet
      if (window.mdb) {
        // Automatically scans and binds ripples, toggles, dropdowns, etc.
        document.querySelectorAll('[data-mdb-ripple-init]').forEach(el => new mdb.Ripple(el));
        document.querySelectorAll('[data-mdb-collapse-init]').forEach(el => new mdb.Collapse(el));
      }

      // POST-PAGE LOAD - Dynamic JavaScript for after a page is loaded
      if (url.indexOf('cookbook') != -1) {
        app.config.globalProperties.$recipes.value.forEach((item) => {
          console.log(item) // Accesses {…}
          var li = "<li class='list-group-item d-flex justify-content-between align-items-center' tag='a' href='#/recipe/" + item.id + "' data-id='" + item.id + "' action>";
          li += "<h3 class='fw-bold'>" + DOMPurify.sanitize(item.name) + "</h3>";
          item.description.split('|').forEach(tag => {
              li += "<span class='badge badge-warning rounded-pill'>" + DOMPurify.sanitize(tag) + "</span>";
          });
          li += "</li>";
          document.querySelector('#recipe-list ul').innerHTML += li;
        })
      }
    } catch (error) {
      contentContainer.innerHTML = `<div class="alert alert-danger">Error loading content: ${error.message}</div>`;
    }
  }

  // 2. Intercept global clicks on links with [data-route]
  document.body.addEventListener("click", (event) => {
    const targetLink = event.target.closest("[data-route]");
    if (targetLink) {
      event.preventDefault(); // Stop normal browser link behavior
      const targetPage = targetLink.getAttribute("data-route");
      loadPage(targetPage);   // Trigger the fetch loader
    }
  });
});
