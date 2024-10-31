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
import path from 'path';

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
      maxAge: 1000 * 60 * 60, // 1 hora
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

// Middleware para verificar se o usuário está autenticado
function verificaAutenticacao(req, res, next) {
  if (req.session.userId) {
    next(); // Usuário autenticado, prossiga com a rota
  } else {
    res.status(401).json({ message: 'Usuário não autenticado' });
  }
}

// Rota de login que inicia a sessão
app.post('/login', (req, res) => {
  const { userId } = req.body; // Obtenha o ID do usuário enviado no corpo da requisição
  if (userId) {
    req.session.userId = userId; // Salva o ID do usuário na sessão
    res.json({ message: 'Login bem-sucedido' });
  } else {
    res.status(400).json({ message: 'ID de usuário não fornecido' });
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
app.get('/prontuarios', verificaAutenticacao, async (req, res) => {
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

// Rota para servir o arquivo de estagiários
app.get('/estagiarios', verificaAutenticacao, (req, res) => {
  res.sendFile(path.join(__dirname, 'Estagiarios.js'));
});

// Rota para adicionar prontuário
app.post('/prontuarios', verificaAutenticacao, async (req, res) => {
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
app.put('/prontuarios/:id', verificaAutenticacao, async (req, res) => {
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
app.delete('/prontuarios/:id', verificaAutenticacao, async (req, res) => {
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
