import React, { useState } from "react";
import { Provider } from "../types";

interface ProviderFormProps {
  onSubmit: (provider: Omit<Provider, "id">) => void;
  onCancel: () => void;
}

const ProviderForm: React.FC<ProviderFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    supportEmail: "",
    supportPhone: "",
    logo: "", // Campo logo incluido
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-lg shadow"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Nuevo Proveedor</h2>
        <p className="mt-1 text-sm text-gray-600">
          Ingresa la información del nuevo proveedor de servicios
        </p>
      </div>

      <div className="space-y-4">
        {/* Nombre */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Sitio Web */}
        <div>
          <label
            htmlFor="website"
            className="block text-sm font-medium text-gray-700"
          >
            Sitio Web
          </label>
          <input
            type="url"
            id="website"
            name="website"
            required
            value={formData.website}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Email de Soporte */}
        <div>
          <label
            htmlFor="supportEmail"
            className="block text-sm font-medium text-gray-700"
          >
            Email de Soporte
          </label>
          <input
            type="email"
            id="supportEmail"
            name="supportEmail"
            required
            value={formData.supportEmail}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Teléfono de Soporte */}
        <div>
          <label
            htmlFor="supportPhone"
            className="block text-sm font-medium text-gray-700"
          >
            Teléfono de Soporte
          </label>
          <input
            type="tel"
            id="supportPhone"
            name="supportPhone"
            required
            value={formData.supportPhone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Logo */}
        <div>
          <label
            htmlFor="logo"
            className="block text-sm font-medium text-gray-700"
          >
            Logo (URL)
          </label>
          <input
            type="url"
            id="logo"
            name="logo"
            value={formData.logo}
            onChange={handleChange}
            placeholder="https://ejemplo.com/logo.png"
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Guardar
        </button>
      </div>
    </form>
  );
};

export default ProviderForm;
