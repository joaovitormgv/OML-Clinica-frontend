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
  const [editingUserId, setEditingUserId] = useState<number | null>(null); // Armazenando o ID do usuário que está sendo editado
  const [editedUser, setEditedUser] = useState<Partial<User>>({});


    useEffect(() => {
      const fetchMedicos = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/medicos`);
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
        } catch (error) {
          console.error("Erro ao buscar médicos", error);
        }
      };
      fetchMedicos();
    }, []);


    useEffect(() => {
      const fetchAtendentes = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios`)
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
        } catch (error) {
          console.error("Erro ao buscar administradores", error);
        }
      };
      fetchAtendentes();
    }, []);

    useEffect(() => {
      const fetchPacientes = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pacientes`);
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
        } catch (error) {
          console.error("Erro ao buscar pacientes", error);
        }
      };
      fetchPacientes();
    }, []);
  




  useEffect(() => {

    const role = localStorage.getItem("userCargo"); // Pode ser "Administrador", "Atendente" ou "Paciente"
    setUserRole(role);
  }, []);

  const deleteMedico = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/medicos/${id}`, {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${id}`, {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pacientes/${id}`, {
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
    setUsers(usersByRole);
  }, [selectedRole, medicos, admins, pacientes]);

    // Função para iniciar a edição de um usuário
    const startEditing = (user: User) => {
      setEditingUserId(user.id);
      setEditedUser({ nome: user.nome, email: user.email, cargo: user.cargo });
      console.log(`Iniciando edição do usuário ${user.id}`);
      console.log(`Nome: ${user.nome}`);
      console.log(`Email: ${user.email}`);
    };
  
    // Função para salvar as alterações do usuário
    const saveUser = (id: number) => {
      console.log(`Salvando alterações do usuário ${id}`);

      // Atualizar o usuário no backend
      switch (editedUser.cargo) {
        case "Médico":
          console.log("Atualizando médico");
          const editMedico = async () => {
            try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/medicos/${id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(editedUser),
              });
              if (!response.ok) {
                throw new Error("Erro ao atualizar médico");
              }
              setMedicos((medicos) =>
                medicos.map((medico) => (medico.id === id ? { ...medico, ...editedUser } : medico))
              );
              console.log("Médico atualizado com sucesso");
              toast.success("Médico atualizado com sucesso");
            } catch (error) {
              console.error("Erro ao atualizar médico", error);
              toast.error("Erro ao atualizar médico");
            }
          }

          editMedico();
          break;
        case "Atendente":
          console.log("Atualizando atendente");
          const editAtendente = async () => {
            try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(editedUser),
              });
              if (!response.ok) {
                throw new Error("Erro ao atualizar atendente");
              }
              setAdmins((admins) =>
                admins.map((admin) => (admin.id === id ? { ...admin, ...editedUser } : admin))
              );
              console.log("Atendente atualizado com sucesso");
              toast.success("Atendente atualizado com sucesso");
            } catch (error) {
              console.error("Erro ao atualizar atendente", error);
              toast.error("Erro ao atualizar atendente");
            }
          }

          editAtendente();
          break;

        case "Paciente":
          console.log("Atualizando paciente");
          const editPaciente = async () => {
            try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pacientes/${id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(editedUser),
              });
              if (!response.ok) {
                const errorText = await response.text();
                console.log("Erro na resposta do servidor:", response.status, errorText);
                throw new Error("Erro ao atualizar paciente");

              }
              setPacientes((pacientes) =>
                pacientes.map((paciente) => (paciente.id === id ? { ...paciente, ...editedUser } : paciente))
              );
              toast.success("Paciente atualizado com sucesso");
              console.log("Paciente atualizado com sucesso");
            } catch (error) {
              console.error("Erro ao atualizar paciente", error);
              toast.error("Erro ao atualizar paciente");
            }
          }

          editPaciente();
          break;
        default:
          console.error("Cargo inválido");
          break;
      }

      setEditingUserId(null);
    };
  
    // Função para cancelar a edição
    const cancelEditing = () => {
      setEditingUserId(null);
      setEditedUser({});
    };
  

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
                {editingUserId === user.id ? (
                  <>
                    <td className="border px-4 py-2">{user.cargo}</td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        value={editedUser.nome}
                        onChange={(e) => setEditedUser({ ...editedUser, nome: e.target.value })}
                        className="border-2 border-gray-300 rounded-md p-2"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="email"
                        value={editedUser.email}
                        onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                        className="border-2 border-gray-300 rounded-md p-2"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => saveUser(user.id)}
                        className="bg-green-500 text-white py-1 px-3 rounded-lg mr-2 hover:bg-green-600"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
                      >
                        Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                <>
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
                  onClick={() => startEditing(user)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
                  >
                  Editar
                  </button>
                </td>
                )}
                </>
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
