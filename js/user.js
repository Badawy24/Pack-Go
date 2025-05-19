import { auth } from './firebase-config.js';
import { onAuthStateChanged, updateEmail, updatePassword } from "firebase/auth";

const userProfilePic = document.getElementById('user-profile-pic');
const userDisplayName = document.getElementById('user-display-name');
const userEmailForm = document.getElementById('user-email-form');
const userEmailInput = document.getElementById('user-email');
const userPasswordForm = document.getElementById('user-password-form');
const userPasswordInput = document.getElementById('user-password');
const userMessage = document.getElementById('user-message');

let currentUser = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        userProfilePic.src = user.photoURL ? user.photoURL : 'img/default-user-icon.png';
        userDisplayName.textContent = user.displayName || user.email;
        userEmailInput.value = user.email;
    } else {
        // Not logged in, redirect to login
        window.location.href = "auth/loginForm.html";
    }
});

userEmailForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
        await updateEmail(currentUser, userEmailInput.value);
        userMessage.textContent = "Email updated successfully!";
    } catch (error) {
        userMessage.textContent = error.message;
    }
});

userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
        await updatePassword(currentUser, userPasswordInput.value);
        userMessage.textContent = "Password updated successfully!";
        userPasswordInput.value = '';
    } catch (error) {
        userMessage.textContent = error.message;
    }
});