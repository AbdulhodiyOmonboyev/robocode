# CRM O'quv Markaz

## Monorepo structure (in progress — `refactor/split`)

This repository is being split into a standalone backend and frontend. The
existing Next.js app below keeps running unchanged during the migration.

```
.
├── backend/    Express API (port 4000)
├── frontend/   Vite + React app (port 5173)
└── ...         existing Next.js app (port 3000, unchanged)
```

### backend/ — Express API, port `4000`

```bash
cd backend
npm install
cp .env.example .env   # fill in DATABASE_URL / JWT_SECRET
npm start               # node src/server.js
```

Stack: Express, `@prisma/client` + `prisma`, `bcryptjs`, `jsonwebtoken`, `cors`,
`dotenv`, `zod`.

### frontend/ — Vite + React, port `5173`

```bash
cd frontend
npm install
npm run dev
```

Stack: Vite, React (JS), Tailwind CSS.

---

## Legacy Next.js app (port 3000)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
