// Sample data to initialize the cart
if (!localStorage.getItem("cart")) {
    const initialCart = [
        {
            title: "TECHNICAL PACK",
            price: 104.00,
            quantity: 1,
            color: "Green",
            image: "/api/placeholder/200/200"
        }
    ];
    localStorage.setItem("cart", JSON.stringify(initialCart));
}

function displayCartItems() {
    const container = document.querySelector(".cart-item-container-cart");
    if (!container) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    container.innerHTML = ""; // تنظيف المحتوى

    if (cart.length === 0) {
        container.innerHTML = "<p>السلة فارغة</p>";
        return;
    }

    // إنشاء عناصر السلة
    cart.forEach((item, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-item");
        itemDiv.style.display = "flex";
        itemDiv.style.alignItems = "center";
        itemDiv.style.justifyContent = "space-between";
        itemDiv.style.marginBottom = "10px";

        itemDiv.innerHTML = `
            <div class="cart-z-content" style="display:flex; align-items:center; gap:10px;">
                <img src="${item.image}" alt="${item.title}" style="width:80px; height:80px; object-fit:cover;" />
                <div>
                    <h4 style="margin-bottom:5px;">${item.title}</h4>
                    <p style="margin-bottom:5px;">Color: ${item.color}</p>
                    <p style="margin-bottom:5px;">Quantity: ${item.quantity}</p>
                    <p>Item-Price: $${item.price}</p>
                </div>
            </div>
            <button class="delete-btn" data-index="${index}" title="حذف العنصر" style="background:none; border:none; cursor:pointer; font-size:20px; color:#c00;">🗑️</button>
        `;

        container.appendChild(itemDiv);
    });

    // عرض الإجمالي الكلي تحت العناصر
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalDiv = document.createElement("div");
    totalDiv.style.marginTop = "20px";
    totalDiv.style.fontWeight = "bold";
    totalDiv.style.fontSize = "18px";
    totalDiv.style.color = "#fff";
    totalDiv.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
    const btn = document.createElement("button"); 
    btn.innerText = 'Checkout';
    btn.classList.add('checkout-z');
    
    container.appendChild(totalDiv);
    container.appendChild(btn);

    // إضافة حدث حذف
    container.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            const index = e.currentTarget.dataset.index;
            removeItemFromCart(index);
        });
    });
}

function removeItemFromCart(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1); // حذف المنتج من المصفوفة
    localStorage.setItem("cart", JSON.stringify(cart)); // تحديث localStorage
    displayCartItems(); // إعادة عرض السلة بعد الحذف
    updateSummary(); // تحديث ملخص الطلب
}

function updateSummary() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    const subtotalElement = document.querySelector(".summary-row:first-child .price");
    const totalElement = document.querySelector(".summary-row.total .price");
    
    if (subtotalElement && totalElement) {
        subtotalElement.textContent = `$${totalPrice.toFixed(2)}`;
        totalElement.textContent = `$${totalPrice.toFixed(2)}`;
    }
}

window.addEventListener("DOMContentLoaded", () => {
    displayCartItems();
    updateSummary();
});
