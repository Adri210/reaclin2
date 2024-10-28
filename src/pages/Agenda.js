import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Sidebar from '../componentes/sidebar.js';
import { db } from '../firebaseConection.js'; // Importe sua conexão com o Firebase
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/Agenda.css';

// Configurar o localizador para o moment
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
  });

  // Carregar eventos do Firestore
  useEffect(() => {
    const loadEvents = async () => {
      const eventsCollection = collection(db, 'events'); // Referência à coleção
      const snapshot = await getDocs(eventsCollection); // Obtém documentos da coleção
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsData);
    };

    loadEvents();
  }, []);

  // Selecionar evento
  const handleSelectEvent = (event) => {
    setFormData(event);
    setCurrentEvent(event);
    setFormVisible(true);
  };

  // Selecionar slot no calendário
  const handleSelectSlot = (slotInfo) => {
    const start = slotInfo.start;
    const end = moment(start).add(1, 'hour').toDate(); // Define a duração do evento como 1 hora
    setFormData({ ...formData, start, end });
    setCurrentEvent(null);
    setFormVisible(true);
  };

  // Manipular o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentEvent) {
        // Atualizar evento
        const eventDoc = doc(db, 'events', currentEvent.id); // Referência ao documento
        await updateDoc(eventDoc, formData); // Atualiza no Firestore
        setEvents((prev) =>
          prev.map((event) => (event.id === currentEvent.id ? { ...formData, id: currentEvent.id } : event))
        );
      } else {
        // Adicionar evento
        const newDocRef = await addDoc(collection(db, 'events'), { ...formData }); // Adiciona no Firestore
        setEvents((prev) => [...prev, { ...formData, id: newDocRef.id }]); // Adiciona ID gerado pelo Firestore
      }
      setFormVisible(false);
      setFormData({ title: '', start: new Date(), end: new Date(), specialidade: '', estagiario: '' });
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
    }
  };

  // Manipular exclusão de eventos
  const handleDelete = async () => {
    if (currentEvent) {
      try {
        const eventDoc = doc(db, 'events', currentEvent.id); // Referência ao documento
        await deleteDoc(eventDoc); // Deleta do Firestore
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
