import { supabase } from "../../lib/supabase";
import { NetworkConfig } from "../serviceTypes";

export class NetworkConfigService {
  static async getByServiceId(
    serviceId: string
  ): Promise<NetworkConfig | null> {
    try {
      const { data, error } = await supabase
        .from("service_network_config")
        .select("id, service_id, public_ip, private_ip, internal_ip")
        .eq("service_id", serviceId)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching network config:", error);
        return null;
      }

      if (!data) return null;

      return {
        id: data.id,
        service_id: data.service_id,
        public_ip: data.public_ip || "",
        private_ip: data.private_ip || "",
        internal_ip: data.internal_ip || "",
      };
    } catch (error) {
      console.error("Error in getByServiceId:", error);
      return null;
    }
  }

  static async createForService(
    serviceId: string,
    networkConfig: NetworkConfig
  ): Promise<void> {
    if (!networkConfig) return;

    // Usar upsert para evitar duplicados por clave única
    const { error } = await supabase.from("service_network_config").upsert({
      service_id: serviceId,
      public_ip: networkConfig.public_ip || "",
      private_ip: networkConfig.private_ip || "",
      internal_ip: networkConfig.internal_ip || "",
    });

    if (error) throw error;
  }

  static async updateForService(
    serviceId: string,
    networkConfig: NetworkConfig
  ): Promise<void> {
    // Primero verificamos si existe una configuración para este servicio
    const existing = await this.getByServiceId(serviceId);

    if (!existing) {
      // Si no existe, creamos una nueva
      return this.createForService(serviceId, networkConfig);
    }

    // Si existe, actualizamos solo los campos proporcionados
    const updates: Partial<NetworkConfig> = {
      service_id: serviceId,
    };

    if (networkConfig.public_ip !== undefined)
      updates.public_ip = networkConfig.public_ip;
    if (networkConfig.private_ip !== undefined)
      updates.private_ip = networkConfig.private_ip;
    if (networkConfig.internal_ip !== undefined)
      updates.internal_ip = networkConfig.internal_ip;

    const { error } = await supabase
      .from("service_network_config")
      .update(updates)
      .eq("service_id", serviceId);

    if (error) throw error;
  }

  static async deleteForService(serviceId: string): Promise<void> {
    const { error } = await supabase
      .from("service_network_config")
      .delete()
      .eq("service_id", serviceId);

    if (error) throw error;
  }
}
