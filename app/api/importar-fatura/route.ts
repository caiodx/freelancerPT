import { NextRequest, NextResponse } from "next/server";

function parseNum(s: string): number {
  // "2.800,00" → 2800.00
  return parseFloat(s.replace(/\./g, "").replace(",", "."));
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("pdf") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Ficheiro não encontrado" }, { status: 400 });
  }

  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "Apenas ficheiros PDF são suportados" }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pdfParse = require("pdf-parse");
    const { text }: { text: string } = await pdfParse(buffer);

    // ── Número da fatura ─────────────────────────────────────────────────
    // "Fatura-Recibo <FR ATSIRE01FR/17>"
    const numeroMatch = text.match(/Fatura-Recibo\s*<\s*(FR[^>]+)>/i);
    const numero = numeroMatch?.[1]?.trim() ?? null;

    // ── Data de emissão ───────────────────────────────────────────────────
    // "emitida em 05/06/2026"
    const dataMatch = text.match(/emitida em\s*(\d{2}\/\d{2}\/\d{4})/i);
    const data_fatura = dataMatch?.[1]
      ? dataMatch[1].split("/").reverse().join("-") // dd/mm/yyyy → yyyy-mm-dd
      : null;

    // ── TOTAIS DO DOCUMENTO ───────────────────────────────────────────────
    //
    // O PDF da AT tem layout de 2 colunas. Após extracção de texto a estrutura é:
    //
    //   TOTAIS DO DOCUMENTO          ← âncora
    //   Valor ilíquido               ← label 1
    //    IVA                         ← label 2
    //   Imposto do Selo              ← label 3
    //   TOTAL DO DOCUMENTO           ← label 4
    //   Retenção na fonte IRS        ← label 5
    //   TOTAL A PAGAR                ← label 6
    //   2.800,00 €                   ← valor 1 (base)
    //   644,00 €                     ← valor 2 (iva)
    //   0,00 €                       ← valor 3 (selo)
    //   3.444,00 €                   ← valor 4 (total doc)
    //   0,00 €                       ← valor 5 (retencao)
    //   3.444,00 €                   ← valor 6 (total pagar)
    //
    // Estratégia: encontrar a secção e extrair valores por ordem ordinal.

    const totaisIdx = text.indexOf("TOTAIS DO DOCUMENTO");
    if (totaisIdx === -1) {
      return NextResponse.json(
        { error: "Secção 'TOTAIS DO DOCUMENTO' não encontrada. Confirma que é uma Fatura-Recibo da AT." },
        { status: 422 }
      );
    }

    // Extrair apenas a primeira página de totais (antes do duplicado \f)
    const primeiraPagina = text.slice(0, text.indexOf("\f") > -1 ? text.indexOf("\f") : undefined);
    const totaisSection = primeiraPagina.slice(primeiraPagina.indexOf("TOTAIS DO DOCUMENTO"));

    // Todos os valores monetários na secção, em ordem
    const amounts = Array.from(totaisSection.matchAll(/([\d.]+,\d{2})\s*€/g)).map((m) =>
      parseNum(m[1])
    );

    // Posições fixas na AT Fatura-Recibo:
    // [0] = Valor ilíquido (base s/IVA)
    // [1] = IVA
    // [2] = Imposto do Selo
    // [3] = TOTAL DO DOCUMENTO
    // [4] = Retenção na fonte IRS
    // [5] = TOTAL A PAGAR
    const valor_base   = amounts[0] ?? null;
    const valor_iva    = amounts[1] ?? null;
    const valor_total  = amounts[3] ?? null;
    const retencao_irs = amounts[4] ?? 0;

    if (!valor_base) {
      return NextResponse.json(
        {
          error:
            "Não foi possível extrair os valores. Confirma que é uma Fatura-Recibo emitida pelo Portal das Finanças (AT).",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      numero,
      data_fatura,
      valor_base,
      valor_iva,
      valor_total,
      retencao_irs,
    });
  } catch (err: unknown) {
    console.error("[importar-fatura]", err);
    return NextResponse.json(
      { error: "Erro ao processar o PDF. Tenta novamente." },
      { status: 500 }
    );
  }
}
