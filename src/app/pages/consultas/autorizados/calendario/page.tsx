"use client";
import React, { useState } from "react";
import Mostrador from "@/app/components/mostrador/mostrador";

// Exemplo de dados de consultas
const initialAppointments = [
  { day: 20, doctor: "Dr. João", patient: "Ana Silva", time: "14:00" },
  { day: 22, doctor: "Dra. Maria", patient: "Carlos Souza", time: "10:00" },
  { day: 23, doctor: "Dr. Pedro", patient: "Lucas Lima", time: "11:30" },
  { day: 23, doctor: "Dr. Pedro", patient: "Bruna Carvalho", time: "15:00" },
  { day: 25, doctor: "Dra. Maria", patient: "Lucas Lima", time: "09:00" },
];

const AdminCalendarPage = () => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [showNewAppointmentForm, setShowNewAppointmentForm] = useState(false);

  // Função para contar o número de agendamentos por dia
  const getAppointmentCount = (day: number) => {
    return appointments.filter((app) => app.day === day).length;
  };

  // Função para verificar se ainda há horários disponíveis
  const isAvailable = (day: number) => {
    const count = getAppointmentCount(day);
    return count < 5; // Considera até 5 consultas por dia como disponíveis
  };

  // Função para adicionar nova consulta
  const addAppointment = (doctor: string, patient: string, time: string) => {
    if (selectedDay) {
      setAppointments([
        ...appointments,
        { day: selectedDay, doctor, patient, time },
      ]);
      setShowNewAppointmentForm(false); // Fecha o formulário após agendar
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center">
      {/* Calendário ocupando a tela toda */}
      <div className="grid grid-cols-7 w-full max-w-5xl mt-10">
        {Array.from({ length: 30 }, (_, index) => {
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
              <p className="text-sm mt-2 font-semibold">
                {getAppointmentCount(day)} agendamentos
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
        })}
      </div>

      {/* Sidebar abaixo do calendário */}
      {selectedDay && (
        <div className="w-full max-w-5xl h-auto mt-6 p-4">
          <button
            onClick={() => setShowNewAppointmentForm(true)}
            className="bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-600 mb-4"
          >
            Agendar nova consulta
          </button>

          {/* Formulário para adicionar consulta */}
          {showNewAppointmentForm && (
            <div className="flex flex-col mb-4">
              <input
                type="text"
                placeholder="Nome do Médico"
                className="px-2 py-2 border-2 border-blue-700 rounded-lg mb-2"
              />
              <input
                type="text"
                placeholder="Nome do Paciente"
                className="px-2 py-2 border-2 border-blue-700 rounded-lg mb-2"
              />
              <input
                type="time"
                className="px-2 py-2 border-2 border-blue-700 rounded-lg mb-2"
              />
              <button
                onClick={() =>
                  addAppointment("Nome do Médico", "Nome do Paciente", "14:00")
                }
                className="bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Confirmar
              </button>
            </div>
          )}

          {/* Consultas do dia com limite de altura e rolagem */}
          <div className="max-h-60 overflow-y-auto mb-10">
            <Mostrador
              dados={appointments
                .filter((app) => app.day === selectedDay)
                .map((app) => ({
                  medico: app.doctor,
                  paciente: app.patient,
                  data: `${app.day}/09/2024`, // Ajuste conforme necessário para exibir o mês/ano corretamente
                  horario: app.time,
                }))}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCalendarPage;
