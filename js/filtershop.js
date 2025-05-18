

import { productsArray, createProductCard } from './shop.js';
import { paginateProducts } from "./pagination.js";


document.addEventListener("DOMContentLoaded", () => {
    const filterLinks = document.querySelectorAll('#filter a');

    filterLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            // Remove active class from all
            filterLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            const selectedCategory = link.getAttribute("data-category");

            if (selectedCategory === "all") {
                createProductCard(productsArray);
            } else {
                const filtered = productsArray.filter(product => product.category === selectedCategory);
                createProductCard(filtered);
            }
            paginateProducts();
        });
    });
});
