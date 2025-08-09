import React, { useEffect, useState } from "react";
import { BillingRecord, BillingSummary } from "../services/serviceTypes";
import { BillingCalculation, Service } from "../types";
import { ServiceService } from "../services/serviceService";
import {
  getBillingRecords,
  getBillingSummary,
} from "../services/billingService";
import {
  updateBillingStatus,
  addPaymentRecord,
  getBillingStats,
} from "../services/billingOperations";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const BillingDashboard: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string | "all">("all");
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([]);
  const [billingSummaries, setBillingSummaries] = useState<
    Record<string, BillingSummary>
  >({});
  const [calculations, setCalculations] = useState<
    Record<string, BillingCalculation>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<BillingRecord | null>(
    null
  );
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [billingPeriodStart, setBillingPeriodStart] = useState<string>(
    format(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      "yyyy-MM-dd"
    )
  );
  const [billingPeriodEnd, setBillingPeriodEnd] = useState<string>(
    format(
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      "yyyy-MM-dd"
    )
  );

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    if (services.length > 0) {
      loadBillingData();
    }
  }, [services, selectedService]);

  const loadServices = async () => {
    try {
      const servicesData = await ServiceService.getAllServices();
      setServices(servicesData);
    } catch (err) {
      setError("Error al cargar los servicios");
    }
  };

  const loadBillingData = async () => {
    setLoading(true);
    try {
      if (selectedService === "all") {
        const recordsPromises = services.map((service) =>
          getBillingRecords(service.id)
        );
        const summariesPromises = services.map((service) =>
          getBillingSummary(service.id)
        );

        const [recordsResults, summariesResults] = await Promise.all([
          Promise.all(recordsPromises),
          Promise.all(summariesPromises),
        ]);

        const allRecords = recordsResults.flat();
        const summariesMap = services.reduce((acc, service, index) => {
          acc[service.id] = summariesResults[index];
          return acc;
        }, {} as Record<string, BillingSummary>);

        setBillingRecords(allRecords);
        setBillingSummaries(summariesMap);
      } else {
        const [records, summary] = await Promise.all([
          getBillingRecords(selectedService),
          getBillingSummary(selectedService),
        ]);
        setBillingRecords(records);
        setBillingSummaries({ [selectedService]: summary });
      }
    } catch (err) {
      setError("Error al cargar los datos de facturación");
    } finally {
      setLoading(false);
    }
  };

  const getTotalCosts = () => {
    const totals = {
      paid: 0,
      pending: 0,
      total: 0,
    };

    Object.values(billingSummaries).forEach((summary) => {
      totals.paid += summary.total_paid || 0;
      totals.pending += summary.total_pending || 0;
      totals.total += (summary.total_paid || 0) + (summary.total_pending || 0);
    });

    return totals;
  };

  const costs = getTotalCosts();

  const handleUpdateStatus = async (recordId: string, newStatus: string) => {
    try {
      await updateBillingStatus(recordId, newStatus);
      await loadBillingData();
      alert("Estado actualizado correctamente");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error al actualizar el estado");
    }
  };

  const handleShowPayment = (record: BillingRecord) => {
    setSelectedRecord(record);
    setPaymentAmount(record.amount.toString());
    setPaymentDate(format(new Date(), "yyyy-MM-dd"));
    setShowPaymentModal(true);
  };

  const handleSubmitPayment = async () => {
    if (!paymentAmount) {
      alert("Por favor ingrese el monto");
      return;
    }

    try {
      if (selectedRecord) {
        // Actualizar un registro existente como pagado
        await updateBillingStatus(selectedRecord.id, "paid");
        await loadBillingData();
        alert("Pago registrado correctamente");
      } else {
        // Crear un nuevo registro de facturación
        if (selectedService === "all" || !selectedService) {
          alert("Por favor seleccione un servicio");
          return;
        }

        await addPaymentRecord(
          selectedService,
          parseFloat(paymentAmount),
          "Facturación manual"
        );
        await loadBillingData();
        alert("Facturación registrada correctamente");
      }

      setShowPaymentModal(false);
    } catch (error) {
      console.error("Error en la operación:", error);
      alert("Error al procesar la operación");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Panel de Facturación</h1>

        {/* Selector de servicio */}
        <div className="mb-6 flex justify-between items-center">
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full md:w-64 p-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="all">Todos los servicios</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSelectedRecord(null);
              setPaymentAmount("");
              setPaymentDate(format(new Date(), "yyyy-MM-dd"));
              setShowPaymentModal(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Registrar Nueva Facturación
          </button>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Total Pagado
            </h3>
            <p className="text-3xl font-bold text-green-600">
              ${costs.paid.toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Pendiente de Pago
            </h3>
            <p className="text-3xl font-bold text-yellow-600">
              ${costs.pending.toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total</h3>
            <p className="text-3xl font-bold text-blue-600">
              ${costs.total.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Gráfico de gastos */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Historial de Gastos
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={billingRecords}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="billing_date"
                  type="category"
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  formatter={(value) => [
                    `$${Number(value).toFixed(2)}`,
                    "Monto",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabla de registros */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Servicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {billingRecords.map((record) => {
                  const service = services.find(
                    (s) => s.id === record.service_id
                  );
                  return (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {service?.name || "Desconocido"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(record.billing_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {record.description || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${record.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            record.status === "paid"
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : record.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                              : record.status === "canceled"
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : "bg-gray-100 text-gray-800 border border-gray-200"
                          }`}
                        >
                          {record.status === "paid"
                            ? "Pagado"
                            : record.status === "pending"
                            ? "Pendiente"
                            : record.status === "canceled"
                            ? "Cancelado"
                            : "Desconocido"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        {record.status !== "paid" && (
                          <>
                            <button
                              onClick={() => handleShowPayment(record)}
                              className="inline-flex items-center px-3 py-1 border border-green-200 text-xs font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 transition-colors duration-150"
                            >
                              <svg
                                className="h-3 w-3 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                              Registrar Pago
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateStatus(record.id, "canceled")
                              }
                              className="inline-flex items-center px-3 py-1 border border-red-200 text-xs font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 transition-colors duration-150"
                            >
                              <svg
                                className="h-3 w-3 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              Cancelar
                            </button>
                          </>
                        )}
                        {record.status === "paid" && (
                          <span className="text-gray-500 text-xs">
                            Pagado el{" "}
                            {format(
                              new Date(record.billing_date),
                              "dd/MM/yyyy"
                            )}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Pago */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto max-w-md">
            <div className="relative bg-white rounded-lg shadow-xl">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedRecord ? "Registrar Pago" : "Nueva Facturación"}
                  </h3>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <span className="sr-only">Cerrar</span>
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                {!selectedRecord && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Servicio
                    </label>
                    <select
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      onChange={(e) => setSelectedService(e.target.value)}
                      value={selectedService === "all" ? "" : selectedService}
                    >
                      <option value="">Seleccione un servicio</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto
                  </label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0.00"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Pago
                  </label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmitPayment}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Confirmar Pago
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
