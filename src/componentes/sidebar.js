import React, { useState } from 'react'; 
import '../styles/sidebar.css'; 
import vetor from '../imagens/Vector.png';
import person from '../imagens/person-fill.png';
import calendar from '../imagens/calendar-event-fill.png';
import clipboard from '../imagens/clipboard.png';
import users from '../imagens/users-solid.svg';
import personCircle from '../imagens/perfil.png';
import logo from '../imagens/logo.png';
import { NavLink } from "react-router-dom";

const Sidebar = () => {

  const [isMinimized, setIsMinimized] = useState(false);

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-white sidebar h-100 ${isMinimized ? 'minimized' : 'active'}`}>
      <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 vh-100">
        <div className="menu-btn" onClick={toggleSidebar}>
          <i className={`ph-bold ph-caret-${isMinimized ? 'right' : 'left'} element`}></i>
        </div>
        <span className={`fs-5 ${isMinimized ? 'd-none' : ''}`}>
          <img src={logo} alt="" className="m-0 w-100 d-flex justify-content-center" />
        </span>
        <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
          <li>
            <a href="#submenu1" data-bs-toggle="collapse" className="nav-link px-3">
              <img src={vetor} className="fs-4 bi-speedometer2" alt='' />
              <span className={`ms-1 d-none d-sm-inline space ${isMinimized ? 'd-none' : ''}`}>Inicio</span>
            </a>
            <ul className="collapse show nav flex-column ms-1" id="submenu1" data-bs-parent="#menu">
              <li>
                <NavLink to="/Usuario" className="nav-link px-3 d-flex align-items-center gap-1">
                  <img src={person} alt='' />
                  <span className={`ms-1 d-none d-sm-inline space ${isMinimized ? 'd-none' : ''}`}>Usuário</span>
                </NavLink>
              </li>
            </ul>
          </li>
          <li>
            <NavLink to="/Agenda" className="nav-link px-3">
              <img src={calendar} className="fs-4 bi-table" alt='' />
              <span className={`ms-1 d-none d-sm-inline space ${isMinimized ? 'd-none' : ''}`}>Agenda</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/Prontuario" className="nav-link px-3">
              <img src={clipboard} alt='' />
              <span className={`ms-1 d-none d-sm-inline space ${isMinimized ? 'd-none' : ''}`}>Prontuários</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/Estagiario" className="nav-link px-3">
              <img src={users} className="estagiarios-img" alt='' />
              <span className={`ms-1 d-none d-sm-inline space ${isMinimized ? 'd-none' : ''}`}>Estagiários</span>
            </NavLink>
          </li>
        </ul>
        <hr />
        <div className="dropdown pb-4">
          <a
            href="#"
            className="d-flex align-items-center text-dark text-decoration-none dropdown-toggle"
            id="dropdownUser1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img src={personCircle} alt="hugenerd" width="30" height="30" className="rounded-circle" />
            <span className={`d-none d-sm-inline mx-1 ${isMinimized ? 'd-none' : ''}`}>João</span>
          </a>
          <ul className="dropdown-menu text-small shadow">
            <li><a className="dropdown-item" href="#">Configurações</a></li>
            <li><a className="dropdown-item" href="#">Perfil</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item" href="./">Sair</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
