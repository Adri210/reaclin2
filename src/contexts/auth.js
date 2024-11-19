import React, { createContext, useState } from 'react';
import { db } from '../firebaseConection.js'; 
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    
    const fetchUsers = async () => {
        try {
            const usersRef = collection(db, 'users'); 
            const snapshot = await getDocs(usersRef); 
            const userList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return userList;
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
            return [];
        }
    };

    
    const updateUserProfile = async (profileData, userId) => {
        try {
            if (userId) {
                const userDoc = doc(db, 'users', userId); 
                await updateDoc(userDoc, profileData);
                console.log(`Usuário com ID ${userId} atualizado com sucesso!`);
            } else {
                const usersRef = collection(db, 'users'); 
                await addDoc(usersRef, profileData); 
                console.log('Novo usuário criado com sucesso!');
            }
        } catch (error) {
            console.error("Erro ao atualizar ou criar perfil:", error);
        }
    };

    
    const deleteUser = async (userId) => {
        try {
            const userDoc = doc(db, 'users', userId); 
            await deleteDoc(userDoc);
            console.log("Usuário deletado com sucesso!");
        } catch (error) {
            console.error("Erro ao deletar usuário:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, updateUserProfile, fetchUsers, deleteUser }}>
            {children}
        </AuthContext.Provider>
    );
};
