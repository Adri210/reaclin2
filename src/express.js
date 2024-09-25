import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

let appointments = [];

// Rota para adicionar uma consulta
app.post('/api/appointments', (req, res) => {
  const appointment = req.body;
  appointments.push(appointment);
  res.status(201).json(appointment);
});

// Rota para recuperar todas as consultas
app.get('/api/appointments', (req, res) => {
  res.json(appointments);
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
