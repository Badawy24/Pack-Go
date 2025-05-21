// cart-item.js
import { collection, getDocs, deleteDoc, doc, query, where, updateDoc, addDoc } from "firebase/firestore";
import { db } from "./firebase-config.js";

async function removeItemFromFirestoreAndLocal(docId, id, color) {
  try {
    // حذف من Firestore
    await deleteDoc(doc(db, "carts", docId));
    console.log("تم حذف الوثيقة من Firestore:", docId);

    // حذف من localStorage بناءً على id و color
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => !(item.id === id && item.color === color));
    localStorage.setItem("cart", JSON.stringify(cart));

    // إعادة عرض السلة بعد الحذف
    await displayCartItems();
  } catch (error) {
    console.error("خطأ أثناء حذف العنصر من Firestore و localStorage:", error);
  }
}




async function displayCartItems() {
    const container = document.querySelector(".cart-item-container-cart");
    if (!container) return;

    container.innerHTML = ""; // تنظيف المحتوى

    try {
        const querySnapshot = await getDocs(collection(db, "carts"));
        const cart = [];
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            data._id = docSnap.id;
            cart.push(data);
        });

        if (cart.length === 0) {
            container.innerHTML = "<p>السلة فارغة</p>";
            updateSummary(0); // إذا كانت السلة فاضية
            return;
        }

        cart.forEach((item) => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("cart-item");
            itemDiv.style.display = "flex";
            itemDiv.style.alignItems = "center";
            itemDiv.style.justifyContent = "space-between";
            itemDiv.style.marginBottom = "10px";

            itemDiv.innerHTML = `
                <div class="cart-z-content" style="display:flex; align-items:center; gap:10px;">
                    <img src="${item.image}" alt="${item.title}" style="width:80px; height:80px; object-fit:cover;" />
                    <div>
                        <h4 style="margin-bottom:5px;">${item.title}</h4>
                        <p style="margin-bottom:5px;">Color: ${item.color}</p>
                        <p style="margin-bottom:5px;">Quantity: ${item.quantity}</p>
                        <p>Item-Price: $${item.price}</p>
                    </div>
                </div>
                <button
                class="delete-btn"
                data-docid="${item._id}"
                data-id="${item.id}"
                data-color="${item.color}"
                title="حذف العنصر"
                style="background:none; border:none; cursor:pointer; font-size:20px; color:#c00;"
                >
                🗑️
                </button>
                        `;

            container.appendChild(itemDiv);
        });

        const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const totalDiv = document.createElement("div");
        totalDiv.style.marginTop = "20px";
        totalDiv.style.fontWeight = "bold";
        totalDiv.style.fontSize = "18px";
        totalDiv.style.color = "#fff";
        totalDiv.textContent = `Total Price: $${totalPrice.toFixed(2)}`;

        const btn = document.createElement("button");
        btn.innerText = 'Checkout';
        btn.classList.add('checkout-z');

        container.appendChild(totalDiv);
        container.appendChild(btn);

        updateSummary(totalPrice);

        // حذف العناصر
                container.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", async (e) => {
            const docId = e.currentTarget.dataset.docid;
            const id = e.currentTarget.dataset.id;
            const color = e.currentTarget.dataset.color;

            if (!docId || !id || !color) {
            console.error("بيانات الحذف غير كاملة!");
            return;
            }
            console.log("Doc ID to delete:", docId, "id:", id, "color:", color);
            await removeItemFromFirestoreAndLocal(docId, id, color);
        });
        });


    } catch (error) {
        console.error("خطأ أثناء جلب عناصر السلة:", error);
        container.innerHTML = "<p>حدث خطأ أثناء تحميل السلة.</p>";
    }
}

async function removeItemFromCart(docId) {
    try {
        // حذف العنصر من Firestore
        await deleteDoc(doc(db, "carts", docId));

        // حذف العنصر من localStorage
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const updatedCart = cart.filter(item => item.id !== docId && item._id !== docId);
        localStorage.setItem("cart", JSON.stringify(updatedCart));

        // تحديث العرض بعد الحذف
        await displayCartItems();
    } catch (error) {
        console.error("فشل في حذف العنصر:", error);
    }
}


function updateSummary(totalPrice) {
    const subtotalElement = document.querySelector(".summary-row:first-child .price");
    const totalElement = document.querySelector(".summary-row.total .price");

    if (subtotalElement && totalElement) {
        subtotalElement.textContent = `$${totalPrice.toFixed(2)}`;
        totalElement.textContent = `$${totalPrice.toFixed(2)}`;
    }
}

window.addEventListener("DOMContentLoaded", () => {
    displayCartItems();
});
