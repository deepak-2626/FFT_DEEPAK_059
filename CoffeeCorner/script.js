
const products = [
    {
        id: 1,
        name: "Sunrise Light Roast",
        price: 349,
        roast: "Light",
        level: 2,
        description: "Floral aroma with refreshing citrus notes.",
        brew: "Pour-over",
        image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Classic Medium Roast",
        price: 449,
        roast: "Medium",
        level: 3,
        description: "Balanced coffee with caramel and chocolate notes.",
        brew: "Drip coffee",
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Midnight Dark Roast",
        price: 499,
        roast: "Dark",
        level: 5,
        description: "Bold aroma with deep, bittersweet flavors.",
        brew: "Espresso",
        image: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Vanilla Velvet Roast",
        price: 399,
        roast: "Medium",
        level: 3,
        description: "Smooth coffee with sweet vanilla-inspired notes.",
        brew: "Latte",
        image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=600&q=80"
    }
];

// Shopping cart
let cart = [];

// Get HTML elements
const productList = document.getElementById("product-list");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");

// Display coffee products
function displayProducts() {
    const selectedFilter = document.querySelector(".filter.active");
    const roast = selectedFilter
        ? selectedFilter.dataset.roast
        : "All";

    const filteredProducts = products.filter(function(product) {
        return roast === "All" || product.roast === roast;
    });

    productList.innerHTML = filteredProducts.map(function(product) {
        return `
            <article class="product-card">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='https://placehold.co/400x250/f2e7db/493127?text=CoffeeCorner'">

                <div class="product-info">

                    <span class="roast-label">
                        ${product.roast} Roast
                    </span>

                    <h3>${product.name}</h3>

                    <p>${product.description}</p>

                    <p><strong>Best brew:</strong> ${product.brew}</p>

                    <p><strong>Roast Level: ${product.level}/5</strong></p>

                    <div class="roast-meter"
                         aria-label="Roast level ${product.level} out of 5">

                        ${[1, 2, 3, 4, 5].map(function(number) {
                            return `
                                <span class="${number <= product.level ? "filled" : ""}">
                                </span>
                            `;
                        }).join("")}

                    </div>

                    <div class="price">₹${product.price}</div>

                    <button class="btn" onclick="addToCart(${product.id})">
                        Add to Cart +
                    </button>

                </div>
            </article>
        `;
    }).join("");
}

// Add a product to the cart
function addToCart(id) {
    const item = cart.find(function(product) {
        return product.id === id;
    });

    if (item) {
        item.quantity++;
    } else {
        cart.push({
            id: id,
            quantity: 1
        });
    }

    displayCart();
}

// Increase or decrease quantity
function changeQuantity(id, change) {
    const item = cart.find(function(product) {
        return product.id === id;
    });

    if (!item) {
        return;
    }

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(id);
    } else {
        displayCart();
    }
}

// Remove a product completely
function removeFromCart(id) {
    cart = cart.filter(function(product) {
        return product.id !== id;
    });

    displayCart();
}

// Display cart products and calculate total
function displayCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty. Choose your favourite coffee!
            </p>
        `;
    } else {
        cartItems.innerHTML = cart.map(function(item) {
            const product = products.find(function(p) {
                return p.id === item.id;
            });

            const subtotal = product.price * item.quantity;

            return `
                <div class="cart-row">

                    <div>
                        <h3>${product.name}</h3>
                        <p>
                            ₹${product.price} × ${item.quantity}
                            = ₹${subtotal}
                        </p>
                    </div>

                    <div class="quantity">
                        <button
                            onclick="changeQuantity(${item.id}, -1)"
                            aria-label="Decrease quantity">
                            −
                        </button>

                        <span>${item.quantity}</span>

                        <button
                            onclick="changeQuantity(${item.id}, 1)"
                            aria-label="Increase quantity">
                            +
                        </button>
                    </div>

                    <button class="remove-btn"
                        onclick="removeFromCart(${item.id})">
                        Remove
                    </button>

                </div>
            `;
        }).join("");
    }

    // Calculate total price
    const total = cart.reduce(function(sum, item) {
        const product = products.find(function(p) {
            return p.id === item.id;
        });

        return sum + product.price * item.quantity;
    }, 0);

    // Calculate total number of items
    const count = cart.reduce(function(sum, item) {
        return sum + item.quantity;
    }, 0);

    cartTotal.textContent = "₹" + total;
    cartCount.textContent = count;
}

// Filter products by roast level
document.querySelectorAll(".filter").forEach(function(button) {
    button.addEventListener("click", function() {

        document.querySelectorAll(".filter").forEach(function(filter) {
            filter.classList.remove("active");
        });

        button.classList.add("active");

        displayProducts();
    });
});

// Clear the entire shopping cart
document.getElementById("clear-cart").addEventListener("click", function() {
    cart = [];
    displayCart();
});

// Show products and empty cart on page load
displayProducts();
displayCart();
