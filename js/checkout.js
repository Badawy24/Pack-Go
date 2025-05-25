// cart-item.js
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase-config.js";

async function removeItemFromFirestoreAndLocal(docId, id, color) {
  try {
    await deleteDoc(doc(db, "carts", docId));
    console.log("Document deleted from Firestore:", docId);

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => !(item.id === id && item.color === color));
    localStorage.setItem("cart", JSON.stringify(cart));

    await displayCartItems();
  } catch (error) {
    console.error("Error while deleting item from Firestore and localStorage:", error);
  }
}

async function displayCartItems() {
  const container = document.querySelector(".cart-item-container-cart");
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
      container.innerHTML = "<h2> the cart is empty</h2>";
      updateSummary(0);
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
            <h4 style="margin-bottom:5px;">
              <a href="productDetails.html?id=${item.id}" style="color: #fff; text-decoration: underline;">
                 ${item.title}
              </a>
            </h4>
            <p style="margin-bottom:5px;">Color : ${item.color}</p>
            <p style="margin-bottom:5px; ">Quantity : 
              <input type="number" min="1" value="${item.quantity}" 
                      class="quantity-input" 
                      data-docid="${item._id}" 
                      data-price="${item.price}" 
                      style="width: 50px; padding: 2px; border: 1.5px solid #ccc; border-radius: 7px;"/>
            </p>
            <p>Item-Price : $${item.price}</p>
          </div>
        </div>
        <button class="delete-btn"
                data-docid="${item._id}"
                data-id="${item.id}"
                data-color="${item.color}"
                title=" delete item"
                style="background:none; border:none; cursor:pointer; font-size:22px; color:#e74c3c;">
          <i class="fas fa-trash-alt"></i>
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

    container.querySelectorAll(".delete-btn").forEach(button => {
      button.addEventListener("click", async (e) => {
        const docId = e.currentTarget.dataset.docid;
        const id = e.currentTarget.dataset.id;
        const color = e.currentTarget.dataset.color;

        if (!docId || !id || !color) {
          console.error("Delete data incomplete!");
          return;
        }
        console.log("Doc ID to delete:", docId, "id:", id, "color:", color);
        const confirmDelete = confirm("Do you want to delete this item?");
        if (confirmDelete) {
          await removeItemFromFirestoreAndLocal(docId, id, color);
        }
      });
    });

    container.querySelectorAll(".quantity-input").forEach(input => {
      input.addEventListener("change", async (e) => {
        const newQty = parseInt(e.target.value);
        const docId = e.target.dataset.docid;
        const price = parseFloat(e.target.dataset.price);

        if (isNaN(newQty) || newQty < 1) {
          alert("The quantity must be a positive number.");
          e.target.value = 1;
          return;
        }

        try {
          const itemRef = doc(db, "carts", docId);
          await updateDoc(itemRef, { quantity: newQty });

          let cart = JSON.parse(localStorage.getItem("cart")) || [];
          cart = cart.map(item => {
            if (item._id === docId) {
              item.quantity = newQty;
            }
            return item;
          });
          localStorage.setItem("cart", JSON.stringify(cart));

          await displayCartItems();
        } catch (error) {
          console.error("Failed to update quantity:", error);
        }
      });
    });
  } catch (error) {
    console.error("Error while fetching cart items:", error);
    container.innerHTML = "<p>Error loading cart.</p>";
  }
}

function updateSummary(totalPrice) {
  const subtotalElement = document.querySelector(".summary-row:first-child .price");
  const totalElement = document.querySelector(".summary-row.total .price");
  const itemCountElement = document.querySelector(".summary-row.items .count");
  if (itemCountElement) {
    const cart = (JSON.parse(localStorage.getItem("cart")) || [])
      .filter(item => item && typeof item.quantity === "number" && item.quantity > 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    itemCountElement.textContent = `${totalItems}`;
  }

  if (subtotalElement && totalElement) {
    subtotalElement.textContent = `$${totalPrice.toFixed(2)}`;
    totalElement.textContent = `$${totalPrice.toFixed(2)}`;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  displayCartItems();
});
