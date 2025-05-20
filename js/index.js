import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "firebase/auth";

const logoutBtn = document.getElementById('logout-btn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await signOut(auth);
        window.location.reload();
    });
}

onAuthStateChanged(auth, (user) => {
    console.log('Auth state changed:', user); // Debug: log user object

    const userIcon = document.getElementById('user-icon');
    const loginText = document.getElementById('login-text');
    const userLink = document.getElementById('user-link');

    console.log('userIcon:', userIcon, 'loginText:', loginText, 'userLink:', userLink); // Debug: log elements

    if (user && userIcon && loginText && userLink) {
        console.log('Photo URL:', user.photoURL); // Debug: log photo URL
        console.log('Display Name:', user.displayName); // Debug: log display name

        userIcon.src = user.photoURL ? user.photoURL : 'img/default-user-icon.png';
        loginText.textContent = (user.displayName || user.email || "Log in").split(' ')[0];
        userLink.href = "user.html";
        if (logoutBtn) logoutBtn.style.display = 'inline';
    } else if (userIcon && loginText && userLink) {
        //userIcon.src = 'img/default-user-icon.png';
        loginText.textContent = "Log in";
        userLink.href = "auth/loginForm.html";
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
});