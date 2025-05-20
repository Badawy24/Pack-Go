import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig.js"; // تأكد المسار

// 1. قراءة ID من الرابط
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

// 2. جلب بيانات المنتج من Firestore
async function getProductDetails(id) {
    const docRef = doc(db, "productsData", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        displayProductDetails(docSnap.data());
    } else {
        document.getElementById("product-details-container").innerHTML = `<p>Product not found</p>`;
    }
}

// 3. عرض بيانات المنتج في الصفحة
function displayProductDetails(product) {
    const container = document.getElementById("product-details-container");
    container.innerHTML = `
        <div class="product-detail-box">
            <img src="${product.image}" alt="${product.title}" />
            <div class="details">
                <h2>${product.title}</h2>
                <p><strong>Price:</strong> ${product.price}$</p>
                <p><strong>Description:</strong> ${product.description}</p>
                <p><strong>Category:</strong> ${product.category}</p>
                <p><strong>Code:</strong> ${product.code}</p>
                <p><strong>Return Policy:</strong> ${product.returnPolicy}</p>
                <button class="button-z">Add To Cart</button>
            </div>
        </div>
    `;
}

getProductDetails(productId);
