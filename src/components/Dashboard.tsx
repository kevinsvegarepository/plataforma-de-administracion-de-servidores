import React, { useEffect, useState } from "react";
import { Service } from "../types";
import {
  Server,
  Database,
  HardDrive,
  Globe,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Play,
} from "lucide-react";
import { BillingCalculator } from "../utils/billingCalculator";

interface DashboardProps {
  services: Service[];
}

const Dashboard: React.FC<DashboardProps> = ({ services }) => {
  // Asegúrate de parsear fechas correctamente
  const parsedServices = services.map((s) => ({
    ...s,
    renewalDate: new Date(s.renewalDate),
    purchaseDate: new Date(s.purchaseDate),
  }));

  const totalServices = parsedServices.length;
  const activeServices = parsedServices.filter(
    (s) => s.status === "active"
  ).length;
  const runningServices = parsedServices.filter((s) => s.isRunning).length;
  const expiredServices = parsedServices.filter(
    (s) => s.status === "expired"
  ).length;

  const totalCurrentMonthCost = parsedServices
    .filter((s) => s.status === "active")
    .reduce((sum, s) => {
      const billing = BillingCalculator.calculateServiceCost(s);
      return sum + billing.currentMonthCost;
    }, 0);

  const totalProjectedMonthlyCost = parsedServices
    .filter((s) => s.status === "active")
    .reduce((sum, s) => {
      const billing = BillingCalculator.calculateServiceCost(s);
      return sum + billing.projectedMonthlyCost;
    }, 0);

  const totalYearCost = parsedServices
    .filter((s) => s.status === "active")
    .reduce((sum, s) => {
      const billing = BillingCalculator.calculateServiceCost(s);
      return sum + billing.currentMonthCost * 12; // Estimación anual basada en el gasto mensual actual
    }, 0);

  const servicesByType = parsedServices.reduce((acc, service) => {
    acc[service.type] = (acc[service.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const now = new Date();

  const upcomingRenewals = services
    .filter((s) => s.status === "active" && s.renewalDate)
    .filter((s) => new Date(s.renewalDate) > now)
    .sort(
      (a, b) =>
        new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime()
    );

  const getServiceTypeIcon = (type: string) => {
    switch (type) {
      case "virtual-machine":
        return Server;
      case "database":
        return Database;
      case "storage":
        return HardDrive;
      case "cdn":
        return Globe;
      default:
        return Server;
    }
  };

  const getServiceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      "virtual-machine": "Máquinas Virtuales",
      database: "Bases de Datos",
      storage: "Almacenamiento",
      cdn: "CDN",
      "load-balancer": "Load Balancer",
      monitoring: "Monitoreo",
      backup: "Backup",
      other: "Otros",
    };
    return labels[type] || type;
  };

  const [elapsedTimes, setElapsedTimes] = useState<Record<string, number>>(
    () => {
      const initialTimes: Record<string, number> = {};
      parsedServices.forEach((service) => {
        if (service.isRunning) {
          initialTimes[service.id] =
            BillingCalculator.calculateCurrentRunningTime(service);
        }
      });
      return initialTimes;
    }
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const updated: Record<string, number> = {};
      parsedServices.forEach((service) => {
        if (service.isRunning) {
          updated[service.id] =
            BillingCalculator.calculateCurrentRunningTime(service);
        }
      });
      setElapsedTimes(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [parsedServices]);

  const [timeUntilRenewalMap, setTimeUntilRenewalMap] = useState<
    Record<string, number>
  >(() => {
    const initial: Record<string, number> = {};
    upcomingRenewals.forEach((service) => {
      initial[service.id] = service.renewalDate.getTime() - Date.now();
    });
    return initial;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const updated: Record<string, number> = {};
      upcomingRenewals.forEach((service) => {
        updated[service.id] = service.renewalDate.getTime() - Date.now();
      });
      setTimeUntilRenewalMap(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [upcomingRenewals]);

  const formatDuration = (ms: number): string => {
    if (ms <= 0) return "Expirado";

    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${days}d ${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const formatToHHMMSS = (hours: number) => {
    const totalSeconds = Math.floor(hours * 3600);
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(totalSeconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Resumen general de tus servicios</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Servicios
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {totalServices}
              </p>
            </div>
            <Server className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Servicios Activos
              </p>
              <p className="text-2xl font-bold text-green-600">
                {activeServices}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Servicios Vencidos
              </p>
              <p className="text-2xl font-bold text-red-600">
                {expiredServices}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Servicios Ejecutándose
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {runningServices}
              </p>
            </div>
            <Play className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Gasto Mes Actual
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {BillingCalculator.formatCurrency(totalCurrentMonthCost)}
              </p>
              <p className="text-xs text-gray-500">
                Proyectado:{" "}
                {BillingCalculator.formatCurrency(totalProjectedMonthlyCost)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Services by Type */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Servicios por Tipo
          </h2>
          <div className="space-y-4">
            {Object.entries(servicesByType).map(([type, count]) => {
              const Icon = getServiceTypeIcon(type);
              return (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {getServiceTypeLabel(type)}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Running Services */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Servicios en Ejecución
          </h2>
          <div className="space-y-4">
            {services.filter((s) => s.isRunning).length > 0 ? (
              services
                .filter((s) => s.isRunning)
                .slice(0, 5)
                .map((service) => {
                  const currentRunningTime = elapsedTimes[service.id] || 0;
                  const currentCost = currentRunningTime * service.hourlyRate;

                  return (
                    <div
                      key={service.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {service.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {service.provider}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">
                          ⏱️{formatToHHMMSS(currentRunningTime)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {BillingCalculator.formatCurrency(currentCost)}
                        </p>
                      </div>
                    </div>
                  );
                })
            ) : (
              <p className="text-sm text-gray-500">
                No hay servicios ejecutándose
              </p>
            )}
          </div>
        </div>

        {/* Próximas Renovaciones */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Próximas Renovaciones
          </h2>
          <div className="space-y-4">
            {upcomingRenewals.length > 0 ? (
              upcomingRenewals.slice(0, 5).map((service) => {
                const timeLeftMs = timeUntilRenewalMap[service.id] ?? 0;
                const isUrgent = timeLeftMs <= 7 * 24 * 60 * 60 * 1000;

                return (
                  <div
                    key={service.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {service.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {service.provider}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-medium ${
                          isUrgent ? "text-red-600" : "text-orange-600"
                        }`}
                      >
                        {formatDuration(timeLeftMs)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {service.renewalDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500">
                No hay renovaciones próximas
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
