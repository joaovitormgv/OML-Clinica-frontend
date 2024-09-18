"use client";
import React from "react";

const UserLoginPage = () => {
  return (
    <div className="bg-[url('/assets/fundo.jpg')] bg-cover bg-center min-h-screen flex justify-center items-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-customBlue opacity-60"></div>

      {/* Central Block */}
      <div className="relative w-3/5 h-96 bg-white shadow-lg rounded-lg flex">
        {/* Left side (2/5) */}
        <div className="w-2/5 bg-blue-900 text-white flex flex-col justify-center items-center rounded-l-lg">
          <h1 className="text-2xl font-bold">OLM Clínicas</h1>
          <h3>O melhor para sua saúde</h3>
        </div>

        {/* Right side (3/5) */}
        <div className="w-3/5 p-8 flex flex-col justify-center items-center">
          <h1 className="font-bold mb-8 text-2xl">Paciente</h1>
          <label className="font-semibold">CPF</label>
          <input
            type="text"
            className="mb-4 px-2 py-2 border-2 border-blue-700 rounded-lg focus:outline-none focus:border-blue-700 "
          />
          <label className="font-semibold">Data de Nascimento</label>
          <input
            type="text"
            placeholder="DD/MM/AAAA"
            className="mb-6 px-2 py-2 border-2 border-blue-700 rounded-lg focus:outline-none focus:border-blue-700 "
          />
          <button className=" bg-blue-700 text-white py-2 px-8 w-2/4 rounded hover:bg-blue-600">
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserLoginPage;
