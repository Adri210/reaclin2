import React from 'react';
import '../styles/loginForm.css';
import logo from '../imagens/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebaseConection.js';
import { useNavigate } from 'react-router-dom';

import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';

const LoginForm = () => {

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(false);
  const [detalhesUsuario, setDetalhesUsuario] = useState({});

  useEffect(() => {
    async function verificarLogin() {

      onAuthStateChanged(auth, (user) => {
        if (user) {

          setUsuario(true);
          setDetalhesUsuario({
            uid: user.uid,
            email: user.email
          })
        }
        else {

          setUsuario(false);
          setDetalhesUsuario({});
        }

      })

    }
    verificarLogin();
  }, [])


  async function logarUsuario() {
    await signInWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        alert("Usuário logada com sucesso")
        setUsuario(true);
        setDetalhesUsuario({
          uid: value.user.uid,
          email: value.user.email,
        })
        setEmail("");
        setEmail("");

        navigate('/Usuario');
      })
      .catch(() => {
        alert("Erro ao fazer login!")
      })
  }


  return (
    <div>

      <div className="container">
        <div className="form-container sign-in">

          <h2>Usuários</h2>
          <br />
          <label>Email:</label>
          <input
            type="email"
            placeholder="Digite um email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Senha:</label>
          <input
            type="password"
            placeholder="Digite uma senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <a className="esqueci" href="#">Esqueci a senha</a>
          <button onClick={logarUsuario}>Entrar</button>
          <p></p>
          <div className="paragrafo">
            Não tem uma conta?
            <Link to="/cadastrar">Cadastrar</Link>
          </div>
        </div>

        <div class="toggle-container">
          <div class="toggle">
            <div class="toggle-panel toggle-left">
              <div className="logo">
                <img src={logo} alt="Logotipo Real Clin" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default LoginForm;