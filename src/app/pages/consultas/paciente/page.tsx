"use client";
import React, { useEffect, useState } from "react";
import Mostrador from "@/app/components/mostrador/mostrador";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserSchedulePage = () => {
  interface Consulta {
    id: number;
    day: number;
    month: number;
    year: number;
    doctor: string;
    patient: string;
    time: string;
  }

  const initialAppointments: Consulta[] = [];

  interface NewConsultationData {
    id: number;
    paciente: {
      [x: string]: any; id: number
    };
    medico: {
      [x: string]: any; id: number
    };
    data: string;
    dataHora: string;
    horario: string;
  }

  const [myConsultas, setMyConsultas] = useState<NewConsultationData[]> ([]);
  const [appointments, setAppointments] = useState(initialAppointments);

  useEffect(() => {
    const fetchConsultasUsuario = async () => {
      try {
        const userId = localStorage.getItem("userToken");
        const userCargo = localStorage.getItem("userCargo");
        if (!userId || userCargo !== "paciente") {
          throw new Error("Paciente não autenticado");
        }

        const response = await fetch(`http://localhost:8080/consultas/paciente/${userId}`);
        const data = await response.json();
        setMyConsultas(data);
        console.log("Consultas do usuário:", data);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Erro ao buscar consultas do usuário: ${error.message}`);
        } else {
          toast.error("Erro ao buscar consultas do usuário");
        }
        console.error("Erro ao buscar consultas do usuário:", error);
      }
    };
    fetchConsultasUsuario();
  }, []);

  const handleCancelConsulta = async (consultaId: number) => {
    try {
      const confirm = window.confirm("Tem certeza que deseja cancelar esta consulta?");
      if (!confirm) {
        return;
      }

      const response = await fetch(`http://localhost:8080/consultas/${consultaId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Atualize a lista de consultas após a exclusão
      setMyConsultas((prevConsultas: NewConsultationData[]) => prevConsultas.filter((consulta: NewConsultationData) => consulta.id !== consultaId));
      alert("Consulta cancelada com sucesso");
    } catch (error) {
      console.error("Erro ao cancelar consulta:", error);
      toast.error("Erro ao cancelar consulta");
    }
  };

  useEffect(() => {
    const serializedAppointments = myConsultas.map((consulta) => {
      const data = new Date(consulta.dataHora);
      const formattedDate = data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      const formattedTime = data.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
      const [day, month, year] = formattedDate.split("/").map(Number);
      const time = formattedTime;
      return {
        id: consulta.id,
        day,
        month,
        year,
        doctor: consulta.medico.nome,
        patient: consulta.paciente.nome, 
        time,
      };
    });
    setAppointments(serializedAppointments);
  }, [myConsultas]);

  return (
    <div className="w-full flex flex-row h-screen">
      <ToastContainer />
      <div className="w-1/5 bg-gray-200 h-screen">
        <div id="leftside-content" className="flex flex-col mt-10 text-black">
          <p className="flex items-center justify-center font-bold text-xl">
            Filtros
          </p>
          <div id="filters" className="font-semibold flex flex-col ml-5 mt-5">
            <p>Data</p>
            <p>Médico</p>
          </div>
        </div>
      </div>
      <div className="w-4/5 h-full overflow-hidden">
        <div id="rightside-content" className="flex flex-col mt-10 ml-8">
          <p className="text-2xl font-bold">Minhas Consultas</p>
          <input
            type="text"
            placeholder="Pesquisar..."
            className="mt-1 px-2 py-1 border-2 border-blue-700 rounded-lg focus:outline-none focus:border-blue-700 w-48"
          />
          <div id="showschedule" className="mt-6">
            {/* Aqui você renderiza o componente Mostrador passando os dados */}
            <Mostrador
              dados={appointments
                .map((app) => ({
                  id: app.id,
                  medico: app.doctor,
                  paciente: app.patient,
                  data: `${app.day}/${app.month}/${app.year}`,
                  horario: app.time,
                }))}
              onCancel={handleCancelConsulta}

            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSchedulePage;
