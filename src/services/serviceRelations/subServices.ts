import { supabase } from "../../lib/supabase";

export class SubServicesService {
  static async getByServiceId(serviceId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from("sub_services")
      .select("*")
      .eq("parent_service_id", serviceId);

    if (error) throw error;
    return data || [];
  }

  static async createForService(
    serviceId: string,
    subServices: any[]
  ): Promise<void> {
    if (subServices.length === 0) return;

    // Validar y mapear todos los campos requeridos
    const { error } = await supabase.from("sub_services").insert(
      subServices.map((sub) => ({
        parent_service_id: serviceId,
        name: sub.name ?? "",
        hourly_rate: sub.hourlyRate ?? 0,
        description: sub.description ?? "",
        status: sub.status ?? "active",
        type: sub.type ?? "",
      }))
    );

    if (error) throw error;
  }

  static async updateForService(
    serviceId: string,
    subServices: any[]
  ): Promise<void> {
    await this.deleteForService(serviceId);
    if (subServices.length > 0) {
      await this.createForService(serviceId, subServices);
    }
  }

  static async deleteForService(serviceId: string): Promise<void> {
    const { error } = await supabase
      .from("sub_services")
      .delete()
      .eq("parent_service_id", serviceId);

    if (error) throw error;
  }
}
