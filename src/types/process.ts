export interface Process {
  id: string;
  name: string;
  type: ProcessType;
  status: ProcessStatus;
  port?: number;
  command?: string;
  serviceId: string;
  providerId: string;
  configuration: ProcessConfig;
  resources: ProcessResources;
  dependencies: string[]; // IDs de otros procesos de los que depende
  createdAt: string;
  updatedAt: string;
}

export type ProcessType =
  | "web-server"
  | "database"
  | "cache"
  | "container"
  | "message-queue"
  | "load-balancer"
  | "monitoring"
  | "other";

export type ProcessStatus = "running" | "stopped" | "error" | "pending";

export interface ProcessConfig {
  configPath?: string;
  envVars?: Record<string, string>;
  volumeMounts?: Array<{
    source: string;
    target: string;
    readOnly?: boolean;
  }>;
  networkConfig?: {
    exposedPorts?: number[];
    internalNetworks?: string[];
  };
  autoRestart?: boolean;
  healthCheck?: {
    command: string;
    interval: number;
    timeout: number;
    retries: number;
  };
}

export interface ProcessResources {
  cpu: {
    limit: number; // en cores
    reserved: number;
  };
  memory: {
    limit: number; // en MB
    reserved: number;
  };
  storage?: {
    limit: number; // en GB
    path: string;
  };
}

export const ProcessTypeLabels: Record<ProcessType, string> = {
  "web-server": "Servidor Web",
  database: "Base de Datos",
  cache: "Caché",
  container: "Contenedor",
  "message-queue": "Cola de Mensajes",
  "load-balancer": "Balanceador de Carga",
  monitoring: "Monitoreo",
  other: "Otro",
};
