import React, { useEffect, useState } from 'react';
import '../styles/adicionar.css';

const AdicionarEstagiario = ({ estagiario, adicionarEstagiario, setShowForm }) => {
  const [nome, setNome] = useState('');
  const [area, setArea] = useState('');
  const [turno, setTurno] = useState('');
  const [horario, setHorario] = useState('');

  useEffect(() => {
    if (estagiario) {
      setNome(estagiario.nome);
      setArea(estagiario.area);
      setTurno(estagiario.turno);
      setHorario(estagiario.horario);
    } else {
      setNome('');
      setArea('');
      setTurno('');
      setHorario('');
    }
  }, [estagiario]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const estagiarioData = { nome, area, turno, horario };
    adicionarEstagiario(estagiarioData, estagiario ? estagiario.id : null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input className='input-containerE input-textE'
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />
      <input className='input-containerE input-textE'
        type="text"
        placeholder="Área"
        value={area}
        onChange={(e) => setArea(e.target.value)}
        required
      />
      <input className='input-containerE input-textE'
        type="text"
        placeholder="Turno"
        value={turno}
        onChange={(e) => setTurno(e.target.value)}
        required
      />
      <input className='input-containerE input-textE'
        type="text"
        placeholder="Horário"
        value={horario}
        onChange={(e) => setHorario(e.target.value)}
        required
      />
      <br></br>
      <button className='botao-editarE' type="submit">{estagiario ? 'Atualizar' : 'Adicionar'} Estagiário</button>
      <button className='botao-editarE' type="button" onClick={() => setShowForm(false)}>Cancelar</button>
    </form>
  );
};

export default AdicionarEstagiario;