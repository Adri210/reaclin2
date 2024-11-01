import React, { useState, useEffect } from 'react';
import Sidebar from '../componentes/sidebar.js';
import Header from '../componentes/Header.js';
import AdicionarEstagiario from './adicionar2.js'; // Corrigido o nome do arquivo
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
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(estagiario),
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar estagiário');
      }
      await loadEstagiarios();
      setShowForm(false);
      setEstagiarioParaEditar(null);
    } catch (error) {
      console.error('Erro ao adicionar estagiário:', error);
    }
  };

  const editarEstagiario = (estagiario) => {
    setEstagiarioParaEditar(estagiario);
    setShowForm(true);
  };

  const excluirEstagiario = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/estagiarios/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar estagiário');
      }
      await loadEstagiarios();
    } catch (error) {
      console.error('Erro ao excluir estagiário:', error);
    }
  };

  return (
    <div className="container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="estagiario-content">
          <h1>Estagiários</h1>
          <button onClick={() => setShowForm(true)}>Adicionar Estagiário</button>
          {showForm && (
            <AdicionarEstagiario
              estagiario={estagiarioParaEditar}
              adicionarEstagiario={adicionarEstagiario}
              setShowForm={setShowForm}
            />
          )}
          <table>
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
              {estagiarios.map((estagiario) => (
                <tr key={estagiario.id}>
                  <td>{estagiario.nome}</td>
                  <td>{estagiario.area}</td>
                  <td>{estagiario.turno}</td>
                  <td>{estagiario.horario}</td>
                  <td>
                    <button onClick={() => editarEstagiario(estagiario)}>Editar</button>
                    <button onClick={() => excluirEstagiario(estagiario.id)}>Excluir</button>
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
