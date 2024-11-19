import React, { useState, useContext } from 'react';
import '../styles/loginForm.css';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConection.js';
import { AuthContext } from '../contexts/authcontext.js'; 
import logo from '../imagens/logo.png'; 
import Cookies from 'js-cookie';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();
    const { setIsLoggedIn } = useContext(AuthContext); 

    const logarUsuario = async () => {
        try {
            const value = await signInWithEmailAndPassword(auth, email, senha);
            setEmail('');
            setSenha('');
    
            const token = await value.user.getIdToken();
            Cookies.set('authToken', token, { expires: 1 });
    
            setIsLoggedIn(true); 
    
            navigate('/usuario');
        } catch (error) {
            alert(error.message || 'Erro ao fazer login!');
            Cookies.remove('authToken');
            setIsLoggedIn(false);  
        }
    };

    return (
        <div className="container">
            <div className="form-container sign-in">
                <h2>Login</h2>
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
                <button onClick={logarUsuario} className="buttonLogin">Entrar</button>
                <div>
                    Não tem uma conta?
                    <Link to="/cadastrar">Cadastrar</Link>
                </div>
            </div>
            <div className="toggle-container">
                <div className="toggle">
                    <div className="toggle-panel toggle-left">
                        <div className="logo">
                            <img src={logo} alt="Logotipo Real Clin" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default LoginForm;
