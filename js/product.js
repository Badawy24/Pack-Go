function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function calculateTotal(cart) {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function addOrUpdateProduct(product) {
  const cart = getCart();

  const existingProduct = cart.find(
    (item) => item.name === product.name && item.color === product.color
  );

  if (existingProduct) {
    existingProduct.quantity += product.quantity;
  } else {
    cart.push(product);
  }

  saveCart(cart);
}

const form = document.getElementById("add-to-cart-form");
const colorSelect = document.getElementById("color");
const quantityInput = document.getElementById("quantity");
const addCartBtn = document.querySelector(".add-cart-btn");
const buyNowBtn = document.querySelector(".buy-now-btn");

const productName = "Canvas Backpack";
const productPrice = 67.5;

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const color = colorSelect.value;
  const quantity = parseInt(quantityInput.value);

  const product = {
    name: productName,
    color,
    quantity,
    price: productPrice,
  };

  addOrUpdateProduct(product);
  alert("Product added to cart!");
});

buyNowBtn.addEventListener("click", function () {
  const color = colorSelect.value;
  const quantity = parseInt(quantityInput.value);

  const product = {
    name: productName,
    color,
    quantity,
    price: productPrice,
  };

  addOrUpdateProduct(product);

  const total = calculateTotal(getCart());
  alert(`Product added to cart!\nTotal Cost: $${total.toFixed(2)}`);

  // يمكن توجيه المستخدم بعد التأكيد:
  // window.location.href = 'checkout.html';
});
