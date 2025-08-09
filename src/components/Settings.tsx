import React, { useState } from "react";
import { supabase } from "../lib/supabase";

interface User {
  id: string;
  email?: string;
  [key: string]: string | undefined;
}

interface SettingsProps {
  user: User;
}

interface NotificationSettings {
  emailNotifications: boolean;
  costAlerts: boolean;
  serviceDownAlerts: boolean;
  costThreshold: number;
}

interface DisplaySettings {
  theme: "light" | "dark" | "system";
  currency: "USD" | "EUR" | "MXN";
  language: "es" | "en";
}

interface BillingSettings {
  billingEmail: string;
  billingCycle: "monthly" | "quarterly" | "yearly";
  taxRate: number;
}

const Settings: React.FC<SettingsProps> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      emailNotifications: true,
      costAlerts: true,
      serviceDownAlerts: true,
      costThreshold: 1000,
    });

  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>({
    theme: "system",
    currency: "USD",
    language: "es",
  });

  const [billingSettings, setBillingSettings] = useState<BillingSettings>({
    billingEmail: user?.email || "",
    billingCycle: "monthly",
    taxRate: 16,
  });

  // Cargar configuración inicial
  const loadSettings = React.useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 es el código para "no se encontraron resultados"
        throw error;
      }

      if (data) {
        setNotificationSettings(data.notification_settings);
        setDisplaySettings(data.display_settings);
        setBillingSettings({
          ...data.billing_settings,
          billingEmail: data.billing_settings.billingEmail || user?.email || "",
        });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      // No mostramos alerta aquí ya que son configuraciones iniciales
    } finally {
      setLoading(false);
    }
  }, [user.id, user.email]); // Cargar configuración cuando el componente se monta
  React.useEffect(() => {
    if (user?.id) {
      loadSettings();
    }
  }, [user?.id, loadSettings]);

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNotificationSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDisplayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDisplaySettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBillingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBillingSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveSettings = async () => {
    try {
      // Primero intentamos actualizar el registro existente
      const { error: updateError } = await supabase
        .from("user_settings")
        .update({
          notification_settings: notificationSettings,
          display_settings: displaySettings,
          billing_settings: billingSettings,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      // Si no existe el registro, lo creamos
      if (updateError && updateError.code === "PGRST116") {
        const { error: insertError } = await supabase
          .from("user_settings")
          .insert({
            user_id: user.id,
            notification_settings: notificationSettings,
            display_settings: displaySettings,
            billing_settings: billingSettings,
          });

        if (insertError) {
          console.error("Error details:", insertError);
          throw insertError;
        }
      } else if (updateError) {
        console.error("Error details:", updateError);
        throw updateError;
      }

      alert("Configuración guardada exitosamente");
    } catch (error: unknown) {
      console.error("Error saving settings:", error);

      let errorMessage = "Error al guardar la configuración";
      if (error && typeof error === "object" && "code" in error) {
        if (error.code === "42P01") {
          errorMessage =
            "La tabla de configuraciones no existe. Por favor, ejecute las migraciones de la base de datos.";
        } else if ("message" in error && typeof error.message === "string") {
          errorMessage += ": " + error.message;
        }
      }

      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      {/* Sección de Notificaciones */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Configuración de Notificaciones
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-gray-700 dark:text-gray-300">
              Notificaciones por Email
            </label>
            <input
              type="checkbox"
              name="emailNotifications"
              checked={notificationSettings.emailNotifications}
              onChange={handleNotificationChange}
              className="h-4 w-4 text-blue-600"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-gray-700 dark:text-gray-300">
              Alertas de Costos
            </label>
            <input
              type="checkbox"
              name="costAlerts"
              checked={notificationSettings.costAlerts}
              onChange={handleNotificationChange}
              className="h-4 w-4 text-blue-600"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-gray-700 dark:text-gray-300">
              Alertas de Servicio Caído
            </label>
            <input
              type="checkbox"
              name="serviceDownAlerts"
              checked={notificationSettings.serviceDownAlerts}
              onChange={handleNotificationChange}
              className="h-4 w-4 text-blue-600"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-gray-700 dark:text-gray-300">
              Umbral de Costo ($)
            </label>
            <input
              type="number"
              name="costThreshold"
              value={notificationSettings.costThreshold}
              onChange={handleNotificationChange}
              className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Sección de Visualización */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Configuración de Visualización
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-gray-700 dark:text-gray-300">Tema</label>
            <select
              name="theme"
              value={displaySettings.theme}
              onChange={handleDisplayChange}
              className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
              <option value="system">Sistema</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-gray-700 dark:text-gray-300">Moneda</label>
            <select
              name="currency"
              value={displaySettings.currency}
              onChange={handleDisplayChange}
              className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="MXN">MXN ($)</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-gray-700 dark:text-gray-300">Idioma</label>
            <select
              name="language"
              value={displaySettings.language}
              onChange={handleDisplayChange}
              className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sección de Facturación */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Configuración de Facturación
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-gray-700 dark:text-gray-300">
              Email de Facturación
            </label>
            <input
              type="email"
              name="billingEmail"
              value={billingSettings.billingEmail}
              onChange={handleBillingChange}
              className="mt-1 block w-64 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-gray-700 dark:text-gray-300">
              Ciclo de Facturación
            </label>
            <select
              name="billingCycle"
              value={billingSettings.billingCycle}
              onChange={handleBillingChange}
              className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="monthly">Mensual</option>
              <option value="quarterly">Trimestral</option>
              <option value="yearly">Anual</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-gray-700 dark:text-gray-300">
              Tasa de Impuestos (%)
            </label>
            <input
              type="number"
              name="taxRate"
              value={billingSettings.taxRate}
              onChange={handleBillingChange}
              className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Botón de Guardar */}
      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Guardar Configuración
        </button>
      </div>
    </div>
  );
};

export default Settings;
