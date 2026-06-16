-- Migration 002: adicionar flag de onboarding à configuração fiscal
-- Executar no Supabase SQL Editor

ALTER TABLE configuracoes_fiscais
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE;

-- Utilizadores já existentes ficam com onboarding_completed = false
-- (serão redireccionados para o wizard na próxima visita ao dashboard)
