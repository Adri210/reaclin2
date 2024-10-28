// src/Estagiario.js
import React, { useState, useEffect } from 'react';
import Sidebar from '../componentes/sidebar.js';
import Header from '../componentes/Header.js';
import AdicionarEstagiario from './adicionar2.js';
import '../styles/estagiario.css';

const Estagiario = () => {
  const [estagiarios, setEstagiarios] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [estagiarioParaEditar, setEstagiarioParaEditar] = useState(null);

  // Função para carregar os estagiários do banco de dados
  const loadEstagiarios = async () => {
    try {
      const response = await fetch('http://localhost:5000/estagiarios');
      if (!response.ok) {
        throw new Error('Erro ao carregar estagiários');
      }
      const data = await response.json();
      console.log(data); // Verificar os dados retornados
      setEstagiarios(data);
    } catch (error) {
      console.error('Erro ao carregar estagiários:', error);
    }
  };

  useEffect(() => {
    loadEstagiarios();
  }, []);

  const adicionarEstagiario = async (estagiario, id = null) => {
    try {
      const method = id ? 'PUT' : 'POST';
      const url = id ? `http://localhost:5000/estagiarios/${id}` : 'http://localhost:5000/estagiarios';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(estagiario),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Obter mensagem de erro da resposta
        throw new Error(`Erro ao adicionar/atualizar estagiário: ${errorData.message}`);
      }

      await loadEstagiarios();
      setShowForm(false);
      setEstagiarioParaEditar(null);
    } catch (error) {
      console.error('Erro ao adicionar/atualizar estagiário:', error);
    }
  };

  const handleEdit = (estagiario) => {
    setEstagiarioParaEditar(estagiario);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/estagiarios/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Erro ao deletar estagiário');
      }
      loadEstagiarios();
    } catch (error) {
      console.error('Erro ao deletar estagiário:', error);
    }
  };

  const handleAddEstagiario = () => {
    setEstagiarioParaEditar(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEstagiarioParaEditar(null);
  };

  return (
    <div className='app'>
      <Sidebar />
      <div className='main-content'>
        <Header />
        <div className='container'>
          <h1>Lista de Estagiários</h1>
          <button onClick={handleAddEstagiario} className="btn-add">Adicionar Estagiário</button>
          {showForm && (
            <AdicionarEstagiario
              adicionarEstagiario={adicionarEstagiario}
              estagiarioParaEditar={estagiarioParaEditar}
              setEstagiarioParaEditar={setEstagiarioParaEditar}
              handleCancel={handleCancel}
            />
          )}
          <table className='estagiario-table'>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Área</th>
                <th>Turno</th>
                <th>Horário</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(estagiarios) && estagiarios.map((estagiario) => (
                <tr key={estagiario.id}>
                  <td>{estagiario.nome}</td>
                  <td>{estagiario.area}</td>
                  <td>{estagiario.turno}</td>
                  <td>{estagiario.horario}</td>
                  <td>
                    <button onClick={() => handleEdit(estagiario)}>Editar</button>
                    <button onClick={() => handleDelete(estagiario.id)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Estagiario;

