export function showInvoicePopup(orderData) {
    document.getElementById("invName").textContent = orderData.payerName;
    document.getElementById("invEmail").textContent = orderData.payerEmail;
    document.getElementById("invTransactionId").textContent = orderData.transactionId;

    let date = new Date();
    if (orderData.createdAt && typeof orderData.createdAt.toDate === "function") {
        date = orderData.createdAt.toDate();
    }
    document.getElementById("invDate").textContent = date.toLocaleString();

    document.getElementById("invAmount").textContent = orderData.paidAmount;
    document.getElementById("invCurrency").textContent = orderData.currency;

    // بناء صفوف المنتجات في الجدول
    const tbody = document.getElementById("productRows");
    tbody.innerHTML = "";

    orderData.products.forEach(product => {
        const row = document.createElement("tr");

        const titleCell = document.createElement("td");
        titleCell.textContent = product.title;
        row.appendChild(titleCell);

        const qtyCell = document.createElement("td");
        qtyCell.textContent = product.quantity;
        row.appendChild(qtyCell);

        const priceCell = document.createElement("td");
        priceCell.textContent = `$${product.price.toFixed(2)}`;
        row.appendChild(priceCell);

        const totalCell = document.createElement("td");
        totalCell.textContent = `$${(product.price * product.quantity).toFixed(2)}`;
        row.appendChild(totalCell);

        tbody.appendChild(row);
    });

    document.getElementById("invoicePopup").style.display = "flex";
}
