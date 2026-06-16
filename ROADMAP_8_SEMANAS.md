# FreelancerPT — Plano de 8 Semanas

**Objectivo:** produto com pagamentos a funcionar em 8 semanas a partir de hoje (9 Jun 2026).  
**Launch date alvo:** 4 Ago 2026 — 16 dias antes do prazo IVA Q2 (20 Ago). Urgência real no mercado.

---

## Estado actual (já feito ✅)

- [x] Calculadora ao vivo (demo pública, sem login)
- [x] CofreFiscal visual (IVA / IRS / SS)
- [x] Landing page fear/gain (Hormozi style, números concretos)
- [x] Lógica fiscal 2026 (`calculos-fiscais.ts`)

---

## Semana 1 — Base de dados + schema
**9–15 Jun**

- [ ] Criar projeto Supabase (free tier)
- [ ] Schema SQL:
  - `users` (id, email, created_at, plano, trial_ends_at)
  - `faturas` (id, user_id, valor_base, data, cliente, notas)
  - `configuracoes_fiscais` (user_id, primeiro_ano, tem_retencao, isento_iva, regime)
  - `subscricoes` (user_id, lemonsqueezy_id, status, periodo)
- [ ] Row Level Security (RLS) — utilizador só vê os seus próprios dados
- [ ] `.env.local` com chaves Supabase
- [ ] Testar CRUD manual pelo Supabase Dashboard

**Entregável:** dados persistentes prontos para a app usar.

---

## Semana 2 — Autenticação
**16–22 Jun**

- [ ] Instalar `@supabase/auth-helpers-nextjs`
- [ ] Magic link (email → link → login automático)
- [ ] Google OAuth (um clique — maior conversão)
- [ ] Middleware Next.js: rotas `/dashboard/*` protegidas
- [ ] Wizard onboarding (5 perguntas rápidas):
  1. Primeiro ano de actividade? → isenção SS
  2. Faturação prevista >€15k/ano? → IVA obrigatório
  3. Tens retenção na fonte? → ajusta cálculo IRS
  4. Tipo de serviço (0.75 ou 0.35 coeficiente)?
  5. Qual o prazo IVA actual? → trimestral ou mensal

**Entregável:** utilizador consegue registar-se, fazer login e completar onboarding.

---

## Semana 3 — Dashboard base
**23–29 Jun**

- [ ] Layout dashboard: sidebar + header com avatar + logout
- [ ] Página `/dashboard` — CofreFiscal com dados reais do utilizador (props do Supabase)
- [ ] Página `/dashboard/faturas` — lista vazia com CTA "Adicionar fatura"
- [ ] Página `/dashboard/prazos` — calendário de prazos fiscais (IVA Q2 = 20 Ago em destaque)
- [ ] Banner trial: "X dias restantes do trial grátis"

**Entregável:** dashboard funcional visualmente, ainda sem CRUD.

---

## Semana 4 — CRUD de faturas
**30 Jun–6 Jul**

- [ ] Modal "Adicionar fatura": valor base + data + cliente (opcional)
- [ ] Ao adicionar: calcular IVA/IRS/SS usando `calculos-fiscais.ts` + guardar no Supabase
- [ ] CofreFiscal actualiza ao vivo com o total acumulado
- [ ] Editar / apagar fatura (soft delete)
- [ ] Resumo mensal: total faturado, total reservado, total disponível

**Entregável:** fluxo principal do produto a funcionar — adiciona fatura → cofre atualiza.

---

## Semana 5 — Alertas por email
**7–13 Jul**

- [ ] Instalar Resend (`npm install resend`)
- [ ] Vercel Cron Job: corre todos os dias às 8h00
- [ ] Lógica de alerta: D-30, D-7, D-1 antes de cada prazo fiscal
- [ ] Template email: "Faltam X dias para o IVA — tens €Y guardado de €Z necessários"
- [ ] Email de boas-vindas após onboarding
- [ ] Testar com caixa real

**Entregável:** utilizadores recebem emails de alerta antes dos prazos. Valor percebido imediato.

---

## Semana 6 — Pagamentos
**14–20 Jul**

- [ ] Conta LemonSqueezy + criar produto (€9/mês e €79/ano)
- [ ] Instalar SDK ou usar webhooks LemonSqueezy
- [ ] Webhook: `subscription.activated` → atualizar `subscricoes` no Supabase
- [ ] Webhook: `subscription.cancelled` → downgrade para free
- [ ] Paywall: após 14 dias trial, bloquear dashboard com modal de upgrade
- [ ] Página `/precos` com botões de compra diretos (LemonSqueezy checkout overlay)

**Entregável:** produto cobra dinheiro. Trial 14 dias sem cartão → conversão ao fim do trial.

---

## Semana 7 — Diferenciação + SEO
**21–27 Jul**

- [ ] **Glossário PT→BR**: componente contextual que mostra "IRS = IRPF", "Recibos verdes = MEI", etc.
  - Aparece no onboarding + tooltips no dashboard
  - Página pública `/glossario` (SEO gratuito)
- [ ] Artigo blog #1: "Fui notificado pela AT sobre o Anexo J — o que fazer?" (tráfego urgente)
- [ ] Artigo blog #2: "MEI em Portugal: o guia completo para brasileiros"
- [ ] Meta tags OG + sitemap.xml + robots.txt
- [ ] Verificar mobile responsiveness em iOS/Android

**Entregável:** diferenciador único no mercado + primeiros artigos a indexar.

---

## Semana 8 — Launch
**28 Jul–4 Ago**

- [ ] Testes end-to-end: registo → onboarding → fatura → alerta → pagamento
- [ ] Fix de bugs encontrados
- [ ] Sequência de email onboarding (3 emails: D+1, D+3, D+7 do trial)
- [ ] Postar nos grupos Facebook "Brasileiros em Portugal" com calculadora gratuita como isco
- [ ] Product Hunt launch (terça-feira = melhor dia)
- [ ] Post Twitter/X "Building in public — lancei o FreelancerPT"
- [ ] Monitorizar primeiros utilizadores e responder a feedback em <24h

**Entregável:** produto público com primeiros utilizadores pagantes.

---

## O que fica para depois do launch

Estas features NÃO entram nas 8 semanas — adicionam valor mas não são necessárias para cobrar:

| Feature | Quando adicionar |
|---|---|
| Sync InvoiceXpress | Mês 2-3 (após validar produto) |
| Relatório AIMA | Mês 2 (feature paga, €9 avulso) |
| Wizard primeiro ano | Mês 2 (melhoria do onboarding) |
| Alerta limiar €15k | Mês 1-2 (quick win) |
| Open Banking PSD2 | Mês 4+ (complexidade alta) |
| Assistente fiscal IA | Mês 4+ (depende de tração) |

---

## Métricas de sucesso às 8 semanas

| Indicador | Meta |
|---|---|
| Utilizadores registados | ≥ 100 |
| Trials activos | ≥ 50 |
| Pagantes | ≥ 20 |
| MRR | ≥ €180 |
| Artigos publicados | 2 |

---

## Ritmo semanal sugerido

- **Seg–Sex (9h-18h):** trabalho principal (OSKONTECH)
- **Noites (19h-22h, 3×/semana):** 3h de desenvolvimento FreelancerPT
- **Sábado:** 4-5h bloco focado
- **Total/semana:** ~14h → suficiente para cada semana deste plano

> A IA (Claude) faz o scaffolding, boilerplate e debug — o Caio toma decisões de produto e testa. Velocidade real ~2-3× maior do que sem IA.
