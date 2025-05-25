import { deleteDoc, query, collection, where, getDocs } from "firebase/firestore";
import { db } from "./firebase-config.js";

async function displayCartItems() {
  const container = document.querySelector(".cart-item-container");
  if (!container) return;

  container.innerHTML = "";

  try {
    const querySnapshot = await getDocs(collection(db, "carts"));
    const cart = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      data._id = docSnap.id;
      cart.push(data);
    });

    if (cart.length === 0) {
      container.innerHTML = "<p>Cart is empty</p>";
      return;
    }

    cart.forEach((item) => {
      console.log("Cart item:", item);

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
        <button class="delete-btn" data-id="${item._id}" title="delete item" style="background:none; border:none; cursor:pointer; font-size:20px; color:#c00;">🗑️</button>
      `;

      container.appendChild(itemDiv);
    });

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

    container.querySelectorAll(".delete-btn").forEach(button => {
      button.addEventListener("click", async (e) => {
        const docId = e.currentTarget.dataset.id;
        if (!docId) {
          console.error("docId is missing!");
          return;
        }
        console.log("Doc ID to delete:", docId);
        await removeItemFromFirestoreAndLocal(docId);
      });
    });

  } catch (error) {
    console.error("Error fetching or displaying cart data:", error);
    container.innerHTML = "<p>There was an error loading the cart.</p>";
  }
}

async function removeItemFromCart(docId) {
  try {
    await deleteDoc(doc(db, "carts", docId));
    console.log("Document deleted:", docId);
    await displayCartItems();
  } catch (error) {
    console.error("Error deleting item from cart:", error);
  }
}

async function removeItemFromFirestoreAndLocal(docId) {
  try {
    await deleteDoc(doc(db, "carts", docId));
    console.log("Document deleted from Firestore:", docId);

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = cart.filter(item => item.id !== productId);

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    await displayCartItems();
  } catch (error) {
    console.error("Error deleting item from Firestore and localStorage:", error);
  }
}

window.addEventListener("DOMContentLoaded", displayCartItems);
