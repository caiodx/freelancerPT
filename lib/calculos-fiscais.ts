// ============================================================
// CALCULOS FISCAIS — FreelancerPT.app
// Regras verificadas para 2026 | Regime Simplificado
// ============================================================

export interface ConfiguracaoFiscal {
  regime: "simplificado" | "organizada";
  ivaIsento: boolean;
  temRetencao: boolean;
  isencaoPrimeiroAnoSS: boolean;
}

export interface ResultadoCalculo {
  valorBase: number;
  valorIVA: number;
  totalFatura: number;
  ivaGuardar: number;
  irsGuardar: number;
  ssGuardar: number;
  totalGuardar: number;
  percentagemGuardar: number;
  liquidoReal: number;
}

// ---- Constantes fiscais 2026 ----
const TAXA_IVA = 0.23;
const COEFICIENTE_SIMPLIFICADO = 0.75;
const TAXA_IRS_ESTIMADA = 0.22;
const TAXA_SS = 0.214;
const BASE_SS = 0.70;

export function calcularFatura(
  valorBase: number,
  config: ConfiguracaoFiscal
): ResultadoCalculo {
  if (valorBase <= 0) {
    return {
      valorBase: 0, valorIVA: 0, totalFatura: 0,
      ivaGuardar: 0, irsGuardar: 0, ssGuardar: 0,
      totalGuardar: 0, percentagemGuardar: 0, liquidoReal: 0,
    };
  }

  const valorIVA = config.ivaIsento
    ? 0
    : arredondar(valorBase * TAXA_IVA);

  const totalFatura = valorBase + valorIVA;
  const ivaGuardar = valorIVA;

  // IRS: taxa estimada sobre rendimento tributavel (base x coeficiente 0.75)
  // Regime simplificado: rendimento tributavel = valorBase x 0.75
  const irsGuardar = config.temRetencao
    ? 0
    : arredondar(valorBase * COEFICIENTE_SIMPLIFICADO * TAXA_IRS_ESTIMADA);

  const ssGuardar = config.isencaoPrimeiroAnoSS
    ? 0
    : arredondar(valorBase * BASE_SS * TAXA_SS);

  const totalGuardar = ivaGuardar + irsGuardar + ssGuardar;
  const liquidoReal = arredondar(totalFatura - totalGuardar);
  const percentagemGuardar = totalFatura > 0
    ? Math.round((totalGuardar / totalFatura) * 100)
    : 0;

  return {
    valorBase, valorIVA, totalFatura,
    ivaGuardar, irsGuardar, ssGuardar,
    totalGuardar, percentagemGuardar, liquidoReal,
  };
}

function arredondar(n: number): number {
  return Math.round(n * 100) / 100;
}

export function formatEuro(value: number): string {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
}

// ---- Calendario fiscal 2026 ----
export interface PrazoFiscal {
  label: string;
  data: Date;
  tipo: "iva" | "irs" | "ss";
  descricao: string;
}

export function getPrazosFiscais2026(): PrazoFiscal[] {
  // SS mensal: pagamento entre dia 10-20 de cada mes
  const mesesSS = [
    { mes: "Jan", data: "2026-01-20" },
    { mes: "Fev", data: "2026-02-20" },
    { mes: "Mar", data: "2026-03-20" },
    { mes: "Abr", data: "2026-04-20" },
    { mes: "Mai", data: "2026-05-20" },
    { mes: "Jun", data: "2026-06-20" },
    { mes: "Jul", data: "2026-07-20" },
    { mes: "Ago", data: "2026-08-20" },
    { mes: "Set", data: "2026-09-20" },
    { mes: "Out", data: "2026-10-20" },
    { mes: "Nov", data: "2026-11-20" },
    { mes: "Dez", data: "2026-12-20" },
  ];

  const prazosSS: PrazoFiscal[] = mesesSS.map(({ mes, data }) => ({
    label: `SS ${mes} 2026`,
    data: new Date(data),
    tipo: "ss" as const,
    descricao: `Seguranca Social referente a ${mes} 2026. Pagar entre dia 10-20.`,
  }));

  return [
    {
      label: "IVA Q1 2026",
      data: new Date("2026-05-20"),
      tipo: "iva",
      descricao: "Declaracao periodica Jan-Mar 2026. Pagamento ate 25 Mai.",
    },
    {
      label: "IVA Q2 2026",
      data: new Date("2026-08-20"),
      tipo: "iva",
      descricao: "Declaracao periodica Abr-Jun 2026. Pagamento ate 25 Ago.",
    },
    {
      label: "IVA Q3 2026",
      data: new Date("2026-11-20"),
      tipo: "iva",
      descricao: "Declaracao periodica Jul-Set 2026. Pagamento ate 25 Nov.",
    },
    {
      label: "IVA Q4 2026",
      data: new Date("2027-02-20"),
      tipo: "iva",
      descricao: "Declaracao periodica Out-Dez 2026. Pagamento ate 25 Fev.",
    },
    {
      label: "IRS — Modelo 3",
      data: new Date("2027-06-30"),
      tipo: "irs",
      descricao: "Declaracao anual dos rendimentos de 2026. Anexo B obrigatorio. Pode pagar em ate 36 prestacoes mensais se nao tiver o valor todo.",
    },
    ...prazosSS,
  ];
}

export function diasAteProximoPrazo(tipo: "iva" | "irs" | "ss"): number {
  const hoje = new Date();
  const prazos = getPrazosFiscais2026().filter((p) => p.tipo === tipo);
  const futuros = prazos
    .filter((p) => p.data > hoje)
    .sort((a, b) => a.data.getTime() - b.data.getTime());
  if (futuros.length === 0) return -1;
  const diff = futuros[0].data.getTime() - hoje.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
