import Image from "next/image";
import Link from "next/link";
import { Calculadora } from "@/components/Calculadora";
import { CofreFiscal } from "@/components/CofreFiscal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  CheckCircle,
  Bell,
  BarChart3,
  Shield,
  ArrowRight,
  Star,
  AlertTriangle,
  Clock,
  TrendingDown,
  FileText,
  Zap,
  Lock,
  Users,
  Calculator,
  X,
  TrendingUp,
  Euro,
  Timer,
} from "lucide-react";

// ─── Avatar with initials ──────────────────────────────────────────────────────
function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${color}`}
    >
      {initials}
    </div>
  );
}

// ─── Stat card large ───────────────────────────────────────────────────────────
function ScaryStatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className={`rounded-2xl p-6 ${color}`}>
      <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-1">
        {label}
      </p>
      <p className="text-4xl font-extrabold mb-1">{value}</p>
      <p className="text-sm opacity-80">{sub}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── BANNER ANEXO J ───────────────────────────────────────────────── */}
      <div className="bg-amber-500 text-white text-center py-2.5 text-sm font-medium">
        <span className="font-extrabold">🚨 AT notificou +6.000 brasileiros sobre Anexo J —</span>
        {" "}
        <a
          href="/blog/at-notificou-brasileiros-anexo-j"
          className="underline underline-offset-2 font-semibold hover:text-amber-100 transition-colors"
        >
          Saiba o que fazer agora →
        </a>
      </div>

      {/* ── URGENCY BAR ──────────────────────────────────────────────────── */}
      <div className="bg-[#BF4700] text-white text-center py-2.5 text-sm font-medium">
        <span className="font-extrabold">⚠ Proximo prazo IVA: 20 de Agosto</span>
        &nbsp;&mdash;&nbsp;72 dias para entregar o trimestre.&nbsp;
        <a
          href="#calculadora"
          className="underline underline-offset-2 font-semibold hover:text-orange-200 transition-colors"
        >
          Ja separaste o dinheiro?
        </a>
      </div>

      {/* ── NAVIGATION ───────────────────────────────────────────────────── */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-md z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#1F4E79] flex items-center justify-center shadow-sm">
              <span className="text-white font-extrabold text-base">F</span>
            </div>
            <div>
              <span className="font-extrabold text-[#1F4E79] text-lg leading-none">
                FreelancerPT
              </span>
              <span className="block text-[10px] text-gray-400 leading-none mt-0.5">
                Gestao fiscal para recibos verdes
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#perdes" className="hover:text-[#1F4E79] transition-colors font-medium">O que perdes</a>
            <a href="#como-funciona" className="hover:text-[#1F4E79] transition-colors font-medium">Como funciona</a>
            <a href="#precos" className="hover:text-[#1F4E79] transition-colors font-medium">Precos</a>
            <a href="#faq" className="hover:text-[#1F4E79] transition-colors font-medium">FAQ</a>
          </div>

          <Button asChild className="bg-[#BF4700] hover:bg-[#BF4700]/90 text-sm h-9 px-5 rounded-lg font-semibold shadow-sm transition-colors">
            <Link href="/register">
              Comecar gratis
              <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-14 pb-18">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div className="space-y-7">

            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-700 font-bold text-xs uppercase tracking-widest">
                Alerta fiscal 2026
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
              Numa fatura de&nbsp;
              <span className="text-[#1F4E79]">€3.000</span>,
              o Estado vai buscar&nbsp;
              <span className="text-[#BF4700] underline decoration-wavy decoration-[#BF4700]/40">€1.635</span>.
              <br />
              <span className="text-gray-600 text-3xl lg:text-4xl">Ja separaste?</span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed">
              A maioria dos freelancers em Portugal gasta o dinheiro que chegou na conta
              &mdash; sem saber que quase <strong>44% pertence ao fisco</strong>.
              Quando chega o acerto, o choque e brutal. O FreelancerPT resolve isso.
            </p>

            {/* Mini stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {[
                { v: "44%", l: "da fatura e do Estado" },
                { v: "4×/ano", l: "prazos IVA que podes perder" },
                { v: "€19k+", l: "divida media anual sem controlo" },
              ].map((s) => (
                <div key={s.v} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                  <p className="text-xl font-extrabold text-[#BF4700]">{s.v}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-tight">{s.l}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Button
                asChild
                size="lg"
                className="bg-[#BF4700] hover:bg-[#BF4700]/90 text-base h-13 px-7 font-bold rounded-xl shadow-lg transition-colors"
              >
                <Link href="/register">
                  Calcular o que devo agora
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 h-13 px-6 rounded-xl"
              >
                <a href="#calculadora">Ver demo gratis</a>
              </Button>
            </div>

            {/* Social strip */}
            <div className="flex flex-wrap gap-4 items-center pt-1">
              <div className="flex -space-x-2">
                {[
                  { initials: "AM", color: "bg-[#1F4E79]" },
                  { initials: "RC", color: "bg-[#2E75B6]" },
                  { initials: "FS", color: "bg-[#1E7145]" },
                  { initials: "LB", color: "bg-[#BF4700]" },
                ].map((a) => <Avatar key={a.initials} {...a} />)}
              </div>
              <div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  +340 freelancers ja controlam os impostos
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-400">
              Sem cartao de credito &middot; 14 dias gratis &middot; Cancela quando quiseres
            </p>
          </div>

          {/* Hero image */}
          <div className="flex flex-col gap-4">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/hero-dashboard.jpg"
                alt="Dashboard FreelancerPT — visao geral das reservas de impostos e faturas recentes"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Caption under image */}
            <div className="flex items-center gap-2 bg-[#1E7145]/10 border border-[#1E7145]/20 rounded-xl px-4 py-2.5">
              <CheckCircle className="w-4 h-4 text-[#1E7145] shrink-0" />
              <p className="text-xs text-[#1E7145] font-medium">
                Com FreelancerPT: sabes exactamente o que guardar de cada fatura, antes de gastar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── O QUE PERDES SEM CONTROLO ────────────────────────────────────── */}
      <section id="perdes" className="bg-[#1a1a2e] py-20">
        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-14">
            <Badge className="bg-red-500/20 text-red-300 border-red-500/30 mb-4 font-bold text-xs uppercase tracking-widest">
              A verdade que ninguem te conta
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4 tracking-tight">
              Se faturaste <span className="text-[#BF4700]">€3.000/mes</span> este ano<br />
              ja deves <span className="text-red-400">€19.617 ao Estado</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-lg">
              Este dinheiro entrou na tua conta. Mas nunca foi teu. Aqui esta a prova:
            </p>
          </div>

          {/* Scenario breakdown */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">

              {/* Header row */}
              <div className="hidden sm:grid grid-cols-4 bg-white/10 px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span>Imposto</span>
                <span className="text-center">Por fatura</span>
                <span className="text-center">Por mes</span>
                <span className="text-right text-red-400">Divida anual</span>
              </div>

              {[
                {
                  name: "IVA (23%)",
                  desc: "Cobras ao cliente mas devolves ao fisco trimestralmente",
                  perFatura: "€690",
                  porMes: "€690",
                  anual: "€8.280",
                  color: "text-red-400",
                  bg: "bg-red-500/5",
                },
                {
                  name: "IRS (~22%)",
                  desc: "Regime simplificado: 75% da fatura e tributavel",
                  perFatura: "€495",
                  porMes: "€495",
                  anual: "€5.940",
                  color: "text-amber-400",
                  bg: "bg-amber-500/5",
                },
                {
                  name: "Seguranca Social",
                  desc: "21,4% sobre 70% dos teus rendimentos trimestrais",
                  perFatura: "€450",
                  porMes: "€450",
                  anual: "€5.397",
                  color: "text-orange-400",
                  bg: "bg-orange-500/5",
                },
              ].map((row) => (
                <div key={row.name} className={`border-t border-white/5 ${row.bg}`}>
                  {/* Mobile: 2 colunas */}
                  <div className="sm:hidden px-4 py-4 flex items-center justify-between gap-3">
                    <div>
                      <p className={`font-bold text-sm ${row.color}`}>{row.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{row.desc}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`font-extrabold text-base ${row.color}`}>{row.anual}<span className="text-xs font-normal text-gray-400">/ano</span></p>
                      <p className="text-xs text-gray-400">{row.perFatura}/fatura</p>
                    </div>
                  </div>
                  {/* Desktop: 4 colunas */}
                  <div className="hidden sm:grid grid-cols-4 px-6 py-5 items-center">
                    <div>
                      <p className={`font-bold text-sm ${row.color}`}>{row.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-tight">{row.desc}</p>
                    </div>
                    <p className="text-center text-white font-semibold text-sm">{row.perFatura}</p>
                    <p className="text-center text-white font-semibold text-sm">{row.porMes}</p>
                    <p className={`text-right font-extrabold text-base ${row.color}`}>{row.anual}</p>
                  </div>
                </div>
              ))}

              {/* Total row */}
              <div className="border-t-2 border-red-500/40 bg-red-500/10">
                {/* Mobile */}
                <div className="sm:hidden px-4 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-extrabold text-white text-sm">TOTAL A PAGAR</p>
                    <p className="text-xs text-gray-400 mt-0.5">Se nao guardaste nada</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-red-400 text-xl">€19.617</p>
                    <p className="text-xs text-red-400/70">+ juros e coimas</p>
                  </div>
                </div>
                {/* Desktop */}
                <div className="hidden sm:grid grid-cols-4 px-6 py-5 items-center">
                  <div>
                    <p className="font-extrabold text-white text-sm">TOTAL A PAGAR</p>
                    <p className="text-xs text-gray-400 mt-0.5">Se nao guardaste nada</p>
                  </div>
                  <p className="text-center text-white font-extrabold">€1.635</p>
                  <p className="text-center text-white font-extrabold">€1.635/fatura</p>
                  <div className="text-right">
                    <p className="font-extrabold text-red-400 text-2xl">€19.617</p>
                    <p className="text-xs text-red-400/70 mt-0.5">+ juros e coimas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning box */}
            <div className="mt-6 flex gap-4 bg-[#BF4700]/15 border border-[#BF4700]/30 rounded-2xl p-5">
              <AlertTriangle className="w-6 h-6 text-[#BF4700] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white text-sm mb-1">
                  O que acontece se nao pagares a tempo?
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Coima minima de <strong className="text-white">€200</strong> por declaracao em falta.
                  Juros de mora de <strong className="text-white">4% ao ano</strong> sobre o valor em divida.
                  Para €19.617: mais de <strong className="text-white">€785 em juros</strong> no primeiro ano.
                  A divida cresce enquanto nao pagas.
                </p>
              </div>
            </div>

            {/* CTA inside dark section */}
            <div className="mt-8 text-center">
              <Button
                asChild
                size="lg"
                className="bg-[#BF4700] hover:bg-[#BF4700]/90 text-base h-12 px-9 font-bold rounded-xl shadow-lg"
              >
                <Link href="/register">
                  Quero controlar isto agora
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <p className="text-gray-500 text-xs mt-3">14 dias gratis &middot; Sem cartao</p>
            </div>
          </div>

          {/* Income level comparison */}
          <div className="mt-16">
            <p className="text-center text-gray-400 text-sm font-semibold uppercase tracking-widest mb-8">
              Quanto deves por nivel de faturacao anual
            </p>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  income: "€18.000/ano",
                  label: "€1.500/mes",
                  iva: "€4.140",
                  irs: "€2.970",
                  ss: "€2.699",
                  total: "€9.809",
                  pct: "54%",
                  accent: "border-yellow-500/40 bg-yellow-500/5",
                  totalColor: "text-yellow-400",
                },
                {
                  income: "€36.000/ano",
                  label: "€3.000/mes",
                  iva: "€8.280",
                  irs: "€5.940",
                  ss: "€5.397",
                  total: "€19.617",
                  pct: "55%",
                  accent: "border-orange-500/40 bg-orange-500/5",
                  totalColor: "text-orange-400",
                },
                {
                  income: "€60.000/ano",
                  label: "€5.000/mes",
                  iva: "€13.800",
                  irs: "€11.250",
                  ss: "€8.988",
                  total: "€34.038",
                  pct: "57%",
                  accent: "border-red-500/40 bg-red-500/5",
                  totalColor: "text-red-400",
                },
              ].map((tier) => (
                <div key={tier.income} className={`rounded-2xl border p-6 ${tier.accent}`}>
                  <div className="mb-4">
                    <p className="text-white font-extrabold text-lg">{tier.income}</p>
                    <p className="text-gray-500 text-xs">{tier.label}</p>
                  </div>
                  <div className="space-y-2 mb-4">
                    {[
                      { l: "IVA", v: tier.iva },
                      { l: "IRS", v: tier.irs },
                      { l: "SS", v: tier.ss },
                    ].map((row) => (
                      <div key={row.l} className="flex justify-between text-sm">
                        <span className="text-gray-500">{row.l}</span>
                        <span className="text-gray-300 font-medium">{row.v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-white/10 pt-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-gray-400 text-sm font-bold">Total ao Estado</span>
                      <span className={`text-2xl font-extrabold ${tier.totalColor}`}>{tier.total}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{tier.pct} da tua faturacao bruta</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ANTES / DEPOIS ───────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
              A diferenca e simples
            </h2>
            <p className="text-gray-500 text-lg">Dois freelancers. Mesma faturacao. Destinos completamente diferentes.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Sem FreelancerPT */}
            <div className="rounded-2xl border-2 border-red-200 bg-red-50 overflow-hidden">
              <div className="bg-red-500 px-6 py-4 flex items-center gap-3">
                <X className="w-5 h-5 text-white" />
                <span className="text-white font-extrabold text-sm uppercase tracking-widest">
                  Sem FreelancerPT
                </span>
              </div>
              <div className="p-6 space-y-4">
                {[
                  "Recebe €3.690 na conta e gasta tudo",
                  "Nao sabe que €690 e IVA que vai devolver",
                  "Esquece o prazo do IVA — multa de €200",
                  "Em Abril recebe aviso das Financas: deve €11.337",
                  "Nao tem o dinheiro. Entra em divida com o fisco.",
                  "Paga juros de mora. Stress. Noites sem dormir.",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-200 flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-3 h-3 text-red-600" />
                    </div>
                    <p className="text-red-800 text-sm leading-relaxed">{item}</p>
                  </div>
                ))}
                <div className="bg-red-100 rounded-xl p-4 mt-2">
                  <p className="text-red-700 text-xs font-semibold uppercase tracking-widest mb-1">Resultado</p>
                  <p className="text-red-900 font-extrabold text-lg">-€19.617 em divida</p>
                  <p className="text-red-600 text-xs mt-0.5">+ coimas + juros + stress</p>
                </div>
              </div>
            </div>

            {/* Com FreelancerPT */}
            <div className="rounded-2xl border-2 border-[#1E7145]/30 bg-[#1E7145]/5 overflow-hidden">
              <div className="bg-[#1E7145] px-6 py-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-white" />
                <span className="text-white font-extrabold text-sm uppercase tracking-widest">
                  Com FreelancerPT
                </span>
              </div>
              <div className="p-6 space-y-4">
                {[
                  "Emite fatura de €3.000 — app calcula em segundos",
                  "Sabe que €690 e IVA e separa imediatamente",
                  "Guarda €495 para IRS e €450 para SS automaticamente",
                  "Recebe alerta 30 dias antes do prazo IVA",
                  "Paga tudo a tempo. Zero multas. Zero surpresas.",
                  "Liquido real: €2.055 que e MESMO teu.",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#1E7145]/20 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-[#1E7145]" />
                    </div>
                    <p className="text-gray-800 text-sm leading-relaxed">{item}</p>
                  </div>
                ))}
                <div className="bg-[#1E7145]/10 rounded-xl p-4 mt-2">
                  <p className="text-[#1E7145] text-xs font-semibold uppercase tracking-widest mb-1">Resultado</p>
                  <p className="text-gray-900 font-extrabold text-lg">€0 de divida</p>
                  <p className="text-[#1E7145] text-xs mt-0.5">Paz de espirito. Controlo total.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ────────────────────────────────────────────────── */}
      <section id="como-funciona" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <Badge className="bg-[#1E7145]/10 text-[#1E7145] border-0 mb-4 font-semibold">
              Como funciona
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
              3 passos. <span className="text-[#1F4E79]">30 segundos.</span> Problema resolvido.
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto text-lg">
              Nao precisas de saber nada sobre impostos. O FreelancerPT sabe por ti.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className="space-y-8">
              {[
                {
                  num: "01",
                  icon: <FileText className="w-5 h-5 text-white" />,
                  title: "Registas a fatura",
                  desc: "Inseres o valor base. O FreelancerPT calcula instantaneamente IVA, IRS e SS — incluindo o teu perfil fiscal (isento? retencao? 1.o ano de SS?).",
                  highlight: "Menos de 30 segundos por fatura",
                },
                {
                  num: "02",
                  icon: <Calculator className="w-5 h-5 text-white" />,
                  title: "Sabes o que guardar",
                  desc: "Ves em tempo real: aqui esta o IVA para separar, o IRS para reservar, o SS para provisionar. E em destaque: o teu liquido real.",
                  highlight: "Nunca mais gastas dinheiro que nao e teu",
                },
                {
                  num: "03",
                  icon: <Bell className="w-5 h-5 text-white" />,
                  title: "Recebes alertas a tempo",
                  desc: "30, 15 e 7 dias antes de cada prazo do fisco recebes um email. IVA trimestral, IRS anual, SS mensal. Nunca mais coimas.",
                  highlight: "€200 de coima evitada por prazo",
                },
              ].map((step) => (
                <div key={step.num} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#1F4E79] flex items-center justify-center shrink-0 shadow-md">
                      {step.icon}
                    </div>
                    <div className="w-px flex-1 bg-gray-200 mt-3" />
                  </div>
                  <div className="pb-8">
                    <span className="text-xs font-bold text-[#2E75B6] tracking-widest uppercase">
                      Passo {step.num}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mt-1 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-2">
                      {step.desc}
                    </p>
                    <div className="inline-flex items-center gap-1.5 bg-[#1E7145]/10 text-[#1E7145] text-xs font-semibold px-3 py-1.5 rounded-full">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {step.highlight}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile image */}
            <div className="w-full max-w-sm mx-auto">
              <Image
                src="/mobile-dashboard.jpg"
                alt="FreelancerPT no telemovel — calculadora fiscal com IVA, IRS e Seguranca Social"
                width={600}
                height={800}
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── COFRE FISCAL DEMO ────────────────────────────────────────────── */}
      <section id="cofre" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Texto */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#1F4E79]/10 border border-[#1F4E79]/20 rounded-full px-4 py-1.5">
                <span className="text-[#1F4E79] font-bold text-xs uppercase tracking-widest">
                  Nova funcionalidade
                </span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight">
                O teu cofre fiscal.{" "}
                <span className="text-[#1F4E79]">Em tempo real.</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Três medidores — IVA, IRS e Segurança Social — que mostram
                exactamente quanto já guardaste vs. o que precisas de ter
                separado. Nunca mais chegares ao prazo sem o dinheiro.
              </p>

              <div className="space-y-4">
                {[
                  {
                    color: "bg-[#1E7145]",
                    title: "Verde = coberto",
                    desc: "Mais de 80% guardado. Está bem.",
                  },
                  {
                    color: "bg-amber-500",
                    title: "Amarelo = atenção",
                    desc: "Entre 45-80%. Tens de guardar mais.",
                  },
                  {
                    color: "bg-red-500",
                    title: "Vermelho = urgente",
                    desc: "Menos de 45%. Actua agora.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${item.color}`} />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-500 italic border-l-2 border-[#1F4E79]/30 pl-4">
                &ldquo;Vejo o cofre todos os dias quando emito uma fatura.
                É o primeiro lugar onde olho — como o saldo do banco, mas para impostos.&rdquo;
                <br />
                <span className="font-semibold text-gray-700 not-italic">— Rafael C., designer UX, Porto</span>
              </p>
            </div>

            {/* Teaser do cofre — dados fictícios com lock */}
            <div className="relative flex justify-center">
              {/* Cofre com dados fictícios (readOnly) */}
              <div className="relative w-full max-w-sm">
                <CofreFiscal
                  readOnly
                  titulo="Exemplo — Rafael C. • Junho 2026"
                  faturado={3000}
                  guardado={{ iva: 230, irs: 40, ss: 375 }}
                />

                {/* Overlay de lock */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  {/* Blur apenas na metade inferior */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[55%]"
                    style={{ backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
                  />
                  {/* Gradiente de fade no topo do blur */}
                  <div className="absolute bottom-[55%] left-0 right-0 h-16 bg-gradient-to-b from-transparent to-white/40" />

                  {/* CTA central */}
                  <div className="absolute bottom-0 left-0 right-0 h-[50%] flex flex-col items-center justify-center gap-3 px-6">
                    <div className="bg-white/95 backdrop-blur rounded-xl shadow-xl border border-gray-100 p-5 text-center w-full">
                      <div className="w-9 h-9 bg-[#1F4E79] rounded-full flex items-center justify-center mx-auto mb-2">
                        <Lock className="w-4 h-4 text-white" />
                      </div>
                      <p className="font-bold text-gray-900 text-sm mb-0.5">Vê o teu cofre real</p>
                      <p className="text-gray-500 text-xs mb-3">Com os teus números, não os do Rafael.</p>
                      <a
                        href="/register"
                        className="block w-full bg-[#BF4700] hover:bg-[#a33a00] text-white font-bold py-2.5 rounded-lg text-sm transition-colors"
                      >
                        Criar conta grátis →
                      </a>
                      <p className="text-[10px] text-gray-400 mt-2">14 dias grátis • sem cartão</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CALCULADORA DEMO ─────────────────────────────────────────────── */}
      <section id="calculadora" className="py-20 bg-[#0F2A45]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className="text-white space-y-6">
              <Badge className="bg-white/10 text-white border-0 font-semibold">
                Calculadora ao vivo
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight">
                Descobre agora quanto<br />
                <span className="text-[#BF4700]">nao e teu</span>{" "}
                nesta fatura.
              </h2>
              <p className="text-blue-200 text-lg leading-relaxed">
                Insere qualquer valor. Ve em segundos o que pertence ao Estado
                e o que e realmente teu. Sem registo. Sem truques.
              </p>

              {/* Scary example */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Exemplo: fatura de €3.000</p>
                {[
                  { label: "IVA — devolver ao Estado", val: "€690", color: "text-red-400" },
                  { label: "IRS — reservar ja", val: "€495", color: "text-amber-400" },
                  { label: "SS — guardar", val: "€450", color: "text-orange-400" },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">{r.label}</span>
                    <span className={`font-bold text-sm ${r.color}`}>{r.val}</span>
                  </div>
                ))}
                <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                  <span className="text-gray-300 text-sm font-bold">Teu liquido real</span>
                  <span className="text-[#4ade80] font-extrabold text-xl">€2.055</span>
                </div>
              </div>

              <Button
                asChild
                size="lg"
                className="bg-white text-[#1F4E79] hover:bg-blue-50 font-bold h-12 px-7 rounded-xl shadow-md"
              >
                <Link href="/register">
                  Comecar trial gratis — 14 dias
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <p className="text-blue-300 text-xs">Sem cartao de credito</p>
            </div>

            <div className="flex justify-center">
              <Calculadora />
            </div>
          </div>
        </div>
      </section>

      {/* ── ROI SECTION ──────────────────────────────────────────────────── */}
      <section className="py-16 bg-[#1E7145]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white mb-3 tracking-tight">
            €9/mes para gerir <span className="text-green-200">€19.617</span> em obrigacoes fiscais.
          </h2>
          <p className="text-green-200 text-lg mb-8">
            O ROI e simples: evitas <strong className="text-white">1 coima de €200</strong> e o FreelancerPT
            ja se pagou por <strong className="text-white">22 meses</strong>.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 text-white mb-10">
            {[
              { v: "€9/mes", l: "Custo do FreelancerPT" },
              { v: "€200+", l: "Coima minima por prazo perdido" },
              { v: "2.222%", l: "ROI so em multas evitadas" },
            ].map((s) => (
              <div key={s.v} className="bg-white/10 rounded-2xl p-5">
                <p className="text-3xl font-extrabold">{s.v}</p>
                <p className="text-green-200 text-sm mt-1">{s.l}</p>
              </div>
            ))}
          </div>
          <Button
            asChild
            size="lg"
            className="bg-white text-[#1E7145] hover:bg-green-50 font-bold h-12 px-9 rounded-xl shadow-lg"
          >
            <Link href="/register">
              Comecar agora — 14 dias gratis
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ── FUNCIONALIDADES ──────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
              Tudo o que precisas para nunca mais te apanharem de surpresa
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Feito especificamente para quem trabalha em recibos verdes em Portugal.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <BarChart3 className="w-6 h-6 text-[#1F4E79]" />,
                title: "Dashboard em tempo real",
                desc: "Quanto ja faturaste, quanto guardaste, projecao de IRS para o ano. Tudo visivel. Sem surpresas.",
                badge: "Critico",
                badgeColor: "bg-red-100 text-red-700",
              },
              {
                icon: <Bell className="w-6 h-6 text-[#1F4E79]" />,
                title: "Alertas de prazo automaticos",
                desc: "Emails a 30, 15 e 7 dias de cada prazo. IVA trimestral, IRS anual, SS. Nunca mais multas.",
                badge: "Poupa €200+/ano",
                badgeColor: "bg-green-100 text-green-700",
              },
              {
                icon: <Shield className="w-6 h-6 text-[#1F4E79]" />,
                title: "Regras fiscais 2026 verificadas",
                desc: "Regime simplificado, Art. 53.o, retencao na fonte, isencao SS 1.o ano. Todos os casos cobertos.",
                badge: "Atualizado",
                badgeColor: "bg-blue-100 text-blue-700",
              },
              {
                icon: <Zap className="w-6 h-6 text-[#1F4E79]" />,
                title: "Calculo em segundos",
                desc: "Emites a fatura, o FreelancerPT calcula. Sem formulas. Sem Excel. Sem erro humano.",
                badge: "30 segundos",
                badgeColor: "bg-[#1F4E79]/10 text-[#1F4E79]",
              },
              {
                icon: <Lock className="w-6 h-6 text-[#1F4E79]" />,
                title: "Dados seguros e privados",
                desc: "Os teus dados nunca sao partilhados. Servidores na Europa, conformidade RGPD.",
                badge: "RGPD",
                badgeColor: "bg-gray-100 text-gray-700",
              },
              {
                icon: <Users className="w-6 h-6 text-[#1F4E79]" />,
                title: "Suporte em portugues (PT)",
                desc: "Equipa que entende os freelancers imigrantes em Portugal. Suporte rapido por email.",
                badge: "Humano",
                badgeColor: "bg-amber-100 text-amber-700",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-gray-100 hover:border-[#1F4E79]/20 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#1F4E79]/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTEMUNHOS ──────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex justify-center gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
              +340 freelancers ja nao perdem dinheiro para o fisco
            </h2>
            <p className="text-gray-600">O que eles dizem (com numeros reais).</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "Recebi uma carta das Financas a dizer que devia €3.200 de IRS. Nao tinha o dinheiro. Foi um desastre. Instalei o FreelancerPT e nunca mais tive essa situacao.",
                highlight: "Evitou €3.200 de susto",
                name: "Ana Moreira",
                role: "Desenvolvedora frontend, Lisboa",
                initials: "AM",
                color: "bg-[#1F4E79]",
              },
              {
                quote: "Passei 18 meses sem controlo. Perdi €400 em coimas por atraso no IVA porque nao sabia as datas. Hoje o FreelancerPT avisa-me antes. Ja poupei mais de €1.200 em multas.",
                highlight: "€1.200 poupados em multas",
                name: "Rafael Carvalho",
                role: "Designer UX, Porto",
                initials: "RC",
                color: "bg-[#2E75B6]",
              },
              {
                quote: "Faturava €2.500/mes e gastava tudo. Quando chegou o IRS devia €8.700. Tive de pedir emprestado. Com o FreelancerPT, já tenho €5.000 guardados para o proximo acerto.",
                highlight: "€5.000 reservados antecipadamente",
                name: "Fernanda Santos",
                role: "Copywriter, Lisboa",
                initials: "FS",
                color: "bg-[#1E7145]",
              },
            ].map((t, i) => (
              <Card key={i} className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden">
                {/* Highlight banner */}
                <div className="bg-[#1E7145]/10 border-b border-[#1E7145]/10 px-6 py-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#1E7145]" />
                    <span className="text-[#1E7145] font-bold text-xs">{t.highlight}</span>
                  </div>
                </div>
                <CardContent className="pt-5 space-y-4">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                    <Avatar initials={t.initials} color={t.color} />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRECOS ───────────────────────────────────────────────────────── */}
      <section id="precos" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge className="bg-[#1F4E79]/10 text-[#1F4E79] border-0 mb-4 font-semibold">
              Precos
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
              €9/mes para gerir €19.617 de obrigacoes.
            </h2>
            <p className="text-gray-600 text-lg">
              Uma unica coima paga o FreelancerPT por <strong>22 meses</strong>.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Mensal */}
            <Card className="border border-gray-200 rounded-2xl shadow-sm">
              <CardHeader className="pb-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Mensal</p>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-5xl font-extrabold text-gray-900">9</span>
                  <span className="text-gray-500 text-lg">/mes</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Faturado mensalmente</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Calculadora ilimitada",
                  "Dashboard completo",
                  "Alertas de prazo por email",
                  "Simulador de IRS anual",
                  "Export CSV de historico",
                  "Suporte por email",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-3 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-[#1E7145] shrink-0" />
                    {f}
                  </div>
                ))}
              </CardContent>
              <CardFooter className="pt-4">
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-[#1F4E79] text-[#1F4E79] hover:bg-[#1F4E79]/5 rounded-xl h-11 font-semibold"
                >
                  <Link href="/register">Comecar trial gratis</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Anual */}
            <Card className="border-2 border-[#1F4E79] rounded-2xl shadow-lg relative bg-white">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-[#BF4700] text-white border-0 px-4 py-1.5 text-xs font-bold shadow-md">
                  Mais popular &mdash; Poupa 27%
                </Badge>
              </div>
              <CardHeader className="pb-4 pt-8">
                <p className="text-xs font-bold text-[#1F4E79] uppercase tracking-widest">Anual</p>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-5xl font-extrabold text-gray-900">79</span>
                  <span className="text-gray-500 text-lg">/ano</span>
                </div>
                <p className="text-xs text-[#1E7145] font-semibold mt-1">
                  Equivale a €6,58/mes &mdash; 2 meses gratis
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Tudo do plano mensal",
                  "2 meses gratis",
                  "Suporte prioritario",
                  "Acesso antecipado a novas features",
                  "Historico ilimitado",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-3 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-[#1E7145] shrink-0" />
                    {f}
                  </div>
                ))}
              </CardContent>
              <CardFooter className="pt-4 flex-col gap-3">
                <Button asChild className="w-full bg-[#1F4E79] hover:bg-[#2E75B6] rounded-xl h-11 font-bold shadow-sm transition-colors">
                  <Link href="/register">
                    Comecar trial gratis
                    <ArrowRight className="ml-1.5 w-4 h-4" />
                  </Link>
                </Button>
                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
                  <Shield className="w-3.5 h-3.5 text-[#1E7145]" />
                  Garantia de reembolso de 30 dias
                </div>
              </CardFooter>
            </Card>
          </div>

          <p className="text-center text-sm text-gray-400 mt-8">
            14 dias gratis &nbsp;&middot;&nbsp; Sem cartao de credito
            &nbsp;&middot;&nbsp; Cancela quando quiseres
          </p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
              Perguntas frequentes
            </h2>
            <p className="text-gray-600">Tens uma duvida que nao esta aqui? Envia-nos um email.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Os numeros que mostras sao reais?",
                a: "Sim. Os calculos baseiam-se nas taxas legais de 2026: IVA 23%, coeficiente regime simplificado 0,75, IRS estimado 22%, SS 21,4% sobre 70% da base de rendimentos. Para situacoes especificas (deducoes, despesas comprovadas, regime organizado) o valor exato pode variar — e aqui que um contabilista ajuda.",
              },
              {
                q: "E realmente gratuito por 14 dias?",
                a: "Sim. Tens acesso completo a todas as funcionalidades durante 14 dias, sem precisares de inserir cartao de credito. Se nao continuares, a conta simplesmente expira.",
              },
              {
                q: "Funciona se estiver isento de IVA (Art. 53.o)?",
                a: "Sim. Na configuracao fiscal podes activar 'Isento de IVA'. O calculo ajusta-se automaticamente: o IVA e removido, e so calculas IRS e SS. O limite de isenção e €15.000/ano em clientes nacionais.",
              },
              {
                q: "E se o meu cliente ja retiver o IRS na fonte?",
                a: "Tambem esta coberto. Activas a opcao 'Retencao na fonte' e o FreelancerPT remove o IRS do calculo — porque o teu cliente ja pagou por ti. So precisas de guardar IVA e SS.",
              },
              {
                q: "Os calculos estao atualizados para 2026?",
                a: "Sim. Todas as taxas e regras (IVA 23%, coeficiente simplificado 75%, IRS estimado 22%, SS 21,4% x 70%) estao verificadas para 2026. O calendario fiscal inclui todos os prazos do ano.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
              >
                <h3 className="font-bold text-gray-900 mb-2 flex items-start gap-2">
                  <span className="text-[#1F4E79] font-extrabold shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.q}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed pl-8">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#1a1a2e] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#BF4700]/10 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#1E7145]/10 translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-3xl mx-auto px-6 text-center space-y-7">
          {/* Urgency */}
          <div className="inline-flex items-center gap-2 bg-[#BF4700]/20 border border-[#BF4700]/30 rounded-full px-5 py-2">
            <Timer className="w-4 h-4 text-[#BF4700]" />
            <span className="text-[#BF4700] font-bold text-sm">Proximo prazo IVA: 20 Agosto &mdash; 72 dias</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight">
            Cada dia sem controlo e mais dinheiro{" "}
            <span className="text-[#BF4700]">que o Estado vai cobrar</span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Nao esperes pela carta das Financas.
            Junta-te a +340 freelancers que ja sabem exatamente o que guardar.
            14 dias gratis, sem cartao de credito.
          </p>

          <div className="flex justify-center -space-x-2 mb-2">
            {[
              { initials: "AM", color: "bg-[#2E75B6]" },
              { initials: "RC", color: "bg-[#1E7145]" },
              { initials: "FS", color: "bg-[#BF4700]" },
              { initials: "LB", color: "bg-white/20" },
            ].map((a) => <Avatar key={a.initials} {...a} />)}
          </div>

          <Button
            asChild
            size="lg"
            className="bg-[#BF4700] hover:bg-[#BF4700]/90 text-white text-base h-14 px-10 font-extrabold rounded-xl shadow-xl transition-colors"
          >
            <Link href="/register">
              Calcular o meu liquido real agora
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <p className="text-gray-500 text-sm">
            Sem cartao de credito &nbsp;&middot;&nbsp; 14 dias gratis
            &nbsp;&middot;&nbsp; Cancela quando quiseres
          </p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-800 py-10 bg-[#0f0f1a]">

        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#1F4E79] flex items-center justify-center">
                  <span className="text-white font-extrabold text-sm">F</span>
                </div>
                <span className="font-extrabold text-white text-lg">FreelancerPT</span>
              </div>
              <p className="text-xs text-gray-500 max-w-xs">
                Gestao fiscal automatica para freelancers em Portugal.
                Feito com carinho por imigrantes, para imigrantes.
              </p>
            </div>

            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos</a>
              <a href="mailto:hello@freelancerpt.app" className="hover:text-white transition-colors">Contacto</a>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-600">
            &copy; 2026 FreelancerPT &nbsp;&middot;&nbsp; Feito em Portugal para freelancers imigrantes
            &nbsp;&middot;&nbsp; Nao somos consultores fiscais &mdash; para situacoes complexas, consulta um contabilista certificado.
          </div>
        </div>
      </footer>
    </div>
  );
}
