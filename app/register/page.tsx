import { AuthForm } from "@/components/auth/AuthForm";
import { Shield, CheckCircle } from "lucide-react";
import Link from "next/link";

const beneficios = [
  "Sabe exactamente quanto guardar por fatura",
  "Nunca mais chegar ao prazo sem dinheiro",
  "Alertas 30 dias antes de cada imposto",
  "14 dias grátis — sem cartão de crédito",
];

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-10 items-center">

        {/* Lado esquerdo — benefícios */}
        <div className="space-y-6 hidden lg:block">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#1F4E79] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-[#1F4E79] tracking-tight">
              freelancer<span className="text-[#BF4700]">PT</span>
            </span>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
              Para de perder dinheiro<br />
              <span className="text-[#BF4700]">sem perceber porquê.</span>
            </h1>
            <p className="text-gray-500 mt-3 text-lg leading-relaxed">
              A ferramenta que todo o freelancer brasileiro em Portugal precisava — e ninguém tinha feito.
            </p>
          </div>

          <ul className="space-y-3">
            {beneficios.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#1E7145] shrink-0 mt-0.5" />
                <span className="text-gray-700">{b}</span>
              </li>
            ))}
          </ul>

          {/* Social proof */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-sm text-gray-600 italic">
              &ldquo;Descobri que estava a dever €3.800 de IRS que não sabia. Agora guardo automaticamente.&rdquo;
            </p>
            <p className="text-xs text-gray-400 mt-2 font-semibold">
              — Mariana T., consultora, Lisboa
            </p>
          </div>
        </div>

        {/* Lado direito — formulário */}
        <div>
          {/* Logo mobile */}
          <div className="text-center mb-6 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 bg-[#1F4E79] rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-[#1F4E79] tracking-tight">
                freelancer<span className="text-[#BF4700]">PT</span>
              </span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Criar conta grátis</h2>
            <p className="text-sm text-gray-500 mb-6">14 dias grátis, sem cartão de crédito.</p>

            <AuthForm mode="register" />

            <p className="text-center text-sm text-gray-500 mt-6 pt-5 border-t border-gray-50">
              Já tens conta?{" "}
              <Link href="/login" className="text-[#1F4E79] font-semibold hover:underline">
                Entrar
              </Link>
            </p>

            <p className="text-[11px] text-gray-400 text-center mt-3">
              Ao criares conta, aceitas os{" "}
              <Link href="/termos" className="underline">Termos</Link>{" "}
              e a{" "}
              <Link href="/privacidade" className="underline">Política de Privacidade</Link>.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
