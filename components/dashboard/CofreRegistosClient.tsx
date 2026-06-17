"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CofreRegisto, ContaCofre } from "@/lib/supabase/types";
import { Trash2, Pencil, X, Loader2, PiggyBank, AlertCircle, Wallet } from "lucide-react";
import { CofreRegistarModal } from "@/components/dashboard/CofreRegistarModal";

interface Props {
  registos: CofreRegisto[];
  contas: ContaCofre[];
  userId: string;
  isentoIva: boolean;
}

interface FormEdit {
  tipo: string;
  valor: string;
  data: string;
  descricao: string;
}

const COR: Record<string, { bg: string; badge: string; label: string }> = {
  iva: { bg: "bg-blue-50",   badge: "bg-[#1F4E79] text-white",   label: "IVA" },
  irs: { bg: "bg-green-50",  badge: "bg-[#1E7145] text-white",   label: "IRS" },
  ss:  { bg: "bg-purple-50", badge: "bg-purple-600 text-white",  label: "SS"  },
};

function fmt(n: number) {
  return n.toLocaleString("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function CofreRegistosClient({ registos: inicial, contas, userId, isentoIva }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [registos, setRegistos] = useState<CofreRegisto[]>(inicial);
  const contasMap = Object.fromEntries(contas.map((c) => [c.id, c]));
  const [editando, setEditando] = useState<CofreRegisto | null>(null);
  const [form, setForm] = useState<FormEdit>({ tipo: "iva", valor: "", data: "", descricao: "" });
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [erroEdit, setErroEdit] = useState<string | null>(null);
  const [apagando, setApagando] = useState<string | null>(null);

  // Totais por tipo
  const totais = { iva: 0, irs: 0, ss: 0 };
  for (const r of registos) {
    if (r.tipo === "iva") totais.iva += r.valor;
    else if (r.tipo === "irs") totais.irs += r.valor;
    else if (r.tipo === "ss") totais.ss += r.valor;
  }
  const totalGeral = totais.iva + totais.irs + totais.ss;

  function abrirEditar(r: CofreRegisto) {
    setEditando(r);
    setForm({
      tipo: r.tipo,
      valor: String(r.valor),
      data: r.data,
      descricao: r.descricao ?? "",
    });
    setErroEdit(null);
  }

  async function handleEditar(e: React.FormEvent) {
    e.preventDefault();
    if (!editando) return;
    const v = parseFloat(form.valor);
    if (!v || v <= 0) { setErroEdit("Valor inválido."); return; }
    setLoadingEdit(true);
    setErroEdit(null);
    const { data, error } = await supabase
      .from("cofre_registos")
      .update({
        tipo: form.tipo,
        valor: v,
        data: form.data,
        descricao: form.descricao || null,
      })
      .eq("id", editando.id)
      .select()
      .single();
    setLoadingEdit(false);
    if (error) { setErroEdit("Erro ao guardar. Tenta novamente."); return; }
    if (data) {
      setRegistos((prev) => prev.map((r) => (r.id === editando.id ? (data as CofreRegisto) : r)));
    }
    setEditando(null);
    router.refresh();
  }

  async function handleApagar(id: string) {
    if (!confirm("Apagar este registo do cofre?")) return;
    setApagando(id);
    const { error } = await supabase
      .from("cofre_registos")
      .delete()
      .eq("id", id);
    setApagando(null);
    if (error) { alert("Erro ao apagar: " + error.message); return; }
    setRegistos((prev) => prev.filter((r) => r.id !== id));
    router.refresh();
  }

  const tiposDisponiveis = isentoIva
    ? [{ value: "irs", label: "IRS" }, { value: "ss", label: "SS" }]
    : [{ value: "iva", label: "IVA" }, { value: "irs", label: "IRS" }, { value: "ss", label: "SS" }];

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Cofre Fiscal</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {registos.length} registo{registos.length !== 1 ? "s" : ""} guardado{registos.length !== 1 ? "s" : ""}
          </p>
        </div>
        <CofreRegistarModal userId={userId} contas={contas} />
      </div>

      {/* Totais */}
      {registos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { tipo: "iva", cor: "text-[#1F4E79]", bg: "bg-blue-50",   border: "border-blue-100"   },
            { tipo: "irs", cor: "text-[#1E7145]", bg: "bg-green-50",  border: "border-green-100"  },
            { tipo: "ss",  cor: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
          ].map(({ tipo, cor, bg, border }) => (
            <div key={tipo} className={`rounded-xl border px-4 py-3 ${bg} ${border}`}>
              <p className="text-[10px] font-semibold text-gray-400 uppercase">{COR[tipo].label}</p>
              <p className={`text-xl font-extrabold mt-0.5 ${cor}`}>&#8364;{fmt(totais[tipo as keyof typeof totais])}</p>
            </div>
          ))}
          <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
            <p className="text-[10px] font-semibold text-gray-400 uppercase">Total</p>
            <p className="text-xl font-extrabold mt-0.5 text-gray-900">&#8364;{fmt(totalGeral)}</p>
          </div>
        </div>
      )}

      {/* Lista */}
      {registos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
          <PiggyBank className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="font-bold text-gray-900 mb-1">Cofre vazio</p>
          <p className="text-sm text-gray-400">
            Regista depósitos no dashboard para começar a acompanhar o que já guardaste.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
          {registos.map((r) => {
            const c = COR[r.tipo] ?? COR.iva;
            const isApagando = apagando === r.id;
            return (
              <div key={r.id} className={`flex items-center gap-3 px-5 py-3.5 ${isApagando ? "opacity-40" : ""}`}>
                {/* Badge tipo */}
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md shrink-0 ${c.badge}`}>
                  {c.label}
                </span>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">
                    &#8364;{fmt(r.valor)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(r.data + "T12:00:00").toLocaleDateString("pt-PT", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                    {r.descricao && <span className="ml-2 text-gray-300">·</span>}
                    {r.descricao && <span className="ml-2">{r.descricao}</span>}
                  </p>
                  {r.conta_id && contasMap[r.conta_id] && (
                    <p className="text-[10px] text-[#1F4E79] flex items-center gap-1 mt-0.5">
                      <Wallet className="w-2.5 h-2.5" />
                      {contasMap[r.conta_id].nome}
                      {contasMap[r.conta_id].banco && <span className="text-gray-400"> — {contasMap[r.conta_id].banco}</span>}
                    </p>
                  )}
                </div>

                {/* Acções */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => abrirEditar(r)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Pencil className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleApagar(r.id)}
                    disabled={isApagando}
                    className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                    title="Apagar"
                  >
                    {isApagando
                      ? <Loader2 className="w-3.5 h-3.5 text-red-300 animate-spin" />
                      : <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    }
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
              {/* Tipo */}
              <div className="space-y-1.5">
                <Label>Tipo</Label>
                <div className="flex gap-2">
                  {tiposDisponiveis.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, tipo: value }))}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-colors ${
                        form.tipo === value
                          ? value === "iva" ? "bg-[#1F4E79] text-white border-[#1F4E79]"
                          : value === "irs" ? "bg-[#1E7145] text-white border-[#1E7145]"
                          : "bg-purple-600 text-white border-purple-600"
                          : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Valor */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-valor">Valor (&#8364;)</Label>
                <Input
                  id="edit-valor"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={form.valor}
                  onChange={(e) => setForm((f) => ({ ...f, valor: e.target.value }))}
                  className="h-11"
                  required
                />
              </div>

              {/* Data */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-data">Data</Label>
                <Input
                  id="edit-data"
                  type="date"
                  value={form.data}
                  onChange={(e) => setForm((f) => ({ ...f, data: e.target.value }))}
                  className="h-11"
                  required
                />
              </div>

              {/* Descrição */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-desc">
                  Descrição <span className="text-gray-400 font-normal">(opcional)</span>
                </Label>
                <Input
                  id="edit-desc"
                  placeholder="Ex: transferência conta poupança"
                  value={form.descricao}
                  onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
                  className="h-11"
                />
              </div>

              {erroEdit && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {erroEdit}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <Button type="button" variant="outline" className="flex-1 h-11" onClick={() => setEditando(null)}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loadingEdit}
                  className="flex-1 h-11 bg-[#1F4E79] hover:bg-[#163a5f] font-bold"
                >
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
