import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "./firebase-config.js";

const db = getFirestore(app);

const params = new URLSearchParams(window.location.search);
const orderId = params.get("orderId");

if (!orderId) {
  alert("No order ID provided.");
} else {
  const orderRef = doc(db, "orders", orderId);
  getDoc(orderRef)
    .then((docSnap) => {
      if (!docSnap.exists()) {
        alert("Order not found");
        return;
      }

      const order = docSnap.data();

      // عرض المنتجات في container
      const container = document.querySelector(".cart-item-container-cart");
      container.innerHTML = "";

      order.products.forEach((item) => {
        const productEl = document.createElement("div");
        productEl.classList.add("cart-item-cart");
        productEl.innerHTML = `
          <div class="product-info">
            <img src="${item.image}" alt="${item.title}" />
            <div>
              <h4>${item.title}</h4>
              <p>Color: ${item.color || 'N/A'}</p>
              <p>Quantity: ${item.quantity}</p>
              <p>Item-Price: $${item.price}</p>
            </div>
          </div>
        `;
        container.appendChild(productEl);
      });

      // حساب السعر الإجمالي
      const totalPrice = order.products.reduce((sum, item) => sum + item.price * item.quantity, 0);


      // عرض ملخص الطلب في القسم المخصص
      const summaryContainer = document.querySelector(".summary-section .order-summary");
      summaryContainer.innerHTML = `
        <div class="summary-row">
          <span>Name</span>
          <span>${order.payerName}</span>
        </div>
        <div class="summary-row">
          <span>Email</span>
          <span>${order.payerEmail}</span>
        </div>
        <div class="summary-row">
          <span>Date</span>
          <span>${order.createdAt.toDate().toLocaleDateString()}</span>
        </div>
        <div class="summary-row">
          <span>Transaction ID</span>
          <span>${order.transactionId}</span>
        </div>
        <div class="summary-row total">
          <span>Total Paid</span>
          <span>$${parseFloat(order.paidAmount).toFixed(2)}</span>
        </div>
        <div class="summary-row">
          <span>Status</span>
          <span>${order.status}</span>
        </div>
      `;
    })
    .catch((err) => {
      console.error("❌ Error loading order:", err);
      alert("Error loading order data.");
    });
}
