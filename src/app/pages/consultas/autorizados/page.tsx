"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Select from "react-select";
import { format } from "date-fns";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { debounce } from "lodash";



const AdminSchedulePage = () => {
  const router = useRouter();

  interface Consulta {
    id: any;
    paciente: { id: number };
    medico: { id: number };
    data: string;
    horario: string;
    dataHora: string;
    status: string;
  }

  interface Entidade {
    id: number;
    nome: string;
  }

  interface SelectOption {
    value: number;
    label: string;
  }



  const horariosFixos = [
    "08:00", "09:00", "10:00", "11:00",
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  const [pacientes, setPacientes] = useState<Entidade[]>([]);
  const [medicos, setMedicos] = useState<Entidade[]>([]);
  const [originalConsultas, setOriginalConsultas] = useState<Consulta[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>([]);

  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>(horariosFixos);

  const searchParams = useSearchParams();
  let showMenu = searchParams.get('showMenu') === 'true';
  console.log("Show menu:", showMenu);

  if ( !showMenu ) {
    showMenu = false;
  }

  const [showNewConsultationMenu, setShowNewConsultationMenu] = useState(showMenu);
  const [newConsultationData, setNewConsultationData] = useState({
    id: 0,
    paciente: { id: 0 },
    medico: { id: 0 },
    data: "",
    horario: "",
    dataHora: "",
    status: ""
  });

  // Filter consts
  const [selectedMedico, setSelectedMedico] = useState<SelectOption | null>(null);
  const [selectedPaciente, setSelectedPaciente] = useState<SelectOption | null>(null);
  const [selectedData, setSelectedData] = useState<string | null>(null);

  // Consulta de todos os pacientes no banco de dados
  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await fetch("http://localhost:8080/pacientes");
        const data = await response.json();
        setPacientes(data);
        console.log("Pacientes:", data);
      } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
      }
    };

    fetchPacientes();
  }, []);



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

  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        const response = await fetch("http://localhost:8080/consultas");
        const data = await response.json();
        setOriginalConsultas(data);
        setConsultas(data);
        console.log("Consultas:", data);
      } catch (error) {
        console.error("Erro ao buscar consultas:", error);
      }
    };
    fetchConsultas();
  }, []);

  const fetchHorariosDisponiveis = async (medicoId: number, data: string) => {
    if (!medicoId || !data) return;

    try {
      const response = await fetch(`http://localhost:8080/consultas/medicoDia?medicoId=${medicoId}&data=${data}`);


      const consultas = await response.json();
      const horariosOcupados: string[] = consultas.map((consulta: { horario: string }) => consulta.horario);
      const horariosDisponiveis = horariosFixos.filter((horario) => !horariosOcupados.includes(horario));

      setHorariosDisponiveis(horariosDisponiveis);
    } catch (error) {
      setHorariosDisponiveis(horariosFixos);
    }
  };

  // Função debounced para buscar horários disponíveis
  const debouncedFetchHorariosDisponiveis = useCallback(
    debounce((medicoId: number, data: string) => {
      fetchHorariosDisponiveis(medicoId, data);
    }, 600), // 600ms de debounce
    []
  );



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewConsultationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "data" || name === "medico") {
      debouncedFetchHorariosDisponiveis(
        newConsultationData.medico.id,
        value
      );
    }
  };

  const handleHorarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewConsultationData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      if (updatedData.data && updatedData.horario) {
        const dataHora = new Date(`${updatedData.data}T${updatedData.horario}`);
        updatedData.dataHora = format(dataHora, "yyyy-MM-dd'T'HH:mm");
      }
      return updatedData;
    });
  };


  const handleSelectChange = (selectedOption: SelectOption | null, name: string) => {
    setNewConsultationData((prevData) => ({
      ...prevData,
      [name]: { id: selectedOption ? selectedOption.value : "" }
    }));
  };

  // Função para enviar o formulário de nova consulta
  const handleAddConsultation = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    console.log("Nova Consulta:", newConsultationData);
    if (
      !newConsultationData.paciente.id ||
      !newConsultationData.medico.id ||
      !newConsultationData.data ||
      !newConsultationData.horario
    ) {
      toast.error("Preencha todos os campos para adicionar uma nova consulta.");
      return;
    }


    try {
      const response = await fetch("http://localhost:8080/consultas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newConsultationData),
      });

      console.log("HTTP status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      // Exibir mensagem de sucesso
      toast.success(`Consulta de ${pacientes.find(paciente => paciente.id === newConsultationData.paciente.id)?.nome} agendada com sucesso!`);
      setConsultas((prevConsultas) => [...prevConsultas, newConsultationData]);
      setNewConsultationData({
        id: 0,
        paciente: { id: 0 },
        medico: { id: 0 },
        data: "",
        horario: "",
        dataHora: "",
        status: ""
      });
      setShowNewConsultationMenu(false);
    } catch (error) {
      console.error("Erro ao adicionar consulta:", error);
    }

  };

  const handleFilterChange = (selectedOption: SelectOption | null, name: string) => {
    switch (name) {
      case "medico":
        setSelectedMedico(selectedOption);
        console.log("Medico selecionado:", selectedOption);
        break;
      case "paciente":
        setSelectedPaciente(selectedOption);
        console.log("Paciente selecionado:", selectedOption);
        break;
      default:
        break;
    }
  };


  const handleInputDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSelectedData(value);
    console.log("Data selecionada:", value);
  };

  const handleFilterSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    let filteredConsultas = originalConsultas;

    if (selectedMedico && selectedMedico.value !== 0) {
      filteredConsultas = filteredConsultas.filter((consulta) => consulta.medico.id === selectedMedico.value);
    }

    if (selectedPaciente && selectedPaciente.value !== 0) {
      filteredConsultas = filteredConsultas.filter((consulta) => consulta.paciente.id === selectedPaciente.value);
    }

    if (selectedData) {
      console.log("Consultas:", originalConsultas);
      const formattedSelectedData = new Date(selectedData).toISOString().split('T')[0];
      console.log("Data selecionada:", formattedSelectedData);
      filteredConsultas = filteredConsultas.filter((consulta) => consulta.dataHora && consulta.dataHora.includes(formattedSelectedData));
      console.log("Consultas filtradas:", filteredConsultas);
    }

    setConsultas(filteredConsultas);
  }



  return (
    <div className="w-full flex flex-row">
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

            <div>
              <p>Paciente</p>
              <div id="doctor-filter" className="flex flex-col ml-5 mt-2 gap-2">
                <Select
                  name="paciente"
                  onChange={(selectedOption: SelectOption | null) => handleFilterChange(selectedOption, "paciente")}
                  options={[
                    { value: 0, label: "Todos" },
                    ...pacientes.map((paciente) => ({
                      value: paciente.id,
                      label: paciente.nome,
                    })),
                  ]}
                  className="w-3/4"
                />
              </div>
            </div>
            <button
              className="bg-blue-700 text-white px-4 py-2 mr-5 rounded hover:bg-blue-600"
              type="submit"
            >
              Filtrar
            </button>
          </form>
        </div>
      </div>

      <div className="w-full flex flex-col items-center">

        <div className="w-4/5 flex justify-between items-center mt-10">
          <p className="text-2xl font-bold">Todas Consultas</p>
          <button
            onClick={() => setShowNewConsultationMenu((prev) => !prev)}
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            + Nova Consulta
          </button>
        </div>

        {/* Menu para adicionar nova consulta */}
        {showNewConsultationMenu && (
          <div className="w-4/5 bg-gray-100 p-4 rounded-lg mt-4 text-black">
            <h2 className="text-lg font-semibold mb-4">
              Adicionar Nova Consulta
            </h2>
            <form onSubmit={handleAddConsultation}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold">Nome do Paciente</label>
                  <Select
                    name="paciente"
                    value={pacientes
                      .filter(paciente => paciente.id === Number(newConsultationData.paciente.id))
                      .map(paciente => ({ value: paciente.id, label: paciente.nome }))[0] || null}
                    onChange={(selectedOption: SelectOption | null) => handleSelectChange(selectedOption, "paciente")}
                    options={pacientes.map((paciente) => ({
                      value: paciente.id,
                      label: paciente.nome,
                    }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Nome do Médico</label>
                  <Select
                    name="medico"
                    value={medicos
                      .filter(medico => medico.id === Number(newConsultationData.medico.id))
                      .map(medico => ({ value: medico.id, label: medico.nome }))[0] || null}
                    onChange={(selectedOption: SelectOption | null) => handleSelectChange(selectedOption, "medico")}
                    options={medicos.map((medico) => ({
                      value: medico.id,
                      label: medico.nome,
                    }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Data</label>
                  <input
                    type="date"
                    name="data"
                    value={newConsultationData.data}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Horário</label>
                  <select
                    name="horario"
                    value={newConsultationData.horario}
                    onChange={handleHorarioChange}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-600"
                  >
                    {horariosDisponiveis.length === 0 ?
                      <option value="">Sem vagas nessa data. Tente escolher outro médico ou outra data.</option> :
                      <option value="">Selecione um horário</option>
                    }

                    {horariosDisponiveis.map((horario) => (
                      <option key={horario} value={horario}>
                        {horario}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Mostrador das consultas, 2 por linha */}
        <div className="w-4/5 grid grid-cols-2 gap-4 mt-6 mb-6 text-black">
          {consultas.map((consultation, index) => {
            const dataHora = new Date(consultation.dataHora);
            const dataFormatada = format(dataHora, "dd/MM/yyyy");
            return (
              <div key={index} className="bg-gray-300 p-4 rounded-lg">
                <p className="font-semibold">Médico: {medicos.find(medico => medico.id === consultation.medico.id)?.nome}</p>
                <p className="font-semibold">Paciente: {pacientes.find(paciente => paciente.id === consultation.paciente.id)?.nome}</p>
                <p className="text-sm">Data: {dataFormatada}</p>
                <p className="text-sm">Horário: {consultation.horario}</p>
                <div className="mt-2 flex space-x-2">
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500"
                    onClick={async () => {
                      // tem certeza que deseja cancelar a consulta?
                      const confirm = window.confirm("Tem certeza que deseja cancelar a consulta?");
                      if (!confirm) return;

                      try {
                        const response = await fetch(`http://localhost:8080/consultas/${consultation.id}`, {
                          method: "DELETE",
                        });
                        console.log("HTTP status:", response.status);
                        if (response.ok) {
                          toast.success("Consulta cancelada com sucesso");
                          setConsultas((prevConsultas) => {
                            const updatedConsultas = prevConsultas.filter((c) => c.dataHora !== consultation.dataHora);
                            return updatedConsultas;
                          });
                        } else {
                          toast.error("Erro ao cancelar consulta");
                        }
                      } catch (error) {
                        console.error("Erro ao cancelar consulta:", error);
                      }
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminSchedulePage;
