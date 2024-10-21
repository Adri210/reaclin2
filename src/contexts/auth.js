// auth.js
import React, { createContext, useState } from 'react';
import { auth, db } from '../firebaseConection.js';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const fetchUsers = async () => {
        const usersRef = collection(db, 'users'); // Referenciando a coleção
        const snapshot = await getDocs(usersRef); // Buscando documentos
        const userList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return userList;
    };

    const updateUserProfile = async (profileData, userId) => {
        const usersRef = collection(db, 'users');
        if (userId) {
            const userDoc = doc(usersRef, userId);
            await updateDoc(userDoc, profileData);
        } else {
            await addDoc(usersRef, profileData);
        }
    };

    const deleteUser = async (userId) => {
        const userDoc = doc(db, 'users', userId);
        await deleteDoc(userDoc);
    };

    return (
        <AuthContext.Provider value={{ user, updateUserProfile, fetchUsers, deleteUser }}>
            {children}
        </AuthContext.Provider>
    );
};
