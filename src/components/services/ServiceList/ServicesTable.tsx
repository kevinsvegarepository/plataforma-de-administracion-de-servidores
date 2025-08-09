import React from "react";
import { Service } from "../../../types";
import ServiceRow from "./ServiceRow";
import { Server, Plus } from "lucide-react";

interface ServicesTableProps {
  services: Service[];
  elapsedTimes: Record<string, number>;
  onViewService: (service: Service) => void;
  onEditService: (service: Service) => void;
  onDeleteService: (serviceId: string) => void;
  onStartService: (serviceId: string) => Promise<void>;
  onStopService: (serviceId: string) => Promise<void>;
  onAddService: () => void;
  searchTerm: string;
  filterStatus: string;
  filterType: string;
}

const ServicesTable: React.FC<ServicesTableProps> = ({
  services,
  elapsedTimes,
  onViewService,
  onEditService,
  onDeleteService,
  onStartService,
  onStopService,
  onAddService,
  searchTerm,
  filterStatus,
  filterType,
}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Servicio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proveedor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado Ejecución
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Costo/Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Costo Mes Actual
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.map((service) => (
              <ServiceRow
                key={service.id}
                service={service}
                elapsedTime={elapsedTimes[service.id] || 0}
                onViewService={onViewService}
                onEditService={onEditService}
                onDeleteService={onDeleteService}
                onStartService={onStartService}
                onStopService={onStopService}
              />
            ))}
          </tbody>
        </table>
      </div>

      {services.length === 0 && (
        <div className="text-center py-12">
          <Server className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No hay servicios
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== "all" || filterType !== "all"
              ? "No se encontraron servicios con los filtros aplicados."
              : "Comienza agregando tu primer servicio."}
          </p>
          {!searchTerm && filterStatus === "all" && filterType === "all" && (
            <div className="mt-6">
              <button
                onClick={onAddService}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Servicio
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ServicesTable;
