import React, { useState, useEffect } from 'react';

const AdicionarProntuario = ({ adicionarProntuario, prontuarioParaEditar, setProntuarioParaEditar, handleCancel }) => {
    const [nome, setNome] = useState('');
    const [numero, setNumero] = useState('');
    const [status, setStatus] = useState('');
    const [data, setData] = useState('');

    useEffect(() => {
        if (prontuarioParaEditar) {
            setNome(prontuarioParaEditar.nome);
            setNumero(prontuarioParaEditar.numero);
            setStatus(prontuarioParaEditar.status);
            setData(prontuarioParaEditar.data);
        } else {
            resetForm();
        }
    }, [prontuarioParaEditar]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const novoProntuario = {
            nomePaciente: nome.trim() || 'Nome não informado', // Garante que 'nome' não seja vazio
            numero: numero.trim() || 'Número não informado', // Garante que 'numero' não seja vazio
            status: status.trim() || 'Status não informado', // Garante que 'status' não seja vazio
            data: data || new Date().toISOString().split('T')[0] // Garante que 'data' não seja vazia
        };

        console.log('Novo prontuário:', novoProntuario); // Log para verificar o objeto

        try {
            await adicionarProntuario(novoProntuario, prontuarioParaEditar ? prontuarioParaEditar.id : null);
            resetForm();
        } catch (error) {
            alert(`Erro: ${error.message}`); // Alerta para mostrar erro
        }
    };

    const resetForm = () => {
        setNome('');
        setNumero('');
        setStatus('');
        setData('');
        setProntuarioParaEditar(null);
    };

    return (
        <form onSubmit={handleSubmit} className="form-prontuario">
            <input 
                type="text" 
                placeholder="Nome do Paciente" 
                value={nome} 
                onChange={(e) => setNome(e.target.value)} 
                required 
            />
            <input 
                type="text" 
                placeholder="Número" 
                value={numero} 
                onChange={(e) => setNumero(e.target.value)} 
                required 
            />
            <input 
                type="text" 
                placeholder="Status" 
                value={status} 
                onChange={(e) => setStatus(e.target.value)} 
                required 
            />
            <input 
                type="date" 
                placeholder="Data" 
                value={data} 
                onChange={(e) => setData(e.target.value)} 
                required 
            />
            <button type="submit" className="btn-submit">Salvar</button>
            <button type="button" onClick={handleCancel} className="btn-cancel">Cancelar</button>
        </form>
    );
};

export default AdicionarProntuario;
