import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react';
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar';
import '@schedule-x/theme-default/dist/index.css';
import '../styles/Agenda.css';
import Sidebar from '../componentes/sidebar.js';

function Agenda() {
  const calendar = useCalendarApp({
    views: [
      createViewWeek(),
      createViewMonthGrid(),
      createViewDay(), // Adicione esta linha se você quiser que o dia esteja disponível
    ],
    events: [
      {
        id: '1',
        title: 'Event 1',
        start: '2023-12-16T00:00:00', // Data e hora de início
        end: '2023-12-16T23:59:59', // Data e hora de término
      },
    ],
  });

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar />
        <div className="col cadastro">
      {calendar && <ScheduleXCalendar calendarApp={calendar} />}
    
    </div>
    </div>
    </div>
  
  
  
  );
}

export default Agenda;
