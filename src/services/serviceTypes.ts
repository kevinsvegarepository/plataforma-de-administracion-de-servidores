import { ServiceType } from "../types";

export interface Provider {
  id: string;
  name: string;
  website: string;
  support_email: string;
  support_phone: string;
  logo?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DatabaseService {
  id?: string;
  name?: string;
  type?: ServiceType;
  provider_name?: string;
  provider_id?: string;
  provider?: Provider;
  status?: string;
  is_running?: boolean;
  purchase_date?: string;
  renewal_date?: string;
  hourly_rate?: number;
  estimated_monthly_hours?: number;
  description?: string;
  tags?: any; // JSONB en PostgreSQL
  notes?: string;
  total_running_hours?: number;
  last_start_time?: string;
  last_stop_time?: string;
  created_at?: string;
  updated_at?: string;
}

// Tipos para las relaciones
export interface ServiceCredential {
  id?: string;
  service_id?: string;
  key: string;
  value: string;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceSpecification {
  id?: string;
  service_id?: string;
  key: string;
  value: string;
}

export interface NetworkConfig {
  id?: string;
  service_id?: string;
  public_ip?: string;
  private_ip?: string;
  internal_ip?: string;
}

export interface NetworkPort {
  id?: string;
  service_id?: string;
  port: number;
  description?: string;
  is_open: boolean;
}

export interface SubService {
  id?: string;
  parent_service_id?: string;
  name: string;
  hourly_rate: number;
  description?: string;
}

export interface CustomField {
  id?: string;
  service_id?: string;
  key: string;
  value: string;
}

export interface ServiceRelations {
  specifications: ServiceSpecification[];
  networkConfig?: NetworkConfig | null;
  networkPorts: NetworkPort[];
  credentials: ServiceCredential[];
  subServices: SubService[];
  customFields: CustomField[];
  billingRecords?: BillingRecord[];
  billingSummary?: BillingSummary;
}

export interface BillingRecord {
  id: string;
  service_id: string;
  amount: number;
  currency: string;
  description: string | null;
  billing_date: string;
  billing_period_start: string;
  billing_period_end: string;
  status: "pending" | "paid" | "cancelled";
  payment_method: string | null;
  created_at: string;
  updated_at: string;

  // Metadata
  resource_type: string | null;
  usage_quantity: number | null;
  usage_unit: string | null;
  rate_per_unit: number | null;
}

export interface BillingSummary {
  service_id: string;
  service_name: string;
  provider_name: string;
  total_records: number;
  total_paid: number;
  total_pending: number;
  first_billing_date: string | null;
  last_billing_date: string | null;
}

export interface CreateBillingRecordParams {
  service_id: string;
  amount: number;
  description?: string;
  billing_period_start: Date;
  billing_period_end: Date;
  resource_type?: string;
  usage_quantity?: number;
  usage_unit?: string;
  rate_per_unit?: number;
  currency?: string;
  payment_method?: string;
  status?: "pending" | "paid" | "cancelled";
}
