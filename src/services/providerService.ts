import { supabase } from "../lib/supabase";
import { Provider } from "../types";

interface DatabaseProvider {
  id?: string;
  name?: string;
  website?: string;
  support_email?: string;
  support_phone?: string;
  created_at?: string;
  updated_at?: string;
  logo?: string;
}

export const ProviderService = {
  async getAllProviders(): Promise<Provider[]> {
    console.log("Fetching providers from database...");
    const { data, error } = await supabase.from("providers").select("*");

    if (error) {
      console.error("Error fetching providers:", error);
      throw error;
    }

    console.log("Providers fetched from database:", data);

    // Convertir de snake_case a camelCase para el frontend
    return data.map((item) => ({
      id: item.id,
      name: item.name,
      website: item.website,
      supportEmail: item.support_email,
      supportPhone: item.support_phone,
      logo: item.logo,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at),
    })) as Provider[];
  },

  async createProvider(provider: Omit<Provider, "id">): Promise<Provider> {
    // Validar y limpiar la URL del logo
    let cleanLogoUrl = provider.logo?.trim();
    if (cleanLogoUrl && !cleanLogoUrl.match(/^https?:\/\/.+/)) {
      cleanLogoUrl = undefined; // Si no es una URL válida, no la guardamos
    }

    const providerData = {
      name: provider.name.trim(),
      website: provider.website?.trim(),
      support_email: provider.supportEmail?.trim(),
      support_phone: provider.supportPhone?.trim(),
      logo: cleanLogoUrl,
      //created_at: new Date().toISOString(),
      //updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("providers")
      .insert([providerData])
      .select()
      .single();

    if (error) throw error;

    // Convertir de snake_case a camelCase para el frontend
    return {
      id: data.id,
      name: data.name,
      website: data.website,
      supportEmail: data.support_email,
      supportPhone: data.support_phone,
      logo: data.logo,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    } as Provider;
  },

  async updateProvider(
    id: string,
    provider: Partial<Provider>
  ): Promise<Provider> {
    const providerData: DatabaseProvider = {};
    if (provider.name) providerData.name = provider.name;
    if (provider.website) providerData.website = provider.website;
    if (provider.supportEmail)
      providerData.support_email = provider.supportEmail;
    if (provider.supportPhone)
      providerData.support_phone = provider.supportPhone;
    if (provider.logo) providerData.logo = provider.logo;
    providerData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("providers")
      .update(providerData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Convertir de snake_case a camelCase para el frontend
    return {
      id: data.id,
      name: data.name,
      website: data.website,
      supportEmail: data.support_email,
      supportPhone: data.support_phone,
      logo: data.logo,
    } as Provider;
  },

  async deleteProvider(id: string): Promise<void> {
    const { error } = await supabase.from("providers").delete().eq("id", id);

    if (error) throw error;
  },
};
