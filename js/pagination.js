const itemsPerPage = 8;
let currentPage = 1;

export function paginateProducts() {
    const allProducts = Array.from(document.querySelectorAll('#shop-body-B .product-card-m'));
    const totalPages = Math.ceil(allProducts.length / itemsPerPage);
    const paginationContainer = document.getElementById('pagination-b');

    function renderPage(page) {
        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;
        currentPage = page;

        allProducts.forEach((el, index) => {
            el.style.display = (index >= (page - 1) * itemsPerPage && index < page * itemsPerPage) ? "block" : "none";
        });

        paginationContainer.innerHTML = '';

        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = '<i class="fas fa-backward"></i>';
        prevBtn.disabled = (currentPage === 1);
        prevBtn.addEventListener('click', () => renderPage(currentPage - 1));
        paginationContainer.appendChild(prevBtn);

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.innerText = i;
            if (i === page) btn.classList.add("active");
            btn.addEventListener('click', () => renderPage(i));
            paginationContainer.appendChild(btn);
        }

        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = '<i class="fas fa-forward"></i>';
        nextBtn.disabled = (currentPage === totalPages);
        nextBtn.addEventListener('click', () => renderPage(currentPage + 1));
        paginationContainer.appendChild(nextBtn);
    }

    renderPage(currentPage);
}

document.addEventListener("DOMContentLoaded", () => {
    const observer = new MutationObserver(() => {
        const products = document.querySelectorAll('#shop-body-B .product-card-m');
        if (products.length > 0) {
            paginateProducts();
            observer.disconnect();
        }
    });

    observer.observe(document.getElementById('shop-body-B'), { childList: true, subtree: true });
});

