import { SubService } from "../../../types";

export interface SubServicesProps {
  subServices: SubService[];
  onAdd: (name: string, type: string, rate: number) => void;
  onRemove: (id: string) => void;
}
