import { ServiceCredential } from "../../../../../types";

export interface CredentialsProps {
  credentials: ServiceCredential[];
  showPasswords: boolean;
  onToggleShowPasswords: () => void;
  onAdd: (key: string, value: string) => void;
  onRemove: (id: string) => void;
}
