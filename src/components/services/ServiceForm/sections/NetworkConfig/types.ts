import { ServiceNetworkConfig, ServiceNetworkPort } from "./types";

export interface NetworkConfigProps {
  networkConfig: ServiceNetworkConfig;
  networkPorts: ServiceNetworkPort[];
  onConfigChange: (field: string, value: string) => void;
  onAddPort: (port: number, description: string) => void;
  onRemovePort: (id: string) => void;
}
