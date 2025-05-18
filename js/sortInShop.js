import {productsArray, createProductCard} from "./shop.js";
import { paginateProducts } from "./pagination.js";

// console.log("From sortInShop : ", productsArray);

let sortOption = document.getElementById("sort");

sortOption.addEventListener("change", () => {
    let sortedArray = productsArray.slice();
    // console.log("Sorted array : ", sortedArray);

    let selectedOption = sortOption.value;

    if (selectedOption === "0") {   // Recommended
        createProductCard(productsArray);
    } else if (selectedOption === "1") {    // Price: Low to High
        sortedArray.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        createProductCard(sortedArray);
    } else if (selectedOption === "2") {   // Price: High To Low
        sortedArray.sort((a, b) =>  parseFloat(b.price) - parseFloat(a.price));
        createProductCard(sortedArray);
    }else if (selectedOption === "3") {   // Title A-Z
        sortedArray.sort((a, b) => a.title.localeCompare(b.title));
        createProductCard(sortedArray);
    } else if (selectedOption === "4") {   // Title Z-A
        sortedArray.sort((a, b) => b.title.localeCompare(a.title));
        createProductCard(sortedArray);
    }
    else{ 
        createProductCard(productsArray);
    }
    paginateProducts();

});
