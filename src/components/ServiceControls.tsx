import React, { useState } from 'react';
import { Service } from '../types';
import { Play, Square, Clock, DollarSign, Activity } from 'lucide-react';
import { BillingCalculator } from '../utils/billingCalculator';

interface ServiceControlsProps {
  service: Service;
  onStart: (serviceId: string) => Promise<void>;
  onStop: (serviceId: string) => Promise<void>;
  disabled?: boolean;
}

const ServiceControls: React.FC<ServiceControlsProps> = ({
  service,
  onStart,
  onStop,
  disabled = false
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    setIsLoading(true);
    try {
      await onStart(service.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = async () => {
    setIsLoading(true);
    try {
      await onStop(service.id);
    } finally {
      setIsLoading(false);
    }
  };

  const billing = BillingCalculator.calculateServiceCost(service);
  const currentRunningTime = BillingCalculator.calculateCurrentRunningTime(service);

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            service.isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
          }`} />
          <span className="font-medium text-gray-900">
            {service.isRunning ? 'En Ejecución' : 'Detenido'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {service.isRunning ? (
            <button
              onClick={handleStop}
              disabled={disabled || isLoading}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Square className="h-4 w-4 mr-1" />
              {isLoading ? 'Deteniendo...' : 'Detener'}
            </button>
          ) : (
            <button
              onClick={handleStart}
              disabled={disabled || isLoading || service.status !== 'active'}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="h-4 w-4 mr-1" />
              {isLoading ? 'Iniciando...' : 'Iniciar'}
            </button>
          )}
        </div>
      </div>

      {/* Real-time metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Clock className="h-4 w-4 text-gray-400 mr-1" />
          </div>
          <div className="font-medium text-gray-900">
            {service.isRunning ? BillingCalculator.formatHours(currentRunningTime) : '0h'}
          </div>
          <div className="text-gray-500">Sesión Actual</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Activity className="h-4 w-4 text-gray-400 mr-1" />
          </div>
          <div className="font-medium text-gray-900">
            {BillingCalculator.formatHours(billing.totalLifetimeHours)}
          </div>
          <div className="text-gray-500">Total Horas</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
          </div>
          <div className="font-medium text-gray-900">
            {BillingCalculator.formatCurrency(billing.currentMonthCost)}
          </div>
          <div className="text-gray-500">Mes Actual</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
          </div>
          <div className="font-medium text-gray-900">
            {BillingCalculator.formatCurrency(service.hourlyRate)}
          </div>
          <div className="text-gray-500">Por Hora</div>
        </div>
      </div>

      {/* Current session cost */}
      {service.isRunning && currentRunningTime > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-700">Costo de sesión actual:</span>
            <span className="font-medium text-blue-900">
              {BillingCalculator.formatCurrency(currentRunningTime * service.hourlyRate)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceControls;