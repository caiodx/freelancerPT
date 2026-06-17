import Link from "next/link";
import { getPrazosFiscais2026 } from "@/lib/calculos-fiscais";
import { Calendar, AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";

interface PrazosWidgetProps {
  isentoIva?: boolean;
  primeiroAno?: boolean;
}

function gerarPrazosSS(primeiroAno: boolean) {
  if (primeiroAno) return [];
  const hoje = new Date();
  const prazos = [];
  for (let i = 0; i < 4; i++) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() + i, 20);
    if (d < hoje) continue;
    const mes = d.toLocaleDateString("pt-PT", { month: "long", year: "numeric" });
    prazos.push({
      label: `SS — ${mes.charAt(0).toUpperCase() + mes.slice(1)}`,
      data: d,
      tipo: "SS" as const,
      cor: "#7C3AED",
    });
  }
  return prazos;
}

export function PrazosWidget({ isentoIva = false, primeiroAno = false }: PrazosWidgetProps) {
  const hoje = new Date();

  const prazosBase = getPrazosFiscais2026();

  const prazosIVA = isentoIva
    ? []
    : prazosBase
        .filter((p) => p.tipo === "iva")
        .map((p) => ({ label: p.label, data: p.data, tipo: "IVA" as const, cor: "#1F4E79" }));

  const prazosIRS = prazosBase
    .filter((p) => p.tipo === "irs")
    .map((p) => ({ label: p.label, data: p.data, tipo: "IRS" as const, cor: "#1E7145" }));

  const prazosSS = gerarPrazosSS(primeiroAno);

  const itens = [...prazosIVA, ...prazosIRS, ...prazosSS]
    .filter((p) => p.data >= hoje)
    .sort((a, b) => a.data.getTime() - b.data.getTime())
    .slice(0, 4);

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden h-full flex flex-col">
      <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <h2 className="font-bold text-gray-900 text-sm">Próximos prazos</h2>
        </div>
        <Link
          href="/dashboard/prazos"
          className="text-xs text-[#1F4E79] hover:underline font-medium flex items-center gap-0.5"
        >
          Ver todos
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-gray-50 flex-1">
        {itens.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <CheckCircle2 className="w-8 h-8 text-green-300 mb-2" />
            <p className="text-sm font-semibold text-gray-500">Sem prazos imediatos</p>
            <p className="text-xs text-gray-400 mt-0.5">Estás em dia!</p>
          </div>
        )}
        {itens.map((item) => {
          const dias = Math.ceil((item.data.getTime() - hoje.getTime()) / 86400000);
          const urgente = dias <= 30;
          const muitoPerto = dias <= 7;

          return (
            <div key={`${item.tipo}-${item.data.toISOString()}`} className="px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded text-white"
                      style={{ background: item.cor }}
                    >
                      {item.tipo}
                    </span>
                    <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  {muitoPerto ? (
                    <AlertTriangle className="w-4 h-4 text-red-500 ml-auto" />
                  ) : urgente ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500 ml-auto" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-gray-200 ml-auto" />
                  )}
                  <p className={`text-xs font-bold mt-1 ${
                    muitoPerto ? "text-red-500" : urgente ? "text-amber-500" : "text-gray-400"
                  }`}>
                    {dias === 0 ? "Hoje" : dias === 1 ? "Amanhã" : `${dias}d`}
                  </p>
                </div>
              </div>

              {/* Barra de urgência */}
              <div className="mt-2.5 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    muitoPerto ? "bg-red-500" : urgente ? "bg-amber-400" : "bg-gray-200"
                  }`}
                  style={{ width: `${Math.max(5, Math.min(100, 100 - (dias / 120) * 100))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
