import React, { useState } from "react";
import {
  Server,
  Globe,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  LineChart,
  DollarSign,
  LogOut,
  Layers,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  currentView,
  onViewChange,
  onLogout,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "services", label: "Servicios", icon: Server },
    { id: "processes", label: "Procesos", icon: Layers },
    { id: "providers", label: "Proveedores", icon: Globe },
    { id: "billing", label: "Facturación", icon: DollarSign },
    { id: "statistics", label: "Estadísticas", icon: LineChart },
    { id: "settings", label: "Configuración", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
        >
          <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 ${
          isCollapsed ? "w-20" : "w-64"
        } transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 bg-white dark:bg-gray-800 shadow-lg transition-all duration-300`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4">
          <div className="flex items-center space-x-2">
            <Server className="h-8 w-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            {!isCollapsed && (
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                ServiceManager
              </h1>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:block hidden"
              title={isCollapsed ? "Expandir" : "Colapsar"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        <nav className="mt-8 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center ${
                  isCollapsed ? "justify-center" : "space-x-3"
                } px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                  currentView === item.id
                    ? "bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            );
          })}

          {/* Botón de cierre de sesión */}
          <button
            onClick={onLogout}
            className={`w-full flex items-center ${
              isCollapsed ? "justify-center" : "space-x-3"
            } px-4 py-3 text-left rounded-lg transition-colors duration-200 mt-auto mb-4 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900`}
            title={isCollapsed ? "Cerrar Sesión" : undefined}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Cerrar Sesión</span>}
          </button>
        </nav>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <div
        className={`transition-all duration-300 ${
          isCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
