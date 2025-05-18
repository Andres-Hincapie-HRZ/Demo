// Load product data from JSON file
let storeData = { products: [], categories: [] };

fetch('./data/products.json')
  .then(response => response.json())
  .then(data => {
    storeData = data;
    // Initialize Products when data is loaded
    window.productsManager = new ProductsManager(storeData.products, storeData.categories);
  })
  .catch(error => {
    console.error('Error loading product data:', error);
    // Show error message to user
    document.getElementById('products-container').innerHTML = `
      <div class="error-message">
        <p>Lo sentimos, ha ocurrido un error al cargar los productos.</p>
        <button onclick="location.reload()" class="btn-primary">Reintentar</button>
      </div>
    `;
  });
