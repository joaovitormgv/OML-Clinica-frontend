"use client";
import React, { useState, useRef, useEffect } from "react";
import Mostrador from "@/app/components/mostrador/mostrador";
import { toast, ToastContainer } from "react-toastify";
// Exemplo de dados de consultas
  interface NewConsultationData {
    id: number;
    paciente: {
      [x: string]: any; id: number 
};
    medico: {
      [x: string]: any; id: number 
};
    data: string;
    horario: string;
    dataHora: string;
    status: string;
  }

interface Consulta {
  id: number;
  day: number;
  month: number;
  year: number;
  doctor: string;
  patient: string;
  time: string;
}

const initialAppointments: Consulta[] = [];

const AdminCalendarPage = () => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [myConsultas, setMyConsultas] = useState<NewConsultationData[]>([]);
  const [todasConsultas, setTodasConsultas] = useState<NewConsultationData[]>([]);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // Mês atual
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // Ano atual

  const popupRef = useRef<HTMLDivElement | null>(null);

  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  useEffect(() => {
    const serializedAppointments = myConsultas.map((consulta) => {
      const data = new Date(consulta.dataHora);
      const formattedDate = data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      const formattedTime = data.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
      const [day, month, year] = formattedDate.split("/").map(Number);
      const time = formattedTime;
      return {
        id: consulta.id,
        day,
        month,
        year,
        doctor: consulta.medico.nome,
        patient: consulta.paciente.nome, 
        time,
      };
    });
    setAppointments(serializedAppointments);
  }, [myConsultas]);

  useEffect(() => {
    const fetchConsultasUsuario = async () => {
      try {
        const userId = localStorage.getItem("userToken");
        const response = await fetch(`http://localhost:8080/consultas/paciente/${userId}`);
        const data = await response.json();
        setMyConsultas(data);
        console.log("Consultas do usuário:", data);
      } catch (error) {
        console.error("Erro ao buscar consultas do usuário:", error);
      }
    };

    fetchConsultasUsuario();
  }, []);
  
    const handleCancelConsulta = async (consultaId: number) => {
      try {
        const confirm = window.confirm("Tem certeza que deseja cancelar esta consulta?");
        if (!confirm) {
          return;
        }

        const response = await fetch(`http://localhost:8080/consultas/${consultaId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Atualize a lista de consultas após a exclusão
        setMyConsultas((prevConsultas: NewConsultationData[]) => prevConsultas.filter((consulta: NewConsultationData) => consulta.id !== consultaId));
        alert("Consulta cancelada com sucesso");
      } catch (error) {
        console.error("Erro ao cancelar consulta:", error);
        toast.error("Erro ao cancelar consulta");
      }
    };

  // Função para calcular o número de dias no mês atual
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Função para contar o número de agendamentos por dia
  const getAppointmentCount = (day: number) => {
    return appointments.filter(
      (app) =>
        app.day === day &&
        app.month === currentMonth + 1 &&
        app.year === currentYear
    ).length;
  };

  // Função para verificar se ainda há horários disponíveis
  const isAvailable = (day: number) => {
    const count = getAppointmentCount(day);
    return count < 5; // Considera até 5 consultas por dia como disponíveis
  };

  // Navegação entre meses
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(null); // Reseta o dia selecionado ao trocar de mês
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(null); // Reseta o dia selecionado ao trocar de mês
  };

  // Fechar o pop-up e voltar ao calendário
  const closePopup = () => {
    setSelectedDay(null);
  };

  // Fechar o popup ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        closePopup();
      }
    };

    if (selectedDay) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedDay]);

  return (
    <div className="w-full h-screen flex flex-col items-center relative">
      {/* Calendário e navegação de meses */}
      <div
        className={`w-full h-full flex flex-col items-center ${
          selectedDay ? "opacity-50" : ""
        }`}
      >
        <div className="flex justify-between w-full max-w-5xl mt-10 mb-4">
          <button
            onClick={prevMonth}
            className="bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Mês Anterior
          </button>
          <h2 className="text-2xl font-bold">{`${months[currentMonth]} ${currentYear}`}</h2>
          <button
            onClick={nextMonth}
            className="bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Próximo Mês
          </button>
        </div>

        {/* Calendário */}
        <div className="grid grid-cols-7 w-full max-w-5xl">
          {Array.from(
            { length: getDaysInMonth(currentMonth, currentYear) },
            (_, index) => {
              const day = index + 1;
              return (
                <div
                  key={day}
                  className={`p-4 border border-black text-left cursor-pointer ${
                    selectedDay === day ? "bg-blue-100" : "bg-white"
                  }`}
                  onClick={() => setSelectedDay(day)}
                >
                  <p className="font-bold text-left text-xl">{day}</p>
                  <p className={`text-sm mt-2 font-semibold rounded ${
                    getAppointmentCount(day) > 0 ? "bg-blue-500 text-white pl-1" : ""
                  } 
                  `}
                  >
                   { getAppointmentCount(day) !== 1 ? `${getAppointmentCount(day)} consultas` : `${getAppointmentCount(day)} consulta`}
                  </p>
                  <p
                    className={`${
                      isAvailable(day) ? "text-green-500" : "text-red-500"
                    } text-sm`}
                  >
                    {isAvailable(day) ? "Disponível" : "Indisponível"}
                  </p>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* Pop-up de consultas */}
      {selectedDay && (
        <div
          ref={popupRef}
          className="fixed top-1/4 left-1/5 w-3/5 bg-white border border-gray-300 rounded-lg shadow-lg p-6"
          style={{ zIndex: 100 }}
        >
          <button
            onClick={closePopup}
            className="absolute top-4 right-4 hover:text-gray-800 text-2xl font-semibold"
          >
            X
          </button>
          <h2 className="text-2xl font-bold mb-4">
            Consultas do dia {selectedDay} de {months[currentMonth]}{" "}
            {currentYear}
          </h2>

          {/* Consultas do dia */}
          <div className="max-h-60 overflow-y-auto">
            <Mostrador
              onCancel={handleCancelConsulta}
              dados={appointments
                .filter(
                  (app) =>
                    app.day === selectedDay &&
                    app.month === currentMonth + 1 &&
                    app.year === currentYear
                )
                .map((app) => ({
                  id: app.id,
                  medico: app.doctor,
                  paciente: app.patient,
                  data: `${app.day}/${app.month}/${app.year}`,
                  horario: app.time,
                }))}
            />

            {/* Mensagem caso não haja consultas */}
            {getAppointmentCount(selectedDay) === 0 && (
              <p className="text-center text-gray-500">
                Nenhuma consulta agendada para este dia.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCalendarPage;
