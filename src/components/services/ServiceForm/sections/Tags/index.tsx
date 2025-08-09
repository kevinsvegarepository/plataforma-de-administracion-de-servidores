import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import { TagsProps } from "./types";

const Tags: React.FC<TagsProps> = ({ tags, onAdd, onRemove }) => {
  const [newTag, setNewTag] = useState("");

  const handleAdd = () => {
    onAdd(newTag);
    setNewTag("");
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Etiquetas</h3>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => onRemove(tag)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nueva etiqueta"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), handleAdd())
            }
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!newTag.trim()}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tags;
