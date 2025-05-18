// Main application functionality
document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.querySelector('.menu');
  
  if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
      menu.classList.toggle('active');
    });
  }
  
  // Handle scroll events
  window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  // Close the menu when clicking outside of it
  document.addEventListener('click', (e) => {
    if (menu && menu.classList.contains('active')) {
      if (!e.target.closest('.menu') && !e.target.closest('#menu-toggle')) {
        menu.classList.remove('active');
      }
    }
  });
  
  // Set up search functionality
  const searchInput = document.getElementById('search-input');
  
  if (searchInput) {
    searchInput.addEventListener('focus', () => {
      searchInput.classList.add('expanded');
    });
    
    searchInput.addEventListener('blur', () => {
      if (!searchInput.value) {
        searchInput.classList.remove('expanded');
      }
    });
  }
  
  // Add CSS styles for scroll effects
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    #header.scrolled {
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      padding: 10px 0;
    }
    
    #header {
      transition: all 0.3s ease;
    }
    
    .search-bar input.expanded {
      width: 250px;
    }
  `;
  document.head.appendChild(styleElement);
  
  // Add animation for cart changes
  const animateElement = (el) => {
    el.classList.add('animated');
    setTimeout(() => {
      el.classList.remove('animated');
    }, 300);
  };
  
  // Add CSS for animations
  const animationStyles = document.createElement('style');
  animationStyles.textContent = `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    .animated {
      animation: pulse 0.3s ease;
    }
    
    .product-card, .category-card, .btn-primary, .filter-button {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .product-card:hover, .category-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
    
    .btn-primary:hover, .filter-button:hover {
      transform: translateY(-2px);
    }
    
    .cart-item {
      transition: background-color 0.3s ease;
    }
    
    .cart-item:hover {
      background-color: var(--light-gray);
    }
  `;
  document.head.appendChild(animationStyles);
});