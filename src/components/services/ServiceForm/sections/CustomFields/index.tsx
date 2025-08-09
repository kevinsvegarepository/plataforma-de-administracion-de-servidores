import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { CustomFieldsProps } from "./types";

const CustomFields: React.FC<CustomFieldsProps> = ({
  customFields,
  onAdd,
  onRemove,
}) => {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState<
    "text" | "number" | "date" | "boolean" | "url"
  >("text");

  const handleAdd = () => {
    onAdd(key, value, type);
    setKey("");
    setValue("");
    setType("text");
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Campos Personalizados
      </h3>

      <div className="space-y-4">
        {customFields.map((field) => (
          <div key={field.id} className="flex items-center gap-4">
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700">
                {field.key}:
              </span>
              <span className="ml-2 text-sm text-gray-900">{field.value}</span>
              <span className="ml-2 text-xs text-gray-500">({field.type})</span>
            </div>
            <button
              type="button"
              onClick={() => onRemove(field.id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Campo"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Valor"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="text">Texto</option>
            <option value="number">Número</option>
            <option value="date">Fecha</option>
            <option value="boolean">Booleano</option>
            <option value="url">URL</option>
          </select>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!key.trim() || !value.trim()}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomFields;
