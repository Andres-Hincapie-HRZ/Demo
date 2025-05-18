// Cart Module
class ShoppingCart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('cart')) || [];
    this.cartSidebar = document.getElementById('cart-sidebar');
    this.cartItemsContainer = document.getElementById('cart-items');
    this.cartTotal = document.getElementById('cart-total');
    this.cartCount = document.getElementById('cart-count');
    this.cartToggle = document.getElementById('cart-toggle');
    this.closeCart = document.getElementById('close-cart');
    this.checkoutBtn = document.getElementById('checkout-btn');
    this.overlay = document.getElementById('overlay');
    this.cartPage = document.getElementById('cart-page');
    
    this.bindEvents();
    this.updateCartCount();
    this.renderCart();
    
    // Initialize cart page if we're on it
    if (this.cartPage) {
      this.renderCartPage();
    }
  }
  
  bindEvents() {
    // Toggle cart visibility
    this.cartToggle.addEventListener('click', () => this.toggleCart());
    this.closeCart.addEventListener('click', () => this.toggleCart());
    this.overlay.addEventListener('click', () => {
      this.toggleCart(false);
      const productModal = document.getElementById('product-modal');
      productModal.classList.remove('open');
      this.overlay.classList.remove('active');
    });
    
    // Checkout button
    this.checkoutBtn.addEventListener('click', () => this.checkout());
    
    // Delegate event for cart item controls
    const handleCartControls = (e) => {
      const cartItem = e.target.closest('.cart-item');
      if (!cartItem) return;
      
      const itemId = parseInt(cartItem.dataset.id);
      
      if (e.target.classList.contains('quantity-btn')) {
        if (e.target.classList.contains('decrease')) {
          this.decreaseQuantity(itemId);
        } else if (e.target.classList.contains('increase')) {
          this.increaseQuantity(itemId);
        }
      } else if (e.target.classList.contains('remove-item')) {
        this.removeItem(itemId);
      }
    };
    
    this.cartItemsContainer.addEventListener('click', handleCartControls);
    if (this.cartPage) {
      this.cartPage.addEventListener('click', handleCartControls);
    }
  }
  
  toggleCart(forcedState = null) {
    const isOpen = forcedState !== null ? forcedState : !this.cartSidebar.classList.contains('open');
    
    if (isOpen) {
      this.cartSidebar.classList.add('open');
      this.overlay.classList.add('active');
    } else {
      this.cartSidebar.classList.remove('open');
      this.overlay.classList.remove('active');
    }
  }
  
  addItem(product) {
    const existingItemIndex = this.items.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
      this.items[existingItemIndex].quantity += 1;
    } else {
      this.items.push({
        ...product,
        quantity: 1
      });
    }
    
    this.updateLocalStorage();
    this.updateCartCount();
    this.renderCart();
    if (this.cartPage) {
      this.renderCartPage();
    }
    
    // Show notification
    this.showNotification(`${product.name} añadido al carrito`);
  }
  
  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.updateLocalStorage();
    this.updateCartCount();
    this.renderCart();
    if (this.cartPage) {
      this.renderCartPage();
    }
  }
  
  increaseQuantity(productId) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      item.quantity += 1;
      this.updateLocalStorage();
      this.updateCartCount();
      this.renderCart();
      if (this.cartPage) {
        this.renderCartPage();
      }
    }
  }
  
  decreaseQuantity(productId) {
    const item = this.items.find(item => item.id === productId);
    if (item && item.quantity > 1) {
      item.quantity -= 1;
      this.updateLocalStorage();
      this.updateCartCount();
      this.renderCart();
      if (this.cartPage) {
        this.renderCartPage();
      }
    } else if (item && item.quantity === 1) {
      this.removeItem(productId);
    }
  }
  
  getTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
  
  updateCartCount() {
    const totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
    this.cartCount.textContent = totalItems;
  }
  
  updateLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }
  
  renderCart() {
    // Clear current cart items
    this.cartItemsContainer.innerHTML = '';
    
    if (this.items.length === 0) {
      this.cartItemsContainer.innerHTML = `
        <div class="empty-cart-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
          <p>Tu carrito está vacío</p>
          <button class="btn-primary" id="continue-shopping">Continuar comprando</button>
        </div>
      `;
      
      document.getElementById('continue-shopping').addEventListener('click', () => {
        this.toggleCart(false);
      });
      
    } else {
      // Add each item to the cart
      this.items.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        cartItemElement.dataset.id = item.id;
        
        cartItemElement.innerHTML = `
          <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            <div class="cart-item-quantity">
              <button class="quantity-btn decrease">-</button>
              <span class="item-quantity">${item.quantity}</span>
              <button class="quantity-btn increase">+</button>
              <button class="remove-item">Eliminar</button>
            </div>
          </div>
        `;
        
        this.cartItemsContainer.appendChild(cartItemElement);
      });
    }
    
    // Update total price
    this.cartTotal.textContent = `$${this.getTotal().toFixed(2)}`;
  }
  
  renderCartPage() {
    const cartPageContent = document.createElement('div');
    cartPageContent.classList.add('cart-page-content');
    
    if (this.items.length === 0) {
      cartPageContent.innerHTML = `
        <div class="empty-cart-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
          <h2>Tu carrito está vacío</h2>
          <p>¡Explora nuestros productos y encuentra algo que te encante!</p>
          <a href="index.html" class="btn-primary">Ir a comprar</a>
        </div>
      `;
    } else {
      cartPageContent.innerHTML = `
        <div class="cart-page-header">
          <h1>Tu Carrito</h1>
          <p>${this.items.reduce((total, item) => total + item.quantity, 0)} productos</p>
        </div>
        <div class="cart-page-layout">
          <div class="cart-items-list">
            ${this.items.map(item => `
              <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                  <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                  <div class="cart-item-name">${item.name}</div>
                  <div class="cart-item-category">${item.category}</div>
                  <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                  <div class="cart-item-controls">
                    <div class="cart-item-quantity">
                      <button class="quantity-btn decrease">-</button>
                      <span class="item-quantity">${item.quantity}</span>
                      <button class="quantity-btn increase">+</button>
                    </div>
                    <button class="remove-item">Eliminar</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="cart-summary">
            <h2>Resumen de compra</h2>
            <div class="summary-details">
              <div class="summary-row">
                <span>Subtotal</span>
                <span>$${this.getTotal().toFixed(2)}</span>
              </div>
              <div class="summary-row">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              <div class="summary-total">
                <span>Total</span>
                <span>$${this.getTotal().toFixed(2)}</span>
              </div>
            </div>
            <button class="btn-checkout" onclick="cart.checkout()">Proceder al pago</button>
            <div class="secure-checkout">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <span>Pago seguro garantizado</span>
            </div>
          </div>
        </div>
      `;
    }
    
    this.cartPage.innerHTML = '';
    this.cartPage.appendChild(cartPageContent);
  }
  
  checkout() {
    if (this.items.length === 0) {
      this.showNotification('El carrito está vacío', 'error');
      return;
    }
    
    alert('¡Gracias por tu compra! En un sistema real, aquí se conectaría con una pasarela de pago.');
    this.items = [];
    this.updateLocalStorage();
    this.updateCartCount();
    this.renderCart();
    if (this.cartPage) {
      this.renderCartPage();
    }
    this.toggleCart(false);
  }
  
  showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.classList.add('notification', `notification-${type}`);
    notification.textContent = message;
    
    // Append to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.cart = new ShoppingCart();
  
  // Add CSS for notifications
  const notificationStyles = document.createElement('style');
  notificationStyles.textContent = `
    .notification {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #333;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.3s ease;
      z-index: 1000;
    }
    
    .notification.show {
      transform: translateY(0);
      opacity: 1;
    }
    
    .notification-success {
      background-color: #333;
    }
    
    .notification-error {
      background-color: #e74c3c;
    }
  `;
  document.head.appendChild(notificationStyles);
});