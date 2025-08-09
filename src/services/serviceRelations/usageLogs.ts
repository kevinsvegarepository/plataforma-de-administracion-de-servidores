import { supabase } from "../../lib/supabase";
import { ServiceUsageLog } from "../../types";

export class UsageLogsService {
  static async getByServiceId(serviceId: string): Promise<ServiceUsageLog[]> {
    const { data, error } = await supabase
      .from("service_usage_logs")
      .select("*")
      .eq("service_id", serviceId)
      .order("timestamp", { ascending: false });

    if (error) throw error;

    return data.map((log) => ({
      id: log.id,
      serviceId: log.service_id,
      action: log.action as "start" | "stop",
      timestamp: new Date(log.timestamp),
      duration: log.duration || undefined,
      cost: log.cost || undefined,
    }));
  }

  static async createLog(
    serviceId: string,
    action: "start" | "stop",
    duration?: number,
    cost?: number
  ): Promise<void> {
    const { error } = await supabase.from("service_usage_logs").insert({
      service_id: serviceId,
      action,
      duration,
      cost,
    });

    if (error) throw error;
  }

  static async deleteForService(serviceId: string): Promise<void> {
    const { error } = await supabase
      .from("service_usage_logs")
      .delete()
      .eq("service_id", serviceId);

    if (error) throw error;
  }
}
