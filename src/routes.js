import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from './pages/loginForm.js';
import Estagiarios from './pages/Estagiarios.js';
import Prontuario from './pages/Prontuarios.js';
import Usuario from './pages/Usuario.js';
import Agenda from './pages/Agenda.js';
import Cadastrar from './pages/cadastrar.js';

import Cookies from 'js-cookie';

function RequireAuth({ children }) {
    const isLoggedIn = Cookies.get('authToken'); // Verifica o cookie de autenticação

    if (!isLoggedIn) {
        alert("Você precisa fazer login para acessar esta página.");
        return <Navigate to="/" />;
    }

    return children;
}


function RoutesApp() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/estagiario" element={<Estagiarios />} />
                <Route path="/prontuario" element={<RequireAuth><Prontuario /></RequireAuth>} />
                <Route path="/usuario" element={<RequireAuth><Usuario /></RequireAuth>} />
                <Route path="/agenda" element={<RequireAuth><Agenda /></RequireAuth>} />
                <Route path="/cadastrar" element={<RequireAuth><Cadastrar /></RequireAuth>} />
            </Routes>
        </BrowserRouter>
    );
}

export default RoutesApp;
