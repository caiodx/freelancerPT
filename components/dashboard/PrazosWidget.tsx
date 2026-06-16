import { getPrazosFiscais2026, diasAteProximoPrazo } from "@/lib/calculos-fiscais";
import { Calendar, AlertTriangle, CheckCircle2 } from "lucide-react";

export function PrazosWidget() {
  const prazos = getPrazosFiscais2026();
  const hoje = new Date();

  const itens = [
    {
      label: "IVA Q2 2026",
      data: new Date("2026-08-20"),
      tipo: "IVA",
      cor: "#1F4E79",
    },
    {
      label: "IRS Modelo 3",
      data: new Date("2026-06-30"),
      tipo: "IRS",
      cor: "#1E7145",
    },
    {
      label: "SS — Julho",
      data: new Date("2026-07-20"),
      tipo: "SS",
      cor: "#7C3AED",
    },
    {
      label: "IVA Q3 2026",
      data: new Date("2026-11-20"),
      tipo: "IVA",
      cor: "#1F4E79",
    },
  ]
    .filter(i => i.data >= hoje)
    .sort((a, b) => a.data.getTime() - b.data.getTime())
    .slice(0, 4);

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden h-full">
      <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-400" />
        <h2 className="font-bold text-gray-900 text-sm">Próximos prazos</h2>
      </div>

      <div className="divide-y divide-gray-50">
        {itens.map((item) => {
          const dias = Math.ceil((item.data.getTime() - hoje.getTime()) / 86400000);
          const urgente = dias <= 30;
          const muitorperto = dias <= 7;

          return (
            <div key={item.label} className="px-5 py-4">
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
                  <p className="text-xs text-gray-400">
                    {item.data.toLocaleDateString("pt-PT", { day: "numeric", month: "long" })}
                  </p>
                </div>
                <div className={`shrink-0 text-right`}>
                  {muitorperto ? (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  ) : urgente ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-gray-200" />
                  )}
                  <p className={`text-xs font-bold mt-1 ${
                    muitorperto ? "text-red-500" : urgente ? "text-amber-500" : "text-gray-400"
                  }`}>
                    {dias}d
                  </p>
                </div>
              </div>

              {/* Progress bar de urgência */}
              <div className="mt-2.5 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    muitorperto ? "bg-red-500" : urgente ? "bg-amber-400" : "bg-gray-200"
                  }`}
                  style={{ width: `${Math.max(5, Math.min(100, 100 - (dias / 90) * 100))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
