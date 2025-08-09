import { supabase } from "../../lib/supabase";

export class NetworkPortsService {
  static async getByServiceId(serviceId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from("service_network_ports")
      .select("*")
      .eq("service_id", serviceId);

    if (error) throw error;
    return data || [];
  }

  static async createForService(
    serviceId: string,
    ports: any[]
  ): Promise<void> {
    if (ports.length === 0) return;

    const { error } = await supabase.from("service_network_ports").insert(
      ports.map((port) => ({
        service_id: serviceId,
        port: port.port,
        description: port.description,
        is_open: port.isOpen,
      }))
    );

    if (error) throw error;
  }

  static async updateForService(
    serviceId: string,
    ports: any[]
  ): Promise<void> {
    await this.deleteForService(serviceId);
    if (ports.length > 0) {
      await this.createForService(serviceId, ports);
    }
  }

  static async deleteForService(serviceId: string): Promise<void> {
    const { error } = await supabase
      .from("service_network_ports")
      .delete()
      .eq("service_id", serviceId);

    if (error) throw error;
  }
}
