-- ============================================================
-- Migration: corrigir irs_a_guardar nas faturas existentes
--
-- BUG: IRS foi calculado como valorBase × 0,22
-- CORRETO: valorBase × 0,75 (coeficiente simplificado) × 0,22
--
-- A correcao multiplica o valor actual por 0,75
-- (equivale a recalcular com a formula correcta)
-- ============================================================

-- Verificar antes (opcional):
-- SELECT id, valor_base, irs_a_guardar,
--   ROUND((valor_base * 0.75 * 0.22)::numeric, 2) AS irs_correcto
-- FROM faturas
-- WHERE NOT tem_retencao;

UPDATE faturas
SET irs_a_guardar = ROUND((valor_base * 0.75 * 0.22)::numeric, 2)
WHERE NOT tem_retencao;

-- Faturas com retencao na fonte: IRS ja e 0, nao alterar
-- UPDATE faturas SET irs_a_guardar = 0 WHERE tem_retencao; -- ja estava correcto

-- Confirmar resultado:
-- SELECT COUNT(*) as total_corrigidas FROM faturas WHERE NOT tem_retencao;
