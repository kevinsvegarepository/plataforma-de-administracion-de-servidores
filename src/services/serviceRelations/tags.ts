import { supabase } from "../../lib/supabase";

export class TagsService {
  static async getByServiceId(serviceId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("tags")
        .eq("id", serviceId)
        .single();

      if (error) {
        console.error("Error fetching tags:", error);
        return [];
      }

      return data?.tags || [];
    } catch (error) {
      console.error("Error in getByServiceId:", error);
      return [];
    }
  }

  static async updateForService(
    serviceId: string,
    tags: string[]
  ): Promise<void> {
    try {
      // Validar y limpiar los tags
      const validTags = Array.isArray(tags)
        ? tags.filter((tag) => typeof tag === "string" && tag.trim() !== "")
        : [];

      console.log("Sending tags to database:", {
        serviceId,
        validTags,
        isArray: Array.isArray(validTags),
        length: validTags.length,
      });

      // Actualizar directamente con los tags validados
      const { error } = await supabase
        .from("services")
        .update({
          tags: validTags.length > 0 ? validTags : [],
          updated_at: new Date().toISOString(),
        })
        .eq("id", serviceId);

      if (error) {
        console.error("Error updating tags:", error);
        throw error;
      }

      // Verificar la actualización
      const { data: updatedData, error: verifyError } = await supabase
        .from("services")
        .select("tags")
        .eq("id", serviceId)
        .single();

      if (verifyError) {
        console.error("Error verifying update:", verifyError);
      } else {
        console.log("Tags after update:", updatedData?.tags);
      }
    } catch (error) {
      console.error("Error updating tags:", error);
      throw error;
    }
  }
}
