import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react';
import {
  createViewDay,
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
          <Header />
          <div className="cadastro-dois d-flex flex-column p-2">
            <div className="d-flex justify-content-between mb-3 ">
              <div className="d-flex align-items-center gap-2">
                <i className="fas fa-angle-left"></i>
                <p className="m-0 text-nowrap">{mes}</p>
                <i className="fas fa-angle-right"></i>
              </div>
              <div className="position-relative">
              </div>
              <span className="flag">Hoje</span>
            </div>
            <div className="calendar-container rounded-2 ">
              <div className="title">Sun</div>
              <div className="title">Mon</div>
              <div className="title">Tue</div>
              <div className="title">Wed</div>
              <div className="title">Thu</div>
              <div className="title">Fri</div>
              <div className="title">Sat</div>

              {dias.map(({ dia, eventos }) => (
                <CalendarDay key={dia} day={dia} events={eventos} />
              ))}

              <div className="other-day">1</div>
              <div className="other-day">2</div>
              <div className="other-day">3</div>
              <div className="other-day">4</div>
              <div className="other-day">5</div>
              <div className="other-day">6</div>
              <div className="other-day">7</div>
              <div className="other-day">8</div>
              <div className="other-day">9</div>
              <div className="other-day">10</div>
              <div className="other-day">11</div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  
  
  
  );
}

export default Agenda;
