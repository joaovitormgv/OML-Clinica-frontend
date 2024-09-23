"use client";
import React from "react";
import Mostrador from "@/app/components/mostrador/mostrador";

const UserSchedulePage = () => {
  // Exemplo de dados que o backend pode fornecer
  const dados = [
    {
      medico: "Dr. João",
      paciente: "Ana Silva",
      data: "20/09/2024",
      horario: "14:00",
    },
    {
      medico: "Dra. Maria",
      paciente: "Carlos Souza",
      data: "22/09/2024",
      horario: "16:30",
    },
    {
      medico: "Dr. Pedro",
      paciente: "Lucas Lima",
      data: "23/09/2024",
      horario: "09:00",
    },
    {
      medico: "Dr. Pedro",
      paciente: "Lucas Lima",
      data: "23/09/2024",
      horario: "10:30",
    },
    {
      medico: "Dr. Pedro",
      paciente: "Lucas Lima",
      data: "23/09/2024",
      horario: "11:00",
    },
    {
      medico: "Dr. Pedro",
      paciente: "Lucas Lima",
      data: "23/09/2024",
      horario: "13:00",
    },
    {
      medico: "Dr. Pedro",
      paciente: "Lucas Lima",
      data: "23/09/2024",
      horario: "15:00",
    },
  ];

  return (
    <div className="w-full flex flex-row h-screen">
      <div className="w-1/5 bg-gray-200 h-screen">
        <div id="leftside-content" className="flex flex-col mt-10">
          <p className="flex items-center justify-center font-bold text-xl">
            Filtros
          </p>
          <div id="filters" className="font-semibold flex flex-col ml-5 mt-5">
            <p>Data</p>
            <p>Médico</p>
          </div>
        </div>
      </div>
      <div className="w-4/5 h-full overflow-hidden">
        <div id="rightside-content" className="flex flex-col mt-10 ml-8">
          <p className="text-2xl font-bold">Minhas Consultas</p>
          <input
            type="text"
            placeholder="Pesquisar..."
            className="mt-1 px-2 py-1 border-2 border-blue-700 rounded-lg focus:outline-none focus:border-blue-700 w-48"
          />
          <div id="showschedule" className="mt-6">
            {/* Aqui você renderiza o componente Mostrador passando os dados */}
            <Mostrador dados={dados} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSchedulePage;
