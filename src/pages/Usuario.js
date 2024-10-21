import React, { useContext, useState, useEffect } from 'react';
import '../styles/index.css';
import Sidebar from '../componentes/sidebar.js';
import Header from '../componentes/Header.js';
import '../styles/usuario.css'; 
import perfil from '../imagens/perfil.png';
import { AuthContext } from '../contexts/auth.js'; // Verifique a importação
import 'bootstrap/dist/css/bootstrap.min.css';

const Usuario = () => {
  const { user, updateUserProfile, fetchUsers, deleteUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]); // Estado para a lista de usuários
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [editingUserId, setEditingUserId] = useState(null); // ID do usuário que está sendo editado

  useEffect(() => {
    const loadUsers = async () => {
      const userList = await fetchUsers(); // Função que busca usuários cadastrados
      setUsers(userList);
    };

    loadUsers();
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSave = async () => {
    const profileData = {
      displayName: name,
      email,
      birthDate,
      phone,
      role,
    };
    
    if (editingUserId) {
      // Atualiza o usuário
      await updateUserProfile(profileData, editingUserId);
      alert('Perfil atualizado com sucesso!');
    } else {
      // Adiciona um novo usuário
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
    await deleteUser(id); // Função que exclui um usuário
    alert('Usuário excluído com sucesso!');
    
    // Atualiza a lista de usuários após a exclusão
    const userList = await fetchUsers();
    setUsers(userList);
  };

  // Se loading for true, pode ser útil renderizar um loading spinner ou mensagem
  if (!user) {
    return <p>Carregando perfil...</p>;
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
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </li>

            <li className="lista-form col-md-6 col-sm-12">
              <span>Sobrenome</span>
              <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} />
            </li>

            <li className="lista-form col-md-6 col-sm-12">
              <span>Email</span>
              <br />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
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
            {users.map((user) => (
              <li key={user.id}>
                {user.displayName} - {user.email} 
                <button onClick={() => handleEdit(user)}>Editar</button>
                <button onClick={() => handleDelete(user.id)}>Excluir</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Usuario;
