import React, { useState } from "react";
import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { CredentialsProps } from "./types";

const Credentials: React.FC<CredentialsProps> = ({
  credentials,
  showPasswords,
  onToggleShowPasswords,
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Credenciales de Acceso
        </h3>
        <button
          type="button"
          onClick={onToggleShowPasswords}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          {showPasswords ? (
            <>
              <EyeOff className="h-4 w-4 mr-1" />
              Ocultar
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-1" />
              Mostrar
            </>
          )}
        </button>
      </div>

      <div className="space-y-4">
        {credentials.map((cred) => (
          <div key={cred.id} className="flex items-center gap-4">
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700">
                {cred.key}:
              </span>
              <span className="ml-2 text-sm text-gray-900">
                {showPasswords || !cred.key.toLowerCase().includes("password")
                  ? cred.value
                  : "••••••••"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onRemove(cred.id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Usuario/Clave"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type={showPasswords ? "text" : "password"}
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

export default Credentials;
