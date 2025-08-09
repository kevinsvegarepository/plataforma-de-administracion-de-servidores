import { supabase } from "../lib/supabase";
import { Service } from "../types";
import { DatabaseService, ServiceRelations } from "./serviceTypes";
import { ServiceMapper } from "./serviceMappers";
// Importar cada sericio de relación individualmente
import { SpecificationService } from "./serviceRelations/specifications";
import { NetworkConfigService } from "./serviceRelations/networkConfig";
import { NetworkPortsService } from "./serviceRelations/networkPorts";
import { CredentialsService } from "./serviceRelations/credentials";
import { SubServicesService } from "./serviceRelations/subServices";
import { CustomFieldsService } from "./serviceRelations/customFields";
import { TagsService } from "./serviceRelations/tags";
// Importar operaciones
import { ServiceOperations } from "./serviceOperations/startStopService";

export class ServiceService {
  static async getAllServices(): Promise<Service[]> {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return Promise.all(
      data.map((service) => this.getServiceWithRelations(service))
    );
  }

  static async getServiceById(id: string): Promise<Service | null> {
    const { data, error } = await supabase
      .from("services")
      .select(
        `
        *,
        provider:providers(*)
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching service:", error);
      throw error;
    }
    if (!data) {
      console.log("No service found with id:", id);
      return null;
    }

    console.log("Service data from DB:", data);
    return this.getServiceWithRelations(data);
  }

  static async createService(
    service: Omit<Service, "id" | "createdAt" | "updatedAt">
  ): Promise<Service> {
    const serviceData = await ServiceMapper.mapServiceToDatabase(service);

    const { data, error } = await supabase
      .from("services")
      .insert(serviceData)
      .select()
      .single();

    if (error) throw error;

    const newService = await ServiceMapper.mapDatabaseToService(data);

    // Crear relaciones
    await this.createServiceRelations(newService.id, service);

    return this.getServiceWithRelations(data);
  }

  static async updateService(
    id: string,
    updates: Partial<Service>
  ): Promise<Service> {
    try {
      // Si hay actualizaciones de tags, manejarlos por separado
      const tagsToUpdate = updates.tags;
      delete updates.tags; // Removemos tags de updates para manejarlos separadamente

      const serviceData = await ServiceMapper.mapServiceToDatabase({
        ...updates,
        id,
      });

      const { data, error } = await supabase
        .from("services")
        .update(serviceData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error("No se encontró el servicio para actualizar");

      // Si hay tags para actualizar, hacerlo después de la actualización principal
      if (tagsToUpdate !== undefined) {
        await TagsService.updateForService(id, tagsToUpdate);
      }

      // Actualizar relaciones y etiquetas solo si los datos han cambiado
      if (
        updates.specifications ||
        updates.networkConfig ||
        updates.networkPorts ||
        updates.credentials ||
        updates.subServices ||
        updates.customFields ||
        updates.tags
      ) {
        const currentRelations = await this.getServiceRelations(id);
        await Promise.all(
          [
            updates.tags !== undefined
              ? TagsService.updateForService(id, updates.tags)
              : null,
            updates.specifications &&
            JSON.stringify(updates.specifications) !==
              JSON.stringify(currentRelations.specifications)
              ? SpecificationService.updateForService(
                  id,
                  updates.specifications
                )
              : null,
            updates.networkConfig &&
            JSON.stringify(updates.networkConfig) !==
              JSON.stringify(currentRelations.networkConfig)
              ? NetworkConfigService.updateForService(id, updates.networkConfig)
              : null,
            updates.networkPorts &&
            JSON.stringify(updates.networkPorts) !==
              JSON.stringify(currentRelations.networkPorts)
              ? NetworkPortsService.updateForService(id, updates.networkPorts)
              : null,
            updates.credentials &&
            JSON.stringify(updates.credentials) !==
              JSON.stringify(currentRelations.credentials)
              ? CredentialsService.updateForService(id, updates.credentials)
              : null,
            updates.subServices &&
            JSON.stringify(updates.subServices) !==
              JSON.stringify(currentRelations.subServices)
              ? SubServicesService.updateForService(id, updates.subServices)
              : null,
            updates.customFields &&
            JSON.stringify(updates.customFields) !==
              JSON.stringify(currentRelations.customFields)
              ? CustomFieldsService.updateForService(id, updates.customFields)
              : null,
          ].filter(Boolean)
        );
      }

      return this.getServiceWithRelations(data);
    } catch (error) {
      console.error("Error en updateService:", error);
      throw error;
    }
  }

  static async deleteService(id: string): Promise<void> {
    // Primero eliminar relaciones
    await this.deleteServiceRelations(id);

    // Luego eliminar el servicio
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) throw error;
  }

  private static async getServiceWithRelations(
    data: DatabaseService
  ): Promise<Service> {
    const relations = await this.getServiceRelations(data.id!);
    return ServiceMapper.mapDatabaseToService(data, relations);
  }

  private static async getServiceRelations(
    serviceId: string
  ): Promise<ServiceRelations> {
    const [
      specifications,
      networkConfig,
      networkPorts,
      credentials,
      subServices,
      customFields,
    ] = await Promise.all([
      SpecificationService.getByServiceId(serviceId),
      NetworkConfigService.getByServiceId(serviceId),
      NetworkPortsService.getByServiceId(serviceId),
      CredentialsService.getByServiceId(serviceId),
      SubServicesService.getByServiceId(serviceId),
      CustomFieldsService.getByServiceId(serviceId),
    ]);

    return {
      specifications,
      networkConfig,
      networkPorts,
      credentials,
      subServices,
      customFields,
    };
  }

  private static async createServiceRelations(
    serviceId: string,
    service: Omit<Service, "id" | "createdAt" | "updatedAt">
  ): Promise<void> {
    await Promise.all([
      SpecificationService.createForService(
        serviceId,
        service.specifications || []
      ),
      (async () => {
        // Eliminar config previa si existe para evitar duplicidad
        await NetworkConfigService.deleteForService(serviceId);
        await NetworkConfigService.createForService(
          serviceId,
          service.networkConfig
        );
      })(),
      NetworkPortsService.createForService(
        serviceId,
        service.networkPorts || []
      ),
      CredentialsService.createForService(serviceId, service.credentials || []),
      SubServicesService.createForService(serviceId, service.subServices || []),
      CustomFieldsService.createForService(
        serviceId,
        service.customFields || []
      ),
    ]);
  }

  private static async deleteServiceRelations(
    serviceId: string
  ): Promise<void> {
    await Promise.all([
      SpecificationService.deleteForService(serviceId),
      NetworkConfigService.deleteForService(serviceId),
      NetworkPortsService.deleteForService(serviceId),
      CredentialsService.deleteForService(serviceId),
      SubServicesService.deleteForService(serviceId),
      CustomFieldsService.deleteForService(serviceId),
    ]);
  }

  // Métodos de operaciones (delegados a ServiceOperations)
  static startService = ServiceOperations.startService;
  static stopService = ServiceOperations.stopService;
  static logServiceAction = ServiceOperations.logServiceAction;
  static getServiceUsageLogs = ServiceOperations.getServiceUsageLogs;
}
