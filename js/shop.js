import { collection, onSnapshot } from "firebase/firestore";

export let productsArray = [];
// Get Data From Firestore And Display it In shop.html As Dynamic Data
export const productsInShop = (db) => {
    const productsCollection = collection(db, 'productsData');
    onSnapshot(productsCollection, (snapshot) => {

        snapshot.docs.forEach(doc => {
            let products = doc.data();
            products.id = doc.id;
            productsArray.push(products)
        });

        createProductCard(productsArray);

    });
}

export function createProductCard(products) {
    // Container for the product cards
    // <div id="shop-body-B"></div>
    let shopBody = document.getElementById('shop-body-B');
    shopBody.innerHTML = '';

    products.forEach(product => {

        // <div class="product-card-m"></div>
        let productCard = document.createElement("div");
        productCard.classList.add("product-card-m");

        // <img src="" alt="">
        let productImg = document.createElement("img");
        productImg.src = product.image;
        productImg.alt = product.title;

        // <h3></h3>
        let productTitle = document.createElement("h3");
        productTitle.innerText = product.title;

        //  <p class="price-m"></p>
        let productPrice = document.createElement("p");
        productPrice.classList.add("price-m");
        productPrice.innerText = product.price + "$";
        
        // <button class="add-to-cart-m">Add to Cart</button>
        // let productBtnAddCart = document.createElement("button");
        // productBtnAddCart.classList.add("add-to-cart-m");
        // productBtnAddCart.innerText = "Add to Cart";

        // let productBtnViewDetials = document.createElement("button");
        // productBtnViewDetials.classList.add("add-to-cart-m");
        // productBtnViewDetials.innerText = "View Details";

        // productBtnViewDetials.addEventListener("click", () => {
        //     window.location.href = `productDetails.html?id=${product.id}`;
        // });

        // Append all elements to the product card
     let button = document.createElement("button");
      button.classList.add("button-z");
      button.innerText = "Add To Cart";
        productCard.appendChild(productImg);
        productCard.appendChild(productTitle);
        productCard.appendChild(productPrice);
        productCard.appendChild(button);
        // productCard.appendChild(productBtnAddCart);
        // productCard.appendChild(productBtnViewDetials);

        // Append the product card to the shop body
        shopBody.append(productCard);


        productCard.addEventListener("click", () => {
            console.log('Product id : ', product.id);
            console.log("Product code : ", product.code);
            console.log("Product title : ", product.title);
            console.log("Product description : ", product.description);
            console.log("Product category : ", product.category);
            console.log("Product price : ", product.price);
            console.log("Product discountPercentage : ", product.discountPercentage);
            console.log("Product quantity : ", product.quantity);
            console.log("Product returnPolicy : ", product.returnPolicy);
            console.log("Product colorHEX : ", product.colorHEX);
            console.log("Product color : ", product.color);
            console.log("Product image : ", product.image);
            console.log("Product info : ", product.info);
        });
    });
}

