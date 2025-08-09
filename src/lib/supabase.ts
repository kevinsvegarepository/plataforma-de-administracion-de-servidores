import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type Database = {
  public: {
    Tables: {
      providers: {
        Row: {
          id: string;
          name: string;
          website: string | null;
          support_email: string | null;
          support_phone: string | null;
          logo: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          website?: string | null;
          support_email?: string | null;
          support_phone?: string | null;
          logo?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          website?: string | null;
          support_email?: string | null;
          support_phone?: string | null;
          logo?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          name: string;
          type: string;
          provider: string;
          status: string;
          is_running: boolean;
          purchase_date: string;
          renewal_date: string;
          hourly_rate: number;
          estimated_monthly_hours: number;
          description: string;
          specifications: any;
          network_config: any;
          credentials: any;
          sub_services: any;
          custom_fields: any;
          tags: string[];
          notes: string;
          total_running_hours: number;
          last_start_time: string | null;
          last_stop_time: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          provider: string;
          status?: string;
          is_running?: boolean;
          purchase_date: string;
          renewal_date: string;
          hourly_rate?: number;
          estimated_monthly_hours?: number;
          description?: string;
          specifications?: any;
          network_config?: any;
          credentials?: any;
          sub_services?: any;
          custom_fields?: any;
          tags?: string[];
          notes?: string;
          total_running_hours?: number;
          last_start_time?: string | null;
          last_stop_time?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          provider?: string;
          status?: string;
          is_running?: boolean;
          purchase_date?: string;
          renewal_date?: string;
          hourly_rate?: number;
          estimated_monthly_hours?: number;
          description?: string;
          specifications?: any;
          network_config?: any;
          credentials?: any;
          sub_services?: any;
          custom_fields?: any;
          tags?: string[];
          notes?: string;
          total_running_hours?: number;
          last_start_time?: string | null;
          last_stop_time?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      service_usage_logs: {
        Row: {
          id: string;
          service_id: string;
          action: string;
          timestamp: string;
          duration: number | null;
          cost: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          service_id: string;
          action: string;
          timestamp?: string;
          duration?: number | null;
          cost?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          service_id?: string;
          action?: string;
          timestamp?: string;
          duration?: number | null;
          cost?: number | null;
          created_at?: string;
        };
      };
    };
  };
};