import Link from "next/link";
import { Timer } from "lucide-react";

interface BannerTrialProps {
  diasRestantes: number;
}

export function BannerTrial({ diasRestantes }: BannerTrialProps) {
  const urgente = diasRestantes <= 3;

  return (
    <div
      className={`rounded-xl px-5 py-3.5 flex items-center justify-between gap-4 ${
        urgente ? "bg-red-50 border border-red-100" : "bg-amber-50 border border-amber-100"
      }`}
    >
      <div className="flex items-center gap-3">
        <Timer className={`w-5 h-5 shrink-0 ${urgente ? "text-red-500" : "text-amber-500"}`} />
        <p className={`text-sm font-medium ${urgente ? "text-red-700" : "text-amber-700"}`}>
          {diasRestantes > 0 ? (
            <>
              Trial grátis: <strong>{diasRestantes} dias restantes.</strong>{" "}
              {urgente ? "A expirar em breve — activa para não perder o acesso." : "Continua a explorar o cofre fiscal."}
            </>
          ) : (
            <>Trial expirado. Activa o plano para continuar a utilizar o cofre.</>
          )}
        </p>
      </div>
      <Link
        href="/dashboard/plano"
        className={`shrink-0 text-sm font-bold px-4 py-2 rounded-lg transition-colors ${
          urgente
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-amber-500 hover:bg-amber-600 text-white"
        }`}
      >
        Activar plano →
      </Link>
    </div>
  );
}
