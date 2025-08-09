import { supabase } from "../lib/supabase";
import { Process } from "../types/process";

interface DatabaseProcess {
  id: string;
  name: string;
  type: Process["type"];
  status: Process["status"];
  port?: number;
  command?: string;
  service_id: string;
  provider_id: string;
  configuration: Process["configuration"];
  resources: Process["resources"];
  dependencies: string[];
  created_at: string;
  updated_at: string;
}

export class ProcessService {
  private static mapDatabaseToProcess(data: DatabaseProcess): Process {
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      status: data.status,
      port: data.port,
      command: data.command,
      serviceId: data.service_id,
      providerId: data.provider_id,
      configuration: data.configuration,
      resources: data.resources,
      dependencies: data.dependencies,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
  static async getProcessesByService(serviceId: string): Promise<Process[]> {
    const { data, error } = await supabase
      .from("processes")
      .select("*")
      .eq("service_id", serviceId);

    if (error) throw error;
    return data ? data.map(this.mapDatabaseToProcess) : [];
  }

  static async getProcessesByProvider(providerId: string): Promise<Process[]> {
    const { data, error } = await supabase
      .from("processes")
      .select("*")
      .eq("provider_id", providerId);

    if (error) throw error;
    return data ? data.map(this.mapDatabaseToProcess) : [];
  }

  static async createProcess(
    process: Omit<Process, "id" | "createdAt" | "updatedAt">
  ): Promise<Process> {
    if (!process.serviceId || !process.providerId) {
      throw new Error("serviceId and providerId are required");
    }

    // Validar que los IDs sean UUIDs válidos
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (
      !uuidRegex.test(process.serviceId) ||
      !uuidRegex.test(process.providerId)
    ) {
      throw new Error("Invalid UUID format for serviceId or providerId");
    }

    const dbProcess = {
      name: process.name,
      type: process.type,
      status: process.status,
      port: process.port,
      command: process.command,
      service_id: process.serviceId,
      provider_id: process.providerId,
      configuration: process.configuration,
      resources: process.resources,
      dependencies: process.dependencies || [],
    };

    const { data, error } = await supabase
      .from("processes")
      .insert([dbProcess])
      .select()
      .single();

    if (error) throw error;
    return this.mapDatabaseToProcess(data);
  }

  static async updateProcess(
    id: string,
    process: Partial<Process>
  ): Promise<Process> {
    // Validar UUIDs si están presentes
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (process.serviceId && !uuidRegex.test(process.serviceId)) {
      throw new Error("Invalid UUID format for serviceId");
    }
    if (process.providerId && !uuidRegex.test(process.providerId)) {
      throw new Error("Invalid UUID format for providerId");
    }

    const updateData = {
      ...(process.name !== undefined && { name: process.name }),
      ...(process.type !== undefined && { type: process.type }),
      ...(process.status !== undefined && { status: process.status }),
      ...(process.port !== undefined && { port: process.port }),
      ...(process.command !== undefined && { command: process.command }),
      ...(process.serviceId && { service_id: process.serviceId }),
      ...(process.providerId && { provider_id: process.providerId }),
      ...(process.configuration !== undefined && {
        configuration: process.configuration,
      }),
      ...(process.resources !== undefined && { resources: process.resources }),
      ...(process.dependencies !== undefined && {
        dependencies: process.dependencies,
      }),
    };

    const { data, error } = await supabase
      .from("processes")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return this.mapDatabaseToProcess(data);
  }

  static async deleteProcess(id: string): Promise<void> {
    const { error } = await supabase.from("processes").delete().eq("id", id);

    if (error) throw error;
  }

  static async updateProcessStatus(
    id: string,
    status: Process["status"]
  ): Promise<Process> {
    return this.updateProcess(id, { status });
  }

  static async getDependentProcesses(processId: string): Promise<Process[]> {
    const { data, error } = await supabase
      .from("processes")
      .select("*")
      .contains("dependencies", [processId]);

    if (error) throw error;
    return data ? data.map(this.mapDatabaseToProcess) : [];
    return data || [];
  }
}
