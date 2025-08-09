import { supabase } from "../lib/supabase";
import { MonthlyExpense } from "../types";

export async function createOrUpdateMonthlyExpense(params: {
  serviceId: string;
  totalHours: number;
  totalCost: number;
  projectedHours?: number;
  projectedCost?: number;
  notes?: string;
}): Promise<MonthlyExpense> {
  const { data, error } = await supabase
    .rpc("upsert_monthly_expense", {
      p_service_id: params.serviceId,
      p_total_hours: params.totalHours,
      p_total_cost: params.totalCost,
      p_projected_hours: params.projectedHours,
      p_projected_cost: params.projectedCost,
      p_notes: params.notes,
    })
    .select();

  if (error)
    throw new Error(
      `Error creating/updating monthly expense: ${error.message}`
    );
  return data;
}

export async function getCurrentMonthExpense(
  serviceId: string
): Promise<MonthlyExpense | null> {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const { data, error } = await supabase
    .from("monthly_expenses")
    .select("*")
    .eq("service_id", serviceId)
    .eq("year", year)
    .eq("month", month)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 es el código para "no se encontraron registros"
    throw new Error(`Error fetching current month expense: ${error.message}`);
  }

  return data;
}

export async function getMonthlyExpenses(
  serviceId: string,
  year?: number,
  month?: number
): Promise<MonthlyExpense[]> {
  let query = supabase
    .from("monthly_expenses")
    .select("*")
    .eq("service_id", serviceId);

  if (year !== undefined) {
    query = query.eq("year", year);
  }
  if (month !== undefined) {
    query = query.eq("month", month);
  }

  const { data, error } = await query
    .order("year", { ascending: false })
    .order("month", { ascending: false });

  if (error)
    throw new Error(`Error fetching monthly expenses: ${error.message}`);
  return data || [];
}

export async function getCurrentMonthSummary(): Promise<
  Record<string, MonthlyExpense>
> {
  const { data, error } = await supabase
    .from("current_month_expenses")
    .select("*");

  if (error)
    throw new Error(`Error fetching current month summary: ${error.message}`);

  return data.reduce((acc, expense) => {
    acc[expense.service_id] = expense;
    return acc;
  }, {} as Record<string, MonthlyExpense>);
}

export async function updateMonthlyExpenseNotes(
  id: string,
  notes: string
): Promise<MonthlyExpense> {
  const { data, error } = await supabase
    .from("monthly_expenses")
    .update({ notes })
    .eq("id", id)
    .select()
    .single();

  if (error)
    throw new Error(`Error updating monthly expense notes: ${error.message}`);
  return data;
}
