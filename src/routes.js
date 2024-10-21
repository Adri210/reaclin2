import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginForm from './pages/loginForm.js';
import Estagiarios from './pages/Estagiarios.js';
import Prontuario from './pages/Prontuarios.js';
import Usuario from './pages/Usuario.js';
import Agenda from './pages/Agenda.js';
import Cadastrar from './pages/cadastrar.js';



function RoutesApp() {
    return (
        <BrowserRouter>
            
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/Estagiario" element={<Estagiarios />} />
                <Route path="/Prontuario" element={<Prontuario />} />
                <Route path="/Usuario" element={<Usuario />} />
                <Route path="/Agenda" element={<Agenda />} />
                <Route path="/cadastrar" element={<Cadastrar />} />


            </Routes>
        </BrowserRouter>
    );
}

export default RoutesApp;