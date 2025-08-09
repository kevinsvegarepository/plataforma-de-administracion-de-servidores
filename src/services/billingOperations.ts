import { supabase } from "../lib/supabase";

export const updateBillingStatus = async (
  recordId: string,
  status: "paid" | "pending" | "canceled"
) => {
  try {
    const { data, error } = await supabase
      .from("billing_records")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", recordId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating billing status:", error);
    throw error;
  }
};

export const addPaymentRecord = async (
  serviceId: string,
  amount: number,
  description: string,
  periodStart?: string,
  periodEnd?: string
) => {
  try {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const { data, error } = await supabase
      .from("billing_records")
      .insert({
        service_id: serviceId,
        amount,
        billing_date: now.toISOString(),
        billing_period_start: periodStart || firstDayOfMonth.toISOString(),
        billing_period_end: periodEnd || lastDayOfMonth.toISOString(),
        description,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error adding payment record:", error);
    throw error;
  }
};

export const getBillingStats = async (serviceId: string) => {
  try {
    const { data, error } = await supabase
      .from("billing_records")
      .select("*")
      .eq("service_id", serviceId)
      .order("date", { ascending: false });

    if (error) throw error;

    const stats = {
      totalPaid: 0,
      totalPending: 0,
      totalCancelled: 0,
      lastPaymentDate: null as string | null,
      lastPaymentAmount: 0,
    };

    data.forEach((record) => {
      switch (record.status) {
        case "paid":
          stats.totalPaid += record.amount;
          if (!stats.lastPaymentDate || record.date > stats.lastPaymentDate) {
            stats.lastPaymentDate = record.date;
            stats.lastPaymentAmount = record.amount;
          }
          break;
        case "pending":
          stats.totalPending += record.amount;
          break;
        case "cancelled":
          stats.totalCancelled += record.amount;
          break;
      }
    });

    return stats;
  } catch (error) {
    console.error("Error getting billing stats:", error);
    throw error;
  }
};
