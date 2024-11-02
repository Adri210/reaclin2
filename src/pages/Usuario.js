import React, { useContext, useState, useEffect } from 'react';
import '../styles/index.css';
import Sidebar from '../componentes/sidebar.js';
import Header from '../componentes/Header.js';
import '../styles/usuario.css';
import perfil from '../imagens/perfil.png';
import { AuthContext } from '../contexts/auth.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebaseConection.js';
import { FiUpload } from 'react-icons/fi';

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
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
  const [imageAvatar, setImageAvatar] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const userList = await fetchUsers();
        setUsers(userList);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
      setAvatarUrl(user.avatarUrl || perfil);
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
      avatarUrl: avatarUrl || perfil,
    };

    try {
      if (editingUserId) {
        await updateUserProfile(profileData, editingUserId);
        alert('Perfil atualizado com sucesso!');
      } else {
        const newDocRef = doc(db, "users", editingUserId || "guest");
        await setDoc(newDocRef, profileData);
        alert('Usuário cadastrado com sucesso!');
      }

      setEditingUserId(null);
      setName('');
      setSurname('');
      setEmail('');
      setBirthDate('');
      setPhone('');
      setRole('');
      setImageAvatar(null);

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
    setAvatarUrl(user.avatarUrl);
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
    return <p>Carregando usuários...</p>;
  }

  const handleFile = (e) => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      if (image.type === 'image/jpeg' || image.type === 'image/png') {
        setImageAvatar(image);
        setAvatarUrl(URL.createObjectURL(image));
      } else {
        alert("Envie uma imagem do tipo PNG ou JPEG");
        setImageAvatar(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!imageAvatar) return;

    const userId = user ? user.uid : "guest";
    const uploadRef = ref(storage, `images/${userId}/${imageAvatar.name}`);
    
    try {
      const snapshot = await uploadBytes(uploadRef, imageAvatar);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      setAvatarUrl(downloadURL);

      // Salva a URL da imagem no Firestore para o usuário atual ou "guest"
      const docRef = doc(db, "users", userId);
      await updateDoc(docRef, { avatarUrl: downloadURL });

      alert("Foto de perfil atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar foto de perfil:", error);
      alert("Erro ao atualizar foto de perfil. Tente novamente.");
    }
  };

  return (
    <div className="row">
      <Sidebar />
      <Header />
      <div className='container'>
        <div>
        <h3 className="titulo">Gerenciar Funcionários</h3>
        </div>
        
        <div className="img-perfil">
          <label className="label-avatar">
            <span>
              <FiUpload color="#FFF" size={25} />
            </span>
            <input type="file" accept="image/*" onChange={handleFile} /> <br/>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Foto de perfil" width={250} height={250} />
            ) : (
              <img src={perfil} alt="Foto de perfil" width={250} height={250} />
            )}
          </label>
          <button onClick={handleUpload} className="botao-salvar">Salvar Foto</button>
        </div>

        <div className="row">
          <div className="input-container col-md-6 col-sm-12">
            <span>Nome</span>
            <input type="text" className="input-text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="input-container col-md-6 col-sm-12">
            <span>Sobrenome</span>
            <input type="text" className="input-text" value={surname} onChange={(e) => setSurname(e.target.value)} />
          </div>

          <div className="input-container col-md-6 col-sm-12">
            <span>Email</span>
            <input type="email" className="input-text" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="input-container col-md-6 col-sm-12">
            <span>Data de nascimento</span>
            <input type="date" className="input-text" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
          </div>

          <div className="input-container col-md-6 col-sm-12">
            <span>Celular</span>
            <input type="text" className="input-text" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="input-container col-md-6 col-sm-12">
            <span>Função</span>
            <input type="text" className="input-text" value={role} onChange={(e) => setRole(e.target.value)} />
          </div>
        </div>

        <button className="botao-salvar" onClick={handleSave}>Salvar</button>

        <h3>Lista de Funcionários</h3>
        <ul className="lista-funcionarios">
          {users.length > 0 ? users.map((user) => (
            <li key={user.id}>
              <img src={user.avatarUrl || perfil} alt="Foto do usuário" width={50} height={50} style={{ marginRight: '10px' }} />
              {user.displayName || "Nome não disponível"} - {user.email}
              <div className='buttons'>
                <button onClick={() => handleEdit(user)} className='buttonEdit'>Editar</button>
                <button onClick={() => handleDelete(user.id)} className='buttonEdit'>Excluir</button>
              </div>
            </li>
          )) : <p>Nenhum funcionário cadastrado.</p>}
        </ul>
      </div>
    </div>
  );
};

export default Usuario;
