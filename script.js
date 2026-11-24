const products = [
    {
        id: 1,
        name: "Classic White Shirt",
        price: 799,
        category: "Shirts",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500"
    },
    {
        id: 2,
        name: "Casual Denim Jacket",
        price: 1299,
        category: "Jackets",
        image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=500"
    },
    {
        id: 3,
        name: "Floral Summer Dress",
        price: 999,
        category: "Dresses",
        image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500"
    },
    {
        id: 4,
        name: "Elegant Black Dress",
        price: 1499,
        category: "Dresses",
        image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500"
    },
    {
        id: 5,
        name: "Casual Cotton T-Shirt",
        price: 499,
        category: "T-Shirts",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"
    },
    {
        id: 6,
        name: "Traditional Saree",
        price: 899,
        category: "Ethnic Wear",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500"
    },
    {
        id: 7,
        name: "Denim Jeans",
        price: 1099,
        category: "Jeans",
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500"
    },
    {
        id: 8,
        name: "Casual Women's Top",
        price: 699,
        category: "Tops",
        image: "https://images.unsplash.com/photo-1566206091558-7f218b696731?w=500"
    }
];

let cart = {};

function formatPrice(amount) {
    return Number(amount).toLocaleString("en-IN", {
        style: "currency",
        currency: "INR"
    });
}

function displayProducts() {
    const productList = document.getElementById("product-list");

    productList.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <p>${product.category}</p>
                <h3>${product.name}</h3>
                <h4>${formatPrice(product.price)}</h4>
                <button onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join("");
}

function addToCart(id) {
    const product = products.find(item => item.id === id);

    if (!product) return;

    if (cart[id]) {
        cart[id].quantity++;
    } else {
        cart[id] = {
            ...product,
            quantity: 1
        };
    }

    updateCart();
}

function displayCart() {
    const cartItems = document.getElementById("cart-items");
    const items = Object.values(cart);

    if (items.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    cartItems.innerHTML = items.map(item => `
        <div class="cart-item">
            <div>
                <h3>${item.name}</h3>
                <p>${formatPrice(item.price)} × ${item.quantity}</p>
                <strong>${formatPrice(item.price * item.quantity)}</strong>
            </div>

            <div>
                <button onclick="changeQuantity(${item.id}, -1)">−</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
                <button onclick="removeItem(${item.id})">Remove</button>
            </div>
        </div>
    `).join("");
}

function changeQuantity(id, change) {
    if (!cart[id]) return;

    cart[id].quantity += change;

    if (cart[id].quantity <= 0) {
        delete cart[id];
    }

    updateCart();
}

function removeItem(id) {
    delete cart[id];
    updateCart();
}

function updateCartCount() {
    const count = Object.values(cart).reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
    );

    document.getElementById("cart-count").textContent = count;
}

function updateTotal() {
    const items = Object.values(cart);

    const subtotal = items.reduce(
        (total, item) => total + (Number(item.price) * Number(item.quantity)),
        0
    );

    const delivery = subtotal === 0 || subtotal >= 2000 ? 0 : 50;
    const grandTotal = subtotal + delivery;

    document.getElementById("subtotal").textContent =
        formatPrice(subtotal);

    document.getElementById("delivery").textContent =
        formatPrice(delivery);

    document.getElementById("grand-total").textContent =
        formatPrice(grandTotal);

    return { subtotal, delivery, grandTotal };
}

function updateCart() {
    saveCart();
    displayCart();
    updateCartCount();
    updateTotal();
}

function saveCart() {
    localStorage.setItem("localStyleCart", JSON.stringify(cart));
}

function loadCart() {
    try {
        const savedCart = JSON.parse(
            localStorage.getItem("localStyleCart")
        );

        cart = {};

        if (savedCart && typeof savedCart === "object") {
            products.forEach(product => {
                const savedItem = savedCart[product.id];

                if (savedItem) {
                    const quantity = Number(savedItem.quantity);

                    if (Number.isFinite(quantity) && quantity > 0) {
                        cart[product.id] = {
                            ...product,
                            quantity: Math.floor(quantity)
                        };
                    }
                }
            });
        }
    } catch (error) {
        cart = {};
    }

    saveCart();
}

function checkout() {
    if (Object.keys(cart).length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const summary = document.getElementById("order-summary");
    const totals = updateTotal();

    summary.innerHTML = `
        <h3>Order Summary</h3>

        ${Object.values(cart).map(item => `
            <p>
                ${item.name} × ${item.quantity}
                - ${formatPrice(item.price * item.quantity)}
            </p>
        `).join("")}

        <hr>
        <p>Subtotal: ${formatPrice(totals.subtotal)}</p>
        <p>Delivery: ${formatPrice(totals.delivery)}</p>
        <h3>Total: ${formatPrice(totals.grandTotal)}</h3>
        <p>Demo checkout only. No payment is collected.</p>
    `;

    document.getElementById("checkout-modal").showModal();
}

function initializeWebsite() {
    loadCart();
    displayProducts();
    displayCart();
    updateCartCount();
    updateTotal();

    document.getElementById("checkout-btn").addEventListener(
        "click",
        checkout
    );

    document.getElementById("close-modal").addEventListener(
        "click",
        function () {
            document.getElementById("checkout-modal").close();
        }
    );
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeWebsite);
} else {
    initializeWebsite();
}