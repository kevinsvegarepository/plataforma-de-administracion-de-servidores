import React, { useState, useEffect } from "react";
import { Process, ProcessType, ProcessTypeLabels } from "../types/process";
import { ProcessService } from "../services/processService";

interface ProcessFormProps {
  serviceId: string;
  providerId: string;
  onSave: () => void;
  onCancel: () => void;
  process?: Process;
}

const defaultProcessConfig = {
  envVars: {},
  autoRestart: true,
  healthCheck: {
    command: "",
    interval: 30,
    timeout: 5,
    retries: 3,
  },
};

const defaultProcessResources = {
  cpu: {
    limit: 1,
    reserved: 0.5,
  },
  memory: {
    limit: 1024,
    reserved: 512,
  },
};

const ProcessForm: React.FC<ProcessFormProps> = ({
  serviceId,
  providerId,
  onSave,
  onCancel,
  process,
}) => {
  const [formData, setFormData] = useState<Partial<Process>>({
    name: "",
    type: "other" as ProcessType,
    status: "stopped",
    port: undefined,
    command: "",
    serviceId,
    providerId,
    configuration: defaultProcessConfig,
    resources: defaultProcessResources,
    dependencies: [],
  });

  const [availableProcesses, setAvailableProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(false);
  const [envVars, setEnvVars] = useState<Array<{ key: string; value: string }>>(
    []
  );

  useEffect(() => {
    if (process) {
      setFormData(process);
      if (process.configuration.envVars) {
        setEnvVars(
          Object.entries(process.configuration.envVars).map(([key, value]) => ({
            key,
            value,
          }))
        );
      }
    }
    loadAvailableProcesses();
  }, [process]);

  const loadAvailableProcesses = async () => {
    try {
      const processes = await ProcessService.getProcessesByService(serviceId);
      setAvailableProcesses(processes.filter((p) => p.id !== process?.id));
    } catch (error) {
      console.error("Error loading processes:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEnvVarChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const newEnvVars = [...envVars];
    newEnvVars[index][field] = value;
    setEnvVars(newEnvVars);

    // Actualizar configuration.envVars en formData
    const newEnvVarsObj = newEnvVars.reduce((acc, curr) => {
      if (curr.key) {
        acc[curr.key] = curr.value;
      }
      return acc;
    }, {} as Record<string, string>);

    setFormData((prev) => ({
      ...prev,
      configuration: {
        ...prev.configuration,
        envVars: newEnvVarsObj,
      },
    }));
  };

  const addEnvVar = () => {
    setEnvVars([...envVars, { key: "", value: "" }]);
  };

  const removeEnvVar = (index: number) => {
    const newEnvVars = envVars.filter((_, i) => i !== index);
    setEnvVars(newEnvVars);
  };

  const handleResourceChange = (
    resource: "cpu" | "memory",
    field: "limit" | "reserved",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      resources: {
        ...prev.resources!,
        [resource]: {
          ...prev.resources![resource],
          [field]: parseFloat(value),
        },
      },
    }));
  };

  const handleDependencyChange = (processId: string) => {
    const newDependencies = formData.dependencies?.includes(processId)
      ? formData.dependencies.filter((id) => id !== processId)
      : [...(formData.dependencies || []), processId];

    setFormData((prev) => ({
      ...prev,
      dependencies: newDependencies,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (process?.id) {
        await ProcessService.updateProcess(process.id, formData);
      } else {
        await ProcessService.createProcess(
          formData as Omit<Process, "id" | "createdAt" | "updatedAt">
        );
      }
      onSave();
    } catch (error) {
      console.error("Error saving process:", error);
      alert("Error al guardar el proceso");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {process ? "Editar Proceso" : "Nuevo Proceso"}
        </h3>

        {/* Información básica */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nombre del Proceso
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tipo de Proceso
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {Object.entries(ProcessTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Puerto
            </label>
            <input
              type="number"
              name="port"
              value={formData.port || ""}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Comando de Inicio
            </label>
            <input
              type="text"
              name="command"
              value={formData.command || ""}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Variables de entorno */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Variables de Entorno
          </label>
          {envVars.map((envVar, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={envVar.key}
                onChange={(e) =>
                  handleEnvVarChange(index, "key", e.target.value)
                }
                placeholder="Clave"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <input
                type="text"
                value={envVar.value}
                onChange={(e) =>
                  handleEnvVarChange(index, "value", e.target.value)
                }
                placeholder="Valor"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeEnvVar(index)}
                className="px-2 py-1 text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addEnvVar}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            + Agregar Variable
          </button>
        </div>

        {/* Recursos */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Recursos
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400">
                CPU Límite (cores)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.resources?.cpu.limit}
                onChange={(e) =>
                  handleResourceChange("cpu", "limit", e.target.value)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400">
                CPU Reservada (cores)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.resources?.cpu.reserved}
                onChange={(e) =>
                  handleResourceChange("cpu", "reserved", e.target.value)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400">
                Memoria Límite (MB)
              </label>
              <input
                type="number"
                value={formData.resources?.memory.limit}
                onChange={(e) =>
                  handleResourceChange("memory", "limit", e.target.value)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400">
                Memoria Reservada (MB)
              </label>
              <input
                type="number"
                value={formData.resources?.memory.reserved}
                onChange={(e) =>
                  handleResourceChange("memory", "reserved", e.target.value)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Dependencias */}
        {availableProcesses.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dependencias
            </h4>
            <div className="space-y-2">
              {availableProcesses.map((proc) => (
                <label key={proc.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.dependencies?.includes(proc.id)}
                    onChange={() => handleDependencyChange(proc.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {proc.name} ({ProcessTypeLabels[proc.type]})
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProcessForm;
