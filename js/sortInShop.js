import { createProductCard ,productsArray} from "./shop.js";
import { paginateProducts } from "./pagination.js";
import { getCurrentProducts } from "./state.js";

let sortOption = document.getElementById("sort");

sortOption.addEventListener("change", () => {
    let currentProducts = getCurrentProducts();

    // لو currentProducts فاضية (في حالة نادرة جداً)، نعرض كل المنتجات الافتراضية
    if (!currentProducts || currentProducts.length === 0) {
        currentProducts = productsArray.slice();  // لو حابب تحتاج تستورد productsArray هنا
    }

    let sortedArray = currentProducts.slice();

    let selectedOption = sortOption.value;

    if (selectedOption === "0") {
        createProductCard(currentProducts);
    } else if (selectedOption === "1") {
        sortedArray.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        createProductCard(sortedArray);
    } else if (selectedOption === "2") {
        sortedArray.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        createProductCard(sortedArray);
    } else if (selectedOption === "3") {
        sortedArray.sort((a, b) => a.title.localeCompare(b.title));
        createProductCard(sortedArray);
    } else if (selectedOption === "4") {
        sortedArray.sort((a, b) => b.title.localeCompare(a.title));
        createProductCard(sortedArray);
    } else {
        createProductCard(currentProducts);
    }

    paginateProducts();
});
