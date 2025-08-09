import { supabase } from "../../lib/supabase";
import { ServiceCredential } from "../serviceTypes";

export class CredentialsService {
  static async getByServiceId(serviceId: string): Promise<ServiceCredential[]> {
    const { data, error } = await supabase
      .from("service_credentials")
      .select("*")
      .eq("service_id", serviceId);

    if (error) throw error;
    return data || [];
  }

  static async createForService(
    serviceId: string,
    credentials: Omit<
      ServiceCredential,
      "id" | "service_id" | "created_at" | "updated_at"
    >[]
  ): Promise<void> {
    if (credentials.length === 0) return;

    const { error } = await supabase.from("service_credentials").insert(
      credentials.map((cred) => ({
        service_id: serviceId,
        key: cred.key,
        value: cred.value,
      }))
    );

    if (error) throw error;
  }

  static async updateForService(
    serviceId: string,
    credentials: Omit<
      ServiceCredential,
      "id" | "service_id" | "created_at" | "updated_at"
    >[]
  ): Promise<void> {
    await this.deleteForService(serviceId);
    if (credentials.length > 0) {
      await this.createForService(serviceId, credentials);
    }
  }

  static async deleteForService(serviceId: string): Promise<void> {
    const { error } = await supabase
      .from("service_credentials")
      .delete()
      .eq("service_id", serviceId);

    if (error) throw error;
  }
}
