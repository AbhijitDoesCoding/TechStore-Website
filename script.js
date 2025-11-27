// Products Data
const products = [
  {
    id: 1,
    name: 'MacBook Pro 16"',
    price: 2499.99,
    category: "electronics",
    description: "Powerful laptop for professionals",
    icon: "💻",
    rating: 4.8,
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    price: 999.99,
    category: "electronics",
    description: "Latest flagship smartphone",
    icon: "📱",
    rating: 4.9,
  },
  {
    id: 3,
    name: "Sony WH-1000XM5",
    price: 399.99,
    category: "accessories",
    description: "Premium noise-cancelling headphones",
    icon: "🎧",
    rating: 4.7,
  },
  {
    id: 4,
    name: "iPad Air",
    price: 599.99,
    category: "electronics",
    description: "Versatile tablet for work and play",
    icon: "📱",
    rating: 4.6,
  },
  {
    id: 5,
    name: "Apple Watch Ultra",
    price: 799.99,
    category: "wearables",
    description: "Advanced smartwatch for athletes",
    icon: "⌚",
    rating: 4.8,
  },
  {
    id: 6,
    name: "AirPods Pro",
    price: 249.99,
    category: "accessories",
    description: "True wireless earbuds with ANC",
    icon: "🎵",
    rating: 4.7,
  },
  {
    id: 7,
    name: "Magic Keyboard",
    price: 149.99,
    category: "accessories",
    description: "Wireless keyboard with numeric keypad",
    icon: "⌨️",
    rating: 4.5,
  },
  {
    id: 8,
    name: "Samsung Galaxy S24",
    price: 899.99,
    category: "electronics",
    description: "Premium Android smartphone",
    icon: "📱",
    rating: 4.6,
  },
  {
    id: 9,
    name: "Fitbit Charge 6",
    price: 179.99,
    category: "wearables",
    description: "Advanced fitness tracker",
    icon: "⌚",
    rating: 4.4,
  },
  {
    id: 10,
    name: "Logitech MX Master 3",
    price: 99.99,
    category: "accessories",
    description: "Ergonomic wireless mouse",
    icon: "🖱️",
    rating: 4.9,
  },
];

// State
let cart = [];
let filteredProducts = [...products];
let currentView = "grid";

// DOM Elements
const productList = document.getElementById("product-list");
const cartToggle = document.getElementById("cart-toggle");
const cartSidebar = document.getElementById("cart-sidebar");
const cartClose = document.getElementById("cart-close");
const cartBadge = document.getElementById("cart-badge");
const cartItems = document.getElementById("cart-items");
const emptyCart = document.getElementById("empty-cart");
const cartFooter = document.getElementById("cart-footer");
const checkoutBtn = document.getElementById("checkout-btn");
const clearCartBtn = document.getElementById("clear-cart-btn");
const searchInput = document.getElementById("search-input");
const categoryFilters = document.querySelectorAll('input[name="category"]');
const sortSelect = document.getElementById("sort-select");
const priceRange = document.getElementById("price-range");
const priceValue = document.getElementById("price-value");
const resetFiltersBtn = document.getElementById("reset-filters");
const viewBtns = document.querySelectorAll(".view-btn");
const emptyProducts = document.getElementById("empty-products");
const checkoutModal = document.getElementById("checkout-modal");
const successModal = document.getElementById("success-modal");
const cancelCheckout = document.getElementById("cancel-checkout");
const confirmCheckout = document.getElementById("confirm-checkout");
const closeSuccess = document.getElementById("close-success");

// Initialize
init();

function init() {
  loadCart();
  renderProducts();
  updateCartUI();
  attachEventListeners();
}

// Event Listeners
function attachEventListeners() {
  // Cart Toggle
  cartToggle.addEventListener("click", () => {
    cartSidebar.classList.add("active");
  });

  cartClose.addEventListener("click", () => {
    cartSidebar.classList.remove("active");
  });

  // Search
  searchInput.addEventListener("input", applyFilters);

  // Category Filters
  categoryFilters.forEach((filter) => {
    filter.addEventListener("change", applyFilters);
  });

  // Sort
  sortSelect.addEventListener("change", applyFilters);

  // Price Range
  priceRange.addEventListener("input", (e) => {
    priceValue.textContent = e.target.value;
    applyFilters();
  });

  // Reset Filters
  resetFiltersBtn.addEventListener("click", resetFilters);

  // View Toggle
  viewBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      viewBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentView = btn.dataset.view;
      renderProducts();
    });
  });

  // Checkout
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) return;
    document.getElementById("modal-total").textContent =
      document.getElementById("total-price").textContent;
    checkoutModal.classList.add("active");
  });

  clearCartBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      cart = [];
      saveCart();
      updateCartUI();
    }
  });

  cancelCheckout.addEventListener("click", () => {
    checkoutModal.classList.remove("active");
  });

  confirmCheckout.addEventListener("click", () => {
    const name = document.getElementById("customer-name").value.trim();
    const email = document.getElementById("customer-email").value.trim();
    const address = document.getElementById("customer-address").value.trim();

    if (!name || !email || !address) {
      alert("Please fill in all required fields");
      return;
    }

    checkoutModal.classList.remove("active");
    successModal.classList.add("active");
    cart = [];
    saveCart();
    updateCartUI();
    cartSidebar.classList.remove("active");

    // Clear form
    document.getElementById("customer-name").value = "";
    document.getElementById("customer-email").value = "";
    document.getElementById("customer-address").value = "";
  });

  closeSuccess.addEventListener("click", () => {
    successModal.classList.remove("active");
  });

  // Close modals on background click
  checkoutModal.addEventListener("click", (e) => {
    if (e.target === checkoutModal) {
      checkoutModal.classList.remove("active");
    }
  });

  successModal.addEventListener("click", (e) => {
    if (e.target === successModal) {
      successModal.classList.remove("active");
    }
  });
}

// Filter and Sort Products
function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategory = document.querySelector(
    'input[name="category"]:checked'
  ).value;
  const maxPrice = parseFloat(priceRange.value);
  const sortBy = sortSelect.value;

  filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm);
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesPrice = product.price <= maxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Sort
  if (sortBy === "price-low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === "name") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  renderProducts();
}

function resetFilters() {
  searchInput.value = "";
  document.querySelector('input[name="category"][value="all"]').checked = true;
  sortSelect.value = "default";
  priceRange.value = 1000;
  priceValue.textContent = "1000";
  filteredProducts = [...products];
  renderProducts();
}

// Render Products
function renderProducts() {
  productList.innerHTML = "";

  if (currentView === "list") {
    productList.classList.add("list-view");
  } else {
    productList.classList.remove("list-view");
  }

  if (filteredProducts.length === 0) {
    emptyProducts.style.display = "block";
    productList.style.display = "none";
    return;
  }

  emptyProducts.style.display = "none";
  productList.style.display = "grid";

  filteredProducts.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = `product-card ${
      currentView === "list" ? "list-view" : ""
    }`;

    productCard.innerHTML = `
            <div class="product-image">${product.icon}</div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-footer">
                    <div class="product-price">$${product.price.toFixed(
                      2
                    )}</div>
                    <div class="product-rating">
                        <span class="stars">${generateStars(
                          product.rating
                        )}</span>
                        <span>${product.rating}</span>
                    </div>
                </div>
            </div>
            <button class="add-to-cart-btn" data-id="${product.id}">
                Add to Cart 🛒
            </button>
        `;

    productCard
      .querySelector(".add-to-cart-btn")
      .addEventListener("click", (e) => {
        e.stopPropagation();
        addToCart(product.id);
      });

    productList.appendChild(productCard);
  });
}

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let stars = "★".repeat(fullStars);
  if (hasHalfStar) stars += "☆";
  return stars;
}

// Cart Functions
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  saveCart();
  updateCartUI();

  // Show cart briefly
  cartSidebar.classList.add("active");
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  updateCartUI();
}

function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    saveCart();
    updateCartUI();
  }
}

function updateCartUI() {
  // Update badge
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBadge.textContent = totalItems;

  // Update cart items
  if (cart.length === 0) {
    emptyCart.style.display = "flex";
    cartFooter.style.display = "none";
    cartItems.innerHTML = "";
    return;
  }

  emptyCart.style.display = "none";
  cartFooter.style.display = "block";

  cartItems.innerHTML = "";
  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    cartItem.innerHTML = `
            <div class="cart-item-image">${item.icon}</div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button class="quantity-btn decrease" data-id="${
                          item.id
                        }">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn increase" data-id="${
                          item.id
                        }">+</button>
                    </div>
                    <button class="remove-btn" data-id="${
                      item.id
                    }">Remove</button>
                </div>
            </div>
        `;

    cartItem.querySelector(".decrease").addEventListener("click", () => {
      updateQuantity(item.id, -1);
    });

    cartItem.querySelector(".increase").addEventListener("click", () => {
      updateQuantity(item.id, 1);
    });

    cartItem.querySelector(".remove-btn").addEventListener("click", () => {
      removeFromCart(item.id);
    });

    cartItems.appendChild(cartItem);
  });

  // Update totals
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const shipping = subtotal > 0 ? (subtotal > 500 ? 0 : 10) : 0;
  const total = subtotal + tax + shipping;

  document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("tax").textContent = `$${tax.toFixed(2)}`;
  document.getElementById("shipping").textContent =
    shipping === 0 && subtotal > 0 ? "FREE" : `$${shipping.toFixed(2)}`;
  document.getElementById("total-price").textContent = `$${total.toFixed(2)}`;
}

// Storage Functions
function saveCart() {
  try {
    const cartData = JSON.stringify(cart);
    const tempStorage = window.ecommerceStorage || {};
    tempStorage["cart"] = cartData;
    window.ecommerceStorage = tempStorage;
  } catch (e) {
    console.error("Error saving cart:", e);
  }
}

function loadCart() {
  try {
    if (window.ecommerceStorage && window.ecommerceStorage["cart"]) {
      cart = JSON.parse(window.ecommerceStorage["cart"]);
    }
  } catch (e) {
    console.error("Error loading cart:", e);
    cart = [];
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
