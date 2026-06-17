"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ContaCofre } from "@/lib/supabase/types";
import { Wallet, Plus, Pencil, Trash2, Loader2, X, AlertCircle, CheckCircle2 } from "lucide-react";

interface Props {
  contas: ContaCofre[];
  usos: Record<string, number>;
  userId: string;
}

interface FormConta {
  nome: string;
  banco: string;
  iban: string;
}

const FORM_VAZIO: FormConta = { nome: "", banco: "", iban: "" };

export function ContasCofreClient({ contas: inicial, usos, userId }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [contas, setContas] = useState<ContaCofre[]>(inicial);
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<ContaCofre | null>(null);
  const [form, setForm] = useState<FormConta>(FORM_VAZIO);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [apagando, setApagando] = useState<string | null>(null);

  function abrirNova() {
    setEditando(null);
    setForm(FORM_VAZIO);
    setErro(null);
    setModalAberto(true);
  }

  function abrirEditar(c: ContaCofre) {
    setEditando(c);
    setForm({ nome: c.nome, banco: c.banco ?? "", iban: c.iban ?? "" });
    setErro(null);
    setModalAberto(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome.trim()) { setErro("O nome da conta é obrigatório."); return; }
    setLoading(true);
    setErro(null);

    const payload = {
      nome: form.nome.trim(),
      banco: form.banco.trim() || null,
      iban: form.iban.trim() || null,
    };

    if (editando) {
      const { data, error } = await supabase
        .from("contas_cofre")
        .update(payload)
        .eq("id", editando.id)
        .select()
        .single();
      setLoading(false);
      if (error) { setErro("Erro ao guardar. Tenta novamente."); return; }
      if (data) setContas((prev) => prev.map((c) => (c.id === editando.id ? (data as ContaCofre) : c)));
    } else {
      const { data, error } = await supabase
        .from("contas_cofre")
        .insert({ ...payload, user_id: userId })
        .select()
        .single();
      setLoading(false);
      if (error) { setErro("Erro ao criar. Tenta novamente."); return; }
      if (data) setContas((prev) => [data as ContaCofre, ...prev]);
    }

    setModalAberto(false);
    router.refresh();
  }

  async function handleApagar(id: string) {
    const uso = usos[id] ?? 0;
    const msg = uso > 0
      ? `Esta conta tem ${uso} registo(s) associado(s). Os registos ficam sem conta mas não são apagados. Continuar?`
      : "Apagar esta conta?";
    if (!confirm(msg)) return;
    setApagando(id);
    const { error } = await supabase.from("contas_cofre").delete().eq("id", id);
    setApagando(null);
    if (error) { alert("Erro ao apagar: " + error.message); return; }
    setContas((prev) => prev.filter((c) => c.id !== id));
    router.refresh();
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Contas do Cofre</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {contas.length} conta{contas.length !== 1 ? "s" : ""} registada{contas.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          onClick={abrirNova}
          className="bg-[#1F4E79] hover:bg-[#163a5f] font-bold gap-2 h-9 text-sm"
        >
          <Plus className="w-4 h-4" />
          Nova conta
        </Button>
      </div>

      {/* Lista */}
      {contas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
          <Wallet className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="font-bold text-gray-900 mb-1">Nenhuma conta criada</p>
          <p className="text-sm text-gray-400 mb-4">
            Cria uma conta para associar os teus depósitos do cofre (ex: conta poupança, conta corrente).
          </p>
          <Button onClick={abrirNova} className="bg-[#1F4E79] hover:bg-[#163a5f] font-bold gap-2">
            <Plus className="w-4 h-4" />
            Criar primeira conta
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
          {contas.map((c) => {
            const uso = usos[c.id] ?? 0;
            const isApagando = apagando === c.id;
            return (
              <div key={c.id} className={`flex items-center gap-4 px-5 py-4 ${isApagando ? "opacity-40" : ""}`}>
                {/* Ícone */}
                <div className="w-10 h-10 bg-[#1F4E79]/10 rounded-xl flex items-center justify-center shrink-0">
                  <Wallet className="w-5 h-5 text-[#1F4E79]" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{c.nome}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {c.banco && <span>{c.banco}</span>}
                    {c.banco && c.iban && <span className="mx-1.5 text-gray-200">·</span>}
                    {c.iban && <span className="font-mono">{c.iban}</span>}
                    {!c.banco && !c.iban && <span className="italic">Sem detalhes</span>}
                  </p>
                </div>

                {/* Badge uso */}
                {uso > 0 && (
                  <span className="text-xs font-semibold text-[#1F4E79] bg-blue-50 px-2 py-0.5 rounded-full shrink-0">
                    {uso} registo{uso !== 1 ? "s" : ""}
                  </span>
                )}

                {/* Acções */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => abrirEditar(c)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Pencil className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleApagar(c.id)}
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

      {/* Modal criar / editar */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !loading && setModalAberto(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">

            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900 text-lg">
                {editando ? "Editar conta" : "Nova conta"}
              </h2>
              {!loading && (
                <button onClick={() => setModalAberto(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="nome">Nome da conta <span className="text-red-400">*</span></Label>
                <Input
                  id="nome"
                  placeholder="Ex: Conta poupan&#231;a impostos"
                  value={form.nome}
                  onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                  className="h-11"
                  autoFocus
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="banco">Banco <span className="text-gray-400 font-normal">(opcional)</span></Label>
                <Input
                  id="banco"
                  placeholder="Ex: Millennium BCP, Revolut, N26"
                  value={form.banco}
                  onChange={(e) => setForm((f) => ({ ...f, banco: e.target.value }))}
                  className="h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="iban">IBAN <span className="text-gray-400 font-normal">(opcional)</span></Label>
                <Input
                  id="iban"
                  placeholder="PT50 0000 0000 0000 0000 0000 0"
                  value={form.iban}
                  onChange={(e) => setForm((f) => ({ ...f, iban: e.target.value }))}
                  className="h-11 font-mono"
                />
              </div>

              {erro && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {erro}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <Button type="button" variant="outline" className="flex-1 h-11" onClick={() => setModalAberto(false)} disabled={loading}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading} className="flex-1 h-11 bg-[#1F4E79] hover:bg-[#163a5f] font-bold">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : editando ? "Guardar" : "Criar conta"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
