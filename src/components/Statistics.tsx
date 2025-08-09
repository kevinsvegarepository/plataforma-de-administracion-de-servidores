import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { Service } from "../types";
import { BillingCalculator } from "../utils/billingCalculator";

interface StatisticsProps {
  services: Service[];
}

const Statistics: React.FC<StatisticsProps> = ({ services }) => {
  // Obtener datos mensuales del año actual
  const getCurrentYearMonthlyData = () => {
    const currentYear = new Date().getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(currentYear, i, 1);
      const monthCosts = services.reduce((acc, service) => {
        const billing = BillingCalculator.calculateServiceCost(service, date);
        return acc + billing.currentMonthCost;
      }, 0);
      return {
        name: date.toLocaleString("es-ES", { month: "short" }),
        total: monthCosts,
      };
    });
    return months;
  };

  // Obtener datos por tipo de servicio
  const getServiceTypeData = () => {
    const typeData = services.reduce((acc, service) => {
      const type = service.type;
      if (!acc[type]) {
        acc[type] = {
          name: getServiceTypeLabel(type),
          count: 0,
          cost: 0,
        };
      }
      acc[type].count++;
      const billing = BillingCalculator.calculateServiceCost(service);
      acc[type].cost += billing.currentMonthCost;
      return acc;
    }, {} as Record<string, { name: string; count: number; cost: number }>);

    return Object.values(typeData);
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

  const monthlyData = getCurrentYearMonthlyData();
  const serviceTypeData = getServiceTypeData();

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Gastos Mensuales {new Date().getFullYear()}
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3b82f6"
                name="Gasto Total"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Gastos por Tipo de Servicio
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={serviceTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cost" fill="#3b82f6" name="Gasto" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Distribución de Servicios
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#10b981" name="Cantidad" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Historial de Costos
          </h2>
          <div className="space-y-4">
            {services.map((service) => {
              const billing = BillingCalculator.calculateServiceCost(service);
              return (
                <div
                  key={service.id}
                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded"
                >
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {getServiceTypeLabel(service.type)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      ${billing.currentMonthCost.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Este mes
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
