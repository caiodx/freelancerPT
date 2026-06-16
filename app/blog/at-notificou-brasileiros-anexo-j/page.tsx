import type { Metadata } from "next";
import Link from "next/link";
import { Calculadora } from "@/components/Calculadora";

export const metadata: Metadata = {
  title: "A AT notificou você sobre o Anexo J — o que fazer agora?",
  description:
    "Recebeu uma notificação da Autoridade Tributária sobre rendimentos no exterior (Anexo J)? Calma. Aqui está o que significa, o que fazer e como evitar multas.",
  openGraph: {
    title: "A AT notificou você sobre o Anexo J — o que fazer agora?",
    description:
      "Recebeu uma notificação da AT sobre rendimentos no exterior? Explico tudo em brasileiro e sem juridiquês.",
    type: "article",
    publishedTime: "2026-06-16",
    authors: ["Caio — FreelancerPT"],
  },
};

export default function ArtigoAnexoJ() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-[#1F4E79] text-lg">
            FreelancerPT
          </Link>
          <Link
            href="/#precos"
            className="bg-[#1F4E79] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#2E75B6] transition-colors"
          >
            Testar grátis 14 dias
          </Link>
        </div>
      </nav>

      {/* Barra urgência */}
      <div className="bg-[#BF4700] text-white text-center text-sm font-medium py-2 px-4">
        ⚠️ Junho 2026: AT notificou +6.000 brasileiros sobre rendimentos no exterior. Leia isso agora.
      </div>

      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span>FreelancerPT</span>
            <span>·</span>
            <time dateTime="2026-06-16">16 de junho de 2026</time>
            <span>·</span>
            <span>8 min de leitura</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
            A AT notificou você sobre o Anexo J — o que fazer agora?
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Recebeu uma notificação da Autoridade Tributária sobre "rendimentos
            obtidos no exterior"? Não entre em pânico. Aqui está o que significa,
            o que você precisa fazer e como evitar multas.
          </p>
        </div>

        {/* Caixa de alerta */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-lg mb-10">
          <p className="font-semibold text-amber-900 mb-1">
            🇧🇷 Este artigo é para você se:
          </p>
          <ul className="text-amber-800 space-y-1 text-sm">
            <li>• Mora e trabalha em Portugal em recibos verdes</li>
            <li>• Tem ou teve rendimentos no Brasil (aluguel, INSS, freela para empresa brasileira)</li>
            <li>• Recebeu um email ou notificação no Portal das Finanças</li>
            <li>• Não faz ideia do que é o "Anexo J"</li>
          </ul>
        </div>

        {/* Conteúdo */}
        <div className="prose prose-lg max-w-none text-gray-700 space-y-8">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              O que é o Anexo J afinal?
            </h2>
            <p>
              Em Portugal, o IRS (equivalente ao IRPF brasileiro) não é só sobre
              o que você ganha aqui. Se você é residente fiscal em Portugal e tem
              rendimentos <em>fora</em> de Portugal — seja um aluguel no Brasil,
              pensão do INSS, dividendos ou freelas para empresa brasileira — você
              tem obrigação de declará-los.
            </p>
            <p>
              O <strong>Anexo J</strong> é o formulário dentro do IRS português
              onde você declara esses rendimentos do exterior. Ele existe para
              evitar dupla tributação, mas também para garantir que a AT saiba
              tudo que você recebe globalmente.
            </p>
            <p>
              A boa notícia: ter rendimentos no exterior não significa pagar
              imposto duas vezes. Portugal tem acordos com o Brasil para evitar
              isso. Mas você <strong>precisa declarar</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Por que a AT está notificando brasileiros agora?
            </h2>
            <p>
              Em junho de 2026, a AT enviou notificações eletrônicas a mais de
              6.000 brasileiros residentes em Portugal. A mensagem, em resumo,
              diz: <em>"Sabemos que você tem ou teve rendimentos ou contas no
              Brasil. Você precisa declarar isso no seu IRS."</em>
            </p>
            <p>
              Isso não é uma acusação. É um aviso preventivo. A AT cruzou
              informações com o sistema de troca automática de dados fiscais entre
              países (o chamado CRS — Common Reporting Standard), que inclui o
              Brasil desde 2018.
            </p>
            <p>
              Ou seja: a AT <strong>já sabe</strong> que você tem vínculos
              financeiros no Brasil. A notificação é uma oportunidade para você
              regularizar antes de ser autuado.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Preciso me preocupar?
            </h2>
            <p>Depende da sua situação:</p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-5 my-4">
              <p className="font-semibold text-green-800 mb-2">✅ Você está tranquilo se:</p>
              <ul className="text-green-700 space-y-1 text-sm">
                <li>• Já declarou esses rendimentos no Modelo 3 (IRS) dos anos anteriores</li>
                <li>• Não tem rendimentos no Brasil (conta zerada, sem aluguel, sem INSS ativo)</li>
                <li>• Saiu do Brasil com declaração de saída definitiva e encerrou tudo</li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-5 my-4">
              <p className="font-semibold text-red-800 mb-2">⚠️ Você precisa agir se:</p>
              <ul className="text-red-700 space-y-1 text-sm">
                <li>• Recebeu aluguel de imóvel no Brasil e nunca declarou em Portugal</li>
                <li>• Continua recebendo INSS ou pensão do Brasil</li>
                <li>• Fez freelas para empresa brasileira e recebeu em conta brasileira</li>
                <li>• Tem investimentos ou conta com saldo relevante no Brasil</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              O que fazer agora — passo a passo
            </h2>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#1F4E79] text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <p className="font-semibold text-gray-900">Acesse o Portal das Finanças</p>
                  <p className="text-gray-600 text-sm mt-1">
                    Entre em <strong>portaldasfinancas.gov.pt</strong> com o seu NIF e senha.
                    Vá em "Notificações" para ver exatamente o que a AT está pedindo.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#1F4E79] text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <p className="font-semibold text-gray-900">Levante o que recebeu no exterior</p>
                  <p className="text-gray-600 text-sm mt-1">
                    Reúna comprovantes: extrato bancário brasileiro, comprovante de aluguel,
                    declaração de INSS, recibos de pagamento de empresas brasileiras.
                    Você vai precisar dos valores em euros (conversão pela taxa do Banco de Portugal na data).
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#1F4E79] text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <p className="font-semibold text-gray-900">Consulte um contabilista certificado</p>
                  <p className="text-gray-600 text-sm mt-1">
                    Para o Anexo J especificamente, recomendamos fortemente um profissional.
                    O custo de uma regularização voluntária é sempre menor do que uma autuação.
                    Um contabilista com experiência em imigrantes cobra geralmente €150–€300 para fazer a declaração.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#1F4E79] text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                <div>
                  <p className="font-semibold text-gray-900">Entregue a declaração substitutiva (se necessário)</p>
                  <p className="text-gray-600 text-sm mt-1">
                    Se os anos anteriores estão incorretos, você pode submeter uma "declaração
                    de substituição" corrigindo o erro. Feito antes de qualquer processo de
                    fiscalização, as multas são muito menores ou inexistentes.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Quanto posso ser multado se não fizer nada?
            </h2>
            <p>
              Se a AT abrir um processo de fiscalização e descobrir rendimentos não
              declarados, as consequências podem ser:
            </p>
            <div className="bg-gray-50 rounded-lg p-5 my-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white rounded p-4 border">
                  <p className="text-2xl font-bold text-red-600">€375</p>
                  <p className="text-sm text-gray-600 mt-1">Multa mínima por falta de declaração</p>
                </div>
                <div className="bg-white rounded p-4 border">
                  <p className="text-2xl font-bold text-red-600">€22.500</p>
                  <p className="text-sm text-gray-600 mt-1">Multa máxima em casos graves</p>
                </div>
                <div className="bg-white rounded p-4 border">
                  <p className="text-2xl font-bold text-red-600">+ imposto</p>
                  <p className="text-sm text-gray-600 mt-1">+ juros de mora sobre o valor devido</p>
                </div>
              </div>
            </div>
            <p>
              Regularizar voluntariamente agora custa muito menos — em dinheiro e em
              stress — do que esperar a AT bater à porta.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              E os meus recibos verdes em Portugal? Estou organizado?
            </h2>
            <p>
              O Anexo J é sobre rendimentos do exterior. Mas enquanto você está aqui,
              há outro problema muito comum: brasileiros em recibos verdes que não
              guardam o dinheiro certo para pagar IVA, IRS e Segurança Social.
            </p>
            <p>
              O resultado? Em abril (acerto do IRS) ou em maio (IVA do Q1) chegam
              contas de €2.000–€5.000 que o freelancer não tem guardadas. Usam o
              cartão de crédito. Ficam no vermelho. O ciclo se repete.
            </p>
            <p>
              Use a calculadora abaixo para saber exatamente quanto guardar de cada
              fatura que você emitir:
            </p>
          </section>
        </div>

        {/* Calculadora embed */}
        <div className="my-12 border-2 border-[#1F4E79]/20 rounded-2xl overflow-hidden">
          <div className="bg-[#1F4E79] text-white text-center py-4 px-6">
            <p className="font-bold text-lg">🧮 Calculadora Fiscal — FreelancerPT</p>
            <p className="text-sm text-blue-100 mt-1">
              Descubra quanto é seu líquido real e quanto guardar de cada fatura
            </p>
          </div>
          <div className="p-6 bg-gray-50">
            <Calculadora />
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-[#1F4E79] to-[#2E75B6] rounded-2xl p-8 text-white text-center my-12">
          <h2 className="text-2xl font-bold mb-3">
            Pare de ser surpreendido pelo fisco
          </h2>
          <p className="text-blue-100 mb-6 max-w-md mx-auto">
            O FreelancerPT calcula automaticamente IVA, IRS e SS de cada fatura
            e guarda o dinheiro certo para cada imposto. Nunca mais chega conta
            que você não esperava.
          </p>
          <Link
            href="/#precos"
            className="inline-block bg-white text-[#1F4E79] font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors"
          >
            Testar grátis por 14 dias — sem cartão
          </Link>
          <p className="text-blue-200 text-sm mt-3">€9/mês depois do trial. Cancele quando quiser.</p>
        </div>

        {/* FAQ */}
        <div className="space-y-6 my-12">
          <h2 className="text-2xl font-bold text-gray-900">Perguntas frequentes</h2>

          <div className="border-b pb-5">
            <p className="font-semibold text-gray-900 mb-2">
              Tenho conta no Brasil mas está zerada. Preciso declarar?
            </p>
            <p className="text-gray-600 text-sm">
              Geralmente não, se o saldo for irrelevante e não houver movimentação de rendimentos.
              Mas confirme com um contabilista — o limite técnico é baixo.
            </p>
          </div>

          <div className="border-b pb-5">
            <p className="font-semibold text-gray-900 mb-2">
              Vou pagar imposto em Portugal E no Brasil sobre o mesmo dinheiro?
            </p>
            <p className="text-gray-600 text-sm">
              Portugal e Brasil têm uma Convenção para Evitar a Dupla Tributação desde 2000.
              Na prática, você declara nos dois países mas usa crédito de imposto para
              não pagar duas vezes. Um contabilista sabe como aplicar isso corretamente.
            </p>
          </div>

          <div className="border-b pb-5">
            <p className="font-semibold text-gray-900 mb-2">
              Posso regularizar anos anteriores sem multa?
            </p>
            <p className="text-gray-600 text-sm">
              Sim, através de declaração de substituição. Feita <em>antes</em> de qualquer
              notificação de fiscalização formal, as multas são reduzidas (75-90% de redução
              em casos de regularização voluntária). Aja antes que eles abram processo.
            </p>
          </div>

          <div className="border-b pb-5">
            <p className="font-semibold text-gray-900 mb-2">
              Isso afeta minha autorização de residência na AIMA?
            </p>
            <p className="text-gray-600 text-sm">
              Dívidas fiscais ativas podem ser usadas contra você em processos de renovação
              ou naturalização. Regularizar é sempre melhor do que ter uma dívida pendente
              no sistema da AT.
            </p>
          </div>

          <div className="pb-5">
            <p className="font-semibold text-gray-900 mb-2">
              Trabalho para empresa no Brasil e recebo em conta portuguesa. Preciso do Anexo J?
            </p>
            <p className="text-gray-600 text-sm">
              Depende. Se a empresa é brasileira e o serviço foi prestado de Portugal,
              pode ser rendimento estrangeiro mesmo que recebido aqui. Consulte um contabilista
              — este é exatamente o tipo de caso cinza que causa problemas.
            </p>
          </div>
        </div>

        {/* Autor */}
        <div className="border-t pt-8 mt-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#1F4E79] rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              C
            </div>
            <div>
              <p className="font-semibold text-gray-900">Caio — FreelancerPT</p>
              <p className="text-gray-500 text-sm mt-1">
                Desenvolvedor brasileiro em Lisboa, em recibos verdes há anos.
                Criei o FreelancerPT depois de levar um susto com o IRS que não estava a esperar.
                Este artigo é informativo e não substitui aconselhamento fiscal profissional.
              </p>
            </div>
          </div>
        </div>

        {/* CTA final */}
        <div className="text-center mt-12 py-8 border-t">
          <p className="text-gray-500 text-sm mb-4">
            Artigo útil? Partilhe com um brasileiro em Portugal que precisa saber disso.
          </p>
          <Link
            href="/"
            className="text-[#1F4E79] font-semibold hover:underline"
          >
            ← Voltar para o FreelancerPT
          </Link>
        </div>
      </article>
    </div>
  );
}
