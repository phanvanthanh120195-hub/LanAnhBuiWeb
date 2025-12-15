import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    setDoc,
    deleteDoc,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const firestoreService = {
    // Get all documents from a collection
    getAll: async (collectionName: string) => {
        try {
            const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            return { data, error: null };
        } catch (error: any) {
            return { data: null, error: error.message };
        }
    },

    // Get a single document
    getOne: async (collectionName: string, id: string) => {
        try {
            const docRef = doc(db, collectionName, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { data: { id: docSnap.id, ...docSnap.data() }, error: null };
            } else {
                return { data: null, error: 'Document not found' };
            }
        } catch (error: any) {
            return { data: null, error: error.message };
        }
    },

    // Add a new document
    add: async (collectionName: string, data: any) => {
        try {
            const docRef = await addDoc(collection(db, collectionName), {
                ...data,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            return { id: docRef.id, error: null };
        } catch (error: any) {
            return { id: null, error: error.message };
        }
    },

    // Update a document
    update: async (collectionName: string, id: string, data: any) => {
        try {
            const docRef = doc(db, collectionName, id);
            await updateDoc(docRef, {
                ...data,
                updatedAt: new Date().toISOString()
            });
            return { error: null };
        } catch (error: any) {
            return { error: error.message };
        }
    },

    // Set a document with a specific ID (create or update)
    set: async (collectionName: string, id: string, data: any) => {
        try {
            const docRef = doc(db, collectionName, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // Update existing document
                await updateDoc(docRef, {
                    ...data,
                    updatedAt: new Date().toISOString()
                });
            } else {
                // Create new document with specific ID using setDoc
                await setDoc(docRef, {
                    ...data,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
            }
            return { error: null };
        } catch (error: any) {
            return { error: error.message };
        }
    },

    // Delete a document
    delete: async (collectionName: string, id: string) => {
        try {
            await deleteDoc(doc(db, collectionName, id));
            return { error: null };
        } catch (error: any) {
            return { error: error.message };
        }
    }
};
