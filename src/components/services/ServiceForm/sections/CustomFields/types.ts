import { ServiceCustomField } from "../../../../../types";

export interface CustomFieldsProps {
  customFields: ServiceCustomField[];
  onAdd: (
    key: string,
    value: string,
    type: "text" | "number" | "date" | "boolean" | "url"
  ) => void;
  onRemove: (id: string) => void;
}
