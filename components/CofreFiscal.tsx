"use client";

/**
 * CofreFiscal — FreelancerPT.app
 *
 * Medidor visual por imposto (IVA / IRS / SS) mostrando
 * quanto o freelancer guardou vs. o que precisa de ter guardado.
 *
 * Modos de uso:
 *   <CofreFiscal />                         → demo interativa (landing page)
 *   <CofreFiscal faturado={9000} guardado={{ iva: 1800, irs: 900, ss: 800 }} readOnly />
 *                                           → dashboard (dados reais)
 */

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatEuro, diasAteProximoPrazo, type ConfiguracaoFiscal } from "@/lib/calculos-fiscais";
import { AlertTriangle, CheckCircle, Clock, ChevronDown } from "lucide-react";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface GuardadoPorImposto {
  iva: number;
  irs: number;
  ss: number;
}

export interface CofreFiscalProps {
  /** Valor total base faturado no período (sem IVA). Quando passado, desactiva o input interno. */
  faturado?: number;
  /** Montantes já guardados por imposto. Quando passado, desactiva inputs internos. */
  guardado?: GuardadoPorImposto;
  /** Configuração fiscal do utilizador */
  config?: ConfiguracaoFiscal;
  /** Modo só-leitura (dashboard com dados reais) */
  readOnly?: boolean;
  /** Título customizável */
  titulo?: string;
}

const DEFAULT_CONFIG: ConfiguracaoFiscal = {
  regime: "simplificado",
  ivaIsento: false,
  temRetencao: false,
  isencaoPrimeiroAnoSS: false,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcularNecessario(
  faturado: number,
  config: ConfiguracaoFiscal
): GuardadoPorImposto {
  if (faturado <= 0) return { iva: 0, irs: 0, ss: 0 };
  return {
    iva: config.ivaIsento ? 0 : Math.round(faturado * 0.23 * 100) / 100,
    irs: config.temRetencao ? 0 : Math.round(faturado * 0.75 * 0.22 * 100) / 100,
    ss: config.isencaoPrimeiroAnoSS ? 0 : Math.round(faturado * 0.70 * 0.214 * 100) / 100,
  };
}

function getPct(guardado: number, necessario: number): number {
  if (necessario <= 0) return 100;
  return Math.min(100, Math.round((guardado / necessario) * 100));
}

function getStatus(pct: number, guardado: number): "vazio" | "verde" | "amarelo" | "vermelho" {
  if (guardado === 0) return "vazio";
  if (pct >= 80) return "verde";
  if (pct >= 45) return "amarelo";
  return "vermelho";
}

const STATUS_STYLES = {
  vazio: {
    fill: "transparent",
    text: "text-gray-400",
    border: "border-gray-200",
    bg: "bg-gray-50",
    badge: "bg-gray-100 text-gray-500",
    label: "A guardar",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  verde: {
    fill: "#1E7145",
    text: "text-[#1E7145]",
    border: "border-[#1E7145]/30",
    bg: "bg-[#1E7145]/10",
    badge: "bg-[#1E7145]/15 text-[#1E7145]",
    label: "Coberto",
    icon: <CheckCircle className="w-3.5 h-3.5" />,
  },
  amarelo: {
    fill: "#d97706",
    text: "text-amber-600",
    border: "border-amber-300",
    bg: "bg-amber-50",
    badge: "bg-amber-100 text-amber-700",
    label: "Atenção",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  vermelho: {
    fill: "#dc2626",
    text: "text-red-600",
    border: "border-red-200",
    bg: "bg-red-50",
    badge: "bg-red-100 text-red-700",
    label: "Urgente",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
  },
} as const;

// ─── Sub-componente: Medidor individual ───────────────────────────────────────

function MedidorCofre({
  tipo,
  label,
  guardado,
  necessario,
  diasPrazo,
  isentoOuZero,
  onGuardadoChange,
  readOnly,
}: {
  tipo: "iva" | "irs" | "ss";
  label: string;
  guardado: number;
  necessario: number;
  diasPrazo: number;
  isentoOuZero: boolean;
  onGuardadoChange?: (v: number) => void;
  readOnly?: boolean;
}) {
  const pct = getPct(guardado, necessario);
  const status = getStatus(pct, guardado);
  const s = STATUS_STYLES[status];

  if (isentoOuZero) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div
          className="relative w-24 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden"
          style={{ height: 140 }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <CheckCircle className="w-6 h-6 text-gray-300" />
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
              Isento
            </p>
          </div>
        </div>
        <div className="text-center">
          <p className="font-bold text-sm text-gray-400">{label}</p>
          <p className="text-xs text-gray-400">Não aplicável</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Badge de status */}
      <div className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${s.badge}`}>
        {s.icon}
        {s.label}
      </div>

      {/* Cofre visual */}
      <div
        className={`relative w-24 rounded-2xl border-2 overflow-hidden ${s.border}`}
        style={{ height: 140, background: "#f8f8f8" }}
        role="meter"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${pct}% guardado`}
      >
        {/* Fill — só renderiza se há algo guardado */}
        {pct > 0 && (
          <div
            className="absolute bottom-0 left-0 right-0 transition-all duration-700 ease-in-out"
            style={{
              height: `${pct}%`,
              background: s.fill,
              opacity: 0.88,
            }}
          />
        )}

        {/* Gradiente no topo do fill — só quando pct > 0 */}
        {pct > 0 && (
          <div
            className="absolute left-0 right-0 transition-all duration-700 ease-in-out pointer-events-none"
            style={{
              bottom: `${pct}%`,
              height: 14,
              background: `linear-gradient(to bottom, transparent, ${s.fill}44)`,
            }}
          />
        )}

        {/* Percentagem centrada */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <span
            className="text-2xl font-extrabold leading-none tabular-nums"
            style={{ color: pct > 50 ? "#fff" : "#1a1a1a" }}
          >
            {pct}%
          </span>
          <span
            className="text-[10px] font-semibold mt-0.5"
            style={{ color: pct > 50 ? "rgba(255,255,255,0.75)" : "#888" }}
          >
            guardado
          </span>
        </div>
      </div>

      {/* Info abaixo do cofre */}
      <div className="text-center space-y-0.5 w-full">
        <p className="font-extrabold text-sm text-gray-900">{label}</p>
        <p className={`text-xs font-semibold ${s.text}`}>
          {formatEuro(guardado)}
        </p>
        <p className="text-xs text-gray-400">
          de {formatEuro(necessario)}
        </p>

        {/* Falta */}
        {guardado < necessario && necessario > 0 && (
          <p className="text-[11px] font-bold text-red-500 mt-1">
            Falta {formatEuro(necessario - guardado)}
          </p>
        )}

        {/* Prazo */}
        {diasPrazo > 0 && (
          <div className="flex items-center justify-center gap-1 mt-1.5">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-[11px] text-gray-500">
              {diasPrazo} dias
            </span>
          </div>
        )}
      </div>

      {/* Input de "já guardei" (modo interativo) */}
      {!readOnly && onGuardadoChange && (
        <div className="w-full">
          <Label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">
            Já guardei (€)
          </Label>
          <Input
            type="number"
            min={0}
            step={10}
            value={guardado || ""}
            placeholder="0"
            onChange={(e) => onGuardadoChange(parseFloat(e.target.value) || 0)}
            className="h-8 text-sm text-center rounded-lg border-gray-200 focus-visible:ring-[#1F4E79]"
          />
        </div>
      )}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function CofreFiscal({
  faturado: faturadoProp,
  guardado: guardadoProp,
  config: configProp,
  readOnly = false,
  titulo,
}: CofreFiscalProps = {}) {
  // Estado interno (usado quando não vêm props)
  const [faturadoInput, setFaturadoInput] = useState("3000");
  const [guardadoInterno, setGuardadoInterno] = useState<GuardadoPorImposto>({
    iva: 0,
    irs: 0,
    ss: 0,
  });
  const [configOpen, setConfigOpen] = useState(false);
  const [config, setConfig] = useState<ConfiguracaoFiscal>(configProp ?? DEFAULT_CONFIG);

  // Valores efectivos
  const faturado = faturadoProp ?? (parseFloat(faturadoInput) || 0);
  const guardado = guardadoProp ?? guardadoInterno;

  // Cálculos
  const necessario = useMemo(
    () => calcularNecessario(faturado, config),
    [faturado, config]
  );

  const totalNecessario = necessario.iva + necessario.irs + necessario.ss;
  const totalGuardado = guardado.iva + guardado.irs + guardado.ss;
  const totalFalta = Math.max(0, totalNecessario - totalGuardado);
  const pctGeral = getPct(totalGuardado, totalNecessario);
  const statusGeral = getStatus(pctGeral, totalGuardado);
  const sGeral = STATUS_STYLES[statusGeral];

  // Prazos
  const diasIVA = diasAteProximoPrazo("iva");
  const diasIRS = diasAteProximoPrazo("irs");
  // SS: 10-20 do mês seguinte — estimativa simples
  const hoje = new Date();
  const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 15);
  const diasSS = Math.max(0, Math.ceil((fimMes.getTime() - hoje.getTime()) / 86400000));

  const updateGuardado = (tipo: keyof GuardadoPorImposto) => (v: number) =>
    setGuardadoInterno((prev) => ({ ...prev, [tipo]: v }));

  const toggleConfig = (key: keyof ConfiguracaoFiscal) =>
    setConfig((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="w-full max-w-xl rounded-2xl bg-white border border-gray-100 shadow-xl overflow-hidden">
      {/* Barra de cor no topo */}
      <div
        className="h-1.5 w-full transition-colors duration-500"
        style={{
          background: statusGeral === "vazio" ? "#e5e7eb" : sGeral.fill,
        }}
      />

      {/* Cabeçalho */}
      <div className="px-6 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">
              {titulo ?? "Cofre Fiscal"}
            </p>
            <h3 className="font-extrabold text-gray-900 text-lg leading-tight">
              {faturado > 0
                ? `Faturado: ${formatEuro(faturado)}`
                : "Insere o total faturado"}
            </h3>
          </div>

          {/* Saúde geral */}
          {faturado > 0 && (
            <div className={`shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-2xl ${sGeral.bg} border ${sGeral.border}`}>
              <span className={`text-2xl font-extrabold tabular-nums ${sGeral.text}`}>
                {pctGeral}%
              </span>
              <span className={`text-[10px] font-semibold ${sGeral.text}`}>
                total
              </span>
            </div>
          )}
        </div>

        {/* Input total faturado (modo demo) */}
        {!readOnly && faturadoProp === undefined && (
          <div className="mt-4">
            <Label className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-1.5 block">
              Total faturado este trimestre (base sem IVA)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">€</span>
              <Input
                type="number"
                min={0}
                step={100}
                value={faturadoInput}
                onChange={(e) => setFaturadoInput(e.target.value)}
                placeholder="0"
                className="pl-7 h-11 text-lg font-bold rounded-xl border-gray-200 focus-visible:ring-[#1F4E79]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Três cofres */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-3 gap-4">
          <MedidorCofre
            tipo="iva"
            label="IVA"
            guardado={guardado.iva}
            necessario={necessario.iva}
            diasPrazo={diasIVA}
            isentoOuZero={config.ivaIsento || necessario.iva === 0}
            onGuardadoChange={!readOnly ? updateGuardado("iva") : undefined}
            readOnly={readOnly}
          />
          <MedidorCofre
            tipo="irs"
            label="IRS"
            guardado={guardado.irs}
            necessario={necessario.irs}
            diasPrazo={diasIRS}
            isentoOuZero={config.temRetencao || necessario.irs === 0}
            onGuardadoChange={!readOnly ? updateGuardado("irs") : undefined}
            readOnly={readOnly}
          />
          <MedidorCofre
            tipo="ss"
            label="SS"
            guardado={guardado.ss}
            necessario={necessario.ss}
            diasPrazo={diasSS}
            isentoOuZero={config.isencaoPrimeiroAnoSS || necessario.ss === 0}
            onGuardadoChange={!readOnly ? updateGuardado("ss") : undefined}
            readOnly={readOnly}
          />
        </div>
      </div>

      {/* Resumo total */}
      {faturado > 0 && (
        <div className="mx-6 mb-5 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3.5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 font-medium">Total necessário</span>
            <span className="font-bold text-gray-900">{formatEuro(totalNecessario)}</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600 font-medium">Já guardado</span>
            <span className={`font-bold ${statusGeral === "verde" ? "text-[#1E7145]" : "text-gray-900"}`}>
              {formatEuro(totalGuardado)}
            </span>
          </div>

          {/* Barra de progresso geral */}
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${pctGeral}%`,
                background: sGeral.fill,
              }}
            />
          </div>
          <div className="flex justify-between mt-1.5 text-xs text-gray-400">
            <span>0%</span>
            <span
              className={`font-semibold ${sGeral.text}`}
            >
              {pctGeral}% guardado
            </span>
            <span>100%</span>
          </div>

          {/* Falta */}
          {totalFalta > 0 && (
            <div className="mt-3 flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-xs text-red-700 font-semibold">
                Falta guardar {formatEuro(totalFalta)} para estar 100% coberto
              </p>
            </div>
          )}

          {totalFalta === 0 && totalNecessario > 0 && (
            <div className="mt-3 flex items-center gap-2 bg-[#1E7145]/10 border border-[#1E7145]/20 rounded-lg px-3 py-2">
              <CheckCircle className="w-4 h-4 text-[#1E7145] shrink-0" />
              <p className="text-xs text-[#1E7145] font-semibold">
                Cofre completo — estás totalmente coberto!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Configuração fiscal (colapsável, apenas modo demo) */}
      {!readOnly && (
        <div className="border-t border-gray-100">
          <button
            type="button"
            onClick={() => setConfigOpen((v) => !v)}
            className="w-full flex items-center justify-between px-6 py-3 text-xs font-semibold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors uppercase tracking-widest"
          >
            <span>Configuração fiscal</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${configOpen ? "rotate-180" : ""}`}
            />
          </button>

          {configOpen && (
            <div className="px-6 pb-4 space-y-0 divide-y divide-gray-100">
              {[
                {
                  key: "ivaIsento" as keyof ConfiguracaoFiscal,
                  label: "Isento de IVA (Art. 53.º)",
                  desc: "Faturação ≤ €15.000/ano",
                },
                {
                  key: "temRetencao" as keyof ConfiguracaoFiscal,
                  label: "Cliente retém IRS na fonte",
                  desc: "Cliente com contabilidade organizada",
                },
                {
                  key: "isencaoPrimeiroAnoSS" as keyof ConfiguracaoFiscal,
                  label: "Isenção SS (1.º ano)",
                  desc: "Automática nos primeiros 12 meses",
                },
              ].map((item) => (
                <div key={item.key as string} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-xs font-semibold text-gray-700">{item.label}</p>
                    <p className="text-[11px] text-gray-400">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={config[item.key] as boolean}
                    onClick={() => toggleConfig(item.key)}
                    className={`relative w-9 h-5 rounded-full transition-colors duration-200 focus:outline-none ${
                      (config[item.key] as boolean) ? "bg-[#1F4E79]" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                        (config[item.key] as boolean) ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
