"use client";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface User {
  id: number;
  nome: string;
  email: string;
  cargo: string; // paciente, medico, atendente
  uniqueId: string;
}

const ViewUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [medicos, setMedicos] = useState<User[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);
  const [pacientes, setPacientes] = useState<User[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("Paciente");
  const [userRole, setUserRole] = useState<string | null>(null); // Armazenando o cargo do usuário

  // Simulando dados fictícios de usuários

    useEffect(() => {
      const fetchMedicos = async () => {
        try {
          const response = await fetch("http://localhost:8080/medicos");
          if (!response.ok) {
            throw new Error("Erro ao buscar médicos");
          }
          const data = await response.json();
          const medicosComCargo = data.map((medico: User) => ({
            ...medico,
            cargo: "Médico",
            uniqueId: `${medico.id}-medico`,
          }));
          setMedicos(medicosComCargo);
          console.log("Médicos buscados com sucesso", data);
        } catch (error) {
          console.error("Erro ao buscar médicos", error);
        }
      };
      fetchMedicos();
    }, []);


    useEffect(() => {
      const fetchAtendentes = async () => {
        try {
          const response = await fetch("http://localhost:8080/usuarios")
          if (!response.ok) {
            throw new Error("Erro ao buscar administradores");
          }
          const data = await response.json();
          // filtrar usuarios apenas atendentes
          const atendentes = data
          .filter((admin: User) => admin.cargo === "Atendente")
          .map((atendente: User) => ({
            ...atendente,
            cargo: "Atendente",
            uniqueId: `${atendente.id}-atendente`,
          }))
          ;
          setAdmins(atendentes);
          console.log("Atendentes buscados com sucesso", atendentes);
        } catch (error) {
          console.error("Erro ao buscar administradores", error);
        }
      };
      fetchAtendentes();
    }, []);

    useEffect(() => {
      const fetchPacientes = async () => {
        try {
          const response = await fetch("http://localhost:8080/pacientes");
          if (!response.ok) {
            throw new Error("Erro ao buscar pacientes");
          }
          const data = await response.json();
          const pacientesComCargo = data.map((paciente: User) => ({
            ...paciente,
            cargo: "Paciente",
            uniqueId: `${paciente.id}-paciente`,
          }));
          setPacientes(pacientesComCargo);
          console.log("Pacientes buscados com sucesso", pacientesComCargo);
        } catch (error) {
          console.error("Erro ao buscar pacientes", error);
        }
      };
      fetchPacientes();
    }, []);
  




  useEffect(() => {

    const role = localStorage.getItem("userCargo"); // Pode ser "Administrador", "Atendente" ou "Paciente"
    setUserRole(role);
    console.log(`Cargo do usuário: ${role}`);
  }, []);

  const deleteMedico = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/medicos/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Erro ao excluir médico: médico tem consultas agendadas");
      }
      setMedicos((medicos) => medicos.filter((medico) => medico.id !== id));
      toast.success("Médico excluído com sucesso");
    } catch (error) {
      console.error("Erro ao excluir médico", error);
      if (error instanceof Error) {
        toast.error(`${error.message}`);
      } else {
        toast.error("Erro ao excluir médico");
      }
    }
  }

  const deleteAtendente = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/usuarios/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Erro ao excluir atendente");
      }
      setAdmins((admins) => admins.filter((admin) => admin.id !== id));
      toast.success("Atendente excluído com sucesso");
    } catch (error) {
      console.error("Erro ao excluir atendente", error);
      toast.error("Erro ao excluir atendente");
    }
  }

  const deletePaciente = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/pacientes/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Erro ao excluir paciente: paciente tem consultas agendadas");
      }
      setPacientes((pacientes) => pacientes.filter((paciente) => paciente.id !== id));
      toast.success("Paciente excluído com sucesso");
    } catch (error) {
      console.error("Erro ao excluir paciente", error);
      if (error instanceof Error) {
        toast.error(`${error.message}`);
      } else {
      toast.error("Erro ao excluir paciente");
      }
    }
  }

  // Função para excluir um usuário
  const deleteUser = (cargo: string, id: number) => {
    switch (cargo) {
      case "Médico":
        deleteMedico(id);
        break;
      case "Atendente":
        deleteAtendente(id);
        break;
      case "Paciente":
        deletePaciente(id);
        break;
      default:
        console.error("Cargo inválido");
    }
    
  };

  
  const getUsersByRole = () => {
    if (selectedRole === "medicos") {
      return medicos;
    } else if (selectedRole === "Atendente") {
      return admins;
    } else if (selectedRole === "Paciente") {
      return pacientes;
    } else {
      return [...medicos, ...admins, ...pacientes];
    }
  };  
  
  // Filtra os usuários com base no cargo selecionado
  useEffect(() => {
    const usersByRole = getUsersByRole();
    console.log(`Usuários filtrados por cargo: ${selectedRole}`, usersByRole);
    usersByRole.map((user) => console.log(user.uniqueId));
    setUsers(usersByRole);
  }, [selectedRole, medicos, admins, pacientes]);

  return (
    <div className="min-h-screen flex flex-col items-center">
      <ToastContainer />
      <p className="text-center font-bold text-3xl mb-8 mt-10">
        Central de Usuários
      </p>

      {/* Seletor de cargo */}
      {userRole !== "Paciente" && (
        <div className="mb-4">
          <label htmlFor="role" className="text-lg font-semibold mr-2">
            Tipo de usuário a visualizar:
          </label>
          <select
            id="role"
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
            }}
            className="border-2 border-gray-300 rounded-md p-2"
          >
            {userRole === "Administrador" ? (
              <>
                <option value="Paciente">Paciente</option>
                <option value="Médico">Médico</option>
                <option value="Atendente">Atendente</option>
              </>
            ) : userRole === "Atendente" && (
              <option value="Paciente">Paciente</option>
            )
            }
          </select>
        </div>
      )}

      <div className="w-full max-w-4xl bg-gray-300 p-8 rounded-lg shadow-lg mb-8">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Cargo</th>
              <th className="px-4 py-2">Nome</th>
              <th className="px-4 py-2">Email</th>
              {userRole !== "Paciente" && <th className="px-4 py-2">Ação</th>}
            </tr>
          </thead>
          <tbody>
            {users
              .filter((user) => user.cargo === selectedRole || selectedRole === "")
              .map((user) => (
              <tr key={user.uniqueId}>
                <td className="border px-4 py-2">{user.cargo}</td>
                <td className="border px-4 py-2">{user.nome}</td>
                <td className="border px-4 py-2">{user.email}</td>
                {userRole !== "Paciente" && (
                <td className="border px-4 py-2">
                  <button
                  onClick={() => deleteUser(user.cargo, user.id)}
                  className="bg-red-500 text-white py-1 px-3 rounded-lg mr-2 hover:bg-red-600"
                  >
                  Excluir
                  </button>
                  <button
                  onClick={() => {}}
                  className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
                  >
                  Editar
                  </button>
                </td>
                )}
              </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewUsersPage;
