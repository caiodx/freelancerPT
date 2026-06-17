"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, X, Loader2, CheckCircle2, PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";

type TipoCofre = "iva" | "irs" | "ss";

const TIPOS: { value: TipoCofre; label: string; cor: string; bg: string; desc: string }[] = [
  {
    value: "iva",
    label: "IVA",
    cor: "#1F4E79",
    bg: "bg-[#1F4E79]",
    desc: "IVA cobrado nas faturas",
  },
  {
    value: "irs",
    label: "IRS",
    cor: "#1E7145",
    bg: "bg-[#1E7145]",
    desc: "Reserva para o Modelo 3",
  },
  {
    value: "ss",
    label: "SS",
    cor: "#7C3AED",
    bg: "bg-[#7C3AED]",
    desc: "Segurança Social mensal",
  },
];

interface CofreRegistarModalProps {
  userId: string;
  /** Pré-selecionar um tipo ao abrir */
  tipoInicial?: TipoCofre;
}

export function CofreRegistarModal({ userId, tipoInicial }: CofreRegistarModalProps) {
  const router = useRouter();
  const supabase = createClient();

  const [aberto, setAberto] = useState(false);
  const [tipo, setTipo] = useState<TipoCofre>(tipoInicial ?? "iva");
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function abrir() {
    setSucesso(false);
    setErro(null);
    setValor("");
    setDescricao("");
    setData(new Date().toISOString().slice(0, 10));
    setAberto(true);
  }

  function fechar() {
    if (loading) return;
    setAberto(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = parseFloat(valor);
    if (!v || v <= 0) {
      setErro("Insere um valor válido.");
      return;
    }

    setLoading(true);
    setErro(null);

    const { error } = await supabase.from("cofre_registos").insert({
      user_id: userId,
      tipo,
      valor: v,
      descricao: descricao.trim() || null,
      data,
    });

    setLoading(false);

    if (error) {
      setErro("Erro ao guardar. Tenta novamente.");
    } else {
      setSucesso(true);
      router.refresh();
      setTimeout(() => {
        setAberto(false);
        setSucesso(false);
      }, 1500);
    }
  }

  const tipoAtual = TIPOS.find((t) => t.value === tipo)!;

  return (
    <>
      {/* Trigger */}
      <Button
        onClick={abrir}
        className="flex items-center gap-2 bg-[#1F4E79] hover:bg-[#163a5c] text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors"
      >
        <PlusCircle className="w-4 h-4" />
        Registar entrada no cofre
      </Button>

      {/* Overlay */}
      {aberto && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={fechar}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Modal */}
          <div
            className="relative z-10 w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#1F4E79]/10 rounded-xl flex items-center justify-center">
                  <PiggyBank className="w-5 h-5 text-[#1F4E79]" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Registar entrada no cofre</p>
                  <p className="text-xs text-gray-400">Guarda o valor que separaste</p>
                </div>
              </div>
              <button
                onClick={fechar}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {sucesso ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 px-6">
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
                <p className="font-bold text-gray-900">Entrada registada!</p>
                <p className="text-sm text-gray-400">O teu cofre foi atualizado.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
                {/* Tipo */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Imposto</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {TIPOS.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setTipo(t.value)}
                        className={cn(
                          "flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-sm font-bold transition-all",
                          tipo === t.value
                            ? "border-transparent text-white shadow-md"
                            : "border-gray-100 text-gray-500 bg-gray-50 hover:border-gray-200"
                        )}
                        style={
                          tipo === t.value ? { background: t.cor, borderColor: t.cor } : {}
                        }
                      >
                        <span className="text-xs font-extrabold tracking-widest uppercase">
                          {t.label}
                        </span>
                        <span
                          className={cn(
                            "text-[10px] font-normal",
                            tipo === t.value ? "text-white/70" : "text-gray-400"
                          )}
                        >
                          {t.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Valor */}
                <div className="space-y-1.5">
                  <Label htmlFor="valor" className="text-sm font-semibold text-gray-700">
                    Valor (€)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                      €
                    </span>
                    <Input
                      id="valor"
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="0,00"
                      value={valor}
                      onChange={(e) => setValor(e.target.value)}
                      className="pl-8 h-11 text-base font-bold"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                {/* Data */}
                <div className="space-y-1.5">
                  <Label htmlFor="data" className="text-sm font-semibold text-gray-700">
                    Data
                  </Label>
                  <Input
                    id="data"
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    className="h-11"
                    required
                  />
                </div>

                {/* Descrição */}
                <div className="space-y-1.5">
                  <Label htmlFor="descricao" className="text-sm font-semibold text-gray-700">
                    Nota <span className="text-gray-400 font-normal">(opcional)</span>
                  </Label>
                  <Input
                    id="descricao"
                    type="text"
                    placeholder="Ex: Transferência para conta poupança"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className="h-11"
                    maxLength={120}
                  />
                </div>

                {erro && (
                  <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2.5 text-sm text-red-700">
                    {erro}
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-11"
                    onClick={fechar}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-11 font-bold"
                    style={{ background: tipoAtual.cor }}
                    disabled={loading || !valor}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <PiggyBank className="w-4 h-4 mr-2" />
                        Guardar no cofre
                      </>
                    )}
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
