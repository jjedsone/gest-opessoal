# FinUnity — ERP de Gestão Financeira Pessoal

## Visão Geral

**FinUnity** é um ERP de gestão financeira pessoal desenvolvido para solteiros e casais, com auxílio de IA para sugestões de economia, planos de poupança e opções de investimento.

## Missão

Permitir controle financeiro diário simples, decisões conjuntas para casais e autonomia para solteiros — com auxílio de uma IA que sugere cortes, planos de poupança e opções de investimento.

## Público-Alvo

- **Pessoa solteira**: controle de receitas, despesas, metas individuais, "envelopes" (buckets) para poupança
- **Casal**: contas conjuntas + contas individuais, divisão automática de despesas, regras de "mesada" entre parceiros, metas compartilhadas
- **Modo família** (opcional): incluir dependentes, despesas dos filhos, organização por centro de custo

## Tecnologias

- **Frontend**: React + TypeScript (web) + React Native (mobile)
- **Backend**: Node.js + Express + TypeScript
- **Banco de dados**: PostgreSQL
- **Cache**: Redis
- **IA**: OpenAI / LLM local para chat e classificação de transações
- **Autenticação**: JWT + 2FA opcional

## Estrutura do Projeto

```
finunity/
├── frontend/          # Aplicação React
├── backend/           # API Node.js/Express
├── database/          # Migrations e schemas PostgreSQL
├── mobile/            # Aplicação React Native (futuro)
└── docs/              # Documentação
```

## Funcionalidades MVP ✅

- ✅ Cadastro de usuários e perfis (solteiro / casal)
- ✅ Conexão manual ou via importação de extratos CSV
- ✅ Registro rápido de receitas e despesas
- ✅ Painel com saldo geral, saldo por conta e saldo por pessoa
- ✅ Orçamentos mensais por categoria
- ✅ Metas de poupança (valor objetivo + prazo)
- ✅ Relatórios: resumo mensal, gráfico de fluxo de caixa, maiores gastos
- ✅ Exportar CSV / PDF
- ✅ Gráficos interativos de gastos por categoria
- ✅ Sistema de notificações inteligentes
- ✅ Sugestões da IA para economia e metas
- ✅ Divisão automática de contas para casais
- ✅ Regras personalizadas de divisão
- ✅ Central de ajuda e documentação

## Instalação

### Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- Redis 6+

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Licença

MIT

# gest-opessoal
