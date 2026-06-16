"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { calcularFatura } from "@/lib/calculos-fiscais";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Fatura, ConfiguracoesFiscais } from "@/lib/supabase/types";
import {
  Plus,
  Trash2,
  Loader2,
  FileText,
  Euro,
  X,
  AlertCircle,
  Upload,
} from "lucide-react";
import { ImportarFaturaModal } from "@/components/dashboard/ImportarFaturaModal";

interface FaturasClientProps {
  faturas: Fatura[];
  config: ConfiguracoesFiscais | null;
  userId: string;
  autoOpenModal?: boolean;
}

interface NovaFaturaForm {
  valor_base: string;
  data_fatura: string;
  cliente: string;
  numero_fatura: string;
  tem_retencao: boolean;
}

const FORM_INICIAL: NovaFaturaForm = {
  valor_base: "",
  data_fatura: new Date().toISOString().split("T")[0],
  cliente: "",
  numero_fatura: "",
  tem_retencao: false,
};

export function FaturasClient({ faturas: inicial, config, userId, autoOpenModal }: FaturasClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();

  const [faturas, setFaturas] = useState<Fatura[]>(inicial);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalImportar, setModalImportar] = useState(false);

  useEffect(() => {
    if (autoOpenModal) setModalAberto(true);
  }, [autoOpenModal]);
  // Inicializa tem_retencao com o default das configurações do utilizador
  const [form, setForm] = useState<NovaFaturaForm>({
    ...FORM_INICIAL,
    tem_retencao: config?.tem_retencao ?? false,
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Cálculo ao vivo — usa o tem_retencao desta fatura específica
  const base = parseFloat(form.valor_base) || 0;
  const preview = base > 0
    ? calcularFatura(base, {
        regime: "simplificado",
        ivaIsento: config?.isento_iva ?? false,
        temRetencao: form.tem_retencao,          // ← por fatura, não global
        isencaoPrimeiroAnoSS: config?.primeiro_ano ?? false,
      })
    : null;

  async function handleAdicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!base || base <= 0) return;

    setLoading(true);
    setErro(null);

    const { data, error } = await supabase
      .from("faturas")
      .insert({
        user_id: userId,
        valor_base: base,
        data_fatura: form.data_fatura,
        cliente: form.cliente || null,
        numero_fatura: form.numero_fatura || null,
        tem_retencao: form.tem_retencao,
        iva_a_guardar: preview?.ivaGuardar ?? 0,
        irs_a_guardar: preview?.irsGuardar ?? 0,
        ss_a_guardar: preview?.ssGuardar ?? 0,
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      setErro("Erro ao adicionar fatura. Tenta novamente.");
      return;
    }

    if (data) {
      setFaturas((prev) => [data as Fatura, ...prev]);
    }

    setModalAberto(false);
    setForm(FORM_INICIAL);
    router.refresh();
  }

  async function handleApagar(id: string) {
    const ok = confirm("Tens a certeza que queres apagar esta fatura?");
    if (!ok) return;

    await supabase
      .from("faturas")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    setFaturas((prev) => prev.filter((f) => f.id !== id));
    router.refresh();
  }

  const totalFaturado = faturas.reduce((s, f) => s + f.valor_total, 0);
  const totalReservar = faturas.reduce(
    (s, f) => s + f.iva_a_guardar + f.irs_a_guardar + f.ss_a_guardar,
    0
  );

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Faturas</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {faturas.length} fatura{faturas.length !== 1 ? "s" : ""} registada{faturas.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setModalImportar(true)}
            className="font-semibold gap-2 h-9 text-sm border-gray-200 hover:border-gray-300"
          >
            <Upload className="w-3.5 h-3.5" />
            Importar PDF
          </Button>
          <Button
            onClick={() => setModalAberto(true)}
            className="bg-[#BF4700] hover:bg-[#a33a00] font-bold gap-2 h-9 text-sm"
          >
            <Plus className="w-4 h-4" />
            Nova fatura
          </Button>
        </div>
      </div>

      {/* Resumo topo */}
      {faturas.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 px-5 py-4">
            <p className="text-xs text-gray-400 font-medium mb-1">Total faturado</p>
            <p className="text-2xl font-extrabold text-gray-900">€{totalFaturado.toFixed(2)}</p>
          </div>
          <div className="bg-red-50 rounded-xl border border-red-100 px-5 py-4">
            <p className="text-xs text-red-400 font-medium mb-1">Total a reservar (impostos)</p>
            <p className="text-2xl font-extrabold text-red-600">€{totalReservar.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* Lista */}
      {faturas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
          <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="font-bold text-gray-900 mb-1">Sem faturas</p>
          <p className="text-gray-500 text-sm mb-5">
            Adiciona manualmente ou importa o PDF da Fatura-Recibo emitida pelo Portal das Finanças.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button
              variant="outline"
              onClick={() => setModalImportar(true)}
              className="font-semibold gap-2 border-gray-200"
            >
              <Upload className="w-4 h-4" />
              Importar PDF
            </Button>
            <Button
              onClick={() => setModalAberto(true)}
              className="bg-[#BF4700] hover:bg-[#a33a00] font-bold gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar manualmente
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {/* Cabeçalho tabela */}
          <div className="grid grid-cols-12 px-5 py-2.5 border-b border-gray-50 bg-gray-50/50">
            <p className="col-span-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Data</p>
            <p className="col-span-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Cliente</p>
            <p className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Base</p>
            <p className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Total</p>
            <p className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Reservar</p>
          </div>

          <div className="divide-y divide-gray-50">
            {faturas.map((f) => (
              <div key={f.id} className="grid grid-cols-12 px-5 py-4 hover:bg-gray-50/50 group items-center">
                <p className="col-span-3 text-sm text-gray-600">
                  {new Date(f.data_fatura).toLocaleDateString("pt-PT")}
                </p>
                <p className="col-span-3 text-sm text-gray-900 font-medium truncate pr-2">
                  {f.cliente || <span className="text-gray-400 font-normal">—</span>}
                </p>
                <p className="col-span-2 text-sm text-gray-600 text-right">
                  €{f.valor_base.toFixed(2)}
                </p>
                <p className="col-span-2 text-sm font-semibold text-gray-900 text-right">
                  €{f.valor_total.toFixed(2)}
                </p>
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <p className="text-sm font-bold text-red-500">
                    €{(f.iva_a_guardar + f.irs_a_guardar + f.ss_a_guardar).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleApagar(f.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-500 text-gray-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODAL IMPORTAR FATURA-RECIBO PDF ─────────────────────────────────── */}
      {modalImportar && (
        <ImportarFaturaModal
          onClose={() => setModalImportar(false)}
          config={config}
          userId={userId}
          onImported={(fatura) => {
            setFaturas((prev) => [fatura, ...prev]);
          }}
        />
      )}

      {/* ── MODAL NOVA FATURA ─────────────────────────────────────────────────── */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setModalAberto(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900 text-lg">Adicionar fatura</h2>
              <button
                onClick={() => setModalAberto(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleAdicionar} className="space-y-4">
              {/* Valor base */}
              <div className="space-y-1.5">
                <Label>Valor base (sem IVA) *</Label>
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={form.valor_base}
                    onChange={(e) => setForm({ ...form, valor_base: e.target.value })}
                    className="pl-9 h-11"
                    required
                  />
                </div>
              </div>

              {/* Preview cálculo ao vivo */}
              {preview && (
                <div className="bg-[#F1F5F9] rounded-xl p-4 space-y-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Impostos calculados
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: "IVA", val: preview.ivaGuardar, cor: "text-[#1F4E79]" },
                      { label: "IRS", val: preview.irsGuardar, cor: "text-[#1E7145]" },
                      { label: "SS",  val: preview.ssGuardar,  cor: "text-purple-600" },
                    ].map(({ label, val, cor }) => (
                      <div key={label} className="bg-white rounded-lg px-2 py-2.5">
                        <p className="text-[10px] text-gray-400 font-semibold uppercase">{label}</p>
                        <p className={`text-base font-extrabold ${cor}`}>€{val.toFixed(0)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between text-sm">
                    <span className="text-gray-500">Total a reservar</span>
                    <span className="font-bold text-red-500">
                      €{(preview.ivaGuardar + preview.irsGuardar + preview.ssGuardar).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Líquido real</span>
                    <span className="font-bold text-[#1E7145]">
                      €{preview.liquidoReal.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* Retenção na fonte — por fatura */}
              <div className="flex items-start justify-between gap-4 py-1">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Retenção na fonte (IRS)</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {form.tem_retencao
                      ? "Cliente retém 23% — IRS já pago, nada a guardar."
                      : "Sem retenção — o cofre reserva IRS para pagares nas Finanças."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, tem_retencao: !form.tem_retencao })}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 mt-0.5 ${
                    form.tem_retencao ? "bg-[#1F4E79]" : "bg-gray-200"
                  }`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    form.tem_retencao ? "translate-x-5" : "translate-x-0"
                  }`} />
                </button>
              </div>

              {/* Data */}
              <div className="space-y-1.5">
                <Label>Data da fatura *</Label>
                <Input
                  type="date"
                  value={form.data_fatura}
                  onChange={(e) => setForm({ ...form, data_fatura: e.target.value })}
                  className="h-11"
                  required
                />
              </div>

              {/* Cliente (opcional) */}
              <div className="space-y-1.5">
                <Label>Cliente <span className="text-gray-400 font-normal">(opcional)</span></Label>
                <Input
                  type="text"
                  placeholder="Ex: OSKONTECH LDA"
                  value={form.cliente}
                  onChange={(e) => setForm({ ...form, cliente: e.target.value })}
                  className="h-11"
                />
              </div>

              {/* Número fatura (opcional) */}
              <div className="space-y-1.5">
                <Label>Nº fatura <span className="text-gray-400 font-normal">(opcional)</span></Label>
                <Input
                  type="text"
                  placeholder="Ex: FR 2026/001"
                  value={form.numero_fatura}
                  onChange={(e) => setForm({ ...form, numero_fatura: e.target.value })}
                  className="h-11"
                />
              </div>

              {erro && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {erro}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-11"
                  onClick={() => setModalAberto(false)}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-11 bg-[#BF4700] hover:bg-[#a33a00] font-bold"
                  disabled={loading || !form.valor_base}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Adicionar fatura"

                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
