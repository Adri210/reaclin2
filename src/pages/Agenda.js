import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Sidebar from '../componentes/sidebar.js'; // Importe seu componente de sidebar

import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/Agenda.css'; 

const localizer = momentLocalizer(moment);

const Agenda = () => {
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    start: new Date(),
    end: new Date(),
    specialidade: '',
    estagiario: '',
function Agenda() {
  const calendar = useCalendarApp({
    views: [
      createViewWeek(),
      createViewMonthGrid(),
      createViewDay(), 
    ],
    events: [
      {
        id: '1',
        title: 'Event 1',
        start: '2023-12-16T00:00:00', 
        end: '2023-12-16T23:59:59', 
      },
    ],
  });

  const handleSelectEvent = (event) => {
    setFormData(event);
    setCurrentEvent(event);
    setFormVisible(true);
  };

  const handleSelectSlot = (slotInfo) => {
    const start = slotInfo.start;
    const end = moment(start).add(1, 'hour').toDate(); // Define a duração do evento como 1 hora
    setFormData({ ...formData, start, end });
    setCurrentEvent(null);
    setFormVisible(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentEvent) {
      // Atualizar evento
      setEvents((prev) =>
        prev.map((event) => (event.id === currentEvent.id ? { ...formData, id: currentEvent.id } : event))
      );
    } else {
      // Adicionar evento
      const newEvent = { ...formData, id: Math.random() }; // Gerar um ID único
      setEvents((prev) => [...prev, newEvent]);
    }
    setFormVisible(false);
    setFormData({ title: '', start: new Date(), end: new Date(), specialidade: '', estagiario: '' });
  };

  const handleDelete = () => {
    if (currentEvent) {
      setEvents((prev) => prev.filter((event) => event.id !== currentEvent.id));
      setFormVisible(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar /> {/* Adiciona a sidebar ao lado esquerdo */}
      <div className="calendar-container">
        <div className="calendar">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '80vh', margin: '50px' }} // Aumenta a altura do calendário
            onSelectEvent={handleSelectEvent}
            selectable
            onSelectSlot={handleSelectSlot}
            step={60} // Passo de 60 minutos
            timeslots={1} // Número de slots por hora
            defaultView="week" // Exibir a visão semanal por padrão
          />
        </div>
        {formVisible && (
          <div className="event-form">
            <h2>{currentEvent ? 'Editar Consulta' : 'Agendar Consulta'}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Título"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Especialidade"
                value={formData.specialidade}
                onChange={(e) => setFormData({ ...formData, specialidade: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Estagiário"
                value={formData.estagiario}
                onChange={(e) => setFormData({ ...formData, estagiario: e.target.value })}
                required
              />
              <button type="submit">{currentEvent ? 'Atualizar' : 'Agendar'}</button>
              {currentEvent && <button type="button" onClick={handleDelete}>Excluir</button>}
            </form>
          </div>
        )}
      </div>
    </div>

  
  
  );
};

export default Agenda;