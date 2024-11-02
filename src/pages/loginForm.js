import React, { useState, useEffect } from 'react';
import '../styles/loginForm.css';
import logo from '../imagens/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConection.js';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import Cookies from 'js-cookie';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(false);

    useEffect(() => {
        const verificarLogin = () => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setUsuario(true);
                    user.getIdToken().then((token) => {
                        Cookies.set('authToken', token, { expires: 1 });
                        // Configura a expiração da sessão
                        setTimeout(handleLogout, 3600000); // 30 segundos
                    });
                } else {
                    setUsuario(false);
                    Cookies.remove('authToken');
                }
            });
        };
        verificarLogin();

        // Verificar se a sessão foi encerrada a cada 1 segundo
        const sessionCheckInterval = setInterval(() => {
            if (!Cookies.get('authToken')) {
                handleLogout();
            }
        }, 1000);

        return () => clearInterval(sessionCheckInterval); // Limpa o intervalo ao desmontar
    }, []);

    const handleLogout = async () => {
        await auth.signOut(); // Logout do Firebase
        Cookies.remove('authToken'); // Remover cookie do token
        navigate('/'); // Redirecionar para a página inicial
    };

    const logarUsuario = async () => {
        try {
            const value = await signInWithEmailAndPassword(auth, email, senha);
            alert("Usuário logado com sucesso");
            setEmail("");
            setSenha("");
    
            // Obter e armazenar o token no cookie
            const token = await value.user.getIdToken();
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId: email, password: senha }), // Use email e senha para login
                credentials: 'include',
            });
    
            if (response.ok) {
                navigate('/usuario'); // Navegar após login bem-sucedido
            } else {
                const errorData = await response.json(); // Obtenha detalhes do erro
                throw new Error(errorData.message || "Erro ao criar sessão.");
            }
        } catch (error) {
            alert(error.message || "Erro ao fazer login!");
            Cookies.remove('authToken'); // Remover token em caso de erro
        }
    };

    return (
        <div className="container">
            <div className="form-container sign-in">
                <h2>Usuários</h2>
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