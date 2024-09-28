"use client";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface User {
  id: number;
  nome: string;
  tipo: string; // paciente, medico, atendente
}

const ViewUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("todos");
  const [userRole, setUserRole] = useState<string | null>(null); // Armazenando o cargo do usuário

  // Simulando dados fictícios de usuários
  useEffect(() => {
    // Usuários fictícios
    const fakeUsers: User[] = [
      { id: 1, nome: "Carlos Silva", tipo: "Paciente" },
      { id: 2, nome: "Dr. João Souza", tipo: "Médico" },
      { id: 3, nome: "Maria Clara", tipo: "Atendente" },
      { id: 4, nome: "Ana Paula", tipo: "Paciente" },
      { id: 5, nome: "Dr. Fernanda Lima", tipo: "Médico" },
    ];

    setUsers(fakeUsers);

    // Simulando o papel do usuário (substitua pela lógica de autenticação real)
    const role = localStorage.getItem("userCargo"); // Pode ser "Administrador", "Atendente" ou "Paciente"
    setUserRole(role);
  }, []);

  // Função para excluir um usuário
  const deleteUser = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId)); // Simulando a exclusão
    toast.success("Usuário excluído com sucesso");
  };

  // Filtra os usuários com base no cargo selecionado
  const filteredUsers =
    selectedRole === "todos"
      ? users
      : users.filter((user) => user.tipo === selectedRole);

  // Filtra a lista de usuários de acordo com as permissões do cargo
  const permittedUsers =
    userRole === "Administrador"
      ? filteredUsers
      : filteredUsers.filter(
          (user) => user.tipo === "Paciente" && userRole === "Atendente"
        );

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
            onChange={(e) => setSelectedRole(e.target.value)}
            className="border-2 border-gray-300 rounded-md p-2"
          >
            <option value="todos">Todos</option>
            <option value="Paciente">Paciente</option>
            <option value="Médico">Médico</option>
            <option value="Atendente">Atendente</option>
          </select>
        </div>
      )}

      <div className="w-full max-w-4xl bg-gray-300 p-8 rounded-lg shadow-lg mb-8">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Cargo</th>
              <th className="px-4 py-2">Nome</th>
              {userRole !== "Paciente" && <th className="px-4 py-2">Ação</th>}
            </tr>
          </thead>
          <tbody>
            {permittedUsers.map((user) => (
              <tr key={user.id}>
                <td className="border px-4 py-2">{user.tipo}</td>
                <td className="border px-4 py-2">{user.nome}</td>
                {userRole !== "Paciente" && (
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
                    >
                      Excluir
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
