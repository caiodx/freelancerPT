-- Migration 003: retenção na fonte por fatura
-- Executar no Supabase SQL Editor

ALTER TABLE faturas
  ADD COLUMN IF NOT EXISTS tem_retencao BOOLEAN NOT NULL DEFAULT FALSE;

-- Comentário: a coluna global tem_retencao em configuracoes_fiscais
-- passa a ser apenas o default para novas faturas.
-- O cálculo de irs_a_guardar usa o valor da própria fatura.
