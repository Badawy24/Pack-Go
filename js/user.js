import { auth } from './firebase-config.js';
import { onAuthStateChanged, updateEmail, updatePassword } from "firebase/auth";
import { userDataService } from './userDataService.js';

const userProfilePic = document.getElementById('user-profile-pic');
const userDisplayName = document.getElementById('user-display-name');
const userEmailForm = document.getElementById('user-email-form');
const userEmailInput = document.getElementById('user-email');
const userPasswordForm = document.getElementById('user-password-form');
const userPasswordInput = document.getElementById('user-password');
const userMessage = document.getElementById('user-message');



let currentUser = null;

onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        console.log('Current User:', {
            uid: user.uid,
            email: user.email
        });
        
        const userData = await userDataService.getUserData(user.uid);
        console.log('User Data from Firestore:', userData);

        // Fetch user data
        if (userData) {
            userProfilePic.src = user.photoURL ? user.photoURL : 'img/default-user-icon.png';
            userDisplayName.textContent = userData.displayName || user.email;
            userEmailInput.value = user.email;

        }
    } else {
        window.location.href = "auth/loginForm.html";
    }
});

// Handle email updates
userEmailForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newEmail = userEmailInput.value;
    try {
        await updateEmail(currentUser, newEmail);
        await userDataService.updateUserField(currentUser.uid, 'email', newEmail);
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

// Add event listeners for preference changes
const updatePreferences = async () => {
    if (!currentUser) return;

    try {
        await userDataService.updateUserField(currentUser.uid, 'preferences', {
            theme: themeSelect.value,
            language: langSelect.value,
            notifications: notifToggle.checked
        });
        userMessage.textContent = "Preferences updated successfully!";
    } catch (error) {
        userMessage.textContent = error.message;
    }
};

themeSelect.addEventListener('change', updatePreferences);
langSelect.addEventListener('change', updatePreferences);
notifToggle.addEventListener('change', updatePreferences);