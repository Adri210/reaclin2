import React, { createContext, useState } from 'react';
import { db } from '../firebaseConection.js'; // Certifique-se de que o caminho está correto
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Função para buscar todos os usuários da coleção 'users'
    const fetchUsers = async () => {
        try {
            const usersRef = collection(db, 'users'); // Referenciando a coleção
            const snapshot = await getDocs(usersRef); // Buscando documentos
            const userList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return userList;
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
            return [];
        }
    };

    // Função para criar ou atualizar o perfil de um usuário
    const updateUserProfile = async (profileData, userId) => {
        try {
            if (userId) {
                const userDoc = doc(db, 'users', userId); // Referência ao documento do usuário
                await updateDoc(userDoc, profileData);
                console.log(`Usuário com ID ${userId} atualizado com sucesso!`);
            } else {
                const usersRef = collection(db, 'users'); // Referência à coleção 'users'
                await addDoc(usersRef, profileData); // Adiciona um novo documento
                console.log('Novo usuário criado com sucesso!');
            }
        } catch (error) {
            console.error("Erro ao atualizar ou criar perfil:", error);
        }
    };

    // Função para excluir um usuário da coleção 'users'
    const deleteUser = async (userId) => {
        try {
            const userDoc = doc(db, 'users', userId); // Referência ao documento do usuário
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
