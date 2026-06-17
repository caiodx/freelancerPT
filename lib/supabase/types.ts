// ============================================================
// FreelancerPT — Tipos TypeScript do Supabase
// Formato gerado pelo Supabase CLI — manter em sincronia com schema.sql
// ============================================================

export type PeriodicidadeIVA = "trimestral" | "mensal";
export type StatusSubscricao = "trial" | "active" | "cancelled" | "expired" | "paused";
export type PlanoSubscricao  = "mensal" | "anual";
export type TipoCofre        = "iva" | "irs" | "ss";

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          nome: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          nome?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          nome?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      configuracoes_fiscais: {
        Row: {
          id: string;
          user_id: string;
          onboarding_completed: boolean;
          primeiro_ano: boolean;
          isento_iva: boolean;
          tem_retencao: boolean;
          coeficiente: number;
          periodicidade_iva: string;
          meta_reserva_pct: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          onboarding_completed?: boolean;
          primeiro_ano?: boolean;
          isento_iva?: boolean;
          tem_retencao?: boolean;
          coeficiente?: number;
          periodicidade_iva?: string;
          meta_reserva_pct?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          onboarding_completed?: boolean;
          primeiro_ano?: boolean;
          isento_iva?: boolean;
          tem_retencao?: boolean;
          coeficiente?: number;
          periodicidade_iva?: string;
          meta_reserva_pct?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      faturas: {
        Row: {
          id: string;
          user_id: string;
          valor_base: number;
          valor_iva: number;
          valor_total: number;
          iva_a_guardar: number;
          irs_a_guardar: number;
          ss_a_guardar: number;
          tem_retencao: boolean;
          data_fatura: string;
          cliente: string | null;
          descricao: string | null;
          numero_fatura: string | null;
          paga: boolean;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          valor_base: number;
          valor_iva?: number;
          valor_total?: number;
          iva_a_guardar?: number;
          irs_a_guardar?: number;
          ss_a_guardar?: number;
          tem_retencao?: boolean;
          data_fatura?: string;
          cliente?: string | null;
          descricao?: string | null;
          numero_fatura?: string | null;
          paga?: boolean;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          valor_base?: number;
          valor_iva?: number;
          valor_total?: number;
          iva_a_guardar?: number;
          irs_a_guardar?: number;
          ss_a_guardar?: number;
          tem_retencao?: boolean;
          data_fatura?: string;
          cliente?: string | null;
          descricao?: string | null;
          numero_fatura?: string | null;
          paga?: boolean;
          deleted_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      cofre_registos: {
        Row: {
          id: string;
          user_id: string;
          tipo: string;
          valor: number;
          descricao: string | null;
          data: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tipo: string;
          valor: number;
          descricao?: string | null;
          data?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tipo?: string;
          valor?: number;
          descricao?: string | null;
          data?: string;
        };
        Relationships: [];
      };
      subscricoes: {
        Row: {
          id: string;
          user_id: string;
          ls_subscription_id: string | null;
          ls_customer_id: string | null;
          ls_order_id: string | null;
          status: string;
          plano: string;
          trial_ends_at: string;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          ls_subscription_id?: string | null;
          ls_customer_id?: string | null;
          ls_order_id?: string | null;
          status?: string;
          plano?: string;
          trial_ends_at?: string;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          ls_subscription_id?: string | null;
          ls_customer_id?: string | null;
          ls_order_id?: string | null;
          status?: string;
          plano?: string;
          trial_ends_at?: string;
          current_period_end?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// ─── Tipos derivados para uso na aplicação ────────────────────

export type UserProfile        = Database["public"]["Tables"]["users"]["Row"];
export type ConfiguracoesFiscais = Database["public"]["Tables"]["configuracoes_fiscais"]["Row"];
export type Fatura             = Database["public"]["Tables"]["faturas"]["Row"];
export type CofreRegisto       = Database["public"]["Tables"]["cofre_registos"]["Row"];
export type Subscricao         = Database["public"]["Tables"]["subscricoes"]["Row"];

// ─── Agregados usados no dashboard ───────────────────────────

export interface ResumoMensal {
  mes: string;
  total_faturado: number;
  total_iva: number;
  total_irs: number;
  total_ss: number;
  total_reservar: number;
  disponivel: number;
}

export interface EstadoCofre {
  iva: { necessario: number; guardado: number; pct: number };
  irs: { necessario: number; guardado: number; pct: number };
  ss:  { necessario: number; guardado: number; pct: number };
  total: { necessario: number; guardado: number; pct: number };
}
