import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CheckCircle, Shield, Zap } from "lucide-react";
import Link from "next/link";

const PLANOS = [
  {
    id: "mensal",
    nome: "Mensal",
    preco: "€9",
    periodo: "/mês",
    desc: "Sem compromisso. Cancela quando quiseres.",
    destaque: false,
    features: [
      "Cofre fiscal ilimitado",
      "CRUD faturas + cálculo automático",
      "Alertas de prazos por email",
      "Importação PDF Fatura-Recibo",
      "Suporte por email",
    ],
  },
  {
    id: "anual",
    nome: "Anual",
    preco: "€79",
    periodo: "/ano",
    desc: "Equivale a €6,58/mês — poupa 27%.",
    destaque: true,
    features: [
      "Tudo do plano mensal",
      "Poupa €29/ano vs mensal",
      "Glossário PT→BR completo",
      "Relatório AIMA para regularização",
      "Suporte prioritário",
    ],
  },
];

export default async function PlanoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 mb-4">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-amber-700 font-bold text-xs uppercase tracking-widest">Trial gratuito</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Activa o teu plano</h1>
        <p className="text-gray-500 mt-2 text-base">
          Escolhe o plano que melhor se adapta. Sem cartão de crédito durante o trial — pagas só quando estiveres pronto.
        </p>
      </div>

      {/* Planos */}
      <div className="grid sm:grid-cols-2 gap-5">
        {PLANOS.map((p) => (
          <div
            key={p.id}
            className={`relative rounded-2xl p-6 flex flex-col ${
              p.destaque
                ? "border-2 border-[#1F4E79] bg-white shadow-lg"
                : "border border-gray-200 bg-white"
            }`}
          >
            {p.destaque && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-[#BF4700] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                  Mais popular — Poupa 27%
                </span>
              </div>
            )}

            <div className="mb-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{p.nome}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-gray-900">{p.preco}</span>
                <span className="text-gray-400 font-medium">{p.periodo}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{p.desc}</p>
            </div>

            <ul className="space-y-2.5 mb-6 flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-[#1E7145] shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            {/* Botão — preparado para LemonSqueezy (S6) */}
            <button
              disabled
              className={`w-full h-11 rounded-xl font-bold text-sm transition-colors cursor-not-allowed opacity-60 ${
                p.destaque
                  ? "bg-[#1F4E79] text-white"
                  : "border border-[#1F4E79] text-[#1F4E79]"
              }`}
            >
              Em breve — pagamentos a configurar
            </button>
          </div>
        ))}
      </div>

      {/* Nota */}
      <div className="mt-8 flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
        <Shield className="w-5 h-5 text-[#1E7145] shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Garantia de reembolso de 30 dias</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Se não ficares satisfeito nos primeiros 30 dias, devolvemos o dinheiro sem perguntas.
            Os pagamentos serão processados via LemonSqueezy — seguro e sem surpresas.
          </p>
        </div>
      </div>

      <p className="text-center text-sm text-gray-400 mt-6">
        Dúvidas?{" "}
        <a href="mailto:hello@freelancerpt.app" className="text-[#1F4E79] hover:underline font-medium">
          Fala connosco
        </a>
        {" "}·{" "}
        <Link href="/dashboard" className="text-[#1F4E79] hover:underline font-medium">
          Voltar ao dashboard
        </Link>
      </p>
    </div>
  );
}
