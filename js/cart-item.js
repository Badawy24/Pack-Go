function displayCartItems() {
  const container = document.querySelector(".cart-item-container");
  if (!container) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  container.innerHTML = ""; // تنظيف المحتوى

  if (cart.length === 0) {
    container.innerHTML = "<p>السلة فارغة</p>";
    return;
  }

  // إنشاء عناصر السلة
  cart.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("cart-item");
    itemDiv.style.display = "flex";
    itemDiv.style.alignItems = "center";
    itemDiv.style.justifyContent = "space-between";
    itemDiv.style.marginBottom = "10px";

    itemDiv.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px;">
        <img src="${item.image}" alt="${item.title}" style="width:80px; height:80px; object-fit:cover;" />
        <div>
          <h4>${item.title}</h4>
          <p>Color: ${item.color}</p>
          <p>Quantity: ${item.quantity}</p>
          <p>Item-Price: $${item.price}</p>
        </div>
      </div>
      <button class="delete-btn" data-index="${index}" title="حذف العنصر" style="background:none; border:none; cursor:pointer; font-size:20px; color:#c00;">🗑️</button>
    `;

    container.appendChild(itemDiv);
  });

  // عرض الإجمالي الكلي تحت العناصر
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalDiv = document.createElement("div");
  totalDiv.style.marginTop = "20px";
  totalDiv.style.fontWeight = "bold";
  totalDiv.style.fontSize = "18px";
  totalDiv.textContent = `Total Price: $${totalPrice.toFixed(2)}`;

  container.appendChild(totalDiv);

  // إضافة حدث حذف
  container.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("click", (e) => {
      const index = e.currentTarget.dataset.index;
      removeItemFromCart(index);
    });
  });
}

function removeItemFromCart(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1); // حذف المنتج من المصفوفة
  localStorage.setItem("cart", JSON.stringify(cart)); // تحديث localStorage
  displayCartItems(); // إعادة عرض السلة بعد الحذف
}

window.addEventListener("DOMContentLoaded", displayCartItems);
