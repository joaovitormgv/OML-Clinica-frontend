"use client";
import React, { use, useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormField {
  label: string;
  name: string;
  type: string;
}

const UserAdminPage = () => {
  const [selectedUserType, setSelectedUserType] = useState<string>("paciente");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Estado para armazenar o tipo de usuário selecionado e os dados do formulário
  useEffect(() => {
    const role = localStorage.getItem("userCargo");
    setUserRole(role);
  }, []);

  // Definindo campos com base no tipo de usuário
  const userFields: Record<string, FormField[]> = {
    medico: [
      { label: "Nome", name: "nome", type: "text" },
      { label: "Especialidade", name: "especialidade", type: "text" },
      { label: "E-mail", name: "email", type: "text" },
      { label: "CPF", name: "cpf", type: "text" },
    ],
    atendente: [
      { label: "Nome", name: "nome", type: "text" },
      { label: "Email", name: "email", type: "email" },
    ],
    paciente: [
      { label: "Nome", name: "nome", type: "text" },
      { label: "E-mail", name: "email", type: "text" },
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(`Cadastro de ${selectedUserType}:`, FormData);
    // Aqui você pode adicionar a lógica de envio de dados
    switch (selectedUserType) {
      case "paciente":
        if (!formData.nome || !formData.email || !formData.cpf || !formData.dataNascimento) {
          console.error("Campos obrigatórios não preenchidos");
          return;
        }
        
        try {
          console.log("handleRegisterSubmit called with:", formData);

          const response = await fetch('http://localhost:8080/pacientes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });

          console.log("HTTP status:", response.status);
          const data = await response.json();
          console.log("Response data:", data);

          if (response.ok) {
            // Handle successful registration
            setFormData({});
            toast.success("Cadastro realizado com sucesso");
            console.log("Registration successful");
          } else {
            // Handle registration error
            console.error("Registration failed:", data);
            throw new Error("Registration failed");
          }
        } catch (error) {
          toast.error("Erro ao realizar cadastro");
          console.error("Error during registration:", error);
        }
        break;

      case "medico":
        if (!formData.nome || !formData.email || !formData.cpf || !formData.especialidade) {
          console.error("Campos obrigatórios não preenchidos");
          return;
        }
        
        try {
          console.log("handleRegisterSubmit called with:", formData);

          const response = await fetch('http://localhost:8080/medicos', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });

          console.log("HTTP status:", response.status);
          const data = await response.json();
          console.log("Response data:", data);

          if (response.ok) {
            // Handle successful registration
            setFormData({});
            toast.success("Cadastro realizado com sucesso");
            console.log("Registration successful");
          } else {
            // Handle registration error
            console.error("Registration failed:", data);
            throw new Error("Registration failed");
          }
        } catch (error) {
          toast.error("Erro ao realizar cadastro");
          console.error("Error during registration:", error);
        }
        break;
      
      case "atendente":
        formData.cargo = "Atendente";

        if (!formData.nome || !formData.email || !formData.cargo) {
          console.error("Campos obrigatórios não preenchidos");
          return;
        }

        try {
          console.log("handleRegisterSubmit called with:", formData);

          const response = await fetch('http://localhost:8080/usuarios', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });

          console.log("HTTP status:", response.status);
          const data = await response.json();
          console.log("Response data:", data);

          if (response.ok) {
            // Handle successful registration
            setFormData({});
            toast.success("Cadastro realizado com sucesso");
            console.log("Registration successful");
          } else {
            // Handle registration error
            console.error("Registration failed:", data);
            throw new Error("Registration failed");
          }
        } catch (error) {
          toast.error("Erro ao realizar cadastro");
          console.error("Error during registration:", error);
        }

      }
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <ToastContainer />
      <p className="text-center font-bold text-3xl mb-8 mt-10">
        Cadastro de Usuários
      </p>
      {/* Barra de navegação para selecionar o tipo de usuário */}
      <div className="mb-8 flex space-x-8 text-lg font-semibold">
        <span
          onClick={() => setSelectedUserType("paciente")}
          className={`cursor-pointer ${selectedUserType === "paciente" ? "border-b-2 border-blue-600" : ""
            }`}
        >
          Paciente
        </span>
        { userRole === "Administrador" && (
        <>
          <span
          onClick={() => setSelectedUserType("medico")}
          className={`cursor-pointer ${selectedUserType === "medico" ? "border-b-2 border-blue-600" : ""
            }`}
        >
          Médico
        </span>
        <span
          onClick={() => setSelectedUserType("atendente")}
          className={`cursor-pointer ${selectedUserType === "atendente" ? "border-b-2 border-blue-600" : ""
            }`}
        >
          Atendente
        </span>
        </>
        )}
      </div>

      {/* Formulário dinâmico */}
      <div className="bg-gray-300 p-8 rounded-lg shadow-lg w-96 text-black">
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
