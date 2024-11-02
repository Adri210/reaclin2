import React, { useEffect, useState } from 'react';

const AdicionarProntuario = ({ prontuario, adicionarProntuario, setShowForm }) => {
  const [nomePaciente, setNomePaciente] = useState('');
  const [numero, setNumero] = useState('');
  const [status, setStatus] = useState('');
  const [data, setData] = useState('');

  useEffect(() => {
    if (prontuario) {
      setNomePaciente(prontuario.nomePaciente);
      setNumero(prontuario.numero);
      setStatus(prontuario.status);
      setData(prontuario.data);
    } else {
      setNomePaciente('');
      setNumero('');
      setStatus('');
      setData('');
    }
  }, [prontuario]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const prontuarioData = { nomePaciente, numero, status, data };
    adicionarProntuario(prontuarioData, prontuario ? prontuario.id : null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input className='input-containerE input-textE'
        type="text"
        placeholder="Nome do Paciente"
        value={nomePaciente}
        onChange={(e) => setNomePaciente(e.target.value)}
        required
      />
      <input className='input-containerE input-textE'
        type="text"
        placeholder="Número"
        value={numero}
        onChange={(e) => setNumero(e.target.value)}
        required
      />
      <input className='input-containerE input-textE'
        type="text"
        placeholder="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        required
      />
      <input className='input-containerE input-textE'
        type="date"
        value={data}
        onChange={(e) => setData(e.target.value)}
        required
      />
      <br></br>
      <button className='botao-editarE' type="submit">{prontuario ? 'Atualizar' : 'Adicionar'} Prontuário</button>
      <button className='botao-editarE' type="button" onClick={() => setShowForm(false)}>Cancelar</button>
    </form>
  );
};

export default AdicionarProntuario;