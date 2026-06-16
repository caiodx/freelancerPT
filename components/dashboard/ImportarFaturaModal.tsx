"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { calcularFatura } from "@/lib/calculos-fiscais";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Fatura, ConfiguracoesFiscais } from "@/lib/supabase/types";
import {
  X,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface ParsedFatura {
  numero: string | null;
  data_fatura: string | null;
  valor_base: number | null;
  valor_iva: number | null;
  valor_total: number | null;
  retencao_irs: number;
}

interface Props {
  onClose: () => void;
  config: ConfiguracoesFiscais | null;
  userId: string;
  onImported: (fatura: Fatura) => void;
}

type Step = "upload" | "loading" | "confirming" | "saving" | "success";

// ── Component ─────────────────────────────────────────────────────────────────

export function ImportarFaturaModal({ onClose, config, userId, onImported }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("upload");
  const [parsed, setParsed] = useState<ParsedFatura | null>(null);
  const [cliente, setCliente] = useState("");
  const [temRetencao, setTemRetencao] = useState(false); // auto-detectado do PDF
  const [erro, setErro] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  async function processar(file: File) {
    setStep("loading");
    setErro(null);

    const fd = new FormData();
    fd.append("pdf", file);

    try {
      const res = await fetch("/api/importar-fatura", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error ?? "Erro ao processar PDF");
      }

      const p = data as ParsedFatura;
      setParsed(p);
      // Auto-detectar retenção: se o PDF indica valor > 0 foi retido
      setTemRetencao((p.retencao_irs ?? 0) > 0);
      setStep("confirming");
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro desconhecido");
      setStep("upload");
    }
  }

  function handleFile(file: File | null | undefined) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setErro("Apenas ficheiros PDF são suportados.");
      return;
    }
    processar(file);
  }

  async function handleImportar() {
    if (!parsed?.valor_base || !parsed?.data_fatura) return;
    setStep("saving");

    const impostos = calcularFatura(parsed.valor_base, {
      regime: "simplificado",
      ivaIsento: config?.isento_iva ?? false,
      temRetencao,                                // ← usa o estado local (auto-detectado ou editado)
      isencaoPrimeiroAnoSS: config?.primeiro_ano ?? false,
    });

    const { data, error } = await supabase
      .from("faturas")
      .insert({
        user_id: userId,
        valor_base: parsed.valor_base,
        data_fatura: parsed.data_fatura,
        cliente: cliente.trim() || null,
        numero_fatura: parsed.numero ?? null,
        tem_retencao: temRetencao,
        iva_a_guardar: impostos.ivaGuardar,
        irs_a_guardar: impostos.irsGuardar,
        ss_a_guardar: impostos.ssGuardar,
      })
      .select()
      .single();

    if (error) {
      setErro("Erro ao guardar. Tenta novamente.");
      setStep("confirming");
      return;
    }

    onImported(data as Fatura);
    setStep("success");
    setTimeout(onClose, 1800);
    router.refresh();
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={step === "loading" || step === "saving" ? undefined : onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Importar Fatura-Recibo</h2>
            <p className="text-xs text-gray-400 mt-0.5">PDF emitido pelo Portal das Finanças (AT)</p>
          </div>
          {step !== "loading" && step !== "saving" && (
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>

        {/* ── STEP: UPLOAD ────────────────────────────────────────────── */}
        {(step === "upload" || step === "loading") && (
          <>
            <div
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
                step === "loading"
                  ? "border-gray-200 bg-gray-50 cursor-default"
                  : dragging
                  ? "border-[#1F4E79] bg-blue-50 cursor-copy"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer"
              }`}
              onClick={() => step === "upload" && fileRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                if (step === "upload") setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                if (step === "upload") handleFile(e.dataTransfer.files[0]);
              }}
            >
              {step === "loading" ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-9 h-9 text-[#1F4E79] animate-spin" />
                  <p className="text-sm font-medium text-gray-600">A extrair dados do PDF…</p>
                  <p className="text-xs text-gray-400">Isso leva apenas um segundo</p>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-7 h-7 text-gray-400" />
                  </div>
                  <p className="font-semibold text-gray-800 text-sm">
                    Arrasta o PDF aqui
                  </p>
                  <p className="text-xs text-gray-400 mt-1 mb-4">ou clica para seleccionar</p>
                  <span className="inline-block bg-gray-100 text-gray-500 text-xs font-medium px-3 py-1.5 rounded-full">
                    Fatura-Recibo · Portal das Finanças (AT)
                  </span>
                </>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />

            {erro && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2.5 mt-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{erro}</span>
              </div>
            )}
          </>
        )}

        {/* ── STEP: CONFIRMAR ─────────────────────────────────────────── */}
        {step === "confirming" && parsed && (() => {
          const impostos = calcularFatura(parsed.valor_base!, {
            regime: "simplificado",
            ivaIsento: config?.isento_iva ?? false,
            temRetencao,
            isencaoPrimeiroAnoSS: config?.primeiro_ano ?? false,
          });

          return (
            <div className="space-y-4">
              {/* Dados extraídos do PDF */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <p className="font-bold text-gray-800 text-sm">
                    {parsed.numero ?? "Fatura-Recibo"}
                  </p>
                  <span className="ml-auto text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
                    Extraído ✓
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase">Data</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">
                      {parsed.data_fatura
                        ? new Date(parsed.data_fatura + "T12:00:00").toLocaleDateString("pt-PT", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase">Base (s/ IVA)</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">
                      €{parsed.valor_base?.toLocaleString("pt-PT", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase">IVA (23%)</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">
                      €{parsed.valor_iva?.toLocaleString("pt-PT", { minimumFractionDigits: 2 }) ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase">Total pago</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">
                      €{parsed.valor_total?.toLocaleString("pt-PT", { minimumFractionDigits: 2 }) ?? "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cofre — o que guardar */}
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
                  Cofre fiscal — a guardar
                </p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: "IVA", val: impostos.ivaGuardar, cor: "text-[#1F4E79]", bg: "bg-blue-50" },
                    { label: "IRS", val: impostos.irsGuardar, cor: "text-[#1E7145]", bg: "bg-green-50" },
                    { label: "SS",  val: impostos.ssGuardar,  cor: "text-purple-600", bg: "bg-purple-50" },
                  ].map(({ label, val, cor, bg }) => (
                    <div key={label} className={`rounded-xl px-2 py-3 ${bg}`}>
                      <p className="text-[10px] text-gray-500 font-semibold uppercase">{label}</p>
                      <p className={`text-lg font-extrabold mt-0.5 ${cor}`}>
                        €{val.toFixed(0)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm mt-2 px-1">
                  <span className="text-gray-500">Líquido real</span>
                  <span className="font-bold text-[#1E7145]">
                    €{impostos.liquidoReal.toLocaleString("pt-PT", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Retenção na fonte — auto-detectada do PDF, editável */}
              <div className="flex items-start justify-between gap-4 bg-gray-50 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Retenção na fonte (IRS)</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {temRetencao
                      ? "Detectada no PDF — cliente retém 23%. IRS já pago, nada a guardar."
                      : "Não detectada — cofre reserva IRS para pagares nas Finanças."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTemRetencao((v) => !v)}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 mt-0.5 ${
                    temRetencao ? "bg-[#1F4E79]" : "bg-gray-200"
                  }`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    temRetencao ? "translate-x-5" : "translate-x-0"
                  }`} />
                </button>
              </div>

              {/* Cliente (opcional) */}
              <div className="space-y-1.5">
                <Label>
                  Cliente{" "}
                  <span className="text-gray-400 font-normal">(opcional)</span>
                </Label>
                <Input
                  placeholder="Ex: OSKONTECH LDA"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  className="h-10"
                />
              </div>

              {erro && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {erro}
                </div>
              )}

              {/* Acções */}
              <div className="flex gap-3 pt-1">
                <Button
                  variant="outline"
                  className="h-11 px-4 gap-1.5"
                  onClick={() => {
                    setParsed(null);
                    setCliente("");
                    setErro(null);
                    setStep("upload");
                  }}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Trocar
                </Button>
                <Button
                  className="flex-1 h-11 bg-[#BF4700] hover:bg-[#a33a00] font-bold gap-2"
                  onClick={handleImportar}
                >
                  Importar fatura
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })()}

        {/* ── STEP: SAVING ────────────────────────────────────────────── */}
        {step === "saving" && (
          <div className="flex flex-col items-center gap-3 py-10">
            <Loader2 className="w-9 h-9 text-[#BF4700] animate-spin" />
            <p className="text-sm font-medium text-gray-600">A guardar no cofre…</p>
          </div>
        )}

        {/* ── STEP: SUCCESS ────────────────────────────────────────────── */}
        {step === "success" && (
          <div className="flex flex-col items-center gap-4 py-10">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-900 text-lg">Fatura importada!</p>
              <p className="text-sm text-gray-500 mt-1">
                Impostos calculados e cofre actualizado.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
