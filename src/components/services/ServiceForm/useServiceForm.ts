import { useState, useEffect } from "react";
import {
  ServiceFormProps,
  FormData,
  InputChangeHandler,
  FieldChangeHandler,
  PortConfiguration,
} from "./types";

export const useServiceForm = ({ service, onSave }: ServiceFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    type: "virtual-machine",
    provider: "",
    status: "active",
    isRunning: false,
    purchaseDate: "",
    renewalDate: "",
    hourlyRate: 0,
    estimatedMonthlyHours: 720,
    description: "",
    specifications: [],
    networkConfig: {
      id: "",
      serviceId: "",
      publicIp: "",
      privateIp: "",
      internalIp: "",
    },
    networkPorts: [],
    credentials: [],
    subServices: [],
    customFields: [],
    tags: [],
    notes: "",
    totalRunningHours: 0,
  });

  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        type: service.type,
        provider: service.provider,
        status: service.status,
        isRunning: service.isRunning,
        purchaseDate: service.purchaseDate.toISOString().split("T")[0],
        renewalDate: service.renewalDate.toISOString().split("T")[0],
        hourlyRate: service.hourlyRate,
        estimatedMonthlyHours: service.estimatedMonthlyHours,
        description: service.description,
        specifications: service.specifications || [],
        networkConfig: service.networkConfig || {
          id: "",
          serviceId: "",
          publicIp: "",
          privateIp: "",
          internalIp: "",
        },
        networkPorts: service.networkPorts || [],
        credentials: service.credentials || [],
        subServices: service.subServices || [],
        customFields: service.customFields || [],
        tags: service.tags || [],
        notes: service.notes || "",
        totalRunningHours: service.totalRunningHours,
      });
    }
  }, [service]);

  const handleInputChange: InputChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "hourlyRate" || name === "estimatedMonthlyHours"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleNetworkConfigChange: FieldChangeHandler = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      networkConfig: {
        ...prev.networkConfig,
        [field]: value,
      },
    }));
  };

  const handleAddSpecification = (key: string, value: string) => {
    if (key.trim() && value.trim()) {
      setFormData((prev) => ({
        ...prev,
        specifications: [
          ...prev.specifications,
          {
            id: Date.now().toString(),
            serviceId: service?.id || "",
            key: key.trim(),
            value: value.trim(),
          },
        ],
      }));
    }
  };

  const handleRemoveSpecification = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((spec) => spec.id !== id),
    }));
  };

  const handleAddPort = (
    port: number,
    protocol: string,
    description: string
  ) => {
    const newPort: PortConfiguration = {
      port,
      protocol,
      description,
      isOpen: true,
    };

    setFormData((prev) => ({
      ...prev,
      networkPorts: [...prev.networkPorts, newPort],
    }));
  };

  const handleRemovePort = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      networkPorts: prev.networkPorts.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceData = {
      ...formData,
      purchaseDate: new Date(formData.purchaseDate),
      renewalDate: new Date(formData.renewalDate),
      ...(service
        ? {
            id: service.id,
            createdAt: service.createdAt,
            updatedAt: new Date(),
          }
        : {}),
    };
    onSave(serviceData);
  };

  const handleAddTag = (tag: string) => {
    if (tag.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tag.trim()],
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  return {
    formData,
    handleSubmit,
    handleInputChange,
    handleNetworkConfigChange,
    handleAddSpecification,
    handleRemoveSpecification,
    handleAddPort,
    handleRemovePort,
    handleAddTag,
    handleRemoveTag,
    showPasswords,
    setShowPasswords,
  };
};
