import React from 'react';
import '../styles/index.css';
import person from '../imagens/person-fill.png';
import calendar from '../imagens/calendar-event-fill.png';
import clipboard from '../imagens/clipboard.png';
import users from '../imagens/users-solid.svg';
import logo from '../imagens/logo.png';
import '../styles/sidebar.css'; 
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="mobile-header">
      
      <img src={logo} className="mobile-logo" alt="Logo" />
      
      <nav>
        <input type="checkbox" id="menu-hamburguer" />
        <label htmlFor="menu-hamburguer">
          <div className="menu">
            <span className="hamburguer"></span>
          </div>
        </label>
        <ul>
          <li>
            <Link to='/Usuario'>
              <img src={person} alt="Usuário" />
              Usuário
            </Link>
          </li>
          <li>
            <Link to='/Agenda'>
              <img src={calendar} alt="Agenda" />
              Agenda
            </Link>
            
          </li>
          <li>
            <Link to='/Prontuario'>
              <img src={clipboard} alt="Prontuário" />
              Prontuário
            </Link>
          </li>
          <li>
            <Link to='/Estagiario'>
              <img src={users} className="estagiarios-img" alt="Estagiários" />
              Estagiários
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
