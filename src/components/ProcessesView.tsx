import React, { useState, useEffect } from "react";
import { Service } from "../types";
import ProcessesList from "./ProcessesList";

interface ProcessesViewProps {
  services: Service[];
  onServiceUpdate: (updatedService: Service) => void;
}

export const ProcessesView: React.FC<ProcessesViewProps> = ({
  services,
  onServiceUpdate,
}) => {
  const [selectedService, setSelectedService] = useState<string>("all");
  const [filteredServices, setFilteredServices] = useState<Service[]>(services);

  useEffect(() => {
    if (selectedService === "all") {
      setFilteredServices(services);
    } else {
      setFilteredServices(services.filter((s) => s.id === selectedService));
    }
  }, [selectedService, services]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Encabezado */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Procesos</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gestión de procesos por servicio
            </p>
          </div>

          {/* Selector de servicio */}
          <div className="flex-shrink-0">
            <div className="relative">
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="appearance-none block w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">Todos los servicios</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de procesos */}
        <div className="bg-white rounded-lg shadow">
          <div className="divide-y divide-gray-200">
            {filteredServices.map((service) => (
              <div key={service.id} className="p-0">
                {selectedService === "all" && (
                  <div className="px-6 py-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">
                          {service.name}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 flex items-center">
                          <span className="inline-block h-2 w-2 rounded-full bg-green-400 mr-2"></span>
                          {service.provider}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {service.id.slice(0, 8)}
                      </div>
                    </div>
                  </div>
                )}
                <div
                  className={
                    selectedService === "all" ? "border-t border-gray-200" : ""
                  }
                >
                  <ProcessesList
                    service={service}
                    onServiceUpdate={onServiceUpdate}
                  />
                </div>
              </div>
            ))}

            {filteredServices.length === 0 && (
              <div className="px-6 py-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 48 48"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h32M8 24h32M8 36h32"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No hay servicios
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  No se encontraron servicios para mostrar.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
