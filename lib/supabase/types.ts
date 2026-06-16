// ============================================================
// FreelancerPT — Tipos TypeScript do Supabase
// Gerado manualmente — manter em sincronia com schema.sql
// ============================================================

export type PeriodicidadeIVA = "trimestral" | "mensal";
export type StatusSubscricao = "trial" | "active" | "cancelled" | "expired" | "paused";
export type PlanoSubscricao = "mensal" | "anual";
export type TipoCofre = "iva" | "irs" | "ss";

export interface UserProfile {
  id: string;
  email: string;
  nome: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConfiguracoesFiscais {
  id: string;
  user_id: string;
  primeiro_ano: boolean;
  isento_iva: boolean;
  tem_retencao: boolean;
  coeficiente: number;
  periodicidade_iva: PeriodicidadeIVA;
  meta_reserva_pct: number;
  created_at: string;
  updated_at: string;
}

export interface Fatura {
  id: string;
  user_id: string;
  valor_base: number;
  valor_iva: number;       // gerado automaticamente
  valor_total: number;     // gerado automaticamente
  iva_a_guardar: number;
  irs_a_guardar: number;
  ss_a_guardar: number;
  data_fatura: string;     // ISO date string
  cliente: string | null;
  descricao: string | null;
  numero_fatura: string | null;
  paga: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CofreRegisto {
  id: string;
  user_id: string;
  tipo: TipoCofre;
  valor: number;
  descricao: string | null;
  data: string;
  created_at: string;
}

export interface Subscricao {
  id: string;
  user_id: string;
  ls_subscription_id: string | null;
  ls_customer_id: string | null;
  ls_order_id: string | null;
  status: StatusSubscricao;
  plano: PlanoSubscricao;
  trial_ends_at: string;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Agregados usados no dashboard ───────────────────────────

export interface ResumoMensal {
  mes: string;            // "2026-06"
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

// ─── Database schema completo (para Supabase client) ─────────

export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserProfile;
        Insert: Omit<UserProfile, "created_at" | "updated_at">;
        Update: Partial<Omit<UserProfile, "id" | "created_at">>;
      };
      configuracoes_fiscais: {
        Row: ConfiguracoesFiscais;
        Insert: Pick<ConfiguracoesFiscais, "user_id"> & Partial<Omit<ConfiguracoesFiscais, "id" | "user_id" | "created_at" | "updated_at">>;
        Update: Partial<Omit<ConfiguracoesFiscais, "id" | "user_id" | "created_at">>;
      };
      faturas: {
        Row: Fatura;
        Insert: Pick<Fatura, "user_id" | "valor_base"> & Partial<Omit<Fatura, "id" | "user_id" | "valor_base" | "valor_iva" | "valor_total" | "created_at" | "updated_at">>;
        Update: Partial<Omit<Fatura, "id" | "user_id" | "valor_iva" | "valor_total" | "created_at">>;
      };
      cofre_registos: {
        Row: CofreRegisto;
        Insert: Pick<CofreRegisto, "user_id" | "tipo" | "valor"> & Partial<Omit<CofreRegisto, "id" | "user_id" | "tipo" | "valor" | "created_at">>;
        Update: Partial<Omit<CofreRegisto, "id" | "user_id" | "created_at">>;
      };
      subscricoes: {
        Row: Subscricao;
        Insert: Pick<Subscricao, "user_id"> & Partial<Omit<Subscricao, "id" | "user_id" | "created_at" | "updated_at">>;
        Update: Partial<Omit<Subscricao, "id" | "user_id" | "created_at">>;
      };
    };
  };
}
