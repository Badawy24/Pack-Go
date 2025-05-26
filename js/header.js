let navbar = document.querySelector('.navbar')
document.querySelector('#menu-btn').onclick = () => {
    navbar.classList.toggle('active')
    searchform.classList.remove('active')
    cart.classList.remove('active')
}
let searchform = document.querySelector('.search-form');
document.querySelector('.fa-search').onclick = () => {
    searchform.classList.toggle('active')
    navbar.classList.remove('active')
    cart.classList.remove('active')
}

let cart = document.querySelector('.cart-item-container')
document.querySelector('.fa-shopping-cart').onclick = () => {
    cart.classList.toggle('active')
    navbar.classList.remove('active')
    searchform.classList.remove('active')
}

window.onscroll = () => {
    navbar.classList.remove('active')
    searchform.classList.remove('active')
    cart.classList.remove('active')
}

document.addEventListener('DOMContentLoaded', () => {
    const userContainer = document.querySelector('.user-container');
    const userMenu = document.querySelector('.user-menu');
    const userLink = document.getElementById('user-link');
    const loginText = document.getElementById('login-text');
    let timeoutId;

    // Show dropdown on hover
    userContainer.addEventListener('mouseenter', () => {
        if (loginText.textContent !== 'Log in') {
            clearTimeout(timeoutId);
            userMenu.classList.add('active');
        }
    });

    // Hide dropdown when mouse leaves
    userContainer.addEventListener('mouseleave', () => {
        timeoutId = setTimeout(() => {
            userMenu.classList.remove('active');
        }, 100); // Small delay to prevent flickering
    });

    // Prevent default link behavior when logged in
    userLink.addEventListener('click', (e) => {
        if (loginText.textContent !== 'Log in') {
            e.preventDefault();
        }
    });
});
