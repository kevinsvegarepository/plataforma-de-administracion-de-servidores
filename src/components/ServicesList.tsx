import React, { useState, useEffect } from "react";
import { Service } from "../types";
import {
  Plus,
  Search,
  Server,
  Database,
  HardDrive,
  Globe,
  Eye,
  Edit,
  Trash2,
  Play,
  Square,
} from "lucide-react";
import { BillingCalculator } from "../utils/billingCalculator";

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
      setElapsedTimes((prev) => {
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

  const formatToHHMMSS = (hours: number) => {
    const totalSeconds = Math.floor(hours * 3600);
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(totalSeconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || service.status === filterStatus;
    const matchesType = filterType === "all" || service.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getServiceTypeIcon = (type: string) => {
    switch (type) {
      case "virtual-machine":
        return Server;
      case "database":
        return Database;
      case "storage":
        return HardDrive;
      case "cdn":
        return Globe;
      default:
        return Server;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: "Activo",
      inactive: "Inactivo",
      expired: "Vencido",
      pending: "Pendiente",
    };
    return labels[status] || status;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      "virtual-machine": "VM",
      database: "BD",
      storage: "Storage",
      cdn: "CDN",
      "load-balancer": "LB",
      monitoring: "Monitor",
      backup: "Backup",
      other: "Otro",
    };
    return labels[type] || type;
  };

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
          <Plus className="h-5 w-5" />
          <span>Agregar Servicio</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar servicios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="expired">Vencido</option>
            <option value="pending">Pendiente</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos los tipos</option>
            <option value="virtual-machine">Máquina Virtual</option>
            <option value="database">Base de Datos</option>
            <option value="storage">Almacenamiento</option>
            <option value="cdn">CDN</option>
            <option value="load-balancer">Load Balancer</option>
            <option value="monitoring">Monitoreo</option>
            <option value="backup">Backup</option>
            <option value="other">Otro</option>
          </select>
        </div>
      </div>

      {/* Services Table */}
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
              {filteredServices.map((service) => {
                const Icon = getServiceTypeIcon(service.type);
                const billing = BillingCalculator.calculateServiceCost(service);

                return (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Icon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {service.name}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {service.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {getTypeLabel(service.type)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {service.provider}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          service.status
                        )}`}
                      >
                        {getStatusLabel(service.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            service.isRunning
                              ? "bg-green-500 animate-pulse"
                              : "bg-gray-400"
                          }`}
                        />
                        <span className="text-sm text-gray-900">
                          {service.isRunning ? "Ejecutándose" : "Detenido"}
                        </span>
                      </div>
                      {service.isRunning && (
                        <div className="text-xs text-gray-500">
                          ⏱️ {formatToHHMMSS(elapsedTimes[service.id] || 0)}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {BillingCalculator.formatCurrency(service.hourlyRate)}
                      {service.subServices.length > 0 && (
                        <div className="text-xs text-gray-500">
                          +{service.subServices.length} sub-servicios
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="font-medium">
                        {BillingCalculator.formatCurrency(
                          billing.currentMonthCost
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        ⏱️
                        {BillingCalculator.formatHours(
                          billing.currentMonthHours
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {service.isRunning ? (
                          <button
                            onClick={() => onStopService(service.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Detener servicio"
                          >
                            <Square className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => onStartService(service.id)}
                            disabled={service.status !== "active"}
                            className="text-green-600 hover:text-green-900 p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Iniciar servicio"
                          >
                            <Play className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onViewService(service)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onEditService(service)}
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteService(service.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredServices.length === 0 && (
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
    </div>
  );
};

export default ServicesList;
