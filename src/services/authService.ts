import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export const authService = {
    // Register new user
    register: async (email: string, password: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            return { user: userCredential.user, error: null };
        } catch (error: any) {
            return { user: null, error: error.message };
        }
    },

    // Login user
    login: async (email: string, password: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return { user: userCredential.user, error: null };
        } catch (error: any) {
            return { user: null, error: error.message };
        }
    },

    // Logout user
    logout: async () => {
        try {
            await signOut(auth);
            return { error: null };
        } catch (error: any) {
            return { error: error.message };
        }
    },

    // Get current user
    getCurrentUser: () => {
        return auth.currentUser;
    },

    // Listen to auth state changes
    onAuthStateChange: (callback: (user: User | null) => void) => {
        return onAuthStateChanged(auth, callback);
    }
};
