import React, { useState } from "react";
import { Provider } from "../types";
import { Globe, Mail, Phone, ExternalLink, Plus, Trash2 } from "lucide-react";
import { ProviderService } from "../services/providerService";
import ProviderForm from "./ProviderForm";

interface ProvidersListProps {
  providers: Provider[];
  onProvidersChange: () => void;
}

const ProvidersList: React.FC<ProvidersListProps> = ({
  providers,
  onProvidersChange,
}) => {
  const [showForm, setShowForm] = useState(false);

  const handleCreateProvider = async (providerData: Omit<Provider, "id">) => {
    try {
      await ProviderService.createProvider(providerData);
      setShowForm(false);
      onProvidersChange();
    } catch (error) {
      console.error("Error al crear el proveedor:", error);
      alert("Error al crear el proveedor. Por favor, intenta de nuevo.");
    }
  };

  const handleDeleteProvider = async (providerId: string) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este proveedor?")
    ) {
      try {
        await ProviderService.deleteProvider(providerId);
        onProvidersChange();
      } catch (error) {
        console.error("Error al eliminar el proveedor:", error);
        alert("Error al eliminar el proveedor. Por favor, intenta de nuevo.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Proveedores
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Información de contacto de tus proveedores de servicios
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Proveedor
          </button>
        )}
      </div>

      {showForm && (
        <ProviderForm
          onSubmit={handleCreateProvider}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {provider.logo ? (
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={provider.logo}
                      alt={`${provider.name} logo`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWdsb2JlIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIvPjxsaW5lIHgxPSIyIiB5MT0iMTIiIHgyPSIyMiIgeTI9IjEyIi8+PHBhdGggZD0iTTEyIDJhMTUuMyAxNS4zIDAgMCAxIDQgMTAgMTUuMyAxNS4zIDAgMCAxLTQgMTAgMTUuMyAxNS4zIDAgMCAxLTQtMTAgMTUuMyAxNS4zIDAgMCAxIDQtMTB6Ii8+PC9zdmc+";
                      }}
                    />
                  </div>
                ) : (
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Globe className="h-6 w-6 text-blue-600" />
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {provider.name}
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <ExternalLink className="h-4 w-4 text-gray-400" />
                <a
                  href={provider.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  {provider.website}
                </a>
              </div>

              <div className="flex items-center space-x-3 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <a
                  href={`mailto:${provider.supportEmail}`}
                  className="text-gray-700 hover:text-gray-900"
                >
                  {provider.supportEmail}
                </a>
              </div>

              <div className="flex items-center space-x-3 text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                <a
                  href={`tel:${provider.supportPhone}`}
                  className="text-gray-700 hover:text-gray-900"
                >
                  {provider.supportPhone}
                </a>
              </div>

              <button
                onClick={() => handleDeleteProvider(provider.id)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Eliminar proveedor"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {providers.length === 0 && (
        <div className="text-center py-12">
          <Globe className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No hay proveedores
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Los proveedores aparecerán aquí automáticamente cuando agregues
            servicios.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProvidersList;
