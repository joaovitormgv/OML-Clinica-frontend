"use client";
import React from "react";
import CustomForm from "@/app/components/form/customForm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const AdminRegisterPage = () => {
  const router = useRouter();
  // Função que será chamada ao submeter o formulário
  const handleRegisterSubmit = async (formData: Record<string, string>): Promise<void> => {
    if (!formData.nome || !formData.email || !formData.cargo) {
      console.error("Missing required fields");
      return;
    }

    try {
      console.log("handleRegisterSubmit called with:", formData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios`, {
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
        toast.success("Cadastro realizado com sucesso");
        console.log("Registration successful");
        setTimeout(() => {
          router.push('/pages/admin/login');
        }, 2000); // Espera 2 segundos antes de redirecionar
      } else {
        // Handle registration error
        console.error("Registration failed:", data);
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
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
            title="Cadastro"
            fields={[
              { label: "Nome", name: "nome", type: "text" },
              { label: "Email", name: "email", type: "text" },
              { label: "Cargo", name: "cargo", type: "text" },
            ]}
            buttonText="Cadastrar"
            onSubmit={handleRegisterSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminRegisterPage;
