// src/adicionar2.js
import React, { useState, useEffect } from 'react';

const AdicionarEstagiario = ({ adicionarEstagiario, estagiarioParaEditar, setEstagiarioParaEditar, handleCancel }) => {
  const [nome, setNome] = useState('');
  const [area, setArea] = useState('');
  const [turno, setTurno] = useState('');
  const [horario, setHorario] = useState('');

  useEffect(() => {
    if (estagiarioParaEditar) {
      setNome(estagiarioParaEditar.nome);
      setArea(estagiarioParaEditar.area);
      setTurno(estagiarioParaEditar.turno);
      setHorario(estagiarioParaEditar.horario);
    } else {
      resetForm();
    }
  }, [estagiarioParaEditar]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const novoEstagiario = { nome, area, turno, horario };
    if (estagiarioParaEditar) {
      adicionarEstagiario(novoEstagiario, estagiarioParaEditar.id);
    } else {
      adicionarEstagiario(novoEstagiario);
    }
    resetForm();
  };

  const resetForm = () => {
    setNome('');
    setArea('');
    setTurno('');
    setHorario('');
    setEstagiarioParaEditar(null);
  };

  return (
    <form onSubmit={handleSubmit} className="form-estagiario">
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Área"
        value={area}
        onChange={(e) => setArea(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Turno"
        value={turno}
        onChange={(e) => setTurno(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Horário"
        value={horario}
        onChange={(e) => setHorario(e.target.value)}
        required
      />
      <button type="submit" className="btn-submit">Salvar</button>
      <button type="button" onClick={handleCancel} className="btn-cancel">Cancelar</button>
    </form>
  );
};

export default AdicionarEstagiario;
