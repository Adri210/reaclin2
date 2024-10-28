import { auth } from '../firebaseConection.js';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import logo from '../imagens/logo.png';
import '../styles/cadastrar.css';
import {
  createUserWithEmailAndPassword,
} from 'firebase/auth';


function Cadastrar() {

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  async function novoUsuario() {
    await createUserWithEmailAndPassword(auth, email, senha)
      .then(() => {
        alert("Usuario cadastrado com sucesso")
        setEmail("");
        setSenha("");

        navigate('/');
      }).catch((error) => {
        if (error.code === 'auth/weak-password') {
          alert("Senha muito fraca")
        }
        else if (error.code === 'auth/email-already-in-use') {
          alert("Email já existe!")
        }

      })

  }


  return (
    <div>

      <div className="container">
        <div className="form-container sign-up">

          <h2>Cadastrar</h2>

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

          <button onClick={novoUsuario}>Cadastrar</button>
          <p></p>
          <div className="paragrafo">
            Ja tem uma conta?
            <Link to="/">Entrar</Link>
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
  )
}

export default Cadastrar;