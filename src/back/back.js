import express from 'express';
import cors from 'cors';
import { db } from '../firebaseConection.js'; // Importar a configuração do Firebase
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore'; // Importar funções do Firestore

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Rota para listar prontuários
app.get('/prontuarios', async (req, res) => {
    try {
        const prontuariosCol = collection(db, 'prontuarios');
        const prontuariosSnapshot = await getDocs(prontuariosCol);
        const prontuariosList = prontuariosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(prontuariosList);
    } catch (error) {
        console.error('Erro ao listar prontuários:', error);
        res.status(500).json({ message: 'Erro ao listar prontuários' });
    }
});

// Rota para adicionar prontuário
app.post('/prontuarios', async (req, res) => {
    try {
        const { nomePaciente, numero, status, data } = req.body;

        // Validação dos dados
        if (!nomePaciente || !numero || !status || !data) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
        }

        const docRef = await addDoc(collection(db, 'prontuarios'), { nomePaciente, numero, status, data });
        res.status(201).json({ id: docRef.id, nomePaciente, numero, status, data });
    } catch (error) {
        console.error('Erro ao adicionar prontuário:', error);
        res.status(500).json({ message: 'Erro ao adicionar prontuário' });
    }
});

// Rota para atualizar prontuário
app.put('/prontuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { nomePaciente, numero, status, data } = req.body;

    try {
        const docRef = doc(db, 'prontuarios', id);
        await updateDoc(docRef, { nomePaciente, numero, status, data });
        res.status(200).json({ message: 'Prontuário atualizado' });
    } catch (error) {
        console.error('Erro ao atualizar prontuário:', error);
        res.status(500).json({ message: 'Erro ao atualizar prontuário' });
    }
});

// Rota para deletar prontuário
app.delete('/prontuarios/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await deleteDoc(doc(db, 'prontuarios', id));
        res.status(200).json({ message: 'Prontuário deletado' });
    } catch (error) {
        console.error('Erro ao deletar prontuário:', error);
        res.status(500).json({ message: 'Erro ao deletar prontuário' });
    }
});

// Iniciando o servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
