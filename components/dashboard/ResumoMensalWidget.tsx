import { TrendingUp, Euro, PiggyBank } from "lucide-react";

interface ResumoMensalWidgetProps {
  faturadoMes: number;
  totalFaturas: number;
  ivaGuardado: number;
  irsGuardado: number;
  ssGuardado: number;
  ivaNecessario: number;
  irsNecessario: number;
  ssNecessario: number;
}

export function ResumoMensalWidget({
  faturadoMes,
  totalFaturas,
  ivaGuardado,
  irsGuardado,
  ssGuardado,
  ivaNecessario,
  irsNecessario,
  ssNecessario,
}: ResumoMensalWidgetProps) {
  const totalGuardado = ivaGuardado + irsGuardado + ssGuardado;
  const totalNecessario = ivaNecessario + irsNecessario + ssNecessario;
  const falta = Math.max(0, totalNecessario - totalGuardado);
  const pctTotal = totalNecessario > 0
    ? Math.min(100, Math.round((totalGuardado / totalNecessario) * 100))
    : 0;

  const mesAtual = new Date().toLocaleDateString("pt-PT", { month: "long", year: "numeric" });

  const cards = [
    {
      label: "Faturado este mês",
      value: `€${faturadoMes.toFixed(0)}`,
      sub: `${totalFaturas} fatura${totalFaturas !== 1 ? "s" : ""}`,
      icon: Euro,
      color: "text-[#1F4E79]",
      bg: "bg-[#1F4E79]/5",
    },
    {
      label: "Total guardado (impostos)",
      value: `€${totalGuardado.toFixed(0)}`,
      sub: `de €${totalNecessario.toFixed(0)} necessário`,
      icon: PiggyBank,
      color: pctTotal >= 80 ? "text-[#1E7145]" : pctTotal >= 45 ? "text-amber-500" : "text-red-500",
      bg: pctTotal >= 80 ? "bg-green-50" : pctTotal >= 45 ? "bg-amber-50" : "bg-red-50",
    },
    {
      label: "Ainda falta guardar",
      value: falta > 0 ? `€${falta.toFixed(0)}` : "Coberto ✓",
      sub: falta > 0 ? "para cobrir todos os impostos" : "Todos os impostos cobertos",
      icon: TrendingUp,
      color: falta > 0 ? "text-red-500" : "text-[#1E7145]",
      bg: falta > 0 ? "bg-red-50" : "bg-green-50",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-gray-900">
          Resumo —{" "}
          <span className="capitalize">{mesAtual}</span>
        </h2>
        <span className="text-sm text-gray-400">{pctTotal}% coberto</span>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-xl border border-gray-100 p-5"
            >
              <div className={`w-9 h-9 ${card.bg} rounded-lg flex items-center justify-center mb-3`}>
                <Icon className={`w-4.5 h-4.5 ${card.color}`} />
              </div>
              <p className="text-xs text-gray-400 font-medium mb-1">{card.label}</p>
              <p className={`text-2xl font-extrabold tracking-tight ${card.color}`}>
                {card.value}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
