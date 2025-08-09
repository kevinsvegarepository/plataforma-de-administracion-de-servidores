import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { SpecificationsProps } from "./types";

const Specifications: React.FC<SpecificationsProps> = ({
  specifications,
  onAdd,
  onRemove,
}) => {
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const handleAdd = () => {
    onAdd(newKey, newValue);
    setNewKey("");
    setNewValue("");
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Especificaciones Técnicas
      </h3>
      <div className="space-y-4">
        {specifications.map((spec) => (
          <div key={spec.id} className="flex items-center gap-4">
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700">
                {spec.key}:
              </span>
              <span className="ml-2 text-sm text-gray-900">{spec.value}</span>
            </div>
            <button
              type="button"
              onClick={() => onRemove(spec.id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Clave"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Valor"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!newKey.trim() || !newValue.trim()}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Specifications;
