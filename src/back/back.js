import express from 'express';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { db } from '../firebaseConection.js'; 
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc
} from 'firebase/firestore'; 

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cookieParser());
app.use(
  session({
    secret: 'seuSegredoSuperSecreto',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60, 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
    },
  })
);


app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,
}));
app.use(express.json());


app.post('/login', (req, res) => {
  const { userId, password } = req.body;
  if (userId && password) {
      req.session.userId = userId;
      res.json({ message: 'Login bem-sucedido' });
  } else {
      res.status(400).json({ message: 'ID de usuário ou senha não fornecidos' });
  }
});



app.post('/logout', (req, res) => {
  console.log('Logout solicitado');
  req.session.destroy(() => {
    res.clearCookie('connect.sid'); 
    res.json({ message: 'Logout bem-sucedido' });
  });
});




app.get('/estagiarios', async (req, res) => {
  try {
    const estagiariosCol = collection(db, 'estagiarios');
    const estagiariosSnapshot = await getDocs(estagiariosCol);
    const estagiariosList = estagiariosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(estagiariosList);
    res.json(estagiariosList);
  } catch (error) {
    console.error('Erro ao listar estagiários:', error);
    res.status(500).json({ message: 'Erro ao listar estagiários' });
  }
});

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

app.delete('/estagiarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteDoc(doc(db, 'estagiarios', id));
    res.sendStatus(204);
  } catch (error) {
    console.error('Erro ao deletar estagiário:', error);
    res.status(500).json({ message: 'Erro ao deletar estagiário' });
  }
});


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


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});