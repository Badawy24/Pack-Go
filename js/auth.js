import { auth } from './firebase-config.js';
import { 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";

const updateUserUI = (user) => {
    const userIcon = document.getElementById('user-icon');
    const loginText = document.getElementById('login-text');
    if (userIcon && loginText) {
        // Set user photo or fallback to default icon
        userIcon.src = user.photoURL || 'default-user-icon.png'; // Use your default icon path
        // Set first name or email as fallback
        loginText.textContent = user.displayName ? user.displayName.split(' ')[0] : user.email;
    }
};

// Email/Password Sign In
const handleEmailSignIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        updateUserUI(userCredential.user);
        console.log("User signed in successfully");
        window.location.href = '../index.html';
    } catch (error) {
        alert(error.message);
    }
};

// Google Sign In
const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        updateUserUI(result.user);
        console.log("User signed in successfully");
        window.location.href = '../index.html';
    } catch (error) {
        alert(error.message);
    }
};

// Email/Password Sign Up
const handleEmailSignUp = async (email, password, confirmPassword) => {
    if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
    }

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        window.location.href = '../index.html';
    } catch (error) {
        alert(error.message);
    }
};

// Google Sign Up
const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        window.location.href = '../index.html';
    } catch (error) {
        alert(error.message);
    }
};

// Initialize login form
export const initLoginForm = () => {
    const loginForm = document.getElementById('login-form');
    const googleSignInBtn = document.getElementById('google-signin');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            await handleEmailSignIn(email, password);
        });
    }

    if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', handleGoogleSignIn);
    }
};

// Initialize signup form
export const initSignupForm = () => {
    const signupForm = document.getElementById('signup-form');
    const googleSignupBtn = document.getElementById('google-signup');

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            await handleEmailSignUp(email, password, confirmPassword);
        });
    }

    if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', handleGoogleSignUp);
    }
};