import React from "react";
import { Service } from "../../../types";
import { Square, Play, Eye, Edit, Trash2 } from "lucide-react";
import { BillingCalculator } from "../../../utils/billingCalculator";

import {
  getServiceTypeIcon,
  getStatusColor,
  getStatusLabel,
  getTypeLabel,
  formatToHHMMSS,
} from "./utils/serviceHelpers";

interface ServiceRowProps {
  service: Service;
  elapsedTime: number;
  onViewService: (service: Service) => void;
  onEditService: (service: Service) => void;
  onDeleteService: (serviceId: string) => void;
  onStartService: (serviceId: string) => Promise<void>;
  onStopService: (serviceId: string) => Promise<void>;
}

const ServiceRow: React.FC<ServiceRowProps> = ({
  service,
  elapsedTime,
  onViewService,
  onEditService,
  onDeleteService,
  onStartService,
  onStopService,
}) => {
  const Icon = getServiceTypeIcon(service.type);
  const billing = BillingCalculator.calculateServiceCost(service);

  return (
    <tr className="hover:bg-gray-50">
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
      <td className="px-6 py-4 text-sm text-gray-900">{service.provider}</td>
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
              service.isRunning ? "bg-green-500 animate-pulse" : "bg-gray-400"
            }`}
          />
          <span className="text-sm text-gray-900">
            {service.isRunning ? "Ejecutándose" : "Detenido"}
          </span>
        </div>
        {service.isRunning && (
          <div className="text-xs text-gray-500">
            ⏱️ {formatToHHMMSS(Math.floor(elapsedTime * 3600))}
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
          {BillingCalculator.formatCurrency(billing.currentMonthCost)}
        </div>
        <div className="text-xs text-gray-500">
          ⏱️{BillingCalculator.formatHours(billing.currentMonthHours)}
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
};

export default ServiceRow;
