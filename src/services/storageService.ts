import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export const storageService = {
    // Upload file to Firebase Storage
    uploadFile: async (file: File, path: string) => {
        try {
            const storageRef = ref(storage, path);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return { url: downloadURL, error: null };
        } catch (error: any) {
            return { url: null, error: error.message };
        }
    },

    // Upload image with automatic path generation
    uploadImage: async (file: File, folder: string = 'images') => {
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name}`;
        const path = `${folder}/${fileName}`;
        return storageService.uploadFile(file, path);
    },

    // Delete file from Firebase Storage
    deleteFile: async (fileUrl: string) => {
        try {
            const fileRef = ref(storage, fileUrl);
            await deleteObject(fileRef);
            return { error: null };
        } catch (error: any) {
            return { error: error.message };
        }
    }
};
