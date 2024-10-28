import React, { useState, useEffect } from 'react';
import Sidebar from '../componentes/sidebar.js';
import Header from '../componentes/Header.js';
import AdicionarProntuario from './adicionarProntuario.js'; // Corrigido o nome do arquivo
import '../styles/prontuario.css';

const Prontuario = () => {
  const [prontuarios, setProntuarios] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [prontuarioParaEditar, setProntuarioParaEditar] = useState(null);

  // Função para carregar os prontuários do banco de dados
  const loadProntuarios = async () => {
    try {
      const response = await fetch('http://localhost:5000/prontuarios');
      if (!response.ok) {
        throw new Error('Erro ao carregar prontuários');
      }
      const data = await response.json();
      setProntuarios(data);
    } catch (error) {
      console.error('Erro ao carregar prontuários:', error);
    }
  };

  useEffect(() => {
    loadProntuarios();
  }, []);

  const adicionarProntuario = async (prontuario, id = null) => {
    try {
      const method = id ? 'PUT' : 'POST';
      const url = id ? `http://localhost:5000/prontuarios/${id}` : 'http://localhost:5000/prontuarios';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prontuario),
      });

      if (!response.ok) {
        const errorData = await response.text(); // Mudança para capturar como texto
        throw new Error(`Erro ao adicionar/atualizar prontuário: ${errorData}`);
      }

      await loadProntuarios();
      setShowForm(false);
      setProntuarioParaEditar(null);
    } catch (error) {
      alert(`Erro: ${error.message}`); // Alerta para mostrar erro
      console.error('Erro ao adicionar/atualizar prontuário:', error);
    }
  };

  const handleEdit = (prontuario) => {
    setProntuarioParaEditar(prontuario);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/prontuarios/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.text(); // Mudança para capturar como texto
        throw new Error(`Erro ao deletar prontuário: ${errorData}`);
      }
      await loadProntuarios();
    } catch (error) {
      alert(`Erro: ${error.message}`); // Alerta para mostrar erro
      console.error('Erro ao deletar prontuário:', error);
    }
  };

  return (
    <div className="prontuario-container">
      <Sidebar />
      <Header />
      <div className="prontuario-content">
        <h1>Prontuários</h1>
        <button onClick={() => setShowForm(true)}>Adicionar Prontuário</button>
        {showForm && (
          <AdicionarProntuario
            adicionarProntuario={adicionarProntuario}
            prontuarioParaEditar={prontuarioParaEditar}
            setProntuarioParaEditar={setProntuarioParaEditar}
            handleCancel={() => setShowForm(false)}
          />
        )}
        <table>
          <thead>
            <tr>
              <th>Nome do Paciente</th>
              <th>Número</th>
              <th>Status</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {prontuarios.map((prontuario) => (
              <tr key={prontuario.id}>
                <td>{prontuario.nomePaciente}</td>
                <td>{prontuario.numero}</td>
                <td>{prontuario.status}</td>
                <td>{prontuario.data}</td>
                <td>
                  <button onClick={() => handleEdit(prontuario)}>Editar</button>
                  <button onClick={() => handleDelete(prontuario.id)}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Prontuario;
