import {
  doc,
  getDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase-config.js";

// الدالة الجديدة هنا
async function addOrUpdateCartItem(cartItem) {
  const cartsRef = collection(db, "carts");

  // Query على المنتج بنفس الـ id واللون
  const q = query(
    cartsRef,
    where("id", "==", cartItem.id),
    where("color", "==", cartItem.color)
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docRef = querySnapshot.docs[0].ref;
    const existingData = querySnapshot.docs[0].data();

    // اجعل الكمية الجديدة هي مجموع القديم + الجديد
    const newQuantity = existingData.quantity + cartItem.quantity;

    await updateDoc(docRef, { quantity: newQuantity });
    console.log("تم تحديث الكمية في Firestore.");
  } else {
    await addDoc(cartsRef, cartItem);
    console.log("تم إضافة المنتج في Firestore.");
  }
}

// بعد كده في مكان استدعاء addDoc استبدله بـ addOrUpdateCartItem

export async function getProductDetails(id, db) {
  try {
    console.log("Fetching product for id:", id);
    if (!id) {
      const container = document.getElementById("product-details-container");
      if (container)
        container.innerHTML = `<p>No product ID provided in URL.</p>`;
      return;
    }

    const docRef = doc(db, "productsData", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Product data:", docSnap.data());
      // نبعت id مع بيانات المنتج عشان نقدر نستخدمه بعدين
      displayProductDetails({ id: docSnap.id, ...docSnap.data() });
    } else {
      console.log("No such document!");
      const container = document.getElementById("product-details-container");
      if (container) container.innerHTML = `<p>Product not found</p>`;
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    const container = document.getElementById("product-details-container");
    if (container)
      container.innerHTML = `<p>Error loading product details.</p>`;
  }
}

function displayProductDetails(product) {
  const container = document.getElementById("product-details-container");
  if (!container) return;

  container.innerHTML = `
    <div class="breadcrumbs">
      <a href="index.html">Home</a> / <a href="shop.html">${
        product.category
      }</a> /
      <span>${product.title}</span>
    </div>

    <section class="product-section">
      <div class="product-images">
        <img src="${product.image}" alt="${product.title}" />
      </div>
      <div class="product-info">
        <h1>${product.title}</h1>
      
        <div class="product-price">
          <span class="old-price">$${(product.price * 1.1).toFixed(2)}</span>
          <span class="sale-price">$${product.price}</span>
        </div>

        <form id="add-to-cart-form">
          <label for="color">Color:</label>
          <select id="color" name="color" required>
            <option value="Blue">Blue</option>
            <option value="Black">Black</option>
            <option value="Green">Green</option>
          </select>
          <label for="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value="1"
            min="1"
            max=${product.quantity}
            required
          />
          <div class="product-buttons">
            <button type="submit" class="add-cart-btn">Add to Cart</button>
            <button type="button" id="buy" class="buy-now-btn">Buy Now</button>
          </div>
        </form>

        <div class="product-details">
          <h2>Product Info</h2>
          <p>${product.description}</p>
        </div>
        <div class="product-details">
          <h2>Return and Refund Policy</h2>
          <p>${product.returnPolicy}</p>
        </div>
      </div>
    </section>
  `;

  // إضافة حدث submit للفورم عشان نخزن المنتج في localStorage
  const form = document.getElementById("add-to-cart-form");
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const color = form.color.value;
    const quantity = parseInt(form.quantity.value);

    // تجهيز العنصر للسلة
    const cartItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      color,
      quantity,
      image: product.image,
    };

    // جلب السلة من localStorage أو إنشاء جديدة
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // هل المنتج بنفس اللون موجود في السلة؟ نحدث الكمية فقط
    const existingIndex = cart.findIndex(
      (item) => item.id === cartItem.id && item.color === cartItem.color
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push(cartItem);
    }

    // حفظ السلة المحدثة
    localStorage.setItem("cart", JSON.stringify(cart));

    // 🔥 إضافة العنصر إلى Firestore داخل carts
    try {
      await addOrUpdateCartItem(cartItem);
      alert("Added To Cart ");
      console.log("تم حفظ المنتج في Firestore من الفورم.");
    } catch (error) {
      console.error("خطأ أثناء الحفظ في Firestore من الفورم:", error);
    }

    const container = document.querySelector(".cart-item-container");
    container.classList.add("active");
    renderCartItems();
  });

  const buy = document.getElementById("buy");

  buy.addEventListener("click", async function (e) {
    e.preventDefault();

    const color = form.color.value;
    const quantity = parseInt(form.quantity.value);

    const cartItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      color,
      quantity,
      image: product.image,
    };

    // إضافة للسلة في localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingIndex = cart.findIndex(
      (item) => item.id === cartItem.id && item.color === cartItem.color
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // 🟢 إضافة العنصر إلى Firestore داخل Collection اسمها "carts"
    try {
      await addOrUpdateCartItem(cartItem);

      console.log("تم حفظ المنتج في Firestore.");
    } catch (error) {
      console.error("خطأ أثناء الحفظ في Firestore:", error);
    }

    // التنقل لصفحة cart
    window.location.href = "cart.html";
  });
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
    checkoutBtn.classList.add("checkout-z");
    checkoutBtn.addEventListener("click", () => {
      // هنا تقدر توجهه لصفحة checkout فعلًا
      window.location.href = "../cart.html";
    });

    container.appendChild(checkoutBtn);
    container.classList.add("render-side-z");
  }

  // ✅ حذف العناصر
  document.querySelectorAll(".cart-item-delete").forEach((btn) => {
    btn.addEventListener("click", function () {
      const index = parseInt(this.dataset.index);
      removeCartItemFromBoth(index);
    });
  });
}
async function removeCartItemFromBoth(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const itemToRemove = cart[index];

  if (!itemToRemove) return;

  // حذف من Firestore
  const q = query(
    collection(db, "carts"),
    where("id", "==", itemToRemove.id),
    where("color", "==", itemToRemove.color)
  );
  const querySnapshot = await getDocs(q);

  for (let docSnap of querySnapshot.docs) {
    await deleteDoc(docSnap.ref);
  }

  // حذف من localStorage
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));

  // إعادة العرض
  renderCartItems();
}
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.toLowerCase().endsWith("productdetails.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
    console.log("Product ID from URL:", productId);
    if (productId) {
      getProductDetails(productId, db).catch((err) =>
        console.error("Error in getProductDetails:", err)
      );
    } else {
      console.error("No product ID found in URL.");
      const container = document.getElementById("product-details-container");
      if (container)
        container.innerHTML = `<p>No product ID provided in URL.</p>`;
    }
  }
});
