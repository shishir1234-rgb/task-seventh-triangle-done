const apiUrl = "https://interveiw-mock-api.vercel.app/api/getProducts";
const viewProductsBtn = document.getElementById("viewProducts");
const productGrid = document.getElementById("productGrid");
const cartToggle = document.getElementById("cartToggle");
const cartSidebar = document.getElementById("cartSidebar");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

let cart = [];


// data fetch process per work
async function fetchProducts() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch products");
        
        const { data } = await response.json();
        renderProducts(data);
    } catch (error) {
        console.error(error);
        productGrid.innerHTML = "<p>Failed to load products</p>";
    }
}

function renderProducts(products) {
    productGrid.innerHTML = "";
    products.forEach(({ product }) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.innerHTML = `
            <img src="${product.image.src}" alt="${product.title}">
            <div class="product-details">
                <h3>${product.title}</h3>
                <p class="product-price">₹${product.variants[0].price}</p>
                <button class="add-to-cart-btn" data-id="${product.id}">
                    Add to Cart <i class="fas fa-cart-plus"></i>
                </button>
            </div>
        `;

        const addToCartBtn = productCard.querySelector(".add-to-cart-btn");
        addToCartBtn.addEventListener("click", () => addToCart(product));

        productGrid.appendChild(productCard);
    });
}

function addToCart(product) {
    const existingProduct = cart.find(item => item.id === product.id);
    
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
}

function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("cart-item");
        const itemTotal = item.variants[0].price * item.quantity;
        total += itemTotal;

        cartItemElement.innerHTML = `
            <img src="${item.image.src}" alt="${item.title}">
            <div class="cart-item-details">
                <h4>${item.title}</h4>
                <p>₹${item.variants[0].price} x ${item.quantity}</p>
                <p>₹${itemTotal}</p>
            </div>
            <button class="cart-item-remove" data-index="${index}">
                <i class="fas fa-trash"></i>
            </button>
        `;

        cartItems.appendChild(cartItemElement);
    });

    cartCount.textContent = cart.length;
    cartTotal.textContent = total.toFixed(2);


    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.currentTarget.getAttribute('data-index');
            cart.splice(index, 1);
            updateCart();
        });
    });
}

// toggle karne wala functionality 
cartToggle.addEventListener("click", () => {
    cartSidebar.classList.add("open");
});

closeCart.addEventListener("click", () => {
    cartSidebar.classList.remove("open");
});

// product fetch 
viewProductsBtn.addEventListener("click", fetchProducts);