"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ContaCofre } from "@/lib/supabase/types";
import { PlusCircle, X, Loader2, CheckCircle2, PiggyBank, Wallet, Plus, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type TipoCofre = "iva" | "irs" | "ss";

const TIPOS: { value: TipoCofre; label: string; cor: string; desc: string }[] = [
  { value: "iva", label: "IVA",  cor: "#1F4E79", desc: "IVA cobrado nas faturas" },
  { value: "irs", label: "IRS",  cor: "#1E7145", desc: "Reserva para o Modelo 3" },
  { value: "ss",  label: "SS",   cor: "#7C3AED", desc: "Seguranca Social mensal" },
];

interface CofreRegistarModalProps {
  userId: string;
  tipoInicial?: TipoCofre;
  contas?: ContaCofre[];
  trigger?: React.ReactNode;
  onSucesso?: () => void;
}

export function CofreRegistarModal({
  userId,
  tipoInicial,
  contas: contasIniciais = [],
  trigger,
  onSucesso,
}: CofreRegistarModalProps) {
  const router = useRouter();
  const supabase = createClient();

  const [aberto, setAberto] = useState(false);
  const [tipo, setTipo] = useState<TipoCofre>(tipoInicial ?? "iva");
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));
  const [contaId, setContaId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [contas, setContas] = useState<ContaCofre[]>(contasIniciais);
  const [criandoConta, setCriandoConta] = useState(false);
  const [novaNome, setNovaNome] = useState("");
  const [novaBanco, setNovaBanco] = useState("");
  const [loadingConta, setLoadingConta] = useState(false);
  const [erroConta, setErroConta] = useState<string | null>(null);

  function abrir() {
    setSucesso(false); setErro(null); setValor(""); setDescricao("");
    setData(new Date().toISOString().slice(0, 10)); setContaId(null);
    setCriandoConta(false); setNovaNome(""); setNovaBanco("");
    setTipo(tipoInicial ?? "iva");
    setAberto(true);
  }

  function fechar() { if (loading) return; setAberto(false); }

  async function handleCriarConta() {
    if (!novaNome.trim()) { setErroConta("Nome obrigatorio."); return; }
    setLoadingConta(true); setErroConta(null);
    const { data: nova, error } = await supabase
      .from("contas_cofre")
      .insert({ user_id: userId, nome: novaNome.trim(), banco: novaBanco.trim() || null })
      .select().single();
    setLoadingConta(false);
    if (error) { setErroConta("Erro ao criar conta."); return; }
    if (nova) {
      const c = nova as ContaCofre;
      setContas((prev) => [...prev, c]);
      setContaId(c.id);
    }
    setCriandoConta(false); setNovaNome(""); setNovaBanco("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = parseFloat(valor);
    if (!v || v <= 0) { setErro("Insere um valor valido."); return; }
    setLoading(true); setErro(null);
    const { error } = await supabase.from("cofre_registos").insert({
      user_id: userId, tipo, movimento: "reserva", valor: v,
      descricao: descricao.trim() || null, data, conta_id: contaId,
    });
    setLoading(false);
    if (error) { setErro("Erro ao guardar. Tenta novamente."); }
    else {
      setSucesso(true); router.refresh(); onSucesso?.();
      setTimeout(() => { setAberto(false); setSucesso(false); }, 1500);
    }
  }

  const tipoAtual = TIPOS.find((t) => t.value === tipo)!;
  const contaSelecionada = contas.find((c) => c.id === contaId);

  return (
    <>
      {trigger ? (
        <div onClick={abrir} className="cursor-pointer">{trigger}</div>
      ) : (
        <Button
          onClick={abrir}
          className="flex items-center gap-2 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors bg-[#1F4E79] hover:bg-[#163a5c]"
        >
          <PlusCircle className="w-4 h-4" />
          Guardar no cofre
        </Button>
      )}

      {aberto && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={fechar}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5 border-b border-gray-100"
              style={{ borderTop: `4px solid ${tipoAtual.cor}` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#EFF4FB]">
                  <PiggyBank className="w-5 h-5 text-[#1F4E79]" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Guardar no cofre</p>
                  <p className="text-xs text-gray-400">Regista o valor que separaste para impostos</p>
                </div>
              </div>
              <button onClick={fechar} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {sucesso ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 px-6">
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
                <p className="font-bold text-gray-900">Guardado no cofre!</p>
                <p className="text-sm text-gray-400">O teu cofre foi atualizado.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

                {/* Tipo de imposto */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Imposto</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {TIPOS.map((t) => (
                      <button
                        key={t.value} type="button" onClick={() => setTipo(t.value)}
                        className={cn(
                          "flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-sm font-bold transition-all",
                          tipo === t.value
                            ? "border-transparent text-white shadow-md"
                            : "border-gray-100 text-gray-500 bg-gray-50 hover:border-gray-200"
                        )}
                        style={tipo === t.value ? { background: t.cor, borderColor: t.cor } : {}}
                      >
                        <span className="text-xs font-extrabold tracking-widest uppercase">{t.label}</span>
                        <span className={cn("text-[10px] font-normal", tipo === t.value ? "text-white/70" : "text-gray-400")}>
                          {t.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Valor */}
                <div className="space-y-1.5">
                  <Label htmlFor="valor" className="text-sm font-semibold text-gray-700">Valor (&euro;)</Label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">&euro;</span>
                    <Input
                      id="valor" type="number" min="0.01" step="0.01" placeholder="0,00"
                      value={valor} onChange={(e) => setValor(e.target.value)}
                      className="pl-8 h-11 text-base font-bold" required autoFocus
                    />
                  </div>
                </div>

                {/* Conta */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-gray-700">
                    Conta <span className="text-gray-400 font-normal">(opcional)</span>
                  </Label>
                  {!criandoConta ? (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <select
                          value={contaId ?? ""}
                          onChange={(e) => setContaId(e.target.value || null)}
                          className="w-full h-11 pl-3 pr-8 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#1F4E79]/20 focus:border-[#1F4E79]"
                        >
                          <option value="">Sem conta</option>
                          {contas.map((c) => (
                            <option key={c.id} value={c.id}>{c.nome}{c.banco ? ` — ${c.banco}` : ""}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                      <button
                        type="button"
                        onClick={() => { setCriandoConta(true); setErroConta(null); }}
                        className="shrink-0 h-11 px-3 rounded-lg border border-gray-200 text-gray-500 hover:border-[#1F4E79] hover:text-[#1F4E79] transition-colors flex items-center gap-1.5 text-sm font-medium"
                      >
                        <Plus className="w-3.5 h-3.5" /> Nova
                      </button>
                    </div>
                  ) : (
                    <div className="border border-[#1F4E79]/30 rounded-xl p-3.5 space-y-3 bg-blue-50/40">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-bold text-[#1F4E79] flex items-center gap-1.5">
                          <Wallet className="w-3.5 h-3.5" /> Nova conta
                        </p>
                        <button type="button" onClick={() => setCriandoConta(false)} className="text-gray-400 hover:text-gray-600">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <Input placeholder="Nome da conta *" value={novaNome} onChange={(e) => setNovaNome(e.target.value)} className="h-9 text-sm bg-white" autoFocus />
                      <Input placeholder="Banco (opcional)" value={novaBanco} onChange={(e) => setNovaBanco(e.target.value)} className="h-9 text-sm bg-white" />
                      {erroConta && <p className="text-xs text-red-600">{erroConta}</p>}
                      <Button type="button" onClick={handleCriarConta} disabled={loadingConta || !novaNome.trim()} className="w-full h-9 bg-[#1F4E79] hover:bg-[#163a5f] text-sm font-bold">
                        {loadingConta ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Criar e seleccionar"}
                      </Button>
                    </div>
                  )}
                  {contaSelecionada && !criandoConta && (
                    <p className="text-xs text-[#1F4E79] flex items-center gap-1">
                      <Wallet className="w-3 h-3" />
                      {contaSelecionada.nome}
                      {contaSelecionada.banco && <span className="text-gray-400"> — {contaSelecionada.banco}</span>}
                    </p>
                  )}
                </div>

                {/* Data */}
                <div className="space-y-1.5">
                  <Label htmlFor="data" className="text-sm font-semibold text-gray-700">Data</Label>
                  <Input id="data" type="date" value={data} onChange={(e) => setData(e.target.value)} className="h-11" required />
                </div>

                {/* Nota */}
                <div className="space-y-1.5">
                  <Label htmlFor="descricao" className="text-sm font-semibold text-gray-700">
                    Nota <span className="text-gray-400 font-normal">(opcional)</span>
                  </Label>
                  <Input
                    id="descricao" type="text"
                    placeholder="Ex: Transferencia para conta poupanca"
                    value={descricao} onChange={(e) => setDescricao(e.target.value)} className="h-11" maxLength={120}
                  />
                </div>

                {erro && <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2.5 text-sm text-red-700">{erro}</div>}

                <div className="flex gap-3 pt-1">
                  <Button type="button" variant="outline" className="flex-1 h-11" onClick={fechar} disabled={loading}>Cancelar</Button>
                  <Button type="submit" className="flex-1 h-11 font-bold text-white bg-[#1F4E79] hover:bg-[#163a5c]" disabled={loading || !valor}>
                    {loading
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <><PiggyBank className="w-4 h-4 mr-2" />Guardar no cofre</>
                    }
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
