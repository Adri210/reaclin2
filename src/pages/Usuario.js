import React, { useContext, useState, useEffect } from 'react';
import '../styles/index.css';
import Sidebar from '../componentes/sidebar.js';
import Header from '../componentes/Header.js';
import '../styles/usuario.css'; 
import perfil from '../imagens/perfil.png';
import { AuthContext } from '../contexts/auth.js';
import 'bootstrap/dist/css/bootstrap.min.css';

const Usuario = () => {
  const { user, updateUserProfile, fetchUsers, deleteUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para controle de loading

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const userList = await fetchUsers();
        setUsers(userList);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      } finally {
        setLoading(false); // Finaliza o loading
      }
    };

    loadUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!name || !email) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const profileData = {
      displayName: name,
      email,
      birthDate,
      phone,
      role,
    };

    try {
      if (editingUserId) {
        await updateUserProfile(profileData, editingUserId);
        alert('Perfil atualizado com sucesso!');
      } else {
        await updateUserProfile(profileData);
        alert('Usuário cadastrado com sucesso!');
      }

      // Limpa os campos após o salvamento
      setEditingUserId(null);
      setName('');
      setSurname('');
      setEmail('');
      setBirthDate('');
      setPhone('');
      setRole('');

      // Atualiza a lista de usuários
      const userList = await fetchUsers();
      setUsers(userList);
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      alert('Ocorreu um erro ao salvar. Tente novamente.');
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setName(user.displayName);
    setEmail(user.email);
    setBirthDate(user.birthDate);
    setPhone(user.phone);
    setRole(user.role);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await deleteUser(id);
        alert('Usuário excluído com sucesso!');
        const userList = await fetchUsers();
        setUsers(userList);
      } catch (error) {
        console.error("Erro ao deletar usuário:", error);
        alert('Ocorreu um erro ao excluir. Tente novamente.');
      }
    }
  };

  if (loading) {
    return <p>Carregando usuários...</p>; // Mensagem de loading
  }

  return (
    <div className="row">
      <Sidebar />
      <div className="col cadastro">
        <Header />
        <div className="cadastro-dois">
          <div>
            <h3 id="titulo-dois">Gerenciar Funcionários</h3>
            <div className="img-perfil">
              <img src={perfil} alt="Foto de Perfil" />
              <br />
              <p className="m-0">Foto de Perfil</p>
            </div>
          </div>

          <div className="row">
            <li className="lista-form col-md-6 col-sm-12">
              <span>Nome</span>
              <br />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </li>

            <li className="lista-form col-md-6 col-sm-12">
              <span>Sobrenome</span>
              <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} />
            </li>

            <li className="lista-form col-md-6 col-sm-12">
              <span>Email</span>
              <br />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </li>

            <li className="lista-form col-md-6 col-sm-12">
              <span>Data de nascimento</span>
              <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
            </li>

            <li className="lista-form col-md-6 col-sm-12">
              <span>Celular</span>
              <br />
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </li>

            <li className="lista-form col-md-6 col-sm-12">
              <span>Função</span>
              <br />
              <input type="text" value={role} onChange={(e) => setRole(e.target.value)} />
            </li>
          </div>

          <button id="botao-salvar" onClick={handleSave}>Salvar</button>

          <h3>Lista de Funcionários</h3>
          <ul>
            {users.length > 0 ? users.map((user) => (
              <li key={user.id}>
                {user.displayName} - {user.email} 
                <button onClick={() => handleEdit(user)}>Editar</button>
                <button onClick={() => handleDelete(user.id)}>Excluir</button>
              </li>
            )) : <p>Nenhum funcionário cadastrado.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Usuario;
