import { supabase } from "../../lib/supabase";
import { Service } from "../../types";
import { ServiceMapper } from "../serviceMappers";
import { BillingOperations } from "./billingOperations";
import { UsageLogsService } from "../serviceRelations/usageLogs";
import { ServiceService } from "../serviceService";

export class ServiceOperations {
  static async startService(id: string): Promise<Service> {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("services")
      .update({
        is_running: true,
        last_start_time: now,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    await UsageLogsService.createLog(id, "start");

    return ServiceMapper.mapDatabaseToService(data);
  }

  static async stopService(id: string): Promise<Service> {
    const now = new Date();
    const service = await ServiceService.getServiceById(id);

    if (!service || !service.isRunning || !service.lastStartTime) {
      throw new Error("Service is not currently running");
    }

    const duration = BillingOperations.calculateCurrentRunningTime(service);
    const billingCalc = BillingOperations.calculateServiceCost(service);
    const cost = billingCalc.currentMonthCost;
    const newTotalHours = billingCalc.totalLifetimeHours;

    const { data, error } = await supabase
      .from("services")
      .update({
        is_running: false,
        last_stop_time: now.toISOString(),
        total_running_hours: newTotalHours,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    await UsageLogsService.createLog(id, "stop", duration, cost);

    return ServiceMapper.mapDatabaseToService(data);
  }

  // Estos métodos ahora están en UsageLogsService
  static logServiceAction = UsageLogsService.createLog;
  static getServiceUsageLogs = UsageLogsService.getByServiceId;
}
