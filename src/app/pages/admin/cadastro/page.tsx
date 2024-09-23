"use client";
import React from "react";
import CustomForm from "@/app/components/form/customForm";

const AdminRegisterPage = () => {
  // Função que será chamada ao submeter o formulário
  const handleLoginSubmit = (formData: Record<string, string>) => {
    console.log("Login data:", formData);
    // Aqui você pode lidar com o envio dos dados de login
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
        <div className="w-3/5 p-8 flex flex-col justify-center items-center">
          {/* Chama o componente CustomForm */}
          <CustomForm
            title="Cadastro"
            fields={[
              { label: "Nome", name: "name", type: "text" },
              { label: "Email", name: "email", type: "text" },
              { label: "Senha", name: "password", type: "password" },
            ]}
            buttonText="Cadastrar"
            onSubmit={handleLoginSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminRegisterPage;
