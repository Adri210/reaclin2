import express from 'express';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { db } from '../firebaseConection.js'; // Importar a configuração do Firebase
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc
} from 'firebase/firestore'; // Importar funções do Firestore


const app = express();
const PORT = process.env.PORT || 5000;

// Configurações de cookies e sessão
app.use(cookieParser());
app.use(
  session({
    secret: 'seuSegredoSuperSecreto', // Use uma string complexa em produção
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60, 
      httpOnly: true, // Protege contra ataques XSS
      secure: process.env.NODE_ENV === 'production', // Configura para HTTPS em produção
    },
  })
);

// Configurações de CORS
app.use(cors({
  origin: 'http://localhost:3000', // Ajuste para o domínio correto
  credentials: true,
}));
app.use(express.json());


app.post('/login', (req, res) => {
  const { userId, password } = req.body; // Use o email e a senha
  if (userId && password) {
      req.session.userId = userId; // Salva o ID do usuário na sessão
      res.json({ message: 'Login bem-sucedido' });
  } else {
      res.status(400).json({ message: 'ID de usuário ou senha não fornecidos' });
  }
});


// Rota de logout para encerrar a sessão
app.post('/logout', (req, res) => {
  console.log('Logout solicitado'); // Log para depuração
  req.session.destroy(() => {
    res.clearCookie('connect.sid'); // Limpa o cookie de sessão
    res.json({ message: 'Logout bem-sucedido' });
  });
});

// Rota para listar prontuários (autenticada)
app.get('/prontuarios',  async (req, res) => {
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

// Rota para listar estagiários
app.get('/estagiarios', async (req, res) => {
  try {
    const estagiariosCol = collection(db, 'estagiarios');
    const estagiariosSnapshot = await getDocs(estagiariosCol);
    const estagiariosList = estagiariosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(estagiariosList); // Verificar os dados retornados
    res.json(estagiariosList);
  } catch (error) {
    console.error('Erro ao listar estagiários:', error);
    res.status(500).json({ message: 'Erro ao listar estagiários' });
  }
});

// Rota para adicionar estagiário
app.post('/estagiarios', async (req, res) => {
  try {
    const { nome, area, turno, horario } = req.body;
    if (!nome || !area || !turno || !horario) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }
    const newEstagiario = { nome, area, turno, horario };
    const docRef = await addDoc(collection(db, 'estagiarios'), newEstagiario);
    res.status(201).json({ id: docRef.id, ...newEstagiario });
  } catch (error) {
    console.error('Erro ao criar estagiário:', error);
    res.status(500).json({ message: 'Erro ao criar estagiário' });
  }
});

// Rota para atualizar estagiário
app.put('/estagiarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, area, turno, horario } = req.body;
    await updateDoc(doc(db, 'estagiarios', id), { nome, area, turno, horario });
    res.sendStatus(204);
  } catch (error) {
    console.error('Erro ao atualizar estagiário:', error);
    res.status(500).json({ message: 'Erro ao atualizar estagiário' });
  }
});

// Rota para deletar estagiário
app.delete('/estagiarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteDoc(doc(db, 'estagiarios', id));
    res.sendStatus(204); // No Content
  } catch (error) {
    console.error('Erro ao deletar estagiário:', error);
    res.status(500).json({ message: 'Erro ao deletar estagiário' });
  }
});

// Rota para adicionar prontuário
app.post('/prontuarios',  async (req, res) => {
  console.log('Dados recebidos para adicionar prontuário:', req.body);
  try {
    const { nomePaciente, numero, status, data } = req.body;

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

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});