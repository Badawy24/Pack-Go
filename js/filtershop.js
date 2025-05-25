import { productsArray, createProductCard } from "./shop.js";
import { paginateProducts } from "./pagination.js";
import { setCurrentProducts } from "./state.js";

const filterLinks = document.querySelectorAll('#filter a');

function displayProducts(products) {
    setCurrentProducts(products);
    createProductCard(products);
    paginateProducts();
}

document.addEventListener("DOMContentLoaded", () => {
    // أول ما الصفحة تفتح، نعيّن currentProducts لكل المنتجات
    displayProducts(productsArray.slice());
});

filterLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();

        filterLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");

        const selectedCategory = link.getAttribute("data-category");

        if (selectedCategory === "all") {
            displayProducts(productsArray.slice());
        } else {
            const filtered = productsArray.filter(product => product.category === selectedCategory);
            displayProducts(filtered);
        }
    });
});
