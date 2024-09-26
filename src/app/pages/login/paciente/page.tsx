"use client";
import React from "react";
import CustomForm from "@/app/components/form/customForm";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const UserLoginPage = () => {
  const router = useRouter();
  // Função que será chamada ao submeter o formulário
  const handleLoginSubmit = async (formData: {email: string; nome: string}) => {
    console.log("Login data:", formData);

    try {
      const response = await fetch('http://localhost:8080/pacientes/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        // Handle successful login
        toast.success("Login efetuado com sucesso");
        localStorage.setItem('userToken', data.id);
        localStorage.setItem('userCargo', 'paciente');
        console.log("Login successful");
        setTimeout(() => {
          router.push('/pages/consultas/autorizados/calendario');
        }, 1000);
      } else {
        // Handle login error
        console.error("Login failed:", data);
        throw new Error("Login failed");
      }

    } catch (error) {
      toast.error("Erro ao fazer login: Usuário inválido");
      console.error("Error during login:", error);
    }

  };

  return (
    <div className="bg-[url('/assets/fundo.jpg')] bg-cover bg-center min-h-screen flex justify-center items-center">
      <ToastContainer />
      {/* Overlay */}
      <div className="absolute inset-0 bg-customBlue opacity-60"></div>

      {/* Central Block */}
      <div className="relative w-3/5 h-auto bg-white shadow-lg rounded-lg flex">
        {/* Left side (2/5) */}
        <div className="w-2/5 bg-blue-900 text-white flex flex-col justify-center items-center rounded-l-lg">
          <h1 className="text-2xl font-bold">OLM Clínicas</h1>
          <h3>O melhor para sua saúde</h3>
        </div>

        {/* Right side (3/5) - Usando o CustomForm */}
        <div className="w-3/5 p-8 flex flex-col justify-center items-center">
          {/* Chama o componente CustomForm */}
          <CustomForm
            title="Paciente"
            fields={[
              { label: "E-mail", name: "email", type: "email" },
              { label: "Data de Nascimento", name: "birthDate", type: "date" },
            ]}
            buttonText="Entrar"
            onSubmit={handleLoginSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default UserLoginPage;
