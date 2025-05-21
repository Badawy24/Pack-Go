// sb-0lnoj42363161@personal.example.com
// 12345678
import { collection, getDocs, query, where, documentId, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase-config.js";
import { showInvoicePopup } from "./invoice.js";
import { IsLogin } from './isLogin.js';
document.addEventListener("DOMContentLoaded", () => {
    IsLogin()
        .then((user) => {
            const userId = user.uid;
            console.log("Logged in:", userId);
            initPayPal(db, userId);
        })
        .catch((err) => {
            console.error("❌", err);
        });
});


function getCartItemsFromLocalStorage() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log(1);
    return cart;
}
async function getProductsFromFirestoreByIds(db, ids) {
    if (!ids.length) return [];

    const productsRef = collection(db, "productsData");
    const queryOfProducts = query(productsRef, where(documentId(), "in", ids));
    const querySnapshot = await getDocs(queryOfProducts);

    let firestoreProducts = [];
    querySnapshot.forEach((doc) => {
        firestoreProducts.push({ id: doc.id, ...doc.data() });
    });
    console.log(2);

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
    console.log(3);

    return total;
}

export async function initPayPal(db, userId) {
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
        onApprove: async function (data, actions) {
            return actions.order.capture().then(async function (details) {
                const paidAmount = details.purchase_units[0].amount.value;

                if (Number(paidAmount).toFixed(2) === valueShouldPay) {
                    console.log("✅ Payment matched!");
                    console.log("💵 Paid Amount:", paidAmount);
                    console.log("🆔 Transaction ID:", details.id);
                    console.log("🆔 User ID:", userId);
                    console.log("✅ Payment Success!");
                    console.log("👤 Payer Name:", details.payer.name.given_name, details.payer.name.surname);
                    console.log("💳 Email:", details.payer.email_address);
                    console.log("💵 Paid Amount:", details.purchase_units[0].amount.value, details.purchase_units[0].amount.currency_code);

                    const productIds = localCart.map(item => item.id);
                    const firestoreProducts = await getProductsFromFirestoreByIds(db, productIds);

                    const productsWithQuantity = firestoreProducts.map(product => {
                        const cartItem = localCart.find(item => item.id === product.id);
                        return {
                            id: product.id,
                            code: product.code || "",
                            description: product.description || "",
                            image: product.image || "",
                            price: product.price || 0,
                            quantity: cartItem ? cartItem.quantity : 0,
                            title: product.title || ""
                        };
                    });

                    const orderData = {
                        userId: userId,
                        payerName: details.payer.name.given_name + " " + details.payer.name.surname,
                        payerEmail: details.payer.email_address,
                        transactionId: details.id,
                        paidAmount: details.purchase_units[0].amount.value,
                        currency: details.purchase_units[0].amount.currency_code,
                        createdAt: serverTimestamp(),
                        products: productsWithQuantity,
                        status: "completed"
                    };
                    try {
                        await addDoc(collection(db, "orders"), orderData);
                        console.log("✅ Order saved successfully in Firestore.");
                        localStorage.removeItem("cart");
                        showInvoicePopup(orderData);
                    } catch (error) {
                        console.error("❌ Failed to save order:", error);
                    }
                } else {
                    console.error("❌ Payment amount mismatch!");
                    console.log("Expected:", valueShouldPay, "Got:", paidAmount);
                    alert("Payment mismatch. Expected: $" + valueShouldPay + " but got: $" + paidAmount);
                }
            });
        }
    }).render('#paypal-button-container');
}

