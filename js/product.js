// Sample product data
let products = [
  {
    id: 1,
    name: "Urban Explorer",
    price: 79,
    image: "images/backpack1.jpg",
  },
  {
    id: 2,
    name: "Mountain Climber",
    price: 99,
    image: "images/backpack2.jpg",
  },
  {
    id: 3,
    name: "Everyday Carry",
    price: 59,
    image: "images/backpack3.jpg",
  },
];

let cart = [];

function renderProducts() {
  let list = document.getElementById("product-list");
  list.innerHTML = "";
  products.forEach((product) => {
    let card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="card-body">
          <h4 class="card-title">${product.name}</h4>
          <p class="card-text">$${product.price}</p>
          <button onclick="addToCart(${product.id})" class="btn-primary">Add to Cart</button>
        </div>
      `;
    list.appendChild(card);
  });
}

function addToCart(productId) {
  let product = products.find((p) => p.id === productId);
  let found = cart.find((item) => item.id === product.id);
  if (found) {
    found.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  renderCart();
}

function removeFromCart(productId) {
  let index = cart.findIndex((item) => item.id === productId);
  if (index > -1) {
    cart.splice(index, 1);
  }
  renderCart();
}

function renderCart() {
  let items = document.getElementById("cart-items");
  let total = document.getElementById("cart-total");
  items.innerHTML = "";
  let totalPrice = 0;
  cart.forEach((item) => {
    totalPrice += item.price * item.qty;
    let itemEl = document.createElement("div");
    itemEl.innerHTML = `
        <span>${item.name} x${item.qty}</span>
        <span>
          $${item.price * item.qty}
          <button onclick="removeFromCart(${
            item.id
          })" style="margin-left: 5px; background: transparent; color: red; border: none; cursor: pointer">&times;</button>
        </span>
      `;
    items.appendChild(itemEl);
  });
  total.textContent = `Total: $${totalPrice}`;
}

// Initialize
renderProducts();
