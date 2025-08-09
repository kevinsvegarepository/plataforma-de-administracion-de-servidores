import { DatabaseService, ServiceRelations } from "./serviceTypes";
import { Service, ServiceType } from "../types";

export class ServiceMapper {
  static mapServiceToDatabase(service: Partial<Service>): DatabaseService {
    const data: DatabaseService = {};
    if (service.id !== undefined) data.id = service.id;
    if (service.name !== undefined) data.name = service.name;
    if (service.type !== undefined) data.type = service.type;
    if (service.provider !== undefined) data.provider_name = service.provider;
    if (service.providerId !== undefined) data.provider_id = service.providerId;
    if (service.status !== undefined) data.status = service.status;
    if (service.isRunning !== undefined) data.is_running = service.isRunning;
    if (
      service.purchaseDate instanceof Date &&
      !isNaN(service.purchaseDate.getTime())
    )
      data.purchase_date = service.purchaseDate.toISOString();
    if (
      service.renewalDate instanceof Date &&
      !isNaN(service.renewalDate.getTime())
    )
      data.renewal_date = service.renewalDate.toISOString();
    if (service.hourlyRate !== undefined) data.hourly_rate = service.hourlyRate;
    if (service.estimatedMonthlyHours !== undefined)
      data.estimated_monthly_hours = service.estimatedMonthlyHours;
    if (service.description !== undefined)
      data.description = service.description;
    if (service.notes !== undefined) data.notes = service.notes;
    if (service.totalRunningHours !== undefined)
      data.total_running_hours = service.totalRunningHours;
    if (
      service.lastStartTime instanceof Date &&
      !isNaN(service.lastStartTime.getTime())
    )
      data.last_start_time = service.lastStartTime.toISOString();
    if (
      service.lastStopTime instanceof Date &&
      !isNaN(service.lastStopTime.getTime())
    )
      data.last_stop_time = service.lastStopTime.toISOString();
    if (service.tags !== undefined) {
      // Asegurarse de que tags sea un array válido
      data.tags = Array.isArray(service.tags)
        ? service.tags.filter(
            (tag) => typeof tag === "string" && tag.trim() !== ""
          )
        : [];
    }
    if (
      service.createdAt instanceof Date &&
      !isNaN(service.createdAt.getTime())
    )
      data.created_at = service.createdAt.toISOString();
    if (
      service.updatedAt instanceof Date &&
      !isNaN(service.updatedAt.getTime())
    )
      data.updated_at = service.updatedAt.toISOString();
    return data;
  }
  // Mapeos para independencia de tipos locales
  static mapSpecification(spec: import("./serviceTypes").ServiceSpecification) {
    return {
      id: spec.id ?? "",
      serviceId: spec.service_id ?? "",
      key: spec.key ?? "",
      value: spec.value ?? "",
    };
  }

  static mapNetworkConfig(config: import("./serviceTypes").NetworkConfig) {
    return {
      id: config.id ?? "",
      serviceId: config.service_id ?? "",
      publicIp: config.public_ip ?? "",
      privateIp: config.private_ip ?? "",
      internalIp: config.internal_ip ?? "",
    };
  }

  static mapNetworkPort(port: import("./serviceTypes").NetworkPort) {
    return {
      id: port.id ?? "",
      serviceId: port.service_id ?? "",
      port: port.port ?? 0,
      description: port.description ?? "",
      isOpen: port.is_open ?? false,
    };
  }

  static mapCredential(cred: import("./serviceTypes").ServiceCredential) {
    return {
      id: cred.id ?? "",
      serviceId: cred.service_id ?? "",
      key: cred.key ?? "",
      value: cred.value ?? "",
    };
  }

  static mapSubService(sub: import("./serviceTypes").SubService) {
    return {
      id: sub.id ?? "",
      parentServiceId: sub.parent_service_id ?? "",
      name: sub.name ?? "",
      status: "active" as const,
      type: "" as string,
      hourlyRate: sub.hourly_rate ?? 0,
      description: sub.description ?? "",
    };
  }

  static mapCustomField(field: import("./serviceTypes").CustomField) {
    return {
      id: field.id ?? "",
      serviceId: field.service_id ?? "",
      key: field.key ?? "",
      value: field.value ?? "",
      type: "text" as const,
    };
  }
  static mapDatabaseToService(
    data: DatabaseService,
    relations?: ServiceRelations
  ): Service {
    if (!data.id || !data.name || !data.type || !data.status) {
      console.error("Datos incompletos del servicio:", data);
      throw new Error("Missing required service data");
    }

    return {
      id: data.id,
      name: data.name,
      type: data.type as ServiceType,
      provider: data.provider_name ?? data.provider?.name ?? "",
      providerId: data.provider_id ?? data.provider?.id ?? "",
      status: data.status as Service["status"],
      isRunning: data.is_running ?? false,
      purchaseDate: data.purchase_date
        ? new Date(data.purchase_date)
        : new Date(0),
      renewalDate: data.renewal_date
        ? new Date(data.renewal_date)
        : new Date(0),
      hourlyRate: data.hourly_rate ?? 0,
      estimatedMonthlyHours: data.estimated_monthly_hours ?? 0,
      description: data.description ?? "",
      specifications:
        relations?.specifications?.map(ServiceMapper.mapSpecification) || [],
      networkConfig: {
        id: relations?.networkConfig?.id ?? "",
        serviceId: relations?.networkConfig?.service_id ?? data.id,
        publicIp: relations?.networkConfig?.public_ip ?? "",
        privateIp: relations?.networkConfig?.private_ip ?? "",
        internalIp: relations?.networkConfig?.internal_ip ?? "",
      },
      networkPorts:
        relations?.networkPorts?.map(ServiceMapper.mapNetworkPort) || [],
      credentials:
        relations?.credentials?.map(ServiceMapper.mapCredential) || [],
      subServices:
        relations?.subServices?.map(ServiceMapper.mapSubService) || [],
      customFields:
        relations?.customFields?.map(ServiceMapper.mapCustomField) || [],
      tags: Array.isArray(data.tags) ? data.tags : [],
      notes: data.notes ?? "",
      totalRunningHours: data.total_running_hours ?? 0,
      lastStartTime: data.last_start_time
        ? new Date(data.last_start_time)
        : undefined,
      lastStopTime: data.last_stop_time
        ? new Date(data.last_stop_time)
        : undefined,
      createdAt: data.created_at ? new Date(data.created_at) : new Date(0),
      updatedAt: data.updated_at ? new Date(data.updated_at) : new Date(0),
      billingRecords: relations?.billingRecords || [],
      billingSummary: relations?.billingSummary,
    };
  }
}
