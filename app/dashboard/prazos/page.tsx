import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getPrazosFiscais2026 } from "@/lib/calculos-fiscais";
import { PrazosClient, type PrazoSerial } from "@/components/dashboard/PrazosClient";
import type { CofreRegisto } from "@/lib/supabase/types";

// SS mensal -- gerar proximos 6 meses
function gerarPrazosSS(): { label: string; data: Date; tipo: "ss"; descricao: string }[] {
  const hoje = new Date();
  const prazos = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() + i, 20);
    if (d < hoje) continue;
    const mes = d.toLocaleDateString("pt-PT", { month: "long", year: "numeric" });
    prazos.push({
      label: `SS -- ${mes.charAt(0).toUpperCase() + mes.slice(1)}`,
      data: d,
      tipo: "ss" as const,
      descricao: "Contribuicao mensal Seguranca Social. Pagar ate dia 20.",
    });
  }
  return prazos;
}

function calcularSaldos(registos: CofreRegisto[]): { iva: number; irs: number; ss: number } {
  const s = { iva: 0, irs: 0, ss: 0 };
  for (const r of registos) {
    const tipo = r.tipo as "iva" | "irs" | "ss";
    if (!(tipo in s)) continue;
    if (r.movimento === "pagamento") s[tipo] -= r.valor;
    else s[tipo] += r.valor;
  }
  return s;
}

export default async function PrazosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: config }, { data: registos }] = await Promise.all([
    supabase
      .from("configuracoes_fiscais")
      .select("isento_iva, primeiro_ano")
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("cofre_registos")
      .select("*")
      .eq("user_id", user.id),
  ]);

  const isentoIVA   = config?.isento_iva ?? false;
  const primeiroAno = config?.primeiro_ano ?? false;
  const saldos      = calcularSaldos((registos ?? []) as CofreRegisto[]);

  // Montar lista de prazos
  const prazosBase = getPrazosFiscais2026();
  const prazosSS   = primeiroAno ? [] : gerarPrazosSS();
  const prazosIVA  = isentoIVA ? [] : prazosBase.filter((p) => p.tipo === "iva");
  const prazosIRS  = prazosBase.filter((p) => p.tipo === "irs");

  const todos = [...prazosIVA, ...prazosIRS, ...prazosSS].sort(
    (a, b) => a.data.getTime() - b.data.getTime()
  );

  // Serializar datas para o client component
  const todosSerial: PrazoSerial[] = todos.map((p) => ({
    label: p.label,
    data: p.data.toISOString().slice(0, 10),
    tipo: p.tipo,
    descricao: p.descricao,
  }));

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <PrazosClient
        todos={todosSerial}
        saldos={saldos}
        userId={user.id}
        isentoIVA={isentoIVA}
        primeiroAno={primeiroAno}
      />
    </div>
  );
}
