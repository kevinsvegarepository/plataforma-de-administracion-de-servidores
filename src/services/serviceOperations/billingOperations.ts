import { Service } from "../../types";
import { BillingCalculator } from "../../utils/billingCalculator";

export class BillingOperations {
  static calculateCurrentRunningTime(service: Service): number {
    return BillingCalculator.calculateCurrentRunningTime(service);
  }

  static calculateServiceCost(service: Service) {
    return BillingCalculator.calculateServiceCost(service);
  }

  static estimateMonthlyCost(service: Service): number {
    return service.hourlyRate * service.estimatedMonthlyHours;
  }

  static calculateLifetimeCost(service: Service): number {
    return service.hourlyRate * (service.totalRunningHours || 0);
  }
}
