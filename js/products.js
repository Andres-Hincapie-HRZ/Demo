// Products Module
class ProductsManager {
  constructor(products, categories) {
    this.products = products;
    this.categories = categories;
    this.selectedCategory = null;
    
    // DOM elements
    this.productsContainer = document.getElementById('products-container');
    this.categoriesContainer = document.getElementById('categories-container');
    this.categoryFilters = document.getElementById('category-filters');
    this.currentCategoryDisplay = document.getElementById('current-category');
    this.productModal = document.getElementById('product-modal');
    this.modalBody = document.getElementById('modal-body');
    this.closeModal = document.getElementById('close-modal');
    this.overlay = document.getElementById('overlay');
    this.searchInput = document.getElementById('search-input');
    this.searchButton = document.getElementById('search-button');
    
    this.init();
  }
  
  init() {
    this.renderCategories();
    this.renderCategoryFilters();
    this.renderProducts();
    this.bindEvents();
  }
  
  bindEvents() {
    // Category filters
    this.categoryFilters.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-button')) {
        const category = e.target.dataset.category || null;
        this.filterByCategory(category);
      }
    });
    
    // Category cards
    this.categoriesContainer.addEventListener('click', (e) => {
      const categoryCard = e.target.closest('.category-card');
      if (categoryCard) {
        const category = categoryCard.dataset.category;
        this.filterByCategory(category);
        
        // Scroll to products section
        document.getElementById('featured').scrollIntoView({ behavior: 'smooth' });
      }
    });
    
    // Product clicks
    this.productsContainer.addEventListener('click', (e) => {
      const productCard = e.target.closest('.product-card');
      if (productCard) {
        const productId = parseInt(productCard.dataset.id);
        const product = this.products.find(p => p.id === productId);
        
        // Handle button clicks
        if (e.target.classList.contains('btn-add-cart')) {
          e.preventDefault();
          window.cart.addItem(product);
        } else if (e.target.classList.contains('btn-whatsapp')) {
          e.preventDefault();
          this.openWhatsAppChat(product);
        } else {
          // Open modal for product details
          this.openProductModal(product);
        }
      }
    });
    
    // Close modal
    this.closeModal.addEventListener('click', () => {
      this.productModal.classList.remove('open');
      this.overlay.classList.remove('active');
    });
    
    // Modal body delegated events
    this.modalBody.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-add-cart')) {
        e.preventDefault();
        const productId = parseInt(this.modalBody.dataset.productId);
        const product = this.products.find(p => p.id === productId);
        window.cart.addItem(product);
      } else if (e.target.classList.contains('btn-whatsapp')) {
        e.preventDefault();
        const productId = parseInt(this.modalBody.dataset.productId);
        const product = this.products.find(p => p.id === productId);
        this.openWhatsAppChat(product);
      }
    });
    
    // Search functionality
    this.searchButton.addEventListener('click', () => {
      this.searchProducts(this.searchInput.value);
    });
    
    this.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.searchProducts(this.searchInput.value);
      }
    });
  }
  
  renderCategories() {
    this.categoriesContainer.innerHTML = '';
    
    // Create category cards
    this.categories.forEach(category => {
      const categoryCard = document.createElement('div');
      categoryCard.classList.add('category-card');
      categoryCard.dataset.category = category;
      
      // Get icon based on category name
      const icon = this.getCategoryIcon(category);
      
      categoryCard.innerHTML = `
        <div class="category-icon">${icon}</div>
        <div class="category-name">${category}</div>
      `;
      
      this.categoriesContainer.appendChild(categoryCard);
    });
  }
  
  renderCategoryFilters() {
    this.categoryFilters.innerHTML = '';
    
    // Add "All" filter
    const allFilter = document.createElement('button');
    allFilter.classList.add('filter-button', 'active');
    allFilter.textContent = 'Todos';
    allFilter.dataset.category = '';
    this.categoryFilters.appendChild(allFilter);
    
    // Add category filters
    this.categories.forEach(category => {
      const filterButton = document.createElement('button');
      filterButton.classList.add('filter-button');
      filterButton.textContent = category;
      filterButton.dataset.category = category;
      this.categoryFilters.appendChild(filterButton);
    });
  }
  
  renderProducts(productsToRender = null) {
    this.productsContainer.innerHTML = '';
    
    // Use filtered products or all products
    const displayProducts = productsToRender || this.getFilteredProducts();
    
    if (displayProducts.length === 0) {
      this.productsContainer.innerHTML = `
        <div class="no-products-message">
          <p>No se encontraron productos que coincidan con tu búsqueda.</p>
        </div>
      `;
      return;
    }
    
    // Create product cards
    displayProducts.forEach(product => {
      const productCard = document.createElement('div');
      productCard.classList.add('product-card');
      productCard.dataset.id = product.id;
      
      productCard.innerHTML = `
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <span class="product-category">${product.category}</span>
          <div class="product-price">$${product.price.toFixed(2)}</div>
          <p class="product-description">${product.description}</p>
          <div class="product-actions">
            <button class="btn-add-cart">Añadir</button>
            <button class="btn-whatsapp">WhatsApp</button>
          </div>
        </div>
      `;
      
      this.productsContainer.appendChild(productCard);
    });
  }
  
  getFilteredProducts() {
    if (this.selectedCategory) {
      return this.products.filter(product => product.category === this.selectedCategory);
    }
    return this.products;
  }
  
  filterByCategory(category) {
    this.selectedCategory = category || null;
    this.currentCategoryDisplay.textContent = category || 'Todos';
    
    // Update active filter button
    const filterButtons = this.categoryFilters.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
      if ((button.dataset.category === category) || (!category && button.dataset.category === '')) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
    
    this.renderProducts();
  }
  
  searchProducts(query) {
    if (!query.trim()) {
      this.renderProducts();
      return;
    }
    
    const searchTerm = query.toLowerCase().trim();
    const filteredProducts = this.products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) || 
      product.description.toLowerCase().includes(searchTerm) || 
      product.category.toLowerCase().includes(searchTerm)
    );
    
    this.renderProducts(filteredProducts);
  }
  
  openProductModal(product) {
    // Update modal content
    this.modalBody.innerHTML = `
      <div class="product-detail">
        <div class="product-detail-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-detail-info">
          <h2 class="product-detail-name">${product.name}</h2>
          <span class="product-detail-category">${product.category}</span>
          <div class="product-detail-price">$${product.price.toFixed(2)}</div>
          <p class="product-detail-description">${product.description}</p>
          <div class="product-detail-actions">
            <button class="btn-add-cart">Añadir al carrito</button>
            <button class="btn-whatsapp">Comprar por WhatsApp</button>
          </div>
        </div>
      </div>
    `;
    
    this.modalBody.dataset.productId = product.id;
    
    // Show modal
    this.productModal.classList.add('open');
    this.overlay.classList.add('active');
  }
  
  openWhatsAppChat(product) {
    const message = encodeURIComponent(`Hola, estoy interesado en comprar: ${product.name} por $${product.price.toFixed(2)}`);
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
  }
  
  getCategoryIcon(category) {
    const icons = {
      'Tecnología': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><path d="M12 18h.01"></path></svg>',
      'Ropa': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path></svg>',
      'Hogar': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
      'Belleza': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" x2="2" y1="8" y2="22"></line><line x1="17.5" x2="9" y1="15" y2="15"></line></svg>',
      'Accesorios': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="10" r="3"></circle><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path></svg>'
    };
    
    return icons[category] || '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>';
  }
}

// Initialize Products when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.productsManager = new ProductsManager(storeData.products, storeData.categories);
});