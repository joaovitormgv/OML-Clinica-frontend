"use client";
import React, { useState } from "react";

// Dados de exemplo para consultas
const consultations = [
  {
    medico: "Dr. João",
    paciente: "Ana Silva",
    data: "2024-10-05",
    horario: "14:00",
  },
  {
    medico: "Dra. Maria",
    paciente: "José Santos",
    data: "2024-10-06",
    horario: "16:00",
  },

  // Adicione mais dados aqui
];

const AdminSchedulePage = () => {
  // Estado para controlar o menu de nova consulta
  const [showNewConsultationMenu, setShowNewConsultationMenu] = useState(false);
  const [newConsultationData, setNewConsultationData] = useState({
    paciente: "",
    medico: "",
    data: "",
    horario: "",
  });

  // Função para lidar com mudanças no formulário de nova consulta
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewConsultationData((prev) => ({ ...prev, [name]: value }));
  };

  // Função para enviar o formulário de nova consulta
  const handleAddConsultation = () => {
    console.log("Nova Consulta:", newConsultationData);
    setShowNewConsultationMenu(false);
    // Aqui você pode adicionar lógica para adicionar a nova consulta
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Título e botão Nova Consulta */}
      <div className="w-4/5 flex justify-between items-center mt-10">
        <p className="text-2xl font-bold">Suas Consultas</p>
        <button
          onClick={() => setShowNewConsultationMenu((prev) => !prev)}
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Nova Consulta
        </button>
      </div>

      {/* Menu para adicionar nova consulta */}
      {showNewConsultationMenu && (
        <div className="w-4/5 bg-gray-100 p-4 rounded-lg mt-4">
          <h2 className="text-lg font-semibold mb-4">
            Adicionar Nova Consulta
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold">Nome do Paciente</label>
              <input
                type="text"
                name="paciente"
                value={newConsultationData.paciente}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block font-semibold">Nome do Médico</label>
              <input
                type="text"
                name="medico"
                value={newConsultationData.medico}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block font-semibold">Data</label>
              <input
                type="date"
                name="data"
                value={newConsultationData.data}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block font-semibold">Horário</label>
              <input
                type="time"
                name="horario"
                value={newConsultationData.horario}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleAddConsultation}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
            >
              Adicionar
            </button>
          </div>
        </div>
      )}

      {/* Mostrador das consultas, 2 por linha */}
      <div className="w-4/5 grid grid-cols-2 gap-4 mt-6 mb-6">
        {consultations.map((consultation, index) => (
          <div key={index} className="bg-gray-300 p-4 rounded-lg">
            <p className="font-semibold">Médico: {consultation.medico}</p>
            <p className="font-semibold">Paciente: {consultation.paciente}</p>
            <p className="text-sm">Data: {consultation.data}</p>
            <p className="text-sm">Horário: {consultation.horario}</p>
            <div className="mt-2 flex space-x-2">
              <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-400">
                Remarcar
              </button>
              <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500">
                Cancelar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSchedulePage;
