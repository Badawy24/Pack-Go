//untracked
//this file is used to manage user data in Firebase Firestore and store 
// it to be easier to access and deal with

import { db } from './firebase-config.js';
import { doc, setDoc, getDoc } from 'firebase/firestore';

class UserDataService {
    constructor() {
        this.currentUser = null;
        this.userData = null;
    }

    setCurrentUser(user) {
        if (user) {
            this.currentUser = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified,
                createdAt: user.metadata?.creationTime
            };
            console.log('Current user data:', this.currentUser);
            return this.currentUser;
        }
        this.currentUser = null;
        return null;
    }

    async saveUserData(userId, userData) {
        try {
            await setDoc(doc(db, 'users', userId), {
                ...userData,
                updatedAt: new Date().toISOString()
            }, { merge: true });
            this.userData = userData;
            console.log('Saved user data:', this.userData);
        } catch (error) {
            console.error('Error saving user data:', error);
            throw error;
        }
    }

    async getUserData(userId) {
        try {
            const docRef = doc(db, 'users', userId);
            const docSnap = await getDoc(docRef);
            this.userData = docSnap.exists() ? docSnap.data() : null;
            console.log('Retrieved user data:', this.userData);
            return this.userData;
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
    }

    getCurrentUserData() {
        return {
            user: this.currentUser,
            userData: this.userData
        };
    }
}

export const userDataService = new UserDataService();


//to use anywhere in the app
export function getCurrentUserUid() {
    return userDataService.currentUser ? userDataService.currentUser.uid : null;
}

