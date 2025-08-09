import { Server, Database, HardDrive, Globe } from "lucide-react";

export const getServiceTypeIcon = (type: string) => {
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

export const getStatusColor = (status: string) => {
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

export const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: "Activo",
    inactive: "Inactivo",
    expired: "Vencido",
    pending: "Pendiente",
  };
  return labels[status] || status;
};

export const getTypeLabel = (type: string) => {
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

export const formatToHHMMSS = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return [hrs, mins, secs].map((v) => v.toString().padStart(2, "0")).join(":");
};
