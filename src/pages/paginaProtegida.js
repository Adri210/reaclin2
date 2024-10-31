import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const PaginaProtegida = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (!token) {
      alert("Você precisa estar logado para acessar esta página");
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div>
      <h1>Bem-vindo à página protegida!</h1>
      {/* Conteúdo da página protegida */}
    </div>
  );
};

export default PaginaProtegida;
