import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './pages/loginForm.js';
import Estagiarios from './pages/Estagiarios.js';
import Prontuario from './pages/Prontuarios.js';
import Usuario from './pages/Usuario.js';
import Agenda from './pages/Agenda.js';
import ProtectedRoute from './protectedroute.js';
import Cadastrar from './pages/cadastrar.js';
import { AuthProvider } from './contexts/authcontext.js'; 


function RoutesApp() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LoginForm />} />
                    <Route path="/estagiario" element={<ProtectedRoute><Estagiarios /></ProtectedRoute>} />
                    <Route path="/prontuario" element={<ProtectedRoute><Prontuario /></ProtectedRoute>} />
                    <Route path="/usuario" element={<ProtectedRoute><Usuario /></ProtectedRoute>} />
                    <Route path="/agenda" element={<ProtectedRoute><Agenda /></ProtectedRoute>} />
                    <Route path="/cadastrar" element={<Cadastrar />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default RoutesApp;
