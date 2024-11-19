import React, { useState, useContext, useEffect } from 'react';
import '../styles/loginForm.css';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConection.js'; 
import { onAuthStateChanged } from 'firebase/auth'; 
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

            const loginTime = new Date().getTime(); 
            Cookies.set('loginTime', loginTime, { expires: 1 }); 

            setIsLoggedIn(true);
            navigate('/usuario');
            
            
            setTimeout(() => {
                const currentTime = new Date().getTime();
                const sessionDuration = (currentTime - loginTime) / 1000 / 60; 

                if (sessionDuration >= 2) {
                    alert("Sessão expirada. Você será deslogado.");
                    Cookies.remove('authToken');
                    Cookies.remove('loginTime');
                    setIsLoggedIn(false);
                    navigate('/'); 
                }
            }, 2 * 60 * 1000); 
        } catch (error) {
            alert(error.message || 'Erro ao fazer login!');
            Cookies.remove('authToken');
            setIsLoggedIn(false);  
        }
    };

    const handleLogout = async () => {
        await auth.signOut(); 
        Cookies.remove('authToken');
        navigate('/'); 
    };

    useEffect(() => {
        const verificarLogin = () => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setIsLoggedIn(true);
                    user.getIdToken().then((token) => {
                        Cookies.set('authToken', token, { expires: 1 });
                    });
                } else {
                    setIsLoggedIn(false);
                    Cookies.remove('authToken');
                }
            });
        };
        verificarLogin();

       
        const sessionCheckInterval = setInterval(() => {
            if (!Cookies.get('authToken')) {
                handleLogout();
            }
        }, 30 * 1000); 
        return () => clearInterval(sessionCheckInterval); 

    }, [setIsLoggedIn]);

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
