"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Sprout,
  CalendarDays,
  TrendingDown,
  TrendingUp,
  Minus,
  Banknote,
  Users,
  Laptop,
  Briefcase,
  FileText,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ChevronLeft,
  Loader2,
  Vault,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface FiscalConfig {
  primeiro_ano: boolean;
  isento_iva: boolean;
  tem_retencao: boolean;
  coeficiente: number;
}

interface Opcao {
  valor: boolean | number;
  titulo: string;
  descricao: string;
  Icon: React.ElementType;
}

interface Step {
  id: keyof FiscalConfig;
  pergunta: string;
  subtitulo: string;
  opcoes: Opcao[];
}

// ── Dados das perguntas ────────────────────────────────────────────────────────

const STEPS: Step[] = [
  {
    id: "primeiro_ano",
    pergunta: "Há quanto tempo emites recibos verdes em Portugal?",
    subtitulo: "Isso define se tens isenção de Segurança Social.",
    opcoes: [
      {
        valor: true,
        titulo: "Há menos de 1 ano",
        descricao: "Tenho isenção de SS durante os primeiros 12 meses de actividade.",
        Icon: Sprout,
      },
      {
        valor: false,
        titulo: "Há mais de 1 ano",
        descricao: "Já pago contribuições mensais à Segurança Social.",
        Icon: CalendarDays,
      },
    ],
  },
  {
    id: "isento_iva",
    pergunta: "Quanto faturaste nos últimos 12 meses?",
    subtitulo: "Determina se és isento de IVA pelo Artigo 53.º do CIVA.",
    opcoes: [
      {
        valor: true,
        titulo: "Menos de €15.000",
        descricao: "Não cobro IVA aos clientes — isento pelo Art. 53.º do CIVA.",
        Icon: TrendingDown,
      },
      {
        valor: false,
        titulo: "Mais de €15.000",
        descricao: "Cobro IVA de 23% nas faturas e entrego trimestralmente às Finanças.",
        Icon: TrendingUp,
      },
    ],
  },
  {
    id: "tem_retencao",
    pergunta: "Os teus clientes retêm IRS na fatura?",
    subtitulo: "Acontece quando o cliente tem contabilidade organizada (Art. 101.º do CIRS).",
    opcoes: [
      {
        valor: true,
        titulo: "Sim, sempre",
        descricao: "Todos os meus clientes retêm 23% de IRS — vejo \"Retenção na fonte\" nas faturas-recibo.",
        Icon: Minus,
      },
      {
        valor: false,
        titulo: "Não, nunca",
        descricao: "Recebo sempre o valor total e pago o IRS directamente nas Finanças.",
        Icon: Banknote,
      },
      {
        valor: false,
        titulo: "Depende do cliente",
        descricao: "Tenho clientes com e sem retenção. Vou indicar em cada fatura — ficará activado por defeito conforme o cliente.",
        Icon: Users,
      },
    ],
  },
  {
    id: "coeficiente",
    pergunta: "Como descreves o teu trabalho principal?",
    subtitulo: "Define o coeficiente do IRS no regime simplificado. A maioria dos freelancers usa 0,35.",
    opcoes: [
      {
        valor: 0.35,
        titulo: "Prestação de serviços (tech, design, consultoria…)",
        descricao: "Desenvolvimento, IT, design, marketing, gestão — qualquer serviço que não esteja na lista do Art. 151.º do CIRS. Coeficiente 0,35. É o mais comum.",
        Icon: Laptop,
      },
      {
        valor: 0.75,
        titulo: "Profissão regulamentada (médico, advogado, arquitecto…)",
        descricao: "Profissões listadas especificamente na Tabela do Art. 151.º do CIRS — ex: medicina, advocacia, arquitectura, contabilidade. Coeficiente 0,75.",
        Icon: Briefcase,
      },
    ],
  },
];

// ── Labels do resumo ───────────────────────────────────────────────────────────

function ResumoBadge({ ok, textoOk, textoNao }: { ok: boolean; textoOk: string; textoNao: string }) {
  return (
    <div className={`flex items-center gap-2.5 rounded-xl px-4 py-3 ${ok ? "bg-green-50" : "bg-gray-50"}`}>
      {ok
        ? <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
        : <XCircle className="w-4 h-4 text-gray-400 shrink-0" />
      }
      <p className={`text-sm font-medium ${ok ? "text-green-800" : "text-gray-600"}`}>
        {ok ? textoOk : textoNao}
      </p>
    </div>
  );
}

// ── Wizard ────────────────────────────────────────────────────────────────────

interface Props {
  userId: string;
}

export function OnboardingWizard({ userId }: Props) {
  const router = useRouter();
  const supabase = createClient();

  // -1 = welcome, 0-3 = steps, 4 = resumo
  const [stepIdx, setStepIdx] = useState(-1);
  const [config, setConfig] = useState<Partial<FiscalConfig>>({});
  const [saving, setSaving] = useState(false);

  const totalSteps = STEPS.length;
  const isWelcome = stepIdx === -1;
  const isResumo = stepIdx === totalSteps;
  const currentStep = !isWelcome && !isResumo ? STEPS[stepIdx] : null;

  function handleOpcao(valor: boolean | number) {
    if (!currentStep) return;
    const novaConfig = { ...config, [currentStep.id]: valor };
    setConfig(novaConfig);

    if (stepIdx < totalSteps - 1) {
      setStepIdx((prev) => prev + 1);
    } else {
      // Última pergunta → mostrar resumo
      setStepIdx(totalSteps);
    }
  }

  async function handleFinalizar() {
    const full = config as FiscalConfig;
    setSaving(true);

    await supabase
      .from("configuracoes_fiscais")
      .update({
        primeiro_ano: full.primeiro_ano,
        isento_iva: full.isento_iva,
        tem_retencao: full.tem_retencao,
        coeficiente: full.coeficiente,
        periodicidade_iva: "trimestral",
        onboarding_completed: true,
      })
      .eq("user_id", userId);

    router.push("/dashboard");
    router.refresh();
  }

  // ── Welcome ──────────────────────────────────────────────────────────────────

  if (isWelcome) {
    return (
      <div className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-[#1F4E79]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Vault className="w-8 h-8 text-[#1F4E79]" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">
          Bem-vindo ao FreelancerPT
        </h1>
        <p className="text-gray-500 mb-2">
          Vamos configurar o teu cofre fiscal em <strong className="text-gray-700">4 perguntas rápidas</strong>.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Com base nas tuas respostas, os cálculos de IVA, IRS e Segurança Social ficam calibrados ao teu perfil exacto.
        </p>
        <button
          onClick={() => setStepIdx(0)}
          className="w-full bg-[#1F4E79] hover:bg-[#163a5f] text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          Começar
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // ── Resumo ───────────────────────────────────────────────────────────────────

  if (isResumo) {
    const full = config as FiscalConfig;
    return (
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7 text-green-600" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">O teu perfil fiscal</h2>
          <p className="text-sm text-gray-400 mt-1">Confirma antes de entrar no cofre.</p>
        </div>

        <div className="space-y-2 mb-6">
          <ResumoBadge
            ok={full.primeiro_ano}
            textoOk="Isento de Segurança Social (1.º ano)"
            textoNao="A pagar Segurança Social mensalmente"
          />
          <ResumoBadge
            ok={full.isento_iva}
            textoOk="Isento de IVA — Art. 53.º do CIVA"
            textoNao="Regime normal de IVA — 23%"
          />
          <ResumoBadge
            ok={full.tem_retencao}
            textoOk="Cliente faz retenção na fonte de IRS"
            textoNao="Sem retenção na fonte — pagas o IRS directo"
          />
          <div className="flex items-center gap-2.5 bg-blue-50 rounded-xl px-4 py-3">
            <FileText className="w-4 h-4 text-blue-600 shrink-0" />
            <p className="text-sm font-medium text-blue-800">
              Coeficiente IRS: <strong>{full.coeficiente === 0.35 ? "0,35" : "0,75"}</strong>
              {" "}— {full.coeficiente === 0.35 ? "prestação de serviços (campo 404)" : "profissão regulamentada art. 151.º (campo 403)"}
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center mb-5">
          Podes alterar estas configurações a qualquer momento em Configurações → Configuração Fiscal.
        </p>

        <button
          onClick={handleFinalizar}
          disabled={saving}
          className="w-full bg-[#BF4700] hover:bg-[#a33a00] disabled:opacity-60 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Entrar no cofre
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <button
          onClick={() => setStepIdx(totalSteps - 1)}
          className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600 py-2 flex items-center justify-center gap-1 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar e corrigir
        </button>
      </div>
    );
  }

  // ── Pergunta ─────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < stepIdx ? "bg-[#1F4E79]" : i === stepIdx ? "bg-[#1F4E79]/40" : "bg-gray-100"
            }`}
          />
        ))}
      </div>

      {/* Step label */}
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
        Pergunta {stepIdx + 1} de {totalSteps}
      </p>

      {/* Question */}
      <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mb-1.5">
        {currentStep!.pergunta}
      </h2>
      <p className="text-sm text-gray-500 mb-6">{currentStep!.subtitulo}</p>

      {/* Options */}
      <div className="space-y-3">
        {currentStep!.opcoes.map((opcao, i) => {
          const { Icon } = opcao;
          return (
            <button
              key={i}
              onClick={() => handleOpcao(opcao.valor)}
              className="w-full text-left bg-white border-2 border-gray-100 hover:border-[#1F4E79] hover:bg-[#1F4E79]/3 rounded-xl p-4 flex items-start gap-4 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-50 group-hover:bg-[#1F4E79]/10 flex items-center justify-center shrink-0 transition-colors mt-0.5">
                <Icon className="w-5 h-5 text-gray-400 group-hover:text-[#1F4E79] transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm group-hover:text-[#1F4E79] transition-colors">
                  {opcao.titulo}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{opcao.descricao}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#1F4E79] shrink-0 mt-3 transition-colors" />
            </button>
          );
        })}
      </div>

      {/* Voltar */}
      {stepIdx > 0 && (
        <button
          onClick={() => setStepIdx((prev) => prev - 1)}
          className="mt-6 text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </button>
      )}
    </div>
  );
}
