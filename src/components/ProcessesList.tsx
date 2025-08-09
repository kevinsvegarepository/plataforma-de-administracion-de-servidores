import React, { useState, useEffect, useCallback } from "react";
import { Process, ProcessTypeLabels } from "../types/process";
import { ProcessService } from "../services/processService";
import { Service } from "../types";
import ProcessForm from "./ProcessForm";

interface ProcessesListProps {
  service: Service;
  onServiceUpdate: (updatedService: Service) => void;
}

const ProcessesList: React.FC<ProcessesListProps> = ({
  service,
  onServiceUpdate,
}) => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProcess, setEditingProcess] = useState<Process | undefined>();

  const loadProcesses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ProcessService.getProcessesByService(service.id);
      setProcesses(data);
    } catch (error) {
      console.error("Error loading processes:", error);
      setProcesses([]);
    } finally {
      setLoading(false);
    }
  }, [service.id]);

  useEffect(() => {
    loadProcesses();
  }, [loadProcesses]);

  const handleAddProcess = () => {
    setEditingProcess(undefined);
    setShowForm(true);
  };

  const handleEditProcess = (process: Process) => {
    setEditingProcess(process);
    setShowForm(true);
  };

  const handleDeleteProcess = async (process: Process) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este proceso?")) {
      try {
        await ProcessService.deleteProcess(process.id);
        await loadProcesses();
        onServiceUpdate(service);
      } catch (error) {
        console.error("Error deleting process:", error);
        alert("Error al eliminar el proceso");
      }
    }
  };

  const handleStatusChange = async (process: Process) => {
    try {
      const newStatus = process.status === "running" ? "stopped" : "running";
      await ProcessService.updateProcessStatus(process.id, newStatus);
      await loadProcesses();
      onServiceUpdate(service);
    } catch (error) {
      console.error("Error updating process status:", error);
      alert("Error al actualizar el estado del proceso");
    }
  };

  const handleSave = async () => {
    await loadProcesses();
    setShowForm(false);
    onServiceUpdate(service);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Encabezado */}
      <div className="flex justify-between items-center px-6 py-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-medium text-gray-900">
            Gestión de Procesos
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {processes.length} procesos configurados
          </p>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={handleAddProcess}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
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
            Nuevo Proceso
          </button>
        </div>
      </div>

      {/* Lista de procesos */}
      {processes.length === 0 ? (
        <div className="text-center py-12 px-6">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 48 48"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17v-2a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H9a2 2 0 01-2-2v-8a2 2 0 012-2h2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Sin procesos
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza agregando un nuevo proceso a este servicio.
          </p>
          <div className="mt-6">
            <button
              onClick={handleAddProcess}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
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
              Agregar Proceso
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto border-t border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nombre
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tipo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Puerto
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Estado
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Recursos
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {processes.map((process) => (
                <tr key={process.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100">
                        <svg
                          className="h-6 w-6 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {process.name}
                        </div>
                        {process.command && (
                          <div className="text-sm text-gray-500">
                            {process.command}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {ProcessTypeLabels[process.type]}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {process.port || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        process.status === "running"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : process.status === "error"
                          ? "bg-red-100 text-red-800 border border-red-200"
                          : "bg-gray-100 text-gray-800 border border-gray-200"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 mr-2 rounded-full ${
                          process.status === "running"
                            ? "bg-green-400"
                            : process.status === "error"
                            ? "bg-red-400"
                            : "bg-gray-400"
                        }`}
                      ></span>
                      {process.status === "running"
                        ? "Ejecutando"
                        : process.status === "stopped"
                        ? "Detenido"
                        : process.status === "error"
                        ? "Error"
                        : "Pendiente"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="flex items-center mb-1">
                        <span className="text-xs text-gray-500 w-8">CPU:</span>
                        <div className="flex-1 h-2 mx-2 rounded-full bg-gray-100">
                          <div
                            className="h-2 rounded-full bg-blue-500"
                            style={{
                              width: `${
                                (process.resources.cpu.reserved /
                                  process.resources.cpu.limit) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 w-16 text-right">
                          {process.resources.cpu.reserved}/
                          {process.resources.cpu.limit}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 w-8">RAM:</span>
                        <div className="flex-1 h-2 mx-2 rounded-full bg-gray-100">
                          <div
                            className="h-2 rounded-full bg-green-500"
                            style={{
                              width: `${
                                (process.resources.memory.reserved /
                                  process.resources.memory.limit) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 w-16 text-right">
                          {process.resources.memory.reserved}/
                          {process.resources.memory.limit}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleStatusChange(process)}
                      className={`inline-flex items-center px-3 py-1 border text-xs font-medium rounded-md transition-colors duration-150 ${
                        process.status === "running"
                          ? "border-red-200 text-red-700 bg-red-50 hover:bg-red-100"
                          : "border-green-200 text-green-700 bg-green-50 hover:bg-green-100"
                      }`}
                    >
                      {process.status === "running" ? (
                        <>
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
                          Detener
                        </>
                      ) : (
                        <>
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
                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                          </svg>
                          Iniciar
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleEditProcess(process)}
                      className="inline-flex items-center px-3 py-1 border border-gray-200 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteProcess(process)}
                      className="inline-flex items-center px-3 py-1 border border-red-200 text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors duration-150"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto max-w-4xl">
            <div className="relative bg-white rounded-lg shadow-xl">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingProcess ? "Editar Proceso" : "Nuevo Proceso"}
                  </h3>
                  <button
                    onClick={() => setShowForm(false)}
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
              </div>
              <div className="p-6">
                <ProcessForm
                  serviceId={service.id}
                  providerId={service.providerId}
                  process={editingProcess}
                  onSave={handleSave}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessesList;
