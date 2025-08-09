import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { SubServicesProps } from "./types";

const SubServices: React.FC<SubServicesProps> = ({
  subServices,
  onAdd,
  onRemove,
}) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [rate, setRate] = useState("");

  const handleAdd = () => {
    onAdd(name, type, parseFloat(rate));
    setName("");
    setType("");
    setRate("");
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Sub-Servicios</h3>

      <div className="space-y-4">
        {subServices.map((sub) => (
          <div
            key={sub.id}
            className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                {sub.name}
              </div>
              <div className="text-xs text-gray-500">
                {sub.type} - ${sub.hourlyRate}/hora
              </div>
            </div>
            <button
              type="button"
              onClick={() => onRemove(sub.id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Tipo"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="number"
            placeholder="$/hora"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            step="0.01"
            min="0"
            className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!name.trim() || !type.trim() || !rate}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubServices;
