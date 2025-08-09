import { supabase } from "../lib/supabase";
import {
  BillingRecord,
  BillingSummary,
  CreateBillingRecordParams,
} from "./serviceTypes";

export async function createBillingRecord(
  params: CreateBillingRecordParams
): Promise<BillingRecord> {
  const { data, error } = await supabase
    .from("billing_records")
    .insert({
      service_id: params.service_id,
      amount: params.amount,
      description: params.description,
      billing_period_start: params.billing_period_start.toISOString(),
      billing_period_end: params.billing_period_end.toISOString(),
      resource_type: params.resource_type,
      usage_quantity: params.usage_quantity,
      usage_unit: params.usage_unit,
      rate_per_unit: params.rate_per_unit,
      currency: params.currency || "USD",
      payment_method: params.payment_method,
      status: params.status || "pending",
    })
    .select()
    .single();

  if (error) throw new Error(`Error creating billing record: ${error.message}`);
  return data;
}

export async function getBillingRecords(
  serviceId: string
): Promise<BillingRecord[]> {
  const { data, error } = await supabase
    .from("billing_records")
    .select("*")
    .eq("service_id", serviceId)
    .order("billing_date", { ascending: false });

  if (error)
    throw new Error(`Error fetching billing records: ${error.message}`);
  return data || [];
}

export async function getBillingSummary(
  serviceId: string
): Promise<BillingSummary> {
  const { data, error } = await supabase
    .from("service_billing_summary")
    .select("*")
    .eq("service_id", serviceId)
    .single();

  if (error)
    throw new Error(`Error fetching billing summary: ${error.message}`);
  return data;
}

export async function updateBillingRecord(
  id: string,
  updates: Partial<BillingRecord>
): Promise<BillingRecord> {
  const { data, error } = await supabase
    .from("billing_records")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Error updating billing record: ${error.message}`);
  return data;
}

export async function deleteBillingRecord(id: string): Promise<void> {
  const { error } = await supabase
    .from("billing_records")
    .delete()
    .eq("id", id);

  if (error) throw new Error(`Error deleting billing record: ${error.message}`);
}

export async function markBillingRecordAsPaid(
  id: string
): Promise<BillingRecord> {
  return updateBillingRecord(id, { status: "paid" });
}

export async function markBillingRecordAsCancelled(
  id: string
): Promise<BillingRecord> {
  return updateBillingRecord(id, { status: "cancelled" });
}
