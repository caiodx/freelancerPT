// ============================================================
// CÁLCULOS FISCAIS — FreelancerPT.app
// Regras verificadas para 2026 | Regime Simplificado
// ============================================================

export interface ConfiguracaoFiscal {
  regime: "simplificado" | "organizada";
  ivaIsento: boolean;       // Art. 53.º (≤€15k/ano) ou Art. 9.º
  temRetencao: boolean;     // cliente tem contabilidade organizada E faturação > €15k/ano
  isencaoPrimeiroAnoSS: boolean; // isenção automática nos primeiros 12 meses
}

export interface ResultadoCalculo {
  valorBase: number;
  valorIVA: number;
  totalFatura: number;
  // O que guardar
  ivaGuardar: number;
  irsGuardar: number;
  ssGuardar: number;
  totalGuardar: number;
  percentagemGuardar: number;
  // O que fica
  liquidoReal: number;
}

// ---- Constantes fiscais 2026 ----
const TAXA_IVA = 0.23;
const COEFICIENTE_SIMPLIFICADO = 0.75; // 75% da base é tributável
const TAXA_IRS_ESTIMADA = 0.22;        // estimativa conservadora para ~€33.600/ano
const TAXA_SS = 0.214;                 // 21.4%
const BASE_SS = 0.70;                  // incide sobre 70% dos rendimentos

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

  // IVA: 100% é do Estado — guardar tudo
  const ivaGuardar = valorIVA;

  // IRS: só guardar se NÃO há retenção na fonte
  // (se há retenção, o cliente já descontou — não guardar de novo)
  const irsGuardar = config.temRetencao
    ? 0
    : arredondar(valorBase * TAXA_IRS_ESTIMADA);

  // SS: 21.4% sobre 70% da base — dispensado no 1.º ano
  const ssGuardar = config.isencaoPrimeiroAnoSS
    ? 0
    : arredondar(valorBase * BASE_SS * TAXA_SS);

  const totalGuardar = ivaGuardar + irsGuardar + ssGuardar;
  const liquidoReal = arredondar(totalFatura - totalGuardar);
  const percentagemGuardar = totalFatura > 0
    ? Math.round((totalGuardar / totalFatura) * 100)
    : 0;

  return {
    valorBase,
    valorIVA,
    totalFatura,
    ivaGuardar,
    irsGuardar,
    ssGuardar,
    totalGuardar,
    percentagemGuardar,
    liquidoReal,
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

// ---- Calendário fiscal 2026 ----
export interface PrazoFiscal {
  label: string;
  data: Date;
  tipo: "iva" | "irs" | "ss";
  descricao: string;
}

export function getPrazosFiscais2026(): PrazoFiscal[] {
  return [
    {
      label: "IVA Q1 2026",
      data: new Date("2026-05-20"),
      tipo: "iva",
      descricao: "Declaração periódica Jan-Mar 2026. Pagamento até 25 Mai.",
    },
    {
      label: "IVA Q2 2026",
      data: new Date("2026-08-20"),
      tipo: "iva",
      descricao: "Declaração periódica Abr-Jun 2026. Pagamento até 25 Ago.",
    },
    {
      label: "IVA Q3 2026",
      data: new Date("2026-11-20"),
      tipo: "iva",
      descricao: "Declaração periódica Jul-Set 2026. Pagamento até 25 Nov.",
    },
    {
      label: "IVA Q4 2026",
      data: new Date("2027-02-20"),
      tipo: "iva",
      descricao: "Declaração periódica Out-Dez 2026. Pagamento até 25 Fev.",
    },
    {
      label: "IRS — Modelo 3",
      data: new Date("2027-06-30"),
      tipo: "irs",
      descricao: "Declaração anual dos rendimentos de 2026. Anexo B obrigatório.",
    },
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
