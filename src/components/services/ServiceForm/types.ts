import {
  Service,
  ServiceType,
  SubService,
  ServiceSpecification,
  ServiceNetworkConfig,
  ServiceNetworkPort,
  ServiceCredential,
  ServiceCustomField,
} from "../../../types";

export interface ServiceFormProps {
  service?: Service;
  onSave: (service: Omit<Service, "id"> | Service) => void;
  onCancel: () => void;
}

export interface FormData {
  name: string;
  type: ServiceType;
  provider: string;
  status: "active" | "inactive" | "expired" | "pending";
  isRunning: boolean;
  purchaseDate: string;
  renewalDate: string;
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
  notes: string;
  totalRunningHours: number;
}

export type InputChangeHandler = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >
) => void;
export type FieldChangeHandler = (field: string, value: string) => void;
