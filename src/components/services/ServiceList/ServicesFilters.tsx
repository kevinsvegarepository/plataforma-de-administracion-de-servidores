import React from "react";
import { Search } from "lucide-react";

interface ServicesFiltersProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  filterStatus: string;
  onFilterStatusChange: (value: string) => void;
  filterType: string;
  onFilterTypeChange: (value: string) => void;
}

const ServicesFilters: React.FC<ServicesFiltersProps> = ({
  searchTerm,
  onSearchTermChange,
  filterStatus,
  onFilterStatusChange,
  filterType,
  onFilterTypeChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar servicios..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => onFilterStatusChange(e.target.value)}
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
          onChange={(e) => onFilterTypeChange(e.target.value)}
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
  );
};

export default ServicesFilters;
