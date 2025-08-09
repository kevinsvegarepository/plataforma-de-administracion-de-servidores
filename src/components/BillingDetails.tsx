import React, { useEffect, useState } from "react";
import { BillingRecord, BillingSummary } from "../services/serviceTypes";
import {
  getBillingRecords,
  getBillingSummary,
  markBillingRecordAsPaid,
  markBillingRecordAsCancelled,
} from "../services/billingService";

interface BillingDetailsProps {
  serviceId: string;
}

export const BillingDetails: React.FC<BillingDetailsProps> = ({
  serviceId,
}) => {
  const [records, setRecords] = useState<BillingRecord[]>([]);
  const [summary, setSummary] = useState<BillingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBillingData = async () => {
    try {
      setLoading(true);
      const [recordsData, summaryData] = await Promise.all([
        getBillingRecords(serviceId),
        getBillingSummary(serviceId),
      ]);
      setRecords(recordsData);
      setSummary(summaryData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error cargando datos de facturación"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBillingData();
  }, [serviceId]);

  const handleMarkAsPaid = async (recordId: string) => {
    try {
      await markBillingRecordAsPaid(recordId);
      await loadBillingData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al marcar como pagado"
      );
    }
  };

  const handleMarkAsCancelled = async (recordId: string) => {
    try {
      await markBillingRecordAsCancelled(recordId);
      await loadBillingData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cancelar el registro"
      );
    }
  };

  if (loading)
    return <div className="p-4">Cargando registros de facturación...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Resumen de facturación */}
      {summary && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Resumen de Facturación</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-600">Total Pagado</p>
              <p className="text-2xl font-bold text-green-600">
                ${summary.total_paid.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Pendiente de Pago</p>
              <p className="text-2xl font-bold text-yellow-600">
                ${summary.total_pending.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Total Registros</p>
              <p className="text-2xl font-bold">{summary.total_records}</p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de registros */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.map((record) => (
              <tr key={record.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(record.billing_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {record.description || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.currency} {record.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                        ${
                                          record.status === "paid"
                                            ? "bg-green-100 text-green-800"
                                            : record.status === "pending"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                  >
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {record.status === "pending" && (
                    <div className="space-x-2">
                      <button
                        onClick={() => handleMarkAsPaid(record.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Marcar como pagado
                      </button>
                      <button
                        onClick={() => handleMarkAsCancelled(record.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
