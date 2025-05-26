import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "./firebase-config.js";

const cartContainer = document.querySelector(".cart .box-container");
const cartTotalElement = document.querySelector(".cart .total span");

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const cartCountElement = document.querySelector("#cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = cartCount;
  }
}

// عرض عناصر السلة
async function displayCartItems() {
  cartContainer.innerHTML = ""; // تفريغ المحتوى القديم

  const cartSnapshot = await getDocs(collection(db, "carts"));
  let cartTotal = 0;
  const localCart = [];

  cartSnapshot.forEach((docSnap) => {
    const item = docSnap.data();
    item._id = docSnap.id;

    const subtotal = (item.price || 0) * (item.quantity || 1);
    cartTotal += subtotal;

    // بناء عنصر HTML
    const cartItemHTML = `
      <div class="box">
        <img src="${item.image}" alt="${item.name}" />
        <div class="content">
          <h3>${item.name}</h3>
          <span class="color">Color: ${item.color}</span><br>
          <span class="quantity">Qty: ${item.quantity}</span><br>
          <span class="price">Price: $${item.price}</span><br>
          <span class="subtotal">Subtotal: $${subtotal}</span><br>
          <button class="btn remove-btn" 
            data-id="${item._id}" 
            data-itemid="${item.id}" 
            data-color="${item.color}">
            Remove
          </button>
        </div>
      </div>
    `;
    cartContainer.innerHTML += cartItemHTML;

    // بناء نسخة LocalStorage
    localCart.push(item);
  });

  // تحديث LocalStorage بناءً على Firestore
  localStorage.setItem("cart", JSON.stringify(localCart));

  // تحديث السعر الكلي
  cartTotalElement.textContent = `$${cartTotal}`;

  // تحديث عداد السلة
  updateCartCount();

  // إضافة Event Listeners لأزرار الحذف
  const removeButtons = document.querySelectorAll(".remove-btn");
  removeButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const docId = button.dataset.id;
      const itemId = button.dataset.itemid;
      const itemColor = button.dataset.color;

      await removeItemFromFirestoreAndLocal(docId, itemId, itemColor);
    });
  });
}

// حذف عنصر من Firestore وLocalStorage
async function removeItemFromFirestoreAndLocal(docId, itemId, itemColor) {
  try {
    await deleteDoc(doc(db, "carts", docId));
    console.log("تم حذف العنصر من Firestore:", docId);

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = cart.filter(item => !(item.id === itemId && item.color === itemColor));
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    await displayCartItems();
  } catch (error) {
    console.error("حدث خطأ أثناء الحذف:", error);
  }
}

document.addEventListener("DOMContentLoaded", displayCartItems);