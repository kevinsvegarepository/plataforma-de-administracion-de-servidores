import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
//import { NetworkConfigProps } from "./types";

const NetworkConfig: React.FC<NetworkConfigProps> = ({
  networkConfig,
  networkPorts,
  onConfigChange,
  onAddPort,
  onRemovePort,
}) => {
  const [newPort, setNewPort] = useState("");
  const [newPortDesc, setNewPortDesc] = useState("");

  const handleAddPort = () => {
    if (newPort && newPortDesc) {
      onAddPort(parseInt(newPort), newPortDesc);
      setNewPort("");
      setNewPortDesc("");
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Configuración de Red
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            IP Pública
          </label>
          <input
            type="text"
            placeholder="192.168.1.100"
            value={networkConfig.publicIp || ""}
            onChange={(e) => onConfigChange("publicIp", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            IP Privada
          </label>
          <input
            type="text"
            placeholder="192.168.1.100"
            value={networkConfig.privateIp || ""}
            onChange={(e) => onConfigChange("privateIp", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            IP Interna
          </label>
          <input
            type="text"
            placeholder="192.168.1.100"
            value={networkConfig.internalIp || ""}
            onChange={(e) => onConfigChange("privateIp", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-800 mb-3">
          Puertos Abiertos
        </h4>
        <div className="space-y-2 mb-4">
          {networkPorts.map((port) => (
            <div
              key={port.id}
              className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700">
                  Puerto {port.port} - {port.description}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onRemovePort(port.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Número"
            value={newPort}
            onChange={(e) => setNewPort(e.target.value)}
            className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Descripción"
            value={newPortDesc}
            onChange={(e) => setNewPortDesc(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="button"
            onClick={handleAddPort}
            disabled={!newPort || !newPortDesc}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NetworkConfig;
