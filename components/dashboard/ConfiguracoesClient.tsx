"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Settings,
  CreditCard,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Info,
} from "lucide-react";

interface Props {
  userId: string;
  email: string;
  nomeInicial: string;
  config: {
    primeiro_ano: boolean;
    isento_iva: boolean;
    tem_retencao: boolean;
    coeficiente: number;
    periodicidade_iva: string;
  } | null;
  subscricao: {
    status: string;
    plano: string;
    trial_ends_at: string;
    current_period_end: string | null;
  } | null;
}

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
        checked ? "bg-[#1F4E79]" : "bg-gray-200"
      } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2.5">
        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-gray-500" />
        </div>
        <h2 className="font-bold text-gray-900">{title}</h2>
      </div>
      <div className="px-6 py-5 space-y-5">{children}</div>
    </div>
  );
}

export function ConfiguracoesClient({ userId, email, nomeInicial, config, subscricao }: Props) {
  const supabase = createClient();

  // Perfil
  const [nome, setNome] = useState(nomeInicial);
  const [savingPerfil, setSavingPerfil] = useState(false);
  const [perfilOk, setPerfilOk] = useState(false);

  // Config fiscal
  const [primeiroAno, setPrimeiroAno] = useState(config?.primeiro_ano ?? false);
  const [isentoIVA, setIsentoIVA]     = useState(config?.isento_iva ?? false);
  const [temRetencao, setTemRetencao] = useState(config?.tem_retencao ?? false);
  const [coeficiente, setCoeficiente] = useState(config?.coeficiente ?? 0.75);
  const [periodicidade, setPeriodicidade] = useState(config?.periodicidade_iva ?? "trimestral");
  const [savingConfig, setSavingConfig]   = useState(false);
  const [configOk, setConfigOk]           = useState(false);
  const [erro, setErro]                   = useState<string | null>(null);

  async function salvarPerfil() {
    setSavingPerfil(true);
    setPerfilOk(false);
    await supabase
      .from("users")
      .update({ nome: nome || null })
      .eq("id", userId);
    setSavingPerfil(false);
    setPerfilOk(true);
    setTimeout(() => setPerfilOk(false), 3000);
  }

  async function salvarConfig() {
    setSavingConfig(true);
    setConfigOk(false);
    setErro(null);

    const { error } = await supabase
      .from("configuracoes_fiscais")
      .update({
        primeiro_ano: primeiroAno,
        isento_iva: isentoIVA,
        tem_retencao: temRetencao,
        coeficiente,
        periodicidade_iva: periodicidade,
      })
      .eq("user_id", userId);

    setSavingConfig(false);
    if (error) {
      setErro("Erro ao guardar. Tenta novamente.");
    } else {
      setConfigOk(true);
      setTimeout(() => setConfigOk(false), 3000);
    }
  }

  // Subscrição
  const emTrial   = subscricao?.status === "trial";
  const activa    = subscricao?.status === "active";
  const trialEnd  = subscricao?.trial_ends_at
    ? new Date(subscricao.trial_ends_at)
    : null;
  const diasTrial = trialEnd
    ? Math.max(0, Math.ceil((trialEnd.getTime() - Date.now()) / 86400000))
    : 0;

  return (
    <div className="space-y-6">

      {/* ── PERFIL ─────────────────────────────────────────────────── */}
      <SectionCard icon={User} title="Perfil">
        <div className="space-y-1.5">
          <Label>Nome</Label>
          <Input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="O teu nome"
            className="h-10"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Email</Label>
          <Input value={email} disabled className="h-10 bg-gray-50 text-gray-400" />
          <p className="text-xs text-gray-400">Email usado para entrar — não pode ser alterado aqui.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={salvarPerfil}
            disabled={savingPerfil}
            className="bg-[#1F4E79] hover:bg-[#163a5f] font-semibold h-9 px-4 text-sm"
          >
            {savingPerfil ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Guardar"}
          </Button>
          {perfilOk && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Guardado
            </span>
          )}
        </div>
      </SectionCard>

      {/* ── CONFIGURAÇÃO FISCAL ──────────────────────────────────────── */}
      <SectionCard icon={Settings} title="Configuração Fiscal">

        {/* Primeiro ano */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold text-gray-900 text-sm">Primeiro ano de actividade</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Isenção automática de Segurança Social nos primeiros 12 meses.
            </p>
          </div>
          <Toggle checked={primeiroAno} onChange={setPrimeiroAno} />
        </div>

        <div className="border-t border-gray-50" />

        {/* Isento IVA */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold text-gray-900 text-sm">Isento de IVA (Art. 53.º)</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Ativa se a tua faturação anual é inferior a €15.000. Não cobras IVA aos clientes.
            </p>
          </div>
          <Toggle checked={isentoIVA} onChange={setIsentoIVA} />
        </div>

        <div className="border-t border-gray-50" />

        {/* Retenção na fonte */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold text-gray-900 text-sm">Retenção na fonte (IRS)</p>
            <p className="text-xs text-gray-400 mt-0.5">
              O cliente retém 23% de IRS na fatura. Ativa se o teu cliente tem contabilidade organizada.
            </p>
          </div>
          <Toggle checked={temRetencao} onChange={setTemRetencao} />
        </div>

        <div className="border-t border-gray-50" />

        {/* Coeficiente */}
        <div>
          <p className="font-semibold text-gray-900 text-sm mb-2">Coeficiente do regime simplificado</p>
          <p className="text-xs text-gray-400 mb-3">
            Define qual a percentagem da tua faturação que é considerada rendimento tributável.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { val: 0.75, label: "0,75 — Serviços (padrão)", sub: "Prestação de serviços gerais" },
              { val: 0.35, label: "0,35 — Actividades específicas", sub: "Código CAE com coeficiente reduzido" },
            ].map(({ val, label, sub }) => (
              <button
                key={val}
                type="button"
                onClick={() => setCoeficiente(val)}
                className={`text-left p-3 rounded-xl border-2 transition-colors ${
                  coeficiente === val
                    ? "border-[#1F4E79] bg-[#1F4E79]/5"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <p className={`text-sm font-bold ${coeficiente === val ? "text-[#1F4E79]" : "text-gray-700"}`}>
                  {label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-50" />

        {/* Periodicidade IVA */}
        {!isentoIVA && (
          <div>
            <p className="font-semibold text-gray-900 text-sm mb-2">Periodicidade IVA</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { val: "trimestral", label: "Trimestral", sub: "Faturação ≤ €650k/ano (padrão)" },
                { val: "mensal",     label: "Mensal",     sub: "Faturação > €650k/ano" },
              ].map(({ val, label, sub }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setPeriodicidade(val)}
                  className={`text-left p-3 rounded-xl border-2 transition-colors ${
                    periodicidade === val
                      ? "border-[#1F4E79] bg-[#1F4E79]/5"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <p className={`text-sm font-bold ${periodicidade === val ? "text-[#1F4E79]" : "text-gray-700"}`}>
                    {label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Nota */}
        <div className="flex items-start gap-2 bg-blue-50 rounded-xl px-4 py-3">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-600">
            Estas configurações afectam os cálculos do cofre fiscal e da calculadora.
            Altera sempre que a tua situação mudar (ex: ultrapassares €15k de faturação).
          </p>
        </div>

        {erro && (
          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {erro}
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button
            onClick={salvarConfig}
            disabled={savingConfig}
            className="bg-[#1F4E79] hover:bg-[#163a5f] font-semibold h-9 px-4 text-sm"
          >
            {savingConfig ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Guardar configuração"}
          </Button>
          {configOk && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Guardado — cofre actualizado
            </span>
          )}
        </div>
      </SectionCard>

      {/* ── SUBSCRIÇÃO ───────────────────────────────────────────────── */}
      <SectionCard icon={CreditCard} title="Plano & Subscrição">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${
                activa
                  ? "bg-green-100 text-green-700"
                  : emTrial
                  ? "bg-amber-100 text-amber-700"
                  : "bg-gray-100 text-gray-500"
              }`}>
                {activa ? "Activo" : emTrial ? "Trial" : subscricao?.status ?? "—"}
              </span>
              {activa && (
                <span className="text-xs text-gray-400 font-medium capitalize">
                  {subscricao?.plano} — €{subscricao?.plano === "anual" ? "79" : "9"}/
                  {subscricao?.plano === "anual" ? "ano" : "mês"}
                </span>
              )}
            </div>

            {emTrial && (
              <p className="text-sm text-gray-600">
                Trial grátis — <strong>{diasTrial} dias restantes</strong>.<br />
                <span className="text-gray-400 text-xs">
                  Expira em {trialEnd?.toLocaleDateString("pt-PT", { day: "numeric", month: "long" })}
                </span>
              </p>
            )}

            {activa && subscricao?.current_period_end && (
              <p className="text-sm text-gray-500">
                Renovação em{" "}
                {new Date(subscricao.current_period_end).toLocaleDateString("pt-PT", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            )}

            {!activa && !emTrial && (
              <p className="text-sm text-red-500 font-medium">
                Subscrição inactiva — activa para continuar a usar o cofre.
              </p>
            )}
          </div>

          {!activa && (
            <a
              href="/dashboard/plano"
              className="shrink-0 flex items-center gap-1.5 bg-[#BF4700] hover:bg-[#a33a00] text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Activar plano
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Preços */}
        {!activa && (
          <div className="grid sm:grid-cols-2 gap-3 pt-1">
            {[
              {
                label: "Mensal",
                preco: "€9",
                periodo: "/mês",
                desc: "Cancela quando quiseres",
                destaque: false,
              },
              {
                label: "Anual",
                preco: "€79",
                periodo: "/ano",
                desc: "Poupa €29 vs mensal",
                destaque: true,
              },
            ].map(({ label, preco, periodo, desc, destaque }) => (
              <div
                key={label}
                className={`rounded-xl p-4 border-2 ${
                  destaque ? "border-[#BF4700] bg-orange-50" : "border-gray-100"
                }`}
              >
                {destaque && (
                  <p className="text-[10px] font-extrabold uppercase text-[#BF4700] mb-1">Melhor valor</p>
                )}
                <div className="flex items-baseline gap-0.5">
                  <span className="text-2xl font-extrabold text-gray-900">{preco}</span>
                  <span className="text-sm text-gray-400">{periodo}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{label} · {desc}</p>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

    </div>
  );
}
