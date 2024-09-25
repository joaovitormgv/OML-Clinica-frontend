"use client";
import React from "react";
import CustomForm from "@/app/components/form/customForm";
import LogoutButton from "@/app/components/logout/logout";

const AdminLoginPage = () => {
  // Função que será chamada ao submeter o formulário
  const handleLoginSubmit = async (formData: { email: string; nome: string }) => {
    console.log("handleLoginSubmit called with:", formData);
  
    try {
      const response = await fetch('http://localhost:8080/usuarios/login', {
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
        // Handle successful login
        localStorage.setItem('userToken', data.id);
        console.log("Login successful");
      } else {
        // Handle login error
        console.error("Login failed:", data);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="bg-[url('/assets/fundo.jpg')] bg-cover bg-center min-h-screen flex justify-center items-center">
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
        <div className="w-3/5 p-8 flex flex-col justify-center items-center text-black">
          {/* Chama o componente CustomForm */}
          <CustomForm
            title="Login Usuário"
            fields={[
              { label: "Email", name: "email", type: "text" },
              { label: "Nome", name: "nome", type: "text" },
            ]}
            buttonText="Entrar"
            onSubmit={handleLoginSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
