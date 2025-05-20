import { collection, query, where, getDocs } from "firebase/firestore";

// Get category from URL
const params = new URLSearchParams(window.location.search);
const category = params.get("category");

const categoryTitle = document.getElementById("category-title");
if (categoryTitle && category) {
  categoryTitle.innerText = `منتجات: ${category}`;
}

export async function displayProductByCategory(db) {
  if (!category) return;

  try {
    const productsRef = collection(db, 'productsData');
    const q = query(productsRef, where("category", "==", category));
    const querySnapshot = await getDocs(q);

    const container = document.getElementById("products-container");
    if (!container) return;

    container.innerHTML = ""; // Clear previous content

    if (querySnapshot.empty) {
      container.innerText = "لا توجد منتجات في هذه الفئة.";
      return;
    }

    querySnapshot.forEach(docSnap => {
      const product = docSnap.data();
      const productId = docSnap.id;

      const catTitle = document.getElementById('cat-title');
      if (catTitle) catTitle.innerText = product.category;

      const productCard = document.createElement("div");
      productCard.classList.add("product-card");

      const img = document.createElement("img");
      img.src = product.image;
      img.alt = product.title;

      const title = document.createElement("h3");
      title.innerText = product.title;

      const price = document.createElement("p");
      price.innerText = product.price + "$";

      const button = document.createElement("button");
      button.classList.add("button-z");
      button.innerText = "Add To Cart";

      productCard.appendChild(img);
      productCard.appendChild(title);
      productCard.appendChild(price);
      productCard.appendChild(button);

      // ✅ هنا الجزء المهم: الكليك يوديك على صفحة التفاصيل
      productCard.addEventListener("click", () => {
        window.location.href = `productDetails.html?id=${productId}`;
      });

      container.appendChild(productCard);
    });

  } catch (error) {
    console.error("خطأ أثناء جلب المنتجات:", error);
  }
}
