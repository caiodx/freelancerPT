# FreelancerPT — Protótipo v0.1

Gestão fiscal para freelancers imigrantes em Portugal.

## Requisitos

- Node.js 18+
- npm 9+

## Como executar

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) no browser.

## Estrutura

```
freelancer-pt/
├── app/
│   ├── layout.tsx        → Layout raiz (metadados, fontes)
│   ├── page.tsx          → Landing page completa
│   └── globals.css       → Estilos globais + variáveis CSS (shadcn)
├── components/
│   ├── ui/               → Componentes shadcn/ui (Button, Card, Input, Switch...)
│   └── Calculadora.tsx   → Componente principal da calculadora fiscal
├── lib/
│   ├── calculos-fiscais.ts  → NÚCLEO: toda a lógica IVA/IRS/SS
│   └── utils.ts             → Utilitário cn() para Tailwind
└── public/               → Assets estáticos
```

## Próximos passos (Fase 1 — Semanas 1-2)

- [ ] Supabase: schema da base de dados (users, faturas, configuracoes_fiscais)
- [ ] Auth: magic link + Google OAuth via Supabase Auth
- [ ] Dashboard principal (após login)
- [ ] CRUD de faturas
- [ ] Alertas de prazo (cron + Resend)

## Stack

- **Next.js 14** (App Router + TypeScript)
- **shadcn/ui** + **Tailwind CSS**
- **Supabase** (auth + DB — a adicionar)
- **Resend** (emails — a adicionar)
- **LemonSqueezy** (pagamentos — a adicionar)
