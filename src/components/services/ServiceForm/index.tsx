import React from "react";
import { X, Save } from "lucide-react";
import { ServiceFormProps } from "./types";
import { useServiceForm } from "./useServiceForm";
import BasicInfo from "./sections/BasicInfo";
import Specifications from "./sections/Specifications";
import NetworkConfig from "./sections/NetworkConfig";
import Credentials from "./sections/Credentials";
import SubServices from "./sections/SubServices";
import CustomFields from "./sections/CustomFields";
import Tags from "./sections/Tags";

const ServiceForm: React.FC<ServiceFormProps> = ({
  service,
  onSave,
  onCancel,
}) => {
  const {
    formData,
    handleSubmit,
    handleInputChange,
    handleNetworkConfigChange,
    handleAddSpecification,
    handleRemoveSpecification,
    handleAddPort,
    handleRemovePort,
    handleAddTag,
    handleRemoveTag,
    showPasswords,
    setShowPasswords,
  } = useServiceForm({ service, onSave, onCancel });

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-8 border w-11/12 max-w-4xl shadow-lg rounded-lg bg-white mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {service ? "Editar Servicio" : "Agregar Nuevo Servicio"}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <BasicInfo formData={formData} onInputChange={handleInputChange} />

          <Specifications
            specifications={formData.specifications}
            onAdd={handleAddSpecification}
            onRemove={handleRemoveSpecification}
          />

          <NetworkConfig
            networkConfig={formData.networkConfig}
            networkPorts={formData.networkPorts}
            onConfigChange={handleNetworkConfigChange}
            onAddPort={handleAddPort}
            onRemovePort={handleRemovePort}
          />

          <Credentials
            credentials={formData.credentials}
            showPasswords={showPasswords}
            onToggleShowPasswords={() => setShowPasswords(!showPasswords)}
            onAdd={() => {}}
            onRemove={() => {}}
          />

          <SubServices
            subServices={formData.subServices}
            onAdd={() => {}}
            onRemove={() => {}}
          />

          <CustomFields
            customFields={formData.customFields}
            onAdd={() => {}}
            onRemove={() => {}}
          />

          <Tags
            tags={formData.tags}
            onAdd={handleAddTag}
            onRemove={handleRemoveTag}
          />

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {service ? "Actualizar" : "Crear"} Servicio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;
