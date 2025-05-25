export let currentProducts = [];

export function setCurrentProducts(products) {
    currentProducts = products;
}

export function getCurrentProducts() {
    return currentProducts;
}
