"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  calcularFatura,
  formatEuro,
  type ConfiguracaoFiscal,
} from "@/lib/calculos-fiscais";
import {
  Info,
  TrendingDown,
  Wallet,
  Share2,
  CheckCircle,
  ChevronDown,
} from "lucide-react";

export function Calculadora() {
  const [valorInput, setValorInput] = useState("");
  const [config, setConfig] = useState<ConfiguracaoFiscal>({
    regime: "simplificado",
    ivaIsento: false,
    temRetencao: false,
    isencaoPrimeiroAnoSS: false,
  });
  const [showShareText, setShowShareText] = useState(false);
  const [copied, setCopied] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);

  const valorBase = useMemo(() => {
    const n = parseFloat(valorInput.replace(",", "."));
    return isNaN(n) || n < 0 ? 0 : n;
  }, [valorInput]);

  const resultado = useMemo(
    () => calcularFatura(valorBase, config),
    [valorBase, config]
  );

  const toggle = (key: keyof ConfiguracaoFiscal) =>
    setConfig((prev) => ({ ...prev, [key]: !prev[key] }));

  const hasValue = valorBase > 0;

  const shareText = hasValue
    ? `FreelancerPT — Resumo da minha fatura\n\n` +
      `💶 Fatura emitida: ${formatEuro(resultado.totalFatura)}\n` +
      (!config.ivaIsento
        ? `🔴 IVA a devolver ao Estado: ${formatEuro(resultado.ivaGuardar)}\n`
        : "") +
      (!config.temRetencao
        ? `🟡 IRS a guardar: ${formatEuro(resultado.irsGuardar)}\n`
        : `🔵 IRS retido pelo cliente\n`) +
      (!config.isencaoPrimeiroAnoSS
        ? `🟡 SS a guardar: ${formatEuro(resultado.ssGuardar)}\n`
        : "") +
      `📦 Total a reservar: ${formatEuro(resultado.totalGuardar)} (${resultado.percentagemGuardar}%)\n` +
      `✅ Liquido real (teu): ${formatEuro(resultado.liquidoReal)}\n\n` +
      `Calculado com FreelancerPT.app`
    : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Card className="w-full max-w-lg shadow-2xl border-0 bg-white rounded-2xl overflow-hidden">
      {/* Top gradient bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#1F4E79] via-[#2E75B6] to-[#1E7145]" />

      <CardHeader className="pb-3 pt-6 px-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-[#1F4E79] flex items-center justify-center shadow-sm">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg text-[#1F4E79] leading-tight">
              Calculadora de Fatura
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Regime simplificado &middot; Atualizado 2026
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 px-6 pb-6">
        {/* Input do valor */}
        <div className="space-y-2">
          <Label
            htmlFor="valor"
            className="text-sm font-semibold text-gray-700"
          >
            Valor base da fatura
            <span className="text-gray-400 font-normal ml-1">(sem IVA)</span>
          </Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-lg pointer-events-none">
              &euro;
            </span>
            <Input
              id="valor"
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              value={valorInput}
              onChange={(e) => setValorInput(e.target.value)}
              className="pl-9 text-xl font-bold h-14 border-gray-200 rounded-xl focus-visible:ring-[#1F4E79] focus-visible:border-[#1F4E79] bg-gray-50"
            />
          </div>
        </div>

        {/* Configuração colapsável */}
        <div className="border border-gray-100 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setConfigOpen((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <span>Configuração fiscal</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                configOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {configOpen && (
            <div className="space-y-0 divide-y divide-gray-100 px-4 py-2 bg-white">
              {[
                {
                  id: "ivaIsento",
                  key: "ivaIsento" as keyof ConfiguracaoFiscal,
                  label: "Isento de IVA",
                  desc: "Art. 53. — faturacao <= 15.000/ano",
                },
                {
                  id: "temRetencao",
                  key: "temRetencao" as keyof ConfiguracaoFiscal,
                  label: "Cliente aplica retencao na fonte",
                  desc: "Cliente com contabilidade organizada",
                },
                {
                  id: "isencaoSS",
                  key: "isencaoPrimeiroAnoSS" as keyof ConfiguracaoFiscal,
                  label: "Isencao SS (1.o ano)",
                  desc: "Automatica nos primeiros 12 meses",
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3"
                >
                  <div className="space-y-0.5 pr-4">
                    <Label
                      htmlFor={item.id}
                      className="text-sm font-medium cursor-pointer text-gray-800"
                    >
                      {item.label}
                    </Label>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                  <Switch
                    id={item.id}
                    checked={config[item.key] as boolean}
                    onCheckedChange={() => toggle(item.key)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resultado */}
        <div
          className={`space-y-3 transition-all duration-300 ${
            hasValue ? "opacity-100" : "opacity-30 pointer-events-none select-none"
          }`}
        >
          {/* Linha total fatura */}
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">Total faturado ao cliente</span>
            <span className="font-semibold text-gray-900 text-base">
              {formatEuro(resultado.totalFatura)}
            </span>
          </div>

          {/* Blocos a guardar */}
          <div className="space-y-2">
            {!config.ivaIsento && (
              <div className="flex justify-between items-center bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      IVA &mdash; devolves ao Estado
                    </p>
                    <p className="text-xs text-gray-500">23% do valor base</p>
                  </div>
                </div>
                <span className="font-bold text-red-700 text-base">
                  {formatEuro(resultado.ivaGuardar)}
                </span>
              </div>
            )}

            {!config.temRetencao && (
              <div className="flex justify-between items-center bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      IRS &mdash; reservar agora
                    </p>
                    <p className="text-xs text-gray-500">~22% estimado</p>
                  </div>
                </div>
                <span className="font-bold text-amber-700 text-base">
                  {formatEuro(resultado.irsGuardar)}
                </span>
              </div>
            )}

            {config.temRetencao && (
              <div className="flex justify-between items-center bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      IRS retido pelo cliente
                    </p>
                    <p className="text-xs text-gray-500">Nao precisas guardar</p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="text-xs bg-blue-100 text-blue-700 border-0"
                >
                  incluido
                </Badge>
              </div>
            )}

            {!config.isencaoPrimeiroAnoSS && (
              <div className="flex justify-between items-center bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-400 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Seguranca Social
                    </p>
                    <p className="text-xs text-gray-500">21,4% x 70% da base</p>
                  </div>
                </div>
                <span className="font-bold text-amber-700 text-base">
                  {formatEuro(resultado.ssGuardar)}
                </span>
              </div>
            )}
          </div>

          {/* Total a guardar */}
          <div className="flex justify-between items-center bg-gray-100 rounded-xl px-4 py-3.5">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-semibold text-gray-700">
                Total a reservar
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-gray-900 text-base">
                {formatEuro(resultado.totalGuardar)}
              </span>
              {hasValue && (
                <Badge
                  variant="outline"
                  className="text-xs border-gray-300 text-gray-500"
                >
                  {resultado.percentagemGuardar}%
                </Badge>
              )}
            </div>
          </div>

          {/* Liquido real card */}
          <div className="rounded-2xl bg-[#1E7145] px-5 py-5 shadow-lg ring-2 ring-[#1E7145]/30">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-green-200 font-semibold uppercase tracking-widest">
                  Liquido real
                </p>
                <p className="text-white/70 text-xs mt-1">
                  Este e o dinheiro realmente teu
                </p>
              </div>
              <span className="text-3xl font-extrabold text-white tabular-nums">
                {formatEuro(resultado.liquidoReal)}
              </span>
            </div>
          </div>

          {/* Partilhar resultado */}
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowShareText((v) => !v)}
              className="w-full border-gray-200 text-gray-600 hover:text-[#1F4E79] hover:border-[#1F4E79] gap-2 rounded-xl"
            >
              <Share2 className="w-4 h-4" />
              Partilhar resultado
            </Button>

            {showShareText && (
              <div className="relative">
                <pre className="text-xs bg-gray-50 border border-gray-200 rounded-xl p-4 whitespace-pre-wrap leading-relaxed text-gray-700 font-mono">
                  {shareText}
                </pre>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCopy}
                  className="absolute top-2 right-2 h-7 text-xs bg-[#1F4E79] hover:bg-[#1F4E79]/90 gap-1.5"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-3 h-3" />
                      Copiado!
                    </>
                  ) : (
                    "Copiar"
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="flex gap-2.5 p-3.5 bg-[#1F4E79]/5 rounded-xl border border-[#1F4E79]/10">
            <Info className="w-4 h-4 text-[#2E75B6] mt-0.5 shrink-0" />
            <p className="text-xs text-[#1F4E79]/80 leading-relaxed">
              IRS estimado para faturacao anual ~33.600, regime simplificado.
              O valor exato depende das tuas deducoes e total anual.
            </p>
          </div>
        </div>

        {!hasValue && (
          <div className="text-center py-6 text-gray-400 text-sm">
            <Wallet className="w-8 h-8 mx-auto mb-2 opacity-30" />
            Insere o valor da fatura para ver o calculo
          </div>
        )}
      </CardContent>
    </Card>
  );
}
