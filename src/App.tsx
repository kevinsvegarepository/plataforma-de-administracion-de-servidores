import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import ServicesList from "./components/services/ServiceList/ServicesList";
import ServiceForm from "./components/services/ServiceForm";
import ServiceDetail from "./components/ServiceDetail";
import ProvidersList from "./components/ProvidersList";
import Statistics from "./components/Statistics";
import Settings from "./components/Settings";
import { BillingDashboard } from "./components/BillingDashboard";
import { ProcessesView } from "./components/ProcessesView";
import { ThemeProvider } from "./context/ThemeContext";
import { Service, Provider } from "./types";
import { mockServices, mockProviders } from "./data/mockData";
import { ServiceService } from "./services/serviceService";
import { ProviderService } from "./services/providerService";

import AuthForm from "./components/AuthForm";
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [services, setServices] = useState<Service[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Autenticación: mostrar AuthForm si no hay usuario
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      const newUser = data?.session?.user ?? null;
      setUser(newUser);
      setLoading(false);

      // Si hay un usuario autenticado, cargamos los datos
      if (newUser) {
        await loadServices();
        await loadProviders();
      }
    };
    getSession();
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const newUser = session?.user ?? null;
        setUser(newUser);

        // Si hay un usuario autenticado, cargamos los datos
        if (newUser) {
          await loadServices();
          await loadProviders();
        }
      }
    );
    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);
  // Load services from database
  useEffect(() => {
    loadServices();
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const providersData = await ProviderService.getAllProviders();
      console.log("Providers loaded successfully:", providersData);
      if (Array.isArray(providersData)) {
        setProviders(providersData);
      } else {
        console.error("Providers data is not an array:", providersData);
        setProviders([]);
      }
    } catch (error) {
      console.error("Error loading providers:", error);
      setProviders([]);
      // No usamos datos simulados para evitar confusiones
    }
  };

  const loadServices = async () => {
    try {
      const servicesData = await ServiceService.getAllServices();
      setServices(servicesData);
    } catch (error) {
      console.error("Error loading services:", error);
      // Fallback to mock data
      setServices(mockServices);
    }
  };

  const handleAddService = () => {
    setEditingService(null);
    setShowServiceForm(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setShowServiceForm(true);
    setSelectedService(null);
  };

  const handleViewService = (service: Service) => {
    setSelectedService(service);
  };

  const handleSaveService = (serviceData: Omit<Service, "id"> | Service) => {
    const saveService = async () => {
      try {
        if ("id" in serviceData) {
          // Editing existing service
          console.log("Editando servicio existente:", serviceData);
          const updatedService = await ServiceService.updateService(
            serviceData.id,
            serviceData
          );
          setServices((prev) =>
            prev.map((s) => (s.id === serviceData.id ? updatedService : s))
          );
          alert("Servicio actualizado exitosamente");
        } else {
          // Adding new service
          console.log("Creando nuevo servicio:", serviceData);
          const newService = await ServiceService.createService(serviceData);
          setServices((prev) => [...prev, newService]);

          // Add provider if it doesn't exist
          const providerExists = providers.some(
            (p) => p.name === serviceData.provider
          );
          if (!providerExists) {
            const newProvider: Provider = {
              id: Date.now().toString(),
              name: serviceData.provider,
              website: `https://${serviceData.provider
                .toLowerCase()
                .replace(/\s+/g, "")}.com`,
              supportEmail: `support@${serviceData.provider
                .toLowerCase()
                .replace(/\s+/g, "")}.com`,
              supportPhone: "+1-800-000-0000",
            };
            setProviders((prev) => [...prev, newProvider]);
          }
        }

        setShowServiceForm(false);
        setEditingService(null);
      } catch (error) {
        console.error("Error saving service:", error);
        alert("Error al guardar el servicio. Por favor, intenta de nuevo.");
      }
    };

    saveService();
  };

  const handleDeleteService = (serviceId: string) => {
    const deleteService = async () => {
      if (
        window.confirm("¿Estás seguro de que quieres eliminar este servicio?")
      ) {
        try {
          await ServiceService.deleteService(serviceId);
          setServices((prev) => prev.filter((s) => s.id !== serviceId));
        } catch (error) {
          console.error("Error deleting service:", error);
          alert("Error al eliminar el servicio. Por favor, intenta de nuevo.");
        }
      }
    };

    deleteService();
  };

  const handleStartService = async (serviceId: string) => {
    try {
      const updatedService = await ServiceService.startService(serviceId);
      setServices((prev) =>
        prev.map((s) => (s.id === serviceId ? updatedService : s))
      );
    } catch (error) {
      console.error("Error starting service:", error);
      alert("Error al iniciar el servicio. Por favor, intenta de nuevo.");
    }
  };

  const handleStopService = async (serviceId: string) => {
    try {
      const updatedService = await ServiceService.stopService(serviceId);
      setServices((prev) =>
        prev.map((s) => (s.id === serviceId ? updatedService : s))
      );
    } catch (error) {
      console.error("Error stopping service:", error);
      alert("Error al detener el servicio. Por favor, intenta de nuevo.");
    }
  };

  const handleCancelForm = () => {
    setShowServiceForm(false);
    setEditingService(null);
  };

  const handleCloseDetail = () => {
    setSelectedService(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard services={services} />;
      case "statistics":
        return <Statistics services={services} />;
      case "services":
        return (
          <ServicesList
            services={services}
            onAddService={handleAddService}
            onViewService={handleViewService}
            onEditService={handleEditService}
            onDeleteService={handleDeleteService}
            onStartService={handleStartService}
            onStopService={handleStopService}
          />
        );
      case "processes":
        return (
          <ProcessesView
            services={services}
            onServiceUpdate={(updatedService) => {
              setServices((prev) =>
                prev.map((s) =>
                  s.id === updatedService.id ? updatedService : s
                )
              );
            }}
          />
        );
      case "providers":
        return (
          <ProvidersList
            providers={providers}
            onProvidersChange={loadProviders}
          />
        );
      case "billing":
        return <BillingDashboard />;
      case "settings":
        return <Settings user={user} />;
      default:
        return <Dashboard services={services} />;
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setCurrentView("dashboard");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Error al cerrar sesión. Por favor, intenta de nuevo.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        Cargando...
      </div>
    );
  if (!user) return <AuthForm />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Layout
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={handleLogout}
      >
        {renderCurrentView()}
      </Layout>

      {showServiceForm && (
        <ServiceForm
          service={editingService || undefined}
          onSave={handleSaveService}
          onCancel={handleCancelForm}
        />
      )}

      {selectedService && (
        <ServiceDetail
          service={selectedService}
          onClose={handleCloseDetail}
          onEdit={handleEditService}
        />
      )}
    </div>
  );
}

export default App;
