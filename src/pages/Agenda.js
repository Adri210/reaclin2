import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Sidebar from '../componentes/sidebar.js';
import { db } from '../firebaseConection.js';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/Agenda.css';

moment.locale('pt-br');
const localizer = momentLocalizer(moment);

const messages = {
  allDay: 'Dia Inteiro',
  previous: '<',
  next: '>',
  today: 'Hoje',
  month: 'Mês',
  week: 'Semana',
  day: 'Dia',
  agenda: 'Agenda',
  date: 'Data',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'Não há eventos neste período.',
  showMore: (total) => `+ Ver mais (${total})`,
};

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
  });

  const loadEvents = async () => {
    try {
      const eventsCollection = collection(db, 'events');
      const snapshot = await getDocs(eventsCollection);
      const eventsData = snapshot.docs.map(doc => {
        const data = doc.data();
        
        
        const start = data.start ? (data.start instanceof Date ? data.start : data.start.toDate()) : null;
        const end = data.end ? (data.end instanceof Date ? data.end : data.end.toDate()) : null;
        
        
        if (!start || !end) {
          console.warn(`Evento sem data válida: ${doc.id}`);
          return null;  
        }
  
        return {
          id: doc.id,
          ...data,
          start, 
          end, 
        };
      }).filter(event => event !== null); 
      
      setEvents(eventsData);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    }
  };
  
  useEffect(() => {
    loadEvents();
  }, []);

  const handleSelectEvent = (event) => {
    setFormData(event);
    setCurrentEvent(event);
    setFormVisible(true);
  };

  const handleSelectSlot = (slotInfo) => {
    const start = slotInfo.start;
    const end = moment(start).add(1, 'hour').toDate();
    setFormData({ ...formData, start, end });
    setCurrentEvent(null);
    setFormVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentEvent) {
        const eventDoc = doc(db, 'events', currentEvent.id);
        await updateDoc(eventDoc, formData);
        setEvents((prev) =>
          prev.map((event) => (event.id === currentEvent.id ? { ...formData, id: currentEvent.id } : event))
        );
      } else {
        const newDocRef = await addDoc(collection(db, 'events'), { ...formData });
        setEvents((prev) => [...prev, { ...formData, id: newDocRef.id }]);
      }
      setFormVisible(false);
      setFormData({ title: '', start: new Date(), end: new Date(), specialidade: '', estagiario: '' });
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
    }
  };

  const handleDelete = async () => {
    if (currentEvent) {
      try {
        const eventDoc = doc(db, 'events', currentEvent.id);
        await deleteDoc(eventDoc);
        setEvents((prev) => prev.filter((event) => event.id !== currentEvent.id));
        setFormVisible(false);
      } catch (error) {
        console.error('Erro ao excluir evento:', error);
      }
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="calendar-container">
        <div className="calendar">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '80vh', margin: '50px' }}
            onSelectEvent={handleSelectEvent}
            selectable
            onSelectSlot={handleSelectSlot}
            step={60}
            timeslots={1}
            defaultView="week"
            messages={messages}
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
