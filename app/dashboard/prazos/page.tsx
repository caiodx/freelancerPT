import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getPrazosFiscais2026 } from "@/lib/calculos-fiscais";
import {
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Info,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function diasAte(data: Date): number {
  return Math.ceil((data.getTime() - Date.now()) / 86400000);
}

function formatarData(data: Date): string {
  return data.toLocaleDateString("pt-PT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function badgeUrgencia(dias: number) {
  if (dias < 0)   return { label: "Passado",  bg: "bg-gray-100",   text: "text-gray-500",  dot: "bg-gray-400"  };
  if (dias <= 7)  return { label: "Urgente",  bg: "bg-red-100",    text: "text-red-700",   dot: "bg-red-500"   };
  if (dias <= 30) return { label: "Atenção",  bg: "bg-amber-100",  text: "text-amber-700", dot: "bg-amber-500" };
  return           { label: "OK",       bg: "bg-green-100",  text: "text-green-700", dot: "bg-green-500" };
}

const TIPO_META: Record<string, { cor: string; bg: string; label: string; dica: string }> = {
  iva: {
    cor: "#1F4E79",
    bg: "bg-[#1F4E79]",
    label: "IVA",
    dica: "Entrega a declaração no Portal das Finanças (AT) e paga o valor em dívida até ao prazo.",
  },
  irs: {
    cor: "#1E7145",
    bg: "bg-[#1E7145]",
    label: "IRS",
    dica: "Submete o Modelo 3 com Anexo B no IRS Automático ou por declaração manual.",
  },
  ss: {
    cor: "#7C3AED",
    bg: "bg-[#7C3AED]",
    label: "SS",
    dica: "Paga a contribuição mensal via Segurança Social Direta. Dia 20 de cada mês.",
  },
};

// SS mensal — gerar próximos 6 meses
function gerarPrazosSS(): { label: string; data: Date; tipo: "ss"; descricao: string }[] {
  const hoje = new Date();
  const prazos = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() + i, 20);
    if (d < hoje) continue;
    const mes = d.toLocaleDateString("pt-PT", { month: "long", year: "numeric" });
    prazos.push({
      label: `SS — ${mes.charAt(0).toUpperCase() + mes.slice(1)}`,
      data: d,
      tipo: "ss" as const,
      descricao: "Contribuição mensal Segurança Social. Pagar até dia 20.",
    });
  }
  return prazos;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PrazosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: config } = await supabase
    .from("configuracoes_fiscais")
    .select("isento_iva, primeiro_ano")
    .eq("user_id", user.id)
    .single();

  const isentoIVA     = config?.isento_iva ?? false;
  const primeiroAno   = config?.primeiro_ano ?? false;

  // Montar lista de prazos
  const prazosBase = getPrazosFiscais2026();
  const prazosSS   = primeiroAno ? [] : gerarPrazosSS();
  const prazosIVA  = isentoIVA
    ? []
    : prazosBase.filter((p) => p.tipo === "iva");
  const prazosIRS  = prazosBase.filter((p) => p.tipo === "irs");

  const todos = [...prazosIVA, ...prazosIRS, ...prazosSS].sort(
    (a, b) => a.data.getTime() - b.data.getTime()
  );

  const hoje = new Date();
  const futuros  = todos.filter((p) => diasAte(p.data) >= 0);
  const passados = todos.filter((p) => diasAte(p.data) < 0).reverse();

  // Próximo prazo
  const proximo = futuros[0];

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Prazos Fiscais</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Calendário fiscal 2026 personalizado para o teu perfil.
        </p>
      </div>

      {/* Banner próximo prazo */}
      {proximo && (() => {
        const dias = diasAte(proximo.data);
        const meta = TIPO_META[proximo.tipo];
        const urgente = dias <= 30;
        return (
          <div className={`rounded-2xl p-6 ${urgente ? "bg-red-50 border border-red-100" : "bg-blue-50 border border-blue-100"}`}>
            <div className="flex items-start gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${urgente ? "bg-red-100" : "bg-blue-100"}`}>
                {urgente
                  ? <AlertTriangle className="w-5 h-5 text-red-600" />
                  : <Clock className="w-5 h-5 text-blue-600" />
                }
              </div>
              <div className="flex-1">
                <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${urgente ? "text-red-400" : "text-blue-400"}`}>
                  Próximo prazo
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-xs font-bold uppercase px-2 py-0.5 rounded text-white"
                    style={{ background: meta.cor }}
                  >
                    {meta.label}
                  </span>
                  <h2 className={`text-lg font-extrabold ${urgente ? "text-red-800" : "text-blue-900"}`}>
                    {proximo.label}
                  </h2>
                </div>
                <p className={`text-sm mt-0.5 capitalize ${urgente ? "text-red-600" : "text-blue-700"}`}>
                  {formatarData(proximo.data)} —{" "}
                  <strong>
                    {dias === 0 ? "hoje!" : dias === 1 ? "amanhã!" : `${dias} dias`}
                  </strong>
                </p>
                <p className={`text-xs mt-2 ${urgente ? "text-red-500" : "text-blue-500"}`}>
                  {meta.dica}
                </p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Avisos de isenção */}
      {(isentoIVA || primeiroAno) && (
        <div className="flex flex-col gap-2">
          {isentoIVA && (
            <div className="flex items-center gap-2.5 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <p className="text-sm text-green-700">
                <strong>Isento de IVA</strong> (Art. 53.º) — os prazos de IVA não se aplicam enquanto não ultrapassares €15.000/ano.
              </p>
            </div>
          )}
          {primeiroAno && (
            <div className="flex items-center gap-2.5 bg-purple-50 border border-purple-100 rounded-xl px-4 py-3">
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
              <p className="text-sm text-purple-700">
                <strong>Isenção SS — 1.º ano</strong> — estás isento de Segurança Social nos primeiros 12 meses de atividade.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Lista de prazos futuros */}
      <div>
        <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          Próximos prazos
        </h2>
        <div className="space-y-3">
          {futuros.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-6">Sem prazos futuros registados.</p>
          )}
          {futuros.map((prazo) => {
            const dias   = diasAte(prazo.data);
            const meta   = TIPO_META[prazo.tipo];
            const badge  = badgeUrgencia(dias);
            const largura = Math.max(3, Math.min(100, Math.round((1 - dias / 120) * 100)));

            return (
              <div
                key={`${prazo.label}-${prazo.data.toISOString()}`}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden"
              >
                {/* Barra de urgência no topo */}
                <div className="h-1 bg-gray-100">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${largura}%`,
                      background: dias <= 7 ? "#ef4444" : dias <= 30 ? "#f59e0b" : meta.cor,
                    }}
                  />
                </div>

                <div className="px-5 py-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {/* Tipo badge */}
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: `${meta.cor}18` }}
                    >
                      <span
                        className="text-[10px] font-extrabold uppercase"
                        style={{ color: meta.cor }}
                      >
                        {meta.label}
                      </span>
                    </div>

                    <div>
                      <p className="font-bold text-gray-900 text-sm">{prazo.label}</p>
                      <p className="text-xs text-gray-400 capitalize mt-0.5">
                        {formatarData(prazo.data)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{prazo.descricao}</p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${badge.bg} ${badge.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      {badge.label}
                    </span>
                    <p className="text-sm font-extrabold text-gray-700 mt-1.5">
                      {dias === 0 ? "Hoje" : dias === 1 ? "Amanhã" : `${dias} dias`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prazos passados */}
      {passados.length > 0 && (
        <div>
          <h2 className="font-bold text-gray-400 mb-3 flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            Prazos anteriores
          </h2>
          <div className="space-y-2">
            {passados.map((prazo) => {
              const meta = TIPO_META[prazo.tipo];
              return (
                <div
                  key={`${prazo.label}-${prazo.data.toISOString()}`}
                  className="bg-gray-50 rounded-xl border border-gray-100 px-5 py-3.5 flex items-center justify-between gap-4 opacity-60"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded text-white"
                      style={{ background: meta.cor }}
                    >
                      {meta.label}
                    </span>
                    <p className="text-sm font-medium text-gray-600">{prazo.label}</p>
                    <p className="text-xs text-gray-400 capitalize hidden sm:block">
                      {formatarData(prazo.data)}
                    </p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-gray-300 shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Nota informativa */}
      <div className="flex items-start gap-3 bg-gray-50 rounded-xl border border-gray-100 px-5 py-4">
        <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
        <p className="text-xs text-gray-500 leading-relaxed">
          Os prazos de SS são gerados para os próximos 6 meses. O prazo exato pode variar se o dia 20 cair num fim de semana ou feriado — nesse caso o prazo passa para o próximo dia útil.
          Prazos de IVA e IRS baseados no calendário fiscal 2026 da AT.
        </p>
      </div>

    </div>
  );
}
