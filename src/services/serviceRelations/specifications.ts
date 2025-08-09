import { supabase } from "../../lib/supabase";

export class SpecificationService {
  static async getByServiceId(serviceId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from("service_specifications")
      .select("*")
      .eq("service_id", serviceId);

    if (error) throw error;
    return data || [];
  }

  static async createForService(
    serviceId: string,
    specifications: any[]
  ): Promise<void> {
    if (specifications.length === 0) return;

    const { error } = await supabase.from("service_specifications").insert(
      specifications.map((spec) => ({
        service_id: serviceId,
        key: spec.key,
        value: spec.value,
      }))
    );

    if (error) throw error;
  }

  static async updateForService(
    serviceId: string,
    specifications: any[]
  ): Promise<void> {
    // Primero eliminar todas las especificaciones existentes
    await this.deleteForService(serviceId);

    // Luego crear las nuevas
    if (specifications.length > 0) {
      await this.createForService(serviceId, specifications);
    }
  }

  static async deleteForService(serviceId: string): Promise<void> {
    const { error } = await supabase
      .from("service_specifications")
      .delete()
      .eq("service_id", serviceId);

    if (error) throw error;
  }
}
