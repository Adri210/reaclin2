import React, { useState, useEffect } from 'react';
import Sidebar from '../componentes/sidebar.js';
import Header from '../componentes/Header.js';
import '../styles/index.css'; 
import AdicionarProntuario from './adicionarProntuario.js'; 
import '../styles/prontuario.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Prontuario = () => {
  const [prontuarios, setProntuarios] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [prontuarioParaEditar, setProntuarioParaEditar] = useState(null);

  const loadProntuarios = async () => {
    try {
      const response = await fetch('http://localhost:5000/prontuarios', {
        credentials: 'include',
      });
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
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prontuario),
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar prontuário');
      }
      await loadProntuarios();
      setShowForm(false);
      setProntuarioParaEditar(null);
    } catch (error) {
      console.error('Erro ao adicionar prontuário:', error);
    }
  };

  const editarProntuario = (prontuario) => {
    setProntuarioParaEditar(prontuario);
    setShowForm(true);
  };

  const excluirProntuario = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/prontuarios/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar prontuário');
      }
      await loadProntuarios();
    } catch (error) {
      console.error('Erro ao excluir prontuário:', error);
    }
  };

  return (
    <div className='container-prontuario'>
      <Sidebar />
      <div>
        <Header />
        <div>
          <div>
            <div className='titulo'><h1>Prontuários</h1></div>
            <button className='botao-adicionar' onClick={() => setShowForm(true)}>Adicionar Prontuário</button>
            {showForm && (
              <AdicionarProntuario
                prontuario={prontuarioParaEditar}
                adicionarProntuario={adicionarProntuario}
                setShowForm={setShowForm}
              />
            )}
            <div className='lista-e'><h3>Lista de Prontuários</h3></div>
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
                      <button className='botao-editar' onClick={() => editarProntuario(prontuario)}>Editar</button>
                      <button className='botao-editar' onClick={() => excluirProntuario(prontuario.id)}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prontuario;
