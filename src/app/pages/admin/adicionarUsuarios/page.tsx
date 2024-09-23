"use client";
import React, { useState } from "react";

interface FormField {
  label: string;
  name: string;
  type: string;
}

const UserAdminPage = () => {
  // Estado para armazenar o tipo de usuário selecionado e os dados do formulário
  const [selectedUserType, setSelectedUserType] = useState<
    "medico" | "atendente" | "paciente"
  >("medico");
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Definindo campos com base no tipo de usuário
  const userFields: Record<string, FormField[]> = {
    medico: [{ label: "Nome", name: "nome", type: "text" }],
    atendente: [
      { label: "Nome", name: "nome", type: "text" },
      { label: "Email", name: "email", type: "email" },
      { label: "Senha", name: "senha", type: "password" },
    ],
    paciente: [
      { label: "CPF", name: "cpf", type: "text" },
      { label: "Data de Nascimento", name: "dataNascimento", type: "date" },
    ],
  };

  // Função para lidar com mudanças no input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Função para enviar o formulário
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(`Cadastro de ${selectedUserType}:`, formData);
    // Aqui você pode adicionar a lógica de envio de dados
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <p className="text-center font-bold text-3xl mb-8 mt-10">
        Cadastro de Usuários
      </p>
      {/* Barra de navegação para selecionar o tipo de usuário */}
      <div className="mb-8 flex space-x-8 text-lg font-semibold">
        <span
          onClick={() => setSelectedUserType("medico")}
          className={`cursor-pointer ${
            selectedUserType === "medico" ? "border-b-2 border-blue-600" : ""
          }`}
        >
          Médico
        </span>
        <span
          onClick={() => setSelectedUserType("atendente")}
          className={`cursor-pointer ${
            selectedUserType === "atendente" ? "border-b-2 border-blue-600" : ""
          }`}
        >
          Atendente
        </span>
        <span
          onClick={() => setSelectedUserType("paciente")}
          className={`cursor-pointer ${
            selectedUserType === "paciente" ? "border-b-2 border-blue-600" : ""
          }`}
        >
          Paciente
        </span>
      </div>

      {/* Formulário dinâmico */}
      <div className="bg-gray-300 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4">
          Cadastro de{" "}
          {selectedUserType.charAt(0).toUpperCase() + selectedUserType.slice(1)}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {userFields[selectedUserType].map((field, index) => (
            <div key={index} className="flex flex-col">
              <label
                htmlFor={field.name}
                className="mb-2 text-lg font-semibold"
              >
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={formData[field.name] || ""}
                onChange={handleInputChange}
                className="px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-600"
              />
            </div>
          ))}
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserAdminPage;
