import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CofreFiscal } from "@/components/CofreFiscal";
import { PrazosWidget } from "@/components/dashboard/PrazosWidget";
import { ResumoMensalWidget } from "@/components/dashboard/ResumoMensalWidget";
import { BannerTrial } from "@/components/dashboard/BannerTrial";
import { Bell, Plus } from "lucide-react";
import Link from "next/link";
import type { ConfiguracoesFiscais, Fatura, CofreRegisto, Subscricao } from "@/lib/supabase/types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function saudar(email: string): string {
  const nome = email.split("@")[0].split(".")[0];
  const hora = new Date().getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";
  return `${saudacao}, ${nome.charAt(0).toUpperCase() + nome.slice(1)} 👋`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Buscar dados em paralelo
  const [
    { data: config },
    { data: faturasRaw },
    { data: cofre },
    { data: subscricao },
  ] = await Promise.all([
    supabase
      .from("configuracoes_fiscais")
      .select("*")
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("faturas")
      .select("*")
      .eq("user_id", user.id)
      .order("data_fatura", { ascending: false }),
    supabase
      .from("cofre_registos")
      .select("*")
      .eq("user_id", user.id),
    supabase
      .from("subscricoes")
      .select("*")
      .eq("user_id", user.id)
      .single(),
  ]);

  const faturas: Fatura[] = faturasRaw ?? [];
  const cofreRegistos: CofreRegisto[] = cofre ?? [];
  const cfg = config as ConfiguracoesFiscais | null;
  const sub = subscricao as Subscricao | null;

  // Calcular totais acumulados (ano corrente)
  const anoAtual = new Date().getFullYear();
  const faturasAno = faturas.filter(f => f.data_fatura.startsWith(String(anoAtual)));

  const totalIVANecessario = faturasAno.reduce((s, f) => s + f.iva_a_guardar, 0);
  const totalIRSNecessario = faturasAno.reduce((s, f) => s + f.irs_a_guardar, 0);
  const totalSSNecessario  = faturasAno.reduce((s, f) => s + f.ss_a_guardar, 0);

  const totalIVAGuardado = cofreRegistos.filter(r => r.tipo === "iva").reduce((s, r) => s + r.valor, 0);
  const totalIRSGuardado = cofreRegistos.filter(r => r.tipo === "irs").reduce((s, r) => s + r.valor, 0);
  const totalSSGuardado  = cofreRegistos.filter(r => r.tipo === "ss").reduce((s, r) => s + r.valor, 0);

  // Totais mês atual
  const mesAtual = new Date().toISOString().slice(0, 7);
  const faturasMes = faturas.filter(f => f.data_fatura.startsWith(mesAtual));
  const faturadoMes = faturasMes.reduce((s, f) => s + f.valor_base, 0);

  // Trial info
  const emTrial = sub?.status === "trial";
  const trialEndsAt = sub?.trial_ends_at ? new Date(sub.trial_ends_at) : null;
  const diasTrial = trialEndsAt
    ? Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / 86400000))
    : 0;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">

      {/* Banner trial */}
      {emTrial && (
        <BannerTrial diasRestantes={diasTrial} />
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {saudar(user.email ?? "")}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {new Date().toLocaleDateString("pt-PT", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <Link
          href="/dashboard/faturas/nova"
          className="flex items-center gap-2 bg-[#BF4700] hover:bg-[#a33a00] text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Nova fatura
        </Link>
      </div>

      {/* Grid principal */}
      <div className="grid xl:grid-cols-3 gap-6">

        {/* Cofre Fiscal — ocupa 2 colunas */}
        <div className="xl:col-span-2">
          <CofreFiscal
            readOnly
            titulo="O teu cofre fiscal"
            faturado={faturasAno.reduce((s, f) => s + f.valor_base, 0)}
            guardado={{
              iva: totalIVAGuardado,
              irs: totalIRSGuardado,
              ss:  totalSSGuardado,
            }}
            config={cfg ? {
              regime: "simplificado" as const,
              ivaIsento: cfg.isento_iva,
              temRetencao: cfg.tem_retencao,
              isencaoPrimeiroAnoSS: cfg.primeiro_ano,
            } : undefined}
          />
        </div>

        {/* Prazos — coluna direita */}
        <div>
          <PrazosWidget />
        </div>
      </div>

      {/* Resumo mensal */}
      <ResumoMensalWidget
        faturadoMes={faturadoMes}
        totalFaturas={faturasMes.length}
        ivaGuardado={totalIVAGuardado}
        irsGuardado={totalIRSGuardado}
        ssGuardado={totalSSGuardado}
        ivaNecessario={totalIVANecessario}
        irsNecessario={totalIRSNecessario}
        ssNecessario={totalSSNecessario}
      />

      {/* Últimas faturas */}
      {faturas.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900">Últimas faturas</h2>
            <Link href="/dashboard/faturas" className="text-sm text-[#1F4E79] hover:underline font-medium">
              Ver todas →
            </Link>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
            {faturas.slice(0, 5).map((f) => (
              <div key={f.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {f.cliente || "Sem cliente"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(f.data_fatura).toLocaleDateString("pt-PT")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-sm">
                    €{f.valor_total.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400">base €{f.valor_base.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {faturas.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Bell className="w-6 h-6 text-gray-400" />
          </div>
          <p className="font-bold text-gray-900 mb-1">Ainda sem faturas</p>
          <p className="text-gray-500 text-sm mb-4">
            Adiciona a tua primeira fatura para o cofre começar a calcular.
          </p>
          <Link
            href="/dashboard/faturas/nova"
            className="inline-flex items-center gap-2 bg-[#BF4700] hover:bg-[#a33a00] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar primeira fatura
          </Link>
        </div>
      )}

    </div>
  );
}
