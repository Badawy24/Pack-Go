// cart-item.js
import { deleteDoc, query, collection, where, getDocs } from "firebase/firestore";
import { db } from "./firebase-config.js";


async function displayCartItems() {
  const container = document.querySelector(".cart-item-container");
  if (!container) return;

  container.innerHTML = ""; // تنظيف المحتوى

  try {
    // جلب جميع عناصر السلة من Firestore collection باسم "carts"
    const querySnapshot = await getDocs(collection(db, "carts"));
    const cart = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      data._id = docSnap.id; // نحفظ ID الحقيقي داخل الخاصية _id
      cart.push(data);
    });

    if (cart.length === 0) {
      container.innerHTML = "<p>السلة فارغة</p>";
      return;
    }

    // إنشاء عناصر السلة
    cart.forEach((item) => {
      console.log("Cart item:", item); // للتأكد من البيانات

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
        <button class="delete-btn" data-id="${item._id}" title="حذف العنصر" style="background:none; border:none; cursor:pointer; font-size:20px; color:#c00;">🗑️</button>
      `;

      container.appendChild(itemDiv);
    });

    // عرض الإجمالي الكلي تحت العناصر
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalDiv = document.createElement("div");
    totalDiv.style.marginTop = "20px";
    totalDiv.style.marginBottom = "20px";
    totalDiv.style.fontWeight = "bold";
    totalDiv.style.fontSize = "18px";
    totalDiv.style.color = "#fff";
    totalDiv.textContent = `Total Price: $${totalPrice.toFixed(2)}`;

    const btn = document.createElement("a");
    btn.innerText = 'Checkout';
    btn.classList.add('checkout-z');
    btn.href = "../checkout.html";

    container.appendChild(totalDiv);
    container.appendChild(btn);

    // إضافة حدث حذف
    container.querySelectorAll(".delete-btn").forEach(button => {
      button.addEventListener("click", async (e) => {
        const docId = e.currentTarget.dataset.id;
        if (!docId) {
          console.error("docId غير موجود!");
          return;
        }
        console.log("Doc ID to delete:", docId);
        await removeItemFromFirestoreAndLocal(docId);
      });
    });

  } catch (error) {
    console.error("خطأ في جلب أو عرض بيانات السلة:", error);
    container.innerHTML = "<p>حدث خطأ أثناء تحميل السلة.</p>";
  }
}

async function removeItemFromCart(docId) {
  try {
    await deleteDoc(doc(db, "carts", docId));
    console.log("تم حذف الوثيقة:", docId);
    await displayCartItems(); // إعادة التحديث بعد الحذف
  } catch (error) {
    console.error("خطأ أثناء حذف العنصر من السلة:", error);
  }
}
async function removeItemFromFirestoreAndLocal(docId) {
  try {
    // حذف من Firestore
    await deleteDoc(doc(db, "carts", docId));
    console.log("تم حذف الوثيقة من Firestore:", docId);

    // حذف من localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = cart.filter(item => item.id !== productId); 
// لازم تمرر productId اللي تطابق id المنتج، مش docId

    
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // تحديث العرض
    await displayCartItems();
  } catch (error) {
    console.error("خطأ أثناء حذف العنصر من Firestore و localStorage:", error);
  }
}


window.addEventListener("DOMContentLoaded", displayCartItems);
