import { ServiceSpecification } from "../../../types";

export interface SpecificationsProps {
  specifications: ServiceSpecification[];
  onAdd: (key: string, value: string) => void;
  onRemove: (id: string) => void;
}
