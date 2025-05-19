import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "firebase/auth";

const logoutBtn = document.getElementById('logout-btn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await signOut(auth);
        // Optionally, redirect or reload
        window.location.reload();
    });
}

onAuthStateChanged(auth, (user) => {
    const userIcon = document.getElementById('user-icon');
    const loginText = document.getElementById('login-text');
    const userLink = document.getElementById('user-link');
    if (user && userIcon && loginText && userLink) {
        userIcon.src = user.photoURL ? user.photoURL : 'img/default-user-icon.png';
        loginText.textContent = (user.displayName || user.email || "Log in").split(' ')[0];
        userLink.href = "user.html"; // Redirect to user info page
        if (logoutBtn) logoutBtn.style.display = 'inline';
    } else if (userIcon && loginText && userLink) {
        userIcon.src = 'img/default-user-icon.png';
        loginText.textContent = "Log in";
        userLink.href = "auth/loginForm.html"; // Redirect to login page
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
});