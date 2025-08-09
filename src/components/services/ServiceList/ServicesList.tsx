import React, { useState, useEffect } from "react";
import { Service } from "../../../types";
import { BillingCalculator } from "../../../utils/billingCalculator";
import ServicesFilters from "./ServicesFilters";
import ServicesTable from "./ServicesTable";

interface ServicesListProps {
  services: Service[];
  onAddService: () => void;
  onViewService: (service: Service) => void;
  onEditService: (service: Service) => void;
  onDeleteService: (serviceId: string) => void;
  onStartService: (serviceId: string) => Promise<void>;
  onStopService: (serviceId: string) => Promise<void>;
}

const ServicesList: React.FC<ServicesListProps> = ({
  services,
  onAddService,
  onViewService,
  onEditService,
  onDeleteService,
  onStartService,
  onStopService,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  const [elapsedTimes, setElapsedTimes] = useState<Record<string, number>>(
    () => {
      const initialTimes: Record<string, number> = {};
      services.forEach((service) => {
        if (service.isRunning) {
          initialTimes[service.id] =
            BillingCalculator.calculateCurrentRunningTime(service);
        }
      });
      return initialTimes;
    }
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTimes(() => {
        const updated: Record<string, number> = {};
        services.forEach((service) => {
          if (service.isRunning) {
            updated[service.id] =
              BillingCalculator.calculateCurrentRunningTime(service);
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [services]);

  // Filtrar servicios según búsqueda y filtros
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || service.status === filterStatus;
    const matchesType = filterType === "all" || service.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Servicios</h1>
          <p className="text-gray-600 mt-2">
            Gestiona todos tus servicios de infraestructura
          </p>
        </div>
        <button
          onClick={onAddService}
          className="mt-4 sm:mt-0 inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <span>Agregar Servicio</span>
        </button>
      </div>

      <ServicesFilters
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
        filterType={filterType}
        onFilterTypeChange={setFilterType}
      />

      <ServicesTable
        services={filteredServices}
        elapsedTimes={elapsedTimes}
        onViewService={onViewService}
        onEditService={onEditService}
        onDeleteService={onDeleteService}
        onStartService={onStartService}
        onStopService={onStopService}
        onAddService={onAddService}
        searchTerm={searchTerm}
        filterStatus={filterStatus}
        filterType={filterType}
      />
    </div>
  );
};

export default ServicesList;
