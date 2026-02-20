# Ambiente Visível de Encomendas (Bling + Next.js)

Aplicativo interno para visualizar encomendas geradas no ERP Bling, com sincronização automática, filtros e painel de status.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Prisma ORM
- PostgreSQL (Neon, Vercel Postgres ou compatível)
- NextAuth (credenciais email/senha)
- TailwindCSS
- Vercel Cron

## Estrutura

```bash
/app
/components
/lib
/services
/prisma
/types
```

## 1) Configuração da API do Bling

1. Crie um app OAuth no Bling.
2. Obtenha `BLING_CLIENT_ID` e `BLING_CLIENT_SECRET`.
3. Configure no `.env`.

O serviço de integração está em `services/bling.service.ts` e:
- autentica na API do Bling
- busca pedidos de venda
- filtra apenas pedidos com código de rastreio
- trata erros de autenticação e de consumo da API

## 2) Configuração do banco de dados

1. Crie um banco PostgreSQL (Neon, Vercel Postgres, Supabase etc.).
2. Preencha `DATABASE_URL`.
3. Rode:

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
```

## 3) Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

```env
BLING_CLIENT_ID=
BLING_CLIENT_SECRET=
DATABASE_URL=
NEXTAUTH_SECRET=
CRON_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

## 4) Rodando localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000/login`.

### Criar usuário inicial

Faça um `POST` para `/api/auth/register`:

```json
{
  "email": "admin@empresa.com",
  "password": "123456"
}
```

## 5) Deploy na Vercel

1. Faça push para GitHub.
2. Importe o projeto na Vercel.
3. Configure as variáveis de ambiente.
4. Garanta que o banco está acessível externamente.
5. Rode uma migration em produção:

```bash
npx prisma migrate deploy
```

## 6) Ativando CRON

O cron já está configurado em `vercel.json` para rodar a cada 30 minutos:

- Path: `/api/sync`
- Schedule: `*/30 * * * *`

Recomendação: definir `CRON_SECRET` e enviar no header `Authorization: Bearer <CRON_SECRET>` para maior segurança.

## Endpoints principais

- `POST /api/auth/register` - cria usuário local
- `GET /api/shipments` - lista encomendas com filtros
- `POST /api/sync` - sincroniza pedidos (manual ou cron)

## Regras de atualização

- Atualização manual: sincroniza todos os pedidos com rastreio vindos do Bling.
- Atualização via cron: sincroniza apenas pedidos ainda não entregues.
