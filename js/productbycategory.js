import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase-config.js";
// Get category from URL
const params = new URLSearchParams(window.location.search);
const category = params.get("category");

// تحديث عنوان التصنيف
const categoryTitle = document.getElementById("category-title");
if (categoryTitle && category) {
  categoryTitle.innerText = `منتجات: ${category}`;
}

export async function displayProductByCategory(db) {
  if (!category) return;

  try {
    const productsRef = collection(db, 'productsData');
    const q = query(productsRef, where("category", "==", category));
    const querySnapshot = await getDocs(q);

    const container = document.getElementById("products-container");
    if (!container) return;

    container.innerHTML = ""; // تفريغ المحتوى السابق

    if (querySnapshot.empty) {
      container.innerText = "لا توجد منتجات في هذه الفئة.";
      return;
    }

    querySnapshot.forEach(docSnap => {
      const product = docSnap.data();
      const productId = docSnap.id;

      const catTitle = document.getElementById('cat-title');
      if (catTitle) catTitle.innerText = product.category;

      // إنشاء كارت المنتج
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");

      const img = document.createElement("img");
      img.src = product.image;
      img.alt = product.title;

      const title = document.createElement("h3");
      title.innerText = product.title;

      const price = document.createElement("p");
      price.innerText = product.price + "$";

      const button = document.createElement("button");
      button.classList.add("button-z");
      button.innerText = "Add To Cart";

      // ✅ زر إضافة المنتج إلى السلة
      button.addEventListener("click", (e) => {
        e.stopPropagation();

        const cartItem = {
          id: productId,
          title: product.title,
          price: product.price,
          color: "Default",
          quantity: 1,
          image: product.image,
        };

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existingIndex = cart.findIndex(
          (item) => item.id === cartItem.id && item.color === cartItem.color
        );

        if (existingIndex > -1) {
          cart[existingIndex].quantity += 1;
        } else {
          cart.push(cartItem);
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert("تم إضافة المنتج إلى السلة!");
        const cartcontainer = document.querySelector(".cart-item-container");
        cartcontainer.classList.add('active');
        renderCartItems();
      });

      // ✅ كليك على الكارت يفتح صفحة التفاصيل
      productCard.addEventListener("click", () => {
        window.location.href = `productDetails.html?id=${productId}`;
      });

      // ترتيب عناصر الكارت
      productCard.appendChild(img);
      productCard.appendChild(title);
      productCard.appendChild(price);
      productCard.appendChild(button);

      container.appendChild(productCard);

    });

  } catch (error) {
    console.error("خطأ أثناء جلب المنتجات:", error);
  }

}
function renderCartItems() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.querySelector(".cart-item-container");
  container.innerHTML = "";

  // عرض العناصر
  cart.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.title}" class="cart-item-img" />
      <div class="cart-item-info">
        <p class="cart-item-title">${item.title}</p>
        <p class="cart-item-color">Color: ${item.color}</p>
        <p class="cart-item-quantity">Quantity: ${item.quantity}</p>
        <p class="cart-item-price">${item.price} EGP</p>
      </div>
      <button style="margin-left:30px;" class="cart-item-delete" data-index="${index}">🗑️</button>
    `;
    container.appendChild(itemDiv);
  });

  // 🔻 إضافة زر Checkout تحت المنتجات فقط لو فيه منتجات
  if (cart.length > 0) {
    const checkoutBtn = document.createElement("button");
    checkoutBtn.className = "checkout-btn";
    checkoutBtn.textContent = "Checkout 🛒";
    checkoutBtn.classList.add('checkout-z')
    checkoutBtn.addEventListener("click", () => {

      // هنا تقدر توجهه لصفحة checkout فعلًا
      window.location.href = "../cart.html";
    });

    container.appendChild(checkoutBtn);
    container.classList.add('render-side-z')
  }

  // ✅ حذف العناصر
  document.querySelectorAll(".cart-item-delete").forEach((btn) => {
    btn.addEventListener("click", function () {
      const index = parseInt(this.dataset.index);
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCartItems();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  displayProductByCategory(db);
});