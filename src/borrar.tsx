/import React, { useState } from "react";
import { Service } from "../types";
import {
  X,
  Server,
  Database,
  HardDrive,
  Globe,
  Calendar,
  DollarSign,
  Layers,
} from "lucide-react";
import ProcessesList from "./ProcessesList";g code...
import React, { useState } from "react";
import { Service } from "../types";
import {
  X,
  Server,
  Database,
  HardDrive,
  Globe,
  Calendar,
  DollarSign,
  Layers,
} from "lucide-react";
import ProcessesList from "./ProcessesList";

interface ServiceDetailProps {
  service: Service;
  onClose: () => void;
  onEdit: (service: Service) => void;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({
  service,
  onClose,
  onEdit,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'processes'>('details');
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
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "expired":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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
      "virtual-machine": "Máquina Virtual",
      database: "Base de Datos",
      storage: "Almacenamiento",
      cdn: "CDN",
      "load-balancer": "Load Balancer",
      monitoring: "Monitoreo",
      backup: "Backup",
      other: "Otro",
    };
    return labels[type] || type;
  };

  const daysUntilRenewal = Math.ceil(
    (new Date(service.renewalDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const Icon = getServiceTypeIcon(service.type);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-8 border w-11/12 max-w-4xl shadow-lg rounded-lg bg-white mb-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Icon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {service.name}
              </h1>
              <p className="text-gray-600">{service.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(service)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Editar
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Estado */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Estado</span>
            </div>
            <span
              className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                service.status
              )}`}
            >
              {getStatusLabel(service.status)}
            </span>
          </div>

          {/* Tipo */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Tipo</span>
            </div>
            <span className="text-gray-900 font-medium">
              {getTypeLabel(service.type)}
            </span>
          </div>

          {/* Proveedor */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Proveedor
              </span>
            </div>
            <span className="text-gray-900 font-medium">
              {service.provider}
            </span>
          </div>

          {/* Costo Mensual */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Costo Mensual
              </span>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </div>
            <span className="text-gray-900 font-medium">
              ${(service.hourlyRate * service.estimatedMonthlyHours).toFixed(2)}
            </span>
          </div>

          {/* Renovación */}
          <div className="bg-gray-50 rounded-lg p-4 col-span-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Renovación
              </span>
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <div className="space-y-1">
              <div className="text-gray-900 font-medium">
                {new Date(service.renewalDate).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div
                className={`text-sm ${
                  daysUntilRenewal <= 30
                    ? "text-red-600"
                    : daysUntilRenewal <= 60
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {daysUntilRenewal > 0
                  ? `Faltan ${daysUntilRenewal} días`
                  : daysUntilRenewal === 0
                  ? "Vence hoy"
                  : "Vencido"}
              </div>
            </div>
          </div>
        </div>

        {/* Especificaciones */}
              <div className="p-6 overflow-y-auto">
        {/* Pestañas */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Detalles del Servicio
            </button>
            <button
              onClick={() => setActiveTab('processes')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'processes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Layers className="h-4 w-4 mr-2" />
              Procesos
            </button>
          </nav>
        </div>

        {activeTab === 'details' ? (
          <>
            {/* Información General */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Información General
              </h2>
              <div className="grid grid-cols-2 gap-4">{

        {/* Configuración de Red */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Configuración de Red
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <span className="text-sm font-medium text-gray-600">
                IP Pública
              </span>
              <p className="mt-1 text-gray-900 font-mono">
                {service.networkConfig.publicIp || "Sin datos"}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <span className="text-sm font-medium text-gray-600">
                IP Privada
              </span>
              <p className="mt-1 text-gray-900 font-mono">
                {service.networkConfig.privateIp || "Sin datos"}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <span className="text-sm font-medium text-gray-600">
                IP Interna
              </span>
              <p className="mt-1 text-gray-900 font-mono">
                {service.networkConfig.internalIp || "Sin datos"}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-md font-semibold text-gray-900 mb-3">
              Puertos
            </h3>
            {service.networkPorts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {service.networkPorts.map((port) => (
                  <div key={port.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">
                        Puerto {port.port}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          port.isOpen
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {port.isOpen ? "Abierto" : "Cerrado"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      {port.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">Sin datos</div>
            )}
          </div>
        </div>

        {/* Credenciales */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Credenciales
          </h2>
          {service.credentials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {service.credentials.map((cred) => (
                <div key={cred.id} className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-sm font-medium text-gray-600 capitalize">
                    {cred.key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <p className="mt-1 text-gray-900 font-mono">
                    {cred.key.toLowerCase().includes("password")
                      ? "••••••••"
                      : cred.value}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">Sin datos</div>
          )}
        </div>

        {/* Sub-Servicios */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Sub-Servicios
          </h2>
          {service.subServices && service.subServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {service.subServices.map((sub) => (
                <div key={sub.id} className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">
                    {sub.name}
                  </span>
                  <p className="mt-1 text-gray-900">Tipo: {sub.type ?? ""}</p>
                  <p className="mt-1 text-gray-900">
                    $/hora: {sub.hourlyRate ?? 0}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">Sin datos</div>
          )}
        </div>

        {/* Campos Personalizados */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Campos Personalizados
          </h2>
          {service.customFields && service.customFields.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {service.customFields.map((field) => (
                <div key={field.id} className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">
                    {field.key}
                  </span>
                  <p className="mt-1 text-gray-900">{field.value}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">Sin datos</div>
          )}
        </div>

        {/* Etiquetas */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Etiquetas
          </h2>
          {service.tags && service.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {service.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">Sin datos</div>
          )}
        </div>

        {/* Notas */}
        {service.notes && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notas</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">
                {service.notes}
              </p>
            </div>
          </div>
        )}
        </>
        ) : (
          <ProcessesList serviceId={service.id} providerId={service.provider} />
        )}
      </div>
    </div>
  );
};

export default ServiceDetail;
