import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { isToday, format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { FiPower, FiClock } from 'react-icons/fi';
import { parseISO } from 'date-fns/esm';
import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Section,
  Appointment,
  Calendar,
} from './styles';

import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/Auth';
import api from '../../server/api';

interface MonthAvailabilityIterm {
  day: number;
  available: boolean;
}

interface Appointment {
  id: string;
  date: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityIterm[]
  >([]);
  const { signOut, user } = useAuth();

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  useEffect(() => {
    // api
    //   .get(`/providers/${user.id}/month-availability`, {
    //     params: {
    //       year: currentMonth.getFullYear(),
    //       month: currentMonth.getMonth() + 1,
    //     },
    //   })
    //   .then(response => {
    //     setMonthAvailability(response.data);
    //   });
  }, [currentMonth]);

  useEffect(() => {
    // api /** user.id* */
    //   .get(`/appointments/me`, {
    //     params: {
    //       year: currentMonth.getFullYear(),
    //       month: currentMonth.getMonth() + 1,
    //       day: currentMonth.getDate(),
    //     },
    //   })
    //   .then(response => {
    //     setAppointments(response.data);
    //   });
  }, [selectedDate]);

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter(monthDay => monthDay.available === false)
      .map(monthDay => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        return new Date(year, month, monthDay.day);
      });
    return dates;
  }, [currentMonth, monthAvailability]);

  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", {
      locale: ptBR,
    });
  }, [selectedDate]);

  const selectedWeekDay = useMemo(() => {
    return format(selectedDate, 'cccc', { locale: ptBR });
  }, [selectedDate]);

  const morningAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() < 12;
    });
  }, [appointments]);

  const afternoomAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() >= 12;
    });
  }, [appointments]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />

          <Profile>
            <img
              src="https://avatars3.githubusercontent.com/u/4871238?s=460&u=04301d0ee81db6621582df1364b1d149818287f7&v=4"
              alt="Manoel Vieira"
            />
            <div>
              <span>Bem Vindo,</span>
              <strong />
            </div>
          </Profile>
          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>
      <Content>
        <Schedule>
          <h1>Horários Agendados</h1>
          <p>
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>
          <NextAppointment>
            <strong>Atendimento a seguir</strong>
            <div>
              <img
                src="https://avatars3.githubusercontent.com/u/4871238?s=460&u=04301d0ee81db6621582df1364b1d149818287f7&v=4"
                alt=""
              />
              <strong>Manoel Vieira</strong>
              <span>
                <FiClock />
                8:00
              </span>
            </div>
          </NextAppointment>
          <Section>
            <strong>Manhã</strong>
            {morningAppointments.map(appointment => (
              <Appointment>
                <span>
                  <FiClock />
                  08:00
                </span>
                <div>
                  <img
                    src="https://avatars3.githubusercontent.com/u/4871238?s=460&u=04301d0ee81db6621582df1364b1d149818287f7&v=4"
                    alt=""
                  />
                  <strong>Manoel Vieira</strong>
                </div>
              </Appointment>
            ))}
          </Section>
          <Section>
            <strong>Tarde</strong>
            {afternoomAppointments.map(appointment => (
              <Appointment>
                <span>
                  <FiClock />
                  08:00
                </span>
                <div>
                  <img
                    src="https://avatars3.githubusercontent.com/u/4871238?s=460&u=04301d0ee81db6621582df1364b1d149818287f7&v=4"
                    alt=""
                  />
                  <strong>Manoel Vieira</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            onMonthChange={handleMonthChange}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
