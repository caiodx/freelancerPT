"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CofreRegisto, ContaCofre } from "@/lib/supabase/types";
import { Trash2, Pencil, X, Loader2, PiggyBank, AlertCircle, Wallet, ArrowDownCircle, ArrowUpCircle, CheckCircle2 } from "lucide-react";
import { CofreRegistarModal } from "@/components/dashboard/CofreRegistarModal";

interface Props {
  registos: CofreRegisto[];
  contas: ContaCofre[];
  userId: string;
  isentoIva: boolean;
}

interface FormEdit {
  tipo: string;
  movimento: "reserva" | "pagamento";
  valor: string;
  data: string;
  descricao: string;
}

const COR: Record<string, { bg: string; badge: string; label: string; saldoCor: string }> = {
  iva: { bg: "bg-blue-50",   badge: "bg-[#1F4E79] text-white",   label: "IVA", saldoCor: "text-[#1F4E79]" },
  irs: { bg: "bg-green-50",  badge: "bg-[#1E7145] text-white",   label: "IRS", saldoCor: "text-[#1E7145]" },
  ss:  { bg: "bg-purple-50", badge: "bg-purple-600 text-white",  label: "SS",  saldoCor: "text-purple-600" },
};

function fmt(n: number) {
  return n.toLocaleString("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

type TipoKey = "iva" | "irs" | "ss";

export function CofreRegistosClient({ registos: inicial, contas, userId, isentoIva }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [registos, setRegistos] = useState<CofreRegisto[]>(inicial);
  const contasMap = Object.fromEntries(contas.map((c) => [c.id, c]));
  const [editando, setEditando] = useState<CofreRegisto | null>(null);
  const [form, setForm] = useState<FormEdit>({ tipo: "iva", movimento: "reserva", valor: "", data: "", descricao: "" });
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [erroEdit, setErroEdit] = useState<string | null>(null);
  const [apagando, setApagando] = useState<string | null>(null);

  const calcSaldos = (regs: CofreRegisto[]) => {
    const s = { iva: 0, irs: 0, ss: 0 };
    for (const r of regs) {
      const tipo = r.tipo as TipoKey;
      if (!(tipo in s)) continue;
      if (r.movimento === "pagamento") s[tipo] -= r.valor;
      else s[tipo] += r.valor;
    }
    return s;
  };

  const saldos = calcSaldos(registos);
  const totalGeral = saldos.iva + saldos.irs + saldos.ss;
  const tiposDisponiveis: TipoKey[] = isentoIva ? ["irs", "ss"] : ["iva", "irs", "ss"];

  function abrirEditar(r: CofreRegisto) {
    setEditando(r);
    setForm({ tipo: r.tipo, movimento: r.movimento, valor: String(r.valor), data: r.data, descricao: r.descricao ?? "" });
    setErroEdit(null);
  }

  async function handleEditar(e: React.FormEvent) {
    e.preventDefault();
    if (!editando) return;
    const v = parseFloat(form.valor);
    if (!v || v <= 0) { setErroEdit("Valor invalido."); return; }
    setLoadingEdit(true); setErroEdit(null);
    const { data, error } = await supabase
      .from("cofre_registos")
      .update({ tipo: form.tipo, movimento: form.movimento, valor: v, data: form.data, descricao: form.descricao || null })
      .eq("id", editando.id).select().single();
    setLoadingEdit(false);
    if (error) { setErroEdit("Erro ao guardar. Tenta novamente."); return; }
    if (data) setRegistos((prev) => prev.map((r) => (r.id === editando.id ? (data as CofreRegisto) : r)));
    setEditando(null);
    router.refresh();
  }

  async function handleApagar(id: string) {
    if (!confirm("Apagar este registo do cofre?")) return;
    setApagando(id);
    const { error } = await supabase.from("cofre_registos").delete().eq("id", id);
    setApagando(null);
    if (error) { alert("Erro ao apagar: " + error.message); return; }
    setRegistos((prev) => prev.filter((r) => r.id !== id));
    router.refresh();
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Cofre Fiscal</h1>
          <p className="text-sm text-gray-500 mt-0.5">{registos.length} registo{registos.length !== 1 ? "s" : ""} · saldo activo</p>
        </div>
        <CofreRegistarModal userId={userId} contas={contas} />
      </div>

      {/* Cards de saldo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {tiposDisponiveis.map((tipo) => {
          const saldo = saldos[tipo];
          const limpo = saldo <= 0;
          const cfg = COR[tipo];
          return (
            <div key={tipo} className={`rounded-xl border px-4 py-3 ${limpo ? "bg-green-50 border-green-200" : cfg.bg}`}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-semibold text-gray-400 uppercase">{cfg.label}</p>
                {limpo && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
              </div>
              <p className={`text-xl font-extrabold mt-0.5 ${limpo ? "text-green-600" : cfg.saldoCor}`}>
                &euro;{fmt(Math.max(0, saldo))}
              </p>
              {limpo ? (
                <p className="text-[10px] text-green-500 mt-0.5">Limpo ✓</p>
              ) : (
                <div className="mt-2">
                  <CofreRegistarModal
                    userId={userId} tipoInicial={tipo} movimentoInicial="pagamento" contas={contas}
                    trigger={
                      <span className="text-[10px] font-semibold text-[#BF4700] hover:underline cursor-pointer flex items-center gap-1">
                        <ArrowUpCircle className="w-3 h-3" /> Registar pagamento
                      </span>
                    }
                  />
                </div>
              )}
            </div>
          );
        })}
        <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
          <p className="text-[10px] font-semibold text-gray-400 uppercase">Total a guardar</p>
          <p className={`text-xl font-extrabold mt-0.5 ${totalGeral <= 0 ? "text-green-600" : "text-gray-900"}`}>
            &euro;{fmt(Math.max(0, totalGeral))}
          </p>
        </div>
      </div>

      {/* Lista */}
      {registos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
          <PiggyBank className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="font-bold text-gray-900 mb-1">Cofre vazio</p>
          <p className="text-sm text-gray-400">Regista reservas no dashboard para comecar a acompanhar o que ja guardaste.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
          {registos.map((r) => {
            const c = COR[r.tipo] ?? COR.iva;
            const isPagamento = r.movimento === "pagamento";
            const isApagando = apagando === r.id;
            return (
              <div key={r.id} className={`flex items-center gap-3 px-5 py-3.5 ${isApagando ? "opacity-40" : ""} ${isPagamento ? "bg-orange-50/40" : ""}`}>
                <div className="shrink-0">
                  {isPagamento
                    ? <ArrowUpCircle className="w-4 h-4 text-[#BF4700]" />
                    : <ArrowDownCircle className="w-4 h-4 text-[#1F4E79]" />
                  }
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md shrink-0 ${c.badge}`}>{c.label}</span>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${isPagamento ? "text-[#BF4700]" : "text-gray-900"}`}>
                    {isPagamento ? "−" : "+"}&euro;{fmt(r.valor)}
                    {isPagamento && (
                      <span className="ml-2 text-[10px] font-bold text-[#BF4700] bg-orange-100 px-1.5 py-0.5 rounded-md">PAGO</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(r.data + "T12:00:00").toLocaleDateString("pt-PT", { day: "numeric", month: "short", year: "numeric" })}
                    {r.descricao && <><span className="ml-2 text-gray-300">·</span><span className="ml-2">{r.descricao}</span></>}
                  </p>
                  {r.conta_id && contasMap[r.conta_id] && (
                    <p className="text-[10px] text-[#1F4E79] flex items-center gap-1 mt-0.5">
                      <Wallet className="w-2.5 h-2.5" />
                      {contasMap[r.conta_id].nome}
                      {contasMap[r.conta_id].banco && <span className="text-gray-400"> — {contasMap[r.conta_id].banco}</span>}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => abrirEditar(r)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Editar">
                    <Pencil className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                  <button onClick={() => handleApagar(r.id)} disabled={isApagando} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Apagar">
                    {isApagando ? <Loader2 className="w-3.5 h-3.5 text-red-300 animate-spin" /> : <Trash2 className="w-3.5 h-3.5 text-red-400" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal editar */}
      {editando && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditando(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900 text-lg">Editar registo</h2>
              <button onClick={() => setEditando(null)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleEditar} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Tipo de registo</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["reserva", "pagamento"] as const).map((m) => (
                    <button key={m} type="button" onClick={() => setForm((f) => ({ ...f, movimento: m }))}
                      className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold border-2 transition-colors ${
                        form.movimento === m
                          ? m === "reserva" ? "bg-[#1F4E79] text-white border-[#1F4E79]" : "bg-[#BF4700] text-white border-[#BF4700]"
                          : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {m === "reserva" ? <ArrowDownCircle className="w-3.5 h-3.5" /> : <ArrowUpCircle className="w-3.5 h-3.5" />}
                      {m === "reserva" ? "Reserva" : "Pagamento"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Imposto</Label>
                <div className="flex gap-2">
                  {tiposDisponiveis.map((value) => (
                    <button key={value} type="button" onClick={() => setForm((f) => ({ ...f, tipo: value }))}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-colors ${
                        form.tipo === value
                          ? value === "iva" ? "bg-[#1F4E79] text-white border-[#1F4E79]"
                          : value === "irs" ? "bg-[#1E7145] text-white border-[#1E7145]"
                          : "bg-purple-600 text-white border-purple-600"
                          : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {COR[value].label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-valor">Valor (&euro;)</Label>
                <Input id="edit-valor" type="number" step="0.01" min="0.01" placeholder="0.00"
                  value={form.valor} onChange={(e) => setForm((f) => ({ ...f, valor: e.target.value }))} className="h-11" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-data">Data</Label>
                <Input id="edit-data" type="date" value={form.data} onChange={(e) => setForm((f) => ({ ...f, data: e.target.value }))} className="h-11" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-desc">Descricao <span className="text-gray-400 font-normal">(opcional)</span></Label>
                <Input id="edit-desc" placeholder="Ex: transferencia conta poupanca"
                  value={form.descricao} onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))} className="h-11" />
              </div>
              {erroEdit && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />{erroEdit}
                </div>
              )}
              <div className="flex gap-3 pt-1">
                <Button type="button" variant="outline" className="flex-1 h-11" onClick={() => setEditando(null)}>Cancelar</Button>
                <Button type="submit" disabled={loadingEdit} className="flex-1 h-11 bg-[#1F4E79] hover:bg-[#163a5f] font-bold">
                  {loadingEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
