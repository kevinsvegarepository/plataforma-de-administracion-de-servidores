import { useState } from "react";
import { Service } from "../types";
import {
  X,
  Server,
  Database,
  HardDrive,
  Globe,
  DollarSign,
  BarChart3,
  Activity,
  Clock,
  Bell,
  History,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BillingDetails } from "./BillingDetails";

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
  const [activeTab, setActiveTab] = useState<"details" | "billing">("details");

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

  const Icon = getServiceTypeIcon(service.type);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-0 w-11/12 max-w-5xl shadow-2xl rounded-xl bg-white mb-8">
        <div className="border-b border-gray-100">
          <div className="p-6 flex items-start justify-between">
            <div className="flex items-center space-x-5">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Icon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {service.name}
                </h1>
                <p className="text-gray-600 mt-1">{service.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onEdit(service)}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm font-medium flex items-center"
              >
                <span className="mr-2">Editar Servicio</span>
              </button>
              <button
                onClick={onClose}
                className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          {activeTab === "billing" ? (
            <BillingDetails serviceId={service.id} />
          ) : (
            <>
              {/* Estado */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">
                      Estado
                    </span>
                  </div>
                  <span
                    className={`inline-flex px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(
                      service.status
                    )} shadow-sm`}
                  >
                    {getStatusLabel(service.status)}
                  </span>
                </div>

                {/* Tipo */}
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">
                      Tipo de Servicio
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Icon className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-gray-900 font-medium">
                      {getTypeLabel(service.type)}
                    </span>
                  </div>
                </div>

                {/* Proveedor */}
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">
                      Proveedor
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-900 font-medium">
                      {service.provider}
                    </span>
                  </div>
                </div>

                {/* Costo Mensual */}
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">
                      Costo Mensual
                    </span>
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    $
                    {(
                      service.hourlyRate * service.estimatedMonthlyHours
                    ).toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 block mt-1">
                    ${service.hourlyRate}/hora
                  </span>
                </div>
              </div>

              {/* Pestañas */}
              <div className="mt-6 mb-8 bg-gray-50 rounded-xl p-1">
                <nav className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab("details")}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                      activeTab === "details"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <span className="flex items-center justify-center">
                      <Server className="h-4 w-4 mr-2" />
                      Detalles del Servicio
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("billing")}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                      activeTab === "billing"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <span className="flex items-center justify-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Facturación
                    </span>
                  </button>
                </nav>
              </div>

              {/* Contenido */}
              <div className="space-y-8">
                {/* Estadísticas de Uso */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Activity className="h-6 w-6 mr-3 text-blue-600" />
                    Estadísticas de Uso
                  </h2>

                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={service.usageStats || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="date"
                          stroke="#9CA3AF"
                          tick={{ fill: "#6B7280" }}
                        />
                        <YAxis stroke="#9CA3AF" tick={{ fill: "#6B7280" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #E5E7EB",
                            borderRadius: "0.5rem",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="cpu"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          dot={{ fill: "#3B82F6", strokeWidth: 2 }}
                          name="CPU"
                        />
                        <Line
                          type="monotone"
                          dataKey="memory"
                          stroke="#10B981"
                          strokeWidth={2}
                          dot={{ fill: "#10B981", strokeWidth: 2 }}
                          name="Memoria"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-600">
                          CPU Promedio
                        </span>
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Activity className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {service.averageCpu || 0}%
                      </p>
                      <span className="text-sm text-blue-600">
                        Últimas 24 horas
                      </span>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-green-600">
                          Memoria Promedio
                        </span>
                        <div className="p-2 bg-green-100 rounded-lg">
                          <HardDrive className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {service.averageMemory || 0}%
                      </p>
                      <span className="text-sm text-green-600">
                        Últimas 24 horas
                      </span>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-purple-600">
                          Tiempo Activo
                        </span>
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Clock className="h-4 w-4 text-purple-600" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {service.uptime || "N/A"}
                      </p>
                      <span className="text-sm text-purple-600">
                        Total acumulado
                      </span>
                    </div>
                  </div>
                </div>

                {/* Gráficos de Rendimiento */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                    Gráficos de Rendimiento
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                      <h3 className="text-sm font-medium text-gray-600 mb-3">
                        Latencia
                      </h3>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={service.latencyData || []}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#f0f0f0"
                            />
                            <XAxis
                              dataKey="time"
                              stroke="#9CA3AF"
                              tick={{ fill: "#6B7280" }}
                            />
                            <YAxis
                              stroke="#9CA3AF"
                              tick={{ fill: "#6B7280" }}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #E5E7EB",
                                borderRadius: "0.5rem",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke="#6366F1"
                              strokeWidth={2}
                              dot={{ fill: "#6366F1", strokeWidth: 2 }}
                              name="ms"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                      <h3 className="text-sm font-medium text-gray-600 mb-3">
                        Tráfico de Red
                      </h3>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={service.networkData || []}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#f0f0f0"
                            />
                            <XAxis
                              dataKey="time"
                              stroke="#9CA3AF"
                              tick={{ fill: "#6B7280" }}
                            />
                            <YAxis
                              stroke="#9CA3AF"
                              tick={{ fill: "#6B7280" }}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #E5E7EB",
                                borderRadius: "0.5rem",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="in"
                              stroke="#10B981"
                              strokeWidth={2}
                              dot={{ fill: "#10B981", strokeWidth: 2 }}
                              name="Entrada"
                            />
                            <Line
                              type="monotone"
                              dataKey="out"
                              stroke="#EF4444"
                              strokeWidth={2}
                              dot={{ fill: "#EF4444", strokeWidth: 2 }}
                              name="Salida"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alertas y Notificaciones */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <Bell className="h-6 w-6 mr-3 text-blue-600" />
                      Alertas y Notificaciones
                    </h2>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {(service.alerts || []).length} alertas
                    </span>
                  </div>
                  <div className="space-y-4">
                    {(service.alerts || []).map((alert, index) => {
                      const severityColors = {
                        critical: "red",
                        warning: "yellow",
                        info: "blue",
                      };
                      const color = severityColors[alert.severity] || "gray";

                      return (
                        <div
                          key={index}
                          className={`bg-white border border-${color}-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200`}
                        >
                          <div className="flex items-start">
                            <div
                              className={`p-2 bg-${color}-100 rounded-lg mr-4`}
                            >
                              <AlertTriangle
                                className={`h-5 w-5 text-${color}-600`}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <h3
                                  className={`text-${color}-900 font-semibold text-base`}
                                >
                                  {alert.title}
                                </h3>
                                <span
                                  className={`px-3 py-1 bg-${color}-100 text-${color}-800 text-xs font-medium rounded-full`}
                                >
                                  {alert.severity}
                                </span>
                              </div>
                              <p className={`mt-2 text-${color}-700 text-sm`}>
                                {alert.message}
                              </p>
                              <div className="mt-3 flex items-center text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-2" />
                                {formatDate(alert.timestamp)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Historial de Cambios */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <History className="h-5 w-5 mr-2 text-blue-600" />
                    Historial de Cambios
                  </h2>
                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="space-y-4">
                      {(service.changeHistory || []).map((change, index) => (
                        <div
                          key={index}
                          className="flex items-start border-l-2 border-blue-500 pl-4"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {change.title}
                            </div>
                            <div className="mt-1 text-sm text-gray-500">
                              {change.description}
                            </div>
                            <div className="mt-1 text-xs text-gray-400 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(change.date)}
                              <span className="mx-2">•</span>
                              {change.user}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Configuración de Red */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Configuración de Red
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                      <span className="text-sm font-medium text-gray-600">
                        IP Pública
                      </span>
                      <p className="mt-2 text-gray-900 font-mono">
                        {service.networkConfig?.publicIp || "Sin datos"}
                      </p>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                      <span className="text-sm font-medium text-gray-600">
                        IP Privada
                      </span>
                      <p className="mt-2 text-gray-900 font-mono">
                        {service.networkConfig?.privateIp || "Sin datos"}
                      </p>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                      <span className="text-sm font-medium text-gray-600">
                        IP Interna
                      </span>
                      <p className="mt-2 text-gray-900 font-mono">
                        {service.networkConfig?.internalIp || "Sin datos"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-md font-semibold text-gray-900 mb-4">
                      Puertos
                    </h3>
                    {service.networkPorts?.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {service.networkPorts.map((port) => (
                          <div
                            key={port.id}
                            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
                          >
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

                {/* Sub-Servicios */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Sub-Servicios
                  </h2>
                  {service.subServices?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {service.subServices.map((sub) => (
                        <div
                          key={sub.id}
                          className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
                        >
                          <span className="text-sm font-medium text-gray-600">
                            {sub.name}
                          </span>
                          <p className="mt-2 text-gray-900">
                            Tipo: {sub.type ?? ""}
                          </p>
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
                {service.customFields && service.customFields.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Campos Personalizados
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {service.customFields.map((field) => (
                        <div
                          key={field.id}
                          className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <span className="text-sm font-semibold text-gray-700 block mb-2">
                            {field.key}
                          </span>
                          <p className="text-gray-900">{field.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Etiquetas */}
                {service.tags && service.tags.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Etiquetas
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {service.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notas */}
                {service.notes && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Notas
                    </h2>
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {service.notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
