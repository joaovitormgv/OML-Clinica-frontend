import React from "react";

interface MostradorProps {
  dados: {
    medico: string;
    paciente: string;
    data: string;
  }[];
}

const Mostrador: React.FC<MostradorProps> = ({ dados }) => {
  return (
    <div className="h-screen overflow-y-auto">
      <div className="flex flex-col space-y-4 p-4">
        {dados.map((item, index) => (
          <div
            key={index}
            className="bg-gray-300 rounded-lg p-4 flex justify-between items-center"
          >
            {/* Informações de Médico, Paciente, e Data */}
            <div className="flex flex-col space-x-4">
              <div className="flex space-x-8">
                <div className="flex flex-col text-left">
                  <span>Médico</span>
                  <span className="text-gray-600">{item.medico}</span>
                </div>
                <div className="flex flex-col text-left">
                  <span>Paciente</span>
                  <span className="text-gray-600">{item.paciente}</span>
                </div>
                <div className="flex flex-col text-left">
                  <span>Data</span>
                  <span className="font-bold">{item.data}</span>
                </div>
              </div>
            </div>

            {/* Botões de Remarcar e Cancelar */}
            <div className="flex flex-col items-end space-y-2">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Remarcar
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                Cancelar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mostrador;
