document.addEventListener("DOMContentLoaded", () => {
  const contentContainer = document.getElementById("main-content");

  // 1. Define the loading function
  async function loadPage(url) {
    try {

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
