import { FormData } from "../../types";

export interface BasicInfoProps {
  formData: Pick<
    FormData,
    | "name"
    | "type"
    | "provider"
    | "status"
    | "purchaseDate"
    | "renewalDate"
    | "hourlyRate"
    | "estimatedMonthlyHours"
    | "description"
  >;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}
