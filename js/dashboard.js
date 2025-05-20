import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDOL8EAF_5kYHAom1fZ_7UiAxWcWIJ5Aok",
  authDomain: "pack-go-5d568.firebaseapp.com",
  projectId: "pack-go-5d568",
  storageBucket: "pack-go-5d568.firebasestorage.app",
  messagingSenderId: "525870091383",
  appId: "1:525870091383:web:06655ed6e02bcf40e28a72",
  measurementId: "G-R9DE3EBPD2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const productsRef = collection(db, "productsData");

const form = document.querySelector("#productForm");
const productList = document.querySelector("#productList");
let editId = null;

async function loadProducts() {
  productList.innerHTML = "";
  const snapshot = await getDocs(productsRef);
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <h3>${data.title}</h3>
      <p>${data.description}</p>
      <p>Category : ${data.category}</p>
      <p>Price : $${data.price} | Discount: ${data.discountPercentage}%</p>
      <p>Quantity : ${data.quantity} | Return: ${data.returnPolicy}</p>
      <p>Color : ${data.color} <span style="background:${data.colorHEX};padding:0 10px;">&nbsp;</span></p>
      <div class="actions">
        <button onclick="editProduct('${docSnap.id}', ${JSON.stringify(data).replace(/"/g, '&quot;')})">Edit</button>
        <button onclick="deleteProduct('${docSnap.id}')">Delete</button>
      </div>
    `;
    productList.appendChild(div);
  });
}

window.deleteProduct = async (id) => {
  await deleteDoc(doc(db, "productsData", id));
  loadProducts();
};

window.editProduct = (id, data) => {
  form.code.value = data.code;
  form.title.value = data.title;
  form.description.value = data.description;
  form.category.value = data.category;
  form.price.value = data.price;
  form.discountPercentage.value = data.discountPercentage;
  form.quantity.value = data.quantity;
  form.returnPolicy.value = data.returnPolicy;
  form.color.value = data.color;
  form.colorHEX.value = data.colorHEX;
  form.image.value = data.image;
  form.info.value = data.info;
  editId = id;
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    code: Number(form.code.value),
    title: form.title.value,
    description: form.description.value,
    category: form.category.value,
    price: Number(form.price.value),
    discountPercentage: Number(form.discountPercentage.value),
    quantity: Number(form.quantity.value),
    returnPolicy: form.returnPolicy.value,
    color: form.color.value,
    colorHEX: form.colorHEX.value,
    image: form.image.value,
    info: form.info.value
  };
  if (editId) {
    await updateDoc(doc(db, "productsData", editId), data);
    editId = null;
  } else {
    await addDoc(productsRef, data);
  }
  form.reset();
  loadProducts();
});

loadProducts();
