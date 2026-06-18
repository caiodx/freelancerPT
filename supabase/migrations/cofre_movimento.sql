-- Migration: adicionar campo movimento a cofre_registos
-- Corre isto no Supabase SQL Editor

ALTER TABLE cofre_registos
ADD COLUMN movimento TEXT NOT NULL DEFAULT 'reserva'
CHECK (movimento IN ('reserva', 'pagamento'));

-- Todos os registos existentes ficam como 'reserva' (comportamento anterior)
