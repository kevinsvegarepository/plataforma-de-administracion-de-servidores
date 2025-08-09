import { supabase } from "../../lib/supabase";

export class CustomFieldsService {
  static async getByServiceId(serviceId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from("service_custom_fields")
      .select("*")
      .eq("service_id", serviceId);

    if (error) throw error;
    return data || [];
  }

  static async createForService(
    serviceId: string,
    customFields: any[]
  ): Promise<void> {
    if (customFields.length === 0) return;

    const { error } = await supabase.from("service_custom_fields").insert(
      customFields.map((field) => ({
        service_id: serviceId,
        key: field.key,
        value: field.value,
      }))
    );

    if (error) throw error;
  }

  static async updateForService(
    serviceId: string,
    customFields: any[]
  ): Promise<void> {
    await this.deleteForService(serviceId);
    if (customFields.length > 0) {
      await this.createForService(serviceId, customFields);
    }
  }

  static async deleteForService(serviceId: string): Promise<void> {
    const { error } = await supabase
      .from("service_custom_fields")
      .delete()
      .eq("service_id", serviceId);

    if (error) throw error;
  }
}
