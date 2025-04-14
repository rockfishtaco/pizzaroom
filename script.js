// Pizza data
const pizzas = [
    {
        id: 1,
        name: "Margherita",
        description: "Classic tomato sauce, mozzarella, and basil",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 2,
        name: "Pepperoni",
        description: "Tomato sauce, mozzarella, and spicy pepperoni",
        price: 14.99,
        image: "https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 3,
        name: "Vegetarian",
        description: "Tomato sauce, mozzarella, bell peppers, mushrooms, and olives",
        price: 13.99,
        image: "https://images.unsplash.com/photo-1593246049226-ded77bf90326?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 4,
        name: "Hawaiian",
        description: "Tomato sauce, mozzarella, ham, and pineapple",
        price: 15.99,
        image: "https://images.unsplash.com/photo-1552539618-7e0b6f3faef7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 5,
        name: "BBQ Chicken",
        description: "BBQ sauce, mozzarella, chicken, red onions, and cilantro",
        price: 16.99,
        image: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 6,
        name: "Meat Lovers",
        description: "Tomato sauce, mozzarella, pepperoni, sausage, bacon, and ham",
        price: 17.99,
        image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
];

// Cart functionality
let cart = [];

// DOM elements
const pizzaGrid = document.querySelector('.pizza-grid');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeModal = document.querySelector('.close');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');

// Display pizzas
function displayPizzas() {
    pizzaGrid.innerHTML = '';
    pizzas.forEach(pizza => {
        const pizzaCard = document.createElement('div');
        pizzaCard.className = 'pizza-card';
        pizzaCard.innerHTML = `
            <div class="pizza-img">
                <img src="${pizza.image}" alt="${pizza.name}">
            </div>
            <div class="pizza-info">
                <h3>${pizza.name}</h3>
                <p>${pizza.description}</p>
                <div class="pizza-price">
                    <span class="price">$${pizza.price.toFixed(2)}</span>
                    <button class="add-to-cart" data-id="${pizza.id}">Add to Cart</button>
                </div>
            </div>
        `;
        pizzaGrid.appendChild(pizzaCard);
    });

    // Add event listeners to add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Add to cart
function addToCart(e) {
    const pizzaId = parseInt(e.target.getAttribute('data-id'));
    const pizza = pizzas.find(p => p.id === pizzaId);
    
    // Check if pizza already in cart
    const existingItem = cart.find(item => item.id === pizzaId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...pizza,
            quantity: 1
        });
    }
    
    updateCart();
    
    // Show feedback
    e.target.textContent = 'Added!';
    e.target.style.backgroundColor = 'var(--success)';
    setTimeout(() => {
        e.target.textContent = 'Add to Cart';
        e.target.style.backgroundColor = 'var(--secondary)';
    }, 1000);
}

// Update cart
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart modal if open
    if (cartModal.style.display === 'block') {
        renderCartItems();
    }
}

// Render cart items
function renderCartItems() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty.</p>';
        cartTotal.textContent = '0.00';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div class="cart-item-controls">
                <button class="decrease" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="increase" data-id="${item.id}">+</button>
                <button class="remove" data-id="${item.id}"><i class="fas fa-trash"></i></button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    // Add event listeners to cart item buttons
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });
    
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });
    
    document.querySelectorAll('.remove').forEach(button => {
        button.addEventListener('click', removeItem);
    });
    
    cartTotal.textContent = total.toFixed(2);
}

// Decrease quantity
function decreaseQuantity(e) {
    const pizzaId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === pizzaId);
    
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart = cart.filter(item => item.id !== pizzaId);
    }
    
    updateCart();
}

// Increase quantity
function increaseQuantity(e) {
    const pizzaId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === pizzaId);
    item.quantity += 1;
    updateCart();
}

// Remove item
function removeItem(e) {
    const pizzaId = parseInt(e.target.getAttribute('data-id'));
    cart = cart.filter(item => item.id !== pizzaId);
    updateCart();
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    alert(`Order placed! Total: $${cartTotal.textContent}\nThank you for your order!`);
    cart = [];
    updateCart();
    cartModal.style.display = 'none';
}

// Event listeners
cartBtn.addEventListener('click', () => {
    cartModal.style.display = 'block';
    renderCartItems();
});

closeModal.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

checkoutBtn.addEventListener('click', checkout);

// Initialize
displayPizzas();