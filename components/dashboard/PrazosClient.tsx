"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar, AlertTriangle, CheckCircle2, Clock, Info,
  X, Loader2, AlertCircle, PiggyBank, CheckCheck, ChevronDown, ChevronUp,
} from "lucide-react";

export interface PrazoSerial {
  label: string;
  data: string;
  tipo: "iva" | "irs" | "ss";
  descricao: string;
}

interface Props {
  todos: PrazoSerial[];
  saldos: { iva: number; irs: number; ss: number };
  userId: string;
  isentoIVA: boolean;
  primeiroAno: boolean;
}

function diasAte(data: string): number {
  return Math.ceil((new Date(data + "T12:00:00").getTime() - Date.now()) / 86400000);
}

function formatarData(data: string): string {
  return new Date(data + "T12:00:00").toLocaleDateString("pt-PT", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function badgeUrgencia(dias: number) {
  if (dias < 0)   return { label: "Passado",  bg: "bg-gray-100",   text: "text-gray-500",  dot: "bg-gray-400"  };
  if (dias <= 7)  return { label: "Urgente",  bg: "bg-red-100",    text: "text-red-700",   dot: "bg-red-500"   };
  if (dias <= 30) return { label: "Atencao",  bg: "bg-amber-100",  text: "text-amber-700", dot: "bg-amber-500" };
  return           { label: "OK",       bg: "bg-green-100",  text: "text-green-700", dot: "bg-green-500" };
}

const TIPO_META: Record<string, { cor: string; label: string; dica: string }> = {
  iva: { cor: "#1F4E79", label: "IVA", dica: "Entrega a declaracao no Portal das Financas (AT) e paga o valor em divida ate ao prazo." },
  irs: { cor: "#1E7145", label: "IRS", dica: "Submete o Modelo 3 com Anexo B no IRS Automatico ou por declaracao manual. Podes pagar em ate 36 prestacoes." },
  ss:  { cor: "#7C3AED", label: "SS",  dica: "Paga a contribuicao mensal via Seguranca Social Direta. Dia 20 de cada mes." },
};

function fmt(n: number) {
  return n.toLocaleString("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function PrazosClient({ todos, saldos, userId, isentoIVA, primeiroAno }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const futuros  = todos.filter((p) => diasAte(p.data) >= 0);
  const passados = todos.filter((p) => diasAte(p.data) < 0).reverse();
  const proximo  = futuros[0];

  // Separar SS dos restantes para colapsar
  const futurosSS    = futuros.filter((p) => p.tipo === "ss");
  const futurosSemSS = futuros.filter((p) => p.tipo !== "ss");
  const proximoSS    = futurosSS[0];
  const [ssExpandido, setSsExpandido] = useState(false);

  // Estado modal
  const [modalPrazo, setModalPrazo]   = useState<PrazoSerial | null>(null);
  const [valorPagar, setValorPagar]   = useState("");
  const [nota, setNota]               = useState("");
  const [loading, setLoading]         = useState(false);
  const [erro, setErro]               = useState<string | null>(null);
  const [sucesso, setSucesso]         = useState(false);

  function abrirModal(prazo: PrazoSerial) {
    const saldo = saldos[prazo.tipo] ?? 0;
    setModalPrazo(prazo);
    setValorPagar(saldo > 0 ? saldo.toFixed(2) : "");
    setNota(prazo.label);
    setErro(null);
    setSucesso(false);
  }

  function fecharModal() {
    if (loading) return;
    setModalPrazo(null);
  }

  async function handlePagar(e: React.FormEvent) {
    e.preventDefault();
    if (!modalPrazo) return;
    const v = parseFloat(valorPagar);
    if (!v || v <= 0) { setErro("Insere um valor valido."); return; }
    setLoading(true); setErro(null);
    const hoje = new Date().toISOString().slice(0, 10);
    const { error } = await supabase.from("cofre_registos").insert({
      user_id: userId,
      tipo: modalPrazo.tipo,
      movimento: "pagamento",
      valor: v,
      descricao: nota.trim() || modalPrazo.label,
      data: hoje,
    });
    setLoading(false);
    if (error) { setErro("Erro ao registar. Tenta novamente."); return; }
    setSucesso(true);
    router.refresh();
    setTimeout(() => { setModalPrazo(null); setSucesso(false); }, 1800);
  }

  const saldoModal = modalPrazo ? (saldos[modalPrazo.tipo] ?? 0) : 0;
  const metaModal  = modalPrazo ? TIPO_META[modalPrazo.tipo] : null;

  // Card de prazo futuro (reutilizavel)
  function CardPrazo({ prazo }: { prazo: PrazoSerial }) {
    const dias    = diasAte(prazo.data);
    const meta    = TIPO_META[prazo.tipo];
    const badge   = badgeUrgencia(dias);
    const largura = Math.max(3, Math.min(100, Math.round((1 - dias / 120) * 100)));
    const saldo   = saldos[prazo.tipo] ?? 0;
    return (
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="h-1 bg-gray-100">
          <div
            className="h-full transition-all"
            style={{ width: `${largura}%`, background: dias <= 7 ? "#ef4444" : dias <= 30 ? "#f59e0b" : meta.cor }}
          />
        </div>
        <div className="px-5 py-4 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${meta.cor}18` }}>
              <span className="text-[10px] font-extrabold uppercase" style={{ color: meta.cor }}>{meta.label}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm">{prazo.label}</p>
              <p className="text-xs text-gray-400 capitalize mt-0.5">{formatarData(prazo.data)}</p>
              <p className="text-xs text-gray-400 mt-1">{prazo.descricao}</p>
              <div className="mt-2.5 flex items-center gap-2">
                {saldo > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-lg bg-green-50 text-green-700 border border-green-100">
                    <PiggyBank className="w-3 h-3" />
                    &euro;{fmt(saldo)} no cofre
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-lg bg-gray-50 text-gray-400 border border-gray-100">
                    <PiggyBank className="w-3 h-3" />
                    Cofre {meta.label} vazio
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="shrink-0 text-right flex flex-col items-end gap-2">
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${badge.bg} ${badge.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
              {badge.label}
            </span>
            <p className="text-sm font-extrabold text-gray-700">
              {dias === 0 ? "Hoje" : dias === 1 ? "Amanha" : `${dias} dias`}
            </p>
            <button
              onClick={() => abrirModal(prazo)}
              className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg text-white transition-colors hover:opacity-90 active:scale-95"
              style={{ background: meta.cor }}
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Paguei
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Cabecalho */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Prazos Fiscais</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Calendario fiscal 2026 personalizado para o teu perfil.
        </p>
      </div>

      {/* Proximo prazo destaque */}
      {proximo && (() => {
        const dias  = diasAte(proximo.data);
        const meta  = TIPO_META[proximo.tipo];
        const urgente = dias <= 30;
        return (
          <div className={`rounded-2xl p-6 mb-8 ${urgente ? "bg-red-50 border border-red-100" : "bg-blue-50 border border-blue-100"}`}>
            <div className="flex items-start gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${urgente ? "bg-red-100" : "bg-blue-100"}`}>
                {urgente
                  ? <AlertTriangle className="w-5 h-5 text-red-600" />
                  : <Clock className="w-5 h-5 text-blue-600" />
                }
              </div>
              <div className="flex-1">
                <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${urgente ? "text-red-400" : "text-blue-400"}`}>
                  Proximo prazo
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase px-2 py-0.5 rounded text-white" style={{ background: meta.cor }}>
                    {meta.label}
                  </span>
                  <h2 className={`text-lg font-extrabold ${urgente ? "text-red-800" : "text-blue-900"}`}>
                    {proximo.label}
                  </h2>
                </div>
                <p className={`text-sm mt-0.5 capitalize ${urgente ? "text-red-600" : "text-blue-700"}`}>
                  {formatarData(proximo.data)} &mdash; <strong>{dias === 0 ? "hoje!" : dias === 1 ? "amanha!" : `${dias} dias`}</strong>
                </p>
                <p className={`text-xs mt-2 ${urgente ? "text-red-500" : "text-blue-500"}`}>{meta.dica}</p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Banners isencao */}
      {(isentoIVA || primeiroAno) && (
        <div className="flex flex-col gap-2 mb-8">
          {isentoIVA && (
            <div className="flex items-center gap-2.5 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <p className="text-sm text-green-700">
                <strong>Isento de IVA</strong> (Art. 53.) &mdash; os prazos de IVA nao se aplicam enquanto nao ultrapassares 15.000/ano.
              </p>
            </div>
          )}
          {primeiroAno && (
            <div className="flex items-center gap-2.5 bg-purple-50 border border-purple-100 rounded-xl px-4 py-3">
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
              <p className="text-sm text-purple-700">
                <strong>Isencao SS &mdash; 1.o ano</strong> &mdash; estas isento de Seguranca Social nos primeiros 12 meses de atividade.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Lista proximos prazos — IVA e IRS */}
      <div className="mb-6">
        <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          Proximos prazos
        </h2>
        <div className="space-y-3">
          {futurosSemSS.length === 0 && futurosSS.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-6">Sem prazos futuros registados.</p>
          )}
          {futurosSemSS.map((prazo) => (
            <CardPrazo key={`${prazo.label}-${prazo.data}`} prazo={prazo} />
          ))}
        </div>
      </div>

      {/* SS mensal — colapsado */}
      {futurosSS.length > 0 && (
        <div className="mb-8">
          <button
            onClick={() => setSsExpandido((v) => !v)}
            className="w-full bg-white rounded-xl border border-gray-100 overflow-hidden text-left hover:border-gray-200 transition-colors"
          >
            <div className="h-1 bg-purple-100">
              <div className="h-full bg-purple-400 transition-all" style={{ width: "40%" }} />
            </div>
            <div className="px-5 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#7C3AED18" }}>
                  <span className="text-[10px] font-extrabold uppercase" style={{ color: "#7C3AED" }}>SS</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Seguranca Social mensal</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {futurosSS.length} pagamentos &mdash; proximo: {proximoSS && new Date(proximoSS.data + "T12:00:00").toLocaleDateString("pt-PT", { day: "numeric", month: "short" })}
                  </p>
                  {(saldos.ss ?? 0) > 0 && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-lg bg-green-50 text-green-700 border border-green-100 mt-1.5">
                      <PiggyBank className="w-3 h-3" />
                      &euro;{fmt(saldos.ss)} no cofre
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); abrirModal(futurosSS[0]); }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg text-white transition-colors hover:opacity-90"
                  style={{ background: "#7C3AED" }}
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Paguei
                </button>
                {ssExpandido
                  ? <ChevronUp className="w-4 h-4 text-gray-400" />
                  : <ChevronDown className="w-4 h-4 text-gray-400" />
                }
              </div>
            </div>
          </button>

          {ssExpandido && (
            <div className="mt-2 space-y-2 pl-4 border-l-2 border-purple-100">
              {futurosSS.map((prazo) => (
                <div key={`${prazo.label}-${prazo.data}`} className="bg-white rounded-xl border border-gray-100 px-5 py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{prazo.label}</p>
                    <p className="text-xs text-gray-400 capitalize">{formatarData(prazo.data)}</p>
                  </div>
                  <button
                    onClick={() => abrirModal(prazo)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg text-white transition-colors hover:opacity-90 shrink-0"
                    style={{ background: "#7C3AED" }}
                  >
                    <CheckCheck className="w-3 h-3" />
                    Paguei
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Prazos passados */}
      {passados.length > 0 && (
        <div className="mb-8">
          <h2 className="font-bold text-gray-400 mb-3 flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            Prazos anteriores
          </h2>
          <div className="space-y-2">
            {passados.map((prazo) => {
              const meta = TIPO_META[prazo.tipo];
              return (
                <div key={`${prazo.label}-${prazo.data}`} className="bg-gray-50 rounded-xl border border-gray-100 px-5 py-3.5 flex items-center justify-between gap-4 opacity-80">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded text-white shrink-0" style={{ background: meta.cor }}>{meta.label}</span>
                    <p className="text-sm font-medium text-gray-600 truncate">{prazo.label}</p>
                    <p className="text-xs text-gray-400 capitalize hidden sm:block shrink-0">{formatarData(prazo.data)}</p>
                  </div>
                  <button
                    onClick={() => abrirModal(prazo)}
                    className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors bg-white"
                  >
                    <CheckCheck className="w-3 h-3" />
                    Registar pagamento
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Nota rodape */}
      <div className="flex items-start gap-3 bg-gray-50 rounded-xl border border-gray-100 px-5 py-4">
        <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
        <p className="text-xs text-gray-500 leading-relaxed">
          Os prazos de SS sao gerados para os proximos 6 meses. O prazo exato pode variar se o dia 20 cair num fim de semana ou feriado &mdash; nesse caso o prazo passa para o proximo dia util.
          Prazos de IVA e IRS baseados no calendario fiscal 2026 da AT.
        </p>
      </div>

      {/* Modal pagamento */}
      {modalPrazo && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={fecharModal}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between px-6 py-5 border-b border-gray-100"
              style={{ borderTop: `4px solid ${metaModal?.cor ?? "#1F4E79"}` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${metaModal?.cor ?? "#1F4E79"}18` }}>
                  <CheckCircle2 className="w-5 h-5" style={{ color: metaModal?.cor ?? "#1F4E79" }} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Registar pagamento</p>
                  <p className="text-xs text-gray-400">{modalPrazo.label}</p>
                </div>
              </div>
              <button onClick={fecharModal} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {sucesso ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 px-6">
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
                <p className="font-bold text-gray-900">Pagamento registado!</p>
                <p className="text-sm text-gray-400">O saldo do cofre foi atualizado.</p>
              </div>
            ) : (
              <form onSubmit={handlePagar} className="px-6 py-5 space-y-5">
                <div className={`rounded-xl px-4 py-3 flex items-center gap-3 ${saldoModal > 0 ? "bg-green-50 border border-green-100" : "bg-gray-50 border border-gray-100"}`}>
                  <PiggyBank className={`w-4 h-4 shrink-0 ${saldoModal > 0 ? "text-green-600" : "text-gray-400"}`} />
                  <div>
                    {saldoModal > 0 ? (
                      <>
                        <p className="text-sm font-bold text-green-800">&euro;{fmt(saldoModal)} reservados no cofre</p>
                        <p className="text-xs text-green-600 mt-0.5">Valor pre-preenchido abaixo. Podes alterar se pagaste valor diferente.</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-bold text-gray-600">Cofre {metaModal?.label} esta vazio</p>
                        <p className="text-xs text-gray-400 mt-0.5">Introduz o valor que pagaste ao fisco.</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="valor-pagar" className="text-sm font-semibold text-gray-700">
                    Valor pago (&euro;)
                    {modalPrazo.tipo === "irs" && (
                      <span className="ml-2 text-xs font-normal text-gray-400">prestacao parcial permitida</span>
                    )}
                  </Label>
                  <Input
                    id="valor-pagar"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={valorPagar}
                    onChange={(e) => setValorPagar(e.target.value)}
                    className="h-12 text-lg font-bold"
                    required
                    autoFocus
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="nota-pagamento" className="text-sm font-semibold text-gray-700">
                    Nota <span className="text-gray-400 font-normal">(opcional)</span>
                  </Label>
                  <Input
                    id="nota-pagamento"
                    placeholder={`Ex: ${modalPrazo.label} pago via MB Way`}
                    value={nota}
                    onChange={(e) => setNota(e.target.value)}
                    className="h-11"
                  />
                </div>

                {erro && (
                  <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />{erro}
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  <Button type="button" variant="outline" className="flex-1 h-11" onClick={fecharModal}>
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 h-11 font-bold text-white"
                    style={{ background: metaModal?.cor ?? "#1F4E79" }}
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmar pagamento"}
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
