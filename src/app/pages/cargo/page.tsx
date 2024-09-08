"use client"
import React from "react"
import Link from "next/link"

const CargoPage = () => {
    return (
        <div className="bg-[url('/assets/fundo.jpg')] bg-cover bg-center min-h-screen pt-20">
            <div className="absolute inset-0 bg-customBlue opacity-60 "></div>
            <div className="relative flex flex-col bg-customBlue w-[35%] h-32 rounded-xl items-center justify-center text-white z-10 mx-auto"> 
                <h1 className="text-4xl font-bold">OML Clínicas</h1>
                <h2 className="text-2xl font-bold">Agendamento de Consultas</h2>
            </div>

            <div className="relative flex flex-col items-center justify-center mt-10 gap-10">
                <h3 className="text-2xl font-semibold">Selecione o seu cargo</h3>
                <button className ="bg-white w-[25%] h-16 text-customBlue rounded-xl">
                    <Link href="/auth" className="font-bold text-xl">Administrador</Link>
                </button>
                <button className ="bg-white w-[25%] h-16 text-customBlue rounded-xl">
                    <Link href="/auth" className="font-bold text-xl">Atendente</Link>
                </button>
                <button className ="bg-white w-[25%] h-16 text-customBlue rounded-xl">
                    <Link href="/auth/paciente" className="font-bold text-xl">Paciente</Link>
                </button>
            </div>
        </div>
    )
}

export default CargoPage