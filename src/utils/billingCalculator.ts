import { Service, BillingCalculation } from "../types";

export class BillingCalculator {
  static calculateCurrentRunningTime(service: Service): number {
    if (!service.isRunning || !service.lastStartTime) return 0;

    const now = new Date();
    const startTime = new Date(service.lastStartTime);
    return (now.getTime() - startTime.getTime()) / (1000 * 60 * 60); // hours
  }

  static calculateTotalHours(service: Service): number {
    const currentRunningHours = this.calculateCurrentRunningTime(service);
    return service.totalRunningHours + currentRunningHours;
  }

  static calculateCurrentMonthHours(service: Service): number {
    // This would typically query the database for usage logs in current month
    // For now, we'll use a simplified calculation
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    if (service.lastStartTime && service.lastStartTime >= monthStart) {
      return this.calculateCurrentRunningTime(service);
    }

    return service.estimatedMonthlyHours * (now.getDate() / 30); // Rough estimate
  }

  static calculateServiceCost(service: Service): BillingCalculation {
    const totalHours = this.calculateTotalHours(service);
    const currentMonthHours = this.calculateCurrentMonthHours(service);

    // Calculate sub-services cost
    const subServicesCost = Array.isArray(service.subServices)
      ? service.subServices.reduce((total, sub) => {
          return total + sub.hourlyRate * currentMonthHours;
        }, 0)
      : 0;

    const mainServiceCost = service.hourlyRate * currentMonthHours;
    const totalCurrentMonthCost = mainServiceCost + subServicesCost;

    return {
      serviceId: service.id,
      currentMonthHours,
      currentMonthCost: totalCurrentMonthCost,
      projectedMonthlyHours: service.estimatedMonthlyHours,
      projectedMonthlyCost:
        service.hourlyRate * service.estimatedMonthlyHours +
        (Array.isArray(service.subServices)
          ? service.subServices.reduce(
              (total, sub) =>
                total + sub.hourlyRate * service.estimatedMonthlyHours,
              0
            )
          : 0),
      totalLifetimeHours: totalHours,
      totalLifetimeCost: service.hourlyRate * totalHours,
    };
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(amount);
  }

  static formatHours(hoursDecimal: number): string {
    const totalSeconds = Math.floor(hoursDecimal * 3600);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
}
