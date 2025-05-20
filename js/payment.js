// sb-0lnoj42363161@personal.example.com
// 12345678
import { collection, getDocs, query, where, documentId } from "firebase/firestore";
import { db } from "./firebase-config.js";
// import { displayCartItems } from './checkout.js';
function getCartItemsFromLocalStorage() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    return cart;
}
async function getProductsFromFirestoreByIds(db, ids) {
    if (!ids.length) return []; // لو مفيش أي ID

    const productsRef = collection(db, "productsData");
    const queryOfProducts = query(productsRef, where(documentId(), "in", ids));
    const querySnapshot = await getDocs(queryOfProducts);

    let firestoreProducts = [];
    querySnapshot.forEach((doc) => {
        firestoreProducts.push({ id: doc.id, ...doc.data() });
    });
    return firestoreProducts;
}

async function calculateTotalAmount(db) {
    const localCart = getCartItemsFromLocalStorage();
    const ids = localCart.map(item => item.id);

    const firestoreProducts = await getProductsFromFirestoreByIds(db, ids);

    let total = 0;
    for (let item of localCart) {
        const firestoreItem = firestoreProducts.find(p => p.id === item.id);
        if (firestoreItem) {
            total += firestoreItem.price * item.quantity;
        }
    }
    return total;
}

export async function initPayPal(db) {
    const localCart = getCartItemsFromLocalStorage();

    if (localCart.length === 0) {
        console.log("Cart is empty. PayPal button will not render.");
        return;
    }

    const valueShouldPay = Number(await calculateTotalAmount(db)).toFixed(2);

    if (valueShouldPay <= 0) {
        console.log("Total amount is 0. No payment required.");
        return;
    }

    paypal.Buttons({
        style: {
            layout: 'vertical',
            color: 'white',
            shape: 'rect',
            label: 'pay',
            tagline: false,
            height: 45
        },
        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: valueShouldPay
                    }
                }]
            });
        },
        onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
                const paidAmount = details.purchase_units[0].amount.value;

                if (Number(paidAmount).toFixed(2) === valueShouldPay) {
                    console.log("✅ Payment matched!");
                    console.log("💵 Paid Amount:", paidAmount);
                    console.log("🆔 Transaction ID:", details.id);
                    console.log("✅ Payment Success!");
                    console.log("👤 Payer Name:", details.payer.name.given_name, details.payer.name.surname);
                    console.log("💳 Email:", details.payer.email_address);
                    console.log("💵 Paid Amount:", details.purchase_units[0].amount.value, details.purchase_units[0].amount.currency_code);
                } else {
                    console.error("❌ Payment amount mismatch!");
                    console.log("Expected:", valueShouldPay, "Got:", paidAmount);
                    alert("Payment mismatch. Expected: $" + valueShouldPay + " but got: $" + paidAmount);
                }
            });
        }
    }).render('#paypal-button-container');
}

document.addEventListener("DOMContentLoaded", () => {
    initPayPal(db);
});