import { collection, query, orderBy, limit, startAfter, getDocs } from "firebase/firestore";
import { db } from "./firebase-config.js";

let products = [];
let endOfProducts = null;
let productsPerPage = 8;
let currentPage = 1;
let isLoading = false;
let errorLoad = document.getElementById("error-load");

let getProductsFromFireStore = async (loadFirstPage = true, order = "title", typeOrder = "asc") => {
    if (isLoading) return;
    isLoading = true;
    try {
        let getProducts;

        if (loadFirstPage) {
            getProducts = query(collection(db, 'productsData'), orderBy(order, typeOrder), limit(productsPerPage));
            currentPage = 1;
            products = [];
        } else {
            getProducts = query(collection(db, 'productsData'), orderBy(order, typeOrder), startAfter(endOfProducts), limit(productsPerPage));
        }

        let querySnapshot = await getDocs(getProducts);
        endOfProducts = querySnapshot.docs[querySnapshot.docs.length - 1];

        querySnapshot.forEach(doc => {
            let product = doc.data();
            product.id = doc.id;
            products.push(product);
        });

        createProductCard(products);
    } catch (error) {
        errorLoad.innerText = "Can't load more";
        errorLoad.style.display = "flex";
        setTimeout(() => {
            errorLoad.style.display = "none";
        }, 4000);
    } 
    isLoading = false;

}

function createProductCard(products) {
    let shopBody = document.getElementById('shop-body-B');
    if (!shopBody) return;

    shopBody.innerHTML = '';

    products.forEach(product => {
        let productCard = document.createElement("div");
        productCard.className = "product-card-m";
        productCard.setAttribute("data-category", product.category);

        let priceBeforeDiscount = parseFloat(product.price);
        let discount = parseFloat(product.discountPercentage);
        let priceAfterDiscount = (priceBeforeDiscount * (1 - discount/100)).toFixed(2);


        productCard.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>
        <span class="price-m">${priceAfterDiscount}$</span>
        <span class="price-m" style="text-decoration: line-through; color:var(--dark-grey-color);">${priceBeforeDiscount}$</span>
        <button class="button-z">View Details</button>
    `;

        productCard.addEventListener("click", (e) => {
            if (e.target.tagName !== 'button') {
                window.location.href = `productDetails.html?id=${product.id}`;
            }
        });

        shopBody.appendChild(productCard);
    });
}

window.addEventListener("load", () => {
    getProductsFromFireStore(true);

    window.addEventListener('scroll', () => {
        let { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 100 && !isLoading) {
            getProductsFromFireStore(false);
        }
    });
});


export { products, getProductsFromFireStore, createProductCard };