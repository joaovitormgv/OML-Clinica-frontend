"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
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

  interface Entidade {
    id: number;
    nome: string;
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

  interface SelectOption {
    value: number;
    label: string;
  }

  const [myConsultas, setMyConsultas] = useState<NewConsultationData[]>([]);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [medicos, setMedicos] = useState<Entidade[]>([]);
  const [originalConsultas, setOriginalConsultas] = useState<NewConsultationData[]>([]);
  const [selectedMedico, setSelectedMedico] = useState<SelectOption | null>(null);
  const [selectedData, setSelectedData] = useState<string | null>(null);

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
        setOriginalConsultas(data);
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

  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const response = await fetch("http://localhost:8080/medicos");
        const data = await response.json();
        setMedicos(data);
        console.log("Medicos:", data);
      } catch (error) {
        console.error("Erro ao buscar médicos:", error);
      }
    };
    fetchMedicos();
  }, []);

  const handleFilterSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    let filteredConsultas = originalConsultas;

    if (selectedMedico && selectedMedico.value !== 0) {
      filteredConsultas = filteredConsultas.filter((consulta) => consulta.medico.id === selectedMedico.value);
    }

    if (selectedData) {
      console.log("Consultas:", originalConsultas);
      const formattedSelectedData = new Date(selectedData).toISOString().split('T')[0];
      console.log("Data selecionada:", formattedSelectedData);
      filteredConsultas = filteredConsultas.filter((consulta) => consulta.dataHora && consulta.dataHora.includes(formattedSelectedData));
      console.log("Consultas filtradas:", filteredConsultas);
    }


    setMyConsultas(filteredConsultas);
  }

  const handleInputDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSelectedData(value);
    console.log("Data selecionada:", value);
  };

  const handleFilterChange = (selectedOption: SelectOption | null, name: string) => {
    switch (name) {
      case "medico":
        setSelectedMedico(selectedOption);
        console.log("Medico selecionado:", selectedOption);
        break;
      default:
        break;
    }
  };


  return (
    <div className="w-full flex flex-row h-screen">
      <ToastContainer />
      <div className="w-1/5 bg-gray-200 h-screen">
        <div id="leftside-content" className="flex flex-col mt-10 text-black">
          <p className="flex items-center justify-center font-bold text-xl">
            Filtros
          </p>
          <form
            id="filters"
            className="font-semibold flex flex-col ml-5 mt-5 gap-4"
            onSubmit={handleFilterSubmit}
          >
            <div>
              <p>Data</p>
              <div id="date-filter" className="flex flex-col ml-5 mt-2 gap-2">
                <input
                  type="date"
                  name="data"
                  onChange={handleInputDataChange}
                  className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-600 w-3/4"
                />
              </div>
            </div>

            <div>
              <p>Médico</p>
              <div id="doctor-filter" className="flex flex-col ml-5 mt-2 gap-2">
                <Select
                  name="medico"
                  onChange={(selectedOption: SelectOption | null) => handleFilterChange(selectedOption, "medico")}
                  options={[
                    { value: 0, label: "Todos" },
                    ...medicos.map((medico) => ({
                      value: medico.id,
                      label: medico.nome,
                    })),
                  ]}
                  className="w-3/4"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold py-2 rounded-md mt-4 mr-5"
            >
              Filtrar
            </button>
          </form>
        </div>
      </div>
      <div className="w-4/5 h-full overflow-hidden">
        <div id="rightside-content" className="flex flex-col mt-10 ml-8">
          <p className="text-2xl font-bold">Minhas Consultas</p>
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

            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSchedulePage;
