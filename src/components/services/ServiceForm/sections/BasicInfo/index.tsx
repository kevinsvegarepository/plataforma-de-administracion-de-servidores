import React from "react";
import { BasicInfoProps } from "./types";

const BasicInfo: React.FC<BasicInfoProps> = ({ formData, onInputChange }) => {
  const serviceTypes = [
    { value: "virtual-machine", label: "Máquina Virtual" },
    { value: "database", label: "Base de Datos" },
    { value: "storage", label: "Almacenamiento" },
    { value: "cdn", label: "CDN" },
    { value: "load-balancer", label: "Load Balancer" },
    { value: "monitoring", label: "Monitoreo" },
    { value: "backup", label: "Backup" },
    { value: "other", label: "Otro" },
  ];

  const statusOptions = [
    { value: "active", label: "Activo" },
    { value: "inactive", label: "Inactivo" },
    { value: "expired", label: "Vencido" },
    { value: "pending", label: "Pendiente" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre del Servicio *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Servicio *
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={onInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {serviceTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Resto de campos básicos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fecha de compra
        </label>
        <input
          type="date"
          name="purchaseDate"
          value={formData.purchaseDate}
          onChange={onInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fecha de renovación
        </label>
        <input
          type="date"
          name="renewalDate"
          value={formData.renewalDate}
          onChange={onInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
};

export default BasicInfo;
