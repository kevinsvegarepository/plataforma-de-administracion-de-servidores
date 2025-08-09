import { BillingRecord, BillingSummary } from "../services/serviceTypes";

export interface Provider {
  id: string;
  name: string;
  website: string;
  supportEmail: string;
  supportPhone: string;
}

export interface ServiceSpecification {
  id: string;
  serviceId: string;
  key: string;
  value: string;
}

export interface ServiceNetworkConfig {
  id: string;
  serviceId: string;
  publicIp: string;
  privateIp: string;
  internalIp: string;
}

export interface ServiceNetworkPort {
  id: string;
  serviceId: string;
  port: number;
  description: string;
  isOpen: boolean;
}

export interface ServiceCredential {
  id: string;
  serviceId: string;
  key: string;
  value: string;
}

export interface ServiceCustomField {
  id: string;
  serviceId: string;
  key: string;
  value: string;
  type: "text" | "number" | "date" | "boolean" | "url";
}

export interface SubService {
  id: string;
  parentServiceId: string;
  name: string;
  status: "active" | "inactive" | "expired" | "pending";
  type: string;
  hourlyRate: number;
  description: string;
}

export interface Service {
  id: string;
  name: string;
  type: ServiceType;
  provider: string;
  providerId: string;
  status: "active" | "inactive" | "expired" | "pending";
  isRunning: boolean;
  purchaseDate: Date;
  renewalDate: Date;
  hourlyRate: number;
  estimatedMonthlyHours: number;
  description: string;
  specifications: ServiceSpecification[];
  networkConfig: ServiceNetworkConfig;
  networkPorts: ServiceNetworkPort[];
  credentials: ServiceCredential[];
  subServices: SubService[];
  customFields: ServiceCustomField[];
  tags: string[];
  notes?: string;
  totalRunningHours: number;
  lastStartTime?: Date;
  lastStopTime?: Date;
  createdAt: Date;
  updatedAt: Date;
  billingRecords?: BillingRecord[];
  billingSummary?: BillingSummary;
  monthlyExpenses?: MonthlyExpense[];
  currentMonthExpense?: MonthlyExpense;
}

export interface ServiceSpecifications {
  cpu?: string;
  ram?: string;
  storage?: string;
  bandwidth?: string;
  os?: string;
  location?: string;
  [key: string]: string | undefined;
}

export interface NetworkConfiguration {
  publicIp?: string;
  privateIp?: string;
  internalIp?: string;
  openPorts: PortConfiguration[];
}

export interface PortConfiguration {
  port: number;
  protocol: "TCP" | "UDP";
  description: string;
  isOpen: boolean;
}

export interface ServiceCredentials {
  username?: string;
  password?: string;
  sshKey?: string;
  apiKey?: string;
  accessToken?: string;
  [key: string]: string | undefined;
}

export interface SubService {
  id: string;
  name: string;
  type: string;
  status: ServiceStatus;
  hourlyRate: number;
  description: string;
}

export interface CustomField {
  key: string;
  value: string;
  type: "text" | "number" | "date" | "boolean" | "url";
}

export type ServiceType =
  | "virtual-machine"
  | "storage"
  | "database"
  | "cdn"
  | "load-balancer"
  | "monitoring"
  | "backup"
  | "other";

export type ServiceStatus = "active" | "inactive" | "expired" | "pending";

export interface Provider {
  id: string;
  name: string;
  website: string;
  supportEmail: string;
  supportPhone: string;
  logo?: string;
}

export interface ServiceUsageLog {
  id: string;
  serviceId: string;
  action: "start" | "stop";
  timestamp: Date;
  duration?: number; // in hours
  cost?: number;
}

export interface MonthlyExpense {
  id: string;
  serviceId: string;
  year: number;
  month: number;
  totalHours: number;
  totalCost: number;
  projectedHours?: number;
  projectedCost?: number;
  averageDailyHours?: number;
  peakDayHours?: number;
  peakDayDate?: Date;
  totalDaysActive?: number;
  notes?: string;
  lastUpdated: Date;
  createdAt: Date;
}

export interface BillingCalculation {
  serviceId: string;
  currentMonthHours: number;
  currentMonthCost: number;
  projectedMonthlyHours: number;
  projectedMonthlyCost: number;
  totalLifetimeHours: number;
  totalLifetimeCost: number;
}
